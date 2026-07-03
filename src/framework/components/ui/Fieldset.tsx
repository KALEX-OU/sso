"use client";

import React from "react";
import { Fieldset as HeroFieldset, FieldsetLegend as HeroFieldsetLegend, FieldsetActions as HeroFieldsetActions } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type FieldsetProps = React.ComponentProps<typeof HeroFieldset> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Fieldset: React.FC<FieldsetProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-fieldset-skeleton ${className}`} />;
    }

    const content = (
      <HeroFieldset
        className={`klx-fieldset ${className}`}
        {...props}
      >
        {children}
      </HeroFieldset>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Fieldset.displayName = "Fieldset";

export const FieldsetLegend = HeroFieldsetLegend;
export const FieldsetActions = HeroFieldsetActions;
