"use client";

import React from "react";
import { Autocomplete as HeroAutocomplete } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type AutocompleteProps = React.ComponentProps<typeof HeroAutocomplete> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Autocomplete: React.FC<AutocompleteProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-autocomplete-skeleton ${className}`} />;
    }

    const content = (
      <HeroAutocomplete
        className={`klx-autocomplete ${className}`}
        {...props}
      >
        {children}
      </HeroAutocomplete>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Autocomplete.displayName = "Autocomplete";

// NB: ListBoxItem/ListBoxSection NON vengono ri-esportati da qui: la fonte canonica è ./ListBox
// (evita simboli duplicati nel barrel ui/index.ts).
