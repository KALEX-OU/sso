"use client";

import React from "react";
import { ScrollShadow as HeroScrollShadow } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ScrollShadowProps = React.ComponentProps<typeof HeroScrollShadow> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ScrollShadow: React.FC<ScrollShadowProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-scroll-shadow-skeleton ${className}`} />;
    }

    const content = (
      <HeroScrollShadow
        className={`klx-scroll-shadow ${className}`}
        {...props}
      >
        {children}
      </HeroScrollShadow>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ScrollShadow.displayName = "ScrollShadow";

