"use client";

import React from "react";
import { Link as HeroLink } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type LinkProps = React.ComponentProps<typeof HeroLink> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Link: React.FC<LinkProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-link-skeleton ${className}`} />;
    }

    const content = (
      <HeroLink
        className={`klx-link ${className}`}
        {...props}
      >
        {children}
      </HeroLink>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

