"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { Slide } from "./DeckDemos";
import { IX, IX_EXPO, ixFonts, mono, serif } from "./tokens";

/* Piezas del manual de marca de Interactius, recreadas con sus tokens reales (lib/tokens.ts):
   una sola fuente de datos que alimenta todo, el validador de tono (con su vocabulario prohibido real) y el
   texto que se ajusta solo para no salirse nunca de la retícula (FitText). */

function useInView<T extends Element>(margin = "-15% 0px") {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, on };
}

const SERVICES = [
  { key: "estrategico", name: "Pensamiento estratégico", color: IX.opal, token: "opal" },
  { key: "experiencias", name: "Diseño de experiencias", color: IX.bordeaux, token: "bordeaux" },
  { key: "cultural", name: "Transformación cultural", color: IX.emerald, token: "emerald" },
] as const;

/** Una sola fuente: el color del servicio elegido llega a la vez a todas las salidas. */
export function TokenSync() {
  const [i, setI] = useState(1);
  const [hold, setHold] = useState(false);
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  useEffect(() => {
    if (!on || hold || reduce) return;
    const id = window.setInterval(() => setI((k) => (k + 1) % SERVICES.length), 2600);
    return () => clearInterval(id);
  }, [on, hold, reduce]);
  const s = SERVICES[i];
  const flash = { initial: { opacity: 0.25 }, animate: { opacity: 1 }, transition: { duration: 0.6, ease: IX_EXPO } };

  return (
    <div ref={ref} className={`grid grid-cols-12 gap-x-4 gap-y-6 md:gap-x-6 ${ixFonts}`}>
      {/* La fuente: lib/tokens.ts */}
      <div className="col-span-12 p-6 text-[13px] leading-[1.9] md:col-span-5" style={{ background: IX.dark, color: "rgba(255,255,255,0.6)", ...mono }}>
        <p className="mb-3 text-[11px] uppercase tracking-[0.08em]" style={{ color: IX.ash }}>
          lib/tokens.ts · la única fuente
        </p>
        <p>export const accent = {"{"}</p>
        {SERVICES.map((x, k) => (
          <button
            key={x.key}
            type="button"
            onMouseEnter={() => (setI(k), setHold(true))}
            onMouseLeave={() => setHold(false)}
            onClick={() => (setI(k), setHold(true))}
            className="block w-full pl-5 text-left transition-colors"
            style={{ color: k === i ? IX.light : undefined, background: k === i ? "rgba(255,255,255,0.06)" : undefined }}
          >
            {x.token}: <span style={{ color: x.color }}>&apos;{x.color}&apos;</span>, <span style={{ color: IX.ash }}>{"// "}{x.name.toLowerCase()}</span>
          </button>
        ))}
        <p>{"}"}</p>
      </div>
      {/* Las salidas */}
      <div className="col-span-12 grid grid-cols-2 gap-3 md:col-span-7 md:gap-4" style={mono}>
        <div className="flex flex-col justify-between p-5" style={{ background: IX.light, color: IX.dark }}>
          <p className="t-label t-tag font-[family-name:var(--font-case-sans)]" style={{ color: IX.ash }}>Manual · color</p>
          <motion.div key={s.key + "sw"} {...flash} className="mt-4 h-20 w-full" style={{ background: s.color }} />
          <p className="mt-3 text-[13px]">{s.name}</p>
        </div>
        <div className="flex flex-col p-5 text-[12px] leading-[1.8]" style={{ background: IX.dark, color: "rgba(255,255,255,0.7)" }}>
          <p className="t-label t-tag font-[family-name:var(--font-case-sans)]" style={{ color: IX.ash }}>/api/brand.json</p>
          <p className="mt-4">{"{"}</p>
          <p className="pl-4">&quot;service&quot;: &quot;{s.key}&quot;,</p>
          <motion.p key={s.key + "js"} {...flash} className="pl-4">
            &quot;accent&quot;: &quot;<span style={{ color: s.color }}>{s.color}</span>&quot;
          </motion.p>
          <p>{"}"}</p>
        </div>
        <div className="p-5" style={{ background: IX.white, color: IX.dark }}>
          <p className="t-label t-tag font-[family-name:var(--font-case-sans)]" style={{ color: IX.ash }}>Deck · Gantt</p>
          <div className="mt-6 h-3 w-full" style={{ background: "rgba(10,10,10,0.06)" }}>
            <motion.div className="h-full" animate={{ background: s.color, width: ["20%", "68%"] }} transition={{ duration: 0.9, ease: IX_EXPO }} key={s.key + "g"} />
          </div>
        </div>
        <div className="p-5" style={{ background: IX.mid, color: IX.dark }}>
          <p className="t-label t-tag font-[family-name:var(--font-case-sans)]" style={{ color: IX.ash }}>Deck · portada</p>
          <motion.p key={s.key + "ey"} {...flash} className="mt-5 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: s.color === IX.opal ? IX.ashDark : s.color }}>
            {s.name}
          </motion.p>
          <p className="mt-1 text-[20px] font-light leading-tight" style={serif}>
            Propuesta de colaboración
          </p>
        </div>
      </div>
    </div>
  );
}

