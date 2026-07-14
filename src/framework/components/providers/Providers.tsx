"use client";

import React, { useState, useEffect, useSyncExternalStore, useCallback, useRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProviderClient, useCurrentLocale } from "@/locales/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, useAuth, forceCleanSession } from "../../lib/auth";
import { fetchAuthedClient } from "../../lib/api";
import { Button, DebugWidget, GlobalLoader } from "../ui";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { BrandProvider } from "./BrandProvider";
import { ApiGuard } from "../layouts/ApiGuard";
import type { BrandConfig } from "../../lib/brand.config";
import { useUIStrings, fmtUI, localeDirection } from "../../lib/ui.localization";

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
// INNER COMPONENT: LocaleDirection (E3.1 — RTL readiness)
// ---------------------------------------------------------
/**
 * Imposta l'attributo `dir` su <html> in base al locale corrente, in modo
 * reattivo a `useCurrentLocale()` (il cambio lingua da settings aggiorna la
 * direzione senza reload). Va montato DENTRO I18nProviderClient.
 * NB: i locale attivi (it/en/es) sono tutti LTR — l'RTL è predisposto per
 * mercati futuri (vedi RTL_LOCALES in lib/ui.localization.ts).
 */
function LocaleDirection() {
  const locale = useCurrentLocale();
  useEffect(() => {
    document.documentElement.dir = localeDirection(locale);
  }, [locale]);
  return null;
}

// ---------------------------------------------------------
// INNER COMPONENT: RateLimitGuard
// ---------------------------------------------------------
interface RateLimitGuardProps {
  onRetry: () => void | Promise<void>;
  initialCountdown?: number;
}

function RateLimitGuard({ onRetry, initialCountdown = 5 }: RateLimitGuardProps) {
  const s = useUIStrings();
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

  // Schermata-guardia generica (theme-aware): la logica countdown/retry resta qui,
  // la grafica è unica per tutti i gate di questo tipo (vedi layouts/ApiGuard).
  return (
    <ApiGuard
      tone="warning"
      title={s.providers.rateLimitTitle}
      description={s.providers.rateLimitBody}
      hint={s.providers.rateLimitHint}
      status={
        countdown > 0 ? (
          <div className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 inline-block text-xs font-bold text-secondary">
            {s.providers.waitPrefix} <span className="text-slate-900 dark:text-white text-sm font-black mx-1">{countdown}</span> {s.providers.waitSuffix}
          </div>
        ) : (
          <div className="py-2 px-4 rounded-xl bg-success/10 border border-success/20 inline-block text-xs font-bold text-success">
            {s.providers.readyToRetry}
          </div>
        )
      }
      actions={
        <>
          <Button
            unstyled
            size="md"
            variant="ghost"
            className={`w-full font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer ${
              countdown > 0
                ? "bg-secondary/20 text-secondary cursor-not-allowed border border-secondary/20"
                : "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg"
            }`}
            onClick={handleRetry}
            isDisabled={countdown > 0 || isRetrying}
          >
            {isRetrying ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                {s.providers.retrying}
              </span>
            ) : (
              s.providers.retryNow
            )}
          </Button>

          <Button
            unstyled
            size="md"
            variant="ghost"
            className="w-full font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            onClick={handleGoBack}
          >
            {/* Freccia "indietro": direzionale, si specchia in RTL */}
            <ArrowLeft className="w-4 h-4 me-1 shrink-0 rtl:-scale-x-100" />
            {s.providers.goBack}
          </Button>
        </>
      }
    />
  );
}

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  appId: "sso" | "web" | string;
  /** Brand white-label esplicito; in assenza risolto da NEXT_PUBLIC_KALEX_BRAND (default KALEX). */
  brand?: BrandConfig;
}

interface ClientTokenResult {
  success: boolean;
  customToken?: string;
  isRateLimited?: boolean;
  /**
   * True SOLO quando l'errore indica che la sessione è genuinamente invalida (401: assente/scaduta/revocata).
   * Per errori transitori/infrastrutturali (500, rete, signBlob mancante) resta falsy: in quel caso NON si deve
   * fare clean-session/logout — la sessione col cookie può essere ancora valida (bootstrap resiliente, A2/R1).
   */
  sessionInvalid?: boolean;
}

