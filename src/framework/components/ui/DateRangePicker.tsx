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

export const DateRangePicker: React.FC<DateRangePickerProps> = (
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

