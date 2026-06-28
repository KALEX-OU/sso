"use client";

import React from "react";
import { ColorField as HeroColorField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorFieldProps = React.ComponentProps<typeof HeroColorField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ColorField = React.forwardRef<React.ElementRef<typeof HeroColorField>, ColorFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorField
        ref={ref}
        className={`klx-color-field ${className}`}
        {...props}
      >
        {children}
      </HeroColorField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ColorField.displayName = "ColorField";

