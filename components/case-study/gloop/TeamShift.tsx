"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FadeIn, GraphicReveal, useSeen } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";

/* Cambio de paradigma (Gloop): la noche ya no depende del plan, sino de con quién la vives. El lienzo se
   parte en cuatro fotos de fiesta (con un zoom lento); se separan hacia sus esquinas y en el hueco del
   centro aparecen las tarjetas de equipo en cristal, que van pasando como un acordeón.
   Rehecho el 2026-10-14 con el feedback de Alberto: sin parada de scroll (todo arranca solo cuando la
   imagen entra), tarjetas con todas las esquinas redondeadas (el brillo del cristal caía en la esquina
   recta), fotos redondeadas salvo la esquina que mira al centro (el guiño imago, simétrico) y los avatares
   tal cual salen en la app (recortes de la pantalla de inicio, `media/av-*.png`).
   Pendiente: vídeos cortos de fiesta en bucle en lugar de las fotos (`video` en QUADS). */

const R = "28px"; // radio de las fotos (en px: framer no anima clamp(); con la escala queda en ~21)
const QUADS: { src: string; video?: string; x: number; y: number }[] = [
  { src: "/maqueta/gloop/media/party-ev3.jpg", x: -1, y: -1 },
  { src: "/maqueta/gloop/media/party-ev6.jpg", x: 1, y: -1 },
  { src: "/maqueta/gloop/media/photo-splash.jpg", x: -1, y: 1 },
  { src: "/maqueta/gloop/media/party-ev2.jpg", x: 1, y: 1 },
];

const TEAMS = [
  { name: "The usual crew", meta: "6 members", night: "Night on", color: G.brand, av: "cracks" },
  { name: "El Piso", meta: "6 members", night: "Friday, 23:10", color: G.lime, av: "piso" },
  { name: "Marta’s birthday", meta: "5 members", night: "Saturday", color: G.accent, av: "oficina" },
  { name: "Town festival", meta: "8 members", night: "This summer", color: G.cyan, av: "insti" },
];
const font = { fontFamily: "var(--font-gloop)" };
const STEP_MS = 2200; // cada equipo abierto en el acordeón

/** Redondeadas salvo la esquina que mira al centro (2026-10-14: así queda simétrico; la recta, en el medio). */
const radius = (q: { x: number; y: number }) => {
  const sq = (cx: number, cy: number) => (cx === -q.x && cy === -q.y ? "0px" : R);
  return `${sq(-1, -1)} ${sq(1, -1)} ${sq(1, 1)} ${sq(-1, 1)}`;
};

function Quad({ q, apart }: { q: (typeof QUADS)[number]; apart: boolean }) {
  return (
    <motion.div
      className="absolute h-1/2 w-1/2 overflow-hidden"
      // Encoge hacia su esquina exterior (antes se desplazaba y el marco le cortaba las esquinas redondeadas).
      style={{
        left: q.x < 0 ? 0 : "50%",
        top: q.y < 0 ? 0 : "50%",
        transformOrigin: `${q.x < 0 ? "left" : "right"} ${q.y < 0 ? "top" : "bottom"}`,
      }}
      initial={false}
      animate={{ scale: apart ? 0.76 : 1, borderRadius: apart ? radius(q) : "0px 0px 0px 0px" }}
      transition={{ duration: DUR.slow, ease: EASE.inOut }}
    >
      {q.video ? (
        <video src={q.video} poster={q.src} muted loop playsInline autoPlay className="h-full w-full object-cover" style={{ filter: "brightness(0.8)" }} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={q.src} alt="" className="gloop-drift h-full w-full object-cover" style={{ filter: "brightness(0.8)" }} />
      )}
    </motion.div>
  );
}

