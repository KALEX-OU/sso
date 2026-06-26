"use client";

import React, { useState, useEffect, useSyncExternalStore, useCallback, useRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProviderClient } from "@/locales/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, useAuth } from "../../lib/auth";
import { fetchAuthedClient } from "../../lib/api";
import { Spinner } from "../ui/Spinner";
import { Button } from "@heroui/react";
import { ShieldAlert, RefreshCw, ArrowLeft } from "lucide-react";

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

// ---------------------------------------------------------
// INNER COMPONENT: RateLimitGuard
// ---------------------------------------------------------
interface RateLimitGuardProps {
  onRetry: () => void | Promise<void>;
  initialCountdown?: number;
}

function RateLimitGuard({ onRetry, initialCountdown = 5 }: RateLimitGuardProps) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleRetry = async () => {
    if (countdown > 0 || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error("[RateLimitGuard] Errore durante il ripristino:", err);
      setCountdown(initialCountdown);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-6 text-center select-none relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full filter blur-[100px] md:blur-[150px] pointer-events-none bg-purple-500/10 transition-all duration-700"></div>
      
      <div className="relative z-10 max-w-md w-full p-8 border border-white/10 bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto border border-purple-500/30 animate-pulse">
          <ShieldAlert className="w-8 h-8 text-purple-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Richieste Troppo Rapide
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed font-semibold">
            Hai eseguito troppi aggiornamenti della pagina in un breve intervallo di tempo. Per garantire la stabilità del servizio, le richieste frequenti sono momentaneamente limitate.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed font-medium">
            Ti consigliamo di navigare all&apos;interno dell&apos;applicazione usando i menu e i link interni senza ricaricare l&apos;intera pagina.
          </p>
        </div>

        {countdown > 0 ? (
          <div className="py-2 px-4 rounded-xl bg-white/5 border border-white/5 inline-block text-xs font-bold text-purple-400">
            Attendi <span className="text-white text-sm font-black mx-1">{countdown}</span> secondi per riprovare
          </div>
        ) : (
          <div className="py-2 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 inline-block text-xs font-bold text-emerald-400">
            Pronto per il ripristino!
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <Button
            size="md"
            variant="ghost"
            className={`w-full font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer ${
              countdown > 0 
                ? "bg-purple-600/30 text-purple-400 cursor-not-allowed border border-purple-500/20" 
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
            }`}
            onClick={handleRetry}
            isDisabled={countdown > 0 || isRetrying}
          >
            {isRetrying ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Ripristino...
              </span>
            ) : (
              "Riprova Ora"
            )}
          </Button>

          <Button
            size="md"
            variant="ghost"
            className="w-full font-bold text-xs uppercase tracking-wider rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1 shrink-0" />
            Torna Indietro
          </Button>
        </div>
      </div>
    </div>
  );
}

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
            try {
              await signInWithCustomToken(auth, res.customToken);
            } catch (signInErr) {
              console.error("[FirebaseProvider] Errore durante il signIn con custom token:", signInErr);
              const errMsg = signInErr instanceof Error ? signInErr.message : String(signInErr);
              setExchangeError(`Errore di inizializzazione Firebase Auth: ${errMsg}. Verifica che il dominio '${window.location.hostname}' sia inserito tra i referrer consentiti per la chiave API di Firebase.`);
              await auth.signOut();
            }
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
            try {
              await signInWithCustomToken(auth, response.data.customToken);

              // Invia segnale a tutte le altre schede aperte del completamento login
              if (typeof window !== "undefined" && "BroadcastChannel" in window) {
                const channel = new BroadcastChannel("kalex_auth_sync");
                channel.postMessage("login");
                channel.close();
              }
            } catch (signInErr) {
              console.error("[SSO Callback] Errore signInWithCustomToken:", signInErr);
              const errMsg = signInErr instanceof Error ? signInErr.message : String(signInErr);
              setExchangeError(`Impossibile autenticare la sessione Firebase client: ${errMsg}. Verifica che il dominio '${window.location.hostname}' sia inserito tra i referrer consentiti per la chiave API di Firebase Auth nella console Google Cloud.`);
              await auth.signOut();
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

  if (isMounted && (isLoading || exchangeError)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4 gap-4">
        {isLoading && <Spinner size="lg" color="current" />}
        {!exchangeError && (
          <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase animate-pulse">
            {exchangeLoading ? "Sincronizzazione sessione SSO in corso..." : "Caricamento sessione in corso..."}
          </span>
        )}
        {exchangeError && (
          <div className="mt-4 p-4 bg-red-950/60 border border-red-500/30 text-white text-xs rounded-2xl text-center max-w-md shadow-2xl flex flex-col items-center gap-3">
            <span className="font-black text-red-500 uppercase tracking-widest text-[10px]">Autenticazione Fallita</span>
            <p className="text-slate-300 font-medium leading-relaxed">{exchangeError}</p>
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
