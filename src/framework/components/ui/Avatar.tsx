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

export const Avatar = AvatarComponent as React.FC<AvatarProps> & {
  Fallback: typeof HeroAvatarFallback;
  Image: typeof HeroAvatarImage;
  Root: typeof HeroAvatarRoot;
};

Avatar.displayName = "Avatar";
Avatar.Fallback = HeroAvatarFallback;
Avatar.Image = HeroAvatarImage;
Avatar.Root = HeroAvatarRoot;

export const AvatarFallback = HeroAvatarFallback;
export const AvatarImage = HeroAvatarImage;
export const AvatarRoot = HeroAvatarRoot;
