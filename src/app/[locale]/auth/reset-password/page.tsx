"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import {
  verifyPasswordResetCode
} from "firebase/auth";
import { AuthFormResetPassword } from "@/framework/components/auth/AuthFormResetPassword";
import { AuthStatusCard } from "@/framework/components/auth/AuthStatusCard";
import { GlobalLoader } from "@/framework/components/ui";
// Cornice unica del portale auth (framework, speculare a user/UserArea):
// glow, toggle tema/lingua, Logo del verticale, footer legale, marketing.
import { AuthArea } from "@/framework/components/auth/AuthArea";
import { useAuthBrand } from "../_shared/auth-portal";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { Loader2 } from "lucide-react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Definizione schemi di validazione localmente
const RequestResetSchema = z.object({
  email: z.string().email({ message: "Inserisci un indirizzo email valido." })
});
type RequestResetInput = z.infer<typeof RequestResetSchema>;

const NewPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "La password deve contenere almeno 8 caratteri." }),
    confirmPassword: z.string().min(8, { message: "La password deve contenere almeno 8 caratteri." })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Le password non coincidono."
      });
    }
  });
type NewPasswordInput = z.infer<typeof NewPasswordSchema>;

function ResetPasswordPortal() {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const oobCode = searchParams.get("oobCode");
  // Estetica del verticale attivo (client_id → brand, _shared/auth-portal).
  const { brand, brandName } = useAuthBrand();

  // Stati logici
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeEmail, setCodeEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // React Hook Form per la richiesta di Reset (Scenario A)
  const {
    handleSubmit: handleSubmitRequest,
    setValue: setValueRequest,
    control: controlRequest,
    formState: { errors: errorsRequest }
  } = useForm<RequestResetInput>({
    resolver: zodResolver(RequestResetSchema),
    defaultValues: { email: "" }
  });

  // React Hook Form per l'impostazione nuova password (Scenario B)
  const {
    handleSubmit: handleSubmitNewPass,
    setValue: setValueNewPass,
    control: controlNewPass,
    formState: { errors: errorsNewPass }
  } = useForm<NewPasswordInput>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  // Binding controllato per il wrapper Input (E5.1): il wrapper è sempre controllato
  // (value di default ""), quindi i campi registrati con RHF espongono il valore via useWatch.
  const emailRequestValue = useWatch({ control: controlRequest, name: "email" }) || "";
  const passwordNewValue = useWatch({ control: controlNewPass, name: "password" }) || "";
  const confirmPasswordNewValue = useWatch({ control: controlNewPass, name: "confirmPassword" }) || "";

  // Verifica del codice oobCode al montaggio
  useEffect(() => {
    if (!oobCode) return;

    Promise.resolve().then(() => {
      setVerifyingCode(true);
    });

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setCodeEmail(email);
        setVerifyingCode(false);
      })
      .catch((err) => {
        console.error("[Reset Password] Error verifying code:", err);
        setCodeError(
          t("auth.verifyError") ||
            "Il codice di verifica è scaduto, non è valido o è già stato utilizzato."
        );
        setVerifyingCode(false);
      });
  }, [oobCode, t]);

  // Invio email per reset password (Scenario A)
  const onSubmitRequest: SubmitHandler<RequestResetInput> = useCallback(
    async (data) => {
      setLoading(true);
      setGlobalError("");
      try {
        // Backend indurito: anti-enumeration (risposta SEMPRE 200, invio in background via SMTP
        // KALEX). Nessun ramo user-not-found lato client, che rivelerebbe quali account esistono.
        const res = await fetchWithAppCheck("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email })
        });
        if (!res.ok) {
          throw new Error("forgot-password request failed");
        }
        setEmailSent(true);
      } catch (err) {
        console.error("[Reset Password] forgot-password error:", err);
        setGlobalError("Si è verificato un errore durante l'invio dell'email. Riprova.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Salvataggio nuova password (Scenario B)
  const onSubmitNewPass: SubmitHandler<NewPasswordInput> = useCallback(
    async (data) => {
      if (!oobCode) return;
      setLoading(true);
      setGlobalError("");
      try {
        // Backend indurito: applica HIBP + policy KALEX e consuma l'oobCode via Identity Toolkit.
        const res = await fetchWithAppCheck("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oobCode, newPassword: data.password })
        });
        const body = (await res.json().catch(() => ({}))) as { success?: boolean; error?: { code?: string; message?: string } };
        if (!res.ok || !body.success) {
          const code = body.error?.code;
          if (code === "auth/password-breached") {
            setGlobalError("Questa password è comparsa in violazioni di dati note: scegline una diversa.");
          } else if (code === "auth/invalid-oobcode") {
            setGlobalError("Il codice di verifica è scaduto o non è valido. Richiedi un nuovo link.");
          } else {
            setGlobalError("Errore durante il salvataggio della password. Riprova.");
          }
          return;
        }
        setResetSuccess(true);
      } catch (err) {
        console.error("[Reset Password] reset-password error:", err);
        setGlobalError("Errore durante il salvataggio della password. Riprova.");
      } finally {
        setLoading(false);
      }
    },
    [oobCode]
  );

  // Ritorno al login mantenendo i query params (es. client_id)
  const getErrorMessage = useCallback((errorObj?: { message?: string }) => {
    if (!errorObj || !errorObj.message) return "";
    if (errorObj.message.startsWith("validation.")) {
      return t(errorObj.message as Parameters<typeof t>[0]);
    }
    return errorObj.message;
  }, [t]);

  const handleBackToLogin = useCallback(() => {
    const loginUrl = new URL(`${window.location.origin}/${currentLocale}/auth`);
    searchParams.forEach((value, key) => {
      if (key !== "oobCode") {
        loginUrl.searchParams.set(key, value);
      }
    });
    router.push(loginUrl.pathname + loginUrl.search);
  }, [currentLocale, router, searchParams]);

  // Cornice unica AuthArea: il banner errore globale usa la prop standard
  // `error` della card (niente banner custom).
  return (
    <AuthArea brand={brand} brandName={brandName} error={globalError || undefined}>
          {/* VERIFYING CODE LOADER */}
          {verifyingCode && (
            <div className="text-center my-8">
              <Loader2 className="w-10 h-10 text-secondary animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Verifica del codice in corso...
              </p>
            </div>
          )}

          {/* CODE VERIFICATION ERROR */}
          {codeError && !verifyingCode && (
            <AuthStatusCard
              variant="error"
              title="Codice Non Valido"
              description={codeError || undefined}
              primaryAction={{ label: t("auth.backToLogin"), onClick: handleBackToLogin }}
            />
          )}

          {/* SCENARIO A: RICHIESTA RESET EMAIL (Codice oobCode assente) */}
          {!oobCode && !emailSent && !verifyingCode && !codeError && (
            <AuthFormResetPassword
              mode="request"
              email={emailRequestValue}
              onEmailChange={(v) => setValueRequest("email", v, { shouldValidate: true, shouldDirty: true })}
              emailError={getErrorMessage(errorsRequest.email)}
              onSubmit={handleSubmitRequest(onSubmitRequest)}
              onBack={handleBackToLogin}
              loading={loading}
              gradientClassName={brand.logoColor}
            />
          )}

          {/* EMAIL INVIATA CON SUCCESSO */}
          {emailSent && !oobCode && (
            <AuthStatusCard
              variant="success"
              title={t("auth.resetEmailSentTitle")}
              description={t("auth.resetPasswordEmailSent")}
              primaryAction={{ label: t("auth.backToLogin"), onClick: handleBackToLogin }}
            />
          )}

          {/* SCENARIO B: IMPOSTAZIONE NUOVA PASSWORD (Codice oobCode presente e valido) */}
          {oobCode && !resetSuccess && !verifyingCode && !codeError && (
            <AuthFormResetPassword
              mode="confirm"
              targetEmail={codeEmail || undefined}
              password={passwordNewValue}
              confirmPassword={confirmPasswordNewValue}
              onPasswordChange={(v) => setValueNewPass("password", v, { shouldValidate: true, shouldDirty: true })}
              onConfirmPasswordChange={(v) => setValueNewPass("confirmPassword", v, { shouldValidate: true, shouldDirty: true })}
              passwordError={getErrorMessage(errorsNewPass.password)}
              confirmPasswordError={getErrorMessage(errorsNewPass.confirmPassword)}
              onSubmit={handleSubmitNewPass(onSubmitNewPass)}
              onBack={handleBackToLogin}
              loading={loading}
              gradientClassName={brand.logoColor}
            />
          )}

          {/* SUCCESSO RESET PASSWORD */}
          {resetSuccess && (
            <AuthStatusCard
              variant="success"
              title={t("auth.passwordUpdatedTitle")}
              description={t("auth.passwordResetSuccess")}
              primaryAction={{ label: t("auth.backToLogin"), onClick: handleBackToLogin }}
            />
          )}
    </AuthArea>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <ResetPasswordPortal />
    </Suspense>
  );
}
