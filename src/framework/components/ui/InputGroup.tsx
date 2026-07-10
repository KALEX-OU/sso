"use client";

import React from "react";
import { InputGroup as HeroInputGroup, InputGroupPrefix as HeroInputGroupPrefix, InputGroupSuffix as HeroInputGroupSuffix } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type InputGroupProps = React.ComponentProps<typeof HeroInputGroup> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const InputGroupBase: React.FC<InputGroupProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-input-group-skeleton ${className}`} />;
    }

    const content = (
      <HeroInputGroup
        className={`klx-input-group ${className}`}
        {...props}
      >
        {children}
      </HeroInputGroup>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

InputGroupBase.displayName = "InputGroup";

export const InputGroupPrefix = HeroInputGroupPrefix;
export const InputGroupSuffix = HeroInputGroupSuffix;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const InputGroup = Object.assign(InputGroupBase, {
  Prefix: InputGroupPrefix,
  Suffix: InputGroupSuffix
});
