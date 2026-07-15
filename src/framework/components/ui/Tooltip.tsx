"use client";

import React from "react";
import { Tooltip as HeroTooltip, TooltipTrigger as HeroTooltipTrigger, TooltipContent as HeroTooltipContent } from "@heroui/react";

export interface TooltipProps extends React.ComponentProps<typeof HeroTooltip> {
  content?: React.ReactNode;
  children: React.ReactElement | React.ReactNode;
  className?: string;
  delay?: number;
  closeDelay?: number;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const TooltipBase: React.FC<TooltipProps> = ({
  content,
  children,
  className = "",
  delay,
  closeDelay,
  isOpen,
  onOpenChange,
  ...props
}) => {
  if (!content) {
    return (
      <HeroTooltip delay={delay} closeDelay={closeDelay} isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
        {children}
      </HeroTooltip>
    );
  }
  
  return (
    <HeroTooltip delay={delay} closeDelay={closeDelay} isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
      <HeroTooltipTrigger>{children as React.ReactElement}</HeroTooltipTrigger>
      <HeroTooltipContent className={`klx-tooltip ${className}`}>
        {content}
      </HeroTooltipContent>
    </HeroTooltip>
  );
};

TooltipBase.displayName = "Tooltip";

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const TooltipRoot = HeroTooltip.Root;
export const TooltipArrow = HeroTooltip.Arrow;

export const Tooltip = Object.assign(TooltipBase, {
  Root: HeroTooltip.Root,
  Arrow: HeroTooltip.Arrow,
  Trigger: HeroTooltipTrigger,
  Content: HeroTooltipContent
});
