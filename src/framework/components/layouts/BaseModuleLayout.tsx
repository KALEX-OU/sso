"use client";

import React from "react";
import { Skeleton, Card, CardHeader, CardBody } from "../ui";
import { AlertCircle } from "lucide-react";
import { useUIStrings } from "../../lib/ui.localization";

interface BaseModuleLayoutProps {
  isLoading?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function BaseModuleLayout({
  isLoading = false,
  error,
  children,
  className = ""
}: BaseModuleLayoutProps) {
  const s = useUIStrings();
  if (error) {
    return (
      <div className="klx-layout-error-container">
        <Card className="klx-layout-error-card">
          <CardHeader className="klx-layout-error-header">
            <AlertCircle className="w-6 h-6 text-danger" />
            <h3 className="klx-layout-error-title">
              {s.layout.errorTitle}
            </h3>
          </CardHeader>
          <CardBody className="klx-layout-error-body">
            {error}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {isLoading ? (
        <div className="klx-layout-skeleton-wrapper">
          <div className="klx-layout-skeleton-header">
            <div className="space-y-2 w-1/3">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
          <div className="klx-layout-skeleton-body">
            <div className="flex items-center gap-3 pb-2 border-b border-divider/50">
              <Skeleton className="h-5 w-1/4 rounded" />
              <Skeleton className="h-5 w-1/6 rounded" />
              <Skeleton className="h-5 w-1/12 rounded" />
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="klx-layout-skeleton-row">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-4 w-1/5 rounded" />
                <Skeleton className="h-4 w-1/6 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
