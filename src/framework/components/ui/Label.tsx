"use client";

import React from "react";
import { Label as HeroLabel } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type LabelProps = React.ComponentProps<typeof HeroLabel> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Label: React.FC<LabelProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-label-skeleton ${className}`} />;
    }

    const content = (
      <HeroLabel
        className={`klx-label ${className}`}
        {...props}
      >
        {children}
      </HeroLabel>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

