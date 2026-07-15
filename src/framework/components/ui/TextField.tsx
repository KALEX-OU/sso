"use client";

import React from "react";
import { TextField as HeroTextField } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TextFieldProps = React.ComponentProps<typeof HeroTextField> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const TextFieldBase = React.forwardRef<React.ElementRef<typeof HeroTextField>, TextFieldProps>(
  ({ className = "", isSkeleton, tooltip, children, ...props }, ref) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-text-field-skeleton ${className}`} />;
    }

    const content = (
      <HeroTextField
        ref={ref}
        className={`klx-text-field ${className}`}
        {...props}
      >
        {children}
      </HeroTextField>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

TextFieldBase.displayName = "TextField";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const TextFieldRoot = HeroTextField.Root;

export const TextField = Object.assign(TextFieldBase, {
  Root: HeroTextField.Root,
});
