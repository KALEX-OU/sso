"use client";

import React, { useState } from "react";
import { Input as HeroInput, TextField, Label, FieldError, Description } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";
import { useUIStrings } from "../../lib/ui.localization";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  placeholder?: string;
  error?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Contenuto a fine campo (stati di validazione, spinner…): aggiunge pe-10 al campo.
   *  Sui campi `type="password"` il suffix esplicito SOSTITUISCE il toggle mostra/nascondi. */
  suffix?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  isRequired?: boolean;
  isSkeleton?: boolean;
  tooltip?: string;
}

/**
 * Input del framework con doppio binding dei props (retrocompatibilità):
 * - callback: `onChange(event)` e `onValueChange(value)` vengono invocate ENTRAMBE, in quest'ordine.
 * Componente controllato: `value` ha default `""`.
 *
 * Campi password (M1/M2 AUTH v1.2.1):
 * - toggle mostra/nascondi integrato (occhietto in posizione suffix, type="button");
 * - avviso Blocco maiuscole attivo sotto il campo (getModifierState su key/focus).
 */
const InputBase = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      placeholder,
      error,
      description,
      icon,
      suffix,
      value = "",
      onChange,
      onValueChange,
      isRequired,
      isSkeleton,
      tooltip,
      type = "text",
      disabled,
      onKeyDown,
      onKeyUp,
      onBlur,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const s = useUIStrings();
    const isPassword = type === "password";
    const [revealed, setRevealed] = useState(false);
    const [capsOn, setCapsOn] = useState(false);

    // A11y (L0.4): senza label visibile react-aria esige aria-label/aria-labelledby.
    // Fallback: aria-label esplicito, altrimenti il placeholder (già localizzato al call site).
    const fieldAriaLabel = ariaLabel ?? (label ? undefined : placeholder);
    if (isSkeleton) {
      return (
        <div className="flex flex-col gap-1.5 w-full">
          {label && <Skeleton className="h-4 w-20 rounded" />}
          <Skeleton className="h-[48px] w-full rounded-2xl" />
        </div>
      );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onValueChange) onValueChange(e.target.value);
    };

    const syncCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isPassword && typeof e.getModifierState === "function") {
        setCapsOn(e.getModifierState("CapsLock"));
      }
    };

    // Toggle mostra/nascondi: solo password e solo se il consumer non usa già il suffix.
    const passwordToggle = isPassword && !suffix ? (
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        disabled={disabled}
        aria-label={revealed ? s.common.hidePassword : s.common.showPassword}
        className="flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer bg-transparent border-0 p-0 outline-none focus-visible:text-secondary transition-colors"
      >
        {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    ) : null;

    const endAdornment = suffix ?? passwordToggle;

    const inputElement = (
      <HeroInput
        ref={ref}
        type={isPassword && revealed ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          syncCapsLock(e);
          onKeyDown?.(e);
        }}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          syncCapsLock(e);
          onKeyUp?.(e);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          setCapsOn(false);
          onBlur?.(e);
        }}
        className={`klx-input ${icon ? "klx-input--with-icon" : ""} ${endAdornment ? "klx-input--with-suffix" : ""} ${error ? "klx-input--error" : ""} ${className}`}
        {...props}
      />
    );

    const inputWithTooltip = tooltip ? (
      <Tooltip content={tooltip}>{inputElement}</Tooltip>
    ) : (
      inputElement
    );

    return (
      <TextField className="klx-field-container" isRequired={isRequired} isInvalid={!!error} aria-label={fieldAriaLabel}>
        {label && (
          <Label className="klx-label">
            {label}
            {isRequired && <span className="text-danger ms-0.5">*</span>}
          </Label>
        )}

        <div className="relative w-full flex items-center">
          {icon && <span className="absolute start-3.5 text-slate-400 dark:text-slate-500">{icon}</span>}
          <div className="w-full">
            {inputWithTooltip}
          </div>
          {endAdornment && <span className="absolute end-3.5 flex items-center text-slate-400 dark:text-slate-500">{endAdornment}</span>}
        </div>

        {capsOn && <span className="klx-field-hint" role="status">{s.common.capsLockOn}</span>}
        {description && <Description className="mt-0.5">{description}</Description>}
        {error && <FieldError className="mt-0.5">{error}</FieldError>}
      </TextField>
    );
  }
);

InputBase.displayName = "Input";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const InputRoot = HeroInput.Root;

export const Input = Object.assign(InputBase, {
  Root: HeroInput.Root,
});
