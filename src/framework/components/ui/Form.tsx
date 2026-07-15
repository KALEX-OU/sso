"use client";

import React from "react";
import { Form as HeroForm } from "@heroui/react";

export type FormProps = React.ComponentProps<typeof HeroForm>;

const FormBase = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className = "", ...props }, ref) => {
    return <HeroForm ref={ref} className={`klx-form ${className}`} {...props} />;
  }
);

FormBase.displayName = "Form";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const FormRoot = HeroForm.Root;

export const Form = Object.assign(FormBase, {
  Root: HeroForm.Root,
});
