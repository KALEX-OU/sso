"use client";

import React from "react";
import { Slider as HeroSlider } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type SliderProps = React.ComponentProps<typeof HeroSlider> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const SliderBase: React.FC<SliderProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-slider-skeleton ${className}`} />;
    }

    const content = (
      <HeroSlider
        className={`klx-slider ${className}`}
        {...props}
      >
        {children}
      </HeroSlider>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

SliderBase.displayName = "Slider";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const SliderRoot = HeroSlider.Root;
export const SliderOutput = HeroSlider.Output;
export const SliderTrack = HeroSlider.Track;
export const SliderFill = HeroSlider.Fill;
export const SliderThumb = HeroSlider.Thumb;
export const SliderMarks = HeroSlider.Marks;

export const Slider = Object.assign(SliderBase, {
  Root: HeroSlider.Root,
  Output: HeroSlider.Output,
  Track: HeroSlider.Track,
  Fill: HeroSlider.Fill,
  Thumb: HeroSlider.Thumb,
  Marks: HeroSlider.Marks
});
