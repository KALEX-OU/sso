"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

export type ApiGuardTone = "warning" | "danger";

interface ApiGuardProps {
  /** Icona nel riquadro in alto (default: ShieldAlert). */
  icon?: React.ReactNode;
  /** Tinta del riquadro icona: warning (rate-limit, degradi) o danger (errori). */
  tone?: ApiGuardTone;
  /** Titolo della schermata. */
  title: string;
  /** Descrizione principale. */
  description?: string;
  /** Nota secondaria (suggerimento operativo). */
  hint?: string;
  /** Area di stato (es. chip countdown "Attendi N secondi"). */
  status?: React.ReactNode;
  /** Azioni (bottoni) in fondo alla card. */
  actions?: React.ReactNode;
}

/**
 * Schermata-guardia GENERICA e riutilizzabile per gli stati bloccanti delle API
 * (rate-limit, autenticazione fallita, servizio degradato…): un'unica grafica per
 * tutti i gate di questo tipo, coerente con tema chiaro/scuro E brand attivo
 * (sfondo = token `--background`, superfici con variante `dark:` — mai colori cablati).
 *
 * È presentazionale: la logica (countdown, retry, redirect) resta nel chiamante,
 * che compone `status`/`actions`. Usata da Providers per RateLimitGuard e per
 * l'errore di scambio SSO; adottarla per ogni nuovo gate simile.
 */
export function ApiGuard({ icon, tone = "warning", title, description, hint, status, actions }: ApiGuardProps) {
  const toneClasses =
    tone === "danger"
      ? "bg-danger/10 border-danger/20 text-danger"
      : "bg-warning/10 border-warning/20 text-warning";

  return (
    <div
      role="alert"
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] px-6 text-center select-none"
    >
      <div className="max-w-md w-full p-8 border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl space-y-6">
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${toneClasses}`}>
          {icon ?? <ShieldAlert className="w-8 h-8" aria-hidden />}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{title}</h2>
          {description && (
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-semibold">{description}</p>
          )}
          {hint && (
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{hint}</p>
          )}
        </div>

        {status}

        {actions && <div className="flex flex-col gap-2 pt-2">{actions}</div>}
      </div>
    </div>
  );
}

export default ApiGuard;
