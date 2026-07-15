"use client";

import React from "react";
import { KeyRound } from "lucide-react";
import { Input } from "../ui";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { fmtUI, useUIStrings } from "../../lib/ui.localization";

/**
 * Step MFA del login (challenge TOTP) — card DS `auth/AuthFormMfa`.
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
  gradientClassName,
  className = "",
}) => {
  const s = useUIStrings();

  return (
    <form onSubmit={onSubmit} className={`space-y-5 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{s.auth.mfa.title}</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400">
          {fmtUI(s.auth.mfa.totpPrompt, { factor: factorHint })}
        </p>
      </div>

      <Input
        type="text"
        name="mfaCode"
        maxLength={6}
        autoComplete="one-time-code"
        label={s.auth.mfa.code}
        placeholder="123456"
        icon={<KeyRound className="w-4 h-4" />}
        className="text-center tracking-widest font-mono"
        value={code}
        onValueChange={onCodeChange}
      />

      <AuthSubmitButton loading={loading} gradientClassName={gradientClassName}>
        {s.auth.mfa.submit}
      </AuthSubmitButton>

      {/* Recovery con codice di backup: degrada l'account a password-only lato server */}
      {!showBackup ? (
        <button
          type="button"
          onClick={() => onToggleBackup(true)}
          className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-secondary dark:hover:text-secondary underline mt-2 cursor-pointer bg-transparent border-0 outline-none block"
        >
          {s.auth.mfa.backupCta}
        </button>
      ) : (
        <div className="flex flex-col gap-2 mt-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-3">
          <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">{s.auth.mfa.backupPrompt}</p>
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
      )}

      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-xs font-semibold text-secondary hover:underline mt-4 cursor-pointer bg-transparent border-0 outline-none block"
      >
        {s.auth.backToLogin}
      </button>
    </form>
  );
};

AuthFormMfa.displayName = "AuthFormMfa";
