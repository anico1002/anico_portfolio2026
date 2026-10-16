"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { STAGGER } from "@/lib/maqueta/motion";
import { IX, IX_EXPO, mono } from "./tokens";

/* La capa «preparada para IA» de Interactius (2026-10-16, feedback de Alberto: contar el rediseño como una
   marca pensada también para la IA). Todo sale del repo interactius-brandguidelines: el prompt técnico de
   imagen y sus dos variantes (lib/prompts.ts; la estándar existe porque los generadores meten personas
   aunque no se pidan), los botones de copiar del manual (messages/es.json) y las herramientas del workspace
   (lib/workspace/catalog.ts). Las fotos son las de referencia del universo visual, no salidas del prompt. */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

/* ── Prompt de imagen: la dirección fotográfica, traducida a instrucciones que se copian ───────────── */

const BODY = [
  ["Película", "35 mm analógica, grano fino, color sutil de Kodak Portra 400."],
  ["Óptica", "Fija de 35 o 50 mm, profundidad de campo muy baja."],
  ["Luz", "Natural, lateral o difusa. Nada de estudio."],
  ["Obturación", "Lenta, de 1/15 a 1/60 s: un barrido, una estela de luz."],
] as const;

const SUBJECT = {
  standard: {
    label: "Estándar",
    lines: ["Espacios y objetos sin presencia humana: umbrales, pasillos, materiales y la luz que los atraviesa.", "Ninguna figura humana. Ni manos, ni siluetas, ni reflejos, ni sombras."],
    toast: "Prompt estándar copiado",
  },
  people: {
    label: "Personas",
    lines: ["Personas reales en entornos profesionales.", "Nunca posando, nunca mirando a cámara, nunca sonriendo de forma corporativa."],
    toast: "Prompt con personas copiado",
  },
} as const;

type Variant = keyof typeof SUBJECT;

