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

const TabsBase: React.FC<TabsProps> = (
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

TabsBase.displayName = "Tabs";

export const Tab = HeroTab;
export const TabList = HeroTabList;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const TabsRoot = HeroTabs.Root;
export const TabsListContainer = HeroTabs.ListContainer;
export const TabsTab = HeroTabs.Tab;
export const TabsIndicator = HeroTabs.Indicator;
export const TabsSeparator = HeroTabs.Separator;
export const TabsPanel = HeroTabs.Panel;

export const Tabs = Object.assign(TabsBase, {
  Root: HeroTabs.Root,
  ListContainer: HeroTabs.ListContainer,
  Tab: HeroTabs.Tab,
  Indicator: HeroTabs.Indicator,
  Separator: HeroTabs.Separator,
  Panel: HeroTabs.Panel,
  List: TabList
});
