"use client";

import React from "react";
import { Avatar } from "./Avatar";

export interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: React.ReactNode;
  avatarProps?: React.ComponentProps<typeof Avatar> & { src?: string; alt?: string };
}

export const User = React.forwardRef<HTMLDivElement, UserProps>(
  ({ name, description, avatarProps, className = "", ...props }, ref) => {
    const { src, alt, className: avatarClassName, ...restAvatarProps } = avatarProps || {};
    const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

    return (
      <div ref={ref} className={`flex items-center gap-2 ${className}`} {...props}>
        <Avatar className={avatarClassName} {...restAvatarProps}>
          {src ? (
            React.createElement("img", { src, alt: alt || name, className: "w-full h-full object-cover rounded-full" })
          ) : (
            initials
          )}
        </Avatar>
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{name}</span>
          {description && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);
User.displayName = "User";
