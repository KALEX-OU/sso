"use client";

import React from "react";
import { DisclosureGroup as HeroDisclosureGroup, DisclosureGroupRoot as HeroDisclosureGroupRoot } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DisclosureGroupProps = React.ComponentProps<typeof HeroDisclosureGroup> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const DisclosureGroup: React.FC<DisclosureGroupProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-disclosure-group-skeleton ${className}`} />;
    }

    const content = (
      <HeroDisclosureGroup
        className={`klx-disclosure-group ${className}`}
        {...props}
      >
        {children}
      </HeroDisclosureGroup>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

DisclosureGroup.displayName = "DisclosureGroup";

export const DisclosureGroupRoot = HeroDisclosureGroupRoot;
