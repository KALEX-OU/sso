"use client";

import React from "react";
import { ColorPicker as HeroColorPicker, ColorPickerTrigger as HeroColorPickerTrigger, ColorPickerPopover as HeroColorPickerPopover } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorPickerProps = React.ComponentProps<typeof HeroColorPicker> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ColorPicker: React.FC<ColorPickerProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-picker-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorPicker
        className={`klx-color-picker ${className}`}
        {...props}
      >
        {children}
      </HeroColorPicker>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

export const ColorPickerTrigger = HeroColorPickerTrigger;
export const ColorPickerPopover = HeroColorPickerPopover;
