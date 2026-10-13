"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LazyVideo from "@/components/case-study/LazyVideo";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* Del diseño al código (Gloop): la línea del proceso con sus fechas reales (git y NOTES del repo,
   2026). En escritorio, la sección se queda fija y el scroll vertical la recorre en horizontal; en
   móvil (o con movimiento reducido), es una lista vertical. */

type Step = { date: string; title: string; body: string; media?: { src: string; video?: boolean }; code?: string[] };

const STEPS: Step[] = [
  { date: "09 jun", title: "Arranca el rediseño", body: "De una app que ya existía en iOS y Android a un producto pensado desde cero." },
  { date: "22 ago", title: "El test de campo", body: "Unas 500 descargas con un QR. Hallazgo: nadie sabía qué hacer al entrar.", media: { src: "/maqueta/gloop/media/photo-splash.jpg" } },
  { date: "04 sep", title: "El giro", body: "Con el cliente: la app pasa a girar alrededor del equipo, no del evento." },
  { date: "18 sep", title: "El kit, con el cliente", body: "El sistema completo, presentado al equipo de Gloop.", media: { src: "/maqueta/gloop/media/kit-poster.jpg" } },
  { date: "21 sep", title: "La v3 en código", body: "Prototipo navegable con 10 escenarios sobre 15 pantallas de referencia.", media: { src: "/maqueta/gloop/media/prototipo.jpg" } },
  { date: "04 oct", title: "Vídeos para el equipo", body: "Tres recorridos grabados del prototipo para alinear a todo el equipo.", media: { src: "/maqueta/gloop/media/flujo-dia.mp4", video: true } },
  { date: "05 oct", title: "La app nativa", body: "La app entera en SwiftUI en un día, instalada en el iPhone.", media: { src: "/maqueta/gloop/media/nativa.mp4", video: true } },
  {
    date: "06 oct",
    title: "Al repo de desarrollo",
    body: "Primera entrega al repositorio del equipo: código, no maquetas.",
    code: ["struct GloopButton: View {", "  let title: String", "  var style: Style = .primary", "  var body: some View {", "    Text(title)", "      .font(.gloop(.nav))", "      .frame(height: 64)", "      .background(.white, in: .capsule)", "  }", "}"],
  },
  { date: "11 oct", title: "Segunda entrega", body: "Pulida al píxel sobre el simulador, con el canon de formas cerrado." },
];

function StepCard({ s, i }: { s: Step; i: number }) {
  return (
    <article className="flex w-[78vw] shrink-0 flex-col md:w-[24rem]">
      <div className="flex items-baseline gap-3 border-t border-[var(--case-line)] pt-4">
        <span className="t-label t-tag text-[var(--case-muted)]">{String(i + 1).padStart(2, "0")}</span>
        <span className="t-label t-tag">{s.date} · 2026</span>
      </div>
      <h3 className="mt-4 t-lead font-medium">{s.title}</h3>
      <p className="mt-2 t-small text-[var(--case-muted)]">{s.body}</p>
      {s.media && (
        <div className="relative mt-6 aspect-[16/10] overflow-hidden bg-[var(--case-ph)]">
          {s.media.video ? (
            <LazyVideo className="absolute inset-0 h-full w-full object-cover" src={s.media.src} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.media.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
      )}
      {s.code && (
        <pre className="mt-6 overflow-hidden p-5 text-[12px] leading-relaxed" style={{ background: G.base, color: G.text70, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {s.code.map((l, k) => (
            <span key={k} className="block">
              <span style={{ color: l.includes("struct") || l.includes("var ") || l.includes("let ") ? G.brand : undefined }}>{l}</span>
            </span>
          ))}
        </pre>
      )}
    </article>
  );
}

export default function ProcessLine() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      setWide(mq.matches);
      const t = track.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 48));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    mq.addEventListener("change", measure);
    return () => (ro.disconnect(), mq.removeEventListener("change", measure));
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.08, 0.95], [0, -dist]);
  const pinned = wide && !reduce;

  return (
    <div ref={ref} className={`relative ${geist.variable}`} style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-10"}>
        <div className="px-4 md:px-6">
          <p className="t-label t-tag text-[var(--case-muted)]">07 · Del diseño al código</p>
          <p className="mt-4 max-w-[22ch] t-statement">Cuatro meses, de la idea al repo del equipo.</p>
        </div>
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={`mt-12 flex gap-8 px-4 md:mt-16 md:gap-12 md:px-6 ${pinned ? "w-max" : "flex-col"}`}
        >
          {STEPS.map((s, i) => (
            <StepCard key={s.date} s={s} i={i} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
