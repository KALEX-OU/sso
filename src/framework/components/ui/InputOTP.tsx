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

const InputOTPBase: React.FC<InputOTPProps> = (
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

InputOTPBase.displayName = "InputOTP";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const InputOTPRoot = HeroInputOTP.Root;
export const InputOTPGroup = HeroInputOTP.Group;
export const InputOTPSlot = HeroInputOTP.Slot;
export const InputOTPSeparator = HeroInputOTP.Separator;

export const InputOTP = Object.assign(InputOTPBase, {
  Root: HeroInputOTP.Root,
  Group: HeroInputOTP.Group,
  Slot: HeroInputOTP.Slot,
  Separator: HeroInputOTP.Separator,
});
