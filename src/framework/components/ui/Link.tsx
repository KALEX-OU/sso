"use client";

import React from "react";
import NextLink from "next/link";
import { Link as HeroLink } from "@heroui/react";

export type LinkProps = React.ComponentProps<typeof HeroLink>;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    return (
      <NextLink href={href || "#"} className="contents">
        <HeroLink
          ref={ref}
          {...props}
        >
          {children}
        </HeroLink>
      </NextLink>
    );
  }
);

Link.displayName = "Link";
