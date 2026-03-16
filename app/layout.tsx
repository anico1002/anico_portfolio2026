import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ViewportEffects from "@/components/ViewportEffects";
import { Analytics } from "@vercel/analytics/react";
import { PersonSchema } from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const DESCRIPTION =
  "Senior Designer with 28+ years of experience specialising in game UI/UX, brand art direction, and immersive digital product design. Available for freelance projects.";

export const metadata: Metadata = {
  metadataBase: new URL("https://anico.design"),
  title: { default: "anico | Senior Designer", template: "%s | anico" },
  description: DESCRIPTION,
  authors: [{ name: "Alberto Nicolás", url: "https://anico.design" }],
  keywords: [
    "game UI/UX",
    "brand art direction",
    "senior designer",
    "interactive design",
    "product design",
    "mobile games",
    "Gameloft",
    "Web3 design",
    "VR design",
    "Figma",
    "Protopie",
    "freelance designer",
    "Spain",
  ],
  openGraph: {
    type: "website",
    url: "https://anico.design",
    siteName: "anico | Senior Designer",
    title: "anico | Senior Designer",
    description: DESCRIPTION,
    images: [{ url: "/about.webp", width: 1296, height: 630, alt: "anico — Senior Designer" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anico | Senior Designer",
    description: DESCRIPTION,
    images: ["/about.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://anico.design" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PersonSchema description={DESCRIPTION} />
      </head>
      <body className={`${inter.variable} min-w-0`}>
        <AppProvider>
          <ViewportEffects>{children}</ViewportEffects>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
