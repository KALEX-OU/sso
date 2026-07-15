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

const DisclosureBase: React.FC<DisclosureProps> = (
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

DisclosureBase.displayName = "Disclosure";

export const DisclosureBody = HeroDisclosureBody;
export const DisclosureContent = HeroDisclosureContent;
export const DisclosureHeading = HeroDisclosureHeading;
export const DisclosureIndicator = HeroDisclosureIndicator;
export const DisclosureTrigger = HeroDisclosureTrigger;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const DisclosureRoot = HeroDisclosure.Root;

export const Disclosure = Object.assign(DisclosureBase, {
  Root: HeroDisclosure.Root,
  Body: DisclosureBody,
  Content: DisclosureContent,
  Heading: DisclosureHeading,
  Indicator: DisclosureIndicator,
  Trigger: DisclosureTrigger
});
