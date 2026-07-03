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

export const Alert: React.FC<AlertProps> = (
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

Alert.displayName = "Alert";

