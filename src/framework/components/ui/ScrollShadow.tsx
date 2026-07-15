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

const ScrollShadowBase: React.FC<ScrollShadowProps> = (
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

ScrollShadowBase.displayName = "ScrollShadow";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ScrollShadowRoot = HeroScrollShadow.Root;

export const ScrollShadow = Object.assign(ScrollShadowBase, {
  Root: HeroScrollShadow.Root,
});
