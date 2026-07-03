"use client";

import React from "react";
import { Meter as HeroMeter } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type MeterProps = React.ComponentProps<typeof HeroMeter> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Meter: React.FC<MeterProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-meter-skeleton ${className}`} />;
    }

    const content = (
      <HeroMeter
        className={`klx-meter ${className}`}
        {...props}
      >
        {children}
      </HeroMeter>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Meter.displayName = "Meter";

