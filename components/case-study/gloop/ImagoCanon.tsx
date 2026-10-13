"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { G, geist } from "./tokens";

/* El canon de formas (Gloop, 6-oct-2026). Todo sale del «imago», la esquina recta del isotipo: las
   tarjetas llevan radio 18 con la esquina de arriba a la izquierda recta, que rima con el logo; los
   avatares, el 30 % del lado; los botones, pastilla. Radios en múltiplos de 6. Una sola forma que se
   transforma de una pieza a otra, con la curva del sistema. */

const SHAPES = [
  { key: "imago", label: "Isotipo", note: "Un círculo con una esquina recta", w: 180, h: 180, r: "50% 50% 50% 0" },
  { key: "card", label: "Tarjeta", note: "Radio 18 · arriba a la izquierda, recta", w: 260, h: 170, r: "0 18px 18px 18px" },
  { key: "avatar", label: "Avatar", note: "Radio = 30 % del lado", w: 150, h: 150, r: "30%" },
  { key: "cta", label: "Botón", note: "Pastilla · 64 de alto · uno blanco por pantalla", w: 280, h: 64, r: "999px" },
] as const;

const RADII = [6, 12, 18, 24, 54];

export default function ImagoCanon() {
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setI((k) => (k + 1) % SHAPES.length), 2200);
    return () => clearInterval(id);
  }, [on, reduce]);
  const s = SHAPES[i];

  return (
    <div ref={ref} className={`grid grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6 ${geist.variable}`}>
      <div className="relative col-span-12 flex aspect-[4/3] items-center justify-center md:order-2 md:col-span-7 md:col-start-6" style={{ background: G.base }}>
        <motion.div
          className="relative overflow-hidden"
          animate={{ width: s.w, height: s.h, borderRadius: s.r }}
          transition={{ duration: DUR.slow, ease: EASE.inOut }}
          style={{ background: s.key === "cta" ? "#fff" : s.key === "card" ? G.fill8 : `linear-gradient(135deg, ${G.accent}, ${G.brand})` }}
        >
          {s.key === "avatar" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/maqueta/gloop/media/photo-profile.jpg" alt="" className="h-full w-full object-cover" />
          )}
          {s.key === "cta" && (
            <span className="flex h-full items-center justify-center text-[17px] font-semibold text-black" style={{ fontFamily: "var(--font-gloop)" }}>
              Crear equipo
            </span>
          )}
        </motion.div>
        <p className="absolute bottom-5 left-5 text-[12px] uppercase tracking-[0.1em]" style={{ color: G.text50, fontFamily: "var(--font-gloop)" }}>
          {s.label} · {s.note}
        </p>
      </div>
      <div className="col-span-12 md:order-1 md:col-span-4">
        <p className="t-label t-tag text-[var(--case-muted)]">05 · La forma</p>
        <p className="mt-4 t-title">Todas las formas salen de una esquina.</p>
        <p className="mt-6 t-body text-[var(--case-muted)]">
          La esquina recta del isotipo se repite en cada tarjeta. Los radios van en múltiplos de 6 y el espacio,
          de 5 entre filas parecidas y de 10 entre bloques distintos.
        </p>
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
  );
}
