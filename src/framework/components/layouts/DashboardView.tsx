"use client";

import React from "react";

/**
 * Vista "dashboard" (homepage dell'area privata) — card DS `layouts/DashboardView`.
 *
 * Sorella delle altre viste modulo (ListView/KanbanView/GanttView/DetailView):
 * griglia di KPI/stat in testa + sezioni di pagina come children (UserCard,
 * viste dati…). Vive dentro UserMain, come ogni vista. Presentazionale:
 * etichette e valori arrivano già localizzati dal consumer.
 */
export type DashboardStatTone = "default" | "success" | "warning" | "danger";

export interface DashboardStat {
  id: string;
  /** Etichetta breve del KPI (già localizzata). */
  label: string;
  /** Valore principale (stringa già formattata: numeri/valute dal consumer). */
  value: string;
  /** Riga secondaria opzionale (es. "2 posti liberi"). */
  hint?: string;
  /** Icona a fianco del valore (dimensionata dal consumer). */
  icon?: React.ReactNode;
  /** Colora valore/icona per stato. */
  tone?: DashboardStatTone;
}

const TONE_CLASSES: Record<DashboardStatTone, string> = {
  default: "text-ink",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export interface DashboardViewProps {
  /** KPI in testa alla pagina (griglia responsive). */
  stats: readonly DashboardStat[];
  /** Sezioni della pagina sotto i KPI (UserCard, viste dati…). */
  children?: React.ReactNode;
  className?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  children,
  className = "",
}) => (
  <div className={`space-y-6 ${className}`}>
    {stats.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="border border-line bg-surface-raised backdrop-blur-xl rounded-3xl p-5 flex items-start gap-3"
          >
            {stat.icon && (
              <div className="p-2 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary shrink-0">
                {stat.icon}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-ink-muted truncate">
                {stat.label}
              </p>
              <p className={`text-xl font-extrabold truncate ${TONE_CLASSES[stat.tone ?? "default"]}`}>
                {stat.value}
              </p>
              {stat.hint && (
                <p className="text-[11px] text-ink-muted truncate mt-0.5">{stat.hint}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}

    {children}
  </div>
);

DashboardView.displayName = "DashboardView";
