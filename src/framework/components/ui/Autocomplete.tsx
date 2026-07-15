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

const AutocompleteBase: React.FC<AutocompleteProps> = (
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

AutocompleteBase.displayName = "Autocomplete";

// NB: ListBoxItem/ListBoxSection NON vengono ri-esportati da qui: la fonte canonica è ./ListBox
// (evita simboli duplicati nel barrel ui/index.ts).

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const AutocompleteRoot = HeroAutocomplete.Root;
export const AutocompleteTrigger = HeroAutocomplete.Trigger;
export const AutocompleteValue = HeroAutocomplete.Value;
export const AutocompleteIndicator = HeroAutocomplete.Indicator;
export const AutocompletePopover = HeroAutocomplete.Popover;
export const AutocompleteFilter = HeroAutocomplete.Filter;
export const AutocompleteClearButton = HeroAutocomplete.ClearButton;

export const Autocomplete = Object.assign(AutocompleteBase, {
  Root: HeroAutocomplete.Root,
  Trigger: HeroAutocomplete.Trigger,
  Value: HeroAutocomplete.Value,
  Indicator: HeroAutocomplete.Indicator,
  Popover: HeroAutocomplete.Popover,
  Filter: HeroAutocomplete.Filter,
  ClearButton: HeroAutocomplete.ClearButton,
});
