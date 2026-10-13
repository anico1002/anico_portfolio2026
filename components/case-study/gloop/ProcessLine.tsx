"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LazyVideo from "@/components/case-study/LazyVideo";
import Lines from "@/components/case-study/Lines";
import { GraphicReveal, Placeholder } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* El proceso (Gloop; rehecho el 2026-10-13 con el feedback de Alberto: sin fechas, que envejecen mal y no
   le importan a quien visita). Los pasos de creación, del benchmark a la app final. En escritorio, la
   sección se queda fija y el scroll vertical la recorre en horizontal; en móvil (o con movimiento
   reducido), es una lista vertical. Benchmark y wireframes esperan imagen de Alberto. */

type Step = {
  title: string;
  body: string;
  media?: { src: string; video?: boolean };
  pending?: string;
  mood?: boolean;
  code?: string[];
};

const STEPS: Step[] = [
  { title: "Benchmark", body: "Qué hacen las apps de noche y qué les falta.", pending: "Benchmark de apps de ocio nocturno" },
  { title: "Wireframes", body: "Primero la estructura. El color, después.", pending: "Wireframes de los flujos principales" },
  { title: "Dirección de arte", body: "Oscura, eléctrica y con ganas de fiesta.", mood: true },
  { title: "Primeras pantallas", body: "La noche, convertida en interfaz.", media: { src: "/maqueta/gloop/media/prototipo.jpg" } },
  { title: "Design system", body: "Todo el lenguaje, ordenado en un sistema.", media: { src: "/maqueta/gloop/media/kit-poster.jpg" } },
  { title: "Prototipo", body: "Para sentirla antes de construirla.", media: { src: "/maqueta/gloop/media/flujo-dia.mp4", video: true } },
  {
    title: "Código",
    body: "El diseño, traducido sin perder un píxel.",
    code: ["struct GloopButton: View {", "  let title: String", "  var style: Style = .primary", "  var body: some View {", "    Text(title)", "      .font(.gloop(.nav))", "      .frame(height: 64)", "      .background(.white, in: .capsule)", "  }", "}"],
  },
  { title: "App final", body: "Lista para salir de fiesta.", media: { src: "/maqueta/gloop/media/nativa.mp4", video: true } },
];

/** Mini moodboard de la dirección de arte: tres fotos de noche y la paleta. */
function Mood() {
  const imgs = ["party-sonar", "party-ev3", "photo-xativometre"];
  const sw = [G.brand, G.accent, G.lime, G.cyan];
  return (
    <div className="relative mt-6 grid aspect-[16/10] grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden" style={{ background: G.base }}>
      {imgs.map((n, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={n} src={`/maqueta/gloop/media/${n}.jpg`} alt="" loading="lazy" className={`h-full w-full object-cover ${k === 0 ? "col-span-2 row-span-2" : ""}`} />
      ))}
      <div className="absolute bottom-3 left-3 flex gap-1.5">
        {sw.map((c) => (
          <span key={c} className="h-6 w-6" style={{ background: c, borderRadius: "0 8px 8px 8px" }} />
        ))}
      </div>
    </div>
  );
}

function StepCard({ s, i }: { s: Step; i: number }) {
  return (
    <article className="flex w-[78vw] shrink-0 flex-col md:w-[24rem]">
      <div className="flex items-baseline gap-3 border-t border-[var(--case-line)] pt-4">
        <span className="t-label t-tag text-[var(--case-muted)]">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-4 t-lead font-medium">{s.title}</h3>
      <p className="mt-2 t-small text-[var(--case-muted)] md:whitespace-nowrap">{s.body}</p>
      {/* Las piezas entran con máscara al llegar a la vista (también al pasar en horizontal). */}
      <GraphicReveal from="right">
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
      {s.mood && <Mood />}
      {s.pending && (
        <div className="mt-6">
          <Placeholder ratio="16/10" label={s.pending} />
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
      </GraphicReveal>
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
          <p className="t-label t-tag text-[var(--case-muted)]">El proceso</p>
          <Lines className="mt-4 max-w-[24ch] t-statement text-balance">Del primer boceto a la app en tu mano.</Lines>
        </div>
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={`mt-12 flex gap-8 px-4 md:mt-16 md:gap-12 md:px-6 ${pinned ? "w-max" : "flex-col"}`}
        >
          {STEPS.map((s, i) => (
            <StepCard key={s.title} s={s} i={i} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
