"use client";

import React from "react";
import { Kbd as HeroKbd } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type KbdProps = React.ComponentProps<typeof HeroKbd> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const KbdBase: React.FC<KbdProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-kbd-skeleton ${className}`} />;
    }

    const content = (
      <HeroKbd
        className={`klx-kbd ${className}`}
        {...props}
      >
        {children}
      </HeroKbd>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

KbdBase.displayName = "Kbd";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const KbdRoot = HeroKbd.Root;
export const KbdAbbr = HeroKbd.Abbr;
export const KbdContent = HeroKbd.Content;

export const Kbd = Object.assign(KbdBase, {
  Root: HeroKbd.Root,
  Abbr: HeroKbd.Abbr,
  Content: HeroKbd.Content,
});
