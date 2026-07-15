"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * L4.1 (DS_LAYOUTS_V1_1_PLAN) — Stato vuoto standard delle viste dati.
 *
 * Icona + titolo + descrizione + CTA opzionale, con default i18n
 * (`views.empty`). Adottato da KanbanView/GanttView/ViewSwitcher e
 * riusabile in tabelle e moduli (`renderEmptyState`).
 */

export type EmptyStateSize = "sm" | "md";

const SIZE_CLASSES = {
  sm: { wrapper: "py-6 gap-2", iconBox: "p-2.5 rounded-xl", icon: "w-5 h-5", title: "text-xs", desc: "text-[11px]" },
  md: { wrapper: "py-12 gap-3", iconBox: "p-4 rounded-2xl", icon: "w-7 h-7", title: "text-base", desc: "text-sm" },
} as const satisfies Record<EmptyStateSize, Record<string, string>>;

export interface EmptyStateProps {
  /** Icona Lucide custom; default: Inbox. */
  icon?: React.ReactNode;
  /** Titolo; default i18n `views.empty.title`. */
  title?: string;
  /** Descrizione; default i18n `views.empty.description` (solo size md). */
  description?: string;
  /** CTA opzionale (bottone/link del consumer). */
  action?: React.ReactNode;
  size?: EmptyStateSize;
  className?: string;
}

export function EmptyState({ icon, title, description, action, size = "md", className = "" }: EmptyStateProps) {
  const s = useUIStrings();
  const sz = SIZE_CLASSES[size];
  const resolvedTitle = title ?? s.layout.views.empty.title;
  const resolvedDescription = description ?? (size === "md" ? s.layout.views.empty.description : undefined);

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sz.wrapper} ${className}`}>
      <div className={`bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 ${sz.iconBox}`}>
        {icon ?? <Inbox className={sz.icon} />}
      </div>
      <div className="space-y-0.5">
        <p className={`font-bold text-slate-700 dark:text-slate-200 ${sz.title}`}>{resolvedTitle}</p>
        {resolvedDescription && (
          <p className={`text-slate-500 dark:text-slate-400 max-w-xs ${sz.desc}`}>{resolvedDescription}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
