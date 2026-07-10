"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { fetchAuthedClient } from "@/framework/lib/api";
import { dashboardResponseSchema, refreshClaimsResponseSchema } from "@/framework/lib/schemas";
import type { DashboardData, RefreshClaimsResponse } from "@/framework/lib/types";
import type { UIStrings } from "@/framework/lib/ui.localization";

// E4.3b — Hook estratto meccanicamente da layouts.tsx: refresh dei custom claims con
// retry/ref (isRefreshingRef, refreshAttemptsRef) e sincronizzazione dei dati anagrafici
// dal backend (/api/auth/dashboard). Possiede anche lo stato `dbData`/`error` e il
// messaggio di onboarding (impostato da fetchAndSyncUserData quando lo stato è "pending"),
// perché sono scritti dalle stesse callback: useOnboarding li consuma via composizione
// in DashboardLayout (evita dipendenze circolari tra i due hook).

interface UseClaimsSyncParams {
  /** Ref alle stringhe UI correnti (aggiornato in useEffect dal layout) */
  sRef: RefObject<UIStrings>;
}

export interface ClaimsSyncApi {
  dbData: DashboardData | null;
  error: string;
  setError: (msg: string) => void;
  onboardingMessage: string;
  /** Sincronizza i dati anagrafici; ritorna true se l'onboarding è ancora "pending" */
  fetchAndSyncUserData: () => Promise<boolean>;
  refreshClaims: (targetOrgId?: string) => Promise<void>;
  /** Contatore tentativi di refresh: azzerato dal polling onboarding al completamento */
  refreshAttemptsRef: RefObject<number>;
}

export function useClaimsSync({ sRef }: UseClaimsSyncParams): ClaimsSyncApi {
  const [dbData, setDbData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [onboardingMessage, setOnboardingMessage] = useState("");

  const isRefreshingRef = useRef(false);
  const refreshAttemptsRef = useRef(0);

  // Sincronizza i dati anagrafici dal backend /api/auth/dashboard
  const fetchAndSyncUserData = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetchAuthedClient<DashboardData>("/api/auth/dashboard", undefined, {
        // Guard minimo: verifica che la risposta sia un oggetto (non stringa/array/null propagati
        // come dato), poi restituisce il payload grezzo tipizzato come DashboardData (contratto lasco).
        validate: (raw): DashboardData => {
          dashboardResponseSchema.parse(raw);
          return raw as DashboardData;
        }
      });

      if (res.success && res.data) {
        const data = res.data;
        if (data.status === "pending") {
          setOnboardingMessage(data.message || sRef.current.layout.onboardingInProgress);
          return true;
        }
        setDbData(data);
        return false;
      }

      if (res.error?.code === "api/invalid-response") {
        console.error("[Layout Load User Data] Risposta dashboard non conforme allo schema:", res.error.details);
        setError(sRef.current.layout.invalidServerData);
      }

      return false;
    } catch (err) {
      console.error("[Layout Load User Data] Errore caricamento:", err);
      return false;
    }
  }, [sRef]);

  // Esegue il refresh dei custom claims dell'utente (dopo onboarding o cambio organizzazione)
  const refreshClaims = useCallback(async (targetOrgId?: string) => {
    if (isRefreshingRef.current) return;

    if (refreshAttemptsRef.current >= 3) {
      console.warn("[Layout Claims Refresh] Raggiunto limite tentativi. Onboarding incompleto.");
      setError(sRef.current.layout.claimsAlignError);
      return;
    }

    isRefreshingRef.current = true;
    refreshAttemptsRef.current++;

    try {
      const res = await fetchAuthedClient<RefreshClaimsResponse>("/api/auth/claims/refresh", {
        method: "POST",
        body: JSON.stringify({ orgId: targetOrgId })
      }, {
        validate: (raw): RefreshClaimsResponse => refreshClaimsResponseSchema.parse(raw)
      });

      if (res.error?.code === "api/invalid-response") {
        console.warn("[Layout Claims Refresh] Risposta non conforme allo schema:", res.error.details);
      }

      if (res.success && res.data?.success) {
        // Forza il refresh del token Firebase a livello client per recepire i nuovi claims
        const { auth, forceCleanSession } = await import("@/framework/lib/auth");
        if (auth.currentUser) {
          try {
            await auth.currentUser.getIdTokenResult(true);
            refreshAttemptsRef.current = 0; // Reset
          } catch (tokenErr) {
            console.warn("[Layout Claims Refresh] Token revocato o scaduto durante il refresh dei claims:", tokenErr);
            const authErr = tokenErr as { code?: string };
            if (authErr.code === "auth/user-token-expired" || authErr.code === "auth/token-expired" || authErr.code === "auth/requires-recent-login") {
              void forceCleanSession();
              return;
            }
            throw tokenErr;
          }
        }
        await fetchAndSyncUserData();
      }
    } catch (err) {
      console.error("[Layout Claims Refresh] Errore:", err);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [fetchAndSyncUserData, sRef]);

  return {
    dbData,
    error,
    setError,
    onboardingMessage,
    fetchAndSyncUserData,
    refreshClaims,
    refreshAttemptsRef
  };
}
