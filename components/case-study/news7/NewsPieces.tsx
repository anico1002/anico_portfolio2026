"use client";

import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FadeIn } from "@/components/case-study/primitives";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Piezas de 7news (lector de noticias nativo para iPhone y Apple Watch), recreadas a partir del repo 7News:
   README, docs/DECISIONES.md y la splash real. Sin IA ni noticias generadas: un lector de feeds que decide
   cuándo has terminado. Tipografía del sistema (New York para los titulares, como la app). */

const INK = "#0A0A0B";
const SERIF = { fontFamily: 'ui-serif, "New York", "Iowan Old Style", Georgia, serif' } as const;

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

/** El logo como barra de carga (SplashView.swift): al 20 % de opacidad y relleno de izquierda a derecha
    con el progreso real, en corte limpio. Aquí, en bucle mientras se ve. */
export function LogoLoader() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  return (
    <div ref={ref} className="relative flex aspect-[16/9] items-center justify-center overflow-hidden" style={{ background: INK }}>
      <div className="relative w-[46%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/maqueta/7news/brand/7news-logo.svg" alt="7news" className="w-full opacity-20" />
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={on && !reduce ? { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)"] } : { clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 3.2, times: [0, 0.75, 1], repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/7news/brand/7news-logo.svg" alt="" className="w-full" />
        </motion.div>
      </div>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] text-white/50">Actualizando noticias</p>
    </div>
  );
}

const HEAD = ["Lo que cambia", "Cinco claves", "Así será", "Por qué importa", "El nuevo estándar", "Qué hay detrás", "Lo último", "Todo sobre", "La guía", "Un año después"];
const TOPIC = ["la interfaz", "el diseño", "la tipografía", "los móviles", "la web", "la IA", "el producto", "las marcas", "el color", "los iconos"];

const RULES = [
  { at: 0.18, label: "Solo las últimas 48 horas" },
  { at: 0.36, label: "Como mucho 3 por fuente" },
  { at: 0.54, label: "La misma noticia en varios medios, una vez" },
  { at: 0.7, label: "Fuera las palabras silenciadas" },
];

/** Un titular del muro: se apaga en su tramo del scroll salvo las pocas noticias que sobreviven. */
function Headline({ t, k, p, keep }: { t: string; k: number; p: MotionValue<number>; keep: boolean }) {
  const opacity = useTransform(p, [0.12 + (k % 13) * 0.045, 0.16 + (k % 13) * 0.045], [0.85, keep ? 0.85 : 0.04]);
  return (
    <motion.p className="mb-3 break-inside-avoid text-[15px] leading-snug" style={{ ...SERIF, opacity }}>
      {t}
    </motion.p>
  );
}

/** De 678 a 32: el muro infinito se va vaciando regla a regla con el scroll hasta «Ya estás al día». Las
    cifras de los extremos son las medidas en el repo; los titulares, de relleno. */
