"use client";

import React, { useState, useEffect, useSyncExternalStore, useCallback, useRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProviderClient } from "@/locales/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, useAuth } from "../../lib/auth";
import { fetchAuthedClient } from "../../lib/api";
import { Spinner } from "../ui/Spinner";
import { RateLimitGuard } from "../RateLimitGuard";

// Suppress the React 19 false-positive warning for inline script tags rendered by NextThemesProvider
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    origError.apply(console, args);
  };
}

const emptySubscribe = () => () => {};

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  appId: "sso" | "web" | string;
}

interface ClientTokenResult {
  success: boolean;
  customToken?: string;
  isRateLimited?: boolean;
}

// ---------------------------------------------------------
// INNER COMPONENT: FirebaseProvider
// ---------------------------------------------------------
function FirebaseProvider({ children, appId }: { children: React.ReactNode; appId: string }) {
  const { loading } = useAuth();
  const [initLoading, setInitLoading] = useState(true);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [, setUser] = useState<User | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const activeRef = useRef(true);
  const isOnlineRef = useRef(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Helper resiliente per recuperare il client token con tentativi multipli e backoff
  const fetchClientTokenWithRetry = useCallback(async (retries = 3, delay = 500): Promise<ClientTokenResult> => {
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

        // Se l'errore è dovuto a rate limiting, interrompiamo i tentativi
        if (response.error?.code === "auth/rate-limited" || response.error?.message?.includes("Too Many Requests")) {
          return { success: false, isRateLimited: true };
        }
        
        // Se la sessione è scaduta o revocata (401), non riproviamo
        if (response.error?.message?.includes("scadut") || response.error?.message?.includes("valida")) {
          return { success: false };
        }
        
        if (attempt < retries) {
          console.warn(`[FirebaseProvider] Tentativo ${attempt} fallito. Riprovo tra ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
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
    return { success: false };
  }, []);

  // Inizializzazione Auth definita come useCallback per poterla ri-invocare nel retry di RateLimitGuard
  const initAuth = useCallback(async (active: { current: boolean }) => {
    try {
      const { setPersistence, inMemoryPersistence, signInWithCustomToken } = await import("firebase/auth");
      await setPersistence(auth, inMemoryPersistence);

      if (!auth.currentUser && active.current) {
        // Tenta la sincronizzazione iniziale con retry resiliente
        try {
          const res = await fetchClientTokenWithRetry();
          if (res.success && res.customToken && active.current) {
            await signInWithCustomToken(auth, res.customToken);
          } else if (res.isRateLimited && active.current) {
            setRateLimited(true);
          }
        } catch (err) {
          console.warn("[FirebaseProvider] Impossibile recuperare il client token iniziale:", err);
        }
      }
    } catch (err) {
      console.error("[FirebaseProvider] Errore inizializzazione Auth:", err);
    } finally {
      if (active.current) setInitLoading(false);
    }
  }, [fetchClientTokenWithRetry]);

  // Inizializza la persistenza in memory ed esegue il sync all'avvio
  useEffect(() => {
    activeRef.current = true;
    
    const timer = setTimeout(() => {
      void initAuth(activeRef);
    }, 500);

    return () => {
      activeRef.current = false;
      clearTimeout(timer);
    };
  }, [initAuth]);

  // Configura il timer di auto-refresh del token client (ogni 45 minuti) ed ascolta offline/online
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        console.log("[FirebaseProvider] Browser offline, rinvio il refresh del client token.");
        return;
      }

      if (auth.currentUser) {
        try {
          const { signInWithCustomToken } = await import("firebase/auth");
          const response = await fetchClientTokenWithRetry();
          if (response.success && response.customToken) {
            await signInWithCustomToken(auth, response.customToken);
            console.log("[FirebaseProvider] Client token rinfrescato in memoria.");
          } else if (response.isRateLimited) {
            setRateLimited(true);
          } else {
            // Se fallisce il refresh (sessione scaduta o revocata), disconnetti il client
            await auth.signOut();
          }
        } catch (err) {
          console.warn("[FirebaseProvider] Errore durante il refresh del client token:", err);
        }
      }
    }, 45 * 60 * 1000); // 45 minuti

    // Listener per il ripristino della rete: se eravamo offline, sincronizza subito il token
    const handleOnline = async () => {
      isOnlineRef.current = true;
      console.log("[FirebaseProvider] Connessione ripristinata. Tento la sincronizzazione del client token...");
      if (auth.currentUser) {
        try {
          const { signInWithCustomToken } = await import("firebase/auth");
          const response = await fetchClientTokenWithRetry();
          if (response.success && response.customToken) {
            await signInWithCustomToken(auth, response.customToken);
            console.log("[FirebaseProvider] Client token sincronizzato dopo ripristino rete.");
          } else if (response.isRateLimited) {
            setRateLimited(true);
          } else {
            await auth.signOut();
          }
        } catch (err) {
          console.warn("[FirebaseProvider] Errore sincronizzazione client token dopo ripristino rete:", err);
        }
      }
    };

    const handleOffline = () => {
      isOnlineRef.current = false;
      console.log("[FirebaseProvider] Browser offline.");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      clearInterval(refreshInterval);
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, [fetchClientTokenWithRetry]);

  // Listener dello stato di autenticazione locale per reattività React
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Listener del BroadcastChannel per sincronizzare il logout/login multi-tab
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel("kalex_auth_sync");
    
    channel.onmessage = async (event) => {
      if (event.data === "logout") {
        console.log("[BroadcastChannel] Ricevuto evento logout da un altro tab, disconnetto...");
        await auth.signOut();
        window.location.reload();
      } else if (event.data === "login") {
        console.log("[BroadcastChannel] Ricevuto evento login da un altro tab, rinfresco la sessione...");
        window.location.reload();
      }
    };
    
    return () => {
      channel.close();
    };
  }, []);

  // Gestione scambio codice SSO (per tutti i client tranne il provider "sso" stesso)
  useEffect(() => {
    if (!isMounted || appId === "sso") return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

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
          // Convalida CSRF dello state token memorizzato
          const storedState = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("sso_auth_state") : null;
          
          if (storedState && state !== storedState) {
            console.error("[SSO Callback] Rilevato potenziale attacco CSRF: gli state non corrispondono.");
            setExchangeError("Errore di convalida della sessione (CSRF Blocked).");
            setExchangeLoading(false);
            return;
          }

          // Pulisce lo state consumato
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.removeItem("sso_auth_state");
          }

          const response = await fetchAuthedClient<{ success: boolean; customToken: string }>("/api/auth/token", {
            method: "POST",
            body: JSON.stringify({
              code,
              clientId: appId,
              redirectUri
            })
          });

          if (response.success && response.data?.customToken) {
            const { signInWithCustomToken } = await import("firebase/auth");
            await signInWithCustomToken(auth, response.data.customToken);

            // Invia segnale a tutte le altre schede aperte del completamento login
            if (typeof window !== "undefined" && "BroadcastChannel" in window) {
              const channel = new BroadcastChannel("kalex_auth_sync");
              channel.postMessage("login");
              channel.close();
            }
          } else {
            const errorMsg = response.error?.message || "Impossibile completare lo scambio del codice SSO.";
            const correlationId = (response.error?.details as { correlationId?: string })?.correlationId;
            setExchangeError(correlationId ? `${errorMsg} (Correlation ID: ${correlationId})` : errorMsg);
            // Forza il logout per evitare sessioni parziali/invalide
            await auth.signOut();
          }
        } catch (err) {
          console.error("[SSO Callback] Errore scambio token:", err);
          setExchangeError("Errore di rete durante lo scambio del codice SSO.");
          await auth.signOut();
        } finally {
          setExchangeLoading(false);
        }
      };

      void handleTokenExchange();
    }
  }, [isMounted, appId]);

  if (rateLimited) {
    return (
      <RateLimitGuard
        onRetry={async () => {
          setRateLimited(false);
          setInitLoading(true);
          activeRef.current = true;
          await initAuth(activeRef);
        }}
      />
    );
  }

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

// ---------------------------------------------------------
// EXPORTED DEFAULT COMPONENT: Providers
// ---------------------------------------------------------
export default function Providers({ children, locale, appId }: ProvidersProps) {
  return (
    <I18nProviderClient locale={locale}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <FirebaseProvider appId={appId}>
          {children}
        </FirebaseProvider>
      </NextThemesProvider>
    </I18nProviderClient>
  );
}
