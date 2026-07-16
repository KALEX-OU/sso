"use client";

import React from "react";
import { Card, CardContent, Logo } from "../ui";
import { KALEX_BRAND } from "../../lib/brand.config";

/**
 * Cornice standard dei form di autenticazione (card DS `auth/*`):
 * card vetrosa (blur, bordo, raggio 3xl) + slot `header` (blocco brand del
 * consumer, default: `ui/Logo`) + banner errore standardizzato. Presentazionale.
 */
export interface AuthCardProps {
  children: React.ReactNode;
  /**
   * Blocco brand sopra il contenuto. Default: `ui/Logo` con wordmark KALEX —
   * il portale di autenticazione è SEMPRE brandizzato KALEX (identity provider
   * dell'ecosistema), indipendentemente dal white-label attivo (decisione
   * owner 2026-07-16). Passare `null` per sopprimerlo, o un nodo custom
   * (es. il Logo del verticale/tenant che passa AuthArea).
   */
  header?: React.ReactNode;
  /** Messaggio di errore globale del form (banner rosso standard). */
  error?: string;
  className?: string;
  contentClassName?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  header,
  error,
  className = "",
  contentClassName = "",
}) => (
  <Card
    className={`max-w-xl w-full border border-line bg-white/70 dark:bg-slate-900/35 backdrop-blur-2xl shadow-2xl p-1 sm:p-3 relative z-10 rounded-3xl transition-all ${className}`}
  >
    <CardContent className={`p-4 ${contentClassName}`}>
      {/* undefined → logo di default (sempre KALEX); null → nessun header (scelta esplicita del consumer) */}
      {header !== null && (
        <div className="text-center mb-8">{header ?? <Logo size="lg" name={KALEX_BRAND.name} />}</div>
      )}

      {error && (
        <div role="alert" className="bg-danger/10 border border-danger/25 dark:border-danger/20 text-danger rounded-2xl p-3 text-xs mb-6 text-center font-medium w-full">
          {error}
        </div>
      )}

      {children}
    </CardContent>
  </Card>
);

AuthCard.displayName = "AuthCard";
