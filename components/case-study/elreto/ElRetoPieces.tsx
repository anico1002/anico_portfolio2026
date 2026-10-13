"use client";

import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Onest, Unbounded } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Piezas de El Reto (plataforma gamificada del concurso online de MasterChef World), recreadas con su UI kit
   real (src/ui-kit.css del repo ElReto-app-2026-Lovable): naranja #FC6B37, degradado #F3AD68 → #FC6B37,
   tarjeta de puntos #E8673A, fondo negro, Unbounded + Onest. Textos de la app (es.json); puntuaciones y
   pasos de receta de ejemplo. */

export const R = { orange: "#FC6B37", peach: "#F3AD68", card: "#E8673A", bg: "#000000", surface: "#121212", line: "#262626" } as const;
export const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-reto-display" });
export const onest = Onest({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-reto-text" });
export const retoFonts = `${unbounded.variable} ${onest.variable}`;
const DISPLAY = { fontFamily: "var(--font-reto-display), sans-serif" } as const;
const TEXT = { fontFamily: "var(--font-reto-text), sans-serif" } as const;
const GRAD = `linear-gradient(204deg, ${R.peach} -41.71%, ${R.orange} 100.92%)`;

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

/** La marca: círculos concéntricos y cuatro brillos que derivan detrás del logo (AnimatedGlow de la app). */
export function BrandGlow() {
  const reduce = useReduce();
  const blobs = [
    { c: R.orange, x: "18%", y: "30%", dx: 60, dy: 40, d: 12 },
    { c: R.peach, x: "70%", y: "25%", dx: -50, dy: 50, d: 14 },
    { c: "#B8401A", x: "60%", y: "75%", dx: 40, dy: -40, d: 16 },
    { c: R.orange, x: "30%", y: "80%", dx: -40, dy: -30, d: 10 },
  ];
  return (
    <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden" style={{ background: R.bg }}>
      {blobs.map((b, k) => (
        <motion.span
          key={k}
          aria-hidden
          className="absolute h-[45%] w-[30%] rounded-full opacity-50 blur-[60px]"
          style={{ left: b.x, top: b.y, background: `radial-gradient(circle, ${b.c}, transparent 70%)`, translateX: "-50%", translateY: "-50%" }}
          animate={reduce ? undefined : { x: [0, b.dx, 0], y: [0, b.dy, 0] }}
          transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maqueta/elreto/brand/concentric-circles.svg" alt="" className="absolute h-[140%] w-auto opacity-40" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maqueta/elreto/brand/logo-elreto-vertical.svg" alt="El Reto" className="relative w-[22%]" />
    </div>
  );
}

const EVENTS = [
  { v: 30, label: "Mini reto del día, acertado" },
  { v: 1, label: "Like en tu vídeo" },
  { v: 100, label: "Desafío semanal a tiempo" },
  { v: 50, label: "SuperLike recibido" },
  { v: 2, label: "Mini reto, fallado" },
  { v: 1, label: "Like en tu vídeo" },
];

/** La energía: la tarjeta de puntos que suma y sube de nivel cada 500. */
export function EnergyCard() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  // Un solo contador: de él salen el evento y los puntos (nada de actualizar un estado dentro de otro).
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setK((i) => i + 1), 1700);
    return () => clearInterval(id);
  }, [on, reduce]);
  const ev = k > 0 ? EVENTS[(k - 1) % EVENTS.length] : null;
  let pts = 1840;
  for (let i = 0; i < k; i++) pts = pts + EVENTS[i % EVENTS.length].v > 2240 ? 1840 : pts + EVENTS[i % EVENTS.length].v;
  const level = Math.floor(pts / 500) + 1;
  const into = pts % 500;
  return (
    <div ref={ref} className="mx-auto w-full max-w-[24rem] rounded-[2.6rem] p-3" style={{ background: "#1a1a1a" }}>
      <div className="min-h-[30rem] rounded-[2.1rem] px-5 pb-6 pt-8 text-white" style={{ background: R.bg, ...TEXT }}>
        <p className="text-[22px] font-bold" style={DISPLAY}>
          El Reto
        </p>
        <div className="relative mt-5 overflow-hidden rounded-[1.6rem] p-5" style={{ background: R.card }}>
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-white/85">Tu puntuación</p>
            <span className="rounded-full bg-black px-3 py-1 text-[12px] font-semibold">⚡ Energía</span>
          </div>
          <p className="mt-2 text-[44px] font-black leading-none tabular-nums" style={DISPLAY}>
            {pts.toLocaleString("es-ES")}
          </p>
          <p className="mt-3 text-[13px] text-white/85">Transferir mis puntos ›</p>
          <AnimatePresence>
            {ev && (
              <motion.span
                key={k}
                className="absolute right-5 top-14 text-[20px] font-bold"
                style={DISPLAY}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, -14, -26] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                +{ev.v} ⚡
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-[13px]">
            <span className="font-semibold">Nivel {level}</span>
            <span className="text-white/60">{500 - into} pts para nivel {level + 1}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: R.line }}>
            <motion.div className="h-full rounded-full" style={{ background: GRAD }} animate={{ width: `${(into / 500) * 100}%` }} transition={{ duration: DUR.base, ease: EASE.out }} />
          </div>
        </div>
        <div className="mt-5 min-h-[3rem] rounded-[1rem] p-4 text-[13px]" style={{ background: R.surface }}>
          <AnimatePresence mode="wait">
            <motion.p key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {ev ? ev.label : "Mini reto del día"}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-3 rounded-full py-4 text-center text-[15px] font-semibold" style={{ background: GRAD }}>
          Completa tu casting
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Prepara los ingredientes", "Corta la cebolla en brunoise", "Sofríe a fuego medio", "Añade el arroz", "Emplata"];

/** Sigue al chef, en directo: el paso con su cronómetro, que se pone rojo si te pasas, y la foto obligatoria. */
export function ChefLive() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  // Un solo contador de pasos de reloj; de él salen el paso, el tiempo y la foto.
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setN((x) => x + 1), 110);
    return () => clearInterval(id);
  }, [on, reduce]);
  const CYCLE = 28; // de 2:30 a 4:22, de 4 en 4 segundos
  const t = 150 + (n % CYCLE) * 4;
  const step = (2 + Math.floor(n / CYCLE)) % STEPS.length;
  const photo = t >= 246;
  const limit = 240;
  const over = t > limit;
  const mm = (v: number) => `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
  return (
    <div ref={ref} className="mx-auto w-full max-w-[24rem] rounded-[2.6rem] p-3" style={{ background: "#1a1a1a" }}>
      <div className="relative min-h-[30rem] overflow-hidden rounded-[2.1rem] text-white" style={{ background: R.bg, ...TEXT }}>
        <div className="flex aspect-video items-center justify-center" style={{ background: "linear-gradient(135deg,#2a1a12,#120b08)" }}>
          <span className="rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: R.orange }}>● EN DIRECTO</span>
        </div>
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between text-[13px] text-white/60">
            <span>Sigue al chef</span>
            <span className="tabular-nums">{step + 1}/8</span>
          </div>
          <p className="mt-2 text-[20px] font-bold leading-tight" style={DISPLAY}>
            Paso {step + 1}: {STEPS[step]}
          </p>
          <p className="mt-4 text-[34px] font-black tabular-nums transition-colors" style={{ ...DISPLAY, color: over ? "#ef4444" : "#fff" }}>
            {mm(t)} <span className="text-[16px] font-normal text-white/50">/ {mm(limit)}</span>
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-[1rem] p-4 text-[14px]" style={{ background: R.surface }}>
            <span>📷</span>
            <span>Foto obligatoria</span>
          </div>
          <p className="mt-3 text-[13px] text-white/60">💡 Tips: no dejes que se dore demasiado.</p>
        </div>
        <AnimatePresence>
          {photo && (
            <motion.div
              className="absolute inset-x-5 bottom-5 rounded-[1rem] px-4 py-3 text-[14px] font-semibold"
              style={{ background: "#fff", color: "#000" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: DUR.fast, ease: EASE.out }}
            >
              📸 ¡Foto subida!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const FUNNEL = [
  { name: "Registro", note: "Abierto a todos los residentes en España mayores de 18", w: 1 },
  { name: "Vídeo de presentación", note: "Activa la Manopla Digital", w: 0.84 },
  { name: "Caja Misteriosa", note: "Solo los mejores 1.000", w: 0.66 },
  { name: "Evento presencial", note: "Solo el Top 100", w: 0.5 },
  { name: "MasterChef Experience", note: "Solo el Top 5", w: 0.38 },
];

function FunnelRow({ f, k, p }: { f: (typeof FUNNEL)[number]; k: number; p: MotionValue<number> }) {
  const w = useTransform(p, [0.1 + k * 0.13, 0.22 + k * 0.13], ["100%", `${f.w * 100}%`]);
  const o = useTransform(p, [0.05 + k * 0.13, 0.15 + k * 0.13], [0.25, 1]);
  return (
    <motion.div style={{ opacity: o }} className="flex flex-col items-center">
      <motion.div className="flex h-14 items-center justify-center rounded-full px-6 text-white md:h-16" style={{ width: w, background: k === FUNNEL.length - 1 ? GRAD : `rgba(252,107,55,${0.25 + k * 0.15})`, ...DISPLAY }}>
        <span className="whitespace-nowrap text-[12px] font-bold md:text-[15px]">{f.name}</span>
      </motion.div>
      <p className="mt-2 text-center t-small text-[var(--case-muted)]">{f.note}</p>
    </motion.div>
  );
}

/** El embudo del concurso, de la inscripción al Top 5, estrechándose con el scroll. */
export function Funnel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[240vh]"}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center px-4 py-20 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <div className="col-span-12 md:col-span-4">
            <p className="t-label t-tag text-[var(--case-muted)]">03 · El concurso</p>
            <p className="mt-4 t-statement">De miles de inscritos a quince aspirantes.</p>
            <p className="mt-6 t-body text-[var(--case-muted)]">
              Cuatro fases y un ranking en tiempo real. Si lo logras, llegas al último casting televisado, donde solo 15
              aspirantes se ganan su lugar en MasterChef.
            </p>
          </div>
          <div className="col-span-12 space-y-4 md:col-span-7 md:col-start-6">
            {FUNNEL.map((f, k) => (
              <FunnelRow key={f.name} f={f} k={k} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Una base de código, dos superficies: la web de escritorio y la app móvil con la misma pieza. */
export function DualSurface() {
  const card = (big: boolean) => (
    <div className="rounded-[1.2rem] p-4 text-white" style={{ background: R.card, ...TEXT }}>
      <p className="text-[12px] text-white/85">Tu puntuación</p>
      <p className={`font-black leading-none ${big ? "text-[40px]" : "text-[30px]"}`} style={DISPLAY}>
        1.890
      </p>
    </div>
  );
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:justify-center md:gap-10">
      <div className="w-full max-w-[38rem] overflow-hidden rounded-[0.8rem] ring-1 ring-white/10" style={{ background: R.bg }}>
        <div className="flex h-8 items-center gap-1.5 px-3" style={{ background: "#1a1a1a" }}>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="col-span-2 text-white" style={TEXT}>
            <p className="text-[24px] font-black leading-tight" style={DISPLAY}>
              Enciende los fogones
            </p>
            <p className="mt-2 text-[13px] text-white/60">Inscríbete en la web. El casting se graba en la app.</p>
            <span className="mt-4 inline-block rounded-full px-5 py-2.5 text-[13px] font-semibold" style={{ background: GRAD }}>
              Únete a El Reto
            </span>
          </div>
          {card(true)}
        </div>
      </div>
      <div className="w-[12rem] rounded-[2rem] p-2" style={{ background: "#1a1a1a" }}>
        <div className="space-y-3 rounded-[1.6rem] p-3 pb-6 pt-6" style={{ background: R.bg }}>
          {card(false)}
          <div className="rounded-[1rem] p-3 text-[12px] text-white" style={{ background: R.surface, ...TEXT }}>
            🎬 Casting App — Fase 0
          </div>
        </div>
      </div>
    </div>
  );
}
