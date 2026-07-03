"use client";

import React from "react";
import { Toast as HeroToast, ToastProvider as HeroToastProvider } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ToastProps = React.ComponentProps<typeof HeroToast> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const Toast: React.FC<ToastProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-toast-skeleton ${className}`} />;
    }

    const content = (
      <HeroToast
        className={`klx-toast ${className}`}
        {...props}
      >
        {children}
      </HeroToast>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

Toast.displayName = "Toast";

export const ToastProvider = HeroToastProvider;
