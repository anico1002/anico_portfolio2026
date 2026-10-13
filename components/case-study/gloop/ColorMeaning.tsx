"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn, Parallax } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";

/* El color habla (Gloop): en la app el color no decora, dice. Tres significados (en directo, lo tuyo,
   algo te espera; el rojo de «irreversible» se quitó el 2026-10-13 por feedback) y una tarjeta de
   equipo en cristal, recreada con los tokens reales, sobre una foto de fiesta desenfocada. Cada chip
   enciende la parte de la tarjeta que lleva ese color; el resto se apaga. Con el ratón se elige; si
   no, va pasando solo mientras se ve. */

const MEANINGS = [
  { key: "live", label: "En directo", color: G.brand },
  { key: "yours", label: "Lo tuyo", color: G.lime },
  { key: "waiting", label: "Algo te espera", color: G.accent },
] as const;
type Key = (typeof MEANINGS)[number]["key"];

const AV = ["/maqueta/gloop/media/photo-profile.jpg", "/maqueta/gloop/media/photo-splash.jpg", "/maqueta/gloop/media/photo-xativometre.jpg"];

function TeamCard({ on }: { on: Key }) {
  const dim = (k: Key) => ({ opacity: on === k ? 1 : 0.28, transition: `opacity ${DUR.base}s cubic-bezier(${EASE.inOut.join(",")})` });
  return (
    <div
      className="glass-ios w-full max-w-[26rem] overflow-hidden p-5"
      style={{ borderRadius: "0 18px 18px 18px", fontFamily: "var(--font-gloop)" }}
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
        <span className="flex items-center gap-2 text-[13px]" style={{ ...dim("waiting"), color: G.accent }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: G.accent }} />2 Momentos sin ver
        </span>
      </div>
      <div className="relative mt-1 flex items-center gap-2 text-[13px]" style={{ color: G.text50 }}>
        <span style={{ ...dim("live"), color: G.brand }}>● Noche en marcha</span>
        <span>· 6 miembros</span>
      </div>
      <div className="relative mt-5 flex items-center">
        {AV.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className="-ml-2 h-11 w-11 object-cover first:ml-0" style={{ borderRadius: "30%", boxShadow: `0 0 0 3px ${G.surface}` }} />
        ))}
        {/* Lo tuyo: tu avatar, con el aro lima. */}
        <span
          className="-ml-2 flex h-11 w-11 items-center justify-center text-[13px] font-bold text-black"
          style={{ ...dim("yours"), borderRadius: "30%", background: G.lime, boxShadow: `0 0 0 3px ${G.surface}` }}
        >
          Tú
        </span>
      </div>
      <div className="relative mt-5 flex items-center justify-between rounded-[12px] px-4 py-3" style={{ background: G.fill8 }}>
        <span className="text-[15px] text-white">La Cuenta</span>
        <span className="text-[15px] font-semibold" style={{ ...dim("yours"), color: G.lime }}>
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
      <div className="col-span-12 md:col-span-5">
        <p className="t-label t-tag text-[var(--case-muted)]">El color</p>
        <Lines className="mt-4 t-statement">En Gloop, el color no decora: habla.</Lines>
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
            Cada color tiene un cometido: el violeta enciende, el lima señala lo que es tuyo y el fucsia lo que te
            espera. La interfaz habla en violeta.
          </p>
        </FadeIn>
      </div>
      <Parallax speed={90} className="m-bleed col-span-12 md:col-span-6 md:col-start-7">
        <div className="relative flex min-h-[28rem] items-center justify-center overflow-hidden p-6 md:min-h-[34rem] md:p-12" style={{ background: G.base }}>
          {/* Foto de fiesta desenfocada: el cristal de la tarjeta necesita algo detrás. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
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
      </Parallax>
    </div>
  );
}
