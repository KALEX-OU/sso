"use client";

import React from "react";
import { Skeleton } from "@heroui/react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { AlertCircle } from "lucide-react";

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
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full p-4">
        <Card className="max-w-md w-full border border-danger-100 bg-danger-50/10 shadow-lg rounded-3xl">
          <CardHeader className="flex gap-3 px-6 pt-6">
            <AlertCircle className="w-6 h-6 text-danger" />
            <h3 className="text-md font-extrabold uppercase text-danger tracking-wider">
              Si è verificato un errore
            </h3>
          </CardHeader>
          <CardBody className="px-6 pb-6 text-sm text-foreground/80 font-medium">
            {error}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {isLoading ? (
        <div className="w-full space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2 w-1/3">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
          <div className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-2 border-b border-divider/50">
              <Skeleton className="h-5 w-1/4 rounded" />
              <Skeleton className="h-5 w-1/6 rounded" />
              <Skeleton className="h-5 w-1/12 rounded" />
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-divider/20 last:border-0">
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
