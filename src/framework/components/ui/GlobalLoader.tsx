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
  /** Dimensione dello spinner: "md" per i gate a schermo intero, "sm" per usi inline. */
  size?: "sm" | "md";
}

/**
 * Loader UNICO e coerente per tutta l'app KALEX.
 *
 * Un solo spinner + un messaggio aggiornabile sotto. Va usato in TUTTI i gate/flussi a schermo
 * intero (boot sessione, SSO exchange, login/redirect, onboarding, verifica) così che siano
 * visivamente identici: l'utente percepisce UN loader continuo il cui messaggio cambia, invece di
 * tante schermate di caricamento diverse che si susseguono e "lampeggiano".
 *
 * Coerenza visiva garantita qui (e SOLO qui):
 * - sfondo = token semantico `--background` (segue tema chiaro/scuro E brand attivo:
 *   nessuno sfarfallio dark/light tra un gate e l'altro);
 * - icona unica (Loader2) con colore unico `text-primary` (mai viola/accent per-schermata).
 */
export function GlobalLoader({ message, subMessage, fullScreen = true, size = "md" }: GlobalLoaderProps) {
  const spinnerSize = size === "sm" ? "w-6 h-6" : "w-12 h-12";
  const inner = (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Loader2 className={`${spinnerSize} text-primary animate-spin`} aria-hidden />
      {message && (
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-xs px-4">{message}</p>
      )}
      {subMessage && (
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs px-4">{subMessage}</p>
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
      className="min-h-screen w-full flex items-center justify-center bg-[var(--background)] p-6"
    >
      {inner}
    </div>
  );
}

export default GlobalLoader;
