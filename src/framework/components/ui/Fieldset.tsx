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

const FieldsetBase: React.FC<FieldsetProps> = (
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

FieldsetBase.displayName = "Fieldset";

export const FieldsetLegend = HeroFieldsetLegend;
export const FieldsetActions = HeroFieldsetActions;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const FieldsetRoot = HeroFieldset.Root;
export const FieldsetGroup = HeroFieldset.Group;

export const Fieldset = Object.assign(FieldsetBase, {
  Root: HeroFieldset.Root,
  Group: HeroFieldset.Group,
  Legend: FieldsetLegend,
  Actions: FieldsetActions
});
