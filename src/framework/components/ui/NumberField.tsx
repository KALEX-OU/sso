"use client";

import React from "react";
import { NumberField as HeroNumberField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type NumberFieldProps = React.ComponentProps<typeof HeroNumberField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const NumberFieldBase = React.forwardRef<React.ElementRef<typeof HeroNumberField>, NumberFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-number-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroNumberField
        ref={ref}
        className={`klx-number-field ${className}`}
        {...props}
      >
        {children}
      </HeroNumberField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

NumberFieldBase.displayName = "NumberField";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const NumberFieldRoot = HeroNumberField.Root;
export const NumberFieldGroup = HeroNumberField.Group;
export const NumberFieldInput = HeroNumberField.Input;
export const NumberFieldIncrementButton = HeroNumberField.IncrementButton;
export const NumberFieldDecrementButton = HeroNumberField.DecrementButton;

export const NumberField = Object.assign(NumberFieldBase, {
  Root: HeroNumberField.Root,
  Group: HeroNumberField.Group,
  Input: HeroNumberField.Input,
  IncrementButton: HeroNumberField.IncrementButton,
  DecrementButton: HeroNumberField.DecrementButton
});
