"use client";

import React from "react";
import { Surface as HeroSurface } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type SurfaceProps = React.ComponentProps<typeof HeroSurface> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Surface: React.FC<SurfaceProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-surface-skeleton ${className}`} />;
    }

    const content = (
      <HeroSurface
        className={`klx-surface ${className}`}
        {...props}
      >
        {children}
      </HeroSurface>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

