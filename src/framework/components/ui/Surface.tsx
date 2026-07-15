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

const SurfaceBase: React.FC<SurfaceProps> = (
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

SurfaceBase.displayName = "Surface";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const SurfaceRoot = HeroSurface.Root;

export const Surface = Object.assign(SurfaceBase, {
  Root: HeroSurface.Root,
});
