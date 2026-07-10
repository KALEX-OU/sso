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

const DisclosureGroupBase: React.FC<DisclosureGroupProps> = (
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

DisclosureGroupBase.displayName = "DisclosureGroup";

export const DisclosureGroupRoot = HeroDisclosureGroupRoot;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const DisclosureGroup = Object.assign(DisclosureGroupBase, {
  Root: DisclosureGroupRoot
});
