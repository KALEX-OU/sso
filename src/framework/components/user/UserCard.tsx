"use client";

import React from "react";
import { Card, CardContent } from "../ui";

/**
 * Pannello contenuti standard dell'area privata — card DS `user/UserCard`.
 *
 * Speculare ad AuthCard (stessa filosofia, contesto dashboard): superficie
 * `bg-surface-raised` con bordo token, header opzionale (icona + titolo +
 * azioni), descrizione muted e banner errore standardizzato. È il mattone
 * per le sezioni della dashboard (settings, moduli, pannelli).
 * Presentazionale: nessuna stringa cablata (tutto via props, già localizzato).
 */
export interface UserCardProps {
  children: React.ReactNode;
  /** Titolo della sezione (già localizzato). */
  title?: string;
  /** Riga descrittiva sotto l'header. */
  description?: string;
  /** Icona a sinistra del titolo (es. lucide, dimensionata dal consumer). */
  icon?: React.ReactNode;
  /** Azioni a destra dell'header (bottoni, badge…). */
  actions?: React.ReactNode;
  /** Banner errore standardizzato sotto l'header. */
  error?: string;
  className?: string;
  contentClassName?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  children,
  title,
  description,
  icon,
  actions,
  error,
  className = "",
  contentClassName = "",
}) => (
  <Card
    className={`w-full border border-line bg-surface-raised backdrop-blur-xl shadow-xl rounded-3xl transition-all ${className}`}
  >
    <CardContent className={`p-6 ${contentClassName}`}>
      {/* Header standard della famiglia (stessa grammatica delle sezioni
          settings): icona secondary + titolo uppercase + azioni, chiuso dal
          divider `border-b border-line pb-4`. */}
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 mb-6 border-b border-line pb-4">
          <div className="flex items-center gap-2 min-w-0">
            {icon}
            {title && (
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink truncate">
                {title}
              </h3>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}

      {description && (
        <p className="text-xs text-ink-muted leading-relaxed mb-4">{description}</p>
      )}

      {error && (
        <div
          role="alert"
          className="bg-danger/10 border border-danger/25 dark:border-danger/20 text-danger rounded-2xl p-3 text-xs mb-4 font-medium w-full"
        >
          {error}
        </div>
      )}

      {children}
    </CardContent>
  </Card>
);

UserCard.displayName = "UserCard";
