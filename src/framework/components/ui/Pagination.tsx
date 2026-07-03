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

export const Pagination: React.FC<PaginationProps> = (
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

Pagination.displayName = "Pagination";

