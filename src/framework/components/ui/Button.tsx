"use client";

import React from "react";
import { Button as HeroButton, ButtonGroup } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";
import { Spinner } from "./Spinner";

// Variante nativa HeroUI: fonte di verità derivata dai tipi del pacchetto (niente duplicazione manuale).
type HeroButtonVariant = NonNullable<React.ComponentProps<typeof HeroButton>["variant"]>;

/**
 * Varianti supportate dal Button del framework (E3.4).
 * L'array è la SSOT runtime (utile per storybook/test); il `satisfies` garantisce a
 * compile-time che ogni variante sia anche una variante nativa HeroUI, quindi il valore
 * può essere inoltrato a HeroButton SENZA cast. Le vecchie varianti "success"/"warning"/
 * "link" sono state rimosse (v1.0, breaking consentito): non avevano né classi klx né
 * equivalente HeroUI ed erano inutilizzate in tutto il monorepo.
 */
export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "tertiary",
  "danger",
  "danger-soft",
  "ghost",
  "outline"
] as const satisfies readonly HeroButtonVariant[];

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

/** Taglie supportate dal Button del framework. */
export const BUTTON_SIZES = ["sm", "md", "lg"] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps extends Omit<React.ComponentProps<typeof HeroButton>, "onClick" | "variant" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSkeleton?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  label?: string;
  tooltip?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
  /**
   * Escape hatch documentato per usi brand-specific (es. KalexLoginButton, schermate di errore):
   * rende il Button HeroUI puro SENZA le classi `klx-btn*`, inoltrando `size`/`variant` nativi
   * solo se passati esplicitamente (DOM identico all'uso diretto di @heroui/react, che resta
   * comunque vietato fuori da ui/ — regola AGENTS.md). Il default resta lo stile klx.
   */
  unstyled?: boolean;
}

// Classi skeleton per taglia: la mappa esaustiva sostituisce l'oggetto inline (satisfies = completezza garantita).
const SKELETON_SIZE_CLASSES = {
  sm: "h-8 w-20",
  md: "h-10 w-24",
  lg: "h-12 w-32"
} satisfies Record<ButtonSize, string>;

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant,
      size,
      isLoading,
      isSkeleton,
      icon,
      iconPosition = "start",
      label,
      tooltip,
      children,
      disabled,
      isDisabled,
      onClick,
      unstyled,
      ...props
    },
    ref
  ) => {
    if (isSkeleton) {
      return <Skeleton className={`rounded-xl ${SKELETON_SIZE_CLASSES[size ?? "md"]} ${className}`} />;
    }

    // Modalità unstyled: passthrough puro verso HeroUI (nessuna classe klx; size/variant
    // inoltrati SOLO se espliciti, così i default nativi di HeroUI restano invariati).
    if (unstyled) {
      const rawButton = (
        <HeroButton
          ref={ref}
          className={className}
          size={size}
          isDisabled={disabled || isDisabled || isLoading}
          variant={variant}
          onClick={onClick ? (e) => onClick(e as React.MouseEvent<HTMLButtonElement>) : undefined}
          {...props}
        >
          {label || children}
        </HeroButton>
      );
      return tooltip ? <Tooltip content={tooltip}>{rawButton}</Tooltip> : rawButton;
    }

    const appliedVariant: ButtonVariant = variant ?? "primary";
    const appliedSize: ButtonSize = size ?? "md";

    const buttonContent = (
      <HeroButton
        ref={ref}
        className={`klx-btn klx-btn--${appliedVariant} klx-btn--${appliedSize} ${className}`}
        isDisabled={disabled || isDisabled || isLoading}
        variant={appliedVariant}
        onClick={onClick ? (e) => onClick(e as React.MouseEvent<HTMLButtonElement>) : undefined}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="me-1.5" />}
        {!isLoading && icon && iconPosition === "start" && (
          <span className="klx-btn-icon klx-btn-icon--start">{icon}</span>
        )}
        {label || children}
        {!isLoading && icon && iconPosition === "end" && (
          <span className="klx-btn-icon klx-btn-icon--end">{icon}</span>
        )}
      </HeroButton>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{buttonContent}</Tooltip>;
    }

    return buttonContent;
  }
);

ButtonBase.displayName = "Button";

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const Button = Object.assign(ButtonBase, {
  Group: ButtonGroup
});

export { ButtonGroup };
