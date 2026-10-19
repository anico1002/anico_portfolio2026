"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Img from "@/components/case-study/Img";
import RealPhone from "@/components/case-study/RealPhone";
import LazyVideo from "@/components/case-study/LazyVideo";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import Lines from "@/components/case-study/Lines";
import { D, SF } from "./DovlaPieces";

/* El UI kit de Dovla y las fotos con dovelas (2026-10-17, Alberto: «que se vea que toda la app está hecha en base a
   un UI kit»; banca privada, clientes con mucho patrimonio). Los componentes son recortes de capturas reales del
   simulador (scripts/case-media/dovla-kit.py → media/kit/, fuera de git) y la escala tipográfica va en imagen: Silka
   no tiene licencia para servirse en la web. Tokens de DovlaColor.swift / DovlaSpacing.swift del repo dovla-app. */

const KIT = "/maqueta/dovla/media/kit";
const SCREENS = "/maqueta/dovla/screens";
const NIGHT = "#1C0B17";
const wrapX = "px-4 md:px-6";

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

/** Rótulo pequeño de ficha técnica: nombre a la izquierda, valor a la derecha. */
function Spec({ name, value }: { name: string; value?: string }) {
  return (
    <p className="flex items-baseline justify-between gap-4 border-t pt-3 text-[12px] tracking-[0.04em]" style={{ borderColor: "rgba(235,211,184,0.18)", color: D.text3 }}>
      <span style={{ color: D.text2 }}>{name}</span>
      {value && <span className="tabular-nums">{value}</span>}
    </p>
  );
}

/* ───────────────────────── Mosaico de dovelas ───────────────────────── */

/** Las fotos del mosaico, con su proporción y el punto que tiene que quedar a la vista al recortarlas. */
const PHOTOS = [
  { src: "/maqueta/dovla/media/photo-travel.jpg", r: 1920 / 1080, y: 0.5 },
  { src: "/maqueta/dovla/media/photo-concierge.jpg", r: 2000 / 1333, y: 0.5 },
  { src: "/maqueta/dovla/media/photo-invest.jpg", r: 2000 / 3556, y: 0.6 },
];
const TURN = 1.1; // s que tarda una dovela en girar
const WAVE = 2.4; // s que tarda la ola en cruzar el mosaico
const HOLD = 2.6; // s que se queda la foto entera antes de la siguiente ola

type Grid = { W: number; H: number; cell: number; cols: number; rows: number };

/** El trozo de la foto `i` que cae en la celda (col, row): la foto cubre el mosaico entero, cada celda enseña su parte. */
function slice(i: number, g: Grid, x0: number, y0: number): React.CSSProperties {
  const p = PHOTOS[i];
  const [bw, bh] = g.W / g.H > p.r ? [g.W, g.W / p.r] : [g.H * p.r, g.H];
  const oy = Math.min(0, Math.max(g.H - bh, g.H / 2 - bh * p.y));
  return {
    backgroundImage: `url(${p.src})`,
    backgroundSize: `${Math.round(bw)}px ${Math.round(bh)}px`,
    backgroundPosition: `${Math.round((g.W - bw) / 2) - x0}px ${Math.round(oy) - y0}px`,
  };
}

/** Pieza de la dovela (2026-10-18). Del vocabulario de la app (DovlaPattern.swift) solo las que no dejan astillas
    sobre una foto: cuarto de disco con el centro en una esquina, cuadrado entero o hueco. El cuadrado mordido se
    quitó: su curva toca el borde de la celda en tangente y dejaba un hilo de foto pegado al borde («strokes raros»). */
type Shape = { kind: 0 | 2 | 3; corner: 0 | 1 | 2 | 3 };
const rollShape = (): Shape => {
  const r = Math.random();
  const corner = Math.floor(Math.random() * 4) as Shape["corner"];
  return { kind: r < 0.66 ? 0 : r < 0.8 ? 2 : 3, corner };
};
/** El cuarto de disco que llena la celda (w × h), con el centro en la esquina `corner` (0 arriba izq., y en sentido
    horario). Todo en píxeles enteros. */
function quarter(corner: number, w: number, h: number) {
  const [cx, cy] = [[0, 0], [w, 0], [w, h], [0, h]][corner];
  const [sx, sy, ex, ey] = [[w, 0, 0, h], [w, h, 0, 0], [0, h, w, 0], [0, 0, w, h]][corner];
  return `M${cx} ${cy}L${sx} ${sy}A${w} ${h} 0 0 1 ${ex} ${ey}Z`;
}
/** El recorte de cada pieza. */
function shapeClip(sh: Shape, w: number, h: number) {
  if (sh.kind === 0) return `path("${quarter(sh.corner, w, h)}")`;
  if (sh.kind === 2) return "none";
  return "inset(50%)";
}

type Cell = { to: number; shape: Shape; n: number };
const ROWS = 3;

/** Una celda: una dovela fija que enmascara un trozo de foto sobre negro. Como el fondo de la app (2026-10-18,
    Alberto: los giros y deformaciones hacían formas raras), aquí nada gira ni se deforma: al pasar la ola la dovela se
    apaga, y ya apagada cambia a la vez de foto y de pieza; después vuelve a encenderse. */
