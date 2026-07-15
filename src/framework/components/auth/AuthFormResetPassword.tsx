"use client";

import React from "react";
import { Lock, Mail } from "lucide-react";
import { Input } from "../ui";
import { AuthForm } from "./AuthForm";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * Form di reset password — card DS `auth/AuthFormResetPassword`.
 * Costruito sulla BASE `AuthForm`; due modalità (stessa route, dipende dall'oobCode):
 * - `request`: chiede l'email e invia il link di reset;
 * - `confirm`: nuova password + conferma (link email con codice valido).
 * Gli stati di esito (email inviata, codice non valido, successo) restano al consumer.
 */
export type AuthFormResetPasswordMode = "request" | "confirm";

export interface AuthFormResetPasswordProps {
  mode: AuthFormResetPasswordMode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onBack: () => void;
  loading?: boolean;
  /** request: email da resettare. */
  email?: string;
  onEmailChange?: (value: string) => void;
  emailError?: string;
  /** confirm: nuova password + conferma; `targetEmail` = account del codice. */
  password?: string;
  confirmPassword?: string;
  onPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
  passwordError?: string;
  confirmPasswordError?: string;
  targetEmail?: string;
  gradientClassName?: string;
  header?: React.ReactNode;
  formRef?: React.Ref<HTMLFormElement>;
  className?: string;
}

export const AuthFormResetPassword: React.FC<AuthFormResetPasswordProps> = ({
  mode,
  onSubmit,
  onBack,
  loading = false,
  email = "",
  onEmailChange,
  emailError,
  password = "",
  confirmPassword = "",
  onPasswordChange,
  onConfirmPasswordChange,
  passwordError,
  confirmPasswordError,
  targetEmail,
  gradientClassName,
  header,
  formRef,
  className = "",
}) => {
  const s = useUIStrings();

  return (
    <AuthForm
      onSubmit={onSubmit}
      submitLabel={mode === "request" ? s.auth.reset.sendLink : s.auth.reset.title}
      loading={loading}
      gradientClassName={gradientClassName}
      header={header}
      formRef={formRef}
      className={className}
      footer={
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-xs font-semibold text-secondary hover:underline mt-4 cursor-pointer bg-transparent border-0 outline-none block"
        >
          {s.auth.backToLogin}
        </button>
      }
    >
      <div className="text-center mb-2">
        <h3 className="text-md font-bold text-ink">{s.auth.reset.title}</h3>
        {mode === "confirm" && targetEmail && (
          <p className="text-[11px] text-ink-muted mt-1 font-medium">
            {s.auth.reset.forLabel}{" "}
            <span className="text-slate-700 dark:text-slate-200 font-semibold">{targetEmail}</span>
          </p>
        )}
      </div>

      {mode === "request" ? (
        <Input
          type="email"
          name="email"
          autoComplete="username"
          label={s.auth.emailLabel}
          placeholder={s.auth.emailPlaceholder}
          icon={<Mail className="w-4 h-4" />}
          value={email}
          onValueChange={onEmailChange}
          error={emailError}
        />
      ) : (
        <>
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            label={s.auth.reset.newPassword}
            placeholder={s.auth.passwordPlaceholder}
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onValueChange={onPasswordChange}
            error={passwordError}
          />
          <Input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            label={s.auth.reset.confirmPassword}
            placeholder={s.auth.passwordPlaceholder}
            icon={<Lock className="w-4 h-4" />}
            value={confirmPassword}
            onValueChange={onConfirmPasswordChange}
            error={confirmPasswordError}
          />
        </>
      )}
    </AuthForm>
  );
};

AuthFormResetPassword.displayName = "AuthFormResetPassword";
