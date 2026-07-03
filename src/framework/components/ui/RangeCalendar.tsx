"use client";

import React from "react";
import { RangeCalendar as HeroRangeCalendar } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type RangeCalendarProps = React.ComponentProps<typeof HeroRangeCalendar> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const RangeCalendar: React.FC<RangeCalendarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-range-calendar-skeleton ${className}`} />;
    }

    const content = (
      <HeroRangeCalendar
        className={`klx-range-calendar ${className}`}
        {...props}
      >
        {children}
      </HeroRangeCalendar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

RangeCalendar.displayName = "RangeCalendar";

