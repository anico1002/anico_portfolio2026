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
   reducido), es una lista vertical.
   2026-10-14 (feedback): todo se mueve un poco (fotos con deriva lenta, el código se escribe solo, los
   wireframes se desplazan), wireframes dibujados aquí en vector, dirección de arte con el chico en grande y
   la app final sobre una foto desenfocada (no repetir el fondo de brillos). Benchmark y primeras pantallas
   esperan imagen de Alberto. */

type Step = {
  title: string;
  body: string;
  media?: { src: string; video?: boolean };
  pending?: string;
  mood?: boolean;
  code?: string[];
  wire?: boolean;
  app?: string;
};

const STEPS: Step[] = [
  // Benchmark: rejilla isométrica con capturas de apps de eventos (scripts/mockups/iso_grid.py).
  { title: "Benchmark", body: "Qué hacen las apps de noche y qué les falta.", media: { src: "/maqueta/gloop/media/benchmark.jpg" } },
  { title: "Wireframes", body: "Primero la estructura. El color, después.", wire: true },
  { title: "Dirección de arte", body: "Oscura, eléctrica y con ganas de fiesta.", mood: true },
  { title: "Primeras pantallas", body: "La noche, convertida en interfaz.", media: { src: "/maqueta/gloop/media/prototipo.jpg" } },
  { title: "Design system", body: "Todo el lenguaje, ordenado en un sistema.", media: { src: "/maqueta/gloop/media/kit-poster.jpg" } },
  { title: "Prototipo", body: "Para sentirla antes de construirla.", media: { src: "/maqueta/gloop/media/flujo-dia.mp4", video: true } },
  {
    title: "Código",
    body: "El diseño, traducido sin perder un píxel.",
    code: ["struct GloopButton: View {", "  let title: String", "  var style: Style = .primary", "  var body: some View {", "    Text(title)", "      .font(.gloop(.nav))", "      .frame(height: 64)", "      .background(.white, in: .capsule)", "  }", "}"],
  },
  { title: "App final", body: "Lista para salir de fiesta.", app: "/maqueta/gloop/media/scr-nativa.mp4" },
];

/** Mini moodboard de la dirección de arte: tres fotos de noche y la paleta. */
function Mood() {
  // El chico en grande (feedback 2026-10-14); el escenario, abajo en pequeño.
  const imgs = ["photo-xativometre", "party-ev3", "party-sonar"];
  const sw = [G.brand, G.accent, G.lime, G.cyan];
  return (
    <div className="relative mt-6 grid aspect-[16/10] grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden" style={{ background: G.base }}>
      {imgs.map((n, k) => (
        <div key={n} className={`overflow-hidden ${k === 0 ? "col-span-2 row-span-2" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/maqueta/gloop/media/${n}.jpg`} alt="" loading="lazy" className="gloop-drift h-full w-full object-cover" style={{ animationDelay: `${-k * 5}s` }} />
        </div>
      ))}
      <div className="absolute bottom-3 left-3 flex gap-1.5">
        {sw.map((c) => (
          <span key={c} className="h-6 w-6" style={{ background: c, borderRadius: "0 8px 8px 8px" }} />
        ))}
      </div>
    </div>
  );
}

