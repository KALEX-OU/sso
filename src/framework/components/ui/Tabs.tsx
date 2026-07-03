"use client";

import React from "react";
import { Tabs as HeroTabs, Tab as HeroTab, TabList as HeroTabList } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TabsProps = React.ComponentProps<typeof HeroTabs> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Tabs: React.FC<TabsProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-tabs-skeleton ${className}`} />;
    }

    const content = (
      <HeroTabs
        className={`klx-tabs ${className}`}
        {...props}
      >
        {children}
      </HeroTabs>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Tabs.displayName = "Tabs";

export const Tab = HeroTab;
export const TabList = HeroTabList;
