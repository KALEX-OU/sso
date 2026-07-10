"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";
import { useUIStrings } from "../../lib/ui.localization";

export interface SnippetProps extends React.HTMLAttributes<HTMLDivElement> {
  textToCopy?: string;
  isSkeleton?: boolean;
  tooltip?: string;
}

export const Snippet = React.forwardRef<HTMLDivElement, SnippetProps>(
  ({ children, textToCopy, className = "", isSkeleton, tooltip, ...props }, ref) => {
    const s = useUIStrings();
    const [copied, setCopied] = useState(false);

    if (isSkeleton) {
      return <Skeleton className={`h-10 w-full rounded-2xl ${className}`} />;
    }

    const handleCopy = async () => {
      const copyText = textToCopy || (typeof children === "string" ? children : "");
      if (!copyText) return;
      try {
        await navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Errore durante la copia negli appunti:", err);
      }
    };

    const snippetElement = (
      <div
        ref={ref}
        className={`klx-snippet ${className}`}
        {...props}
      >
        <span className="klx-snippet-content">{children}</span>
        <button
          onClick={handleCopy}
          className="klx-snippet-copy-btn"
          aria-label={s.common.copyToClipboard}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{snippetElement}</Tooltip>;
    }

    return snippetElement;
  }
);
Snippet.displayName = "Snippet";
