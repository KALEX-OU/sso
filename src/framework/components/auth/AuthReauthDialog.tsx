"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Input, InputOTP, Label, Modal } from "../ui";
import { Lock, AlertTriangle } from "lucide-react";
import { fmtUI, useUIStrings } from "../../lib/ui.localization";

/**
 * Dialog di ri-autenticazione step-up (178) — card DS `auth/AuthReauthDialog`.
 *
 * Presentazionale e controllato: la logica Firebase (reauthenticateWithCredential,
 * MultiFactorResolver) resta nel chiamante (ReauthProvider, settings). Due step:
 * conferma password e — se l'utente ha MFA TOTP attiva — codice a 6 cifre con
 * auto-submit al completamento. I valori dei campi vivono qui dentro e si
 * azzerano a ogni apertura/cambio step; errori e loading arrivano dal chiamante.
 */
export interface AuthReauthDialogProps {
  isOpen: boolean;
  /** Step corrente: conferma password oppure verifica del secondo fattore. */
  step: "password" | "mfa";
  /** Nome del fattore mostrato nel prompt dello step mfa. */
  factorHint?: string;
  error?: string;
  loading?: boolean;
  onSubmitPassword: (password: string) => void;
  onSubmitCode: (code: string) => void;
  onCancel: () => void;
  /** Invocata alla prima digitazione dopo un errore (per azzerarlo nel chiamante). */
  onErrorClear?: () => void;
  className?: string;
}

export const AuthReauthDialog: React.FC<AuthReauthDialogProps> = ({
  isOpen,
  step,
  factorHint = "",
  error = "",
  loading = false,
  onSubmitPassword,
  onSubmitCode,
  onCancel,
  onErrorClear,
  className = "",
}) => {
  const s = useUIStrings();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const otpFormRef = useRef<HTMLFormElement>(null);

  // Reset dei campi a ogni apertura/cambio step (hook PRIMA dell'early-return).
  useEffect(() => {
    setPassword("");
    setCode("");
  }, [isOpen, step]);

  // Montato solo quando aperto (regola a11y sui dialoghi controllati).
  if (!isOpen) return null;

  const clearErrorOnType = () => {
    if (error) onErrorClear?.();
  };

  const footerButtons = (canSubmit: boolean) => (
    <div className="flex justify-end gap-3 pt-1">
      <Button variant="ghost" onPress={onCancel}>
        {s.common.cancel}
      </Button>
      <Button type="submit" variant="primary" isDisabled={loading || !canSubmit}>
        {loading ? s.auth.reauth.verifying : s.auth.reauth.confirm}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <Modal.Backdrop
        isDismissable
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-4"
      >
        <Modal.Container
          className={`bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl klx-motion-overlay-in ${className}`}
        >
          <Modal.Dialog aria-label={s.auth.reauth.title} className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-secondary">
              <Lock className="w-5 h-5" aria-hidden />
              <h3 className="text-base font-extrabold uppercase tracking-wider">
                {s.auth.reauth.title}
              </h3>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-danger"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                <span className="text-[11px] leading-relaxed">{error}</span>
              </div>
            )}

            {step === "mfa" ? (
              <>
                <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                  {fmtUI(s.auth.reauth.mfaPrompt, { factor: factorHint })}
                </p>
                <form
                  ref={otpFormRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (code.length === 6) onSubmitCode(code);
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <Label className="klx-label">{s.auth.mfa.code}</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        autoFocus
                        value={code}
                        onChange={(value) => { setCode(value); clearErrorOnType(); }}
                        onComplete={() => otpFormRef.current?.requestSubmit()}
                        aria-label={s.auth.mfa.code}
                        autoComplete="one-time-code"
                      >
                        <InputOTP.Group>
                          <InputOTP.Slot index={0} />
                          <InputOTP.Slot index={1} />
                          <InputOTP.Slot index={2} />
                        </InputOTP.Group>
                        <InputOTP.Separator />
                        <InputOTP.Group>
                          <InputOTP.Slot index={3} />
                          <InputOTP.Slot index={4} />
                          <InputOTP.Slot index={5} />
                        </InputOTP.Group>
                      </InputOTP>
                    </div>
                  </div>
                  {footerButtons(code.length === 6)}
                </form>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                  {s.auth.reauth.passwordPrompt}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (password) onSubmitPassword(password);
                  }}
                  className="flex flex-col gap-4"
                >
                  <Input
                    type="password"
                    autoFocus
                    required
                    placeholder={s.auth.passwordPlaceholder}
                    aria-label={s.auth.passwordLabel}
                    autoComplete="current-password"
                    value={password}
                    onValueChange={(value) => { setPassword(value); clearErrorOnType(); }}
                  />
                  {footerButtons(password.length > 0)}
                </form>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

AuthReauthDialog.displayName = "AuthReauthDialog";
