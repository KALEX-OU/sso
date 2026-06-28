"use client";

import React from "react";
import { Typography as HeroTypography } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TypographyProps = React.ComponentProps<typeof HeroTypography> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Typography: React.FC<TypographyProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-typography-skeleton ${className}`} />;
    }

    const content = (
      <HeroTypography
        className={`klx-typography ${className}`}
        {...props}
      >
        {children}
      </HeroTypography>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

