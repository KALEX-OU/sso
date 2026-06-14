"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProviderClient } from "../locales/client";
import FirebaseProvider from "./FirebaseProvider";

// Suppress the React 19 false-positive warning for inline script tags rendered by NextThemesProvider
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    origError.apply(console, args);
  };
}


interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
}

export default function Providers({ children, locale }: ProvidersProps) {
  return (
    <I18nProviderClient locale={locale}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </NextThemesProvider>
    </I18nProviderClient>
  );
}
