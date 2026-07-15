"use client";

import React from "react";
import { Menu as HeroMenu, MenuItem as HeroMenuItem, MenuSection as HeroMenuSection } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type MenuProps = React.ComponentProps<typeof HeroMenu> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const MenuBase: React.FC<MenuProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-menu-skeleton ${className}`} />;
    }

    const content = (
      <HeroMenu
        className={`klx-menu ${className}`}
        {...props}
      >
        {children}
      </HeroMenu>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

MenuBase.displayName = "Menu";

export const MenuItem = HeroMenuItem;
export const MenuSection = HeroMenuSection;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const MenuRoot = HeroMenu.Root;
export const MenuItemIndicator = HeroMenu.ItemIndicator;

export const Menu = Object.assign(MenuBase, {
  Root: HeroMenu.Root,
  ItemIndicator: HeroMenu.ItemIndicator,
  Item: MenuItem,
  Section: MenuSection
});
