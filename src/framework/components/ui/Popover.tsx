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

export const Popover: React.FC<PopoverProps> = (
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

Popover.displayName = "Popover";

export const PopoverTrigger = HeroPopoverTrigger;
export const PopoverContent = HeroPopoverContent;
export const PopoverRoot = HeroPopoverRoot;
