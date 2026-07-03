"use client";

import React from "react";
import { ProgressBar as HeroProgressBar } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ProgressBarProps = React.ComponentProps<typeof HeroProgressBar> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-progress-bar-skeleton ${className}`} />;
    }

    const content = (
      <HeroProgressBar
        className={`klx-progress-bar ${className}`}
        {...props}
      >
        {children}
      </HeroProgressBar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ProgressBar.displayName = "ProgressBar";

