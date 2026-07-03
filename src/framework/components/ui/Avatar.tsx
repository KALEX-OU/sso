"use client";

import React from "react";
import {
  Avatar as HeroAvatar,
  AvatarFallback as HeroAvatarFallback,
  AvatarImage as HeroAvatarImage,
  AvatarRoot as HeroAvatarRoot
} from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type AvatarProps = React.ComponentProps<typeof HeroAvatar> & {
  isSkeleton?: boolean;
  tooltip?: string;
};

const AvatarComponent: React.FC<AvatarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-avatar-skeleton ${className}`} />;
    }

    const content = (
      <HeroAvatar
        className={`klx-avatar ${className}`}
        {...props}
      >
        {children}
      </HeroAvatar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>;
    }

    return content;
  }
);

AvatarComponent.displayName = "Avatar";

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const Avatar = Object.assign(AvatarComponent, {
  Fallback: HeroAvatarFallback,
  Image: HeroAvatarImage,
  Root: HeroAvatarRoot
});

export const AvatarFallback = HeroAvatarFallback;
export const AvatarImage = HeroAvatarImage;
export const AvatarRoot = HeroAvatarRoot;
