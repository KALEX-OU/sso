"use client";

import React, { useRef } from "react";
import { Checkbox, Input, InputOTP, Label } from "../ui";
import { AuthForm } from "./AuthForm";
import { fmtUI, useUIStrings } from "../../lib/ui.localization";

/**
 * Step MFA del login (challenge TOTP) — card DS `auth/AuthFormMfa`.
 * Costruito sulla BASE `AuthForm` (CTA/footer comuni alla famiglia).
 *
 * NON è una route: il MultiFactorResolver Firebase vive in memoria JS, quindi
 * questo componente è renderizzato condizionalmente dentro `/auth/login`.
 * Presentazionale e controllato; include il sotto-stato di recovery con
 * codice di backup (per chi ha perso il dispositivo TOTP).
 */
export interface AuthFormMfaProps {
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  /** Nome del fattore mostrato nel prompt (es. "la tua app di autenticazione"). */
  factorHint: string;
  loading?: boolean;
  /** Recovery con codice di backup. */
  showBackup: boolean;
  onToggleBackup: (open: boolean) => void;
  backupCode: string;
  onBackupCodeChange: (value: string) => void;
  onBackupSubmit: () => void;
  backupLoading?: boolean;
  backupMessage?: { type: "ok" | "err"; text: string } | null;
  onBack: () => void;
  /** Fiducia dispositivo (N3): checkbox "non chiedere per 30 giorni". Mostrata solo se onTrustDeviceChange è fornita. */
  trustDevice?: boolean;
  onTrustDeviceChange?: (value: boolean) => void;
  gradientClassName?: string;
  className?: string;
}

export const AuthFormMfa: React.FC<AuthFormMfaProps> = ({
  code,
  onCodeChange,
  onSubmit,
  factorHint,
  loading = false,
  showBackup,
  onToggleBackup,
  backupCode,
  onBackupCodeChange,
  onBackupSubmit,
  backupLoading = false,
  backupMessage = null,
  onBack,
  trustDevice = false,
  onTrustDeviceChange,
  gradientClassName,
  className = "",
}) => {
  const s = useUIStrings();
  const formRef = useRef<HTMLFormElement>(null);

  const backupSection = !showBackup ? (
    <button
      type="button"
      onClick={() => onToggleBackup(true)}
      className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-secondary dark:hover:text-secondary underline mt-2 cursor-pointer bg-transparent border-0 outline-none block"
    >
      {s.auth.mfa.backupCta}
    </button>
  ) : (
    <div className="flex flex-col gap-2 mt-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-line p-3">
      <p className="text-[11px] text-ink-muted leading-relaxed">{s.auth.mfa.backupPrompt}</p>
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          name="backupCode"
          aria-label={s.auth.mfa.backupCta}
          placeholder="XXXXX-XXXXX"
          className="text-center tracking-wider font-mono"
          value={backupCode}
          onValueChange={onBackupCodeChange}
        />
        <button
          type="button"
          onClick={onBackupSubmit}
          disabled={backupLoading || !backupCode.trim()}
          className="px-4 h-12 shrink-0 font-bold bg-slate-800 dark:bg-white/10 text-white rounded-xl cursor-pointer whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed border-0"
        >
          {s.auth.mfa.backupSubmit}
        </button>
      </div>
      {backupMessage && (
        <p className={`text-[11px] font-semibold ${backupMessage.type === "ok" ? "text-success" : "text-danger"}`}>
          {backupMessage.text}
        </p>
      )}
      <button
        type="button"
        onClick={() => onToggleBackup(false)}
        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-500 self-start bg-transparent border-0 cursor-pointer outline-none"
      >
        {s.auth.mfa.backupCancel}
      </button>
    </div>
  );

  return (
    <AuthForm
      onSubmit={onSubmit}
      formRef={formRef}
      submitLabel={s.auth.mfa.submit}
      loading={loading}
      gradientClassName={gradientClassName}
      className={className}
      footer={
        <>
          {backupSection}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-xs font-semibold text-secondary hover:underline mt-4 cursor-pointer bg-transparent border-0 outline-none block"
          >
            {s.auth.backToLogin}
          </button>
        </>
      }
    >
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-ink mb-1">{s.auth.mfa.title}</h3>
        <p className="text-xs text-ink-muted">
          {fmtUI(s.auth.mfa.totpPrompt, { factor: factorHint })}
        </p>
      </div>

      {/* Codice a 6 cifre su InputOTP: autofocus, paste supportato e
          AUTO-SUBMIT al completamento (requestSubmit sul form della base). */}
      <div className="flex flex-col gap-1.5">
        <Label className="klx-label">{s.auth.mfa.code}</Label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            autoFocus
            value={code}
            onChange={onCodeChange}
            onComplete={() => formRef.current?.requestSubmit()}
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

      {/* Fiducia dispositivo (N3): opt-in "non chiedere per 30 giorni" — il consumer
          la concretizza SOLO dopo il resolveSignIn riuscito (POST trust-device). */}
      {onTrustDeviceChange && (
        <div className="mt-4 flex justify-center">
          <Checkbox
            isSelected={trustDevice}
            onChange={onTrustDeviceChange}
            className="text-xs text-ink-muted select-none cursor-pointer flex flex-row items-center gap-3"
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label className="text-xs text-ink-muted select-none cursor-pointer">
                {s.auth.mfa.trustDevice}
              </Label>
            </Checkbox.Content>
          </Checkbox>
        </div>
      )}

    </AuthForm>
  );
};

AuthFormMfa.displayName = "AuthFormMfa";
