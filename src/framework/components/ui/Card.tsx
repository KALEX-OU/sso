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
  /**
   * Escape hatch documentato (stesso pattern del Button): rende la Card HeroUI pura SENZA
   * la classe `klx-card` e SENZA la struttura iniettata dal wrapper (header, body `p-5`,
   * footer). I children vengono resi diretti: la composizione è manuale con
   * Card.Header/Card.Content/Card.Footer, e `title`/`description`/`footer` non vengono
   * renderizzati. `isSkeleton` e `tooltip` restano attivi.
   */
  unstyled?: boolean;
}

const CardBase: React.FC<CardProps> = (
  ({ className = "", title, description, footer, isSkeleton, tooltip, unstyled, children, ...props }) => {
    if (isSkeleton) {
      return (
        <div className={`klx-card klx-card--skeleton p-4 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col gap-3 ${className}`}>
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      );
    }

    // Modalità unstyled: passthrough puro verso HeroUI (DOM identico a @heroui/react,
    // nessun body `klx-card-body p-5` iniettato attorno ai children).
    if (unstyled) {
      const rawCard = (
        <HeroCard className={className} {...props}>
          {children}
        </HeroCard>
      );
      return tooltip ? <Tooltip content={tooltip}>{rawCard}</Tooltip> : rawCard;
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

CardBase.displayName = "Card";

// `CardRoot` è la Card nativa HeroUI pura, SENZA la struttura klx del wrapper (DOM identico
// all'uso diretto di @heroui/react, che resta comunque vietato fuori da ui/): da usare per
// composizioni manuali dove il body `p-5` non deve essere iniettato.
export {
  HeroCardHeader as CardHeader,
  HeroCardContent as CardBody,
  HeroCardContent as CardContent,
  HeroCardFooter as CardFooter,
  HeroCard as CardRoot
};

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign.
// `Body` e `Content` sono alias dello stesso sub-componente HeroUI (coerenti coi re-export nominali).
export const CardTitle = HeroCard.Title;
export const CardDescription = HeroCard.Description;

export const Card = Object.assign(CardBase, {
  Title: HeroCard.Title,
  Description: HeroCard.Description,
  Header: HeroCardHeader,
  Content: HeroCardContent,
  Body: HeroCardContent,
  Footer: HeroCardFooter,
  Root: HeroCard
});
