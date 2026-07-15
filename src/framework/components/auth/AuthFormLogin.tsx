"use client";

import React from "react";
import { Mail, Lock } from "lucide-react";
import { Checkbox, Input, Label } from "../ui";
import { AuthForm } from "./AuthForm";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * Form di accesso email/password — card DS `auth/AuthFormLogin`.
 *
 * Costruito sulla BASE `AuthForm` (header/CTA/footer comuni alla famiglia).
 * Presentazionale e controllato: nessuna dipendenza da Firebase o RHF —
 * valori, errori e submit arrivano dal consumer (la pagina SSO ci collega RHF).
 *
 * - `formRef`: esposto per i listener nativi del consumer (sync autofill).
 * - i18n: sezione `auth` di ui.localization (it/en/es).
 */
export interface AuthFormLoginProps {
  email: string;
  password: string;
  rememberMe: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  emailError?: string;
  passwordError?: string;
  loading?: boolean;
  /** Classi del gradiente brand della CTA (default secondary→accent). */
  gradientClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  formRef?: React.Ref<HTMLFormElement>;
  className?: string;
}

export const AuthFormLogin: React.FC<AuthFormLoginProps> = ({
  email,
  password,
  rememberMe,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
  onForgotPassword,
  onRegister,
  emailError,
  passwordError,
  loading = false,
  gradientClassName,
  header,
  footer,
  formRef,
  className = "",
}) => {
  const s = useUIStrings();

  return (
    <AuthForm
      onSubmit={onSubmit}
      title={s.auth.titles.login}
      submitLabel={loading ? s.auth.signingIn : s.auth.signIn}
      loading={loading}
      gradientClassName={gradientClassName}
      header={header}
      formRef={formRef}
      className={className}
      footer={
        <>
          {onRegister && (
            <p className="text-center text-sm text-ink-muted">
              {s.auth.noAccount}{" "}
              <button
                type="button"
                onClick={onRegister}
                className="font-bold text-ink hover:underline cursor-pointer bg-transparent border-0 outline-none"
              >
                {s.auth.registerNow}
              </button>
            </p>
          )}
          {footer}
        </>
      }
    >
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

      <Input
        type="password"
        name="password"
        autoComplete="current-password"
        label={s.auth.passwordLabel}
        placeholder={s.auth.passwordPlaceholder}
        icon={<Lock className="w-4 h-4" />}
        value={password}
        onValueChange={onPasswordChange}
        error={passwordError}
      />

      <div className="flex items-center justify-between px-1">
        <Checkbox
          isSelected={rememberMe}
          onChange={onRememberMeChange}
          className="text-xs text-ink-muted select-none cursor-pointer flex items-center gap-3"
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label className="text-xs text-ink-muted select-none cursor-pointer">
              {s.auth.rememberMe}
            </Label>
          </Checkbox.Content>
        </Checkbox>

        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer bg-transparent border-0 outline-none"
          >
            {s.auth.forgotPassword}
          </button>
        )}
      </div>
    </AuthForm>
  );
};

AuthFormLogin.displayName = "AuthFormLogin";
