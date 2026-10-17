"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn, GraphicReveal, Parallax } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";
import Img from "@/components/case-study/Img";

/* El color habla (Gloop): en la app el color no decora, dice. Tres significados (en directo, lo tuyo,
   algo te espera; el rojo de «irreversible» se quitó el 2026-10-13 por feedback) y una tarjeta de
   equipo en cristal, recreada con los tokens reales, sobre una foto de fiesta desenfocada. Cada chip
   enciende la parte de la tarjeta que lleva ese color; el resto se apaga. Con el ratón se elige; si
   no, va pasando solo mientras se ve.
   2026-10-14 (feedback): todas las esquinas redondeadas y textos legibles. Sobre el tinte del color activo
   los textos de color se perdían (el mismo tono que el fondo): ahora el color va en píldoras sólidas con el
   texto en blanco o negro, y los avatares son los de la app. */

const MEANINGS = [
  { key: "live", label: "Live", color: G.brand },
  { key: "yours", label: "Yours", color: G.lime },
  { key: "waiting", label: "Something’s waiting", color: G.accent },
] as const;
type Key = (typeof MEANINGS)[number]["key"];


function TeamCard({ on }: { on: Key }) {
  const dim = (k: Key) => ({ opacity: on === k ? 1 : 0.35, transition: `opacity ${DUR.base}s cubic-bezier(${EASE.inOut.join(",")})` });
  return (
    <div
      className="glass-ios w-full max-w-[26rem] overflow-hidden p-5"
      style={{ borderRadius: 18, fontFamily: "var(--font-gloop)" }}
    >
      {/* En directo: el brillo diagonal de la tarjeta cuando el equipo tiene la noche activa. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ ...dim("live"), background: `linear-gradient(135deg, ${G.brand}66, transparent 55%)` }}
      />
      <div className="relative flex items-center justify-between">
        <p className="text-[20px] font-semibold text-white">El Piso</p>
        {/* Algo te espera: el punto de aviso. */}
        <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold text-white" style={{ ...dim("waiting"), background: G.accent }}>
          <span className="h-2 w-2 rounded-full bg-white" />2 unseen Moments
        </span>
      </div>
      <div className="relative mt-2 flex items-center gap-2 text-[13px] text-white/80">
        <span className="rounded-full px-3 py-1 font-semibold text-white" style={{ ...dim("live"), background: G.brand }}>
          ● Night on
        </span>
        <span>6 members</span>
      </div>
      <div className="relative mt-5 flex items-center gap-2">
        {/* El grupo de avatares de la app (forma imago) y, al lado, tú, con el lima. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Img src="/maqueta/gloop/media/av-piso.png" alt="" className="h-[38px] w-auto" style={{ borderRadius: "0 10px 10px 10px" }} />
        <span
          className="flex h-[38px] w-[38px] items-center justify-center text-[13px] font-bold text-black"
          style={{ ...dim("yours"), borderRadius: "0 10px 10px 10px", background: G.lime }}
        >
          You
        </span>
      </div>
      <div className="relative mt-5 flex items-center justify-between rounded-[12px] px-4 py-3" style={{ background: G.fill8 }}>
        <span className="text-[15px] text-white">The Tab</span>
        <span className="rounded-full px-3 py-1 text-[14px] font-semibold text-black" style={{ ...dim("yours"), background: G.lime }}>
          Te deben 34,26 €
        </span>
      </div>
    </div>
  );
}

export default function ColorMeaning() {
  const [on, setOn] = useState<Key>("live");
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setSeen(es.some((e) => e.isIntersecting)), { rootMargin: "-20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen || hold || reduce) return;
    const id = window.setInterval(() => {
      setOn((k) => MEANINGS[(MEANINGS.findIndex((m) => m.key === k) + 1) % MEANINGS.length].key);
    }, 2400);
    return () => clearInterval(id);
  }, [seen, hold, reduce]);

  return (
    <div ref={ref} className={`grid grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6 ${geist.variable}`}>
      {/* Centrado en el hueco entre el margen y la imagen (feedback 2026-10-14). */}
      <div className="col-span-12 md:col-span-6 md:flex md:justify-center">
        <div className="md:max-w-[26rem]">
        <p className="t-label t-tag text-[var(--case-muted)]">Color</p>
        <Lines className="mt-4 t-statement">In Gloop, color does the talking.</Lines>
        <div className="mt-10 flex flex-wrap gap-2" onMouseLeave={() => setHold(false)}>
          {MEANINGS.map((m) => (
            <button
              key={m.key}
              type="button"
              onMouseEnter={() => (setOn(m.key), setHold(true))}
              onFocus={() => (setOn(m.key), setHold(true))}
              onClick={() => (setOn(m.key), setHold(true))}
              className="hov flex items-center gap-2 rounded-full border px-4 py-2 t-small"
              style={{ borderColor: on === m.key ? m.color : "var(--case-line)" }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
        <FadeIn className="mt-6 max-w-[38ch]">
          <p className="t-body text-[var(--case-muted)]">
            Every color has a job: violet switches things on, lime marks what’s yours and fuchsia what’s waiting
            for you. The interface speaks violet.
          </p>
        </FadeIn>
        </div>
      </div>
      <Parallax speed={90} className="m-bleed col-span-12 md:col-span-6 md:col-start-7">
        <GraphicReveal from="right">
        <div className="relative flex min-h-[28rem] items-center justify-center overflow-hidden p-6 md:min-h-[34rem] md:p-12" style={{ background: G.base }}>
          {/* Foto de fiesta desenfocada: el cristal de la tarjeta necesita algo detrás. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Img
            src="/maqueta/gloop/media/party-ev6.jpg"
            alt=""
            aria-hidden
            className="gloop-drift absolute inset-0 h-full w-full object-cover"
            style={{ filter: "blur(18px) brightness(0.55) saturate(1.2)" }}
          />
          {/* Tinte del color activo sobre toda la foto (antes un brillo bajo la tarjeta, que tapaba la lectura). */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ mixBlendMode: "color" }}
            animate={{ background: MEANINGS.find((m) => m.key === on)!.color, opacity: 0.55 }}
            transition={{ duration: DUR.base, ease: EASE.inOut }}
          />
          <TeamCard on={on} />
        </div>
        </GraphicReveal>
      </Parallax>
    </div>
  );
}
