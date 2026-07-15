"use client";

import React from "react";
import { Chip as HeroChip } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ChipProps = React.ComponentProps<typeof HeroChip> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ChipBase: React.FC<ChipProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-chip-skeleton ${className}`} />;
    }

    const content = (
      <HeroChip
        className={`klx-chip ${className}`}
        {...props}
      >
        {children}
      </HeroChip>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ChipBase.displayName = "Chip";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ChipRoot = HeroChip.Root;
export const ChipLabel = HeroChip.Label;

export const Chip = Object.assign(ChipBase, {
  Root: HeroChip.Root,
  Label: HeroChip.Label,
});
