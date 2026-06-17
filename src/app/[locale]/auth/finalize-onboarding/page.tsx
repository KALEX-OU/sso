"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import { useCurrentLocale } from "@/locales/client";
import { Card, Button, Input, Label, TextField } from "@heroui/react";
import { Shield, AlertTriangle, CheckCircle2, Lock } from "lucide-react";

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

export default function FinalizeOnboardingPage() {
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email") || "";
  const clientId = searchParams.get("client_id") || "default";

  const brand = BRAND_CONFIGS[clientId] || BRAND_CONFIGS.default;
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
  const activeBgGradient = isDark ? brand.bgGradientDark : brand.bgGradientLight;
  const activeGlowColor = isDark ? brand.glowColorDark : brand.glowColorLight;

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (!email) {
      setError("Inserisci il tuo indirizzo email.");
      return;
    }

    if (password.length < 8) {
      setError("La password deve contenere almeno 8 caratteri.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verifica se il link è un email link valido di Firebase Auth
      const isEmailLink = isSignInWithEmailLink(auth, window.location.href);
      if (!isEmailLink) {
        throw new Error("Il link di attivazione non è valido o è scaduto. Richiedi un nuovo invito.");
      }

      setStatusMessage("Verifica del link d'invito in corso...");
      // 2. Accedi con il link dell'email
      const signInResult = await signInWithEmailLink(auth, email, window.location.href);
      const firebaseUser = signInResult.user;

      if (!firebaseUser) {
        throw new Error("Impossibile autenticare l'utente dal link d'invito.");
      }

      setStatusMessage("Configurazione della password...");
      // 3. Imposta la password definitiva
      await updatePassword(firebaseUser, password);

      setStatusMessage("Attivazione dei permessi e dell'account...");
      // 4. Esegui la chiamata al backend per finalizzare l'account e sincronizzare i claims
      const idToken = await firebaseUser.getIdToken(true);
      const response = await fetchWithAppCheck("/api/auth/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        }
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || data.error || "Errore durante il salvataggio dei dettagli dell'account.");
      }

      // Forza il refresh del token per caricare i claims finali
      await firebaseUser.getIdToken(true);

      setSuccess(true);
      setStatusMessage("Account attivato con successo! Reindirizzamento alla console...");
      
      setTimeout(() => {
        router.push(`/${currentLocale}`);
      }, 2000);
    } catch (err) {
      console.error("[Finalize Onboarding] Error:", err);
      // Gestione errori sicura per Zero any
      const errMessage = err instanceof Error ? err.message : "Errore sconosciuto durante la finalizzazione.";
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative p-6 overflow-hidden bg-gradient-to-tr ${activeBgGradient} transition-all duration-700`}>
      {/* Background Glows */}
      <div className={`absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full blur-[10rem] -translate-x-1/2 -translate-y-1/2 ${activeGlowColor} pointer-events-none transition-all duration-700`} />
      <div className={`absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] rounded-full blur-[9rem] translate-x-1/2 translate-y-1/2 ${activeGlowColor} pointer-events-none transition-all duration-700`} />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo Brand */}
        <div className="flex items-center gap-2 mb-8 select-none scale-90 md:scale-100">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${brand.logoColor} flex items-center justify-center shadow-lg`}>
            <Shield className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-widest text-slate-900 dark:text-white">
            {brand.name}
          </span>
        </div>

        <Card className="w-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
          <Card.Content className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Attiva il tuo Account</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Imposta una password sicura per iniziare a collaborare.</p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-red-500">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-gray-300">{statusMessage}</p>
                <div className="flex justify-center"><span className="animate-spin rounded-full h-6 w-6 border-t-2 border-emerald-500"></span></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField isRequired className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">La tua Email</Label>
                  <Input
                    type="email"
                    placeholder="nome.cognome@azienda.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={!!emailParam}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all disabled:opacity-60"
                  />
                </TextField>

                <TextField isRequired className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Nuova Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                  />
                </TextField>

                <TextField isRequired className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Conferma Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                  />
                </TextField>

                {statusMessage && (
                  <p className="text-[10px] text-purple-400 font-semibold text-center mt-1 animate-pulse">{statusMessage}</p>
                )}

                <Button
                  type="submit"
                  isDisabled={loading}
                  className="w-full py-5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-slate-950"></span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-950" />
                  )}
                  {loading ? "Attivazione..." : "Attiva Account"}
                </Button>
              </form>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
