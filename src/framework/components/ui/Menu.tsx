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

export const Menu: React.FC<MenuProps> = (
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

Menu.displayName = "Menu";

export const MenuItem = HeroMenuItem;
export const MenuSection = HeroMenuSection;
