"use client";

import React from "react";
import { Spinner as HeroSpinner } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type SpinnerProps = React.ComponentProps<typeof HeroSpinner> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const SpinnerBase: React.FC<SpinnerProps> = (
  ({ className = "", isSkeleton, tooltip, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-spinner-skeleton ${className}`} />;
    }

    const content = (
      <HeroSpinner
        className={`klx-spinner ${className}`}
        {...props}
      >
      </HeroSpinner>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

SpinnerBase.displayName = "Spinner";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const SpinnerRoot = HeroSpinner.Root;

export const Spinner = Object.assign(SpinnerBase, {
  Root: HeroSpinner.Root,
});