export function DayEnds() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [n, setN] = useState(678);
  const [done, setDone] = useState(0);
  useEffect(
    () =>
      p.on("change", (v) => {
        const t = Math.min(1, Math.max(0, (v - 0.12) / 0.66));
        setN(Math.round(678 - (678 - 32) * (1 - Math.pow(1 - t, 2))));
        setDone(RULES.filter((r) => v >= r.at).length);
      }),
    [p]
  );
  const end = useTransform(p, [0.8, 0.9], [0, 1]);
  const items = Array.from({ length: 60 }, (_, k) => `${HEAD[k % HEAD.length]} de ${TOPIC[(k * 7) % TOPIC.length]}`);
  const keep = (k: number) => k % 19 === 0; // las pocas que sobreviven

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[280vh]"}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center px-4 py-20 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <div className="col-span-12 md:col-span-4">
            <p className="t-label t-tag text-[var(--case-muted)]">El día se acaba</p>
            <p className="mt-4 t-d3 tabular-nums">{n}</p>
            <p className="mt-2 t-small text-[var(--case-muted)]">noticias hoy</p>
            <ol className="mt-10 space-y-3">
              {RULES.map((r, k) => (
                <li key={r.label} className="flex items-center gap-3 t-small transition-opacity duration-500" style={{ opacity: done > k ? 1 : 0.3 }}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px]">{done > k ? "✓" : k + 1}</span>
                  {r.label}
                </li>
              ))}
            </ol>
          </div>
          <div className="relative col-span-12 h-[60vh] overflow-hidden md:col-span-7 md:col-start-6" style={{ background: INK, color: "#fff" }}>
            <div className="columns-2 gap-6 p-6 md:columns-3 md:p-8">
              {items.map((t, k) => (
                <Headline key={k} t={t} k={k} p={p} keep={keep(k)} />
              ))}
            </div>
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ opacity: end, background: INK }}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white text-2xl">✓</span>
              <p className="text-[28px] font-semibold">Ya estás al día</p>
              <p className="text-[15px] text-white/60">No queda nada nuevo en Diseño.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CANDIDATES = [
  { name: "iAbogado", why: "No habla de IA: casa por texto", ok: false },
  { name: "Fuente sobre IA aplicada", why: "~3 al día · se lee dentro", ok: true },
  { name: "IABARONI EN LA COCINA", why: "No habla de IA: casa por texto", ok: false },
  { name: "Blog de investigación", why: "~1 al día · se lee dentro", ok: true },
  { name: "Agregador de 40 al día", why: "Sin línea editorial", ok: false },
  { name: "Newsletter de producto", why: "~2 al día · se lee dentro", ok: true },
  { name: "Blog parado desde junio", why: "Sin actividad real", ok: false },
  { name: "Medio de tecnología", why: "~3 al día · se lee dentro", ok: true },
  { name: "Feed solo con resúmenes", why: "No se puede leer dentro", ok: false },
  { name: "Laboratorio de diseño", why: "~1 al día · se lee dentro", ok: true },
  { name: "Podcast transcrito", why: "~1 al día · se lee dentro", ok: true },
  { name: "Revista de cultura digital", why: "~2 al día · se lee dentro", ok: true },
];

