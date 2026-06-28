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

export const Spinner: React.FC<SpinnerProps> = (
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

