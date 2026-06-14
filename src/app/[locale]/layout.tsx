import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KALEX SSO - Identity Center",
  description: "Centralized identity and subscription manager for KALEX OÜ Ecosystem",
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning // Richiesto da next-themes per evitare warning lato server
    >
      <body className="min-h-full flex flex-col">
        <Providers locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
