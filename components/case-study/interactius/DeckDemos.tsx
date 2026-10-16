"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { IX, IX_EXPO, ixFonts, mono, serif } from "./tokens";

/* Demos del generador de presentaciones de Interactius (Markdown → deck 16:9), recreadas con su retícula
   real (components/deck/deck.css del repo): lienzo fijo de 1280×720, márgenes de 108, titulares en Plex
   Serif 300 y cuerpo en Plex Mono. Las columnas caben siempre en una fila: a partir de cuatro, el hueco
   baja de 48 a 24. El texto de los ejemplos es inventado (el de verdad son propuestas de clientes). */

/** Lienzo de diapositiva: 1280×720 escalado al ancho del contenedor (como el lienzo fijo del deck). */
export function Slide({ children, bg = IX.light }: { children: React.ReactNode; bg?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.5);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / 1280));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="relative w-full overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]" style={{ aspectRatio: "16 / 9", background: bg }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: 1280, height: 720, transform: `scale(${k})`, color: IX.dark, ...mono }}>
        {children}
      </div>
    </div>
  );
}

/** Editor de Markdown: líneas que van apareciendo, con el cursor al final. */
function Editor({ lines, shown }: { lines: string[]; shown: number }) {
  return (
    <div className="h-full min-h-[18rem] p-5 text-[13px] leading-[1.9] md:p-6" style={{ background: IX.dark, color: IX.light, ...mono }}>
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className="whitespace-pre" style={{ color: l.startsWith("#") || l.startsWith("```") ? IX.light : "rgba(255,255,255,0.6)" }}>
          {l || " "}
          {i === shown - 1 && <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse" style={{ background: IX.bordeaux }} />}
        </div>
      ))}
    </div>
  );
}

/** Avanza `shown` de 1 al total y vuelve a empezar, solo mientras se ve. */
function useTyping(total: number, ms = 650, pause = 2600) {
  const [shown, setShown] = useState(total);
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
    let alive = true;
    let t = 0;
    const run = async () => {
      while (alive) {
        for (let n = 1; n <= total && alive; n++) {
          setShown(n);
          await new Promise((r) => (t = window.setTimeout(r, ms)));
        }
        await new Promise((r) => (t = window.setTimeout(r, pause)));
      }
    };
    run();
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [on, reduce, total, ms, pause]);
  return { ref, shown };
}

const COLS_MD = [
  "[ly: columnas]",
  "## How we’ll do it",
  "### Diagnosis",
  "Read how decisions are made today.",
  "### Listening",
  "Talk to the people who use the service.",
  "### Prototype",
  "Test before you build.",
  "### Measure",
  "Know whether it worked.",
];

