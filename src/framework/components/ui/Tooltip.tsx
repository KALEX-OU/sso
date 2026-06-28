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

export const Tooltip: React.FC<TooltipProps> & {
  Trigger: typeof HeroTooltipTrigger;
  Content: typeof HeroTooltipContent;
} = ({
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

Tooltip.Trigger = HeroTooltipTrigger;
Tooltip.Content = HeroTooltipContent;
Tooltip.displayName = "Tooltip";
