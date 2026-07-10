"use client";

import React from "react";
import { Radio as HeroRadio, RadioGroup as HeroRadioGroup } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type RadioProps = React.ComponentProps<typeof HeroRadio> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const RadioBase: React.FC<RadioProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-radio-skeleton ${className}`} />;
    }

    const content = (
      <HeroRadio
        className={`klx-radio ${className}`}
        {...props}
      >
        {children}
      </HeroRadio>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

RadioBase.displayName = "Radio";

export const RadioGroup = HeroRadioGroup;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const Radio = Object.assign(RadioBase, {
  Group: RadioGroup
});
