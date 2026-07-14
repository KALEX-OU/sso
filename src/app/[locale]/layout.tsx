import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/framework/components/providers/Providers";
import Script from "next/script";
import { resolveBrand } from "@/framework/lib/brand.config";

// Brand white-label risolto a build-time (NEXT_PUBLIC_KALEX_BRAND): niente identità cablata (E5.1).
const brand = resolveBrand(process.env.NEXT_PUBLIC_KALEX_BRAND);

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${brand.name} SSO - Identity Center`,
  description: `Centralized identity and subscription manager for the ${brand.name} ecosystem`,
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const gaId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning // Richiesto da next-themes per evitare warning lato server
    >
      <body className="min-h-full flex flex-col">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <Providers locale={locale} appId="sso">
          {children}
        </Providers>
      </body>
    </html>
  );
}
