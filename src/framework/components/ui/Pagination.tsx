"use client";

import React from "react";
import { Pagination as HeroPagination } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type PaginationProps = React.ComponentProps<typeof HeroPagination> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const PaginationBase: React.FC<PaginationProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-pagination-skeleton ${className}`} />;
    }

    const content = (
      <HeroPagination
        className={`klx-pagination ${className}`}
        {...props}
      >
        {children}
      </HeroPagination>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

PaginationBase.displayName = "Pagination";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const PaginationRoot = HeroPagination.Root;
export const PaginationSummary = HeroPagination.Summary;
export const PaginationContent = HeroPagination.Content;
export const PaginationItem = HeroPagination.Item;
export const PaginationLink = HeroPagination.Link;
export const PaginationPrevious = HeroPagination.Previous;
export const PaginationPreviousIcon = HeroPagination.PreviousIcon;
export const PaginationNext = HeroPagination.Next;
export const PaginationNextIcon = HeroPagination.NextIcon;
export const PaginationEllipsis = HeroPagination.Ellipsis;

export const Pagination = Object.assign(PaginationBase, {
  Root: HeroPagination.Root,
  Summary: HeroPagination.Summary,
  Content: HeroPagination.Content,
  Item: HeroPagination.Item,
  Link: HeroPagination.Link,
  Previous: HeroPagination.Previous,
  PreviousIcon: HeroPagination.PreviousIcon,
  Next: HeroPagination.Next,
  NextIcon: HeroPagination.NextIcon,
  Ellipsis: HeroPagination.Ellipsis
});
