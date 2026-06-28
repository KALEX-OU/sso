"use client";

import React from "react";
import { SearchField as HeroSearchField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type SearchFieldProps = React.ComponentProps<typeof HeroSearchField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const SearchField = React.forwardRef<React.ElementRef<typeof HeroSearchField>, SearchFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-search-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroSearchField
        ref={ref}
        className={`klx-search-field ${className}`}
        {...props}
      >
        {children}
      </HeroSearchField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

SearchField.displayName = "SearchField";

