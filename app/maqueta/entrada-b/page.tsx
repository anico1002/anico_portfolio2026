"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SiteNav from "@/components/case-study/SiteNav";
import { POWER3_INOUT, POWER3_OUT } from "@/components/case-study/primitives";

/* Entrada · alternativa B (2026-10-12): pantalla partida por la mitad, Product a la izquierda
   y Games a la derecha, en espejo. Palabras gigantes abajo, cada una pegada a su borde
   exterior; párrafos cortos justificados a media altura junto a la línea central (diagonal a
   lo Yakushev). Al pasar por encima, esa mitad se ensancha un poco, pasa un pase de proyectos
   de fondo y la otra se atenúa. La alternativa A sigue en /maqueta. */

const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";

type Side = {
  key: "product" | "games";
  label: string;
  text: string;
  href: string;
  slides: string[];
};

const sides: Side[] = [
  {
    key: "product",
    label: "Product",
    text: "Apps, producto digital, marca y web. Diseño de la idea al código nativo, con prototipos que se pueden tocar.",
    href: "/maqueta/home",
    slides: [
      "/maqueta/gloop/cover.jpg",
      "/projects/elreto-masterchef/ElReto_hero.png",
      "/projects/swift-project/SwifT_hero.png",
      "/projects/obliq/01/obliq_1.png",
      "/projects/act/ACT_hero.png",
      "/projects/metacampus/Metacampus_hero.png",
    ],
  },
  {
    key: "games",
    label: "Games",
    text: "UI/UX de videojuegos: menús, HUD y sistemas visuales para títulos jugados por cientos de millones de personas.",
    href: "/maqueta/games",
    slides: [
      "/projects/asphalt-unite/AU_hero.png",
      "/projects/cybertitans/CyberTitans_hero.png",
      "/projects/two-dots/twodots_hero.png",
      "/projects/disney-karting/Disney_hero.png",
      "/projects/asphalt-9/A9_hero.png",
      "/projects/asphalt-xtreme/AXT_hero.png",
    ],
  },
];

/** Pase de fondo: fundido con un ligero zoom de salida (1,08 → 1) en cada diapositiva. */
function Slides({ srcs, active }: { srcs: string[]; active: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setI((n) => (n + 1) % srcs.length), 1600);
    return () => clearInterval(t);
  }, [active, srcs.length]);
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: POWER3_INOUT }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={srcs[i]}
          src={srcs[i]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.8, ease: POWER3_INOUT }, scale: { duration: 2.4, ease: POWER3_OUT } }}
        />
      </AnimatePresence>
      {/* Velo para que el texto blanco se lea sobre cualquier imagen. */}
      <div className="absolute inset-0 bg-black/45" />
      {/* Precarga del resto de diapositivas (sin mostrar). */}
      <div className="hidden">
        {srcs.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s} src={s} alt="" />
        ))}
      </div>
    </motion.div>
  );
}

// Sin ratón (móvil/tableta) no hay «pasar por encima»: ahí los dos pases van siempre.
const noHover = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

export default function EntryB() {
  const [hover, setHover] = useState<Side["key"] | null>(null);
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setTouch(noHover()));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased md:flex-row">
      <SiteNav active={null} />
      {sides.map((s, i) => {
        const left = i === 0;
        const on = touch || hover === s.key;
        const off = !touch && hover !== null && !on;
        return (
          <motion.div
            key={s.key}
            className={`relative min-h-[50svh] overflow-hidden md:min-h-[100svh] ${left ? "" : "md:border-l md:border-[var(--case-line)]"}`}
            initial={false}
            animate={{ flexGrow: on && !touch ? 1.25 : 1 }}
            style={{ flexBasis: 0 }}
            transition={{ duration: 0.8, ease: POWER3_INOUT }}
            onMouseEnter={() => !touch && setHover(s.key)}
            onMouseLeave={() => !touch && setHover(null)}
          >
            <Link href={s.href} className="absolute inset-0 block" aria-label={s.label}>
              <Slides srcs={s.slides} active={on} />
              <motion.div
                className={`relative flex h-full flex-col justify-between px-4 pb-6 pt-24 transition-colors duration-500 md:px-6 md:pb-8 ${on ? "text-white" : ""}`}
                initial={false}
                animate={{ opacity: off ? 0.35 : 1 }}
                transition={{ duration: 0.6, ease: POWER3_INOUT }}
              >
                {/* Párrafo a media altura, pegado a la línea central y en espejo. */}
                <div className={`flex flex-1 items-center md:items-start md:pt-[24svh] ${left ? "justify-end" : "justify-start"}`}>
                  <motion.div
                    className="max-w-[30ch]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: POWER3_OUT, delay: 0.5 + i * 0.1 }}
                  >
                    <p className={`mb-3 text-[12px] opacity-60 ${mono} ${left ? "text-right" : "text-left"}`}>
                      0{i + 1} — {s.label}
                    </p>
                    <p
                      lang="es"
                      className={`hyphens-auto text-justify text-[clamp(16px,1.35vw,19px)] leading-[1.5] ${left ? "[text-align-last:right]" : "[text-align-last:left]"}`}
                    >
                      {s.text}
                    </p>
                  </motion.div>
                </div>
                {/* Palabra gigante abajo, pegada a su borde exterior. */}
                <div className={`overflow-hidden ${left ? "text-left" : "text-right"}`}>
                  <motion.p
                    className="text-[clamp(64px,11.5vw,220px)] font-extrabold leading-[0.82] tracking-[-0.055em]"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: POWER3_INOUT, delay: 0.15 + i * 0.1 }}
                  >
                    {s.label}
                  </motion.p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </main>
  );
}
