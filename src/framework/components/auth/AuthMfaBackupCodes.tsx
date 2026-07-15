"use client";

import React from "react";
import { Button } from "../ui";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * Visualizzazione one-shot dei codici di backup MFA (N1, AUTH v1.2.1) —
 * card DS `auth/AuthMfaEnrollment` (sezione dedicata).
 *
 * Presentazionale: la generazione (POST /user/mfa/backup-codes) resta al
 * consumer; qui solo il pannello "mostrati una volta" con copia, download .txt
 * e chiusura esplicita. I codici NON vengono persistiti da questo componente.
 */
export interface AuthMfaBackupCodesProps {
  codes: string[];
  /** Chiusura esplicita del pannello ("li ho salvati"). */
  onDone: () => void;
  /** Esito della copia negli appunti (per il toast del consumer). */
  onCopyResult?: (ok: boolean) => void;
  /** Nome del file scaricato. */
  downloadFileName?: string;
  className?: string;
}

export const AuthMfaBackupCodes: React.FC<AuthMfaBackupCodesProps> = ({
  codes,
  onDone,
  onCopyResult,
  downloadFileName = "backup-codes.txt",
  className = "",
}) => {
  const s = useUIStrings();

  if (codes.length === 0) return null;

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      onCopyResult?.(true);
    } catch {
      onCopyResult?.(false);
    }
  };

  const downloadCodes = () => {
    const blob = new Blob([codes.join("\n") + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="region"
      aria-label={s.auth.mfaBackup.warning}
      className={`flex flex-col gap-2 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 ${className}`}
    >
      <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
        {s.auth.mfaBackup.warning}
      </p>
      <div className="grid grid-cols-2 gap-1.5 font-mono text-sm text-slate-800 dark:text-white">
        {codes.map((code) => (
          <span key={code} className="tracking-wider select-all">{code}</span>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button onPress={() => void copyCodes()} variant="ghost">{s.auth.mfaBackup.copy}</Button>
        <Button onPress={downloadCodes} variant="ghost">{s.auth.mfaBackup.download}</Button>
        <Button onPress={onDone} variant="primary">{s.auth.mfaBackup.done}</Button>
      </div>
    </div>
  );
};

AuthMfaBackupCodes.displayName = "AuthMfaBackupCodes";
