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

const LabelBase: React.FC<LabelProps> = (
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

LabelBase.displayName = "Label";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const LabelRoot = HeroLabel.Root;

export const Label = Object.assign(LabelBase, {
  Root: HeroLabel.Root,
});
