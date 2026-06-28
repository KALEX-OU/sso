"use client";

import React from "react";
import { Switch as HeroSwitch } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type SwitchProps = React.ComponentProps<typeof HeroSwitch> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Switch = React.forwardRef<React.ElementRef<typeof HeroSwitch>, SwitchProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-switch-skeleton ${className}`} />;
    }

    const content = (
      <HeroSwitch
        ref={ref}
        className={`klx-switch ${className}`}
        {...props}
      >
        {children}
      </HeroSwitch>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Switch.displayName = "Switch";

