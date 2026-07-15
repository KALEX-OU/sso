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

const LinkBase: React.FC<LinkProps> = (
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

LinkBase.displayName = "Link";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const LinkRoot = HeroLink.Root;
export const LinkIcon = HeroLink.Icon;

export const Link = Object.assign(LinkBase, {
  Root: HeroLink.Root,
  Icon: HeroLink.Icon,
});
