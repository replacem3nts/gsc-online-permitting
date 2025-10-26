import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpeedInsights />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
