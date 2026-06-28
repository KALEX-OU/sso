"use client";

import React from "react";
import { Disclosure as HeroDisclosure, DisclosureBody as HeroDisclosureBody, DisclosureContent as HeroDisclosureContent, DisclosureHeading as HeroDisclosureHeading, DisclosureIndicator as HeroDisclosureIndicator, DisclosureTrigger as HeroDisclosureTrigger } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DisclosureProps = React.ComponentProps<typeof HeroDisclosure> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Disclosure: React.FC<DisclosureProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-disclosure-skeleton ${className}`} />;
    }

    const content = (
      <HeroDisclosure
        className={`klx-disclosure ${className}`}
        {...props}
      >
        {children}
      </HeroDisclosure>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

export const DisclosureBody = HeroDisclosureBody;
export const DisclosureContent = HeroDisclosureContent;
export const DisclosureHeading = HeroDisclosureHeading;
export const DisclosureIndicator = HeroDisclosureIndicator;
export const DisclosureTrigger = HeroDisclosureTrigger;
