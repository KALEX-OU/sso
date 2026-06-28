"use client";

import React from "react";
import { TextField as HeroTextField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TextFieldProps = React.ComponentProps<typeof HeroTextField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const TextField = React.forwardRef<React.ElementRef<typeof HeroTextField>, TextFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-text-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroTextField
        ref={ref}
        className={`klx-text-field ${className}`}
        {...props}
      >
        {children}
      </HeroTextField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

TextField.displayName = "TextField";