function MosaicCell({ g, col, row, c }: { g: Grid; col: number; row: number; c: Cell }) {
  // Al píxel (2026-10-18): con anchos de celda con decimales, cada borde caía entre dos píxeles y entre dovelas
  // vecinas se colaba una línea. Cada celda va de un píxel entero al siguiente, sin huecos ni solapes.
  const x0 = Math.round(col * g.cell), y0 = Math.round(row * g.cell);
  // Y 1 px más hacia la derecha y hacia abajo, por encima de la vecina: si el bloque cae a medio píxel (scroll suave),
  // tampoco queda costura. El trozo de foto es el mismo, así que el solape no se ve.
  const w = Math.round((col + 1) * g.cell) - x0 + 1, h = Math.round((row + 1) * g.cell) - y0 + 1;
  const box = { left: x0, top: y0, width: w, height: h };
  const [shown, setShown] = useState({ img: c.to, shape: c.shape, n: c.n });
  // Apagada desde que llega la ola hasta que cambia de foto y de pieza.
  const dim = shown.n !== c.n;
  useEffect(() => {
    if (c.n === 0) return;
    const swap = window.setTimeout(() => setShown({ img: c.to, shape: c.shape, n: c.n }), (TURN * 1000) / 2);
    return () => clearTimeout(swap);
  }, [c.n, c.to, c.shape]);
  return (
    <motion.div
      className="absolute"
      style={{ ...box, ...slice(shown.img, g, x0, y0), clipPath: shapeClip(shown.shape, w, h) }}
      initial={false}
      animate={{ opacity: dim ? 0 : 1 }}
      transition={{ duration: TURN / 2, ease: EASE.inOut }}
    />
  );
}

/** El mosaico de dovelas a sangre, con la app encima (2026-10-18, Alberto): una franja de tres filas a todo el ancho,
    sobre negro, donde cada dovela enmascara un trozo de foto. Una ola cruza la franja apagando y encendiendo las
    dovelas, que al volver traen otra foto y otra pieza (cabina, velero, coche) y vuelta a empezar; la foto nunca se ve
    entera. Encima, el móvil girado
    30° como en el resto de casos, más alto que la franja: sale por arriba y por abajo. */
export function DovelaMosaic({ video }: { video: string }) {
  const { ref, on } = useInView<HTMLDivElement>("0px");
  const reduce = useReduce();
  const [g, setG] = useState<Grid | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const shown = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const W = el.clientWidth;
      const cols = W >= 768 ? 8 : 4;
      const cell = W / cols;
      setG({ W, H: cell * ROWS, cell, cols, rows: ROWS });
      setCells(Array.from({ length: cols * ROWS }, () => ({ to: shown.current, shape: rollShape(), n: 0 })));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  useEffect(() => {
    PHOTOS.forEach((p) => (new Image().src = p.src));
  }, []);
  const size = g ? `${g.cols}x${g.rows}` : "";
  useEffect(() => {
    if (!on || reduce || !g) return;
    const timers: number[] = [];
    const wave = () => {
      const next = (shown.current + 1) % PHOTOS.length;
      shown.current = next;
      for (let k = 0; k < g.cols * g.rows; k++) {
        const col = k % g.cols, row = Math.floor(k / g.cols);
        const t = ((col / g.cols + row / g.rows) * 0.6 + Math.random() * 0.4) * WAVE;
        timers.push(window.setTimeout(() => setCells((cs) => cs.map((c, j) => (j === k ? { to: next, shape: rollShape(), n: c.n + 1 } : c))), t * 1000));
      }
      timers.push(window.setTimeout(wave, (WAVE + TURN + HOLD) * 1000));
    };
    timers.push(window.setTimeout(wave, 1200));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduce, size]);
  // El móvil: 1,5 veces el alto de la franja y girado 30°; el aire de arriba y abajo es lo que sobresale.
  const ph = g ? g.H * 1.5 : 0;
  const pw = (ph * 517) / 1184;
  const out = g ? Math.max(0, (ph * Math.cos(Math.PI / 6) + pw * Math.sin(Math.PI / 6) - g.H) / 2) : 0;
  return (
    <div className="relative" style={{ paddingBlock: out }}>
      <div
        ref={ref}
        className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[8/3]"
        style={{ background: "#000" }}
        role="img"
        aria-label="The Dovla app over a band of turning dovelas that mask a cabin window, a yacht at sunset and a car at night"
      >
        {g && cells.map((c, k) => <MosaicCell key={`${size}-${k}`} g={g} col={k % g.cols} row={Math.floor(k / g.cols)} c={c} />)}
      </div>
      {g && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: pw }}>
          <div className="rotate-[30deg] drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]">
            <RealPhone src={video} label="Dovla, from the splash screen to the home screen" />
          </div>
        </div>
      )}
    </div>
  );
}

/** Pseudoazar fijo por celda (mismo dibujo en cada visita): para el borde irregular de la mancha. */
const hash = (a: number, b: number) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Copy = { eyebrow: string; title: string; body: string };

/** Titulillo, titular y párrafo apilados, con los estilos de SectionHead. */
function Stack({ c, body = true }: { c: Copy; body?: boolean }) {
  return (
    <div>
      <FadeIn>
        <p className="t-label t-tag text-[var(--case-muted)]">{c.eyebrow}</p>
      </FadeIn>
      <Lines as="h2" className="mt-4 t-statement text-balance" delay={STAGGER}>
        {c.title}
      </Lines>
      {body && (
        <FadeIn delay={2 * STAGGER} className="mt-8">
          <p className="t-body text-[var(--case-muted)]">{c.body}</p>
        </FadeIn>
      )}
    </div>
  );
}

/** La entrada de Dovla en escritorio, como un solo bloque (2026-10-18, Alberto): arriba el titular a la izquierda y
    su párrafo a la derecha; las dovelas con foto forman una mancha en diagonal que entra por el hueco negro entre los
    dos y baja hacia la izquierda, detrás del móvil; abajo a la derecha, sobre negro, el texto de la dovela. La mancha
    mide los textos y se apaga donde caen, así siempre quedan sobre negro. Mismas dovelas y misma ola que el mosaico. */
