"use client";

import React from "react";
import { Separator as HeroSeparator } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type SeparatorProps = React.ComponentProps<typeof HeroSeparator> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Separator: React.FC<SeparatorProps> = (
  ({ className = "", isSkeleton, tooltip, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-separator-skeleton ${className}`} />;
    }

    const content = (
      <HeroSeparator
        className={`klx-separator ${className}`}
        {...props}
      >
      </HeroSeparator>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Separator.displayName = "Separator";

