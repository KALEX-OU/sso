"use client";

import React, { createContext, useContext } from "react";

/**
 * L2.1 (DS_LAYOUTS_V1_1_PLAN) — Shell delle pagine di autenticazione.
 *
 * Due varianti:
 * - `split` (default): griglia 1/3–2/3 su lg — colonna form (landmark <main>)
 *   a inizio riga e pannello contenuti/marketing (landmark <aside>) nascosto
 *   sotto lg (su mobile resta solo il form, stack verticale).
 * - `centered`: colonna singola centrata max-w-md (verify, reset-password,
 *   finalize-onboarding).
 *
 * La shell è puramente strutturale: gradienti di stato, glow decorativi e
 * contenuti restano ai consumer (via className/children). Solo utility
 * logiche (border-s sul pannello: in RTL si specchia correttamente).
 *
 * Composizione tipica:
 *   <AuthLayout>                              — oppure variant="centered"
 *     <AuthLayout.Form>…form…</AuthLayout.Form>
 *     <AuthLayout.Aside>…hero…</AuthLayout.Aside>
 *   </AuthLayout>
 */

export type AuthLayoutVariant = "split" | "centered";

const AuthLayoutContext = createContext<AuthLayoutVariant>("split");

const ROOT_CLASSES = {
  split:
    "min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col lg:grid lg:grid-cols-3 relative overflow-hidden font-sans transition-colors duration-500",
  centered:
    "min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans p-6 transition-colors duration-500",
} as const satisfies Record<AuthLayoutVariant, string>;

const FORM_CLASSES = {
  split: "flex-1 lg:col-span-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 w-full",
  centered: "w-full max-w-md relative z-10 flex flex-col items-center",
} as const satisfies Record<AuthLayoutVariant, string>;

export interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: AuthLayoutVariant;
  className?: string;
}

const AuthLayoutBase: React.FC<AuthLayoutProps> = ({ children, variant = "split", className = "" }) => (
  <AuthLayoutContext.Provider value={variant}>
    <div className={`${ROOT_CLASSES[variant]} ${className}`}>{children}</div>
  </AuthLayoutContext.Provider>
);

AuthLayoutBase.displayName = "AuthLayout";

export interface AuthFormProps {
  children: React.ReactNode;
  className?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ children, className = "" }) => {
  const variant = useContext(AuthLayoutContext);
  return <main className={`${FORM_CLASSES[variant]} ${className}`}>{children}</main>;
};

AuthForm.displayName = "AuthLayout.Form";

export interface AuthAsideProps {
  children: React.ReactNode;
  className?: string;
}

const AuthAside: React.FC<AuthAsideProps> = ({ children, className = "" }) => (
  <aside
    className={`hidden lg:flex lg:col-span-2 relative flex-col justify-between items-center p-16 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-black border-s border-slate-200 dark:border-white/5 transition-colors duration-500 ${className}`}
  >
    {children}
  </aside>
);

AuthAside.displayName = "AuthLayout.Aside";

// Re-export nominali + compound — pattern unico del framework: Object.assign
export { AuthForm, AuthAside };
export const AuthLayout = Object.assign(AuthLayoutBase, {
  Form: AuthForm,
  Aside: AuthAside,
});
