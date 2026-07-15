"use client";

import React from "react";
import { TextArea as HeroTextArea, TextField, Label, FieldError, Description } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  label?: string;
  placeholder?: string;
  error?: string;
  description?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (value: string) => void;
  isRequired?: boolean;
  isSkeleton?: boolean;
  tooltip?: string;
}

const TextAreaBase = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className = "",
      label,
      placeholder,
      error,
      description,
      value = "",
      onChange,
      onValueChange,
      isRequired,
      isSkeleton,
      tooltip,
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
          <Skeleton className="h-[80px] w-full rounded-2xl" />
        </div>
      );
    }

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) onChange(e);
      if (onValueChange) onValueChange(e.target.value);
    };

    const textAreaElement = (
      <HeroTextArea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={handleTextAreaChange}
        disabled={disabled}
        className={`klx-textarea ${error ? "klx-textarea--error" : ""} ${className}`}
        {...props}
      />
    );

    const textAreaWithTooltip = tooltip ? (
      <Tooltip content={tooltip}>{textAreaElement}</Tooltip>
    ) : (
      textAreaElement
    );

    return (
      <TextField className="klx-field-container" isRequired={isRequired} isInvalid={!!error} aria-label={fieldAriaLabel}>
        {label && (
          <Label className="klx-label">
            {label}
            {isRequired && <span className="text-danger ms-0.5">*</span>}
          </Label>
        )}
        
        <div className="w-full">
          {textAreaWithTooltip}
        </div>

        {description && <Description className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{description}</Description>}
        {error && <FieldError className="text-[10px] text-danger font-semibold mt-0.5">{error}</FieldError>}
      </TextField>
    );
  }
);

TextAreaBase.displayName = "TextArea";

// Nome canonico: `TextArea` (nomenclatura ufficiale HeroUI v3). `Textarea` è un alias di
// retrocompatibilità per i consumer esistenti: nei nuovi usi importare `TextArea`.
export { TextArea as Textarea };

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const TextAreaRoot = HeroTextArea.Root;

export const TextArea = Object.assign(TextAreaBase, {
  Root: HeroTextArea.Root,
});