export function DovelaIntro({ video, intro, identity }: { video: string; intro: Copy; identity: Copy }) {
  const root = useRef<HTMLDivElement>(null);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const { ref, on } = useInView<HTMLDivElement>("0px");
  const reduce = useReduce();
  const [g, setG] = useState<Grid | null>(null);
  const [cells, setCells] = useState<(Cell & { k: number })[]>([]);
  const shown = useRef(0);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const build = () => {
      const W = el.clientWidth, H = el.clientHeight;
      const cols = 10;
      const cell = W / cols;
      const rows = Math.ceil(H / cell);
      const box = el.getBoundingClientRect();
      const keep = texts.current.filter(Boolean).map((t) => {
        const r = t!.getBoundingClientRect();
        return { l: r.left - box.left - 28, r: r.right - box.left + 28, t: r.top - box.top - 28, b: r.bottom - box.top + 28 };
      });
      // La diagonal (2026-10-18, Alberto): de arriba a la izquierda a abajo a la derecha, de margen a margen, y apagada
      // donde caen los textos. Sin piezas sueltas: una dovela sin al menos dos vecinas se quita.
      const on = new Set<number>();
      for (let k = 0; k < cols * rows; k++) {
        const col = k % cols, row = Math.floor(k / cols);
        const x0 = col * cell, y0 = row * cell;
        const u = (x0 + cell / 2) / W, v = (y0 + cell / 2) / H;
        const line = 0.12 + 0.76 * u;
        const half = 0.14 + hash(col, row) * 0.06;
        if (Math.abs(v - line) > half) continue;
        if (keep.some((q) => x0 < q.r && x0 + cell > q.l && y0 < q.b && y0 + cell > q.t)) continue;
        on.add(k);
      }
      const near = (k: number) => {
        const col = k % cols;
        return [k - cols, k + cols, col > 0 ? k - 1 : -1, col < cols - 1 ? k + 1 : -1].filter((j) => on.has(j)).length;
      };
      const list: (Cell & { k: number })[] = [...on].filter((k) => near(k) >= 2).map((k) => ({ k, to: shown.current, shape: rollShape(), n: 0 }));
      setG({ W, H, cell, cols, rows });
      setCells(list);
    };
    const ro = new ResizeObserver(build);
    ro.observe(el);
    document.fonts?.ready.then(build);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    PHOTOS.forEach((p) => (new Image().src = p.src));
  }, []);
  const size = g ? `${g.cols}x${g.rows}-${cells.length}` : "";
  useEffect(() => {
    if (!on || reduce || !g) return;
    const timers: number[] = [];
    const wave = () => {
      const next = (shown.current + 1) % PHOTOS.length;
      shown.current = next;
      cells.forEach((c0, j) => {
        const col = c0.k % g.cols, row = Math.floor(c0.k / g.cols);
        const t = ((col / g.cols + row / g.rows) * 0.6 + Math.random() * 0.4) * WAVE;
        timers.push(window.setTimeout(() => setCells((cs) => cs.map((c, i) => (i === j ? { ...c, to: next, shape: rollShape(), n: c.n + 1 } : c))), t * 1000));
      });
      timers.push(window.setTimeout(wave, (WAVE + TURN + HOLD) * 1000));
    };
    timers.push(window.setTimeout(wave, 1200));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduce, size]);
  // El móvil, girado 30°: su caja es la del móvil ya girado, así ocupa en la rejilla lo que se ve.
  const ROT = Math.PI / 6, PR = 1184 / 517;
  const bboxW = Math.cos(ROT) + PR * Math.sin(ROT);
  const bboxH = PR * Math.cos(ROT) + Math.sin(ROT);
  return (
    <div ref={root} className="relative left-1/2 w-screen -translate-x-1/2 pb-[14vw]">
      <div
        ref={ref}
        className="absolute inset-0 overflow-hidden"
        role="img"
        aria-label="A diagonal of turning dovelas that mask a cabin window, a yacht at sunset and a car at night"
      >
        {g && cells.map((c) => <MosaicCell key={`${size}-${c.k}`} g={g} col={c.k % g.cols} row={Math.floor(c.k / g.cols)} c={c} />)}
      </div>
      <div className={`${wrapX} relative grid grid-cols-12 gap-x-6`}>
        <div ref={(el) => void (texts.current[0] = el)} className="col-span-6 row-start-1 self-start">
          <Stack c={intro} body={false} />
        </div>
        <div ref={(el) => void (texts.current[1] = el)} className="col-span-4 col-start-8 row-start-1 mt-[6vw] self-start">
          <FadeIn delay={2 * STAGGER}>
            <p className="t-body text-[var(--case-muted)]">{intro.body}</p>
          </FadeIn>
        </div>
        {/* El móvil, lo más grande que deja la rejilla: es la primera vez que se ve la app. */}
        <div className="relative z-20 col-span-6 col-start-1 row-span-2 row-start-2 -mt-[3vw]" style={{ aspectRatio: `${bboxW} / ${bboxH}` }}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: `${100 / bboxW}%` }}>
            <div className="rotate-[30deg] drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]">
              <RealPhone src={video} label="Dovla, from the splash screen to the home screen" />
            </div>
          </div>
        </div>
        <div ref={(el) => void (texts.current[2] = el)} className="col-span-4 col-start-8 row-start-2 mt-[8vw] self-start">
          <Stack c={identity} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Fundamentos ───────────────────────── */

