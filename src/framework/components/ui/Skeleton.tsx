"use client";

import React from "react";
import { Skeleton as HeroSkeleton } from "@heroui/react";

export type SkeletonProps = React.ComponentProps<typeof HeroSkeleton>;

const SkeletonBase = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = "", ...props }, ref) => {
    return <HeroSkeleton ref={ref} className={`klx-skeleton ${className}`} {...props} />;
  }
);

SkeletonBase.displayName = "Skeleton";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const SkeletonRoot = HeroSkeleton.Root;

export const Skeleton = Object.assign(SkeletonBase, {
  Root: HeroSkeleton.Root,
});
