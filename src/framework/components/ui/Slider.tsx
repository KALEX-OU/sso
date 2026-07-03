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

export const Slider: React.FC<SliderProps> = (
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

Slider.displayName = "Slider";

