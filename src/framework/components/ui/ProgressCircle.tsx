"use client";

import React from "react";
import { ProgressCircle as HeroProgressCircle } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ProgressCircleProps = React.ComponentProps<typeof HeroProgressCircle> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ProgressCircle: React.FC<ProgressCircleProps> = (
  ({ className = "", isSkeleton, tooltip, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-progress-circle-skeleton ${className}`} />;
    }

    const content = (
      <HeroProgressCircle
        className={`klx-progress-circle ${className}`}
        {...props}
      >
      </HeroProgressCircle>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ProgressCircle.displayName = "ProgressCircle";