// ---------------------------------------------------------
// INNER COMPONENT: FirebaseProvider
// ---------------------------------------------------------
function FirebaseProvider({ children, appId }: { children: React.ReactNode; appId: string }) {
  const { loading } = useAuth();
  const s = useUIStrings();
  // Ref per le stringhe dentro callback/effetti (il cambio lingua non deve ri-innescarli)
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);
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
        
        // Un fallimento CSRF è TRANSIENTE (header/cookie disallineati, es. race tra richieste
        // parallele al boot): NON è una sessione invalida — mai clean-session/logout per questo.
        // Il matching per parole chiave qui sotto ("mancante"…) altrimenti lo catturerebbe.
        if (response.error?.code === "auth/csrf-invalid") {
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
          return { success: false };
        }

        // Se la sessione non è presente, è scaduta o revocata (401 Unauthorized), non eseguiamo i retry
        // e segnaliamo che la sessione è genuinamente invalida (→ i chiamanti possono pulirla).
        if (
          response.error?.code === "auth/unauthorized" ||
          response.error?.code === "auth/invalid-session" ||
          response.error?.code === "auth/invalid-token" ||
          response.error?.message?.includes("scadut") ||
          response.error?.message?.includes("valida") ||
          response.error?.message?.includes("mancante") ||
          response.error?.message?.includes("non autorizzato")
        ) {
          return { success: false, sessionInvalid: true };
        }

        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        // Retry esauriti su un errore NON di sessione (es. 500/signBlob): transitorio, NON invalida la sessione.
        return { success: false };
      } catch (err) {
        if (attempt < retries) {
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
              const errMsg = signInErr instanceof Error ? signInErr.message : String(signInErr);
              setExchangeError(fmtUI(sRef.current.providers.firebaseInitError, { error: errMsg, domain: window.location.hostname }));
              await auth.signOut();
            }
          } else if (res.isRateLimited && active.current) {
            setRateLimited(true);
          }
        } catch {
          // Silent fallback
        }
      }
    } catch {
      // Silent fallback
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
        return;
      }

      if (auth.currentUser) {
        try {
          const { signInWithCustomToken } = await import("firebase/auth");
          const response = await fetchClientTokenWithRetry();
          if (response.success && response.customToken) {
            await signInWithCustomToken(auth, response.customToken);
            // Refresh scorrevole del cookie di sessione (48h) mentre l'utente è attivo (best-effort:
            // un fallimento non tocca la sessione). Rinnova la finestra a ogni ciclo di attività.
            void fetchAuthedClient("/api/auth/session", { method: "POST" });
          } else if (response.isRateLimited) {
            setRateLimited(true);
          } else if (response.sessionInvalid) {
            // Solo se la sessione è genuinamente scaduta/revocata: auto-clean.
            await forceCleanSession(appId);
          }
          // Altrimenti (errore transitorio/infrastrutturale): NON si tocca la sessione, si ritenta al prossimo ciclo.
        } catch {
          // Silent fallback
        }
      }
    }, 45 * 60 * 1000); // 45 minuti

    // Listener per il ripristino della rete: se eravamo offline, sincronizza subito il token
    const handleOnline = async () => {
      isOnlineRef.current = true;
      if (auth.currentUser) {
        try {
          const { signInWithCustomToken } = await import("firebase/auth");
          const response = await fetchClientTokenWithRetry();
          if (response.success && response.customToken) {
            await signInWithCustomToken(auth, response.customToken);
          } else if (response.isRateLimited) {
            setRateLimited(true);
          } else if (response.sessionInvalid) {
            await forceCleanSession(appId);
          }
          // Errore transitorio: si mantiene la sessione, riprova al prossimo evento/ciclo.
        } catch {
          // Silent fallback
        }
      }
    };

    const handleOffline = () => {
      isOnlineRef.current = false;
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
  }, [fetchClientTokenWithRetry, appId]);

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
            setExchangeError(sRef.current.providers.csrfBlocked);
            setExchangeLoading(false);
            return;
          }

          // Pulisce lo state consumato e recupera il verifier PKCE (3.1): monouso, va
          // rimosso qualunque sia l'esito dello scambio.
          let codeVerifier: string | null = null;
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.removeItem("sso_auth_state");
            codeVerifier = sessionStorage.getItem("sso_pkce_verifier");
            sessionStorage.removeItem("sso_pkce_verifier");
          }

          const response = await fetchAuthedClient<{ success: boolean; customToken: string }>("/api/auth/token", {
            method: "POST",
            body: JSON.stringify({
              code,
              clientId: appId,
              redirectUri,
              ...(codeVerifier ? { codeVerifier } : {})
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
              setExchangeError(fmtUI(sRef.current.providers.firebaseClientAuthError, { error: errMsg, domain: window.location.hostname }));
              await auth.signOut();
            }
          } else {
            const errorMsg = response.error?.message || sRef.current.providers.ssoExchangeFailed;
            const correlationId = (response.error?.details as { correlationId?: string })?.correlationId;
            setExchangeError(correlationId ? `${errorMsg} (Correlation ID: ${correlationId})` : errorMsg);
            // Forza la pulizia per evitare sessioni parziali/invalide
            await forceCleanSession(appId);
          }
        } catch (err) {
          console.error("[SSO Callback] Errore scambio token:", err);
          setExchangeError(sRef.current.providers.ssoNetworkError);
          await forceCleanSession(appId);
        } finally {
          setExchangeLoading(false);
        }
      };

      void handleTokenExchange();
    }
  }, [isMounted, appId]);

  const forceCleanAndRedirect = useCallback(async () => {
    await forceCleanSession(appId);
  }, [appId]);

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

  // Loader UNICO (GlobalLoader): stesso look di tutti gli altri gate → l'utente percepisce un
  // solo loader il cui messaggio cambia, non schermate diverse che si susseguono.
  if (isMounted && isLoading) {
    return (
      <GlobalLoader
        message={exchangeLoading ? s.common.sessionSync : s.common.loading}
      />
    );
  }

  if (isMounted && exchangeError) {
    // Stessa schermata-guardia generica del rate-limit (tone danger): grafica unica per i gate API.
    return (
      <ApiGuard
        tone="danger"
        title={s.providers.authFailed}
        description={exchangeError}
        actions={
          <Button
            unstyled
            size="sm"
            className="bg-gradient-to-r from-danger to-accent hover:opacity-90 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            onClick={forceCleanAndRedirect}
          >
            {s.providers.cleanAndRetry}
          </Button>
        }
      />
    );
  }

  return (
    <>
      {children}
      <DebugWidget />
    </>
  );
}

// ---------------------------------------------------------
// EXPORTED DEFAULT COMPONENT: Providers
// ---------------------------------------------------------
export default function Providers({ children, locale, appId, brand }: ProvidersProps) {
  return (
    <I18nProviderClient locale={locale}>
      <LocaleDirection />
      <BrandProvider brand={brand}>
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <FirebaseProvider appId={appId}>
            {children}
          </FirebaseProvider>
        </NextThemesProvider>
      </BrandProvider>
    </I18nProviderClient>
  );
}
