"use client";

import React from "react";
import { DatePicker as HeroDatePicker } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DatePickerProps = React.ComponentProps<typeof HeroDatePicker> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const DatePickerBase: React.FC<DatePickerProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-date-picker-skeleton ${className}`} />;
    }

    const content = (
      <HeroDatePicker
        className={`klx-date-picker ${className}`}
        {...props}
      >
        {children}
      </HeroDatePicker>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

DatePickerBase.displayName = "DatePicker";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const DatePickerRoot = HeroDatePicker.Root;
export const DatePickerTrigger = HeroDatePicker.Trigger;
export const DatePickerTriggerIndicator = HeroDatePicker.TriggerIndicator;
export const DatePickerPopover = HeroDatePicker.Popover;

export const DatePicker = Object.assign(DatePickerBase, {
  Root: HeroDatePicker.Root,
  Trigger: HeroDatePicker.Trigger,
  TriggerIndicator: HeroDatePicker.TriggerIndicator,
  Popover: HeroDatePicker.Popover,
});
