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
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
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
      ...props
    },
    ref
  ) => {
    if (isSkeleton) {
      const sizeClasses = {
        sm: "h-8 w-20",
        md: "h-10 w-24",
        lg: "h-12 w-32"
      }[size];
      return <Skeleton className={`rounded-xl ${sizeClasses} ${className}`} />;
    }

    const buttonContent = (
      <HeroButton
        ref={ref}
        className={`klx-btn klx-btn--${variant} klx-btn--${size} ${className}`}
        isDisabled={disabled || isDisabled || isLoading}
        variant={variant as "primary" | "secondary" | "danger" | "ghost" | "danger-soft" | "outline" | "tertiary" | undefined}
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
