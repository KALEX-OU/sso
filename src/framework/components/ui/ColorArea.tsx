"use client";

import React from "react";
import { ColorArea as HeroColorArea } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorAreaProps = React.ComponentProps<typeof HeroColorArea> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ColorAreaBase: React.FC<ColorAreaProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-area-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorArea
        className={`klx-color-area ${className}`}
        {...props}
      >
        {children}
      </HeroColorArea>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ColorAreaBase.displayName = "ColorArea";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ColorAreaRoot = HeroColorArea.Root;
export const ColorAreaThumb = HeroColorArea.Thumb;

export const ColorArea = Object.assign(ColorAreaBase, {
  Root: HeroColorArea.Root,
  Thumb: HeroColorArea.Thumb,
});
