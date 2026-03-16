"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";

interface FooterProps {
  showBackToHome?: boolean;
}

export default function Footer({ showBackToHome }: FooterProps) {
  const { locale } = useApp();
  const t = translations[locale].contact;

  return (
    <footer className="py-2 md:py-8 px-6 md:px-12 border-t border-border">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
        <p className="text-muted-foreground text-sm">{t.copyright}</p>
        {showBackToHome && (
          <Link
            href="/"
            className="text-muted-foreground text-sm hover:text-primary transition-colors"
          >
            {locale === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        )}
      </div>
    </footer>
  );
}
