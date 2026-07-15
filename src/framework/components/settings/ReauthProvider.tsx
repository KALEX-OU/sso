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
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  type MultiFactorResolver
} from "firebase/auth";
import { auth } from "../../lib/auth";
import { registerReauthHandler } from "../../lib/reauth-bridge";
import { AuthReauthDialog } from "../auth/AuthReauthDialog";
import { useI18n } from "@/locales/client";

export function ReauthProvider({ children }: { children: React.ReactNode }) {
  const t = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [mfaHint, setMfaHint] = useState("");
  const [mfaTotpUid, setMfaTotpUid] = useState("");

  // Resolver della Promise restituita da requestReauth: true = reauth completata, false = annullata.
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  const resetFields = useCallback(() => {
    setMfaResolver(null);
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
  const handlePasswordSubmit = async (password: string) => {
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
  const handleMfaVerify = async (code: string) => {
    if (!mfaResolver || !code) return;
    try {
      setPending(true);
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(mfaTotpUid, code);
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
        <AuthReauthDialog
          isOpen={open}
          step={mfaResolver ? "mfa" : "password"}
          factorHint={mfaHint}
          error={error}
          loading={pending}
          onSubmitPassword={handlePasswordSubmit}
          onSubmitCode={handleMfaVerify}
          onCancel={() => finish(false)}
          onErrorClear={() => setError("")}
        />
      )}
    </>
  );
}

export default ReauthProvider;
