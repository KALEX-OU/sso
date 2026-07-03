"use client";

import React from "react";
import { Button as HeroButton, ButtonGroup } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";
import { Spinner } from "./Spinner";

export interface ButtonProps extends Omit<React.ComponentProps<typeof HeroButton>, "onClick" | "variant" | "children"> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "ghost" | "link" | "outline" | "danger-soft" | "tertiary";
  size?: "sm" | "md" | "lg";
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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
      const sizeClasses = {
        sm: "h-8 w-20",
        md: "h-10 w-24",
        lg: "h-12 w-32"
      }[size ?? "md"];
      return <Skeleton className={`rounded-xl ${sizeClasses} ${className}`} />;
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
          variant={variant as "primary" | "secondary" | "danger" | "ghost" | "danger-soft" | "outline" | "tertiary" | undefined}
          onClick={onClick ? (e) => onClick(e as React.MouseEvent<HTMLButtonElement>) : undefined}
          {...props}
        >
          {label || children}
        </HeroButton>
      );
      return tooltip ? <Tooltip content={tooltip}>{rawButton}</Tooltip> : rawButton;
    }

    const appliedVariant = variant ?? "primary";
    const appliedSize = size ?? "md";

    const buttonContent = (
      <HeroButton
        ref={ref}
        className={`klx-btn klx-btn--${appliedVariant} klx-btn--${appliedSize} ${className}`}
        isDisabled={disabled || isDisabled || isLoading}
        variant={appliedVariant as "primary" | "secondary" | "danger" | "ghost" | "danger-soft" | "outline" | "tertiary" | undefined}
        onClick={onClick ? (e) => onClick(e as React.MouseEvent<HTMLButtonElement>) : undefined}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-1.5" />}
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

Button.displayName = "Button";

export { ButtonGroup };
