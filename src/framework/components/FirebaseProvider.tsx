"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { onAuthStateChanged, setPersistence, inMemoryPersistence, signInWithCustomToken } from "firebase/auth";
import { auth, useAuth } from "../lib/auth";
import { fetchAuthedClient } from "../lib/api";
import { Spinner } from "./ui/Spinner";

const emptySubscribe = () => () => {};

export interface FirebaseProviderProps {
  children: React.ReactNode;
  clientId?: string; // Se fornito, gestisce lo scambio di codice SSO automatico (es. "web")
}

export default function FirebaseProvider({ children, clientId }: FirebaseProviderProps) {
  const { loading } = useAuth();
  const [initLoading, setInitLoading] = useState(true);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Helper resiliente per recuperare il client token con tentativi multipli e backoff
  const fetchClientTokenWithRetry = async (retries = 3, delay = 500): Promise<{ success: boolean; customToken?: string }> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          throw new Error("Rete momentaneamente offline.");
        }
        
        const response = await fetchAuthedClient<{ success: boolean; customToken: string }>("/api/auth/client-token", {
          method: "POST"
        });
        
        if (response.success && response.data) {
          return { success: true, customToken: response.data.customToken };
        }
        
        // Se la sessione è scaduta o revocata (401), non riproviamo
        if (response.error?.message?.includes("scadut") || response.error?.message?.includes("valida")) {
          return { success: false };
        }
        
        if (attempt < retries) {
          console.warn(`[FirebaseProvider] Tentativo ${attempt} fallito. Riprovo tra ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Backoff esponenziale leggero
          continue;
        }
        return { success: false };
      } catch (err) {
        if (attempt < retries) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`[FirebaseProvider] Tentativo ${attempt} fallito causa errore (${errMsg}). Riprovo tra ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        throw err;
      }
    }
    throw new Error("Impossibile recuperare il client token dopo tutti i tentativi.");
  };

  // Inizializza la persistenza in memory ed esegue il sync all'avvio se è presente il cookie
  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        await setPersistence(auth, inMemoryPersistence);
        
        if (!auth.currentUser && active) {
          // Tenta la sincronizzazione iniziale con retry resiliente
          try {
            const res = await fetchClientTokenWithRetry();
            if (res.success && res.customToken && active) {
              await signInWithCustomToken(auth, res.customToken);
            }
          } catch (err) {
            console.warn("[FirebaseProvider] Impossibile recuperare il client token iniziale:", err);
          }
        }
      } catch (err) {
        console.error("[FirebaseProvider] Errore inizializzazione Auth:", err);
      } finally {
        if (active) setInitLoading(false);
      }
    };

    void initAuth();
    return () => {
      active = false;
    };
  }, []);

  // Listener dello stato di autenticazione, Refresh periodico e Gestione offline
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {});

    // Configura il timer di auto-refresh del token client (ogni 45 minuti)
    const refreshInterval = setInterval(async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        console.log("[FirebaseProvider] Browser offline, rinvio il refresh del client token.");
        return;
      }

      if (auth.currentUser) {
        try {
          console.log("[FirebaseProvider] Eseguo il refresh periodico del client token...");
          const response = await fetchClientTokenWithRetry();
          if (response.success && response.customToken) {
            await signInWithCustomToken(auth, response.customToken);
            console.log("[FirebaseProvider] Client token rinfrescato in memoria.");
          } else {
            // Se non riusciamo ad ottenere un token e la sessione è marcata come non valida/scaduta, sologghiamo il client
            await auth.signOut();
          }
        } catch (err) {
          console.warn("[FirebaseProvider] Errore durante il refresh del client token:", err);
        }
      }
    }, 45 * 60 * 1000); // 45 minuti

    // Listener per il ripristino della rete: se eravamo offline, sincronizza subito il token
    const handleOnline = async () => {
      console.log("[FirebaseProvider] Connessione ripristinata. Tento la sincronizzazione del client token...");
      if (auth.currentUser) {
        try {
          const response = await fetchClientTokenWithRetry();
          if (response.success && response.customToken) {
            await signInWithCustomToken(auth, response.customToken);
            console.log("[FirebaseProvider] Client token sincronizzato dopo ripristino rete.");
          } else {
            await auth.signOut();
          }
        } catch (err) {
          console.warn("[FirebaseProvider] Errore sincronizzazione client token dopo ripristino rete:", err);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
    }

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
      }
    };
  }, []);

  // Gestione scambio codice SSO se presente nell'URL (se clientId è fornito)
  useEffect(() => {
    if (!isMounted || !clientId) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Pulisce l'URL immediatamente prima dello scambio di rete
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("code");
      currentUrl.searchParams.delete("state");
      window.history.replaceState({}, document.title, currentUrl.pathname + currentUrl.search);

      const redirectUri = currentUrl.toString();

      const handleTokenExchange = async () => {
        setExchangeLoading(true);
        setExchangeError(null);
        try {
          const response = await fetchAuthedClient<{ success: boolean; customToken: string }>("/api/auth/token", {
            method: "POST",
            body: JSON.stringify({
              code,
              clientId,
              redirectUri
            })
          });

          if (response.success && response.data?.customToken) {
            await signInWithCustomToken(auth, response.data.customToken);
          } else {
            const errorMsg = response.error?.message || "Impossibile completare lo scambio del codice SSO.";
            const correlationId = (response.error?.details as { correlationId?: string })?.correlationId;
            setExchangeError(correlationId ? `${errorMsg} (Correlation ID: ${correlationId})` : errorMsg);
          }
        } catch (err) {
          console.error("[SSO Callback] Errore scambio token:", err);
          setExchangeError("Errore di rete durante lo scambio del codice SSO.");
        } finally {
          setExchangeLoading(false);
        }
      };

      void handleTokenExchange();
    }
  }, [isMounted, clientId]);

  const isLoading = loading || initLoading || exchangeLoading;

  if (isMounted && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4 gap-4">
        <Spinner size="lg" color="current" />
        <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase animate-pulse">
          {exchangeLoading ? "Sincronizzazione sessione SSO in corso..." : "Caricamento sessione in corso..."}
        </span>
        {exchangeError && (
          <div className="mt-4 p-3 bg-danger-500/10 border border-danger-500/20 text-danger text-xs rounded-xl text-center max-w-sm">
            {exchangeError}
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
