"use client";

import React from "react";
import { CloseButton as HeroCloseButton } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type CloseButtonProps = React.ComponentProps<typeof HeroCloseButton> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const CloseButton: React.FC<CloseButtonProps> = (
  ({ className = "", isSkeleton, tooltip, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-close-button-skeleton ${className}`} />;
    }

    const content = (
      <HeroCloseButton
        className={`klx-close-button ${className}`}
        {...props}
      >
      </HeroCloseButton>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

CloseButton.displayName = "CloseButton";

