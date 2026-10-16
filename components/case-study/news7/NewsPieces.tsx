"use client";

import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FadeIn } from "@/components/case-study/primitives";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Piezas de 7news (lector de noticias nativo para iPhone y Apple Watch), recreadas a partir del repo 7News:
   README, docs/DECISIONES.md y la splash real. Sin IA ni noticias generadas: un lector de feeds que decide
   cuándo has terminado. Tipografía del sistema (New York para los titulares, como la app). */

const INK = "#0A0A0B";

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

const RULES = [
  { at: 0.12, label: "Solo las últimas 48 horas" },
  { at: 0.22, label: "Como mucho 3 por fuente" },
  { at: 0.32, label: "La misma noticia en varios medios, una vez" },
  { at: 0.42, label: "Fuera las palabras silenciadas" },
];

/* Noticias reales del día (Tech, IA, Design y Apple), recortadas tal cual de las listas de la app en el
   simulador: imagen a la izquierda y texto a la derecha (`media/rows/nNN.jpg`, 580×182). */
const ROWS = Array.from({ length: 15 }, (_, k) => `/maqueta/7news/media/rows/n${String(k).padStart(2, "0")}.jpg`);
const ORDER = [9, 2, 13, 5, 0, 11, 7, 3, 14, 1, 8, 12, 4, 10, 6]; // en qué orden se apaga cada una (aleatorio fijo)

/** Una mini card del muro: se apaga en su momento del recorrido. */
function NewsRow({ src, k, p }: { src: string; k: number; p: MotionValue<number> }) {
  const at = 0.08 + (ORDER.indexOf(k) / ROWS.length) * 0.4;
  const opacity = useTransform(p, [at, at + 0.03], [1, 0]);
  const scale = useTransform(p, [at, at + 0.03], [1, 0.94]);
  return (
     
    <motion.img src={src} alt="" className="w-full rounded-[12px] ring-1 ring-white/10" style={{ opacity, scale }} />
  );
}

