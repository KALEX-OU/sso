"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode
} from "firebase/auth";
import {
  Button,
  Card,
  TextField,
  Label,
  Input,
  FieldError,
  InputGroup,
  InputGroupPrefix
} from "@heroui/react";
import { useTheme } from "next-themes";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { Sun, Moon, Mail, Lock, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Configurazione brand speculare ad auth/page.tsx
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
    bgGradientLight: "from-violet-100/40 via-slate-50 to-accent/20",
    bgGradientDark: "from-violet-950/25 via-slate-950 to-accent/15",
    glowColorLight: "bg-violet-500/5",
    glowColorDark: "bg-violet-500/10",
    logoColor: "from-violet-500 to-accent"
  }
};

// Definizione schemi di validazione localmente
const RequestResetSchema = z.object({
  email: z.string().email({ message: "Inserisci un indirizzo email valido." })
});
type RequestResetInput = z.infer<typeof RequestResetSchema>;

const NewPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "La password deve contenere almeno 6 caratteri." }),
    confirmPassword: z.string().min(6, { message: "La password deve contenere almeno 6 caratteri." })
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

function getFirebaseErrorCode(err: unknown): string {
  if (err && typeof err === "object" && "code" in err && typeof (err as { code: unknown }).code === "string") {
    return (err as { code: string }).code;
  }
  return "unknown";
}

