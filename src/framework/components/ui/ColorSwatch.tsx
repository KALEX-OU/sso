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

export const ColorSwatch: React.FC<ColorSwatchProps> = (
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

