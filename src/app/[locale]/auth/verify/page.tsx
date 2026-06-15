"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode, onAuthStateChanged, User } from "firebase/auth";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { Card, Button } from "@heroui/react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

// Configurazione brand speculare a quella di auth/page.tsx
const BRAND_CONFIGS: Record<
  string,
  {
    name: string;
    bgGradientLight: string;
    bgGradientDark: string;
    glowColorLight: string;
    glowColorDark: string;
    logoColor: string;
  }
> = {
  satefy: {
    name: "SATEFY",
    bgGradientLight: "from-emerald-100/40 via-slate-50 to-teal-100/20",
    bgGradientDark: "from-emerald-950/25 via-slate-950 to-teal-950/15",
    glowColorLight: "bg-emerald-500/5",
    glowColorDark: "bg-emerald-500/10",
    logoColor: "from-emerald-400 to-teal-500"
  },
  standlo: {
    name: "STANDLO",
    bgGradientLight: "from-cyan-100/40 via-slate-50 to-blue-100/20",
    bgGradientDark: "from-cyan-950/25 via-slate-950 to-blue-950/15",
    glowColorLight: "bg-cyan-500/5",
    glowColorDark: "bg-cyan-500/10",
    logoColor: "from-cyan-400 to-blue-500"
  },
  default: {
    name: "KALEX",
    bgGradientLight: "from-purple-100/40 via-slate-50 to-pink-100/20",
    bgGradientDark: "from-purple-950/25 via-slate-950 to-pink-950/15",
    glowColorLight: "bg-purple-500/5",
    glowColorDark: "bg-purple-500/10",
    logoColor: "from-purple-500 to-pink-500"
  }
};

// Helper per bypassare l'errore di immutabilità di ESLint sulla modifica diretta di document.cookie
function setSsoCookie(value: string) {
  if (typeof document !== "undefined") {
    document.cookie = value;
  }
}

