"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Img from "@/components/case-study/Img";
import RealPhone from "@/components/case-study/RealPhone";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { D } from "./DovlaPieces";

/* El UI kit de Dovla y las fotos con dovelas (2026-10-17, Alberto: «que se vea que toda la app está hecha en base a
   un UI kit»; banca privada, clientes con mucho patrimonio). Los componentes son recortes de capturas reales del
   simulador (scripts/case-media/dovla-kit.py → media/kit/, fuera de git) y la escala tipográfica va en imagen: Silka
   no tiene licencia para servirse en la web. Tokens de DovlaColor.swift / DovlaSpacing.swift del repo dovla-app. */

const KIT = "/maqueta/dovla/media/kit";
const SCREENS = "/maqueta/dovla/screens";
const NIGHT = "#1C0B17";

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

/* ───────────────────────── Foto con dovelas ───────────────────────── */

/** Cuántas dovelas cuelgan bajo cada columna: una bajo la primera, tres bajo la última (la escalera del Figma). */
const STAIR = [1, 2, 2, 3];
const COLS = 4;

/** Una dovela: cuarto de círculo que gira sobre su celda mientras la foto se queda quieta (contrarrotada). */
function Dovela({ src, col, row, turns, fade, rows }: { src: string; col: number; row: number; turns: number; fade: number; rows: number }) {
  const deg = turns * 90;
  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        left: `${(col / COLS) * 100}%`,
        top: `${(row / rows) * 100}%`,
        width: `${100 / COLS}%`,
        height: `${100 / rows}%`,
        borderTopLeftRadius: "100%",
        opacity: fade,
      }}
      animate={{ rotate: deg }}
      transition={{ type: "spring", stiffness: 60, damping: 14 }}
    >
      <motion.div
        className="absolute"
        style={{ width: `${COLS * 100}%`, height: `${rows * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%` }}
        animate={{ rotate: -deg }}
        transition={{ type: "spring", stiffness: 60, damping: 14 }}
      >
        <Img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      </motion.div>
    </motion.div>
  );
}

/** La foto se deshace por abajo en una escalera de dovelas que giran solas, como en las hojas de la app. Cada
    pieza gira sobre su centro; la foto, contrarrotada, se queda en su sitio y lo que cambia es el recorte. */
