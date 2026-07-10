"use client";

import React from "react";
import { Avatar } from "./Avatar";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: React.ReactNode;
  avatarProps?: React.ComponentProps<typeof Avatar> & { src?: string; alt?: string };
  isSkeleton?: boolean;
  tooltip?: string;
}

export const User = React.forwardRef<HTMLDivElement, UserProps>(
  ({ name, description, avatarProps, className = "", isSkeleton, tooltip, ...props }, ref) => {
    if (isSkeleton) {
      return (
        <div className={`klx-user klx-user--skeleton flex items-center gap-2 ${className}`}>
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-2 w-12 rounded" />
          </div>
        </div>
      );
    }

    const { src, alt, className: avatarClassName, ...restAvatarProps } = avatarProps || {};
    const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

    const userElement = (
      <div ref={ref} className={`klx-user ${className}`} {...props}>
        <Avatar className={`klx-user-avatar ${avatarClassName || ""}`} {...restAvatarProps}>
          {src ? (
            React.createElement("img", { src, alt: alt || name, className: "w-full h-full object-cover rounded-full" })
          ) : (
            initials
          )}
        </Avatar>
        <div className="klx-user-details flex flex-col text-start">
          <span className="klx-user-name text-xs font-semibold text-foreground truncate max-w-[150px]">{name}</span>
          {description && (
            <span className="klx-user-description text-[10px] text-muted-foreground truncate max-w-[150px]">
              {description}
            </span>
          )}
        </div>
      </div>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{userElement}</Tooltip>;
    }

    return userElement;
  }
);
User.displayName = "User";