export function ImagePrompt() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  const [v, setV] = useState<Variant>("standard");
  const [press, setPress] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!on || reduce) return;
    let alive = true;
    (async () => {
      let cur: Variant = "standard";
      while (alive) {
        setV(cur);
        await sleep(2600);
        if (!alive) return;
        setPress(true);
        await sleep(160);
        setPress(false);
        setToast(SUBJECT[cur].toast);
        await sleep(1900);
        setToast(null);
        await sleep(500);
        cur = cur === "standard" ? "people" : "standard";
      }
    })();
    return () => {
      alive = false;
    };
  }, [on, reduce]);

  const s = SUBJECT[v];

  return (
    <div ref={ref} className="grid grid-cols-12 gap-x-4 gap-y-4 md:gap-x-6">
      {/* Referencias del universo visual */}
      <div className="col-span-12 grid grid-cols-2 gap-1 md:col-span-7">
        {[1, 3, 2, 4].map((k, i) => (
          <FadeIn key={k} delay={i * STAGGER}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/maqueta/interactius/media/universo-0${k}.jpg`} alt="" loading="lazy" className="aspect-square w-full object-cover" />
          </FadeIn>
        ))}
      </div>

      {/* El prompt, como lo copia el manual */}
      <div className="relative col-span-12 flex flex-col justify-between p-6 md:col-span-5 md:p-9" style={{ background: IX.dark, color: IX.warmLight, ...mono }}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: IX.ash }}>
            [Directiva de imagen corporativa]
          </p>
          <dl className="mt-7 space-y-4 text-[13px] leading-[1.7]">
            {BODY.map(([k, d]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3">
                <dt style={{ color: IX.ash }}>{k}</dt>
                <dd style={{ color: "rgba(245,242,237,0.82)" }}>{d}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[6.5rem_1fr] gap-3">
              <dt style={{ color: IX.ash }}>Sujeto</dt>
              <dd className="min-h-[7.5em]">
                <AnimatePresence mode="wait">
                  <motion.div key={v} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.45, ease: IX_EXPO }}>
                    {s.lines.map((l, i) => (
                      <p key={l} style={{ color: i ? "#e3a5bf" : "rgba(245,242,237,0.82)" }} className={i ? "mt-2" : ""}>
                        {l}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {(Object.keys(SUBJECT) as Variant[]).map((k) => (
            <span
              key={k}
              className="border px-3 py-2 text-[11px] uppercase tracking-[0.08em] transition-colors duration-200"
              style={{
                borderColor: k === v ? IX.warmLight : "rgba(245,242,237,0.2)",
                background: k === v && press ? IX.warmLight : "transparent",
                color: k === v && press ? IX.dark : k === v ? IX.warmLight : IX.ash,
              }}
            >
              ↗ Copiar prompt · {SUBJECT[k].label}
            </span>
          ))}
        </div>
        <AnimatePresence>
          {toast && (
            <motion.p
              className="absolute right-6 top-6 px-4 py-2.5 text-[12px] md:right-9 md:top-9"
              style={{ background: IX.warmLight, color: IX.dark }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.35, ease: IX_EXPO }}
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── La capa para IA, entera: cada pieza con su versión para máquinas ──────────────────────────────── */

const LAYER = [
  ["Prompt maestro", "Se pega como instrucciones en un proyecto de IA y la marca queda cargada para todo lo que venga después."],
  ["llms.txt", "El manual completo en texto plano, listo para que lo lea cualquier modelo."],
  ["brand.json", "Colores, tipografía, voz y ejemplos en datos, para las herramientas propias."],
  ["Validador de tono", "Puntúa un texto de 0 a 100 y señala qué palabra o qué frase rompe la voz."],
  ["ReWritr", "Reescribe cualquier texto con la voz de la marca."],
  ["IMGr", "Un banco de imágenes que comprueba, criterio a criterio, si una foto encaja con la guía."],
] as const;

export function AiLayer() {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
      {LAYER.map(([t, d], k) => (
        <FadeIn key={t} delay={(k % 3) * STAGGER} className="col-span-12 border-t border-[var(--case-line)] pt-5 sm:col-span-6 md:col-span-4">
          <p className="t-title" style={k < 3 ? mono : undefined}>
            {t}
          </p>
          <p className="mt-3 t-small text-[var(--case-muted)] md:max-w-[32ch]">{d}</p>
        </FadeIn>
      ))}
    </div>
  );
}

/* ── El manual en la web, dentro de un portátil (marco provisional en CSS: la imagen la decide Alberto) ── */

export function ManualLaptop() {
  const vid = useRef<HTMLVideoElement>(null);
  const { ref, on } = useInView<HTMLDivElement>();
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (on) v.play().catch(() => {});
    else v.pause();
  }, [on]);
  return (
    <div ref={ref} className="mx-auto w-full max-w-[72rem]">
      <div className="rounded-t-[1.4rem] bg-[#0d0d0f] p-[1.4%] pb-[2%] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)] ring-1 ring-black/10">
        <div className="relative overflow-hidden rounded-[0.35rem] bg-[#F5F2ED]" style={{ aspectRatio: "16 / 10" }}>
          <video
            ref={vid}
            src="/maqueta/interactius/media/manual-web.mp4"
            poster="/maqueta/interactius/media/manual-web-poster.jpg"
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      </div>
      <div className="relative mx-[-6%] h-[1rem] rounded-b-[1.2rem] bg-gradient-to-b from-[#d4d6db] to-[#9a9ca2] md:h-[1.4rem]">
        <span className="absolute left-1/2 top-0 h-[40%] w-[14%] -translate-x-1/2 rounded-b-[0.6rem] bg-[#b1b3b9]" />
      </div>
    </div>
  );
}

/* ── DeckMakr a todo el ancho: la ventana de la herramienta con el editor y la diapositiva ─────────── */

export function DeckWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" style={{ background: "#0e0d0b", ...mono }}>
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 text-[12px] md:px-6" style={{ borderColor: "rgba(245,242,237,0.1)", color: IX.warmLight }}>
        <div className="flex items-center gap-4">
          <span style={{ color: IX.ash }}>←</span>
          <span className="text-[14px] font-medium">
            DeckMak<span style={{ color: IX.bordeaux }}>_</span>r
          </span>
          <span className="hidden md:inline" style={{ color: IX.ash }}>
            Propuesta · Cómo lo haremos
          </span>
        </div>
        <div className="flex items-center gap-2" style={{ color: IX.ash }}>
          <span className="hidden border px-2.5 py-1 md:inline" style={{ borderColor: "rgba(245,242,237,0.15)" }}>
            Traducir
          </span>
          <span className="hidden border px-2.5 py-1 md:inline" style={{ borderColor: "rgba(245,242,237,0.15)" }}>
            PDF
          </span>
          <span className="border px-2.5 py-1" style={{ borderColor: "rgba(245,242,237,0.15)" }}>
            Copiar URL
          </span>
          <span className="px-2.5 py-1" style={{ background: IX.warmLight, color: IX.dark }}>
            Guardar
          </span>
        </div>
      </div>
      <div className="p-3 md:p-6">{children}</div>
      <p className="px-4 pb-4 text-[11px] uppercase tracking-[0.08em] md:px-6 md:pb-6" style={{ color: IX.ash }}>
        17 composiciones · tono auditado en vivo · exporta a PDF o a una URL
      </p>
    </div>
  );
}
