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

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      ...props
    },
    ref
  ) => {
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
      <TextField className="klx-field-container" isRequired={isRequired} isInvalid={!!error}>
        {label && (
          <Label className="klx-label">
            {label}
            {isRequired && <span className="text-danger ml-0.5">*</span>}
          </Label>
        )}
        
        <div className="w-full">
          {textAreaWithTooltip}
        </div>

        {description && <Description className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{description}</Description>}
        {error && <FieldError className="text-[10px] text-red-500 font-semibold mt-0.5">{error}</FieldError>}
      </TextField>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea as Textarea };
