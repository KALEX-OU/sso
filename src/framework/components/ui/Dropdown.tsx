"use client";

import React from "react";
import { Dropdown as HeroDropdown, DropdownTrigger as HeroDropdownTrigger, DropdownMenu as HeroDropdownMenu, DropdownSection as HeroDropdownSection, DropdownItem as HeroDropdownItem } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DropdownProps = React.ComponentProps<typeof HeroDropdown> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Dropdown: React.FC<DropdownProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-dropdown-skeleton ${className}`} />;
    }

    const content = (
      <HeroDropdown
        {...props}
      >
        {children}
      </HeroDropdown>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

export const DropdownTrigger = HeroDropdownTrigger;
export const DropdownMenu = HeroDropdownMenu;
export const DropdownSection = HeroDropdownSection;
export const DropdownItem = HeroDropdownItem;
