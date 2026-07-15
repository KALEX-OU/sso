"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "../ui";

/**
 * Esito standard dei flussi di autenticazione — card DS `auth/AuthStatusCard`.
 *
 * Unifica i blocchi di stato prima duplicati nelle pagine (email di reset
 * inviata, codice non valido, password aggiornata, link di verifica scaduto…):
 * icona tonda per variante, titolo, descrizione e azioni. Annunciato agli
 * screen reader (`alert` per gli errori, `status` per gli esiti positivi).
 */
export type AuthStatusVariant = "success" | "error" | "info";

export interface AuthStatusAction {
  label: string;
  onClick: () => void;
}

export interface AuthStatusCardProps {
  variant: AuthStatusVariant;
  title: string;
  description?: string;
  /** Contenuto extra sotto la descrizione (dettagli, codici, contatti…). */
  children?: React.ReactNode;
  primaryAction?: AuthStatusAction;
  secondaryAction?: AuthStatusAction;
  className?: string;
}

const VARIANT_STYLES: Record<AuthStatusVariant, { box: string; title: string; icon: React.ReactNode }> = {
  success: {
    box: "bg-success/10 border-success/25 dark:border-success/20 text-success",
    title: "text-success",
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  error: {
    box: "bg-danger/10 border-danger/25 dark:border-danger/20 text-danger",
    title: "text-danger",
    icon: <AlertTriangle className="w-6 h-6" />,
  },
  info: {
    box: "bg-primary/10 border-primary/25 dark:border-primary/20 text-primary",
    title: "text-primary",
    icon: <Info className="w-6 h-6" />,
  },
};

export const AuthStatusCard: React.FC<AuthStatusCardProps> = ({
  variant,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  className = "",
}) => {
  const v = VARIANT_STYLES[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`text-center my-6 space-y-4 ${className}`}
    >
      <div className={`w-12 h-12 border rounded-full flex items-center justify-center mx-auto ${v.box}`}>
        {v.icon}
      </div>

      <h3 className={`text-md font-bold ${v.title}`}>{title}</h3>

      {description && (
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {children}

      {primaryAction && (
        <Button
          unstyled
          onClick={primaryAction.onClick}
          className="mt-6 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl py-6 cursor-pointer active:scale-[0.98] transition-all"
        >
          {primaryAction.label}
        </Button>
      )}

      {secondaryAction && (
        <button
          type="button"
          onClick={secondaryAction.onClick}
          className="text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white text-xs font-semibold underline cursor-pointer block mx-auto bg-transparent border-0"
        >
          {secondaryAction.label}
        </button>
      )}
    </div>
  );
};

AuthStatusCard.displayName = "AuthStatusCard";