/* Vocabulario prohibido real (lib/tokens.ts, forbiddenVocabularyDetailed): 48 conceptos. «Caso de éxito»
   también está en la lista. */
const SENTENCE = [
  { t: "Ofrecemos " },
  { t: "soluciones", bad: true },
  { t: " " },
  { t: "innovadoras", bad: true },
  { t: " con una visión " },
  { t: "360", bad: true },
  { t: " para " },
  { t: "empoderar", bad: true },
  { t: " a tu equipo." },
];
const REWRITE = "Revisamos cómo decide hoy tu equipo y proponemos dos cambios que se pueden medir en tres meses.";

export function ToneCheck() {
  const [fixed, setFixed] = useState(false);
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setFixed((f) => !f), 3400);
    return () => clearInterval(id);
  }, [on, reduce]);
  return (
    <div ref={ref} className={`p-6 md:p-12 ${ixFonts}`} style={{ background: IX.light, color: IX.dark }}>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em]" style={{ ...mono, color: IX.ash }}>
        <span>Validador de tono</span>
        <span style={{ color: fixed ? IX.emerald : IX.bordeaux }}>{fixed ? "Pasa" : "4 términos prohibidos"}</span>
      </div>
      <div className="mt-8 min-h-[8rem] md:min-h-[9rem]">
        <AnimatePresence mode="wait">
          {!fixed ? (
            <motion.p key="bad" className="text-[1.6rem] font-light leading-snug md:text-[2.4rem]" style={serif} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {SENTENCE.map((w, k) =>
                w.bad ? (
                  <span key={k} className="relative" style={{ color: IX.bordeaux, textDecoration: `underline wavy ${IX.bordeaux}`, textUnderlineOffset: "6px", textDecorationThickness: "1.5px" }}>
                    {w.t}
                  </span>
                ) : (
                  <span key={k}>{w.t}</span>
                )
              )}
            </motion.p>
          ) : (
            <motion.p key="good" className="text-[1.6rem] font-light leading-snug md:text-[2.4rem]" style={serif} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {REWRITE}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-8 font-[family-name:var(--font-case-sans)] t-small" style={{ color: IX.ash }}>
        48 conceptos prohibidos con todas sus formas, en castellano e inglés. Entre ellos, «caso de éxito».
      </p>
    </div>
  );
}

const WORDS =
  "La propuesta parte de una pregunta sencilla: qué decide hoy el equipo y con qué información. A partir de ahí, tres semanas de escucha, un prototipo que se prueba con quien usa el servicio y una medida acordada desde el principio para saber si el cambio ha funcionado de verdad.".split(" ");

/** FitText: el párrafo crece y el cuerpo baja lo justo para no salirse nunca de la banda 64–656. */
export function FitTextDemo() {
  const [n, setN] = useState(12);
  const text = useRef<HTMLParagraphElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setN((k) => (k >= WORDS.length ? 12 : k + 3)), 380);
    return () => clearInterval(id);
  }, [on, reduce]);
  useLayoutEffect(() => {
    const el = text.current;
    if (!el) return;
    let s = 96; // display de la marca (--t-display): con el texto largo tiene que bajar para caber
    el.style.fontSize = `${s}px`;
    while (el.scrollHeight > 592 && s > 18) {
      s -= 1;
      el.style.fontSize = `${s}px`;
    }
    // El cuerpo resultante se escribe directamente en la etiqueta (sin estado: es una medida del DOM).
    if (label.current) label.current.textContent = `${s} px`;
  }, [n]);
  return (
    <div ref={ref} className={ixFonts}>
      <Slide>
        {/* La banda de texto de la retícula: 64–656 */}
        <span className="absolute inset-x-0 top-[64px] h-[592px]" style={{ background: "rgba(153,51,95,0.05)", boxShadow: `inset 0 1px 0 ${IX.bordeaux}55, inset 0 -1px 0 ${IX.bordeaux}55` }} />
        <p className="absolute left-[24px] top-[52px] text-[10px] uppercase tracking-[0.08em]" style={{ color: IX.bordeaux }}>64</p>
        <p className="absolute left-[24px] top-[660px] text-[10px] uppercase tracking-[0.08em]" style={{ color: IX.bordeaux }}>656</p>
        <p ref={text} className="absolute left-[108px] right-[108px] top-[64px] font-light leading-[1.18]" style={{ ...serif, fontSize: 96 }}>
          {WORDS.slice(0, n).join(" ")}
        </p>
        <p ref={label} className="absolute bottom-[20px] right-[108px] text-[11px] uppercase tracking-[0.08em]" style={{ color: IX.ash }}>
          96 px
        </p>
      </Slide>
    </div>
  );
}
