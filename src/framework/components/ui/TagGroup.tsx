"use client";

import React from "react";
import { TagGroup as HeroTagGroup, TagGroupList as HeroTagGroupList, Tag as HeroTag, TagRemoveButton as HeroTagRemoveButton } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TagGroupProps = React.ComponentProps<typeof HeroTagGroup> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const TagGroupBase: React.FC<TagGroupProps> = (
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

TagGroupBase.displayName = "TagGroup";

export const Tag = HeroTag;
export const TagRemoveButton = HeroTagRemoveButton;
// Collection react-aria dei tag: senza questa lista i <Tag> non sono montabili (E5.1).
export const TagGroupList = HeroTagGroupList;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const TagGroupRoot = HeroTagGroup.Root;

export const TagGroup = Object.assign(TagGroupBase, {
  Root: HeroTagGroup.Root,
  List: TagGroupList,
  Tag,
  RemoveButton: TagRemoveButton
});
