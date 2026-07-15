"use client";

import React from "react";
import { Button } from "../ui";

/**
 * CTA standard dei form di autenticazione: gradiente brand (token secondary→accent
 * di default, personalizzabile per i verticali via `gradientClassName`) con stato
 * loading (spinner) e disabilitazione coerente.
 */
export interface AuthSubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  /** Classi del gradiente brand (es. "from-success to-teal-500" per un verticale). */
  gradientClassName?: string;
  type?: "submit" | "button";
  onClick?: () => void;
  className?: string;
}

export const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  gradientClassName = "from-secondary to-accent",
  type = "submit",
  onClick,
  className = "",
}) => {
  const isBlocked = loading || disabled;
  return (
    <Button
      unstyled
      type={type}
      onClick={onClick}
      isDisabled={isBlocked}
      className={`w-full py-6 font-bold bg-gradient-to-r ${gradientClassName} text-slate-950 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 ${
        isBlocked ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98] cursor-pointer hover:shadow-xl"
      } ${className}`}
    >
      {loading && (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>
      )}
      {children}
    </Button>
  );
};

AuthSubmitButton.displayName = "AuthSubmitButton";
