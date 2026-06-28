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

export const NumberField = React.forwardRef<React.ElementRef<typeof HeroNumberField>, NumberFieldProps>(
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

NumberField.displayName = "NumberField";

