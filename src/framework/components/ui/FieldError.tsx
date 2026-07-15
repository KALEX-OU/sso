"use client";

import React from "react";
import { FieldError as HeroFieldError } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type FieldErrorProps = React.ComponentProps<typeof HeroFieldError> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const FieldErrorBase: React.FC<FieldErrorProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-field-error-skeleton ${className}`} />;
    }

    const content = (
      <HeroFieldError
        className={`klx-field-error ${className}`}
        {...props}
      >
        {children}
      </HeroFieldError>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

FieldErrorBase.displayName = "FieldError";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const FieldErrorRoot = HeroFieldError.Root;

export const FieldError = Object.assign(FieldErrorBase, {
  Root: HeroFieldError.Root,
});
