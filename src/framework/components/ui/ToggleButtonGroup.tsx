"use client";

import React from "react";
import { ToggleButtonGroup as HeroToggleButtonGroup } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ToggleButtonGroupProps = React.ComponentProps<typeof HeroToggleButtonGroup> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ToggleButtonGroupBase: React.FC<ToggleButtonGroupProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-toggle-button-group-skeleton ${className}`} />;
    }

    const content = (
      <HeroToggleButtonGroup
        className={`klx-toggle-button-group ${className}`}
        {...props}
      >
        {children}
      </HeroToggleButtonGroup>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ToggleButtonGroupBase.displayName = "ToggleButtonGroup";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ToggleButtonGroupRoot = HeroToggleButtonGroup.Root;
export const ToggleButtonGroupSeparator = HeroToggleButtonGroup.Separator;

export const ToggleButtonGroup = Object.assign(ToggleButtonGroupBase, {
  Root: HeroToggleButtonGroup.Root,
  Separator: HeroToggleButtonGroup.Separator,
});
