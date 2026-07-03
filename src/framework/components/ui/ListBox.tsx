"use client";

import React from "react";
import { ListBox as HeroListBox, ListBoxItem as HeroListBoxItem, ListBoxSection as HeroListBoxSection } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ListBoxProps = React.ComponentProps<typeof HeroListBox> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ListBox: React.FC<ListBoxProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-list-box-skeleton ${className}`} />;
    }

    const content = (
      <HeroListBox
        className={`klx-list-box ${className}`}
        {...props}
      >
        {children}
      </HeroListBox>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ListBox.displayName = "ListBox";

export const ListBoxItem = HeroListBoxItem;
export const ListBoxSection = HeroListBoxSection;
