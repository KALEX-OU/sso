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

const SearchFieldBase = React.forwardRef<React.ElementRef<typeof HeroSearchField>, SearchFieldProps>(
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

SearchFieldBase.displayName = "SearchField";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const SearchFieldRoot = HeroSearchField.Root;
export const SearchFieldGroup = HeroSearchField.Group;
export const SearchFieldInput = HeroSearchField.Input;
export const SearchFieldSearchIcon = HeroSearchField.SearchIcon;
export const SearchFieldClearButton = HeroSearchField.ClearButton;

export const SearchField = Object.assign(SearchFieldBase, {
  Root: HeroSearchField.Root,
  Group: HeroSearchField.Group,
  Input: HeroSearchField.Input,
  SearchIcon: HeroSearchField.SearchIcon,
  ClearButton: HeroSearchField.ClearButton
});
