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

export const DatePicker: React.FC<DatePickerProps> = (
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

