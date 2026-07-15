"use client";

import React from "react";
import { DateRangePicker as HeroDateRangePicker } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DateRangePickerProps = React.ComponentProps<typeof HeroDateRangePicker> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const DateRangePickerBase: React.FC<DateRangePickerProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-date-range-picker-skeleton ${className}`} />;
    }

    const content = (
      <HeroDateRangePicker
        className={`klx-date-range-picker ${className}`}
        {...props}
      >
        {children}
      </HeroDateRangePicker>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

DateRangePickerBase.displayName = "DateRangePicker";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const DateRangePickerRoot = HeroDateRangePicker.Root;
export const DateRangePickerTrigger = HeroDateRangePicker.Trigger;
export const DateRangePickerTriggerIndicator = HeroDateRangePicker.TriggerIndicator;
export const DateRangePickerRangeSeparator = HeroDateRangePicker.RangeSeparator;
export const DateRangePickerPopover = HeroDateRangePicker.Popover;

export const DateRangePicker = Object.assign(DateRangePickerBase, {
  Root: HeroDateRangePicker.Root,
  Trigger: HeroDateRangePicker.Trigger,
  TriggerIndicator: HeroDateRangePicker.TriggerIndicator,
  RangeSeparator: HeroDateRangePicker.RangeSeparator,
  Popover: HeroDateRangePicker.Popover,
});
