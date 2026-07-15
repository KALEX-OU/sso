"use client";

import React from "react";
import { useBrand } from "../providers/BrandProvider";

/**
 * Wordmark del brand attivo — card DS `general/Logo`.
 *
 * UNICO componente logo del framework (prima il wordmark era re-implementato
 * ad-hoc in auth shell, PublicLayout, sidebar): Montserrat (`font-display`),
 * gradiente brand sobrio secondary→accent via token (bianco-label: il nome
 * arriva da `useBrand()`, mai cablato). Tagline opzionale sotto il wordmark.
 */
export const LOGO_SIZES = ["sm", "md", "lg"] as const;
export type LogoSize = (typeof LOGO_SIZES)[number];

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
};

export interface LogoProps {
  size?: LogoSize;
  /** Classi del gradiente del wordmark (default: brand secondary→accent). */
  gradientClassName?: string;
  /** Riga secondaria sotto il wordmark (es. "Identity Center"), già localizzata. */
  tagline?: string;
  /**
   * Override del nome (default: brand attivo da useBrand). Serve ai contesti
   * multi-brand come il portale auth, dove il wordmark è quello del VERTICALE.
   */
  name?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  gradientClassName = "from-secondary to-accent",
  tagline,
  name,
  className = "",
}) => {
  const brand = useBrand();
  const wordmark = name ?? brand.name;
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span
        className={`font-display font-black uppercase tracking-tight bg-gradient-to-r ${gradientClassName} bg-clip-text text-transparent ${SIZE_CLASSES[size]}`}
      >
        {wordmark}
      </span>
      {tagline && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mt-1.5">
          {tagline}
        </span>
      )}
    </span>
  );
};

Logo.displayName = "Logo";
