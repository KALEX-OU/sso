"use client";

/**
 * AUTH v1.2 — pagina di LOGIN (docs/AUTH_V1_2_PLAN.md).
 *
 * Route dedicata: qui vivono SOLO la logica Firebase del login (password, MFA
 * TOTP, sessione server, redirect SSO) e il wiring RHF; la UI è dei componenti
 * DS del framework (AuthForm / AuthFormMfa / AuthVerifyNotice) dentro
 * `auth/AuthArea` (cornice del portale, verticale via useAuthBrand). MFA e
 * avviso verifica NON sono route: il MultiFactorResolver vive in memoria JS.
 */

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  MultiFactorResolver,
} from "firebase/auth";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalLoader } from "@/framework/components/ui";
import { AuthFormLogin } from "@/framework/components/auth/AuthFormLogin";
import { AuthFormMfa } from "@/framework/components/auth/AuthFormMfa";
import { AuthVerifyNotice } from "@/framework/components/auth/AuthVerifyNotice";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { LoginSchema, LoginInput } from "@/lib/validation/auth";
import { AuthArea } from "@/framework/components/auth/AuthArea";
import { preserveAuthQuery, useAuthBrand } from "../_shared/auth-portal";

function LoginPortal() {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientId, gradient, brand, brandName } = useAuthBrand();

  const redirectUri = searchParams.get("redirect_uri");
  // PKCE (3.1): challenge generato dalla RP, inoltrato tale e quale a /api/auth/code
  const codeChallenge = searchParams.get("code_challenge");
  const state = searchParams.get("state") || "";
  const authQuery = preserveAuthQuery(searchParams);

  const getErrorMessage = useCallback((errorObj?: { message?: string }) => {
    if (!errorObj || !errorObj.message) return "";
    if (errorObj.message.startsWith("validation.")) {
      return t(errorObj.message as Parameters<typeof t>[0]);
    }
    return errorObj.message;
  }, [t]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // MFA — solo TOTP (app di autenticazione); l'SMS è stato rimosso (NIST lo scoraggia).
  const [mfaRequired, setMfaRequired] = useState(false);
  // Fiducia dispositivo (N3): opt-in al challenge TOTP, concretizzata dopo il resolveSignIn.
  const [trustDevice, setTrustDevice] = useState(false);
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaHint, setMfaHint] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaTotpUid, setMfaTotpUid] = useState("");
  // Recovery MFA con codice di backup (173): l'email è catturata al challenge MFA.
  const [mfaEmail, setMfaEmail] = useState("");
  const [showBackupRecover, setShowBackupRecover] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [backupRecoverLoading, setBackupRecoverLoading] = useState(false);
  const [backupRecoverMsg, setBackupRecoverMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loginFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) setMounted(true);
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  const {
    handleSubmit: handleSubmitLogin,
    setValue: setValueLogin,
    getValues: getValuesLogin,
    control: controlLogin,
    formState: { errors: errorsLogin },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const emailLoginValue = useWatch({ control: controlLogin, name: "email" }) || "";
  const passwordLoginValue = useWatch({ control: controlLogin, name: "password" }) || "";
  const rememberMeLoginValue = useWatch({ control: controlLogin, name: "rememberMe" }) ?? true;

  // Sync degli eventi nativi (autofill/suggerimento password del browser) con RHF
  useEffect(() => {
    const formEl = loginFormRef.current;
    if (!formEl) return;

    // SOLO i campi testuali RHF (sync autofill browser): vedi nota gemella
    // nella pagina register — setValue su nomi estranei rompe i controlled input.
    const RHF_TEXT_FIELDS = new Set<keyof LoginInput>(["email", "password"]);
    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const name = target?.name as keyof LoginInput | undefined;
      if (name && RHF_TEXT_FIELDS.has(name)) {
        setValueLogin(name, target.value, { shouldValidate: true, shouldDirty: true });
      }
    };

    formEl.addEventListener("input", handleNativeInput);
    formEl.addEventListener("change", handleNativeInput);
    return () => {
      formEl.removeEventListener("input", handleNativeInput);
      formEl.removeEventListener("change", handleNativeInput);
    };
  }, [setValueLogin, mounted, mfaRequired, needsVerification]);

  const handleSSORedirect = useCallback(async (currentUser: User) => {
    if (!redirectUri) return;
    setRedirecting(true);
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetchWithAppCheck("/api/auth/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          clientId,
          redirectUri,
          ...(codeChallenge ? { codeChallenge, codeChallengeMethod: "S256" } : {}),
        }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string | { message: string };
        code?: string;
      };
      if (data.error || data.success === false) {
        const errMsg = typeof data.error === "object" && data.error ? data.error.message : (data.error as string) || "Errore durante la generazione del codice SSO.";
        throw new Error(errMsg);
      }
      try {
        const targetUrl = new URL(redirectUri);
        targetUrl.searchParams.set("code", data.code || "");
        targetUrl.searchParams.set("state", state || "");
        window.location.href = targetUrl.toString();
      } catch (urlErr) {
        console.error("Errore nel parsing del redirectUri:", urlErr);
        window.location.href = `${redirectUri}${redirectUri.includes("?") ? "&" : "?"}code=${data.code}&state=${encodeURIComponent(state)}`;
      }
    } catch (err) {
      console.error("SSO Redirect error:", err);
      const message = err instanceof Error ? err.message : "Errore durante il reindirizzamento.";
      setError(message);
      setRedirecting(false);
    }
  }, [redirectUri, clientId, state, codeChallenge]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (!currentUser.emailVerified) {
          try {
            await currentUser.reload();
            if (currentUser.emailVerified) {
              await currentUser.getIdToken(true);
            }
          } catch (e) {
            console.error("Error reloading user on auth state change:", e);
          }
        }

        if (currentUser.emailVerified) {
          setNeedsVerification(false);

          const syncSessionAndRedirect = async () => {
            if (redirecting) return;
            setRedirecting(true);
            try {
              // 1. Cookie di sessione HttpOnly lato server ("Ricordami" → persistenza)
              const idToken = await currentUser.getIdToken();
              const rememberChoice = getValuesLogin("rememberMe");
              const sessionRes = await fetchWithAppCheck("/api/auth/session", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${idToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ rememberMe: rememberChoice }),
              });
              if (!sessionRes.ok) {
                throw new Error("Impossibile sincronizzare la sessione server-side.");
              }

              // 2. Redirect SSO o dashboard
              if (redirectUri) {
                await handleSSORedirect(currentUser);
              } else {
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
              }
            } catch (err) {
              console.error("[Auth Sincronizzazione Sessione] Errore:", err);
              setError("Errore durante l'attivazione della sessione sicura.");
              setRedirecting(false);
            }
          };

          void syncSessionAndRedirect();
        } else {
          setNeedsVerification(true);
        }
      } else {
        setNeedsVerification(false);
      }
    });
    return () => unsubscribe();
  }, [redirectUri, redirecting, handleSSORedirect, router, currentLocale, searchParams, getValuesLogin]);

  const handleCheckVerification = async () => {
    setError("");
    setLoading(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          await auth.currentUser.getIdToken(true);
          setNeedsVerification(false);
          if (redirectUri && !redirecting) {
            handleSSORedirect(auth.currentUser);
          }
        } else {
          setError("L'indirizzo email non è ancora stato verificato. Controlla la tua casella di posta.");
        }
      }
    } catch (err) {
      console.error("Error checking verification status:", err);
      setError("Errore durante la verifica dello stato dell'email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setResendLoading(true);
    try {
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetchWithAppCheck("/api/auth/send-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setResendSuccess("Email di verifica inviata con successo!");
          setTimeout(() => setResendSuccess(""), 5000);
        } else {
          const errCode = (resData.error && typeof resData.error === "object" && "message" in resData.error && typeof resData.error.message === "string")
            ? resData.error.message
            : "Errore durante il rinvio dell'email.";
          throw new Error(errCode);
        }
      } else {
        setError("Nessuna sessione attiva rilevata. Per favore, torna al login ed esegui l'accesso per richiedere l'email di verifica.");
      }
    } catch (err) {
      console.error("Error resending verification:", err);
      const errMsg = err instanceof Error ? err.message : "Errore durante l'invio dell'email di verifica.";
      setError(errMsg);
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmitLogin: SubmitHandler<LoginInput> = async (data) => {
    setError("");
    setLoading(true);
    try {
      const { setPersistence, browserLocalPersistence, browserSessionPersistence } = await import("firebase/auth");
      await setPersistence(auth, data.rememberMe ? browserLocalPersistence : browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

      if (!userCredential.user.emailVerified) {
        setNeedsVerification(true);
      }
    } catch (err) {
      const errCode = (err && typeof err === "object" && "code" in err && typeof (err as { code: unknown }).code === "string")
        ? (err as { code: string }).code
        : "unknown";

      if (errCode !== "auth/multi-factor-auth-required") {
        console.error("Login error:", err);
      }

      if (errCode === "auth/multi-factor-auth-required") {
        try {
          const resolver = getMultiFactorResolver(auth, err as Parameters<typeof getMultiFactorResolver>[1]);
          const totpInfoOptions = resolver.hints.find((h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
          if (!totpInfoOptions) {
            throw new Error("Nessun secondo fattore TOTP risolvibile disponibile per questo account.");
          }

          setMfaResolver(resolver);
          setMfaRequired(true);
          setMfaEmail(data.email);
          setMfaTotpUid(totpInfoOptions.uid);
          setMfaHint(totpInfoOptions.displayName || "la tua app di autenticazione");
          setLoading(false);
          return;
        } catch (mfaErr) {
          console.error("Error initializing MFA:", mfaErr);
          setError("Errore durante l'inizializzazione del secondo fattore di autenticazione.");
          setLoading(false);
          return;
        }
      }

      let errMsg = "Errore durante l'accesso.";
      if (errCode === "auth/wrong-password" || errCode === "auth/user-not-found" || errCode === "auth/invalid-credential") {
        errMsg = "Credenziali non valide.";
      } else if (err instanceof Error && err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  // Recovery MFA con codice di backup (173): reset dei fattori lato server, poi
  // l'utente ri-accede con la sola password (degrada a password-only, non concede accesso).
  const handleBackupRecover = async () => {
    if (!backupCode.trim() || !mfaEmail) return;
    setBackupRecoverMsg(null);
    setBackupRecoverLoading(true);
    try {
      const res = await fetchWithAppCheck("/api/auth/mfa/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mfaEmail, code: backupCode.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { reset?: boolean };
      if (res.ok && data.reset) {
        setBackupRecoverMsg({ type: "ok", text: t("auth.mfaBackupResetOk") });
        setMfaResolver(null);
        setBackupCode("");
      } else {
        setBackupRecoverMsg({ type: "err", text: t("auth.mfaBackupInvalid") });
      }
    } catch {
      setBackupRecoverMsg({ type: "err", text: t("auth.mfaBackupError") });
    } finally {
      setBackupRecoverLoading(false);
    }
  };

  const handleVerifyMfaCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaResolver || !mfaCode) return;
    setError("");
    setMfaLoading(true);
    try {
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(mfaTotpUid, mfaCode);
      const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion);

      // Fiducia dispositivo (N3): SOLO dopo il secondo fattore riuscito. Best-effort e
      // atteso (il Set-Cookie kalex_trust deve arrivare prima del redirect); il token è
      // fresco e contiene sign_in_second_factor — requisiti verificati dal server.
      if (trustDevice) {
        try {
          const trustToken = await userCredential.user.getIdToken();
          await fetch("/api/auth/mfa/trust-device", {
            method: "POST",
            headers: { Authorization: `Bearer ${trustToken}` },
          });
        } catch (trustErr) {
          console.warn("[Login] Registrazione dispositivo fidato non riuscita (best-effort):", trustErr);
        }
      }

      setMfaRequired(false);
      setMfaResolver(null);

      if (!userCredential.user.emailVerified) {
        setNeedsVerification(true);
      }
    } catch (err) {
      console.error("MFA verification error:", err);
      let errMsg = "Codice di verifica non valido.";
      if (err instanceof Error && err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setMfaLoading(false);
    }
  };

  if (!mounted) return null;

  if (redirecting) {
    return <GlobalLoader message={t("auth.success")} subMessage={t("auth.redirecting")} />;
  }

  if (needsVerification) {
    return (
      <AuthArea brand={brand} brandName={brandName} showHeader={false} cardClassName="max-w-md">
        <AuthVerifyNotice
          email={auth.currentUser?.email || emailLoginValue}
          error={error}
          resendSuccess={resendSuccess}
          onCheck={() => void handleCheckVerification()}
          onResend={() => void handleResendVerification()}
          onBack={() => {
            setError("");
            void signOut(auth).then(() => setNeedsVerification(false));
          }}
          checking={loading}
          resendLoading={resendLoading}
          gradientClassName={gradient}
        />
      </AuthArea>
    );
  }

  return (
    <AuthArea
      brand={brand}
      brandName={brandName}
      error={error}
      belowCard={
        !mfaRequired ? (
          <div className="mt-8 text-center text-xs text-slate-500 dark:text-gray-400">
            {t("auth.noAccount")}{" "}
            <Link
              href={`/${currentLocale}/auth/register${authQuery}`}
              className="text-slate-900 dark:text-white font-bold hover:underline ms-1 cursor-pointer"
            >
              {t("auth.registerNow")}
            </Link>
          </div>
        ) : undefined
      }
    >
      {mfaRequired ? (
        <AuthFormMfa
          code={mfaCode}
          onCodeChange={setMfaCode}
          onSubmit={handleVerifyMfaCode}
          factorHint={mfaHint}
          loading={mfaLoading}
          showBackup={showBackupRecover}
          onToggleBackup={(open) => {
            setShowBackupRecover(open);
            setBackupRecoverMsg(null);
            if (!open) setBackupCode("");
          }}
          backupCode={backupCode}
          onBackupCodeChange={setBackupCode}
          onBackupSubmit={() => void handleBackupRecover()}
          backupLoading={backupRecoverLoading}
          backupMessage={backupRecoverMsg}
          trustDevice={trustDevice}
          onTrustDeviceChange={setTrustDevice}
          onBack={() => {
            setMfaRequired(false);
            setMfaResolver(null);
            setError("");
          }}
          gradientClassName={gradient}
        />
      ) : (
        <AuthFormLogin
          formRef={loginFormRef}
          email={emailLoginValue}
          password={passwordLoginValue}
          rememberMe={rememberMeLoginValue}
          onEmailChange={(v) => setValueLogin("email", v, { shouldValidate: true, shouldDirty: true })}
          onPasswordChange={(v) => setValueLogin("password", v, { shouldValidate: true, shouldDirty: true })}
          onRememberMeChange={(v) => setValueLogin("rememberMe", v)}
          onSubmit={handleSubmitLogin(onSubmitLogin)}
          onForgotPassword={() => router.push(`/${currentLocale}/auth/reset-password`)}
          emailError={getErrorMessage(errorsLogin.email)}
          passwordError={getErrorMessage(errorsLogin.password)}
          loading={loading}
          gradientClassName={gradient}
        />
      )}
    </AuthArea>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <LoginPortal />
    </Suspense>
  );
}
