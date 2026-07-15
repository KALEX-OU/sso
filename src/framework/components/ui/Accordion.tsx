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

const AccordionBase: React.FC<AccordionProps> = (
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

AccordionBase.displayName = "Accordion";

export const AccordionItem = HeroAccordionItem;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const AccordionRoot = HeroAccordion.Root;
export const AccordionHeading = HeroAccordion.Heading;
export const AccordionTrigger = HeroAccordion.Trigger;
export const AccordionPanel = HeroAccordion.Panel;
export const AccordionIndicator = HeroAccordion.Indicator;
export const AccordionBody = HeroAccordion.Body;

export const Accordion = Object.assign(AccordionBase, {
  Root: HeroAccordion.Root,
  Heading: HeroAccordion.Heading,
  Trigger: HeroAccordion.Trigger,
  Panel: HeroAccordion.Panel,
  Indicator: HeroAccordion.Indicator,
  Body: HeroAccordion.Body,
  Item: AccordionItem
});