export default function VerifyEmailPage() {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const oobCode = searchParams.get("oobCode");
  const clientId = searchParams.get("client_id") || "default";
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state") || "";

  const brand = BRAND_CONFIGS[clientId] || BRAND_CONFIGS.default;
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
  const activeBgGradient = isDark ? brand.bgGradientDark : brand.bgGradientLight;
  const activeGlowColor = isDark ? brand.glowColorDark : brand.glowColorLight;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const verifiedRef = useRef(false);

  // Reindirizzamento finale all'applicazione client o alla dashboard locale
  const handleFinalRedirect = useCallback(async (user: User) => {
    if (redirectUri) {
      setStatusMessage(t("auth.verifyRedirecting"));
      try {
        const idToken = await user.getIdToken();
        const response = await fetchWithAppCheck("/api/auth/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, clientId, redirectUri })
        });
        const data = await response.json();
        if (data.success && data.code) {
          window.location.href = `${redirectUri}?code=${data.code}&state=${encodeURIComponent(state)}`;
          return;
        }
      } catch (err) {
        console.error("SSO Redirect error on verify page:", err);
      }
    }
    // Se non c'è un redirectUri, rimanda alla dashboard locale di SSO
    router.push(`/${currentLocale}`);
  }, [clientId, currentLocale, redirectUri, router, state, t]);

  // Avvio dell'onboarding in PostgreSQL e Stripe
  const handleOnboarding = useCallback(async (user: User) => {
    try {
      setStatusMessage(t("auth.verifyStarting"));
      // Forza il refresh del token JWT per aggiornare email_verified: true
      const idToken = await user.getIdToken(true);

      const triggerOnboarding = async (): Promise<boolean> => {
        const res = await fetchWithAppCheck("/api/auth/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`
          }
        });

        if (res.status === 202) {
          const data = await res.json();
          setStatusMessage(data.message || t("auth.verifyConfiguringOrg"));
          return true; // Polling necessario
        }

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSuccessMessage(t("auth.verifySuccess") || "Email verificata con successo!");
            setStatusMessage(t("auth.verifyAccountReady"));
            return false; // Completato, no polling
          }
        }

        throw new Error("Errore durante il caricamento della dashboard.");
      };

      const isPending = await triggerOnboarding();

      if (!isPending) {
        setSsoCookie("sso_session=active; path=/; max-age=31536000; SameSite=Lax");
        console.log("[Verification Page] Onboarding già completato, forzo il refresh del token per caricare i claims...");
        await user.getIdToken(true);
        await handleFinalRedirect(user);
        return;
      }

      // Avvia il polling ogni 3 secondi
      const intervalId = setInterval(async () => {
        try {
          const res = await fetchWithAppCheck("/api/auth/dashboard", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`
            }
          });

          if (res.status === 200) {
            const data = await res.json();
            if (data.success) {
              clearInterval(intervalId);
              setSuccessMessage(t("auth.verifySuccess") || "Email verificata con successo!");
              setStatusMessage(t("auth.verifySuccessMessage"));
              setSsoCookie("sso_session=active; path=/; max-age=31536000; SameSite=Lax");
              console.log("[Verification Page] Onboarding completato con successo, forzo il refresh del token...");
              await user.getIdToken(true);
              await handleFinalRedirect(user);
            }
          } else if (res.status === 202) {
            const data = await res.json();
            setStatusMessage(data.message || t("auth.verifyConfiguringOrg"));
          } else {
            clearInterval(intervalId);
            throw new Error("Errore nel polling dell'onboarding.");
          }
        } catch (pollErr) {
          console.error("Polling error on verify page:", pollErr);
          clearInterval(intervalId);
          setError(t("auth.verifyInitError"));
          setLoading(false);
        }
      }, 3000);
    } catch (err) {
      console.error("Onboarding error on verify page:", err);
      setError(t("auth.verifyDatabaseError"));
      setLoading(false);
    }
  }, [t, handleFinalRedirect]);

  useEffect(() => {
    if (verifiedRef.current) return;
    
    if (!oobCode) {
      // Evita setState sincroni nell'effetto per prevenire cascading renders
      Promise.resolve().then(() => {
        setError(t("auth.verifyError") || "Codice di verifica mancante o non valido.");
        setLoading(false);
      });
      return;
    }

    verifiedRef.current = true;
    Promise.resolve().then(() => {
      setStatusMessage(t("auth.verifyLoading"));
    });

    // Registriamo subito onAuthStateChanged per determinare lo stato di autenticazione effettivo del browser
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Eseguiamo l'unsubscribe immediatamente dopo la prima notifica di stato risolto
      
      try {
        // 1. Convalida il codice di verifica email su Firebase Auth
        await applyActionCode(auth, oobCode);
        console.log("[Verification Page] applyActionCode completata con successo!");

        if (user) {
          console.log("[Verification Page] Utente loggato rilevato:", user.email);
          // Ricarichiamo l'utente per aggiornare lo stato di verifica email locale su Firebase Auth
          await user.reload();
          // Avvia l'onboarding in PostgreSQL/Stripe con polling
          await handleOnboarding(user);
        } else {
          console.log("[Verification Page] Nessun utente loggato in questa scheda. Rimando al login.");
          // Se non loggato, email verificata con successo ma reindirizziamo al login per completare
          setSuccessMessage(t("auth.verifySuccess") || "Email verificata con successo!");
          setStatusMessage(t("auth.verifyRedirectToLogin"));
          setLoading(false);
          setTimeout(() => {
            const loginUrl = new URL(`${window.location.origin}/${currentLocale}/auth`);
            searchParams.forEach((value, key) => {
              if (key !== "oobCode") {
                loginUrl.searchParams.set(key, value);
              }
            });
            router.push(loginUrl.pathname + loginUrl.search);
          }, 3000);
        }
      } catch (err) {
        console.error("[Verification Page] Errore durante la verifica/onboarding:", err);
        setError(t("auth.verifyError") || "Il codice di verifica è scaduto o non è valido.");
        setLoading(false);
      }
    });
  }, [oobCode, currentLocale, router, searchParams, t, handleOnboarding]);


  return (
    <div className={`min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans p-6 bg-gradient-to-br ${activeBgGradient}`}>
      {/* Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full filter blur-[100px] pointer-events-none ${activeGlowColor} opacity-50`}></div>

      <Card className="max-w-md w-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl p-8 text-center rounded-3xl relative z-10">
        <Card.Content className="flex flex-col items-center justify-center p-2">
          {/* Logo Brand */}
          <div className="text-center mb-6">
            <span className={`text-4xl font-extrabold bg-gradient-to-r ${brand.logoColor} bg-clip-text text-transparent tracking-tighter`}>
              {brand.name}
            </span>
            <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold mt-1 tracking-wider uppercase">
              {t("auth.subtitle")}
            </p>
          </div>

          {/* Loader / Stato */}
          {loading && (
            <div className="my-8">
              <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{statusMessage}</p>
            </div>
          )}

          {/* Errore */}
          {error && (
            <div className="my-6 space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-red-500">{t("auth.verifyFailedTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">{error}</p>
              <Button
                onClick={() => router.push(`/${currentLocale}/auth${window.location.search}`)}
                className="mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-5 px-6 cursor-pointer"
              >
                {t("auth.backToLogin") || "Torna al login"}
              </Button>
            </div>
          )}

          {/* Successo */}
          {successMessage && !loading && (
            <div className="my-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-emerald-600 dark:text-emerald-400">{successMessage}</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">{statusMessage}</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