/** iPhone plano y de frente (feedback 2026-10-14: «siempre frontal»), marco negro en CSS con la isla. */
function FlatPhone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-full bg-[#0b0b0c] p-[2.8%] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),inset_0_0_0_1.5px_rgba(255,255,255,0.08)] ring-1 ring-white/30 ${className}`}
      style={{ aspectRatio: "1206 / 2622", borderRadius: "15% / 7%" }}
    >
      <div className="relative h-full w-full overflow-hidden bg-black" style={{ borderRadius: "12.5% / 5.8%" }}>
        {children}
        <span className="absolute left-1/2 top-[1.6%] h-[3.5%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/** «Ya estás al día», como lo pinta la app al final de una lista. */
function AllRead({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 text-center ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a84ff] text-[18px] text-[#0a84ff]">✓</span>
      <p className="text-[22px] font-semibold text-white">Ya estás al día</p>
      <p className="text-[15px] text-[#0a84ff]">Ver todas</p>
    </div>
  );
}

/** El día se acaba (rehecho el 2026-10-14 con el feedback de Alberto). A la izquierda, centrado en su hueco, el
    contador de 678 a 32 y las reglas; a la derecha, un muro de noticias reales que se van apagando al azar
    hasta «Ya estás al día». Detrás aparece un iPhone de verdad (marco negro) con esa pantalla; se va al
    centro y con él entra «Crear un tema»: la búsqueda real de «Videojuegos» grabada en el simulador
    (`media/buscar-tema.mp4`), en vez de una simulación en HTML. Con movimiento reducido o en móvil, en lista. */
export function DayEnds() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const pinned = wide && !reduce;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [n, setN] = useState(678);
  const [done, setDone] = useState(0);
  const [search, setSearch] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(
    () =>
      p.on("change", (v) => {
        const t = Math.min(1, Math.max(0, (v - 0.08) / 0.42));
        setN(Math.round(678 - (678 - 32) * (1 - Math.pow(1 - t, 2))));
        setDone(RULES.filter((r) => v >= r.at).length);
        setSearch(v >= 0.7);
      }),
    [p]
  );
  // La búsqueda empieza desde el principio cada vez que llega su momento.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (search) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else v.pause();
  }, [search]);

  // El móvil (plano, siempre de frente): entra con «Ya estás al día» en su pantalla; luego va al centro y crece,
  // fundido a negro por abajo, subiendo un poco para que el foco quede donde se escribe «Videojuegos».
  const phoneIn = useTransform(p, [0.5, 0.58], [0, 1]);
  const phoneRise = useTransform(p, [0.5, 0.58], [60, 0]);
  // Centro del móvil ya crecido (min(32vh, 20vw) × 2,1 de ancho; el tope en vw es para pantallas altas): al 30 %, pero nunca tan a la izquierda que se salga, y el texto
  // empieza siempre a la misma distancia de su borde derecho (2026-10-17: en ratios anchos quedaba un hueco enorme y en
  // los altos el móvil pisaba el texto).
  const go = useTransform(p, [0.64, 0.8], [0, 1]);
  const phoneLeft = useMotionTemplate`calc(71% * (1 - ${go}) + max(30%, min(33.6vh, 21vw) + 3vw) * ${go})`;
  const phoneScale = useTransform(p, [0.64, 0.8], [1, 2.1]);
  const phoneUp = useTransform(p, [0.64, 0.8, 1], ["0vh", "-4vh", "-12vh"]);
  const fadeStart = useTransform(p, [0.64, 0.8], [100, 26]);
  const mask = useTransform(fadeStart, (f) => `linear-gradient(to bottom, #000 ${f}%, transparent ${Math.min(100, f + 22)}%)`);
  const leftOut = useTransform(p, [0.58, 0.64], [1, 0]);
  const createIn = useTransform(p, [0.8, 0.86], [0, 1]);
  const createY = useTransform(p, [0.8, 0.86], [24, 0]);
  const searchIn = useTransform(p, [0.7, 0.76], [0, 1]);

  const counter = (
    <>
      <p className="t-label t-tag text-[var(--case-muted)]">El día se acaba</p>
      <p className="mt-4 t-d3 tabular-nums">{n}</p>
      <p className="mt-2 t-small text-[var(--case-muted)]">noticias hoy</p>
      <ol className="mt-10 space-y-3">
        {RULES.map((r, k) => (
          <li key={r.label} className="flex items-center gap-3 t-small transition-opacity duration-500" style={{ opacity: !pinned || done > k ? 1 : 0.3 }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px]">{!pinned || done > k ? "✓" : k + 1}</span>
            {r.label}
          </li>
        ))}
      </ol>
    </>
  );
  const create = (
    <>
      <p className="t-label t-tag text-[var(--case-muted)]">Crear un tema</p>
      <p className="mt-4 t-statement text-balance">Se escribe un tema y las fuentes se buscan solas.</p>
      <p className="mt-6 t-body text-[var(--case-muted)]">
        Un índice de feeds y un buscador web traen candidatos; cuatro filtros —relevancia, idioma, actividad real y que
        se pueda leer dentro— dejan solo los buenos.
      </p>
    </>
  );

  // El ref del scroll va en los dos casos: framer exige que el objetivo esté montado.
  if (!pinned)
    return (
      <div ref={ref} className="space-y-16 px-4 md:px-6">
        <div>{counter}</div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ROWS.slice(0, 6).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="w-full rounded-[12px]" />
          ))}
        </div>
        <AllRead />
        <div>{create}</div>
        <FlatPhone className="mx-auto max-w-[300px]">
          <video src="/maqueta/7news/media/buscar-tema.mp4" muted playsInline autoPlay loop className="absolute inset-0 h-full w-full object-cover" aria-label="Crear el tema Videojuegos" />
        </FlatPhone>
      </div>
    );

  return (
    <div ref={ref} className="relative h-[460vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Izquierda: el contador y las reglas, centrados en su hueco. */}
        <motion.div className="absolute inset-y-0 left-0 flex w-[42%] items-center justify-center px-6" style={{ opacity: leftOut }}>
          <div className="w-full max-w-[24rem]">{counter}</div>
        </motion.div>
        {/* Derecha: el muro de noticias reales. */}
        <div className="absolute inset-y-0 right-0 flex w-[56%] items-center pr-6">
          <div className="grid w-full grid-cols-3 gap-2.5">
            {ROWS.map((src, k) => (
              <NewsRow key={src} src={src} k={k} p={p} />
            ))}
          </div>
        </div>
        {/* El iPhone, plano y de frente: «Ya estás al día» en su pantalla; va al centro, crece y pasa a la búsqueda. */}
        <motion.div
          className="absolute top-[15vh] w-[min(32vh,20vw)] origin-top"
          style={{ left: phoneLeft, x: "-50%", y: phoneUp, scale: phoneScale, maskImage: mask, WebkitMaskImage: mask }}
        >
          <motion.div style={{ opacity: phoneIn, y: phoneRise }}>
            <FlatPhone>
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <AllRead className="scale-[0.8]" />
              </div>
              <motion.video
                ref={video}
                src="/maqueta/7news/media/buscar-tema.mp4"
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: searchIn }}
                aria-label="Crear el tema Videojuegos: se escribe, se buscan las fuentes y salen sus noticias"
              />
            </FlatPhone>
          </motion.div>
        </motion.div>
        {/* Crear un tema, a la derecha del móvil, a una distancia fija de su borde. */}
        <motion.div className="absolute inset-y-0 right-0 flex items-center pr-[4vw] left-[calc(max(30%,min(33.6vh,21vw)+3vw)+min(33.6vh,21vw)+5vw)]" style={{ opacity: createIn, y: createY }}>
          <div className="w-full max-w-[30rem]">{create}</div>
        </motion.div>
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
        {/* En móvil, la columna del concepto va encima de cada fila: las cabeceras se reparten las dos columnas. */}
        <span className="hidden md:col-span-4 md:block" />
        <span className="col-span-6 md:col-span-4">Otro reader</span>
        <span className="col-span-6 md:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/7news/brand/7news-logo.svg" alt="7news" className="light-invert h-[1.1em] w-auto" />
        </span>
      </div>
      {VS.map(([k, a, b], i) => (
        // FadeIn y no `whileInView`: en Safari este no se dispara al llegar navegando (ver NOTES).
        <FadeIn key={k} delay={i * 0.06} className="grid grid-cols-12 gap-x-4 border-t border-[var(--case-line)] py-5 md:gap-x-6">
          <span className="col-span-12 t-small text-[var(--case-muted)] md:col-span-4">{k}</span>
          <span className="col-span-6 mt-2 t-body text-[var(--case-muted)] line-through decoration-1 md:col-span-4 md:mt-0">{a}</span>
          <span className="col-span-6 mt-2 t-body md:col-span-4 md:mt-0">
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

const FACTS = [
  ["48 horas", "La ventana del día. Lo anterior ya no es noticia."],
  ["3 por fuente", "Quien publica mucho deja de enterrar al resto."],
  ["0 €", "Sin servidor ni suscripciones: todo ocurre en el teléfono."],
];

/** Fila de cifra: entra en su tramo del scroll y se queda. */
function Fact({ t, d, k, p }: { t: string; d: string; k: number; p: MotionValue<number> }) {
  const a = 0.18 + k * 0.2;
  const opacity = useTransform(p, [a, a + 0.1], [0, 1]);
  const y = useTransform(p, [a, a + 0.1], [20, 0]);
  return (
    <motion.div style={{ opacity, y }} className="border-t border-white/25 pt-4">
      <p className="t-title text-white">{t}</p>
      <p className="mt-2 t-small text-white/70">{d}</p>
    </motion.div>
  );
}

/** El aviso (feedback 2026-10-14): la escena del iPhone y el Watch se queda fija un rato y, a la izquierda, sobre la
    piedra, entran las cifras una a una con el scroll. En móvil o con movimiento reducido, la escena y las cifras debajo. */
export function WatchStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const video = (
    <video
      src="/maqueta/7news/media/reloj.mp4"
      poster="/maqueta/7news/media/reloj-poster.jpg"
      muted
      playsInline
      autoPlay
      loop
      className="absolute inset-0 h-full w-full object-cover"
      aria-label="El aviso de 7news llega al iPhone y, al momento, al Apple Watch"
    />
  );
  return (
    <div ref={ref} className={reduce ? "" : "relative md:h-[260vh]"}>
      <div className={reduce ? "" : "md:sticky md:top-0 md:h-screen md:overflow-hidden"}>
        <div className="relative aspect-[3/2] w-full md:aspect-auto md:h-full">
          {video}
          <span aria-hidden className="absolute inset-y-0 left-0 hidden w-[40%] bg-gradient-to-r from-black/55 to-transparent md:block" />
          <div className="absolute inset-y-0 left-0 hidden w-[34%] items-center justify-center px-6 md:flex">
            <div className="w-full max-w-[20rem] space-y-8">
              {FACTS.map(([t, d], k) => (
                <Fact key={t} t={t} d={d} k={k} p={p} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-6 px-4 md:hidden">
          {FACTS.map(([t, d]) => (
            <div key={t} className="border-t border-[var(--case-line)] pt-4">
              <p className="t-title">{t}</p>
              <p className="mt-2 t-small text-[var(--case-muted)]">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
