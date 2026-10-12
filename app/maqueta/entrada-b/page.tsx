"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SiteNav from "@/components/case-study/SiteNav";
import { POWER3_INOUT, POWER3_OUT } from "@/components/case-study/primitives";

/* Entrada · alternativa B (2026-10-12): pantalla partida por la mitad, Product a la izquierda
   y Games a la derecha. Titulares gigantes centrados en cada mitad; un párrafo corto
   justificado abajo, en el lado exterior y en espejo, que solo aparece al pasar por encima.
   Al pasar, esa mitad se ensancha un poco, pasa un pase de proyectos de fondo y la otra se
   atenúa. En táctil todo se ve siempre. La alternativa A sigue en /maqueta. */

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
                className={`relative h-full transition-colors duration-500 ${on ? "text-white" : ""}`}
                initial={false}
                animate={{ opacity: off ? 0.35 : 1 }}
                transition={{ duration: 0.6, ease: POWER3_INOUT }}
              >
                {/* Titular centrado en su mitad: lo importante. */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <motion.p
                    className="text-[clamp(64px,11.5vw,220px)] font-extrabold leading-[0.82] tracking-[-0.055em]"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: POWER3_INOUT, delay: 0.15 + i * 0.1 }}
                  >
                    {s.label}
                  </motion.p>
                </div>
                {/* Párrafo desplazado abajo, en el lado exterior (en espejo); solo al pasar por
                    encima (en táctil, siempre). */}
                <motion.div
                  className={`absolute bottom-6 max-w-[30ch] md:bottom-8 ${left ? "left-4 md:left-6" : "right-4 md:right-6"}`}
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }}
                  transition={{ duration: 0.6, ease: POWER3_OUT, delay: on ? 0.15 : 0 }}
                >
                  <p className={`mb-3 text-[12px] opacity-60 ${mono} ${left ? "text-left" : "text-right"}`}>
                    0{i + 1} — {s.label}
                  </p>
                  <p
                    lang="es"
                    className={`hyphens-auto text-justify text-[clamp(16px,1.35vw,19px)] leading-[1.5] ${left ? "[text-align-last:left]" : "[text-align-last:right]"}`}
                  >
                    {s.text}
                  </p>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </main>
  );
}