export function DovelaPhoto({ src, alt, ratio = 4 / 5, className = "" }: { src: string; alt: string; ratio?: number; className?: string }) {
  const reduce = useReduce();
  const { ref, on } = useInView<HTMLDivElement>();
  const rows = Math.round(COLS / ratio); // celdas cuadradas
  const full = rows - Math.max(...STAIR); // filas de foto entera; la escalera llega justo al pie
  const pieces = STAIR.flatMap((n, col) => Array.from({ length: n }, (_, k) => ({ col, row: full + k, fade: 1 - (k + 1) / (n + 1.4) })));
  const [turns, setTurns] = useState<number[]>(() => pieces.map(() => 0));
  useEffect(() => {
    if (!on || reduce) return;
    let last = -1;
    let id = 0;
    const tick = () => {
      let i = Math.floor(Math.random() * pieces.length);
      if (i === last) i = (i + 1) % pieces.length;
      last = i;
      setTurns((t) => t.map((v, k) => (k === i ? v + 1 : v)));
      id = window.setTimeout(tick, 900 + Math.random() * 900);
    };
    id = window.setTimeout(tick, 1200);
    return () => clearTimeout(id);
  }, [on, reduce, pieces.length]);
  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={alt}>
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: `${(full / rows) * 100}%` }}>
        <div className="absolute inset-x-0 top-0" style={{ height: `${(rows / full) * 100}%` }}>
          <Img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
      {pieces.map((p, k) => (
        <Dovela key={k} src={src} col={p.col} row={p.row} rows={rows} turns={turns[k]} fade={p.fade} />
      ))}
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
export function TypeScale() {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
      <FadeIn className="col-span-12 md:col-span-4">
        <Img src={`${KIT}/type-aa.png`} alt="Silka, the brand typeface" loading="lazy" className="w-[9rem] md:w-[13rem]" />
        <p className="mt-6 text-[14px]" style={{ color: D.sand }}>Silka</p>
        <p className="mt-1 max-w-[28ch] text-[12px]" style={{ color: D.text3 }}>Eight styles, each tied to a Dynamic Type size so it grows with the reader’s settings.</p>
      </FadeIn>
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
    <div ref={ref} className="grid grid-cols-12 gap-x-4 gap-y-14 md:gap-x-6">
      <div className="col-span-12 md:col-span-5">
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

/** Una pieza del kit a su tamaño en pt (escala con la columna), con su nombre debajo. */
function Piece({ img, name, w, note, delay = 0 }: { img: string; name: string; w: number; note?: string; delay?: number }) {
  return (
    <FadeIn delay={delay} className="break-inside-avoid pb-10">
      <div className="flex justify-center px-5 py-8 md:px-8 md:py-10" style={{ background: "rgba(235,211,184,0.04)" }}>
        <Img src={`${KIT}/${img}.png`} alt={name} loading="lazy" style={{ width: w, maxWidth: "100%" }} />
      </div>
      <div className="mt-3"><Spec name={name} value={note} /></div>
    </FadeIn>
  );
}

/** Hoja de componentes: lo que se repite por toda la app, cada uno definido una sola vez. */
export function KitSheet() {
  return (
    <div className="gap-x-4 md:columns-3 md:gap-x-6">
      <Piece img="transactions" name="Transaction row" note="Tile group · 2 pt joint" w={370} />
      <Piece img="button" name="Primary button" note="56 pt" w={370} delay={0.05} />
      <Piece img="button-2" name="Secondary button" note="56 pt" w={370} delay={0.05} />
      <Piece img="months" name="Month selector" note="Follows the scroll" w={390} delay={0.1} />
      <Piece img="promo" name="Promo card" note="Carousel" w={370} />
      <Piece img="actions" name="Quick actions" note="48 pt" w={370} delay={0.05} />
      <Piece img="wealth" name="Amount rows" note="Never truncated" w={370} delay={0.1} />
      <Piece img="chart" name="Spending chart" note="Month to date" w={370} />
      <Piece img="tabbar" name="Tab bar" note="Floating" w={366} delay={0.05} />
      <Piece img="discover" name="Product row" note="Inline action" w={370} delay={0.1} />
      <Piece img="detail" name="Detail rows" w={370} />
      <Piece img="accounts" name="Account picker" w={118} delay={0.05} />
      <Piece img="freeze" name="Compact button" note="44 pt" w={131} delay={0.1} />
    </div>
  );
}

/** Las cuatro tarjetas: una familia, el mismo patrón en cuatro tonos. Se abren en abanico al entrar. */
export function CardFamily() {
  const { ref, on } = useInView<HTMLDivElement>("-20% 0px");
  const reduce = useReduce();
  const cards = [
    { img: "card-physical", name: "Debit · Metal" },
    { img: "card-credit", name: "Credit" },
    { img: "card-virtual", name: "Virtual" },
    { img: "card-disposable", name: "Disposable · frozen" },
  ];
  const open = reduce || on;
  return (
    <div ref={ref}>
      <div className="relative mx-auto aspect-[16/9] w-full max-w-[64rem]">
        {cards.map((c, k) => {
          const spread = k - 1.5;
          return (
            <motion.div
              key={c.img}
              className="absolute left-1/2 top-1/2 w-[46%] drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
              style={{ x: "-50%", y: "-50%", zIndex: 4 - k }}
              initial={reduce ? false : { rotate: 0, translateX: "0%", translateY: "0%" }}
              animate={open ? { rotate: spread * 7, translateX: `${spread * 34}%`, translateY: `${Math.abs(spread) * 6}%` } : { rotate: 0, translateX: "0%", translateY: "0%" }}
              transition={{ type: "spring", stiffness: 70, damping: 16, delay: k * 0.05 }}
            >
              <Img src={`${KIT}/${c.img}.png`} alt={`Dovla ${c.name} card`} loading="lazy" className="w-full" />
            </motion.div>
          );
        })}
      </div>
      <div className="mx-auto mt-10 grid max-w-[64rem] grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
        {cards.map((c) => (
          <Spec key={c.img} name={c.name} />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Del kit a la pantalla ───────────────────────── */

/** Marcos en pt (pantalla de 402×874) de cada pieza en la Home, sacados del árbol de accesibilidad. */
const SPOTS = [
  { name: "Balance header", x: 40, y: 134, w: 322, h: 104 },
  { name: "Account picker", x: 142, y: 255, w: 118, h: 40 },
  { name: "Quick actions", x: 16, y: 314, w: 370, h: 80 },
  { name: "Transaction rows", x: 16, y: 452, w: 370, h: 222 },
  { name: "Text button", x: 16, y: 676, w: 370, h: 56 },
  { name: "Promo card", x: 16, y: 756, w: 370, h: 128 },
  { name: "Tab bar", x: 18, y: 791, w: 366, h: 60 },
];

/** La Home desmontada: va señalando cada componente del kit sobre la pantalla real, uno tras otro. */
export function KitToScreen() {
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % SPOTS.length), 1800);
    return () => clearInterval(id);
  }, [on, reduce]);
  const s = SPOTS[i];
  return (
    <div ref={ref} className="grid grid-cols-12 items-center gap-x-4 gap-y-12 md:gap-x-6">
      <div className="col-span-10 col-start-2 md:col-span-4 md:col-start-2">
        <RealPhone label="Dovla home screen">
          <Img src={`${SCREENS}/home.png`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          {/* Velo: todo un poco apagado salvo la pieza señalada. */}
          <motion.div
            className="pointer-events-none absolute"
            animate={{ left: s.x - 6, top: s.y - 6, width: s.w + 12, height: s.h + 12 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ borderRadius: 26, boxShadow: `0 0 0 2000px rgba(28,11,23,0.62), inset 0 0 0 2px ${D.sand}` }}
          />
        </RealPhone>
      </div>
      <ol className="col-span-12 md:col-span-5 md:col-start-7">
        {SPOTS.map((x, k) => (
          <li key={x.name}>
            <button
              type="button"
              onMouseEnter={() => setI(k)}
              onFocus={() => setI(k)}
              onClick={() => setI(k)}
              className="flex w-full items-baseline justify-between border-t py-4 text-left transition-colors"
              style={{ borderColor: "rgba(235,211,184,0.18)", color: k === i ? D.sand : D.text3, transitionDuration: `${DUR.fast}s` }}
            >
              <span className="t-title">{x.name}</span>
              <span className="text-[12px] tabular-nums">{String(k + 1).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────────────────── Claro y oscuro ───────────────────────── */

/** Claro y oscuro: los mismos componentes, dos juegos de tokens. Se arrastra (o se pasa el ratón) para cambiar. */
export function LightDark() {
  const box = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);
  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setX(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [30, -30]);
  return (
    <motion.div
      ref={box}
      style={{ y: lift }}
      className="relative mx-auto w-full max-w-[22rem] touch-none select-none"
      onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), drag(e.clientX))}
      onPointerMove={(e) => (e.buttons || e.pointerType === "mouse") && drag(e.clientX)}
    >
      <RealPhone label="Dovla home in light and dark appearance">
        <Img src={`${SCREENS}/home-light.png`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
          <Img src={`${SCREENS}/home.png`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="absolute inset-y-0 w-[2px]" style={{ left: `${x}%`, background: D.sand }} />
      </RealPhone>
    </motion.div>
  );
}