function ResetPasswordPortal() {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTheme, resolvedTheme } = useTheme();

  const oobCode = searchParams.get("oobCode");
  const clientId = searchParams.get("client_id") || "default";
  const brand = BRAND_CONFIGS[clientId] || BRAND_CONFIGS.default;

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
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: errorsRequest }
  } = useForm<RequestResetInput>({
    resolver: zodResolver(RequestResetSchema),
    defaultValues: { email: "" }
  });

  // React Hook Form per l'impostazione nuova password (Scenario B)
  const {
    register: registerNewPass,
    handleSubmit: handleSubmitNewPass,
    formState: { errors: errorsNewPass }
  } = useForm<NewPasswordInput>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

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
        await sendPasswordResetEmail(auth, data.email);
        setEmailSent(true);
      } catch (err) {
        console.error("[Reset Password] sendPasswordResetEmail error:", err);
        const errorCode = getFirebaseErrorCode(err);
        if (errorCode === "auth/user-not-found") {
          setGlobalError("Nessun utente trovato con questo indirizzo email.");
        } else {
          setGlobalError("Si è verificato un errore durante l'invio dell'email. Riprova.");
        }
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
        await confirmPasswordReset(auth, oobCode, data.password);
        setResetSuccess(true);
      } catch (err) {
        console.error("[Reset Password] confirmPasswordReset error:", err);
        const errorCode = getFirebaseErrorCode(err);
        if (errorCode === "auth/expired-action-code") {
          setGlobalError("Il codice di verifica è scaduto. Richiedi un nuovo link.");
        } else if (errorCode === "auth/invalid-action-code") {
          setGlobalError("Il codice di verifica non è valido o è già stato utilizzato.");
        } else if (errorCode === "auth/weak-password") {
          setGlobalError("La password inserita è troppo debole.");
        } else {
          setGlobalError("Errore durante il salvataggio della password. Riprova.");
        }
      } finally {
        setLoading(false);
      }
    },
    [oobCode]
  );

  // Ritorno al login mantenendo i query params (es. client_id)
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
    <div
      className={`min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans p-6 bg-gradient-to-br ${activeBgGradient}`}
    >
      {/* Glow Ambientale */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full filter blur-[120px] pointer-events-none ${activeGlowColor} opacity-50`}
      ></div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Controllo Tema in alto a destra */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full transition-all"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
      </div>

      <Card className="max-w-md w-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl p-8 rounded-3xl relative z-10">
        <Card.Content className="flex flex-col p-2">
          {/* Logo e Titolo */}
          <div className="text-center mb-6">
            <span
              className={`text-4xl font-extrabold bg-gradient-to-r ${brand.logoColor} bg-clip-text text-transparent tracking-tighter`}
            >
              {brand.name}
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
              <Loader2 className="w-10 h-10 text-secondary dark:text-violet-400 animate-spin mx-auto mb-4" />
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
                onClick={handleBackToLogin}
                className="mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-5 px-6 cursor-pointer"
              >
                {t("auth.backToLogin")}
              </Button>
            </div>
          )}

          {/* SCENARIO A: RICHIESTA RESET EMAIL (Codice oobCode assente) */}
          {!oobCode && !emailSent && !verifyingCode && !codeError && (
            <form onSubmit={handleSubmitRequest(onSubmitRequest)} className="space-y-5">
              <div className="text-center mb-4">
                <h3 className="text-md font-bold text-slate-800 dark:text-white">
                  {t("auth.resetPasswordTitle")}
                </h3>
              </div>

              <TextField isInvalid={!!errorsRequest.email} className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                  {t("auth.email")}
                </Label>
                <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-violet-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                  <InputGroupPrefix className="flex items-center justify-center mr-2">
                    <Mail className="text-slate-400 flex-shrink-0 w-4 h-4" />
                  </InputGroupPrefix>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    {...registerRequest("email")}
                  />
                </InputGroup>
                <FieldError className="text-[11px] font-medium text-red-500 block mt-1" />
              </TextField>

              <Button
                type="submit"
                isDisabled={loading}
                className={`w-full py-6 font-bold bg-gradient-to-r ${brand.logoColor} text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-6`}
              >
                {loading && (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>
                )}
                {t("auth.sendResetLink")}
              </Button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-xs font-semibold text-secondary dark:text-violet-400 hover:underline mt-4 cursor-pointer bg-transparent border-0 outline-none block"
              >
                {t("auth.backToLogin")}
              </button>
            </form>
          )}

          {/* EMAIL INVIATA CON SUCCESSO */}
          {emailSent && !oobCode && (
            <div className="text-center my-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-emerald-600 dark:text-emerald-400">Email Inviata</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                {t("auth.resetPasswordEmailSent")}
              </p>
              <Button
                onClick={handleBackToLogin}
                className="mt-6 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-6 cursor-pointer"
              >
                {t("auth.backToLogin")}
              </Button>
            </div>
          )}

          {/* SCENARIO B: IMPOSTAZIONE NUOVA PASSWORD (Codice oobCode presente e valido) */}
          {oobCode && !resetSuccess && !verifyingCode && !codeError && (
            <form onSubmit={handleSubmitNewPass(onSubmitNewPass)} className="space-y-5">
              <div className="text-center mb-2">
                <h3 className="text-md font-bold text-slate-800 dark:text-white">
                  {t("auth.resetPasswordTitle")}
                </h3>
                {codeEmail && (
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 font-medium">
                    Per: <span className="text-slate-700 dark:text-slate-200 font-semibold">{codeEmail}</span>
                  </p>
                )}
              </div>

              <TextField isInvalid={!!errorsNewPass.password} className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                  {t("auth.newPassword")}
                </Label>
                <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-violet-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                  <InputGroupPrefix className="flex items-center justify-center mr-2">
                    <Lock className="text-slate-400 flex-shrink-0 w-4 h-4" />
                  </InputGroupPrefix>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    {...registerNewPass("password")}
                  />
                </InputGroup>
                <FieldError className="text-[11px] font-medium text-red-500 block mt-1" />
              </TextField>

              <TextField isInvalid={!!errorsNewPass.confirmPassword} className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                  {t("auth.confirmPassword")}
                </Label>
                <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-violet-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                  <InputGroupPrefix className="flex items-center justify-center mr-2">
                    <Lock className="text-slate-400 flex-shrink-0 w-4 h-4" />
                  </InputGroupPrefix>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    {...registerNewPass("confirmPassword")}
                  />
                </InputGroup>
                <FieldError className="text-[11px] font-medium text-red-500 block mt-1" />
              </TextField>

              <Button
                type="submit"
                isDisabled={loading}
                className={`w-full py-6 font-bold bg-gradient-to-r ${brand.logoColor} text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-6`}
              >
                {loading && (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>
                )}
                {t("auth.resetPasswordTitle")}
              </Button>
            </form>
          )}

          {/* SUCCESSO RESET PASSWORD */}
          {resetSuccess && (
            <div className="text-center my-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-emerald-600 dark:text-emerald-400">Password Aggiornata</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                {t("auth.passwordResetSuccess")}
              </p>
              <Button
                onClick={handleBackToLogin}
                className="mt-6 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-6 cursor-pointer"
              >
                {t("auth.backToLogin")}
              </Button>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4">
          <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/20"></span>
        </div>
      }
    >
      <ResetPasswordPortal />
    </Suspense>
  );
}
