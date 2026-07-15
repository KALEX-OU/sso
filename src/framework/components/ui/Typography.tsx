"use client";

import React from "react";
import { Typography as HeroTypography } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TypographyProps = React.ComponentProps<typeof HeroTypography> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const TypographyBase: React.FC<TypographyProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-typography-skeleton ${className}`} />;
    }

    const content = (
      <HeroTypography
        className={`klx-typography ${className}`}
        {...props}
      >
        {children}
      </HeroTypography>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

TypographyBase.displayName = "Typography";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const TypographyCode = HeroTypography.Code;
export const TypographyHeading = HeroTypography.Heading;
export const TypographyParagraph = HeroTypography.Paragraph;
export const TypographyProse = HeroTypography.Prose;
export const TypographyRoot = HeroTypography.Root;

export const Typography = Object.assign(TypographyBase, {
  Code: HeroTypography.Code,
  Heading: HeroTypography.Heading,
  Paragraph: HeroTypography.Paragraph,
  Prose: HeroTypography.Prose,
  Root: HeroTypography.Root,
});
