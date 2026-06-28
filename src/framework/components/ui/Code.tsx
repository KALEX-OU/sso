"use client";

import React from "react";
import { Code as HeroCode } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type CodeProps = React.ComponentProps<typeof HeroCode> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Code: React.FC<CodeProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-code-skeleton ${className}`} />;
    }

    const content = (
      <HeroCode
        className={`klx-code ${className}`}
        {...props}
      >
        {children}
      </HeroCode>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

