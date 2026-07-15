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

    // A11y (L0.4/L3.2): come il Modal, Drawer e DrawerRoot HeroUI montano un
    // DialogTrigger react-aria che senza figlio pressable logga il warning
    // "PressResponder was rendered without a pressable child". Nell'uso
    // controllato (isOpen definito, nessun Drawer.Trigger) si soddisfa il
    // PressResponder con un trigger inerte sr-only fuori da tab order e AT.
    // Il tipo DrawerTriggerProps non dichiara tabIndex ma il componente lo
    // inoltra al div interno: l'intersezione tipizza il prop extra senza cast.
    const inertTriggerProps: React.ComponentProps<typeof HeroDrawerTrigger> & { tabIndex: number; "aria-hidden": boolean } = {
      "aria-hidden": true,
      tabIndex: -1,
      className: "sr-only"
    };
    const content = props.isOpen !== undefined ? (
      <HeroDrawerRoot {...props}>
        <HeroDrawerTrigger {...inertTriggerProps} />
        {children}
      </HeroDrawerRoot>
    ) : (
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
