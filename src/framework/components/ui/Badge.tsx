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

const BadgeBase: React.FC<BadgeProps> = (
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

BadgeBase.displayName = "Badge";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const BadgeAnchor = HeroBadge.Anchor;
export const BadgeLabel = HeroBadge.Label;
export const BadgeRoot = HeroBadge.Root;

export const Badge = Object.assign(BadgeBase, {
  Anchor: HeroBadge.Anchor,
  Label: HeroBadge.Label,
  Root: HeroBadge.Root,
});