const COLORS = [
  { name: "Night", hex: "#1C0B17", ink: D.sand, role: "Sheets and deep backgrounds" },
  { name: "Aubergine deep", hex: D.bg, ink: D.sand, role: "Page" },
  { name: "Aubergine", hex: D.plum, ink: D.sand, role: "Cards and tiles" },
  { name: "Elevated", hex: D.elevated, ink: D.sand, role: "Selected, controls" },
  { name: "Sand", hex: D.sand, ink: D.bg, role: "Text and primary action" },
  { name: "Income", hex: D.positive, ink: D.bg, role: "Money in" },
  { name: "Spend", hex: D.negative, ink: D.bg, role: "Money out" },
];

/** Paleta: berenjena para las superficies, arena para lo que se lee; las franjas crecen al entrar. */
export function ColorTokens() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  return (
    <div ref={ref} className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-7 md:gap-x-3">
      {COLORS.map((c, k) => (
        <div key={c.name} className={k === 0 ? "col-span-2 md:col-span-1" : ""}>
          <div className={`relative overflow-hidden md:aspect-[1/2] ${k === 0 ? "aspect-[8/3]" : "aspect-[4/3]"}`} style={{ background: "rgba(235,211,184,0.06)" }}>
            <motion.div
              className="absolute inset-0 flex flex-col justify-end p-3 md:p-4"
              style={{ background: c.hex, color: c.ink, outline: c.hex === NIGHT ? "1px solid rgba(235,211,184,0.18)" : undefined, outlineOffset: -1 }}
              initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
              animate={reduce || on ? { clipPath: "inset(0% 0 0 0)" } : undefined}
              transition={{ duration: DUR.slow, ease: EASE.inOut, delay: k * 0.07 }}
            >
              <span className="text-[12px] tabular-nums opacity-80">{c.hex}</span>
            </motion.div>
          </div>
          <p className="mt-3 text-[14px]" style={{ color: D.sand }}>{c.name}</p>
          <p className="mt-1 text-[12px]" style={{ color: D.text3 }}>{c.role}</p>
        </div>
      ))}
    </div>
  );
}

const TYPE = [
  { img: "type-balance", name: "Balance", spec: "48 · Semibold" },
  { img: "type-title-l", name: "Title L", spec: "28 · Bold" },
  { img: "type-title-m", name: "Title M", spec: "22 · Semibold" },
  { img: "type-title-s", name: "Title S", spec: "17 · Semibold" },
  { img: "type-body", name: "Body", spec: "17 · Regular" },
  { img: "type-callout", name: "Callout", spec: "15 · Regular" },
  { img: "type-footnote", name: "Footnote", spec: "13 · Regular" },
  { img: "type-caption", name: "Caption", spec: "12 · Medium" },
];
const TYPE_W: Record<string, number> = { "type-balance": 260, "type-title-l": 214, "type-title-m": 141, "type-title-s": 210, "type-body": 354, "type-callout": 263, "type-footnote": 170, "type-caption": 96 };

