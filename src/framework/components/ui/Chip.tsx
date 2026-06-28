"use client";

import React from "react";
import { Chip as HeroChip } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ChipProps = React.ComponentProps<typeof HeroChip> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Chip: React.FC<ChipProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-chip-skeleton ${className}`} />;
    }

    const content = (
      <HeroChip
        className={`klx-chip ${className}`}
        {...props}
      >
        {children}
      </HeroChip>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

