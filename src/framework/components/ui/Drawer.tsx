"use client";

import React from "react";
import { Drawer as HeroDrawer, DrawerContent as HeroDrawerContent, DrawerHeader as HeroDrawerHeader, DrawerBody as HeroDrawerBody, DrawerFooter as HeroDrawerFooter } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DrawerProps = React.ComponentProps<typeof HeroDrawer> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const DrawerBase: React.FC<DrawerProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-drawer-skeleton ${className}`} />;
    }

    const content = (
      <HeroDrawer
        {...props}
      >
        {children}
      </HeroDrawer>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

DrawerBase.displayName = "Drawer";

export const DrawerContent = HeroDrawerContent;
export const DrawerHeader = HeroDrawerHeader;
export const DrawerBody = HeroDrawerBody;
export const DrawerFooter = HeroDrawerFooter;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const Drawer = Object.assign(DrawerBase, {
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter
});