/** Tarjeta de equipo en cristal: abierta enseña su noche y su gente; plegada, solo el nombre. */
function TeamCard({ t, open }: { t: (typeof TEAMS)[number]; open: boolean }) {
  return (
    <motion.div
      className="glass-ios overflow-hidden px-4"
      style={{ borderRadius: 18, ...font }}
      initial={false}
      animate={{ height: open ? 158 : 52 }}
      transition={{ duration: DUR.base, ease: EASE.inOut }}
    >
      <div className="flex h-[52px] items-center justify-between">
        <p className="text-[16px] font-semibold text-white">{t.name}</p>
        <p className="text-[13px] text-white/60">{t.meta}</p>
      </div>
      <motion.div initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: DUR.fast, delay: open ? DUR.fast : 0 }}>
        <p className="flex items-center gap-2 text-[13px] font-medium" style={{ color: t.color }}>
          <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
          {t.night}
        </p>
        <div className="mt-4 flex items-center">
          {/* El grupo de avatares de la app (forma imago, solapados y con el «+N»). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/maqueta/gloop/media/av-${t.av}.png`} alt="" className="h-[34px] w-auto" style={{ borderRadius: "0 9px 9px 9px" }} />
          {/* Botón con la altura del grupo de avatares y radio de botón, no de pastilla. */}
          <span className="ml-auto flex h-[34px] items-center rounded-[10px] bg-white px-3.5 text-[13px] font-semibold text-black">Enter now</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamShift() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const seen = useSeen(ref, "-20% 0px");
  // Tiempos desde que entra la imagen: se separan las fotos, llegan los equipos y cambia la frase.
  const [phase, setPhase] = useState(0); // 0 junta · 1 separada · 2 equipos y frase nueva
  const [open, setOpen] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const a = setTimeout(() => setPhase(1), (reduce ? 0 : DUR.slow * 1000) + 200);
    const b = setTimeout(() => setPhase(2), (reduce ? 0 : DUR.slow * 2000) + 200);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [seen, reduce]);
  // El acordeón pasa solo de un equipo al siguiente mientras se ve.
  useEffect(() => {
    if (phase < 2 || reduce) return;
    const id = setInterval(() => setOpen((k) => (k + 1) % TEAMS.length), STEP_MS);
    return () => clearInterval(id);
  }, [phase, reduce]);

  const swap = { duration: DUR.base, ease: EASE.out };
  return (
    <div ref={ref} className={`relative ${geist.variable}`}>
      <div className="flex min-h-screen items-center px-4 py-24 md:px-6">
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <GraphicReveal from="left" className="relative col-span-12 md:col-span-7">
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--case-bg)] md:aspect-[4/3]">
              {QUADS.map((q) => (
                <Quad key={q.src} q={q} apart={phase >= 1} />
              ))}
              {/* El hueco del centro: los equipos, en acordeón. */}
              <motion.div
                className="absolute left-1/2 top-1/2 flex w-[78%] max-w-[22rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-[5px]"
                initial={false}
                animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 30 }}
                transition={{ duration: DUR.base, ease: EASE.out }}
              >
                {TEAMS.map((t, k) => (
                  <TeamCard key={t.name} t={t} open={k === open} />
                ))}
              </motion.div>
            </div>
          </GraphicReveal>
          {/* Texto centrado en el hueco que queda entre la imagen y el borde derecho. */}
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <div className="md:mx-auto md:w-[80%]">
              <p className="t-label t-tag text-[var(--case-muted)]">The shift</p>
              <div className="relative mt-4">
                <motion.p initial={false} animate={{ opacity: phase >= 2 ? 0 : 1, y: phase >= 2 ? -18 : 0 }} transition={swap} className="t-statement">
                  Before, the night was about the plan.
                </motion.p>
                <motion.p
                  initial={false}
                  animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 18 }}
                  transition={{ ...swap, delay: phase >= 2 ? DUR.fast : 0 }}
                  className="absolute inset-0 t-statement"
                >
                  Now, it’s about who you’re with.
                </motion.p>
              </div>
              <FadeIn className="mt-8">
                <p className="t-body text-[var(--case-muted)]">
                  Build your team with the usual crew, add anyone you like and turn every night out into a shared
                  story.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
