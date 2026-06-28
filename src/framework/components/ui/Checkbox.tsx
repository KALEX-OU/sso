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

export const Checkbox = CheckboxComponent as React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<React.ElementRef<typeof HeroCheckbox>>> & {
  Control: typeof HeroCheckbox.Control;
  Indicator: typeof HeroCheckbox.Indicator;
  Content: typeof HeroCheckbox.Content;
};

Checkbox.displayName = "Checkbox";
Checkbox.Control = HeroCheckbox.Control;
Checkbox.Indicator = HeroCheckbox.Indicator;
Checkbox.Content = HeroCheckbox.Content;

export const CheckboxGroup = HeroCheckboxGroup;
