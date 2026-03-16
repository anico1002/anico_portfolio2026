"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";

const navLinks = [
  { key: "work" as const, href: "/#projects" },
  { key: "about" as const, href: "/#about" },
  { key: "contact" as const, href: "/#contact" },
];

export default function Nav() {
  const { locale } = useApp();
  const t = translations[locale].nav;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="block text-white [&_img]:invert">
          <Image
            src="/anico_logo.svg"
            alt="anico"
            width={91}
            height={20}
            className="h-[22px] w-auto"
          />
        </Link>
        <nav className="hidden md:flex gap-8">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="text-white text-sm font-medium hover:opacity-60 transition-opacity relative group"
            >
              {t[key]}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2 text-white"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile menu */}
      <nav
        className={`fixed inset-0 z-40 bg-primary flex items-center justify-center md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-8 text-center">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="font-display text-4xl text-primary-foreground font-extrabold tracking-tight hover:opacity-60 transition-opacity"
              onClick={() => setMobileOpen(false)}
            >
              {t[key]}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
