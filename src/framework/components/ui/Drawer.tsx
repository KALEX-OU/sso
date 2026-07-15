"use client";

import React from "react";
import { Drawer as HeroDrawer, DrawerRoot as HeroDrawerRoot, DrawerTrigger as HeroDrawerTrigger, DrawerBackdrop as HeroDrawerBackdrop, DrawerContent as HeroDrawerContent, DrawerDialog as HeroDrawerDialog, DrawerHeading as HeroDrawerHeading, DrawerHeader as HeroDrawerHeader, DrawerBody as HeroDrawerBody, DrawerFooter as HeroDrawerFooter, DrawerCloseTrigger as HeroDrawerCloseTrigger } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type DrawerProps = React.ComponentProps<typeof HeroDrawer> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const DrawerBase: React.FC<DrawerProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-drawer-skeleton ${className}`} />;
    }

    // A11y (L3.2): Drawer/DrawerRoot HeroUI montano un DialogTrigger react-aria
    // che pretende un figlio pressable (e DrawerTrigger NON inoltra tabIndex,
    // quindi il trucco del trigger inerte del Modal qui non funziona). Per
    // l'USO CONTROLLATO usare Drawer.Backdrop STANDALONE con isOpen/onOpenChange
    // (eredita ModalOverlay react-aria, che supporta il controllo diretto senza
    // trigger): niente DialogTrigger → niente warning. Questo componente resta
    // per l'uso con Drawer.Trigger reale.
    const content = (
      <HeroDrawer
        {...props}
      >
        {children}
      </HeroDrawer>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

DrawerBase.displayName = "Drawer";

export const DrawerBackdrop = HeroDrawerBackdrop;
export const DrawerContent = HeroDrawerContent;
export const DrawerDialog = HeroDrawerDialog;
export const DrawerHeading = HeroDrawerHeading;
export const DrawerHeader = HeroDrawerHeader;
export const DrawerBody = HeroDrawerBody;
export const DrawerFooter = HeroDrawerFooter;
export const DrawerCloseTrigger = HeroDrawerCloseTrigger;
export const DrawerTrigger = HeroDrawerTrigger;
export const DrawerRoot = HeroDrawerRoot;

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const Drawer = Object.assign(DrawerBase, {
  Backdrop: DrawerBackdrop,
  Content: DrawerContent,
  Dialog: DrawerDialog,
  Heading: DrawerHeading,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  CloseTrigger: DrawerCloseTrigger,
  Trigger: DrawerTrigger,
  Root: DrawerRoot
});
