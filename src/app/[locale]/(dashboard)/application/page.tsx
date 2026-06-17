"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDashboard } from "../layout";
import { ServiceModule } from "@/framework/components/service/service";
import { fetchAuthed } from "@/lib/firebase/client";

export default function ApplicationPage() {
  const { dbData, showToast, claims, refreshClaims } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const hasSessionId = searchParams.get("session_id");
  const isSuccess = searchParams.get("checkout") === "success" || searchParams.get("checkout_success") === "true";
  const shouldSync = !!(hasSessionId || isSuccess);

  const [syncingClaims, setSyncingClaims] = useState(shouldSync);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;
  const organizationId = activeOrg?.orgId;

  // 1. Log dei claims della sessione attiva
  useEffect(() => {
    if (claims) {
      console.log("Session Custom Claims:", claims);
    }
  }, [claims]);

  // 2. Intercettazione e polling per sincronizzare i claims post-checkout
  useEffect(() => {
    if (shouldSync) {
      let attempts = 0;
      const maxAttempts = 5;

      const pollClaims = async () => {
        try {
          console.log(`[Checkout Sync] Esecuzione refreshClaims (tentativo ${attempts + 1}/${maxAttempts})...`);
          await refreshClaims(organizationId);
          attempts++;

          if (attempts >= maxAttempts) {
            setSyncingClaims(false);
            showToast("Sincronizzazione completata! Verifica lo stato dell'applicazione.", "success");
            // Rimuoviamo i query parameters dall'URL per evitare refresh infiniti
            router.replace(window.location.pathname);
          } else {
            setTimeout(pollClaims, 2500);
          }
        } catch (err) {
          console.error("[Checkout Sync] Errore durante il refresh dei claims:", err);
          setSyncingClaims(false);
          showToast("Errore durante la sincronizzazione. Prova a ricaricare la pagina.", "error");
        }
      };

      // Avvia polling dopo 1 secondo per dare tempo a Stripe webhook di completare l'elaborazione in background
      const timer = setTimeout(pollClaims, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldSync, refreshClaims, organizationId, router, showToast]);

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Nessuna organizzazione selezionata o in corso di caricamento...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {syncingClaims && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white">
          <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></span>
          <h3 className="text-lg font-bold">Configurazione in corso...</h3>
          <p className="text-sm text-slate-400 max-w-xs text-center mt-2 leading-relaxed">
            Stiamo attivando i servizi associati al tuo abbonamento. Questo richiederà solo pochi istanti.
          </p>
        </div>
      )}
      <ServiceModule
        organizationId={organizationId}
        activeRole={activeRole}
        fetchAuthed={fetchAuthed}
        showToast={showToast}
      />
    </>
  );
}
