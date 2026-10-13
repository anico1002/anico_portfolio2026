"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* Cambio de paradigma (Gloop; rehecho el 2026-10-13 con el feedback de Alberto): la noche ya no depende
   del plan, sino de con quién la vives. El lienzo se parte en cuatro fotos de fiesta (con un zoom lento,
   para que se muevan); con el scroll se separan hacia sus esquinas y en el hueco del centro aparecen las
   tarjetas de equipo en cristal, que van pasando como un acordeón: la abierta enseña su noche, las
   demás quedan plegadas. Sin el fondo violeta: el color lo ponen las fotos.
   Pendiente: si Alberto pasa vídeos de fiesta, sustituyen a las fotos de los cuadrantes. */

const QUADS = [
  { src: "/maqueta/gloop/media/party-ev3.jpg", x: -1, y: -1 },
  { src: "/maqueta/gloop/media/party-ev6.jpg", x: 1, y: -1 },
  { src: "/maqueta/gloop/media/photo-splash.jpg", x: -1, y: 1 },
  { src: "/maqueta/gloop/media/party-ev2.jpg", x: 1, y: 1 },
];

const TEAMS = [
  { name: "Los de siempre", meta: "6 miembros", night: "Noche en marcha", color: G.brand, img: "/maqueta/gloop/media/photo-profile.jpg" },
  { name: "El Piso", meta: "4 miembros", night: "Viernes, 23:10", color: G.lime, img: "/maqueta/gloop/media/party-ev1.jpg" },
  { name: "Cumple de Marta", meta: "9 miembros", night: "Sábado", color: G.accent, img: "/maqueta/gloop/media/party-ev5.jpg" },
  { name: "Fiesta mayor", meta: "12 miembros", night: "Este verano", color: G.cyan, img: "/maqueta/gloop/media/party-sonar.jpg" },
];
const AV = ["/maqueta/gloop/media/photo-profile.jpg", "/maqueta/gloop/media/photo-splash.jpg", "/maqueta/gloop/media/party-ev3.jpg"];
const font = { fontFamily: "var(--font-gloop)" };

function Quad({ q, p }: { q: (typeof QUADS)[number]; p: MotionValue<number> }) {
  const x = useTransform(p, [0.15, 0.42], ["0%", `${q.x * 22}%`]);
  const y = useTransform(p, [0.15, 0.42], ["0%", `${q.y * 22}%`]);
  return (
    <motion.div
      className="absolute h-1/2 w-1/2 overflow-hidden"
      style={{ left: q.x < 0 ? 0 : "50%", top: q.y < 0 ? 0 : "50%", x, y }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={q.src} alt="" className="gloop-drift h-full w-full object-cover" style={{ filter: "brightness(0.8)" }} />
    </motion.div>
  );
}

/** Tarjeta de equipo en cristal. `idx` es el equipo abierto (continuo); cada tarjeta se abre según lo cerca que esté. */
function TeamCard({ t, k, idx }: { t: (typeof TEAMS)[number]; k: number; idx: MotionValue<number> }) {
  const open = useTransform(idx, (v) => Math.max(0, 1 - Math.abs(v - k)));
  const height = useTransform(open, [0, 1], [52, 168]);
  const body = useTransform(open, [0.4, 1], [0, 1]);
  return (
    <motion.div
      className="relative overflow-hidden px-4"
      style={{
        height,
        borderRadius: "0 18px 18px 18px",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2), 0 20px 40px -20px rgba(0,0,0,0.6)",
        ...font,
      }}
    >
      <div className="flex h-[52px] items-center justify-between">
        <p className="text-[16px] font-semibold text-white">{t.name}</p>
        <p className="text-[13px] text-white/60">{t.meta}</p>
      </div>
      <motion.div style={{ opacity: body }}>
        <p className="flex items-center gap-2 text-[13px] font-medium" style={{ color: t.color }}>
          <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
          {t.night}
        </p>
        <div className="mt-4 flex items-center">
          {AV.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="-ml-2 h-10 w-10 object-cover first:ml-0" style={{ borderRadius: "30%", boxShadow: "0 0 0 2px rgba(20,12,32,0.9)" }} />
          ))}
          <span className="-ml-2 flex h-10 w-10 items-center justify-center text-[12px] font-bold text-white" style={{ borderRadius: "30%", background: "rgba(255,255,255,0.18)" }}>
            +{Number(t.meta.split(" ")[0]) - 3}
          </span>
          <span className="ml-auto flex h-10 items-center rounded-full bg-white px-4 text-[13px] font-semibold text-black">Entrar</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamShift() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cards = useTransform(p, [0.3, 0.42], [0, 1]);
  const cardsY = useTransform(p, [0.3, 0.42], [30, 0]);
  const idx = useTransform(p, [0.45, 0.92], [0, TEAMS.length - 1]);
  // Relevo de frases, en tramos pegados (si se cruzan, se leen las dos a la vez).
  const before = useTransform(p, [0.2, 0.26], [1, 0]);
  const beforeY = useTransform(p, [0.2, 0.26], [0, -18]);
  const after = useTransform(p, [0.26, 0.32], [0, 1]);
  const afterY = useTransform(p, [0.26, 0.32], [18, 0]);

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[320vh]"} ${geist.variable}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center px-4 py-24 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <div className="relative col-span-12 md:col-span-7">
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--case-bg)] md:aspect-[4/3]">
              {QUADS.map((q) => (
                <Quad key={q.src} q={q} p={p} />
              ))}
              {/* El hueco del centro: los equipos, en acordeón. */}
              <motion.div
                className="absolute left-1/2 top-1/2 flex w-[78%] max-w-[22rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-[5px]"
                style={reduce ? undefined : { opacity: cards, y: cardsY }}
              >
                {TEAMS.map((t, k) => (
                  <TeamCard key={t.name} t={t} k={k} idx={idx} />
                ))}
              </motion.div>
            </div>
          </div>
          {/* Texto centrado en el hueco que queda entre la imagen y el borde derecho. */}
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <div className="md:mx-auto md:w-[80%]">
              <p className="t-label t-tag text-[var(--case-muted)]">Cambio de paradigma</p>
              <div className="relative mt-4">
                <motion.p style={{ opacity: before, y: beforeY }} className="t-statement">
                  Antes, la noche dependía del plan.
                </motion.p>
                <motion.p style={{ opacity: after, y: afterY }} className="absolute inset-0 t-statement">
                  Ahora, de con quién la vives.
                </motion.p>
              </div>
              <FadeIn className="mt-8">
                <p className="t-body text-[var(--case-muted)]">
                  Monta tu equipo con los de siempre, súmale a quien quieras y convierte cada salida en una
                  historia compartida.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
