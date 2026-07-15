"use client";

import React from "react";
import { ToggleButton as HeroToggleButton } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ToggleButtonProps = React.ComponentProps<typeof HeroToggleButton> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ToggleButtonBase = React.forwardRef<React.ElementRef<typeof HeroToggleButton>, ToggleButtonProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-toggle-button-skeleton ${className}`} />;
    }

    const content = (
      <HeroToggleButton
        ref={ref}
        className={`klx-toggle-button ${className}`}
        {...props}
      >
        {children}
      </HeroToggleButton>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ToggleButtonBase.displayName = "ToggleButton";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ToggleButtonRoot = HeroToggleButton.Root;

export const ToggleButton = Object.assign(ToggleButtonBase, {
  Root: HeroToggleButton.Root,
});
