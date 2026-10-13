"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* El hallazgo (Gloop, 2026-10-13). Test real: unas 500 personas descargaron la app con un QR y «el
   usuario no sabe qué hacer». Principio que salió de ahí: la app enseña siempre UNA sola cosa que
   hacer ahora. El panel muestra todo lo que la app ofrecía a la vez; con el scroll se va apagando
   pieza a pieza hasta que solo queda el CTA blanco (el único por pantalla, 64 de alto, como en el
   canon de la app). Piezas recreadas con los tokens reales, sin capturas. */

type Piece = { label: string; kind: "chip" | "card" | "cta"; meta?: string };

const PIECES: Piece[] = [
  { label: "Crew del día", kind: "card", meta: "1 pregunta · 4 de 6" },
  { label: "Experiencias", kind: "chip" },
  { label: "Momentos", kind: "card", meta: "12 fotos" },
  { label: "Chat", kind: "chip" },
  { label: "Activa la noche", kind: "cta" },
  { label: "La Cuenta", kind: "card", meta: "Te deben 34,26 €" },
  { label: "Juegos", kind: "chip" },
  { label: "Invitar", kind: "chip" },
  { label: "Ranking", kind: "card", meta: "#3 en tu equipo" },
  { label: "Mapa", kind: "chip" },
];

/** Cada pieza se apaga en su tramo del scroll; el CTA, en cambio, crece y se queda. */
function PieceView({ p, i, progress }: { p: Piece; i: number; progress: MotionValue<number> }) {
  const order = PIECES.filter((x) => x.kind !== "cta").indexOf(p);
  const start = 0.12 + order * 0.055;
  const opacity = useTransform(progress, [start, start + 0.06], [1, 0.07]);
  const ctaScale = useTransform(progress, [0.62, 0.78], [1, 1.12]);
  const ctaGlow = useTransform(progress, [0.62, 0.78], [0, 1]);

  if (p.kind === "cta")
    return (
      <motion.div style={{ scale: ctaScale }} className="relative z-10 basis-full sm:basis-auto">
        <motion.span
          aria-hidden
          className="absolute -inset-6 rounded-full blur-2xl"
          style={{ background: G.brand, opacity: ctaGlow }}
        />
        <span
          className="relative flex h-16 items-center justify-center rounded-full bg-white px-10 text-[17px] font-semibold text-black"
          style={{ fontFamily: "var(--font-gloop)" }}
        >
          {p.label}
        </span>
      </motion.div>
    );
  if (p.kind === "card")
    return (
      <motion.div
        style={{ opacity, background: G.fill6, borderRadius: "0 18px 18px 18px" }}
        className="min-w-[9.5rem] px-4 py-3.5"
        data-i={i}
      >
        <p className="text-[15px] font-semibold text-white" style={{ fontFamily: "var(--font-gloop)" }}>
          {p.label}
        </p>
        <p className="mt-0.5 text-[13px]" style={{ color: G.text50, fontFamily: "var(--font-gloop)" }}>
          {p.meta}
        </p>
      </motion.div>
    );
  return (
    <motion.span
      style={{ opacity, background: G.fill8, fontFamily: "var(--font-gloop)" }}
      className="rounded-full px-5 py-2.5 text-[15px] font-semibold text-white"
    >
      {p.label}
    </motion.span>
  );
}

export default function OneThing() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const principle = useTransform(scrollYProgress, [0.74, 0.86], [0, 1]);
  const principleY = useTransform(scrollYProgress, [0.74, 0.86], [24, 0]);
  const counter = useTransform(scrollYProgress, (v) => {
    const off = PIECES.filter((p) => p.kind !== "cta").filter((_, k) => v > 0.12 + k * 0.055 + 0.06).length;
    return `${PIECES.length - off} ${PIECES.length - off === 1 ? "cosa" : "cosas"} que hacer`;
  });

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[260vh]"} ${geist.variable}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center px-4 py-24 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <div className="col-span-12 md:col-span-5">
            <p className="t-label t-tag text-[var(--case-muted)]">01 · El hallazgo</p>
            <p className="mt-4 t-statement">
              Unas 500 personas se descargaron la app en un stand con un QR. Casi ninguna sabía qué hacer.
            </p>
            <motion.p
              style={reduce ? undefined : { opacity: principle, y: principleY }}
              className="mt-10 max-w-[34ch] t-lead"
            >
              El principio que salió de ahí: la app enseña siempre <strong className="font-semibold">una sola cosa
              que hacer ahora</strong>, y está en el primer scroll.
            </motion.p>
          </div>
          {/* El panel: la app con todo a la vez. */}
          <div className="col-span-12 md:col-span-7">
            <div
              className="relative flex min-h-[22rem] flex-wrap content-center items-center justify-center gap-3 overflow-hidden p-6 md:min-h-[30rem] md:gap-4 md:p-12"
              style={{ background: G.base }}
            >
              {/* Brillo de la marca, como los glows de la app. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
                style={{ background: G.brandDeep }}
              />
              {PIECES.map((p, i) => (
                <PieceView key={p.label} p={p} i={i} progress={scrollYProgress} />
              ))}
              <motion.p
                className="absolute bottom-4 left-5 text-[12px] uppercase tracking-[0.1em]"
                style={{ color: G.text50, fontFamily: "var(--font-gloop)" }}
              >
                <motion.span>{counter}</motion.span>
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
