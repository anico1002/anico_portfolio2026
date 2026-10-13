"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { GraphicReveal } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* El insight (Gloop; copy rehecho el 2026-10-13): salimos de noche para pasarlo bien, sin más plan, y
   ninguna app estaba pensada para esa noche. El panel muestra todo lo que una app podría ofrecer a la
   vez, sobre una foto de fiesta oscurecida; con el scroll se va apagando pieza a pieza hasta que solo
   queda el CTA blanco, que está en el centro desde el principio para quedarse solo en el medio.
   Piezas recreadas con los tokens reales, sin capturas. Se maqueta en un lienzo fijo de 760×460 que
   se escala al ancho del panel (en móvil no cabría de otra forma). */

type Piece = { label: string; kind: "chip" | "card" | "cta"; meta?: string; at: [number, number] };

const CANVAS = { w: 760, h: 460 };
const PIECES: Piece[] = [
  { label: "Crew del día", kind: "card", meta: "1 pregunta · 4 de 6", at: [150, 95] },
  { label: "Experiencias", kind: "chip", at: [385, 72] },
  { label: "Momentos", kind: "card", meta: "12 fotos", at: [615, 100] },
  { label: "Chat", kind: "chip", at: [105, 235] },
  { label: "Activa la noche", kind: "cta", at: [380, 230] },
  { label: "La Cuenta", kind: "card", meta: "Te deben 34,26 €", at: [655, 235] },
  { label: "Juegos", kind: "chip", at: [125, 375] },
  { label: "Invitar", kind: "chip", at: [300, 392] },
  { label: "Ranking", kind: "card", meta: "#3 en tu equipo", at: [495, 378] },
  { label: "Mapa", kind: "chip", at: [672, 392] },
];

/** Cada pieza se apaga en su tramo del scroll; el CTA, en cambio, crece y se queda. */
function Placed({ p, i, progress }: { p: Piece; i: number; progress: MotionValue<number> }) {
  return (
    <div className={`absolute -translate-x-1/2 -translate-y-1/2 ${p.kind === "cta" ? "z-10" : ""}`} style={{ left: p.at[0], top: p.at[1] }}>
      <PieceView p={p} i={i} progress={progress} />
    </div>
  );
}

function PieceView({ p, i, progress }: { p: Piece; i: number; progress: MotionValue<number> }) {
  const order = PIECES.filter((x) => x.kind !== "cta").indexOf(p);
  const start = 0.12 + order * 0.055;
  const opacity = useTransform(progress, [start, start + 0.06], [1, 0.07]);
  const ctaScale = useTransform(progress, [0.62, 0.78], [1, 1.12]);
  const ctaGlow = useTransform(progress, [0.62, 0.78], [0, 1]);

  if (p.kind === "cta")
    return (
      <motion.div style={{ scale: ctaScale }} className="relative">
        <motion.span
          aria-hidden
          className="absolute -inset-6 rounded-full blur-2xl"
          style={{ background: G.brand, opacity: ctaGlow }}
        />
        <span
          className="relative flex h-16 items-center justify-center whitespace-nowrap rounded-full bg-white px-10 text-[17px] font-semibold text-black"
          style={{ fontFamily: "var(--font-gloop)" }}
        >
          {p.label}
        </span>
      </motion.div>
    );
  if (p.kind === "card")
    return (
      <motion.div
        style={{ opacity, borderRadius: "0 18px 18px 18px" }}
        className="glass-ios min-w-[9.5rem] whitespace-nowrap px-4 py-3.5"
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
      style={{ opacity, fontFamily: "var(--font-gloop)" }}
      className="glass-ios block whitespace-nowrap rounded-full px-5 py-2.5 text-[15px] font-semibold text-white"
    >
      {p.label}
    </motion.span>
  );
}

export default function OneThing() {
  const ref = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const principle = useTransform(scrollYProgress, [0.74, 0.86], [0, 1]);
  const principleY = useTransform(scrollYProgress, [0.74, 0.86], [24, 0]);
  // La foto de fondo se acerca muy despacio mientras dura la sección (movimiento, no salto).
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFit(Math.min(1, (el.clientWidth - 16) / CANVAS.w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[260vh]"} ${geist.variable}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center px-4 py-24 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <div className="col-span-12 md:col-span-5">
            <p className="t-label t-tag text-[var(--case-muted)]">El insight</p>
            <Lines className="mt-4 t-statement">
              Casi todas las noches empiezan igual: un grupo, ningún plan y ganas de pasarlo bien.
            </Lines>
            <motion.p
              style={reduce ? undefined : { opacity: principle, y: principleY }}
              className="mt-10 max-w-[34ch] t-lead"
            >
              Gloop nace para esas noches. Junta al grupo, propone qué hacer y guarda lo que pasa. Solo hay que{" "}
              <strong className="font-semibold">encender la noche</strong>.
            </motion.p>
          </div>
          {/* El panel: todo a la vez sobre la noche; al final, un solo botón en el centro. */}
          <GraphicReveal from="right" className="col-span-12 md:col-span-7">
            <div
              ref={panel}
              className="relative min-h-[22rem] overflow-hidden md:min-h-[32rem]"
              style={{ background: G.base, height: CANVAS.h * fit + 48 }}
            >
              { }
              <motion.img
                src="/maqueta/gloop/media/party-ev5.jpg"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                style={{ scale: reduce ? 1 : bgScale, filter: "brightness(0.38) saturate(1.15)" }}
              />
              <span aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${G.base}99, transparent 40%, ${G.base}cc)` }} />
              <div
                className="absolute left-1/2 top-1/2"
                style={{ width: CANVAS.w, height: CANVAS.h, transform: `translate(-50%, -50%) scale(${fit})` }}
              >
                {PIECES.map((p, i) => (
                  <Placed key={p.label} p={p} i={i} progress={scrollYProgress} />
                ))}
              </div>
            </div>
          </GraphicReveal>
        </div>
      </div>
    </div>
  );
}
