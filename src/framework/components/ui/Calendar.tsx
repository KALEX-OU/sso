"use client";

import React from "react";
import { Calendar as HeroCalendar } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type CalendarProps = React.ComponentProps<typeof HeroCalendar> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Calendar: React.FC<CalendarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-calendar-skeleton ${className}`} />;
    }

    const content = (
      <HeroCalendar
        className={`klx-calendar ${className}`}
        {...props}
      >
        {children}
      </HeroCalendar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Calendar.displayName = "Calendar";

