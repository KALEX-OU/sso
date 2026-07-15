"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Check, Copy } from "lucide-react";
import { Button, InputOTP, Label } from "../ui";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * Enrollment TOTP componentizzato (N1, AUTH v1.2.1) — card DS `auth/AuthMfaEnrollment`.
 *
 * Presentazionale: la generazione del segreto (multiFactor().getSession +
 * TotpMultiFactorGenerator.generateSecret) e l'enroll restano al consumer
 * (SettingsMfa oggi, gate di enrollment al login in futuro). Qui: QR
 * `otpauth://`, chiave manuale con copia, link "apri nell'app" e conferma del
 * primo codice su InputOTP con auto-submit.
 */
export interface AuthMfaEnrollmentProps {
  /** URI `otpauth://` per il QR e il link diretto all'app. */
  totpUri: string;
  /** Chiave segreta per l'inserimento manuale. */
  secretKey: string;
  onConfirm: (code: string) => void;
  onCancel: () => void;
  loading?: boolean;
  /** Esito della copia della chiave (per il toast del consumer). */
  onCopyResult?: (ok: boolean) => void;
  className?: string;
}

export const AuthMfaEnrollment: React.FC<AuthMfaEnrollmentProps> = ({
  totpUri,
  secretKey,
  onConfirm,
  onCancel,
  loading = false,
  onCopyResult,
  className = "",
}) => {
  const s = useUIStrings();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Feedback transitorio sull'icona di copia.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      onCopyResult?.(true);
    } catch {
      onCopyResult?.(false);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
        {s.auth.mfaEnroll.title}
      </Label>
      <p className="text-[11px] text-ink-muted leading-relaxed">
        {s.auth.mfaEnroll.instructions}
      </p>

      {/* QR da scansionare (sfondo bianco per la leggibilità anche in dark). */}
      {totpUri && (
        <div className="flex flex-col items-center gap-2 py-1">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <QRCode value={totpUri} size={160} />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {s.auth.mfaEnroll.scanHint}
          </span>
        </div>
      )}

      {/* Chiave manuale: alternativa allo scan del QR. */}
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 self-start">
        {s.auth.mfaEnroll.manualKeyLabel}
      </span>
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2 px-3.5 py-2.5">
        <code className="text-xs font-mono tracking-wider text-ink break-all flex-1">
          {secretKey}
        </code>
        <button
          type="button"
          onClick={() => void copyKey()}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white outline-none bg-transparent border-none cursor-pointer shrink-0"
          aria-label={s.auth.mfaEnroll.copyKey}
        >
          {copied ? <Check className="w-4 h-4 text-success" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
        </button>
      </div>
      {totpUri && (
        <a
          href={totpUri}
          className="text-[10px] font-extrabold uppercase tracking-wider text-secondary hover:text-secondary self-start"
        >
          {s.auth.mfaEnroll.openInApp}
        </a>
      )}

      {/* Conferma del primo codice generato (auto-submit al completamento). */}
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) onConfirm(code);
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <Label className="klx-label">{s.auth.mfa.code}</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
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
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" onPress={onCancel}>
            {s.common.cancel}
          </Button>
          <Button type="submit" variant="primary" isDisabled={loading || code.length < 6}>
            {s.auth.mfaEnroll.confirm}
          </Button>
        </div>
      </form>
    </div>
  );
};

AuthMfaEnrollment.displayName = "AuthMfaEnrollment";
