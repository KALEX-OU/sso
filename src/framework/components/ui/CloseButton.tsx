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

const CloseButtonBase: React.FC<CloseButtonProps> = (
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

CloseButtonBase.displayName = "CloseButton";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const CloseButtonRoot = HeroCloseButton.Root;

export const CloseButton = Object.assign(CloseButtonBase, {
  Root: HeroCloseButton.Root,
});
