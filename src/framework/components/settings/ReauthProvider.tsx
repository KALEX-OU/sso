"use client";

// Provider globale di ri-autenticazione (step-up auth, 178).
//
// Montato in cima alla DashboardLayout, resta invisibile finché una chiamata API non riceve 403
// `auth/reauth-required` (operazione sensibile su sessione non fresca). A quel punto `fetchAuthedClient`
// invoca `requestReauth()` (via [[reauth-bridge]]) → questo provider apre un modal che raccoglie la
// password e, se l'utente ha MFA TOTP attiva, il codice del secondo fattore. Completata la
// `reauthenticateWithCredential`/`resolveSignIn`, Firebase rinfresca `auth_time`; il client rifà
// `getIdToken(true)` e ritenta l'operazione, che ora supera il guard server.
//
// Riusa fedelmente la stessa logica + chiavi i18n del dialog di reauth in `settings.tsx` (cambio
// password / eliminazione account), ma esposta app-wide e basata su Promise anziché su callback.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardBody, Input } from "../ui";
import { Lock, AlertTriangle } from "lucide-react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  type MultiFactorResolver
} from "firebase/auth";
import { auth } from "../../lib/auth";
import { registerReauthHandler } from "../../lib/reauth-bridge";
import { useI18n } from "@/locales/client";

export function ReauthProvider({ children }: { children: React.ReactNode }) {
  const t = useI18n();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaHint, setMfaHint] = useState("");
  const [mfaTotpUid, setMfaTotpUid] = useState("");

  // Resolver della Promise restituita da requestReauth: true = reauth completata, false = annullata.
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  const resetFields = useCallback(() => {
    setPassword("");
    setMfaResolver(null);
    setMfaCode("");
    setMfaHint("");
    setMfaTotpUid("");
    setError("");
    setPending(false);
  }, []);

  // Chiude il modal e risolve la Promise pendente con l'esito.
  const finish = useCallback((ok: boolean) => {
    setOpen(false);
    resetFields();
    const resolve = resolveRef.current;
    resolveRef.current = null;
    if (resolve) resolve(ok);
  }, [resetFields]);

  // Registra l'handler nel bridge: apre il modal e ritorna una Promise risolta all'esito.
  useEffect(() => {
    const unregister = registerReauthHandler(() => {
      // Reauth già in corso (chiamate concorrenti): la seconda fallisce subito per non incrociare gli stati.
      if (resolveRef.current) return Promise.resolve(false);
      resetFields();
      setOpen(true);
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });
    });
    return unregister;
  }, [resetFields]);

  // Step 1: verifica la password. Se l'utente ha MFA, Firebase lancia multi-factor-auth-required
  // e passiamo allo step 2 (codice TOTP).
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !user.email) {
      finish(false);
      return;
    }
    try {
      setPending(true);
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      finish(true); // reauth completata senza secondo fattore
    } catch (err) {
      const authErr = err as { code?: string };
      if (authErr.code === "auth/multi-factor-auth-required") {
        try {
          const resolver = getMultiFactorResolver(auth, err as Parameters<typeof getMultiFactorResolver>[1]);
          const totpHint = resolver.hints.find((h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
          if (!totpHint) {
            throw new Error("Nessun secondo fattore TOTP risolvibile disponibile.");
          }
          setMfaResolver(resolver);
          setMfaTotpUid(totpHint.uid);
          setMfaHint(totpHint.displayName || t("settings.reauth.defaultHint"));
          setMfaCode("");
          setError("");
        } catch (mfaErr) {
          console.error("[Reauth MFA] Errore avvio secondo fattore:", mfaErr);
          setError(t("settings.toast.mfaStartFail"));
        }
        setPending(false);
        return;
      }
      console.error("[Reauth] Errore:", err);
      setError(
        authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential"
          ? t("settings.toast.reauthWrongPw")
          : t("settings.toast.reauthFail")
      );
    } finally {
      setPending(false);
    }
  };

  // Step 2: verifica il codice TOTP del fattore esistente e completa la reauth.
  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaResolver || !mfaCode) return;
    try {
      setPending(true);
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(mfaTotpUid, mfaCode);
      await mfaResolver.resolveSignIn(assertion);
      finish(true);
    } catch (err) {
      console.error("[Reauth MFA] Errore verifica:", err);
      setError(t("settings.toast.codeInvalidExpired"));
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {children}
      {open && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <Card className="max-w-md w-full border border-secondary/20 bg-slate-950 rounded-3xl p-6 shadow-2xl relative">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 text-secondary">
                <Lock className="w-5 h-5" />
                <h3 className="text-base font-extrabold uppercase tracking-wider">
                  {t("settings.reauth.title")}
                </h3>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-red-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{error}</span>
                </div>
              )}

              {mfaResolver ? (
                <>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("settings.reauth.mfaPromptBefore")} <strong>{mfaHint}</strong> {t("settings.reauth.mfaPromptAfter")}
                  </p>
                  <form onSubmit={handleMfaVerify} className="space-y-4">
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder={t("settings.reauth.codePlaceholder")}
                      required
                      value={mfaCode}
                      onChange={(e) => { setMfaCode(e.target.value); if (error) setError(""); }}
                      className="bg-white/5 dark:bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-white outline-none w-full text-center tracking-widest font-mono text-lg"
                    />
                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => finish(false)}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
                      >
                        {t("settings.common.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={pending || mfaCode.length < 6}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-secondary hover:bg-secondary/90 text-white rounded-xl active:scale-95 transition-all border-none flex items-center gap-1 shadow-lg cursor-pointer"
                      >
                        {pending ? t("settings.reauth.verifying") : t("settings.reauth.confirmCode")}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("settings.reauth.passwordPrompt")}
                  </p>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <Input
                      type="password"
                      placeholder={t("settings.reauth.passwordPlaceholder")}
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                      className="bg-white/5 dark:bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-white outline-none w-full"
                    />
                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => finish(false)}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
                      >
                        {t("settings.common.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={pending || !password}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-secondary hover:bg-secondary/90 text-white rounded-xl active:scale-95 transition-all border-none flex items-center gap-1 shadow-lg cursor-pointer"
                      >
                        {pending ? t("settings.reauth.verifying") : t("settings.reauth.reconfirm")}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}

export default ReauthProvider;
