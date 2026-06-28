"use client";

import React from "react";
import { Form as HeroForm } from "@heroui/react";

export type FormProps = React.ComponentProps<typeof HeroForm>;

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className = "", ...props }, ref) => {
    return <HeroForm ref={ref} className={`klx-form ${className}`} {...props} />;
  }
);

Form.displayName = "Form";
