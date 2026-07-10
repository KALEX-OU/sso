"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface GlobalLoaderProps {
  /** Messaggio principale sotto lo spinner (aggiornabile durante il flusso). */
  message?: string;
  /** Messaggio secondario opzionale (dettaglio/stato). */
  subMessage?: string;
  /** Se false rende inline (per skeleton/gate parziali). Default: full-screen. */
  fullScreen?: boolean;
}

/**
 * Loader UNICO e coerente per tutta l'app KALEX.
 *
 * Un solo spinner + un messaggio aggiornabile sotto. Va usato in TUTTI i gate/flussi a schermo
 * intero (boot sessione, SSO exchange, login/redirect, onboarding, verifica) così che siano
 * visivamente identici: l'utente percepisce UN loader continuo il cui messaggio cambia, invece di
 * tante schermate di caricamento diverse che si susseguono e "lampeggiano".
 *
 * Pattern di riferimento: `auth/verify/page.tsx` (spinner + `statusMessage` aggiornato dal polling).
 */
export function GlobalLoader({ message, subMessage, fullScreen = true }: GlobalLoaderProps) {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="w-12 h-12 text-secondary dark:text-secondary animate-spin" aria-hidden />
      {message && (
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-xs px-4">{message}</p>
      )}
      {subMessage && (
        <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs px-4">{subMessage}</p>
      )}
    </div>
  );

  if (!fullScreen) {
    return inner;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6"
    >
      {inner}
    </div>
  );
}

export default GlobalLoader;
