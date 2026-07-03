"use client";

import React from "react";
import { ColorArea as HeroColorArea } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ColorAreaProps = React.ComponentProps<typeof HeroColorArea> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const ColorArea: React.FC<ColorAreaProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-color-area-skeleton ${className}`} />;
    }

    const content = (
      <HeroColorArea
        className={`klx-color-area ${className}`}
        {...props}
      >
        {children}
      </HeroColorArea>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ColorArea.displayName = "ColorArea";

