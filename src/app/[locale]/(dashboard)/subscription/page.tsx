"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDashboard } from "../layout";
import { SubscriptionModule } from "@/framework/components/subscription/subscription";
import { fetchAuthed } from "@/lib/firebase/client";

export default function SubscriptionPage() {
  const { dbData, showToast, refreshClaims } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const checkoutStatus = searchParams.get("checkout");

  const isCancel = checkoutStatus === "cancel";
  const isSuccess = checkoutStatus === "success" || !!sessionId;

  // Inizializzazione pigra dello stato per evitare di farlo in un useEffect
  const [syncingClaims, setSyncingClaims] = useState(() => {
    if (typeof window === "undefined") return false;
    if (isSuccess && sessionId) {
      const cacheKey = `processed_stripe_session_${sessionId}`;
      const alreadyProcessed = sessionStorage.getItem(cacheKey);
      return !alreadyProcessed;
    }
    return false;
  });

  // Stato per mostrare il pulsante di sblocco emergenza dopo 5 secondi
  const [showEmergencyUnlock, setShowEmergencyUnlock] = useState(false);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;
  const organizationId = activeOrg?.orgId;
  const activeOrgName = activeOrg?.name;

  // Estrae i seats dalle subscriptions attive dell'organizzazione
  const serviceSeatsOnOrg: Array<{ service: { serviceId: string }; user: { uid: string } }> = [];
  const subs = activeOrg?.subscriptions_on_organization || [];
  for (const sub of subs) {
    if ((sub.status === "active" || sub.status === "trialing") && sub.service) {
      const assigned = Array.isArray(sub.assignedSeats) ? (sub.assignedSeats as Array<{ uid: string }>) : [];
      for (const seat of assigned) {
        if (seat && typeof seat === "object" && "uid" in seat) {
          serviceSeatsOnOrg.push({
            service: { serviceId: sub.service.serviceId },
            user: { uid: seat.uid }
          });
        }
      }
    }
  }

  const handleListMembersByOrg = useCallback(async (orgId: string) => {
    const { dataConnect } = await import("@/lib/firebase/client");
    const { listMembersByOrg: sdkListMembersByOrg } = await import("@/lib/dataconnect-client");
    const memRes = await sdkListMembersByOrg(dataConnect, { orgId });
    return (memRes.data.userOrganizations || []).map((mo) => ({
      role: mo.role,
      joinedAt: mo.joinedAt,
      user: mo.user ? {
        uid: mo.user.uid,
        email: mo.user.email,
        fullName: mo.user.fullName,
        avatarUrl: mo.user.avatarUrl
      } : null
    }));
  }, []);

  const syncStartedRef = useRef(false);
  const attemptsRef = useRef(0);

  // 1. Gestione del Cancel Flow
  useEffect(() => {
    if (isCancel) {
      showToast("Pagamento annullato. Nessun abbonamento è stato attivato.", "info");
      router.replace(window.location.pathname);
    }
  }, [isCancel, router, showToast]);

  // 2. Controllo per ripulire l'URL se la sessione Stripe è già stata elaborata
  useEffect(() => {
    if (isSuccess && sessionId) {
      const cacheKey = `processed_stripe_session_${sessionId}`;
      const alreadyProcessed = sessionStorage.getItem(cacheKey);
      if (alreadyProcessed) {
        router.replace(window.location.pathname);
      }
    }
  }, [isSuccess, sessionId, router]);

  // 3. Polling per claims e database sync
  useEffect(() => {
    if (!syncingClaims || !organizationId || syncStartedRef.current) return;
    syncStartedRef.current = true;

    const maxAttempts = 5;
    let active = true;
    let timerId: NodeJS.Timeout | null = null;
    let emergencyTimerId: NodeJS.Timeout | null = null;

    // Timer per mostrare il pulsante di sblocco emergenza dopo 5 secondi
    emergencyTimerId = setTimeout(() => {
      if (active) {
        setShowEmergencyUnlock(true);
      }
    }, 5000);

    const pollClaims = async () => {
      if (!active) return;
      try {
        console.log(`[Checkout Sync] Esecuzione refreshClaims (tentativo ${attemptsRef.current + 1}/${maxAttempts})...`);
        await refreshClaims(organizationId);
        attemptsRef.current++;

        if (!active) return;

        if (attemptsRef.current >= maxAttempts) {
          setSyncingClaims(false);
          setShowEmergencyUnlock(false);
          showToast(
            "L'attivazione sta richiedendo più tempo del previsto. L'operazione proseguirà in background. Ricarica la pagina tra un minuto.",
            "info"
          );
          if (sessionId) {
            sessionStorage.setItem(`processed_stripe_session_${sessionId}`, "true");
          }
          router.replace(window.location.pathname);
        } else {
          timerId = setTimeout(pollClaims, 2500);
        }
      } catch (err) {
        console.error("[Checkout Sync] Errore durante il refresh dei claims:", err);
        if (active) {
          setSyncingClaims(false);
          setShowEmergencyUnlock(false);
          showToast("Errore durante la sincronizzazione. Prova a ricaricare la pagina.", "error");
        }
      }
    };

    timerId = setTimeout(pollClaims, 1000);

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
      if (emergencyTimerId) clearTimeout(emergencyTimerId);
    };
  }, [syncingClaims, organizationId, refreshClaims, router, showToast, sessionId]);

  // 4. Sblocco Immediato se compare l'abbonamento attivo o in prova
  const hasActiveSub = subs.some((sub) => sub.status === "active" || sub.status === "trialing");
  useEffect(() => {
    if (syncingClaims && hasActiveSub) {
      console.log("[Checkout Sync] Rilevato abbonamento attivo o trialing a DB. Sblocco immediato!");
      
      const timer = setTimeout(() => {
        setSyncingClaims(false);
        setShowEmergencyUnlock(false);
        showToast("Abbonamento attivato con successo!", "success");
        if (sessionId) {
          sessionStorage.setItem(`processed_stripe_session_${sessionId}`, "true");
        }
        router.replace(window.location.pathname);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [syncingClaims, hasActiveSub, router, showToast, sessionId]);

  const handleEmergencyUnlock = () => {
    setSyncingClaims(false);
    setShowEmergencyUnlock(false);
    showToast("Caricamento interrotto. I dati verranno aggiornati in background.", "info");
    if (sessionId) {
      sessionStorage.setItem(`processed_stripe_session_${sessionId}`, "true");
    }
    router.replace(window.location.pathname);
  };

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
          <h3 className="text-lg font-bold font-sans">Configurazione in corso...</h3>
          <p className="text-sm text-slate-400 max-w-xs text-center mt-2 leading-relaxed font-sans">
            Stiamo attivando i servizi associati al tuo abbonamento. Questo richiederà solo pochi istanti.
          </p>
          {showEmergencyUnlock && (
            <button
              onClick={handleEmergencyUnlock}
              className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors duration-200 font-sans"
            >
              Continua comunque
            </button>
          )}
        </div>
      )}
      <SubscriptionModule
        key={syncingClaims ? "syncing" : "idle"}
        organizationId={organizationId}
        activeRole={activeRole}
        activeOrgName={activeOrgName}
        serviceSeatsOnOrg={serviceSeatsOnOrg}
        fetchAuthed={fetchAuthed}
        showToast={showToast}
        listMembersByOrg={handleListMembersByOrg}
      />
    </>
  );
}
