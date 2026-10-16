"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Arrow from "@/components/case-study/Arrow";
import { FadeIn, Parallax } from "@/components/case-study/primitives";
import RealPhone from "@/components/case-study/RealPhone";
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
      <div className="relative col-span-12 flex flex-col justify-between p-6 md:col-span-5 md:p-9" style={{ background: IX.dark, color: IX.light, ...mono }}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: IX.ash }}>
            [Directiva de imagen corporativa]
          </p>
          <dl className="mt-7 space-y-4 text-[13px] leading-[1.7]">
            {BODY.map(([k, d]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3">
                <dt style={{ color: IX.ash }}>{k}</dt>
                <dd style={{ color: "rgba(255,255,255,0.82)" }}>{d}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[6.5rem_1fr] gap-3">
              <dt style={{ color: IX.ash }}>Sujeto</dt>
              <dd className="min-h-[7.5em]">
                <AnimatePresence mode="wait">
                  <motion.div key={v} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.45, ease: IX_EXPO }}>
                    {s.lines.map((l, i) => (
                      <p key={l} style={{ color: i ? "#e3a5bf" : "rgba(255,255,255,0.82)" }} className={i ? "mt-2" : ""}>
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
                borderColor: k === v ? IX.light : "rgba(255,255,255,0.2)",
                background: k === v && press ? IX.light : "transparent",
                color: k === v && press ? IX.dark : k === v ? IX.light : IX.ash,
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
              style={{ background: IX.light, color: IX.dark }}
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
          <p className="text-[15px] font-medium">
            {t}
          </p>
          <p className="mt-3 t-small text-[var(--case-muted)] md:max-w-[32ch]">{d}</p>
        </FadeIn>
      ))}
    </div>
  );
}

/* ── El manual en la web: MacBook real y la versión móvil ───────────────────────────────────────────
   Portátil: foto de Unsplash (photo-1526925712774, consola blanca, frontal) pasada a monocromo cálido de la marca
   para que solo la pantalla tenga color (mockups-src/mac-console). Al ser casi frontal, el vídeo del manual va
   encima en CSS, en la pantalla medida sobre la foto. Móvil: el manual grabado a 393 px dentro del iPhone
   recortado de iphone-mockups.com sobre el cálido de la marca (receta scripts/mockups/recetas/ix-movil.json). */

/** Pantalla dentro de scene-mac.jpg, en % (izquierda, arriba, ancho, alto). */
const MAC_SCREEN = { l: 29.13, t: 21.56, w: 41.97, h: 43.9 };

function PlayInView({ src, poster, className, style }: { src: string; poster: string; className: string; style?: React.CSSProperties }) {
  const vid = useRef<HTMLVideoElement>(null);
  const { ref, on } = useInView<HTMLDivElement>();
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (on) v.play().catch(() => {});
    else v.pause();
  }, [on]);
  return (
    <div ref={ref} className={className} style={style}>
      <video ref={vid} src={src} poster={poster} muted loop playsInline preload="none" className="h-full w-full object-cover object-top" />
    </div>
  );
}

/* Encuadre (feedback 2026-10-16: «se ve más el fondo que el contenido»). La foto entera es el «escenario» y
   se amplía dentro de un marco que recorta: el portátil ocupa ~66 % del ancho en escritorio (marco 16:9) y
   ~87 % en móvil (marco cuadrado). Las medidas van en cqw (ancho del marco) para que el escenario conserve su
   proporción. Centro del portátil en la foto: 50,5 % × 46 %. */
