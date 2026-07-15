"use client";

import React from "react";
import { Popover as HeroPopover, PopoverTrigger as HeroPopoverTrigger, PopoverContent as HeroPopoverContent, PopoverRoot as HeroPopoverRoot } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type PopoverProps = React.ComponentProps<typeof HeroPopover> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const PopoverBase: React.FC<PopoverProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-popover-skeleton ${className}`} />;
    }

    const content = (
      <HeroPopover
        {...props}
      >
        {children}
      </HeroPopover>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

PopoverBase.displayName = "Popover";

export const PopoverTrigger = HeroPopoverTrigger;
export const PopoverContent = HeroPopoverContent;
export const PopoverRoot = HeroPopoverRoot;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const PopoverDialog = HeroPopover.Dialog;
export const PopoverArrow = HeroPopover.Arrow;
export const PopoverHeading = HeroPopover.Heading;

export const Popover = Object.assign(PopoverBase, {
  Dialog: HeroPopover.Dialog,
  Arrow: HeroPopover.Arrow,
  Heading: HeroPopover.Heading,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Root: PopoverRoot
});
