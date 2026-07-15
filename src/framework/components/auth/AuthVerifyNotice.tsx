"use client";

import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "../ui";
import { fmtUI, useUIStrings } from "../../lib/ui.localization";

/**
 * Avviso "verifica la tua email" — card DS `auth/AuthVerifyNotice`.
 *
 * Step post-login/post-registrazione per account non verificati (NON è una
 * route: dipende da `auth.currentUser` in memoria). Presentazionale:
 * check/reinvio/uscita arrivano dal consumer. Il reinvio ha un cooldown
 * client-side (N2, AUTH v1.2.1) allineato ai rate-limit API.
 */
export interface AuthVerifyNoticeProps {
  /** Indirizzo a cui è stato inviato il link di verifica. */
  email: string;
  error?: string;
  /** Messaggio di conferma dopo il reinvio (es. "Email inviata!"). */
  resendSuccess?: string;
  onCheck: () => void;
  onResend: () => void;
  onBack: () => void;
  checking?: boolean;
  resendLoading?: boolean;
  /** Secondi di attesa tra un reinvio e il successivo (0 = disattivato). */
  resendCooldownSeconds?: number;
  gradientClassName?: string;
  className?: string;
}

export const AuthVerifyNotice: React.FC<AuthVerifyNoticeProps> = ({
  email,
  error,
  resendSuccess,
  onCheck,
  onResend,
  onBack,
  checking = false,
  resendLoading = false,
  resendCooldownSeconds = 30,
  gradientClassName = "from-secondary to-accent",
  className = "",
}) => {
  const s = useUIStrings();

  // Cooldown reinvio (N2): dopo un click il bottone resta disabilitato e mostra
  // il countdown; si riabilita a zero. Un solo interval attivo per countdown.
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const cooldownActive = cooldownLeft > 0;
  useEffect(() => {
    if (!cooldownActive) return;
    const id = setInterval(() => setCooldownLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldownActive]);

  const handleResend = () => {
    onResend();
    if (resendCooldownSeconds > 0) setCooldownLeft(resendCooldownSeconds);
  };

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
        <Mail className="w-8 h-8 text-slate-800 dark:text-white" />
      </div>

      <h2 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white">
        {s.auth.verify.title}
      </h2>
      <p className="text-slate-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
        {fmtUI(s.auth.verify.desc, { email })}
      </p>

      {error && (
        <div role="alert" className="bg-danger/10 border border-danger/25 dark:border-danger/20 text-danger rounded-2xl p-3 text-xs mb-4 text-center font-medium w-full">
          {error}
        </div>
      )}

      {resendSuccess && (
        <div role="status" className="bg-success/10 border border-success/25 dark:border-success/20 text-success rounded-2xl p-3 text-xs mb-4 text-center font-medium w-full">
          {resendSuccess}
        </div>
      )}

      <div className="space-y-3 w-full">
        <Button
          unstyled
          onClick={onCheck}
          isDisabled={checking}
          className={`w-full py-6 font-bold bg-gradient-to-r ${gradientClassName} text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2`}
        >
          {checking && (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>
          )}
          {s.auth.verify.button}
        </Button>

        <Button
          unstyled
          onClick={handleResend}
          isDisabled={resendLoading || cooldownActive}
          variant="outline"
          className="w-full py-6 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {resendLoading && (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-800 dark:border-white border-t-transparent"></span>
          )}
          {cooldownActive
            ? fmtUI(s.auth.verify.resendCooldown, { n: String(cooldownLeft) })
            : s.auth.verify.resendEmailButton}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white text-xs font-semibold underline mt-4 cursor-pointer block mx-auto bg-transparent border-0"
        >
          {s.auth.backToLogin}
        </button>
      </div>
    </div>
  );
};

AuthVerifyNotice.displayName = "AuthVerifyNotice";
