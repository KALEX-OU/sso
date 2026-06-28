"use client";

import React from "react";
import { AlertDialog as HeroAlertDialog, AlertDialogBackdrop as HeroAlertDialogBackdrop, AlertDialogBody as HeroAlertDialogBody, AlertDialogCloseTrigger as HeroAlertDialogCloseTrigger, AlertDialogContainer as HeroAlertDialogContainer, AlertDialogDialog as HeroAlertDialogDialog, AlertDialogFooter as HeroAlertDialogFooter, AlertDialogHeader as HeroAlertDialogHeader, AlertDialogHeading as HeroAlertDialogHeading, AlertDialogIcon as HeroAlertDialogIcon, AlertDialogRoot as HeroAlertDialogRoot, AlertDialogTrigger as HeroAlertDialogTrigger } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type AlertDialogProps = React.ComponentProps<typeof HeroAlertDialog> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const AlertDialog: React.FC<AlertDialogProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-alert-dialog-skeleton ${className}`} />;
    }

    const content = (
      <HeroAlertDialog
        {...props}
      >
        {children}
      </HeroAlertDialog>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

export const AlertDialogBackdrop = HeroAlertDialogBackdrop;
export const AlertDialogBody = HeroAlertDialogBody;
export const AlertDialogCloseTrigger = HeroAlertDialogCloseTrigger;
export const AlertDialogContainer = HeroAlertDialogContainer;
export const AlertDialogDialog = HeroAlertDialogDialog;
export const AlertDialogFooter = HeroAlertDialogFooter;
export const AlertDialogHeader = HeroAlertDialogHeader;
export const AlertDialogHeading = HeroAlertDialogHeading;
export const AlertDialogIcon = HeroAlertDialogIcon;
export const AlertDialogRoot = HeroAlertDialogRoot;
export const AlertDialogTrigger = HeroAlertDialogTrigger;
