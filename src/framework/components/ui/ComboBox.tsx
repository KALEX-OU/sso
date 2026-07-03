"use client";

import React from "react";
import { ComboBox as HeroComboBox, ComboBoxContext as HeroComboBoxContext, ComboBoxInputGroup as HeroComboBoxInputGroup, ComboBoxPopover as HeroComboBoxPopover, ComboBoxRoot as HeroComboBoxRoot, ComboBoxTrigger as HeroComboBoxTrigger } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ComboBoxProps = React.ComponentProps<typeof HeroComboBox> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ComboBox: React.FC<ComboBoxProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-combo-box-skeleton ${className}`} />;
    }

    const content = (
      <HeroComboBox
        className={`klx-combo-box ${className}`}
        {...props}
      >
        {children}
      </HeroComboBox>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ComboBox.displayName = "ComboBox";

export const ComboBoxContext = HeroComboBoxContext;
export const ComboBoxInputGroup = HeroComboBoxInputGroup;
export const ComboBoxPopover = HeroComboBoxPopover;
export const ComboBoxRoot = HeroComboBoxRoot;
export const ComboBoxTrigger = HeroComboBoxTrigger;