/** El código se escribe solo, línea a línea, mientras se ve (y vuelve a empezar). */
function Typing({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLPreElement>(null);
  const reduce = useReduce();
  const total = lines.join("\n").length;
  const [n, setN] = useState(total);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || reduce) return;
    let k = 0;
    const id = setInterval(() => {
      k = k >= total + 60 ? 0 : k + 2; // al acabar, un respiro y otra vez
      setN(Math.min(k, total));
    }, 28);
    return () => clearInterval(id);
  }, [on, reduce, total]);
  // Dónde empieza cada línea dentro del texto entero (para saber cuánto se ha escrito de cada una).
  const starts = lines.map((_, k) => lines.slice(0, k).reduce((a, l) => a + l.length + 1, 0));
  return (
    <pre ref={ref} className="mt-6 aspect-[16/10] overflow-hidden p-5 text-[12px] leading-relaxed" style={{ background: G.base, color: G.text70, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {lines.map((l, k) => {
        const left = n - starts[k];
        const shown = l.slice(0, Math.max(0, left));
        const typing = left >= 0 && left <= l.length;
        const kw = l.match(/^(\s*)(struct|let|var)(.*)$/);
        return (
          <span key={k} className="block min-h-[1.6em] whitespace-pre">
            {kw && shown.length > kw[1].length ? (
              <>
                {kw[1]}
                <span style={{ color: G.brand }}>{shown.slice(kw[1].length, kw[1].length + kw[2].length)}</span>
                {shown.slice(kw[1].length + kw[2].length)}
              </>
            ) : (
              shown
            )}
            {typing && <span className="ml-px inline-block h-[1.1em] w-[7px] translate-y-[2px] animate-pulse" style={{ background: G.accent }} />}
          </span>
        );
      })}
    </pre>
  );
}

/** Wireframes dibujados en vector: un trozo del documento de flujos (pantallas en grises, cortadas por la
    máscara), que se desplaza muy despacio. */
function Wireframes() {
  const screens = 6;
  const W = 120;
  const H = 250;
  const gap = 36;
  const g1 = "#3a3a40";
  const g2 = "#2a2a2f";
  const line = "#55555c";
  const Screen = ({ i }: { i: number }) => {
    const x = i * (W + gap);
    return (
      <g transform={`translate(${x} 0)`}>
        <rect width={W} height={H} rx={16} fill="#1c1c20" stroke={line} strokeWidth={1} />
        <rect x={44} y={8} width={32} height={8} rx={4} fill={g1} />
        <rect x={12} y={30} width={60} height={9} rx={3} fill={g1} />
        {i % 3 === 0 && <rect x={12} y={50} width={W - 24} height={70} rx={10} fill={g2} stroke={line} strokeDasharray="3 3" />}
        {i % 3 === 0 && <path d={`M12 50 L${W - 12} 120 M${W - 12} 50 L12 120`} stroke={line} strokeWidth={0.8} />}
        {Array.from({ length: i % 3 === 0 ? 3 : 5 }, (_, r) => {
          const y = (i % 3 === 0 ? 132 : 52) + r * 34;
          return (
            <g key={r}>
              <rect x={12} y={y} width={24} height={24} rx={7} fill={g2} stroke={line} strokeWidth={0.8} />
              <rect x={44} y={y + 3} width={W - 60 - (r % 2) * 18} height={7} rx={3} fill={g1} />
              <rect x={44} y={y + 15} width={W - 76} height={5} rx={2.5} fill={g2} />
            </g>
          );
        })}
        {i % 2 === 1 && <rect x={12} y={H - 52} width={W - 24} height={22} rx={11} fill="none" stroke={line} />}
        <rect x={20} y={H - 22} width={W - 40} height={12} rx={6} fill={g2} />
        <text x={0} y={H + 22} fill="#6b6b72" fontSize={9} fontFamily="ui-sans-serif, system-ui">
          {["Inicio", "Equipo", "La noche", "Momentos", "La Cuenta", "Perfil"][i]}
        </text>
        {i < screens - 1 && <path d={`M${W + 6} ${H / 2} h${gap - 12}`} stroke={line} strokeWidth={1} markerEnd="url(#wf-arrow)" />}
      </g>
    );
  };
  return (
    <div className="relative mt-6 aspect-[16/10] overflow-hidden" style={{ background: "#141417" }}>
      <svg viewBox={`0 0 ${screens * (W + gap)} ${H + 40}`} className="wf-pan absolute left-[-6%] top-[12%] h-[115%] w-auto" aria-hidden>
        <defs>
          <marker id="wf-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L6 3 L0 6" fill="none" stroke="#55555c" />
          </marker>
        </defs>
        {Array.from({ length: screens }, (_, i) => (
          <Screen key={i} i={i} />
        ))}
      </svg>
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
            <img src={s.media.src} alt="" loading="lazy" className="gloop-drift absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
      )}
      {s.mood && <Mood />}
      {s.pending && (
        <div className="mt-6">
          <Placeholder ratio="16/10" label={s.pending} />
        </div>
      )}
      {s.code && <Typing lines={s.code} />}
      {s.wire && <Wireframes />}
      {s.app && (
        // Como nativa.mp4 (la pantalla sola, centrada y casi a toda altura), pero con una foto de fiesta desenfocada
        // detrás en vez del fondo de brillos (feedback 2026-10-14).
        <div className="relative mt-6 aspect-[16/10] overflow-hidden" style={{ background: G.base }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/gloop/media/party-ev5.jpg" alt="" aria-hidden className="gloop-drift absolute inset-0 h-full w-full object-cover" style={{ filter: "blur(16px) brightness(0.55) saturate(1.2)" }} />
          <div
            className="absolute left-1/2 top-[5%] h-[96%] -translate-x-1/2 overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
            style={{ aspectRatio: "480 / 1042", borderRadius: "11% / 5.1%" }}
          >
            <LazyVideo className="absolute inset-0 h-full w-full object-cover" src={s.app} aria-label="La app final" />
          </div>
        </div>
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
