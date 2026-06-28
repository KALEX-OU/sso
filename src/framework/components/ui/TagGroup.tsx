"use client";

import React from "react";
import { TagGroup as HeroTagGroup, Tag as HeroTag, TagRemoveButton as HeroTagRemoveButton } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TagGroupProps = React.ComponentProps<typeof HeroTagGroup> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const TagGroup: React.FC<TagGroupProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-tag-group-skeleton ${className}`} />;
    }

    const content = (
      <HeroTagGroup
        className={`klx-tag-group ${className}`}
        {...props}
      >
        {children}
      </HeroTagGroup>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

export const Tag = HeroTag;
export const TagRemoveButton = HeroTagRemoveButton;
