"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import SiteNav from "@/components/case-study/SiteNav";
import { POWER3_INOUT } from "@/components/case-study/primitives";

/* Entrada: el visitante elige por dónde entrar (pendiente del 2026-09-09: dos públicos,
   dos recorridos). Al pasar por encima de cada opción, su imagen ocupa el fondo. */

const theme = {
  "--case-bg": "#0A0A0B",
  "--case-fg": "#F4F4F5",
  "--case-muted": "rgba(244,244,245,0.55)",
  "--case-line": "rgba(244,244,245,0.16)",
} as React.CSSProperties;

const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";

const ways = [
  {
    key: "product",
    label: "Product",
    line: "Apps, producto digital, marca y web",
    href: "/maqueta/home",
    img: "/maqueta/gloop/cover.jpg",
  },
  {
    key: "games",
    label: "Games",
    line: "UI/UX de videojuegos",
    href: "/maqueta/games",
    img: "/projects/asphalt-unite/AU_hero.png",
  },
];

export default function Entry() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <main
      style={theme}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <SiteNav active={null} />
      {ways.map((w) => (
        <motion.img
          key={w.key}
          src={w.img}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: hover === w.key ? 0.55 : 0, scale: hover === w.key ? 1 : 1.08 }}
          transition={{ duration: 0.8, ease: POWER3_INOUT }}
        />
      ))}
      <div className="relative px-4 pb-8 md:px-6 md:pb-10">
        <motion.p
          className={`mb-6 text-[12px] text-[var(--case-muted)] ${mono}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Alberto Nicolás · Diseñador · Elige por dónde entrar
        </motion.p>
        {ways.map((w, i) => (
          <Link
            key={w.key}
            href={w.href}
            onMouseEnter={() => setHover(w.key)}
            onMouseLeave={() => setHover(null)}
            className="group block border-t border-[var(--case-line)]"
          >
            <div className="flex items-end justify-between gap-6 overflow-hidden py-2">
              <motion.span
                className="block text-[clamp(72px,17vw,280px)] font-extrabold leading-[0.86] tracking-[-0.055em]"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: POWER3_INOUT, delay: 0.15 * i }}
              >
                {w.label}
              </motion.span>
              <span className="hidden pb-4 text-right text-[clamp(14px,1.2vw,17px)] text-[var(--case-muted)] transition-colors group-hover:text-[var(--case-fg)] md:block">
                {w.line} <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
