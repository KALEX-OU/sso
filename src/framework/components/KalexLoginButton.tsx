"use client";

import React from "react";
import { Button } from "./ui";
import { LogIn, User } from "lucide-react";
import { useAuth } from "../lib/auth";

interface KalexLoginButtonProps {
  clientId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "danger" | "primary" | "secondary" | "tertiary" | "ghost" | "danger-soft" | "outline";
}

export function KalexLoginButton({
  clientId,
  className = "",
  size = "md",
  variant = "primary"
}: KalexLoginButtonProps) {
  const { user, loading, loginRedirect } = useAuth();

  const handleAuth = () => {
    if (user) {
      const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
      window.location.href = ssoUrl;
    } else {
      loginRedirect(clientId);
    }
  };

  if (loading) {
    return (
      <Button
        unstyled
        isDisabled
        size={size}
        variant={variant}
        className={`font-extrabold uppercase tracking-wider rounded-2xl opacity-70 ${className}`}
      >
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Caricamento
        </span>
      </Button>
    );
  }

  return (
    <Button
      unstyled
      onClick={handleAuth}
      size={size}
      variant={variant}
      className={`font-extrabold uppercase tracking-wider rounded-2xl bg-gradient-to-r from-secondary to-accent text-slate-950 shadow-md active:scale-95 transition-all ${className}`}
    >
      <span className="flex items-center gap-2">
        {user ? "Console" : "Accedi"}
        {user ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
      </span>
    </Button>
  );
}
