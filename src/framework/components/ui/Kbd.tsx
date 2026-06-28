"use client";

import React from "react";
import { Kbd as HeroKbd } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type KbdProps = React.ComponentProps<typeof HeroKbd> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Kbd: React.FC<KbdProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-kbd-skeleton ${className}`} />;
    }

    const content = (
      <HeroKbd
        className={`klx-kbd ${className}`}
        {...props}
      >
        {children}
      </HeroKbd>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

