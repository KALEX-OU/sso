"use client";

import React from "react";
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type AccordionProps = React.ComponentProps<typeof HeroAccordion> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Accordion: React.FC<AccordionProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-accordion-skeleton ${className}`} />;
    }

    const content = (
      <HeroAccordion
        className={`klx-accordion ${className}`}
        {...props}
      >
        {children}
      </HeroAccordion>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Accordion.displayName = "Accordion";

export const AccordionItem = HeroAccordionItem;
