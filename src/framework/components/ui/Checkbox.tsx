"use client";

import React from "react";
import { Checkbox as HeroCheckbox, CheckboxGroup as HeroCheckboxGroup } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export interface CheckboxProps extends Omit<React.ComponentProps<typeof HeroCheckbox>, "onChange" | "isSelected" | "onValueChange"> {
  label?: string;
  checked?: boolean;
  isSelected?: boolean;
  onChange?: (checked: boolean) => void;
  onValueChange?: (checked: boolean) => void;
  isSkeleton?: boolean;
  tooltip?: string;
}

/**
 * Checkbox del framework con doppio binding dei props (retrocompatibilità):
 * - stato: `checked` ha priorità su `isSelected` (se entrambi presenti vince `checked`);
 * - callback: viene invocata SOLO la prima presente tra `onChange` e `onValueChange` (onChange vince).
 */
const CheckboxComponent = React.forwardRef<React.ElementRef<typeof HeroCheckbox>, CheckboxProps>(
  ({ className = "", label, checked, isSelected, onChange, onValueChange, isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className="h-5 w-24 rounded" />;
    }

    const activeChecked = checked !== undefined ? checked : isSelected;
    const activeOnChange = onChange || onValueChange;

    const checkboxElement = (
      <HeroCheckbox
        ref={ref}
        isSelected={activeChecked}
        onChange={activeOnChange}
        className={`klx-checkbox ${className}`}
        {...props}
      >
        {children || (
          <>
            <HeroCheckbox.Control className="klx-checkbox-control">
              <HeroCheckbox.Indicator className="klx-checkbox-indicator" />
            </HeroCheckbox.Control>
            {label && <HeroCheckbox.Content className="klx-checkbox-label">{label}</HeroCheckbox.Content>}
          </>
        )}
      </HeroCheckbox>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{checkboxElement}</Tooltip>;
    }

    return checkboxElement;
  }
);

CheckboxComponent.displayName = "Checkbox";

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const Checkbox = Object.assign(CheckboxComponent, {
  Control: HeroCheckbox.Control,
  Indicator: HeroCheckbox.Indicator,
  Content: HeroCheckbox.Content
});

export const CheckboxGroup = HeroCheckboxGroup;
