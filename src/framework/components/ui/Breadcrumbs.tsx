"use client";

import React from "react";
import { Breadcrumbs as HeroBreadcrumbs, BreadcrumbsItem as HeroBreadcrumbsItem } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type BreadcrumbsProps = React.ComponentProps<typeof HeroBreadcrumbs> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const BreadcrumbsBase: React.FC<BreadcrumbsProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-breadcrumbs-skeleton ${className}`} />;
    }

    const content = (
      <HeroBreadcrumbs
        className={`klx-breadcrumbs ${className}`}
        {...props}
      >
        {children}
      </HeroBreadcrumbs>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

BreadcrumbsBase.displayName = "Breadcrumbs";

export const BreadcrumbsItem = HeroBreadcrumbsItem;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const BreadcrumbsRoot = HeroBreadcrumbs.Root;

export const Breadcrumbs = Object.assign(BreadcrumbsBase, {
  Root: HeroBreadcrumbs.Root,
  Item: BreadcrumbsItem
});
