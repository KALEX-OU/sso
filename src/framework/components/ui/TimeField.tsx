"use client";

import React from "react";
import { TimeField as HeroTimeField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TimeFieldProps = React.ComponentProps<typeof HeroTimeField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const TimeFieldBase = React.forwardRef<React.ElementRef<typeof HeroTimeField>, TimeFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-time-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroTimeField
        ref={ref}
        className={`klx-time-field ${className}`}
        {...props}
      >
        {children}
      </HeroTimeField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

TimeFieldBase.displayName = "TimeField";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const TimeFieldRoot = HeroTimeField.Root;
export const TimeFieldGroup = HeroTimeField.Group;
export const TimeFieldInput = HeroTimeField.Input;
export const TimeFieldInputContainer = HeroTimeField.InputContainer;
export const TimeFieldSegment = HeroTimeField.Segment;
export const TimeFieldPrefix = HeroTimeField.Prefix;
export const TimeFieldSuffix = HeroTimeField.Suffix;

export const TimeField = Object.assign(TimeFieldBase, {
  Root: HeroTimeField.Root,
  Group: HeroTimeField.Group,
  Input: HeroTimeField.Input,
  InputContainer: HeroTimeField.InputContainer,
  Segment: HeroTimeField.Segment,
  Prefix: HeroTimeField.Prefix,
  Suffix: HeroTimeField.Suffix
});
