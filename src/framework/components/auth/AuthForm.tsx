"use client";

import React from "react";
import { AuthSubmitButton } from "./AuthSubmitButton";

/**
 * BASE della famiglia form auth — card DS `auth/AuthForm`.
 *
 * Struttura comune a tutti i form di autenticazione: slot `header` (blocco
 * brand), `<form>` con spaziatura standard, CTA `AuthSubmitButton` e slot
 * `footer` (link/azioni secondarie, dentro il form dopo la CTA).
 * I campi sono `children`: i form concreti sono AuthFormLogin,
 * AuthFormRegister e AuthFormMfa.
 */
export interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  /** Testo (o contenuto) della CTA di submit. */
  submitLabel: React.ReactNode;
  loading?: boolean;
  /** false → CTA disabilitata (oltre che durante il loading). */
  canSubmit?: boolean;
  /** Classi del gradiente brand della CTA (default secondary→accent). */
  gradientClassName?: string;
  /** Blocco brand sopra il form (logo + sottotitolo). */
  header?: React.ReactNode;
  /** Titolo dello step (es. "Accedi al tuo account"), sotto il blocco brand. */
  title?: string;
  /** Azioni secondarie sotto la CTA (link, recovery…), dentro il form. */
  footer?: React.ReactNode;
  formRef?: React.Ref<HTMLFormElement>;
  className?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  children,
  onSubmit,
  submitLabel,
  loading = false,
  canSubmit = true,
  gradientClassName,
  header,
  title,
  footer,
  formRef,
  className = "",
}) => (
  <div className={`w-full flex flex-col gap-6 ${className}`}>
    {header}
    {title && (
      <h2 className="text-center text-lg font-bold text-ink -mt-2">{title}</h2>
    )}

    <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
      {children}

      <AuthSubmitButton loading={loading} disabled={!canSubmit} gradientClassName={gradientClassName}>
        {submitLabel}
      </AuthSubmitButton>

      {footer}
    </form>
  </div>
);

AuthForm.displayName = "AuthForm";
