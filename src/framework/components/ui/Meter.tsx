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

const MeterBase: React.FC<MeterProps> = (
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

MeterBase.displayName = "Meter";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const MeterRoot = HeroMeter.Root;
export const MeterOutput = HeroMeter.Output;
export const MeterTrack = HeroMeter.Track;
export const MeterFill = HeroMeter.Fill;

export const Meter = Object.assign(MeterBase, {
  Root: HeroMeter.Root,
  Output: HeroMeter.Output,
  Track: HeroMeter.Track,
  Fill: HeroMeter.Fill
});

