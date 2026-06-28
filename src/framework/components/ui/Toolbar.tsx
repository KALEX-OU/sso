"use client";

import React from "react";
import { Toolbar as HeroToolbar } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ToolbarProps = React.ComponentProps<typeof HeroToolbar> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Toolbar: React.FC<ToolbarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-toolbar-skeleton ${className}`} />;
    }

    const content = (
      <HeroToolbar
        className={`klx-toolbar ${className}`}
        {...props}
      >
        {children}
      </HeroToolbar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

