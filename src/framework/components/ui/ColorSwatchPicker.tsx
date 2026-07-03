"use client";

import React from "react";
import { ColorSwatchPicker as HeroColorSwatchPicker, ColorSwatchPickerItem as HeroColorSwatchPickerItem } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorSwatchPickerProps = React.ComponentProps<typeof HeroColorSwatchPicker> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-swatch-picker-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorSwatchPicker
        className={`klx-color-swatch-picker ${className}`}
        {...props}
      >
        {children}
      </HeroColorSwatchPicker>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ColorSwatchPicker.displayName = "ColorSwatchPicker";

export const ColorSwatchPickerItem = HeroColorSwatchPickerItem;
