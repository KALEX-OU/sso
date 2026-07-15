"use client";

import React from "react";
import { Mail, Lock } from "lucide-react";
import { Checkbox, Input, Label } from "../ui";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * Form di accesso email/password del framework (card DS `auth/AuthForm`).
 *
 * Componente PRESENTAZIONALE e controllato: nessuna dipendenza da Firebase o
 * react-hook-form — valori, errori e submit arrivano dal consumer (la pagina
 * SSO ci collega RHF). Lo stile dei campi è quello globale del DS (marker
 * `.klx-*` in globals.css): qui non vive nessuna pill custom.
 *
 * - `header`/`footer`: slot per logo/brand sopra i campi e contenuti extra.
 * - `formRef`: esposto per i listener nativi del consumer (sync autofill).
 * - i18n: sezione `auth` di ui.localization (it/en/es).
 */
export interface AuthFormProps {
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

export const AuthForm: React.FC<AuthFormProps> = ({
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
    <div className={`w-full flex flex-col gap-6 ${className}`}>
      {header}

      <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
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
            className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer flex items-center gap-3"
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
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

        <AuthSubmitButton loading={loading} gradientClassName={gradientClassName}>
          {loading ? s.auth.signingIn : s.auth.signIn}
        </AuthSubmitButton>
      </form>

      {onRegister && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {s.auth.noAccount}{" "}
          <button
            type="button"
            onClick={onRegister}
            className="font-bold text-slate-900 dark:text-white hover:underline cursor-pointer bg-transparent border-0 outline-none"
          >
            {s.auth.registerNow}
          </button>
        </p>
      )}

      {footer}
    </div>
  );
};

AuthForm.displayName = "AuthForm";
