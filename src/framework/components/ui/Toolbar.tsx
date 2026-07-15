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

const ToolbarBase: React.FC<ToolbarProps> = (
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

ToolbarBase.displayName = "Toolbar";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const ToolbarRoot = HeroToolbar.Root;

export const Toolbar = Object.assign(ToolbarBase, {
  Root: HeroToolbar.Root,
});
