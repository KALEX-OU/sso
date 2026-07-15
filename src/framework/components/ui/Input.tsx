"use client";

import React from "react";
import { Input as HeroInput, TextField, Label, FieldError, Description } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  placeholder?: string;
  error?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Contenuto a fine campo (stati di validazione, spinner…): aggiunge pe-10 al campo. */
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
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
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

    const inputElement = (
      <HeroInput
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={`klx-input ${icon ? "klx-input--with-icon" : ""} ${suffix ? "klx-input--with-suffix" : ""} ${error ? "klx-input--error" : ""} ${className}`}
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
          {suffix && <span className="absolute end-3.5 flex items-center text-slate-400 dark:text-slate-500">{suffix}</span>}
        </div>

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
