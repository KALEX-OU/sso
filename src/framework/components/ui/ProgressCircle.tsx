"use client";

import React from "react";
import { ProgressCircle as HeroProgressCircle } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ProgressCircleProps = React.ComponentProps<typeof HeroProgressCircle> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ProgressCircleBase: React.FC<ProgressCircleProps> = (
  ({ className = "", isSkeleton, tooltip, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-progress-circle-skeleton ${className}`} />;
    }

    const content = (
      <HeroProgressCircle
        className={`klx-progress-circle ${className}`}
        {...props}
      >
      </HeroProgressCircle>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ProgressCircleBase.displayName = "ProgressCircle";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ProgressCircleRoot = HeroProgressCircle.Root;
export const ProgressCircleTrack = HeroProgressCircle.Track;
export const ProgressCircleTrackCircle = HeroProgressCircle.TrackCircle;
export const ProgressCircleFillCircle = HeroProgressCircle.FillCircle;

export const ProgressCircle = Object.assign(ProgressCircleBase, {
  Root: HeroProgressCircle.Root,
  Track: HeroProgressCircle.Track,
  TrackCircle: HeroProgressCircle.TrackCircle,
  FillCircle: HeroProgressCircle.FillCircle
});
