"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import { useCurrentLocale } from "@/locales/client";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
import { Button, Input, Label, TextField } from "@/framework/components/ui";
import { CheckCircle2, Lock } from "lucide-react";
// Cornice unica del portale auth (framework, speculare a user/UserArea):
// glow, toggle tema/lingua, Logo del verticale, footer legale, marketing.
import { AuthArea } from "@/framework/components/auth/AuthArea";
import { useAuthBrand } from "../_shared/auth-portal";

export default function FinalizeOnboardingPage() {
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email") || "";
  // Estetica del verticale attivo (client_id → brand, _shared/auth-portal).
  const { brand, brandName } = useAuthBrand();

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

  // Cornice unica AuthArea (logo compatto, banner errore standard della card).
  return (
    <AuthArea brand={brand} brandName={brandName} showHeader={false} cardClassName="max-w-md" error={error || undefined}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Attiva il tuo Account</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Imposta una password sicura per iniziare a collaborare.</p>
            </div>

            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-success/10 border border-success/20 rounded-2xl text-success mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-gray-300">{statusMessage}</p>
                <div className="flex justify-center"><span className="animate-spin rounded-full h-6 w-6 border-t-2 border-success"></span></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField isRequired className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">La tua Email</Label>
                  <Input
                    isRequired
                    type="email"
                    placeholder="nome.cognome@azienda.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={!!emailParam}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all disabled:opacity-60"
                  />
                </TextField>

                <TextField isRequired className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Nuova Password</Label>
                  <Input
                    isRequired
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                  />
                </TextField>

                <TextField isRequired className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Conferma Password</Label>
                  <Input
                    isRequired
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                  />
                </TextField>

                {statusMessage && (
                  <p className="text-[10px] text-secondary font-semibold text-center mt-1 animate-pulse">{statusMessage}</p>
                )}

                <Button
                  unstyled
                  type="submit"
                  isDisabled={loading}
                  className="w-full py-5 font-bold bg-gradient-to-r from-secondary to-accent text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-6"
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
          </div>
    </AuthArea>
  );
}
