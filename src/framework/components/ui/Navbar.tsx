"use client";

import React from "react";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  isBordered?: boolean;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ children, className = "", isBordered, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={`w-full flex items-center justify-between px-6 py-4 bg-background ${isBordered ? "border-b border-divider" : ""} ${className}`}
        {...props}
      >
        {children}
      </nav>
    );
  }
);
Navbar.displayName = "Navbar";

export type NavbarBrandProps = React.HTMLAttributes<HTMLDivElement>;
export const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`flex items-center gap-2 font-bold ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
NavbarBrand.displayName = "NavbarBrand";

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end";
}
export const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ children, className = "", justify = "start", ...props }, ref) => {
    const justifyClass = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end"
    }[justify];
    
    return (
      <div
        ref={ref}
        className={`flex items-center gap-4 ${justifyClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavbarContent.displayName = "NavbarContent";

export interface NavbarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}
export const NavbarItem = React.forwardRef<HTMLDivElement, NavbarItemProps>(
  ({ children, className = "", isActive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center ${isActive ? "text-primary font-semibold" : "text-foreground"} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavbarItem.displayName = "NavbarItem";

export type NavbarMenuProps = React.HTMLAttributes<HTMLDivElement>;
export const NavbarMenu = React.forwardRef<HTMLDivElement, NavbarMenuProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col gap-2 p-4 bg-background border-t border-divider ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavbarMenu.displayName = "NavbarMenu";

export interface NavbarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}
export const NavbarMenuItem = React.forwardRef<HTMLDivElement, NavbarMenuItemProps>(
  ({ children, className = "", isActive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full py-2 ${isActive ? "text-primary font-semibold" : "text-foreground"} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavbarMenuItem.displayName = "NavbarMenuItem";

export type NavbarMenuToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export const NavbarMenuToggle = React.forwardRef<HTMLButtonElement, NavbarMenuToggleProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`p-2 rounded-lg hover:bg-default/50 active:scale-95 transition-all ${className}`}
        {...props}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }
);
NavbarMenuToggle.displayName = "NavbarMenuToggle";
