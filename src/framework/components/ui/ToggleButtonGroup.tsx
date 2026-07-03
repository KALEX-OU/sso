"use client";

import React from "react";
import { ToggleButtonGroup as HeroToggleButtonGroup } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ToggleButtonGroupProps = React.ComponentProps<typeof HeroToggleButtonGroup> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-toggle-button-group-skeleton ${className}`} />;
    }

    const content = (
      <HeroToggleButtonGroup
        className={`klx-toggle-button-group ${className}`}
        {...props}
      >
        {children}
      </HeroToggleButtonGroup>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ToggleButtonGroup.displayName = "ToggleButtonGroup";

