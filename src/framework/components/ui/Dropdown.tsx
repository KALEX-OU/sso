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

const DropdownBase: React.FC<DropdownProps> = (
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

DropdownBase.displayName = "Dropdown";

export const DropdownTrigger = HeroDropdownTrigger;
export const DropdownMenu = HeroDropdownMenu;
export const DropdownSection = HeroDropdownSection;
export const DropdownItem = HeroDropdownItem;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const DropdownRoot = HeroDropdown.Root;
export const DropdownPopover = HeroDropdown.Popover;
export const DropdownItemIndicator = HeroDropdown.ItemIndicator;
export const DropdownSubmenuIndicator = HeroDropdown.SubmenuIndicator;
export const DropdownSubmenuTrigger = HeroDropdown.SubmenuTrigger;

export const Dropdown = Object.assign(DropdownBase, {
  Root: HeroDropdown.Root,
  Popover: HeroDropdown.Popover,
  ItemIndicator: HeroDropdown.ItemIndicator,
  SubmenuIndicator: HeroDropdown.SubmenuIndicator,
  SubmenuTrigger: HeroDropdown.SubmenuTrigger,
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Section: DropdownSection,
  Item: DropdownItem
});