/** Crear un tema: se escribe «IA», aparecen candidatos y los filtros reales los cribán hasta quedarse con 7. */
export function TopicBuilder() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  const [typed, setTyped] = useState("IA");
  const [shown, setShown] = useState(CANDIDATES.length);
  const [judged, setJudged] = useState(true);
  useEffect(() => {
    if (!on || reduce) return;
    let alive = true;
    const t: number[] = [];
    const wait = (ms: number) => new Promise((r) => t.push(window.setTimeout(r, ms)));
    (async () => {
      while (alive) {
        setTyped("");
        setShown(0);
        setJudged(false);
        await wait(600);
        setTyped("I");
        await wait(220);
        setTyped("IA");
        await wait(600);
        for (let k = 1; k <= CANDIDATES.length && alive; k++) {
          setShown(k);
          await wait(160);
        }
        await wait(500);
        setJudged(true);
        await wait(3600);
      }
    })();
    return () => {
      alive = false;
      t.forEach(clearTimeout);
    };
  }, [on, reduce]);
  const kept = CANDIDATES.filter((c) => c.ok).length;
  return (
    <div ref={ref} className="mx-auto w-full max-w-[30rem] rounded-[2.4rem] p-3" style={{ background: "#1c1c1e" }}>
      <div className="min-h-[34rem] rounded-[1.9rem] px-5 pb-6 pt-8 text-white" style={{ background: INK }}>
        <p className="text-[28px] font-bold">Temas</p>
        <div className="mt-4 rounded-[0.8rem] bg-white/10 px-4 py-3 text-[15px]">
          {typed ? <span>{typed}</span> : <span className="text-white/40">Crear un tema: IA, tipografía, cine…</span>}
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#6366f1]" />
        </div>
        <p className="mt-4 min-h-[1.2em] text-[13px] text-white/60">
          {shown === 0 ? "" : !judged ? "Buscando fuentes de IA…" : `IA: ${kept} fuentes listas.`}
        </p>
        <ul className="mt-3 space-y-1.5">
          <AnimatePresence>
            {CANDIDATES.slice(0, shown).map((c) => (
              <motion.li
                key={c.name}
                className="flex items-baseline justify-between gap-3 text-[14px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: judged && !c.ok ? 0.35 : 1, y: 0 }}
                transition={{ duration: DUR.fast, ease: EASE.out }}
              >
                <span className={judged && !c.ok ? "line-through" : ""}>{c.name}</span>
                <span className="shrink-0 text-[11px] text-white/50">{judged ? c.why : ""}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

const VS = [
  ["Final de la sesión", "Scroll infinito", "«Ya estás al día»"],
  ["Antigüedad", "De hoy o de hace tres meses, no se sabe", "Ventana de 48 horas"],
  ["Quien publica mucho", "Entierra al resto", "Tope de 3 por fuente"],
  ["La misma noticia en 6 medios", "Seis entradas", "Una, con «también en…»"],
  ["Abrir una noticia", "Te saca a la web del medio", "Lector propio, misma tipografía siempre"],
  ["Avisos", "Ninguno en el reloj", "Notificación reflejada en el Watch"],
];

/** Feedly frente a 7news: la tabla del README, fila a fila. */
export function VersusTable() {
  return (
    <div className="border-t border-[var(--case-line)]">
      <div className="grid grid-cols-12 gap-x-4 py-3 t-label t-tag text-[var(--case-muted)] md:gap-x-6">
        <span className="col-span-4" />
        <span className="col-span-4">Un lector cualquiera</span>
        <span className="col-span-4">7news</span>
      </div>
      {VS.map(([k, a, b], i) => (
        // FadeIn y no `whileInView`: en Safari este no se dispara al llegar navegando (ver NOTES).
        <FadeIn key={k} delay={i * 0.06} className="grid grid-cols-12 gap-x-4 border-t border-[var(--case-line)] py-5 md:gap-x-6">
          <span className="col-span-12 t-small text-[var(--case-muted)] md:col-span-4">{k}</span>
          <span className="col-span-6 mt-2 t-body text-[var(--case-muted)] line-through decoration-1 md:col-span-4 md:mt-0">{a}</span>
          <span className="col-span-6 mt-2 t-body md:col-span-4 md:mt-0" style={SERIF}>
            {b}
          </span>
        </FadeIn>
      ))}
    </div>
  );
}

/** Del iPhone a la muñeca: la notificación local «3 cosas nuevas» y su reflejo en el Apple Watch. */
export function WristNotice() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  const [stage, setStage] = useState(2);
  useEffect(() => {
    if (!on || reduce) return;
    let alive = true;
    const t: number[] = [];
    const wait = (ms: number) => new Promise((r) => t.push(window.setTimeout(r, ms)));
    (async () => {
      while (alive) {
        setStage(0);
        await wait(700);
        setStage(1);
        await wait(1800);
        setStage(2);
        await wait(3200);
      }
    })();
    return () => {
      alive = false;
      t.forEach(clearTimeout);
    };
  }, [on, reduce]);
  const lines = "Lo que cambia en la web · Cinco claves de tipografía · El nuevo estándar de iconos";
  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-10 py-6 md:flex-row md:gap-24">
      {/* iPhone: la notificación */}
      <div className="relative h-[30rem] w-[15rem] overflow-hidden rounded-[2.6rem] border-[8px] border-[#1c1c1e] bg-gradient-to-b from-[#2b2f4a] to-[#0d0f1a]">
        <p className="mt-16 text-center text-[52px] font-semibold text-white/90">9:41</p>
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              className="absolute inset-x-3 top-44 rounded-[1.2rem] bg-white/80 p-3 text-[12px] text-black backdrop-blur-xl"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.fast, ease: EASE.out }}
            >
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-black/60">
                <span className="h-4 w-4 rounded-[4px]" style={{ background: INK }} /> 7NEWS
              </p>
              <p className="mt-1 font-semibold">3 cosas nuevas</p>
              <p className="mt-0.5 leading-snug text-black/70">{lines}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Apple Watch: el reflejo */}
      <div className="relative h-[13rem] w-[11rem] rounded-[2.8rem] border-[7px] border-[#1c1c1e] bg-black p-3">
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              className="text-white"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.base, ease: EASE.out }}
            >
              <p className="text-[11px] font-semibold text-white/60">7news</p>
              <p className="mt-1 text-[15px] font-semibold leading-tight">3 cosas nuevas</p>
              <p className="mt-1 text-[11px] leading-snug text-white/70">{lines}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
