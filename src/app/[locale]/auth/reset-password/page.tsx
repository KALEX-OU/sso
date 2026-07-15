"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import {
  verifyPasswordResetCode
} from "firebase/auth";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: il padding root è
// stato ridotto di conseguenza per mantenere l'ingombro precedente.
import {
  Button,
  Card,
  CardContent,
} from "@/framework/components/ui";
import { AuthLayout } from "@/framework/components/auth/AuthLayout";
import { AuthFormResetPassword } from "@/framework/components/auth/AuthFormResetPassword";
import { GlobalLoader } from "@/framework/components/ui";
import { useTheme } from "next-themes";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { Sun, Moon, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useBrand } from "@/framework/components/providers/BrandProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Configurazione brand speculare ad auth/page.tsx.
// `name: null` = il nome segue il brand white-label attivo (useBrand, E5.1).
const BRAND_CONFIGS: Record<
  string,
  {
    name: string | null;
    bgGradientLight: string;
    bgGradientDark: string;
    glowColorLight: string;
    glowColorDark: string;
    logoColor: string;
  }
> = {
  satefy: {
    name: "SATEFY",
    bgGradientLight: "from-success/10 via-slate-50 to-teal-100/20",
    bgGradientDark: "from-success/10 via-slate-950 to-teal-950/15",
    glowColorLight: "bg-success/5",
    glowColorDark: "bg-success/10",
    logoColor: "from-success to-teal-500"
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
    name: null,
    bgGradientLight: "from-secondary/10 via-slate-50 to-accent/20",
    bgGradientDark: "from-secondary/15 via-slate-950 to-accent/15",
    glowColorLight: "bg-secondary/5",
    glowColorDark: "bg-secondary/10",
    logoColor: "from-secondary to-accent"
  }
};

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
  const { setTheme, resolvedTheme } = useTheme();

  const oobCode = searchParams.get("oobCode");
  const clientId = searchParams.get("client_id") || "default";
  const brand = BRAND_CONFIGS[clientId] || BRAND_CONFIGS.default;
  // Brand white-label attivo: il default non cabla più "KALEX" (E5.1).
  const wlBrand = useBrand();
  const brandName = brand.name ?? wlBrand.name;

  const isDark = resolvedTheme === "dark";
  const activeBgGradient = isDark ? brand.bgGradientDark : brand.bgGradientLight;
  const activeGlowColor = isDark ? brand.glowColorDark : brand.glowColorLight;

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

  return (
    <AuthLayout variant="centered" className={`bg-gradient-to-br ${activeBgGradient}`}>
      {/* Glow Ambientale — RTL: fisico voluto, centraggio simmetrico (left-1/2 + -translate-x-1/2) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full filter blur-[120px] pointer-events-none ${activeGlowColor} opacity-50`}
      ></div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Controllo Tema in alto a destra */}
      <div className="absolute top-6 end-6 z-20">
        <Button
          unstyled
          isIconOnly
          variant="ghost"
          size="sm"
          className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full transition-all"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
      </div>

      <AuthLayout.Form>
      <Card className="w-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl p-3 rounded-3xl">
        <CardContent className="flex flex-col p-2">
          {/* Logo e Titolo */}
          <div className="text-center mb-6">
            <span
              className={`text-4xl font-extrabold bg-gradient-to-r ${brand.logoColor} bg-clip-text text-transparent tracking-tighter`}
            >
              {brandName}
            </span>
            <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold mt-1 tracking-wider uppercase">
              {t("auth.subtitle")}
            </p>
          </div>

          {/* ERRORE GLOBALE O STRIPE/AUTH ERROR */}
          {globalError && (
            <div className="bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 rounded-2xl p-3 text-xs mb-6 text-center font-medium w-full">
              {globalError}
            </div>
          )}

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
            <div className="text-center my-6 space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-red-500">Codice Non Valido</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                {codeError}
              </p>
              <Button
                unstyled
                onClick={handleBackToLogin}
                className="mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-5 px-6 cursor-pointer"
              >
                {t("auth.backToLogin")}
              </Button>
            </div>
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
            <div className="text-center my-6 space-y-4">
              <div className="w-12 h-12 bg-success/10 border border-success/25 dark:border-success/20 rounded-full flex items-center justify-center mx-auto text-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-success">{t("auth.resetEmailSentTitle")}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                {t("auth.resetPasswordEmailSent")}
              </p>
              <Button
                unstyled
                onClick={handleBackToLogin}
                className="mt-6 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-6 cursor-pointer"
              >
                {t("auth.backToLogin")}
              </Button>
            </div>
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
            <div className="text-center my-6 space-y-4">
              <div className="w-12 h-12 bg-success/10 border border-success/25 dark:border-success/20 rounded-full flex items-center justify-center mx-auto text-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-success">{t("auth.passwordUpdatedTitle")}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                {t("auth.passwordResetSuccess")}
              </p>
              <Button
                unstyled
                onClick={handleBackToLogin}
                className="mt-6 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-6 cursor-pointer"
              >
                {t("auth.backToLogin")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      </AuthLayout.Form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <ResetPasswordPortal />
    </Suspense>
  );
}
