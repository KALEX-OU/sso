"use client";

import React from "react";
import { Card as HeroCard, CardHeader as HeroCardHeader, CardContent as HeroCardContent, CardFooter as HeroCardFooter } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export interface CardProps extends Omit<React.ComponentProps<typeof HeroCard>, "title" | "style"> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  isSkeleton?: boolean;
  tooltip?: string;
}

export const Card: React.FC<CardProps> = (
  ({ className = "", title, description, footer, isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return (
        <div className={`klx-card klx-card--skeleton p-4 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col gap-3 ${className}`}>
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      );
    }

    const cardElement = (
      <HeroCard
        className={`klx-card ${className}`}
        {...props}
      >
        {title || description ? (
          <HeroCardHeader className="klx-card-header flex flex-col items-start gap-1 p-5 border-b border-slate-200/60 dark:border-slate-900/60">
            {title && <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{title}</h3>}
            {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
          </HeroCardHeader>
        ) : null}

        {children ? (
          <HeroCardContent className="klx-card-body p-5">
            {children}
          </HeroCardContent>
        ) : null}

        {footer ? (
          <HeroCardFooter className="klx-card-footer px-5 py-4 border-t border-slate-200/60 dark:border-slate-900/60 bg-slate-50/50 dark:bg-slate-950/20">
            {footer}
          </HeroCardFooter>
        ) : null}
      </HeroCard>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{cardElement}</Tooltip>;
    }

    return cardElement;
  }
);

Card.displayName = "Card";

export {
  HeroCardHeader as CardHeader,
  HeroCardContent as CardBody,
  HeroCardContent as CardContent,
  HeroCardFooter as CardFooter
};
