"use client";

import React from "react";
import { Badge as HeroBadge } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type BadgeProps = React.ComponentProps<typeof HeroBadge> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Badge: React.FC<BadgeProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-badge-skeleton ${className}`} />;
    }

    const content = (
      <HeroBadge
        className={`klx-badge ${className}`}
        {...props}
      >
        {children}
      </HeroBadge>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