export function MarkdownToSlide() {
  const { ref, shown } = useTyping(COLS_MD.length);
  const md = COLS_MD.slice(0, shown);
  const title = md.find((l) => l.startsWith("## "))?.slice(3);
  const cols: { hd: string; body?: string }[] = [];
  md.forEach((l) => {
    if (l.startsWith("### ")) cols.push({ hd: l.slice(4) });
    else if (cols.length && !l.startsWith("#") && !l.startsWith("[")) cols[cols.length - 1].body = l;
  });
  const four = cols.length >= 4;

  return (
    <div ref={ref} className={`grid grid-cols-12 items-stretch gap-x-4 gap-y-6 md:gap-x-6 ${ixFonts}`}>
      <div className="col-span-12 md:col-span-4">
        <Editor lines={COLS_MD} shown={shown} />
      </div>
      <div className="col-span-12 md:col-span-8">
        <Slide>
          {title && (
            <motion.p
              className="absolute left-[108px] top-[88px] text-[44px] font-light leading-[1.08]"
              style={serif}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: IX_EXPO }}
            >
              {title}
            </motion.p>
          )}
          <motion.div
            className="absolute left-[108px] right-[108px] top-[216px] grid"
            style={{ gridAutoFlow: "column", gridAutoColumns: "1fr" }}
            animate={{ columnGap: four ? 24 : 48 }}
            transition={{ duration: 0.9, ease: IX_EXPO }}
          >
            {cols.map((c, i) => (
              <motion.div
                key={c.hd}
                layout
                className="bg-white"
                style={{ padding: four ? 20 : 24 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: IX_EXPO }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: IX.ash }}>
                  0{i + 1}
                </p>
                <p className="mt-[18px] font-light leading-[1.1]" style={{ ...serif, fontSize: four ? 22 : 26 }}>
                  {c.hd}
                </p>
                <p className="mt-[14px] min-h-[1.65em] text-[13px] leading-[1.65]" style={{ color: IX.ashDark }}>
                  {c.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <p className="absolute bottom-[56px] left-[108px] text-[10px] uppercase tracking-[0.08em]" style={{ color: IX.ash }}>
            {four ? "4 columnas · hueco 24" : `${cols.length || 0} columnas · hueco 48`}
          </p>
        </Slide>
      </div>
    </div>
  );
}

const GANTT_MD = ["```gantt", "weeks: 8", "Diagnosis: 1", "Listening: 2-3.5", "Prototype: 4-6", "Measure: 7-8", "milestones: 1, 3, 6, 8", "```"];
const BARS = [IX.opal, IX.bordeaux, IX.emerald, IX.opal];

export function GanttTyped() {
  const { ref, shown } = useTyping(GANTT_MD.length, 700);
  const md = GANTT_MD.slice(0, shown);
  const rows = md
    .map((l) => l.match(/^([^:]+):\s*([\d.]+)(?:-([\d.]+))?$/))
    .filter((m): m is RegExpMatchArray => !!m && m[1] !== "weeks")
    .map((m) => ({ name: m[1], from: Number(m[2]), to: Number(m[3] ?? m[2]) }));
  const hitos = md.find((l) => l.startsWith("milestones:"))?.slice(11).split(",").map((x) => Number(x)) ?? [];
  const weeks = 8;
  const W = 1280 - 108 - 108 - 130;

  return (
    <div ref={ref} className={`grid grid-cols-12 items-stretch gap-x-4 gap-y-6 md:gap-x-6 ${ixFonts}`}>
      <div className="col-span-12 md:order-2 md:col-span-4">
        <Editor lines={GANTT_MD} shown={shown} />
      </div>
      <div className="col-span-12 md:order-1 md:col-span-8">
        <Slide bg={IX.white}>
          <p className="absolute left-[108px] top-[72px] text-[44px] font-light" style={serif}>
            Roadmap
          </p>
          <p className="absolute left-[110px] top-[136px] text-[13px]" style={{ color: IX.ash }}>
            8 weeks
          </p>
          <div className="absolute left-[108px] right-[108px] top-[220px]">
            <div className="flex pb-3 text-[13px] font-semibold">
              <span className="w-[130px]" />
              {Array.from({ length: weeks }, (_, k) => (
                <span key={k} className="flex-1 text-center">
                  S{k + 1}
                </span>
              ))}
            </div>
            {rows.map((r, i) => (
              <div key={r.name} className="flex h-[58px] items-center border-t border-dashed" style={{ borderColor: "rgba(10,10,10,0.28)" }}>
                <span className="mr-[10px] w-[120px] py-[18px] pl-[10px] text-[13px]" style={{ background: "rgba(10,10,10,0.04)", color: IX.ashDark }}>
                  {r.name}
                </span>
                <div className="relative h-full flex-1">
                  <motion.span
                    className="absolute top-1/2 h-[30px] -translate-y-1/2"
                    style={{ left: ((r.from - 1) / weeks) * W + 6, background: BARS[i % BARS.length], originX: 0 }}
                    initial={{ width: 0 }}
                    animate={{ width: ((r.to - r.from + 1) / weeks) * W - 12 }}
                    transition={{ duration: 0.8, ease: IX_EXPO }}
                  />
                </div>
              </div>
            ))}
            {hitos.length > 0 && (
              <div className="flex h-[52px] items-center border-t border-dashed" style={{ borderColor: "rgba(10,10,10,0.28)" }}>
                <span className="w-[130px] pl-[10px] text-[13px]" style={{ color: IX.ashDark }}>
                  Hitos
                </span>
                <div className="relative h-full flex-1">
                  {hitos.map((h, k) => (
                    <motion.span
                      key={h}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[15px]"
                      style={{ left: ((h - 0.5) / weeks) * W }}
                      initial={{ opacity: 0, y: -24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: IX_EXPO, delay: k * 0.08 }}
                    >
                      ◆
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Slide>
      </div>
    </div>
  );
}
