"use client";

import React from "react";
import { DateField as HeroDateField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DateFieldProps = React.ComponentProps<typeof HeroDateField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const DateFieldBase = React.forwardRef<React.ElementRef<typeof HeroDateField>, DateFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-date-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroDateField
        ref={ref}
        className={`klx-date-field ${className}`}
        {...props}
      >
        {children}
      </HeroDateField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

DateFieldBase.displayName = "DateField";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const DateFieldRoot = HeroDateField.Root;
export const DateFieldGroup = HeroDateField.Group;
export const DateFieldInput = HeroDateField.Input;
export const DateFieldInputContainer = HeroDateField.InputContainer;
export const DateFieldSegment = HeroDateField.Segment;
export const DateFieldPrefix = HeroDateField.Prefix;
export const DateFieldSuffix = HeroDateField.Suffix;

export const DateField = Object.assign(DateFieldBase, {
  Root: HeroDateField.Root,
  Group: HeroDateField.Group,
  Input: HeroDateField.Input,
  InputContainer: HeroDateField.InputContainer,
  Segment: HeroDateField.Segment,
  Prefix: HeroDateField.Prefix,
  Suffix: HeroDateField.Suffix
});
