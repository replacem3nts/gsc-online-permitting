import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

export const metadata: Metadata = {
  title: "Greenwich Shellfish Permit Application",
  description: "Apply for your Greenwich Shellfish Permit online - Town of Greenwich, Connecticut",
  keywords: "shellfish permit, Greenwich, Connecticut, fishing, clamming, oysters",
  authors: [{ name: "Town of Greenwich" }],
  openGraph: {
    title: "Greenwich Shellfish Permit Application",
    description: "Apply for your Greenwich Shellfish Permit online",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Analytics />
        <SpeedInsights />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
