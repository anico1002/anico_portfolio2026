"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn, GraphicReveal, Parallax } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";
import { ISOTYPE, LOGO_LETTERS } from "./logo-paths";

/* El canon de formas (Gloop, 6-oct-2026). Todo sale del «imago», la esquina recta del isotipo: las
   tarjetas llevan radio 18 con la esquina de arriba a la izquierda recta, que rima con el logo; los
   avatares, el 30 % del lado; los botones, pastilla. Radios en múltiplos de 6. Una sola forma que se
   transforma de una pieza a otra, con la curva del sistema.
   2026-10-13: radios todos en px (mezclar % y px hacía que la forma se deformara a medio camino) y
   fuera el pie técnico bajo la imagen («muy dashboard»): aquí se enseña diseño, sin rótulos.
   2026-10-14 (feedback, dos rondas): sin el fondo violeta y contando de dónde sale la forma, en bucle que
   siempre vuelve al logo. Logo e isotipo en el fucsia corporativo (sin degradado). El logo entra letra a
   letra; al lado aparece el isotipo; el logo se va y el isotipo va al centro y se vuelve el imago; el imago
   se multiplica a los lados en los cinco colores corporativos, vuelve a uno y sigue la metamorfosis
   (tarjeta, avatar, botón) antes de volver a empezar. */

const LOGO_W = 300; // px en pantalla (viewBox 221×51)
const ISO = 96; // px del isotipo junto al logo
const GAP = 28;
const IMAGO = 180;
const CLONE = 104; // cada imago al multiplicarse
const SPREAD = 132; // distancia entre copias
const COLORS = [G.brand, G.lime, G.accent, G.magenta, G.cyan]; // el del centro, el fucsia

const SHAPES = {
  imago: { w: IMAGO, h: IMAGO, r: "90px 90px 90px 0px" },
  card: { w: 260, h: 170, r: "0px 18px 18px 18px" },
  avatar: { w: 150, h: 150, r: "45px 45px 45px 45px" },
  cta: { w: 280, h: 64, r: "32px 32px 32px 32px" },
} as const;

/* El guion del bucle: [paso, duración en s]. */
type Step = "logo" | "iso" | "center" | "imago" | "split" | "merge" | "card" | "avatar" | "cta" | "out";
const SCRIPT: [Step, number][] = [
  ["logo", 1.5],
  ["iso", 1.2],
  ["center", 1.3],
  ["imago", 0.7],
  ["split", 1.9],
  ["merge", 1.0],
  ["card", 1.7],
  ["avatar", 1.7],
  ["cta", 1.7],
  ["out", 0.7],
];

const RADII = [6, 12, 18, 24, 54];

