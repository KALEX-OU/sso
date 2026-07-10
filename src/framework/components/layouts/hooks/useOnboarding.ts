"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import type { CustomClaims } from "@/framework/lib/types";

// E4.3b — Hook estratto meccanicamente da layouts.tsx: gestione dello stato di
// autenticazione/redirect e del polling dell'onboarding (stato "pending" con retry ogni
// 3 secondi finché il backend non completa la configurazione), più il trigger di refresh
// dei claims quando l'utente è loggato ma senza organizzazione nei claims.
// Il messaggio di onboarding vive in useClaimsSync (è scritto da fetchAndSyncUserData).

interface UseOnboardingParams {
  appId: string;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  authClaims: CustomClaims | null;
  pathname: string;
  router: ReturnType<typeof useRouter>;
  loginRedirect: (clientId: string) => void;
  /** Sincronizza i dati anagrafici; ritorna true se l'onboarding è ancora "pending" */
  fetchAndSyncUserData: () => Promise<boolean>;
  refreshClaims: (targetOrgId?: string) => Promise<void>;
  /** Contatore tentativi di refresh claims (posseduto da useClaimsSync) */
  refreshAttemptsRef: RefObject<number>;
}

export interface OnboardingState {
  loading: boolean;
  isRedirecting: boolean;
  onboardingPending: boolean;
}

export function useOnboarding({
  appId,
  firebaseUser,
  authLoading,
  authClaims,
  pathname,
  router,
  loginRedirect,
  fetchAndSyncUserData,
  refreshClaims,
  refreshAttemptsRef
}: UseOnboardingParams): OnboardingState {
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [onboardingPending, setOnboardingPending] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Gestione stato di autenticazione, reindirizzamenti e polling dell'onboarding
  useEffect(() => {
    if (authLoading) return;

    let redirectTimer: NodeJS.Timeout | null = null;

    if (!firebaseUser) {
      Promise.resolve().then(() => {
        setOnboardingPending(false);
        setLoading(false);
        setIsRedirecting(true);
      });
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      // Reindirizza al login se non autenticato con transizione fluida
      const locale = pathname.split("/")[1] || "en";
      redirectTimer = setTimeout(() => {
        if (appId === "sso") {
          router.push(`/${locale}/auth`);
        } else {
          loginRedirect(appId);
        }
      }, 300);
      return;
    }

    const initUserData = async () => {
      try {
        const isPending = await fetchAndSyncUserData();

        if (isPending) {
          setOnboardingPending(true);

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          // Polling ogni 3 secondi finché l'onboarding non è completato in background
          const intervalId = setInterval(async () => {
            const stillPending = await fetchAndSyncUserData();
            if (!stillPending) {
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              setOnboardingPending(false);
              refreshAttemptsRef.current = 0;
              await refreshClaims();
            }
          }, 3000);

          pollingIntervalRef.current = intervalId;
        }
      } catch (err) {
        console.error("[Layout Init] Errore inizializzazione:", err);
      } finally {
        setLoading(false);
      }
    };

    void initUserData();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [firebaseUser, authLoading, fetchAndSyncUserData, refreshClaims, refreshAttemptsRef, pathname, router, appId, loginRedirect]);

  // Innesca il refresh se l'utente è loggato ma non ha claims associati a un'organizzazione
  useEffect(() => {
    if (!loading && firebaseUser && authClaims && !authClaims.orgId && !onboardingPending) {
      const timer = setTimeout(() => {
        void refreshClaims();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [firebaseUser, authClaims, onboardingPending, loading, refreshClaims]);

  return { loading, isRedirecting, onboardingPending };
}