/** Escala tipográfica en Silka, a tamaño de pantalla (pt = px). Cada estilo crece con el texto de accesibilidad. */
export function TypeScale({ lead }: { lead?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
      {/* Columna izquierda: arriba un texto (el del color, 2026-10-18, Alberto) y abajo el «Aa», alineado con el final
          de la escala de la derecha. */}
      <div className="col-span-12 flex flex-col justify-between gap-12 md:col-span-4">
        {lead}
        <FadeIn>
        <Img src={`${KIT}/type-aa.png`} alt="Silka, the brand typeface" loading="lazy" className="w-[9rem] md:w-[13rem]" />
        <p className="mt-6 text-[14px]" style={{ color: D.sand }}>Silka</p>
        <p className="mt-1 max-w-[28ch] text-[12px]" style={{ color: D.text3 }}>Eight styles, each tied to a Dynamic Type size so it grows with the reader’s settings.</p>
        </FadeIn>
      </div>
      <div className="col-span-12 space-y-7 md:col-span-7 md:col-start-6">
        {TYPE.map((t, k) => (
          <FadeIn key={t.img} delay={k * 0.05}>
            <Img src={`${KIT}/${t.img}.png`} alt={t.name} loading="lazy" style={{ width: TYPE_W[t.img], maxWidth: "100%" }} />
            <div className="mt-3"><Spec name={t.name} value={t.spec} /></div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

const SPACE = [2, 4, 8, 12, 16, 24, 32, 48];
const RADII = [
  { r: 8, name: "S" },
  { r: 12, name: "M" },
  { r: 20, name: "L" },
  { r: 28, name: "XL" },
  { r: 999, name: "Pill" },
];

/** Espaciado y radios: la regla que hace que todo encaje. */
export function SpaceRadii() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  return (
    // El espaciado va centrado en el hueco negro a la izquierda de los radios y con su pie a la altura del pie de los
    // cuadrados (2026-10-18, Alberto: pegado al margen se veía descolgado).
    <div ref={ref} className="grid grid-cols-12 gap-x-4 gap-y-14 md:items-end md:gap-x-6">
      <div className="col-span-12 md:col-span-6 md:flex md:justify-center">
        <div className="md:w-fit">
        <p className="mb-6 text-[14px]" style={{ color: D.sand }}>Spacing</p>
        <div className="space-y-3">
          {SPACE.map((s, k) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-8 text-right text-[12px] tabular-nums" style={{ color: D.text3 }}>{s}</span>
              <motion.span
                className="block h-3"
                style={{ background: D.sand, width: s * 4, originX: 0 }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={reduce || on ? { scaleX: 1 } : undefined}
                transition={{ duration: DUR.base, ease: EASE.out, delay: k * 0.05 }}
              />
            </div>
          ))}
        </div>
        {/* Hueco del rótulo de los radios: así la última barra queda a la altura del pie de los cuadrados. */}
        <p aria-hidden className="-mb-[3px] mt-3 hidden text-[12px] md:block">&nbsp;</p>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <p className="mb-6 text-[14px]" style={{ color: D.sand }}>Corner radius</p>
        <div className="grid grid-cols-5 gap-3">
          {RADII.map((r, k) => (
            <div key={r.name}>
              <motion.div
                className="aspect-square"
                style={{ background: D.plum, borderTopLeftRadius: Math.min(r.r, 56) * 1.4 }}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={reduce || on ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: DUR.base, ease: EASE.out, delay: 0.2 + k * 0.06 }}
              />
              <p className="mt-3 text-[12px] tabular-nums" style={{ color: D.text3 }}>
                {r.name} · {r.r === 999 ? "∞" : r.r}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Componentes ───────────────────────── */

/** Una pieza del kit a su tamaño en pt (escala con la columna), con su nombre debajo. Va directamente sobre el
    berenjena de la app (el fondo de la página cambia en esta parte), así que no lleva caja. Con `video`, la pieza
    se mueve: es el recorte de una grabación real (scripts/case-media/dovla-kit-video.sh). */
function Piece({ img, name, w, note, delay = 0, video, r = 0, children }: { img: string; name: string; w: number; note?: string; delay?: number; video?: boolean; r?: number; children?: React.ReactNode }) {
  return (
    <FadeIn delay={delay} className="break-inside-avoid pb-12">
      <div className="flex justify-center py-4 md:py-6">
        {children ??
          (video ? (
            <LazyVideo src={`${KIT}/${img}.mp4`} poster={`${KIT}/${img}.png`} aria-label={name} className="block h-auto" style={{ width: w, maxWidth: "100%", borderRadius: r }} />
          ) : (
            <Img src={`${KIT}/${img}.png`} alt={name} loading="lazy" style={{ width: w, maxWidth: "100%" }} />
          ))}
      </div>
      <div className="mt-3"><Spec name={name} value={note} /></div>
    </FadeIn>
  );
}

/** La gráfica de gasto se dibuja de izquierda a derecha, se queda un rato y vuelve a empezar: un velo del color de la
    tarjeta tapa la zona de la línea y se retira. */
function LiveChart({ w }: { w: number }) {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  const play = on && !reduce;
  return (
    <div ref={ref} className="relative" style={{ width: w, maxWidth: "100%" }}>
      <Img src={`${KIT}/chart-clean.png`} alt="Spending chart" loading="lazy" className="block w-full" />
      <motion.div
        className="absolute"
        style={{ left: "3%", right: "3%", top: "27%", bottom: "17%", background: "#351F33", originX: 1 }}
        initial={false}
        animate={play ? { scaleX: [1, 0, 0, 1], opacity: [1, 1, 0, 0] } : { scaleX: 0, opacity: 1 }}
        transition={play ? { duration: 6, times: [0, 0.4, 0.85, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 0 } : { duration: 0 }}
      />
    </div>
  );
}

/* Piezas de cristal (2026-10-18, Alberto: los recortes de pantalla dejaban ver el borde del rectángulo sobre el
   berenjena). Las que flotan en la app —acciones, meses, barra de pestañas, selectores— se dibujan aquí en código:
   relleno translúcido, desenfoque de lo que hay detrás y un filo de luz arriba, como el cristal de iOS. */

const GLASS: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(235,211,184,0.16), rgba(235,211,184,0.06))",
  backdropFilter: "blur(18px) saturate(1.5)",
  WebkitBackdropFilter: "blur(18px) saturate(1.5)",
  boxShadow: "inset 0 1px 0 rgba(255,240,225,0.28), inset 0 -1px 0 rgba(255,240,225,0.06), 0 10px 30px rgba(10,2,8,0.35)",
  border: "1px solid rgba(235,211,184,0.12)",
};
/** Lo seleccionado dentro del cristal: una gota más clara. */
const DROP: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(235,211,184,0.26), rgba(235,211,184,0.12))",
  boxShadow: "inset 0 1px 0 rgba(255,240,225,0.35)",
};

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const ICONS = {
  plus: "M12 5v14M5 12h14",
  send: "M12 19V5M6 11l6-6 6 6",
  exchange: "M4 9h13l-3-3M20 15H7l3 3",
  more: "M6 12h.01M12 12h.01M18 12h.01",
  home: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  cards: "M3 6h18v12H3zM3 10h18",
  pay: "M4 8h14l-3-3M20 16H6l3 3",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  chevron: "M6 9l6 6 6-6",
  snow: "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9",
};

/** Avanza un índice en bucle mientras la pieza está a la vista. */
function useTick(n: number, ms: number) {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [on, reduce, n, ms]);
  return { ref, i };
}

/** Acciones rápidas: cuatro botones de cristal; uno a uno se encienden como al pulsarlos. */
function GlassActions() {
  const items = [["plus", "Add"], ["send", "Send"], ["exchange", "Exchange"], ["more", "More"]] as const;
  const { ref, i } = useTick(items.length, 1400);
  return (
    <div ref={ref} className="flex gap-6" style={{ ...SF, color: D.sand }}>
      {items.map(([ic, label], k) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <motion.div className="grid size-[52px] place-items-center rounded-full" style={GLASS} animate={{ scale: i === k ? 0.92 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
            <Icon d={ICONS[ic]} />
          </motion.div>
          <span className="text-[13px]" style={{ color: D.text2 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Selector de meses: una cápsula de cristal y la gota que pasa de un mes a otro, como al deslizar la lista. */
function GlassMonths() {
  const months = ["October", "September", "August", "July"];
  const { ref, i } = useTick(months.length, 1600);
  return (
    <div ref={ref} className="relative flex rounded-full p-1" style={{ ...GLASS, ...SF, color: D.sand }}>
      {months.map((m, k) => (
        <div key={m} className="relative px-4 py-2 text-[15px]">
          {i === k && <motion.div layoutId="dovla-month" className="absolute inset-0 rounded-full" style={DROP} transition={{ type: "spring", stiffness: 260, damping: 28 }} />}
          <span className="relative" style={{ color: i === k ? D.sand : D.text3, transition: "color .3s" }}>{m}</span>
        </div>
      ))}
    </div>
  );
}

/** Barra de pestañas flotante: cristal y la gota que recorre las pestañas. */
function GlassTabBar() {
  const tabs = [["home", "Home"], ["cards", "Cards"], ["pay", "Payments"], ["profile", "Profile"]] as const;
  const { ref, i } = useTick(tabs.length, 1700);
  return (
    <div ref={ref} className="relative flex rounded-full p-1.5" style={{ ...GLASS, ...SF }}>
      {tabs.map(([ic, label], k) => (
        <div key={label} className="relative flex w-[78px] flex-col items-center gap-1 py-2">
          {i === k && <motion.div layoutId="dovla-tab" className="absolute inset-0 rounded-full" style={DROP} transition={{ type: "spring", stiffness: 260, damping: 28 }} />}
          <span className="relative" style={{ color: i === k ? D.sand : D.text3, transition: "color .3s" }}><Icon d={ICONS[ic]} size={20} /></span>
          <span className="relative text-[10px] font-medium" style={{ color: i === k ? D.sand : D.text3, transition: "color .3s" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Un botón compacto de cristal (selector de cuenta, congelar tarjeta). */
const GlassPill = ({ label, icon, after }: { label: string; icon?: keyof typeof ICONS; after?: keyof typeof ICONS }) => (
  <div className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] font-medium" style={{ ...GLASS, ...SF, color: D.sand }}>
    {icon && <Icon d={ICONS[icon]} size={16} />}
    {label}
    {after && <Icon d={ICONS[after]} size={14} />}
  </div>
);

/** Un solo brillo grande y centrado, del berenjena más claro, detrás de la hoja: el cristal necesita algo que
    desenfocar y el berenjena liso no lo tiene. (2026-10-18, Alberto: fuera los cuatro brillos de antes, sobre todo los
    amarillentos; «como mucho uno grande centrado con el color más claro».) */
function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
      <div className="aspect-square w-[min(70rem,120%)] shrink-0 rounded-full" style={{ background: `radial-gradient(circle, ${D.elevated}99, transparent 62%)` }} />
    </div>
  );
}

/* Las piezas en captura van con su versión «-clean» (scripts/case-media/dovla-kit-clean.py): recortadas con su radio
   real, sin la franja del fondo de la app que asomaba en las esquinas. */

/** Hoja de componentes: lo que se repite por toda la app, cada uno definido una sola vez. Los que se mueven en la
    app (carrusel, meses, barra de pestañas, gráfica) se mueven también aquí. */
export function KitSheet() {
  return (
    <div className="relative isolate">
      <Glow />
      <div className="gap-x-4 md:columns-3 md:gap-x-6">
        <Piece img="transactions-solid" name="Transaction row" note="Tile group" w={370} />
        <Piece img="button" name="Primary button" note="56 pt" w={370} delay={0.05} />
        <Piece img="button-2" name="Secondary button" note="56 pt" w={370} delay={0.05} />
        <Piece img="months" name="Month selector" note="Follows the scroll" w={390} delay={0.1}>
          <GlassMonths />
        </Piece>
        <Piece img="promo" name="Promo card" note="Carousel" w={370} video r={20} />
        <Piece img="actions" name="Quick actions" note="48 pt" w={370} delay={0.05}>
          <GlassActions />
        </Piece>
        <Piece img="wealth-clean" name="Amount rows" note="Never truncated" w={370} delay={0.1} />
        <Piece img="chart" name="Spending chart" note="Month to date" w={370}>
          <LiveChart w={370} />
        </Piece>
        <Piece img="tabbar" name="Tab bar" note="Floating" w={366} delay={0.05}>
          <GlassTabBar />
        </Piece>
        <Piece img="discover-clean" name="Product row" note="Inline action" w={370} delay={0.1} />
        <Piece img="detail-clean" name="Detail rows" w={370} />
        <Piece img="accounts" name="Account picker" w={118} delay={0.05}>
          <GlassPill label="Accounts" after="chevron" />
        </Piece>
        <Piece img="freeze" name="Compact button" note="44 pt" w={131} delay={0.1}>
          <GlassPill label="Freeze card" icon="snow" />
        </Piece>
      </div>
    </div>
  );
}

const CARDS = ["card-physical", "card-credit", "card-virtual", "card-disposable"];

/** Las cuatro tarjetas en abanico, como en la cartera de la app: una a una suben arriba del todo y vuelven a su sitio,
    en bucle (2026-10-18, Alberto: «que vayan subiendo una a una como están puestas»). Sobre una foto desenfocada que
    rompe con tanto negro. */
export function CardFamily() {
  const { ref, on } = useInView<HTMLDivElement>("-20% 0px");
  const reduce = useReduce();
  const open = reduce || on;
  const [up, setUp] = useState(-1);
  useEffect(() => {
    if (!on || reduce) return;
    let k = -1;
    const id = window.setInterval(() => setUp((k = (k + 1) % CARDS.length)), 1900);
    return () => clearInterval(id);
  }, [on, reduce]);
  return (
    <div ref={ref} className="m-bleed relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 scale-125" style={{ background: `url(/maqueta/dovla/media/photo-travel-blur.jpg) center / cover` }} aria-hidden />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.55), rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.55))" }} aria-hidden />
      <div className="relative mx-auto aspect-[16/9] w-full max-w-[64rem] px-4">
        {CARDS.map((img, k) => {
          const spread = k - 1.5;
          const lifted = up === k;
          return (
            <motion.div
              key={img}
              className="absolute left-1/2 top-1/2 w-[40%] md:w-[46%] drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
              style={{ x: "-50%", y: "-50%", zIndex: lifted ? 10 : 4 - k }}
              initial={reduce ? false : { rotate: 0, translateX: "0%", translateY: "0%" }}
              animate={
                open
                  ? { rotate: lifted ? spread * 3 : spread * 7, translateX: `${spread * 34}%`, translateY: lifted ? "-18%" : `${Math.abs(spread) * 6}%`, scale: lifted ? 1.04 : 1 }
                  : { rotate: 0, translateX: "0%", translateY: "0%" }
              }
              transition={{ type: "spring", stiffness: 70, damping: 16, delay: up < 0 ? k * 0.05 : 0 }}
            >
              <Img src={`${KIT}/${img}.png`} alt="" loading="lazy" className="w-full" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Claro y oscuro ───────────────────────── */

/** Claro y oscuro (2026-10-18, Alberto): móvil frontal y plano, ampliado, del que solo se ve la parte de arriba;
    se funde con el fondo por abajo. Se arrastra (o se pasa el ratón) para cambiar; al entrar, la raya hace un barrido
    corto para que se vea que se puede tocar. */
export function LightDark() {
  const box = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const { ref, on } = useInView<HTMLDivElement>("-25% 0px");
  const reduce = useReduce();
  // Un solo valor (0–100, dónde está la raya en la pantalla) mueve la raya y el corte a la vez: así no se pueden
  // descompasar, tampoco durante el barrido de aviso (2026-10-18, Alberto: «la línea del manejador no cuadra»).
  const x = useMotionValue(50);
  const left = useTransform(x, (v) => `${v}%`);
  const clip = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`);
  const [done, setDone] = useState(false); // el barrido de aviso ya se hizo (o ya lo han tocado)
  useEffect(() => {
    if (!on || reduce || done) return;
    const run = animate(x, [50, 30, 70, 50], { duration: 2.8, ease: EASE.inOut, times: [0, 0.3, 0.75, 1], onComplete: () => setDone(true) });
    return () => run.stop();
  }, [on, reduce, done, x]);
  // La raya y la máscara se miden sobre la pantalla del móvil, no sobre la caja.
  const drag = (clientX: number) => {
    const r = screen.current?.getBoundingClientRect();
    if (!r) return;
    setDone(true);
    x.stop();
    x.set(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[30rem]">
      <div
        ref={box}
        className="relative aspect-[4/5] touch-none select-none overflow-hidden"
        style={{ WebkitMaskImage: "linear-gradient(180deg, #000 55%, transparent 98%)", maskImage: "linear-gradient(180deg, #000 55%, transparent 98%)" }}
        onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), drag(e.clientX))}
        onPointerMove={(e) => (e.buttons || e.pointerType === "mouse") && drag(e.clientX)}
        role="img"
        aria-label="Dovla home in light and dark appearance"
      >
        {/* El móvil: canto de titanio, marco negro y pantalla con sus radios; más alto que la caja, que lo corta. */}
        <div className="absolute inset-x-[6%] top-[4%] aspect-[402/874] rounded-[13%/6%] p-[2.4%]" style={{ background: "linear-gradient(135deg, #3a3a3c, #1c1c1e 40%, #2c2c2e)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}>
          <div ref={screen} className="relative h-full w-full overflow-hidden rounded-[11%/5.2%] bg-black">
            <Img src={`${SCREENS}/home-light.png`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
              <Img src={`${SCREENS}/home.png`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
            {/* La raya, dentro de la pantalla: misma referencia que la máscara, así cae justo en el corte. */}
            <motion.div className="absolute inset-y-0 w-[2px] -translate-x-1/2" style={{ background: "#fff", boxShadow: "0 0 6px rgba(0,0,0,0.35)", left }}>
              <span className="absolute left-1/2 top-[38%] grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full text-[13px] shadow-[0_4px_14px_rgba(0,0,0,0.35)]" style={{ background: D.sand, color: D.bg }} aria-hidden>
                ⇆
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Monedero ───────────────────────── */

const WALLET = [
  { img: "card-physical", title: "Physical", last4: "4417" },
  { img: "card-credit", title: "Credit", last4: "7260" },
  { img: "card-virtual", title: "Virtual", last4: "9032" },
  { img: "card-disposable", title: "Disposable", last4: "1188" },
];
const CARD_RATIO = 1110 / 699;
/** El muelle del monedero en la app (DovlaMotion.wallet: respuesta 0,55 s, amortiguación 0,82). */
const WALLET_SPRING = { type: "spring", stiffness: 130, damping: 19 } as const;

/** El monedero como en la app (2026-10-18, Alberto; medidas de WalletLayout en CardsView.swift): la tarjeta elegida
    arriba y recta, debajo su nombre, los cuatro últimos dígitos y «Freeze card»; las otras tres de pie, en abanico,
    hundidas a medias en el borde de la franja. Una a una suben y la de arriba vuelve al abanico. A sangre sobre una
    foto desenfocada y, al lado, el móvil girado 30° con la app real haciendo lo mismo: sale por arriba y por abajo. */
export function CardWallet({ video }: { video: string }) {
  const box = useRef<HTMLDivElement>(null);
  const { ref, on } = useInView<HTMLDivElement>("-20% 0px");
  const reduce = useReduce();
  const [bw, setBw] = useState(0);
  const [wide, setWide] = useState(false);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setBw(el.clientWidth);
      setWide(window.innerWidth >= 768);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setSel((v) => (v + 1) % WALLET.length), 2600);
    return () => clearInterval(id);
  }, [on, reduce]);

  // Medidas de la app, a partir del ancho de la tarjeta. El abanico, más pequeño que en la app (0,6 en vez de 0,8;
  // Alberto, 2026-10-18) para que mande la tarjeta de arriba y el móvil.
  // La tarjeta de arriba, más pequeña (0,68 de la columna): en pantalla manda el móvil, no la animación.
  const cw = bw * 0.68;
  const ch = cw / CARD_RATIO;
  const FAN = 0.6;
  const details = ch + 24;
  const fanH = cw * FAN; // una tarjeta de pie mide lo que su ancho, a escala
  const H = details + 44 + 40 + fanH * 0.55;
  // La foto empieza más abajo que la tarjeta de arriba: la tarjeta y el móvil asoman por encima de ella.
  const T = ch * 0.4;
  const fanned = WALLET.map((_, k) => k).filter((k) => k !== sel);
  const slot = (k: number) => {
    if (k === sel) return { x: bw / 2, y: ch / 2, rotate: 0, scale: 1, z: 10 };
    const i = fanned.indexOf(k);
    const step = i - (fanned.length - 1) / 2;
    return {
      x: bw / 2 + step * ch * FAN * 0.42 * 2.2,
      y: H + Math.abs(step) * 6 - (step === 0 ? 20 : 0),
      rotate: 90 + step * 8,
      scale: FAN,
      z: 5 - Math.abs(step),
    };
  };
  const card = WALLET[sel];
  // El móvil, girado 30° y centrado en la foto, más alto que ella: sale por arriba y por abajo, por encima del abanico.
  const ph = (H - T) * 1.75;
  const pw = (ph * 517) / 1184;
  const ext = ph * Math.cos(Math.PI / 6) + pw * Math.sin(Math.PI / 6);
  const mid = (T + H) / 2;
  const padTop = wide ? Math.max(0, ext / 2 - mid) : 0;
  const padBottom = wide ? Math.max(0, mid + ext / 2 - H) : 0;
  return (
    <div ref={ref} className="relative left-1/2 w-screen -translate-x-1/2" style={{ paddingTop: padTop, paddingBottom: padBottom }}>
      <div className="relative" style={{ height: bw ? H : undefined }}>
        {/* Fondo: la foto desenfocada, apagada y teñida de berenjena. Prueba con el coche de noche (2026-10-18, Alberto: la
            de la cabina dejaba un gris amarillento a la izquierda); la de antes era photo-travel.jpg. */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: T }} aria-hidden>
          <div className="absolute inset-0 scale-125" style={{ background: `url(/maqueta/dovla/media/photo-invest-blur.jpg) center 60% / cover` }} /* desenfoque horneado: bake-blur.mjs */ />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(28,11,23,0.82), rgba(47,23,40,0.62) 45%, rgba(28,11,23,0.9))` }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(150,80,125,0.28), transparent 60%)" }} />
        </div>
        {/* Las tarjetas: el abanico se corta en el borde de abajo de la foto; por arriba no se corta nada. */}
        <div className={`${wrapX} relative grid h-full grid-cols-12 gap-x-4 md:gap-x-6`} style={{ clipPath: "inset(-100vh -100vw 0 -100vw)" }}>
          <div ref={box} className="relative col-span-12 h-full md:col-span-6 md:col-start-2">
            {bw > 0 &&
              WALLET.map((c, k) => {
                const s = slot(k);
                return (
                  <motion.div
                    key={c.img}
                    className="absolute left-0 top-0 drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
                    style={{ width: cw, height: ch, zIndex: s.z }}
                    initial={false}
                    animate={{ x: s.x - cw / 2, y: s.y - ch / 2, rotate: s.rotate, scale: s.scale }}
                    transition={reduce ? { duration: 0 } : WALLET_SPRING}
                  >
                    <Img src={`${KIT}/${c.img}.png`} alt="" loading="lazy" className="h-full w-full" />
                  </motion.div>
                );
              })}
            {bw > 0 && (
              <div className="absolute flex items-center justify-between" style={{ top: details, left: (bw - cw) / 2, width: cw, ...SF }}>
                <motion.div key={card.img} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.fast }}>
                  <p className="text-[17px] font-semibold" style={{ color: D.sand }}>{card.title}</p>
                  <p className="mt-0.5 text-[13px] tabular-nums" style={{ color: D.text2 }}>•••• {card.last4}</p>
                </motion.div>
                <GlassPill label="Freeze card" icon="snow" />
              </div>
            )}
          </div>
        </div>
        {bw > 0 && wide && (
          <div className="pointer-events-none absolute z-20 -translate-y-1/2" style={{ width: pw, right: "12%", top: mid }}>
            <div className="rotate-[30deg] drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]">
              <RealPhone src={video} label="The wallet in the app: picking a card from the fan and turning it over" />
            </div>
          </div>
        )}
      </div>
      {bw > 0 && !wide && (
        <div className="relative z-20 mx-auto -mt-20 w-[44%]">
          <div className="rotate-[30deg] drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]">
            <RealPhone src={video} label="The wallet in the app: picking a card from the fan and turning it over" />
          </div>
        </div>
      )}
    </div>
  );
}

