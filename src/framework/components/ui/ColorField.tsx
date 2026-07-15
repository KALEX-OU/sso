"use client";

import React from "react";
import { ColorField as HeroColorField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorFieldProps = React.ComponentProps<typeof HeroColorField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ColorFieldBase = React.forwardRef<React.ElementRef<typeof HeroColorField>, ColorFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorField
        ref={ref}
        className={`klx-color-field ${className}`}
        {...props}
      >
        {children}
      </HeroColorField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ColorFieldBase.displayName = "ColorField";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ColorFieldRoot = HeroColorField.Root;
export const ColorFieldGroup = HeroColorField.Group;
export const ColorFieldInput = HeroColorField.Input;
export const ColorFieldPrefix = HeroColorField.Prefix;
export const ColorFieldSuffix = HeroColorField.Suffix;

export const ColorField = Object.assign(ColorFieldBase, {
  Root: HeroColorField.Root,
  Group: HeroColorField.Group,
  Input: HeroColorField.Input,
  Prefix: HeroColorField.Prefix,
  Suffix: HeroColorField.Suffix,
});
