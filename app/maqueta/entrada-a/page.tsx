"use client";

import { TLink } from "@/components/case-study/Portal";
import { motion } from "framer-motion";
import { useState } from "react";
import SiteNav from "@/components/case-study/SiteNav";
import { DUR, EASE, STAGGER, inOrOut } from "@/lib/maqueta/motion";
import Arrow from "@/components/case-study/Arrow";

/* Entrada: el visitante elige por dónde entrar (pendiente del 2026-09-09: dos públicos,
   dos recorridos). Al pasar por encima de cada opción, su imagen ocupa el fondo. */

const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css

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
          transition={{ duration: inOrOut(hover === w.key), ease: EASE.inOut }}
        />
      ))}
      <div className="relative px-4 pb-8 md:px-6 md:pb-10">
        <motion.p
          className={`mb-6 t-label text-[var(--case-muted)] ${mono}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.base, ease: EASE.out, delay: DUR.base }}
        >
          Alberto Nicolás · Diseñador · Elige por dónde entrar
        </motion.p>
        {ways.map((w, i) => (
          <TLink
            key={w.key}
            href={w.href}
            onMouseEnter={() => setHover(w.key)}
            onMouseLeave={() => setHover(null)}
            className="group block border-t border-[var(--case-line)]"
          >
            <div className="flex items-end justify-between gap-6 overflow-hidden py-2">
              <motion.span
                className="block t-d1"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: DUR.base, ease: EASE.inOut, delay: i * STAGGER }}
              >
                {w.label}
              </motion.span>
              <span className="hidden pb-4 text-right t-small text-[var(--case-muted)] hov group-hover:text-[var(--case-fg)] md:block">
                {w.line} <Arrow />
              </span>
            </div>
          </TLink>
        ))}
      </div>
    </main>
  );
}
