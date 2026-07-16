"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode, onAuthStateChanged, User } from "firebase/auth";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { AuthStatusCard } from "@/framework/components/auth/AuthStatusCard";
import { GlobalLoader } from "@/framework/components/ui";
// Cornice unica del portale auth (framework, speculare a user/UserArea):
// glow, toggle tema/lingua, Logo del verticale, footer legale, marketing.
import { AuthArea } from "@/framework/components/auth/AuthArea";
import { useAuthBrand } from "../_shared/auth-portal";

// Guardia anti doppio-apply a livello di MODULO: in dev il re-mount della pagina
// (StrictMode + bailout Suspense di useSearchParams) crea una nuova istanza del componente,
// quindi un useRef verrebbe ricreato e non basta — verificato empiricamente: col solo ref
// `accounts:update` partiva due volte. Il Set si azzera solo all'hard reload del documento,
// per cui i retry legittimi dopo un errore di rete restano possibili.
const attemptedOobCodes = new Set<string>();

// L'oobCode è monouso: dopo un reload/Fast Refresh la guardia in-memory si azzera ma il codice
// resta consumato e Firebase risponde `auth/invalid-action-code` su una verifica in realtà
// riuscita. Tracciamo in sessionStorage l'ultimo codice applicato con successo nella scheda.
const CONSUMED_OOB_CODE_KEY = "kalex.verify.consumedOobCode";

function wasConsumedInThisSession(code: string): boolean {
  try {
    return window.sessionStorage.getItem(CONSUMED_OOB_CODE_KEY) === code;
  } catch {
    // sessionStorage inaccessibile (privacy mode): resta la sola guardia in-memory
    return false;
  }
}

