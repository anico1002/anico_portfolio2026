"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";

/* El color significa algo (Gloop): en la app el color no decora, dice. Cuatro significados del
   README nativo —«brand = en directo / la voz de GLOOP, lima = lo tuyo, acento = algo te espera,
   danger = irreversible»— y una tarjeta de equipo recreada con los tokens reales. Cada chip enciende
   la parte de la tarjeta que lleva ese color; el resto se apaga. Con el ratón se elige; si no, va
   pasando solo mientras se ve. */

const MEANINGS = [
  { key: "live", label: "En directo", color: G.brand },
  { key: "yours", label: "Lo tuyo", color: G.lime },
  { key: "waiting", label: "Algo te espera", color: G.accent },
  { key: "danger", label: "Irreversible", color: G.danger },
] as const;
type Key = (typeof MEANINGS)[number]["key"];

const AV = ["/maqueta/gloop/media/photo-profile.jpg", "/maqueta/gloop/media/photo-splash.jpg", "/maqueta/gloop/media/photo-xativometre.jpg"];

function TeamCard({ on }: { on: Key }) {
  const dim = (k: Key) => ({ opacity: on === k ? 1 : 0.28, transition: `opacity ${DUR.base}s cubic-bezier(${EASE.inOut.join(",")})` });
  return (
    <div className="relative w-full max-w-[26rem] overflow-hidden p-5" style={{ background: G.fill6, borderRadius: "0 18px 18px 18px", fontFamily: "var(--font-gloop)" }}>
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
      {/* Irreversible: la acción destructiva. */}
      <p className="relative mt-5 text-center text-[15px] font-semibold" style={{ ...dim("danger"), color: "#FF5A57" }}>
        Salir del equipo
      </p>
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
        <p className="t-label t-tag text-[var(--case-muted)]">03 · El color</p>
        <p className="mt-4 t-statement">En Gloop el color no decora: dice algo.</p>
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
        <p className="mt-6 max-w-[38ch] t-body text-[var(--case-muted)]">
          Violeta para lo que pasa ahora, lima para lo que es tuyo, fucsia para lo que te espera y rojo solo
          para lo que no tiene vuelta atrás. El logo es fucsia, pero la interfaz habla en violeta.
        </p>
      </div>
      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <div className="relative flex min-h-[28rem] items-center justify-center p-6 md:p-12" style={{ background: G.base }}>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            animate={{ background: MEANINGS.find((m) => m.key === on)!.color, opacity: 0.35 }}
            transition={{ duration: DUR.base, ease: EASE.inOut }}
          />
          <TeamCard on={on} />
        </div>
      </div>
    </div>
  );
}