export function WebLaptop() {
  return (
    <div className="m-bleed relative aspect-square overflow-hidden md:aspect-video" style={{ containerType: "inline-size" }}>
      <div className="absolute left-[-35.85cqw] top-0 w-[170cqw] md:left-[-15.65cqw] md:top-[-9.5cqw] md:w-[130cqw]" style={{ aspectRatio: "2400 / 1429" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/maqueta/interactius/scene-mac.jpg" alt="" className="absolute inset-0 h-full w-full" loading="lazy" />
        <PlayInView
          src="/maqueta/interactius/media/web.mp4"
          poster="/maqueta/interactius/media/web-poster.jpg"
          className="absolute overflow-hidden"
          style={{ left: `${MAC_SCREEN.l}%`, top: `${MAC_SCREEN.t}%`, width: `${MAC_SCREEN.w}%`, height: `${MAC_SCREEN.h}%` }}
        />
      </div>
      {/* La web de verdad, centrado abajo sobre la foto (el manual no se enlaza: Interactius no lo ha hecho público) */}
      <a
        href="https://www.interactius.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-3 whitespace-nowrap px-6 py-4 t-small transition-opacity hover:opacity-85 md:bottom-8"
        style={{ background: IX.dark, color: IX.light }}
      >
        Ver la web <Arrow />
      </a>
    </div>
  );
}

/* Móvil volandero (feedback 2026-10-16, como el de Gloop): sin fondo, inclinado, y sube con parallax desde abajo
   hasta montarse sobre el borde inferior de la foto del MacBook. El texto va pegado a la foto. */
export function WebPhone() {
  return (
    <div className="relative z-10 grid grid-cols-12 gap-x-4 md:gap-x-6">
      <FadeIn className="col-span-7 mt-8 md:col-span-3 md:col-start-2 md:mt-12">
        <p className="t-body text-[var(--case-muted)]">Y en el móvil, la misma marca: la retícula se recompone y la letra mantiene su escala.</p>
      </FadeIn>
      <Parallax speed={320} className="col-span-5 -mt-24 md:col-span-3 md:col-start-9 md:-mt-[22rem]">
        <div className="mx-auto w-full max-w-[300px] rotate-[14deg] drop-shadow-[0_40px_50px_rgba(10,10,10,0.35)]">
          <RealPhone src="/maqueta/interactius/media/web-movil.mp4" label="La web de Interactius en el móvil" />
        </div>
      </Parallax>
    </div>
  );
}

/* ── El manual de marca: una ventana de navegador limpia, sin dispositivo (para no repetir el portátil de la web)
   y sin enlace ni dirección, porque Interactius no lo ha hecho público. ─────────────────────────────────────── */
export function ManualWindow() {
  return (
    <div className="m-bleed px-4 py-14 md:px-16 md:py-24" style={{ background: IX.mid }}>
      <FadeIn>
        <div className="mx-auto max-w-[68rem] overflow-hidden rounded-[10px] shadow-[0_40px_90px_-40px_rgba(10,10,10,0.55)] ring-1 ring-black/10">
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: IX.light }}>
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="ml-4 text-[11px] uppercase tracking-[0.08em]" style={{ ...mono, color: IX.ash }}>
              Brand Guidelines 2026
            </span>
          </div>
          <PlayInView src="/maqueta/interactius/media/manual-web.mp4" poster="/maqueta/interactius/media/manual-web-poster.jpg" className="aspect-[16/10] w-full bg-white" />
        </div>
      </FadeIn>
    </div>
  );
}

/* ── DeckMakr a todo el ancho: la ventana de la herramienta con el editor y la diapositiva ─────────── */

export function DeckWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" style={{ background: "#000000", ...mono }}>
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 text-[12px] md:px-6" style={{ borderColor: "rgba(255,255,255,0.1)", color: IX.light }}>
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
          <span className="hidden border px-2.5 py-1 md:inline" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            Traducir
          </span>
          <span className="hidden border px-2.5 py-1 md:inline" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            PDF
          </span>
          <span className="border px-2.5 py-1" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            Copiar URL
          </span>
          <span className="px-2.5 py-1" style={{ background: IX.light, color: IX.dark }}>
            Guardar
          </span>
        </div>
      </div>
      <div className="p-3 md:p-6">{children}</div>
      {/* Texto nuestro, no de la herramienta: con la tipografía de la web, no con la mono de la ventana. */}
      <p className="px-4 pb-4 font-[family-name:var(--font-case-sans)] t-label t-tag md:px-6 md:pb-6" style={{ color: IX.ash }}>
        17 composiciones · tono auditado en vivo · exporta a PDF o a una URL
      </p>
    </div>
  );
}
