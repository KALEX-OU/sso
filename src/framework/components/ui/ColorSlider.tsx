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

export const ColorSlider: React.FC<ColorSliderProps> = (
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

ColorSlider.displayName = "ColorSlider";

