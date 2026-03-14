import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ViewportEffects from "@/components/ViewportEffects";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "anico | Senior Designer",
  description: "Senior Designer specialising in game UI/UX, brand art direction, and digital product design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-w-0`}>
        <AppProvider>
          <ViewportEffects>{children}</ViewportEffects>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
