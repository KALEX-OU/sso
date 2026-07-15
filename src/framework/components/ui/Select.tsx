"use client";

import React from "react";
import {
  Select as HeroSelect,
  SelectTrigger as HeroSelectTrigger,
  SelectValue as HeroSelectValue,
  SelectPopover as HeroSelectPopover,
  ListBox as HeroListBox,
  ListBoxItem as HeroListBoxItem
} from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<React.ComponentProps<typeof HeroSelect>, "onChange" | "children" | "selectedKey" | "onSelectionChange"> {
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  value?: string;
  selectedKey?: string | number | null;
  onChange?: (value: string) => void;
  onSelectionChange?: (key: string | number | null) => void;
  error?: string;
  isRequired?: boolean;
  isSkeleton?: boolean;
  tooltip?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  isDisabled?: boolean;
}

/**
 * Select del framework con doppio binding dei props (retrocompatibilità):
 * - selezione: `value` ha priorità su `selectedKey` (se entrambi presenti vince `value`);
 * - callback: `onChange` e `onSelectionChange` vengono invocate ENTRAMBE, in quest'ordine.
 * Con `children` renderizza la composizione custom (Trigger/Popover); senza, genera le opzioni da `options`.
 * Normalizzazione chiavi (E3.4, niente cast): le opzioni del wrapper usano id stringa, quindi
 * i Key numerici vengono convertiti a stringa per `onChange`; una selezione azzerata (null)
 * arriva a `onChange` come stringa vuota e a `onSelectionChange` come `null`.
 */
const SelectComponent = React.forwardRef<React.ElementRef<typeof HeroSelect>, SelectProps>(
  (
    {
      className = "",
      label,
      placeholder,
      options = [],
      value,
      selectedKey,
      onChange,
      onSelectionChange,
      error,
      isRequired,
      isSkeleton,
      tooltip,
      children,
      disabled,
      isDisabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    // A11y (L0.4): la label visibile del wrapper è un <label> HTML non collegato al controllo
    // react-aria, quindi l'accessible name va SEMPRE fornito via aria-label (esplicito,
    // altrimenti label o placeholder, già localizzati al call site).
    const fieldAriaLabel = ariaLabel ?? label ?? placeholder;
    if (isSkeleton) {
      return (
        <div className="flex flex-col gap-1.5 w-full">
          {label && <Skeleton className="h-4 w-20 rounded" />}
          <Skeleton className="h-[48px] w-full rounded-2xl" />
        </div>
      );
    }

    const activeSelectedKey = value !== undefined ? value : selectedKey;
    // Type guard esplicito sul Key ricevuto da HeroUI/react-aria: nessun cast `as`.
    const activeOnSelectionChange = (key: unknown) => {
      const normalizedKey: string | number | null =
        typeof key === "string" || typeof key === "number" ? key : null;
      if (onChange) onChange(normalizedKey === null ? "" : String(normalizedKey));
      if (onSelectionChange) onSelectionChange(normalizedKey);
    };

    const selectElement = children ? (
      <HeroSelect
        ref={ref}
        selectedKey={activeSelectedKey}
        onSelectionChange={activeOnSelectionChange}
        className={`klx-select ${className}`}
        isDisabled={disabled || isDisabled}
        isRequired={isRequired}
        placeholder={placeholder}
        aria-label={fieldAriaLabel}
        {...props}
      >
        {children}
      </HeroSelect>
    ) : (
      <HeroSelect
        ref={ref}
        selectedKey={activeSelectedKey}
        onSelectionChange={activeOnSelectionChange}
        className={`klx-select ${className}`}
        isDisabled={disabled || isDisabled}
        isRequired={isRequired}
        placeholder={placeholder}
        aria-label={fieldAriaLabel}
        {...props}
      >
        <HeroSelectTrigger className="klx-select-trigger">
          <HeroSelectValue />
        </HeroSelectTrigger>
        <HeroSelectPopover className="klx-select-popover min-w-[200px]">
          <HeroListBox className="flex flex-col gap-0.5">
            {options.map((opt) => (
              <HeroListBoxItem
                key={opt.value}
                id={opt.value}
                className=""
              >
                {opt.label}
              </HeroListBoxItem>
            ))}
          </HeroListBox>
        </HeroSelectPopover>
      </HeroSelect>
    );

    const selectWithTooltip = tooltip ? (
      <Tooltip content={tooltip}>{selectElement}</Tooltip>
    ) : (
      selectElement
    );

    return (
      <div className="klx-field-container">
        {label && (
          <label className="klx-label flex items-center justify-between">
            <span>
              {label}
              {isRequired && <span className="text-danger ms-0.5">*</span>}
            </span>
          </label>
        )}
        <div className="w-full relative">
          {selectWithTooltip}
        </div>
        {error && <span className="text-[10px] text-danger font-semibold mt-0.5">{error}</span>}
      </div>
    );
  }
);

SelectComponent.displayName = "Select";

// NB: ListBox/ListBoxItem NON vengono ri-esportati da qui: la fonte canonica è ./ListBox
// (evita simboli duplicati nel barrel ui/index.ts). Qui restano solo i sub-componenti propri di Select.
// `SelectRoot` è il root nativo HeroUI SENZA il contenitore di campo del wrapper (`klx-field-container`):
// da usare per composizioni inline/toolbar (es. filtri) dove il DOM deve restare piatto.
export {
  HeroSelectTrigger as SelectTrigger,
  HeroSelectValue as SelectValue,
  HeroSelectPopover as SelectPopover,
  HeroSelect as SelectRoot
};

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const SelectIndicator = HeroSelect.Indicator;

export const Select = Object.assign(SelectComponent, {
  Indicator: HeroSelect.Indicator,
  Trigger: HeroSelectTrigger,
  Value: HeroSelectValue,
  Popover: HeroSelectPopover,
  Root: HeroSelect
});