function markConsumedInThisSession(code: string): void {
  try {
    window.sessionStorage.setItem(CONSUMED_OOB_CODE_KEY, code);
  } catch {
    // sessionStorage inaccessibile: nessuna persistenza, la guardia in-memory copre il mount corrente
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
  // PKCE (3.1): challenge generato dalla RP, inoltrato tale e quale a /api/auth/code
  const codeChallenge = searchParams.get("code_challenge");

  // Estetica del verticale attivo (client_id → brand, _shared/auth-portal).
  const { brand, brandName } = useAuthBrand();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Reindirizzamento finale all'applicazione client o alla dashboard locale
  const handleFinalRedirect = useCallback(async (user: User) => {
    // 1. Chiama /api/auth/session per impostare il cookie HttpOnly lato server
    try {
      const idToken = await user.getIdToken();
      const sessionRes = await fetchWithAppCheck("/api/auth/session", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });
      if (!sessionRes.ok) {
        throw new Error("Impossibile sincronizzare la sessione server-side.");
      }
    } catch (err) {
      console.error("[Verification Page] Errore sincronizzazione sessione HttpOnly:", err);
      setError(t("auth.verifyDatabaseError") || "Errore durante la creazione della sessione sicura.");
      return;
    }

    // 2. Prosegui con il redirect SSO o dashboard
    if (redirectUri) {
      setStatusMessage(t("auth.verifyRedirecting"));
      try {
        const idToken = await user.getIdToken();
        const response = await fetchWithAppCheck("/api/auth/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            clientId,
            redirectUri,
            ...(codeChallenge ? { codeChallenge, codeChallengeMethod: "S256" } : {})
          })
        });
        const data = await response.json();
        if (data.success && data.code) {
          // Costruzione sicura dell'URL (preserva eventuali query esistenti, no concatenazione).
          const redirectUrl = new URL(redirectUri);
          redirectUrl.searchParams.set("code", data.code);
          redirectUrl.searchParams.set("state", state);
          window.location.href = redirectUrl.toString();
          return;
        }
      } catch (err) {
        console.error("SSO Redirect error on verify page:", err);
      }
    }
    // Se non c'è un redirectUri, rimanda alla dashboard locale di SSO
    const redirectTo = searchParams.get("redirectTo");
    if (redirectTo && redirectTo.startsWith("/")) {
      const hasLocale = /^\/(it|en|es)(\/|$)/.test(redirectTo);
      if (hasLocale) {
        router.push(redirectTo);
      } else {
        router.push(`/${currentLocale}${redirectTo}`);
      }
    } else {
      router.push(`/${currentLocale}/dashboard`);
    }
  }, [clientId, currentLocale, redirectUri, router, state, t, searchParams, codeChallenge]);

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
        console.log("[Verification Page] Onboarding già completato, forzo il refresh del token per caricare i claims...");
        await user.getIdToken(true);
        await handleFinalRedirect(user);
        return;
      }

      // Avvia il polling ogni 3 secondi, con un TETTO massimo (1.6): se il backend resta
      // bloccato l'utente riceve un errore chiaro invece di uno spinner infinito.
      const POLL_TIMEOUT_MS = 120000;
      const pollStartedAt = Date.now();
      const intervalId = setInterval(async () => {
        try {
          if (Date.now() - pollStartedAt > POLL_TIMEOUT_MS) {
            clearInterval(intervalId);
            setError(t("auth.verifyInitError"));
            setLoading(false);
            return;
          }
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
    if (!oobCode) {
      // Evita setState sincroni nell'effetto per prevenire cascading renders
      Promise.resolve().then(() => {
        setError(t("auth.verifyError") || "Codice di verifica mancante o non valido.");
        setLoading(false);
      });
      return;
    }

    // Guardia anti doppio-apply: una sola esecuzione per oobCode per sessione JS.
    if (attemptedOobCodes.has(oobCode)) return;
    attemptedOobCodes.add(oobCode);

    Promise.resolve().then(() => {
      setStatusMessage(t("auth.verifyLoading"));
    });

    // Stato di successo per una scheda NON loggata: mostra l'esito e rimanda al login
    // preservando i parametri SSO (senza l'oobCode ormai consumato).
    const showSuccessAndGoToLogin = () => {
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
    };

    // Registriamo subito onAuthStateChanged per determinare lo stato di autenticazione effettivo del browser
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Eseguiamo l'unsubscribe immediatamente dopo la prima notifica di stato risolto

      try {
        // 1. Convalida il codice di verifica email su Firebase Auth
        await applyActionCode(auth, oobCode);
        markConsumedInThisSession(oobCode);
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
          showSuccessAndGoToLogin();
        }
      } catch (err) {
        // `auth/invalid-action-code` capita se l'oobCode è GIÀ stato consumato (doppio apply:
        // StrictMode, retry, un'altra scheda). Se l'email risulta già verificata è un SUCCESSO,
        // non un errore → proseguiamo con l'onboarding invece di mostrare un errore fuorviante.
        const alreadyConsumed =
          !!err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "auth/invalid-action-code";
        if (alreadyConsumed && user) {
          try {
            await user.reload();
            if (user.emailVerified) {
              console.log("[Verification Page] oobCode già consumato ma email verificata → successo.");
              await handleOnboarding(user);
              return;
            }
          } catch {
            // ricarica fallita: cadiamo nell'errore generico sotto
          }
        }
        if (alreadyConsumed && !user && wasConsumedInThisSession(oobCode)) {
          // Codice applicato con successo in QUESTA scheda (reload/Fast Refresh dopo la
          // verifica): è un successo da riproporre, non un errore.
          console.log("[Verification Page] oobCode già consumato in questa sessione → successo.");
          showSuccessAndGoToLogin();
          return;
        }
        console.error("[Verification Page] Errore durante la verifica/onboarding:", err);
        setError(t("auth.verifyError") || "Il codice di verifica è scaduto o non è valido.");
        setLoading(false);
      }
    });
  }, [oobCode, currentLocale, router, searchParams, t, handleOnboarding]);


  // Loader coerente con tutti gli altri gate (GlobalLoader): un solo spinner + messaggio aggiornabile.
  if (loading) {
    return <GlobalLoader message={statusMessage} />;
  }

  // Cornice unica AuthArea (logo compatto senza tagline, come gli step MFA/verify
  // del login); il loader a pagina intera resta il GlobalLoader qui sopra.
  return (
    <AuthArea brand={brand} brandName={brandName} showHeader={false} cardClassName="max-w-md">
      {/* Errore */}
      {error && (
        <AuthStatusCard
          variant="error"
          title={t("auth.verifyFailedTitle")}
          description={error}
          primaryAction={{
            label: t("auth.backToLogin"),
            onClick: () => router.push(`/${currentLocale}/auth${window.location.search}`),
          }}
        />
      )}

      {/* Successo */}
      {successMessage && !loading && (
        <AuthStatusCard variant="success" title={successMessage} description={statusMessage} />
      )}
    </AuthArea>
  );
}
