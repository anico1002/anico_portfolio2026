"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Img from "@/components/case-study/Img";
import RealPhone from "@/components/case-study/RealPhone";
import LazyVideo from "@/components/case-study/LazyVideo";
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
function slice(i: number, g: Grid, col: number, row: number): React.CSSProperties {
  const p = PHOTOS[i];
  const [bw, bh] = g.W / g.H > p.r ? [g.W, g.W / p.r] : [g.H * p.r, g.H];
  const oy = Math.min(0, Math.max(g.H - bh, g.H / 2 - bh * p.y));
  return {
    backgroundImage: `url(${p.src})`,
    backgroundSize: `${bw}px ${bh}px`,
    backgroundPosition: `${(g.W - bw) / 2 - col * g.cell}px ${oy - row * g.cell}px`,
  };
}

type Cell = { from: number; to: number; n: number };

/** Una celda: debajo, la foto que había; encima, la nueva entra como una dovela (cuarto de círculo) que gira sobre
    su centro y se cuadra al acabar. La foto va contrarrotada, así que se queda quieta y lo que gira es el recorte. */
function MosaicCell({ g, col, row, c }: { g: Grid; col: number; row: number; c: Cell }) {
  const box = { left: col * g.cell, top: row * g.cell, width: g.cell, height: g.cell };
  return (
    <div className="absolute" style={box}>
      <div className="absolute inset-0" style={slice(c.from, g, col, row)} />
      {c.n > 0 && (
        <motion.div
          key={c.n}
          className="absolute inset-0 overflow-hidden"
          initial={{ rotate: -90, opacity: 0, borderTopLeftRadius: "100%" }}
          animate={{ rotate: 0, opacity: 1, borderTopLeftRadius: ["100%", "100%", "0%"] }}
          transition={{ duration: TURN, ease: EASE.inOut, opacity: { duration: TURN * 0.35 }, borderTopLeftRadius: { duration: TURN, times: [0, 0.7, 1] } }}
        >
          <motion.div
            className="absolute inset-0"
            style={slice(c.to, g, col, row)}
            initial={{ rotate: 90 }}
            animate={{ rotate: 0 }}
            transition={{ duration: TURN, ease: EASE.inOut }}
          />
        </motion.div>
      )}
    </div>
  );
}

/** El mosaico de dovelas a sangre, con la app encima (2026-10-18, Alberto): las dovelas giran y a cada giro cambian
    la foto; una ola cruza el mosaico y compone entera la siguiente (cabina, velero, coche) y vuelta a empezar. */
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
      const W = el.clientWidth, H = el.clientHeight;
      const cols = W >= 768 ? 8 : 4;
      const cell = W / cols;
      const rows = Math.ceil(H / cell);
      setG({ W, H, cell, cols, rows });
      setCells(Array.from({ length: cols * rows }, () => ({ from: shown.current, to: shown.current, n: 0 })));
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
        timers.push(window.setTimeout(() => setCells((cs) => cs.map((c, j) => (j === k ? { from: c.to, to: next, n: c.n + 1 } : c))), t * 1000));
      }
      timers.push(window.setTimeout(wave, (WAVE + TURN + HOLD) * 1000));
    };
    timers.push(window.setTimeout(wave, 1200));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduce, size]);
  const phone = g ? Math.min((g.H * 0.86 * 517) / 1184, g.W * 0.62) : 0;
  return (
    <div
      ref={ref}
      className="relative aspect-[3/4] w-full overflow-hidden md:aspect-[16/9]"
      style={{ background: NIGHT }}
      role="img"
      aria-label="The Dovla app over a mosaic of turning dovelas that composes a cabin window, a yacht at sunset and a car at night"
    >
      {g && cells.map((c, k) => <MosaicCell key={`${size}-${k}`} g={g} col={k % g.cols} row={Math.floor(k / g.cols)} c={c} />)}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(28,11,23,0.35), rgba(28,11,23,0.15) 70%)" }} />
      {g && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]" style={{ width: phone }}>
          <RealPhone src={video} label="Dovla, from the splash screen to the home screen" />
        </div>
      )}
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
      <Img src={`${KIT}/chart.png`} alt="Spending chart" loading="lazy" className="block w-full" />
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

/** Hoja de componentes: lo que se repite por toda la app, cada uno definido una sola vez. Los que se mueven en la
    app (carrusel, meses, barra de pestañas, gráfica) se mueven también aquí. */
export function KitSheet() {
  return (
    <div className="gap-x-4 md:columns-3 md:gap-x-6">
      <Piece img="transactions" name="Transaction row" note="Tile group · 2 pt joint" w={370} />
      <Piece img="button" name="Primary button" note="56 pt" w={370} delay={0.05} />
      <Piece img="button-2" name="Secondary button" note="56 pt" w={370} delay={0.05} />
      <Piece img="months" name="Month selector" note="Follows the scroll" w={390} delay={0.1} video />
      <Piece img="promo" name="Promo card" note="Carousel" w={370} video r={20} />
      <Piece img="actions" name="Quick actions" note="48 pt" w={370} delay={0.05} />
      <Piece img="wealth" name="Amount rows" note="Never truncated" w={370} delay={0.1} />
      <Piece img="chart" name="Spending chart" note="Month to date" w={370}>
        <LiveChart w={370} />
      </Piece>
      <Piece img="tabbar" name="Tab bar" note="Floating" w={366} delay={0.05} video r={30} />
      <Piece img="discover" name="Product row" note="Inline action" w={370} delay={0.1} />
      <Piece img="detail" name="Detail rows" w={370} />
      <Piece img="accounts" name="Account picker" w={118} delay={0.05} />
      <Piece img="freeze" name="Compact button" note="44 pt" w={131} delay={0.1} />
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
      <div className="absolute inset-0 scale-125" style={{ background: `url(/maqueta/dovla/media/photo-travel.jpg) center / cover`, filter: "blur(48px) saturate(0.9)" }} aria-hidden />
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
  const { ref, on } = useInView<HTMLDivElement>("-25% 0px");
  const reduce = useReduce();
  const [x, setX] = useState(50);
  const [done, setDone] = useState(false); // el barrido de aviso ya se hizo (o ya lo han tocado)
  const hint = on && !reduce && !done;
  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setDone(true);
    setX(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };
  const line = hint ? { left: ["50%", "30%", "70%", "50%"] } : { left: `${x}%` };
  const lineT = hint ? { duration: 2.8, ease: EASE.inOut, times: [0, 0.3, 0.75, 1] } : { duration: 0 };
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
          <div className="relative h-full w-full overflow-hidden rounded-[11%/5.2%] bg-black">
            <Img src={`${SCREENS}/home-light.png`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <motion.div className="absolute inset-0" animate={hint ? { clipPath: ["inset(0 50% 0 0)", "inset(0 70% 0 0)", "inset(0 30% 0 0)", "inset(0 50% 0 0)"] } : { clipPath: `inset(0 ${100 - x}% 0 0)` }} transition={lineT} onAnimationComplete={() => hint && setDone(true)}>
              <Img src={`${SCREENS}/home.png`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
          </div>
        </div>
        <motion.div className="absolute inset-y-0 w-px" style={{ background: D.sand }} animate={line} transition={lineT}>
          <span className="absolute left-1/2 top-[38%] grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full text-[13px]" style={{ background: D.sand, color: D.bg }} aria-hidden>
            ⇆
          </span>
        </motion.div>
      </div>
    </div>
  );
}
