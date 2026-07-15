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

const SeparatorBase: React.FC<SeparatorProps> = (
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

SeparatorBase.displayName = "Separator";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const SeparatorRoot = HeroSeparator.Root;

export const Separator = Object.assign(SeparatorBase, {
  Root: HeroSeparator.Root,
});
