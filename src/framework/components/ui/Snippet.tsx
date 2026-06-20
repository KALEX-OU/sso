"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export interface SnippetProps extends React.HTMLAttributes<HTMLDivElement> {
  textToCopy?: string;
}

export const Snippet = React.forwardRef<HTMLDivElement, SnippetProps>(
  ({ children, textToCopy, className = "", ...props }, ref) => {
    const [copied, setCopied] = useState(false);

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

    return (
      <div
        ref={ref}
        className={`flex items-center justify-between gap-4 p-3 bg-default-100 rounded-lg border border-divider font-mono text-xs ${className}`}
        {...props}
      >
        <span className="truncate">{children}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-default-200 active:scale-95 transition-all text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Copia negli appunti"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }
);
Snippet.displayName = "Snippet";
