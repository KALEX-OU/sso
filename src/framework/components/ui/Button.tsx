"use client";

import React from "react";
import { Button as HeroButton, ButtonGroup } from "@heroui/react";

export type ButtonProps = React.ComponentProps<typeof HeroButton>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <HeroButton
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { ButtonGroup };
