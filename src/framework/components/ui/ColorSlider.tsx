"use client";

import React from "react";
import { ColorSlider as HeroColorSlider } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorSliderProps = React.ComponentProps<typeof HeroColorSlider> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ColorSliderBase: React.FC<ColorSliderProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-slider-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorSlider
        className={`klx-color-slider ${className}`}
        {...props}
      >
        {children}
      </HeroColorSlider>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ColorSliderBase.displayName = "ColorSlider";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ColorSliderRoot = HeroColorSlider.Root;
export const ColorSliderOutput = HeroColorSlider.Output;
export const ColorSliderTrack = HeroColorSlider.Track;
export const ColorSliderThumb = HeroColorSlider.Thumb;

export const ColorSlider = Object.assign(ColorSliderBase, {
  Root: HeroColorSlider.Root,
  Output: HeroColorSlider.Output,
  Track: HeroColorSlider.Track,
  Thumb: HeroColorSlider.Thumb,
});
