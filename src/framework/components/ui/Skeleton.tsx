"use client";

import React from "react";
import { Skeleton as HeroSkeleton } from "@heroui/react";

export type SkeletonProps = React.ComponentProps<typeof HeroSkeleton>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = "", ...props }, ref) => {
    return <HeroSkeleton ref={ref} className={`klx-skeleton ${className}`} {...props} />;
  }
);

Skeleton.displayName = "Skeleton";
