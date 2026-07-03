"use client";

import React from "react";
import { InputOTP as HeroInputOTP } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type InputOTPProps = React.ComponentProps<typeof HeroInputOTP> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

export const InputOTP: React.FC<InputOTPProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-input-otp-skeleton ${className}`} />;
    }

    const content = (
      <HeroInputOTP
        className={`klx-input-otp ${className}`}
        {...props}
      >
        {children}
      </HeroInputOTP>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

InputOTP.displayName = "InputOTP";

