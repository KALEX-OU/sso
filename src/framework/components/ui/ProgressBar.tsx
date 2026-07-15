"use client";

import React from "react";
import { ProgressBar as HeroProgressBar } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ProgressBarProps = React.ComponentProps<typeof HeroProgressBar> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ProgressBarBase: React.FC<ProgressBarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-progress-bar-skeleton ${className}`} />;
    }

    const content = (
      <HeroProgressBar
        className={`klx-progress-bar ${className}`}
        {...props}
      >
        {children}
      </HeroProgressBar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ProgressBarBase.displayName = "ProgressBar";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ProgressBarRoot = HeroProgressBar.Root;
export const ProgressBarOutput = HeroProgressBar.Output;
export const ProgressBarTrack = HeroProgressBar.Track;
export const ProgressBarFill = HeroProgressBar.Fill;

export const ProgressBar = Object.assign(ProgressBarBase, {
  Root: HeroProgressBar.Root,
  Output: HeroProgressBar.Output,
  Track: HeroProgressBar.Track,
  Fill: HeroProgressBar.Fill
});
