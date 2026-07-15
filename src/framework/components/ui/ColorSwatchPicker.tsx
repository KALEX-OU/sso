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

const ColorSwatchPickerBase: React.FC<ColorSwatchPickerProps> = (
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

ColorSwatchPickerBase.displayName = "ColorSwatchPicker";

export const ColorSwatchPickerItem = HeroColorSwatchPickerItem;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const ColorSwatchPickerRoot = HeroColorSwatchPicker.Root;
export const ColorSwatchPickerSwatch = HeroColorSwatchPicker.Swatch;
export const ColorSwatchPickerIndicator = HeroColorSwatchPicker.Indicator;

export const ColorSwatchPicker = Object.assign(ColorSwatchPickerBase, {
  Root: HeroColorSwatchPicker.Root,
  Swatch: HeroColorSwatchPicker.Swatch,
  Indicator: HeroColorSwatchPicker.Indicator,
  Item: ColorSwatchPickerItem
});
