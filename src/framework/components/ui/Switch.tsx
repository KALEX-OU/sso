"use client";

import React from "react";
import { Switch as HeroSwitch } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type SwitchProps = React.ComponentProps<typeof HeroSwitch> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const SwitchBase = React.forwardRef<React.ElementRef<typeof HeroSwitch>, SwitchProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-switch-skeleton ${className}`} />;
    }

    const content = (
      <HeroSwitch
        ref={ref}
        className={`klx-switch ${className}`}
        {...props}
      >
        {children}
      </HeroSwitch>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

SwitchBase.displayName = "Switch";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const SwitchRoot = HeroSwitch.Root;
export const SwitchContent = HeroSwitch.Content;
export const SwitchControl = HeroSwitch.Control;
export const SwitchThumb = HeroSwitch.Thumb;
export const SwitchIcon = HeroSwitch.Icon;

export const Switch = Object.assign(SwitchBase, {
  Root: HeroSwitch.Root,
  Content: HeroSwitch.Content,
  Control: HeroSwitch.Control,
  Thumb: HeroSwitch.Thumb,
  Icon: HeroSwitch.Icon,
});
