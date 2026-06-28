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

export const TimeField = React.forwardRef<React.ElementRef<typeof HeroTimeField>, TimeFieldProps>(
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

TimeField.displayName = "TimeField";

