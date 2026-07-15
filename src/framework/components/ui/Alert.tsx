"use client";

import React from "react";
import { Alert as HeroAlert } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type AlertProps = React.ComponentProps<typeof HeroAlert> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const AlertBase: React.FC<AlertProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-alert-skeleton ${className}`} />;
    }

    const content = (
      <HeroAlert
        className={`klx-alert ${className}`}
        {...props}
      >
        {children}
      </HeroAlert>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

AlertBase.displayName = "Alert";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const AlertRoot = HeroAlert.Root;
export const AlertIndicator = HeroAlert.Indicator;
export const AlertContent = HeroAlert.Content;
export const AlertTitle = HeroAlert.Title;
export const AlertDescription = HeroAlert.Description;

export const Alert = Object.assign(AlertBase, {
  Root: HeroAlert.Root,
  Indicator: HeroAlert.Indicator,
  Content: HeroAlert.Content,
  Title: HeroAlert.Title,
  Description: HeroAlert.Description,
});
