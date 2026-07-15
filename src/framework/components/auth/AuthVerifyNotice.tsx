"use client";

import React from "react";
import { Mail } from "lucide-react";
import { Button } from "../ui";
import { fmtUI, useUIStrings } from "../../lib/ui.localization";

/**
 * Avviso "verifica la tua email" — card DS `auth/AuthVerifyNotice`.
 *
 * Step post-login/post-registrazione per account non verificati (NON è una
 * route: dipende da `auth.currentUser` in memoria). Presentazionale:
 * check/reinvio/uscita arrivano dal consumer.
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
  gradientClassName = "from-secondary to-accent",
  className = "",
}) => {
  const s = useUIStrings();

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
        <div className="bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 rounded-2xl p-3 text-xs mb-4 text-center font-medium w-full">
          {error}
        </div>
      )}

      {resendSuccess && (
        <div className="bg-success/10 border border-success/25 dark:border-success/20 text-success rounded-2xl p-3 text-xs mb-4 text-center font-medium w-full">
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
          onClick={onResend}
          isDisabled={resendLoading}
          variant="outline"
          className="w-full py-6 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {resendLoading && (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-800 dark:border-white border-t-transparent"></span>
          )}
          {s.auth.verify.resendEmailButton}
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
