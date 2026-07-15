"use client";

import React from "react";
import { ColorSwatch as HeroColorSwatch } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorSwatchProps = React.ComponentProps<typeof HeroColorSwatch> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ColorSwatchBase: React.FC<ColorSwatchProps> = (
  ({ className = "", isSkeleton, tooltip, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-swatch-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorSwatch
        className={`klx-color-swatch ${className}`}
        {...props}
      >
      </HeroColorSwatch>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ColorSwatchBase.displayName = "ColorSwatch";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ColorSwatchRoot = HeroColorSwatch.Root;

export const ColorSwatch = Object.assign(ColorSwatchBase, {
  Root: HeroColorSwatch.Root,
});