export default function ImagoCanon() {
  const [on, setOn] = useState(false);
  const [k, setK] = useState(-1); // paso del guion; -1 = aún no ha empezado
  const [cycle, setCycle] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Avanza el guion mientras se ve; al acabar, vuelve al logo.
  useEffect(() => {
    if (!on || reduce) return;
    const ms = k < 0 ? 400 : SCRIPT[k][1] * 1000;
    const t = setTimeout(() => {
      if (k === SCRIPT.length - 1) {
        setK(0);
        setCycle((c) => c + 1);
      } else setK(k + 1);
    }, ms);
    return () => clearTimeout(t);
  }, [on, reduce, k]);

  const step: Step | null = reduce ? "imago" : k < 0 ? null : SCRIPT[k][0];
  const at = (...s: Step[]) => step != null && s.includes(step);
  const logoH = (LOGO_W * 51) / 221;
  const isoX = -(LOGO_W + GAP) / 2;
  const logoX = (ISO + GAP) / 2;
  const shapeKey = at("card") ? "card" : at("avatar") ? "avatar" : at("cta") ? "cta" : "imago";
  const s = SHAPES[shapeKey];
  const showShape = at("imago", "split", "merge", "card", "avatar", "cta");
  const small = at("split");

  return (
    <div ref={ref} className={`grid grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6 ${geist.variable}`}>
      <Parallax speed={90} className="m-bleed relative col-span-12 flex aspect-[4/3] items-center justify-center md:order-2 md:col-span-7 md:col-start-6">
        <GraphicReveal from="right" className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* El logo, letra a letra (cada vuelta vuelve a entrar). */}
            <motion.svg
              key={`logo-${cycle}`}
              viewBox="0 0 221 51"
              width={LOGO_W}
              height={logoH}
              className="absolute overflow-visible"
              aria-label="Gloop"
              initial={false}
              animate={{ x: at("iso", "center") ? logoX : 0, opacity: at("logo", "iso") ? 1 : 0 }}
              transition={{ duration: DUR.base, ease: EASE.inOut }}
            >
              {LOGO_LETTERS.map((l, j) => (
                <motion.path
                  key={j}
                  d={l.d}
                  fillRule={l.evenOdd ? "evenodd" : undefined}
                  fill={G.accent}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: step ? 1 : 0, y: step ? 0 : 26 }}
                  transition={{ duration: DUR.base, ease: EASE.out, delay: j * 0.09 }}
                />
              ))}
            </motion.svg>
            {/* El isotipo: aparece a la izquierda del logo y, al irse el logo, va al centro y crece hasta el imago. */}
            <motion.svg
              viewBox="0 0 63 63"
              width={ISO}
              height={ISO}
              className="absolute"
              aria-hidden
              initial={false}
              animate={{
                opacity: at("iso", "center") ? 1 : 0,
                scale: at("center") ? IMAGO / ISO : at("iso") ? 1 : 0.6,
                x: at("center") ? 0 : isoX,
              }}
              transition={{ duration: at("logo") ? 0 : DUR.slow, ease: EASE.inOut, opacity: { duration: DUR.fast } }}
            >
              <path d={ISOTYPE.d} fillRule={ISOTYPE.evenOdd ? "evenodd" : undefined} fill={G.accent} />
            </motion.svg>
            {/* El imago se multiplica a los lados en los colores corporativos (el del centro es la forma). */}
            {COLORS.map((c, j) =>
              j === 2 ? null : (
                <motion.div
                  key={c}
                  className="absolute"
                  initial={false}
                  animate={{
                    x: small ? (j - 2) * SPREAD : 0,
                    opacity: small ? 1 : 0,
                    width: CLONE,
                    height: CLONE,
                    borderRadius: `${CLONE / 2}px ${CLONE / 2}px ${CLONE / 2}px 0px`,
                  }}
                  transition={{ duration: DUR.slow, ease: EASE.inOut, opacity: { duration: small ? DUR.fast : DUR.base } }}
                  style={{ background: c }}
                />
              )
            )}
            {/* La forma que se transforma. */}
            <motion.div
              className="relative overflow-hidden"
              initial={false}
              animate={{
                width: small ? CLONE : s.w,
                height: small ? CLONE : s.h,
                borderRadius: small ? `${CLONE / 2}px ${CLONE / 2}px ${CLONE / 2}px 0px` : s.r,
                opacity: showShape ? 1 : 0,
                background: shapeKey === "cta" ? "#ffffff" : shapeKey === "card" ? "rgba(255,255,255,0.08)" : G.accent,
              }}
              transition={{ duration: DUR.slow, ease: EASE.inOut, opacity: { duration: DUR.fast } }}
            >
              {shapeKey === "avatar" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/maqueta/gloop/media/photo-profile.jpg" alt="" className="h-full w-full object-cover" />
              )}
              {shapeKey === "cta" && (
                <span className="flex h-full items-center justify-center text-[17px] font-semibold text-black" style={{ fontFamily: "var(--font-gloop)" }}>
                  Crear equipo
                </span>
              )}
            </motion.div>
          </div>
        </GraphicReveal>
      </Parallax>
      {/* Centrado en el hueco entre el margen y la imagen (feedback 2026-10-14). */}
      <div className="col-span-12 md:order-1 md:col-span-5 md:flex md:justify-center">
        <div className="md:max-w-[24rem]">
          <p className="t-label t-tag text-[var(--case-muted)]">La forma</p>
          <Lines className="mt-4 t-title">Todo empieza en una esquina.</Lines>
          <FadeIn className="mt-6">
            <p className="t-body text-[var(--case-muted)]">
              La esquina recta del logo firma cada pieza de la interfaz, de la tarjeta más grande al avatar más
              pequeño. Por eso todo parece Gloop.
            </p>
          </FadeIn>
          <div className="mt-8 flex items-end gap-3">
            {RADII.map((r) => (
              <div key={r} className="flex flex-col items-center gap-2">
                <span className="block h-10 w-10 border border-[var(--case-fg)]" style={{ borderRadius: Math.min(r, 20), borderTopLeftRadius: 0 }} />
                <span className="t-label text-[var(--case-muted)]">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
