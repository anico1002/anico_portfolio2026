"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Piezas de Dovla (UI/UX de una app nativa iOS de un neobanco), recreadas con sus tokens reales
   (DovlaColor.swift del repo dovla-app). Tipografía de respaldo de la app (SF Pro): la definitiva está
   pendiente de licencia y de decisión. Importes y movimientos de ejemplo, como los datos de prueba de la app. */

export const D = {
  bg: "#2F1728",
  plum: "#42283E",
  elevated: "#563D4D",
  sand: "#EBD3B8",
  text2: "#D4BCA8",
  text3: "#8D7570",
  separator: "#715860",
  positive: "#7FB08A",
  negative: "#E08A72",
} as const;

const SF = { fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' } as const;
const eur = (v: number) => "€" + v.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

/** Cifra en la que solo ruedan los dígitos que cambian (como `.numericText()` de SwiftUI). */
function RollingAmount({ value }: { value: number }) {
  const chars = eur(value).split("");
  return (
    <span className="inline-flex overflow-hidden tabular-nums" style={{ letterSpacing: "-0.02em" }}>
      {chars.map((c, i) => (
        <span key={i} className="relative inline-block">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={c + i}
              className="inline-block"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE.out }}
            >
              {c}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

const MOVES = [
  { who: "Mercadona", what: "Today · Groceries", v: -47.32 },
  { who: "Renfe", what: "Today · Transport", v: -12.4 },
  { who: "Marta Ferrer", what: "Yesterday · Transfer received", v: 25 },
  { who: "Netflix", what: "Ayer · Suscripción", v: -13.99 },
  { who: "Nómina", what: "30 sep · Ingreso", v: 2340 },
  { who: "Farmacia", what: "29 sep · Salud", v: -18.6 },
  { who: "Alquiler", what: "28 sep · Vivienda", v: -950 },
  { who: "Bar Pinotxo", what: "27 sep · Restaurantes", v: -32.5 },
];

/** El saldo que viaja en el tiempo: al bajar por los movimientos, la cifra enseña lo que había en cada uno. */
export function BalanceTimeTravel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const now = 48735.5;
  // Saldo justo antes de cada movimiento (de hoy hacia atrás).
  const balances = useMemo(() => {
    const out = [now];
    let b = now;
    for (const m of MOVES) {
      b -= m.v;
      out.push(Math.round(b * 100) / 100);
    }
    return out;
  }, []);
  const [i, setI] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setI(Math.min(MOVES.length, Math.max(0, Math.floor(((v - 0.1) / 0.8) * (MOVES.length + 1)))))), [scrollYProgress]);

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[260vh]"}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center px-4 py-20 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <div className="col-span-12 md:col-span-4">
            <p className="t-label t-tag text-[var(--case-muted)]">El saldo</p>
            <p className="mt-4 t-statement">El saldo viaja en el tiempo.</p>
            <p className="mt-6 t-body text-[var(--case-muted)]">
              Al bajar por los movimientos, la cifra de arriba enseña lo que había en cada momento. Solo cambian los
              dígitos que varían, para que el ojo vea qué se ha movido.
            </p>
          </div>
          <div className="col-span-12 flex justify-center md:col-span-6 md:col-start-7">
            <div className="w-full max-w-[24rem] rounded-[2.6rem] p-3" style={{ background: "#120910" }}>
              <div className="overflow-hidden rounded-[2.1rem] px-5 pb-6 pt-8" style={{ background: D.bg, color: D.sand, ...SF }}>
                <p className="text-[13px]" style={{ color: D.text2 }}>
                  Main · EUR {i > 0 && <span style={{ color: D.text3 }}>· {MOVES[i - 1].what.split(" · ")[0]}</span>}
                </p>
                <p className="mt-1 text-[2.6rem] font-semibold leading-none">
                  <RollingAmount value={balances[i]} />
                </p>
                <div className="mt-6 space-y-[2px]">
                  {MOVES.map((m, k) => (
                    <div
                      key={m.who}
                      className="flex items-center justify-between rounded-[10px] px-4 py-3 transition-opacity duration-300"
                      style={{ background: D.plum, opacity: k < i ? 0.35 : 1 }}
                    >
                      <span>
                        <span className="block text-[15px] font-medium">{m.who}</span>
                        <span className="block text-[12px]" style={{ color: D.text3 }}>
                          {m.what}
                        </span>
                      </span>
                      <span className="text-[15px] font-medium tabular-nums" style={{ color: m.v > 0 ? D.positive : D.negative }}>
                        {m.v > 0 ? "+" : "−"}
                        {eur(Math.abs(m.v))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Una pantalla de la Home: la de antes (extracto) o la de ahora (escaparate). */
function Screen({ kind }: { kind: "extract" | "showcase" }) {
  return (
    <div className="absolute inset-0 px-6 pt-8 md:px-10" style={{ background: D.bg, color: D.sand, ...SF }}>
      <p className="text-[13px]" style={{ color: D.text2 }}>Main · EUR</p>
      <p className="text-[2rem] font-semibold">48.735,50 €</p>
      {kind === "extract" ? (
        <div className="mt-5 space-y-[2px]">
          {Array.from({ length: 14 }, (_, k) => (
            <div key={k} className="flex justify-between rounded-[8px] px-4 py-2.5 text-[13px]" style={{ background: D.plum }}>
              <span>{MOVES[k % MOVES.length].who}</span>
              <span style={{ color: MOVES[k % MOVES.length].v > 0 ? D.positive : D.negative }}>{eur(MOVES[k % MOVES.length].v)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-[6px]">
          <div className="col-span-2 rounded-[12px] p-4" style={{ background: D.plum }}>
            <p className="text-[12px]" style={{ color: D.text2 }}>Movimientos de hoy</p>
            <p className="mt-1 text-[14px]">Mercadona · Renfe <span style={{ color: D.text3 }}>· Ver todo</span></p>
          </div>
          {[
            ["Tarjeta de crédito", "Límite de hasta 10.000 €"],
            ["Préstamo personal", "Un presupuesto en minutos"],
            ["Transferencia internacional", "Rápidas, seguras y económicas"],
            ["Gastado este mes", "120 € menos que a estas alturas"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-[12px] p-4" style={{ background: D.plum }}>
              <p className="text-[13px] font-medium">{t}</p>
              <p className="mt-1 text-[11px]" style={{ color: D.text3 }}>{d}</p>
            </div>
          ))}
          <div className="rounded-[12px] p-4" style={{ background: D.elevated }}>
            <p className="text-[13px] font-medium">Patrimonio total</p>
            <p className="mt-1 text-[11px]" style={{ color: D.text2 }}>Cuentas, ahorro e inversión</p>
          </div>
        </div>
      )}
      <p className="absolute bottom-4 left-6 text-[11px] uppercase tracking-[0.1em] md:left-10" style={{ color: D.text3 }}>
        {kind === "extract" ? "Antes: un extracto" : "Ahora: un escaparate"}
      </p>
    </div>
  );
}

/** De extracto a escaparate: antes/después que se arrastra. */
export function ExtractToShowcase() {
  const box = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);
  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setX(Math.min(95, Math.max(5, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className="relative aspect-[4/5] w-full touch-none select-none overflow-hidden md:aspect-[16/10]"
      onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), drag(e.clientX))}
      onPointerMove={(e) => e.buttons && drag(e.clientX)}
    >
      <Screen kind="showcase" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        <Screen kind="extract" />
      </div>
      <div className="absolute inset-y-0 w-[2px] cursor-ew-resize" style={{ left: `${x}%`, background: D.sand }}>
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[14px]" style={{ background: D.sand, color: D.bg }}>
          ⇆
        </span>
      </div>
    </div>
  );
}

/** Un dato, no un piropo: gasto acumulado de este mes (hasta el día 15) frente al mes pasado, comparado con
    el mes completo (siempre parece una mejora) o con el mismo día (la comparación justa). Cifras de ejemplo. */
export function HonestChart() {
  const [fair, setFair] = useState(true);
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setFair((f) => !f), 3200);
    return () => clearInterval(id);
  }, [on, reduce]);
  const last = Array.from({ length: 31 }, (_, d) => Math.round(42 * (d + 1) + 8 * Math.sin(d / 2)));
  const now = Array.from({ length: 15 }, (_, d) => Math.round(45 * (d + 1) + 10 * Math.sin(d / 1.7)));
  const W = 600;
  const H = 260;
  const max = last[30];
  const pts = (arr: number[]) => arr.map((v, d) => `${(d / 30) * W},${H - (v / max) * H}`).join(" ");
  const diffFair = now[14] - last[14];
  const diffFull = now[14] - last[30];
  return (
    <div ref={ref} className="grid grid-cols-12 items-center gap-x-4 gap-y-8 md:gap-x-6">
      <div className="col-span-12 p-6 md:col-span-7 md:p-8" style={{ background: D.bg, color: D.sand, ...SF }}>
        <p className="text-[13px]" style={{ color: D.text2 }}>Gastado este mes</p>
        <AnimatePresence mode="wait">
          <motion.p key={String(fair)} className="mt-1 text-[1.4rem] font-semibold" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: DUR.fast }}>
            {fair
              ? `${eur(Math.abs(diffFair))} ${diffFair > 0 ? "más" : "menos"} que a estas alturas del mes pasado`
              : `${eur(Math.abs(diffFull))} menos que el mes pasado`}
          </motion.p>
        </AnimatePresence>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full">
          <polyline points={pts(last)} fill="none" stroke={D.text3} strokeWidth="2" strokeDasharray="5 6" />
          <polyline points={pts(now)} fill="none" stroke={D.sand} strokeWidth="3" />
          <motion.line
            y1={0}
            y2={H}
            stroke={fair ? D.sand : D.negative}
            strokeWidth="1.5"
            animate={{ x1: fair ? (14 / 30) * W : W, x2: fair ? (14 / 30) * W : W }}
            transition={{ duration: DUR.base, ease: EASE.inOut }}
          />
        </svg>
      </div>
      <div className="col-span-12 md:col-span-4 md:col-start-9">
        <div className="inline-flex rounded-full border border-[var(--case-line)] p-1 t-small">
          {[
            [false, "Contra el mes entero"],
            [true, "Contra el mismo día"],
          ].map(([v, l]) => (
            <button key={String(v)} type="button" onClick={() => setFair(v as boolean)} className="rounded-full px-4 py-2 transition-colors" style={{ background: fair === v ? "var(--case-fg)" : undefined, color: fair === v ? "var(--case-bg)" : undefined }}>
              {l as string}
            </button>
          ))}
        </div>
        <p className="mt-6 t-body text-[var(--case-muted)]">
          Medio mes contra un mes entero siempre parece una mejora: es un piropo, no un dato. La app compara con el
          mismo día del mes pasado.
        </p>
      </div>
    </div>
  );
}

/** Teselas del patrón para una semilla (generador pseudoaleatorio determinista: misma semilla, mismo dibujo). */
function tilesFor(seed: number) {
  let s = seed * 7919;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 6 * 4 }, () => ({ r: rnd(), rot: Math.floor(rnd() * 4) * 90 }));
}

/** El patrón dovela: teselado de cuartos de círculo (la dovela sostiene el arco). Se regenera al pasar. */
export function DovelaPattern() {
  const [seed, setSeed] = useState(7);
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setSeed((s) => s + 1), 2600);
    return () => clearInterval(id);
  }, [on, reduce]);
  const tiles = useMemo(() => tilesFor(seed), [seed]);
  return (
    <div ref={ref} className="grid grid-cols-6 overflow-hidden" style={{ background: D.bg }} onMouseEnter={() => setSeed((s) => s + 1)}>
      {tiles.map((t, k) => (
        <motion.svg key={k} viewBox="0 0 100 100" className="aspect-square w-full" animate={{ rotate: t.rot }} transition={{ duration: DUR.slow, ease: EASE.inOut }}>
          {/* Pesos del repo: 55 / 15 / 12 / 18 */}
          {t.r < 0.55 ? (
            <path d="M0 0 H100 A100 100 0 0 1 0 100 Z" transform="rotate(180 50 50)" fill={D.plum} />
          ) : t.r < 0.7 ? (
            <>
              <path d="M0 0 H50 A50 50 0 0 1 0 50 Z" transform="rotate(180 50 50)" fill={D.plum} />
              <path d="M100 100 H50 A50 50 0 0 1 100 50 Z" transform="rotate(180 50 50)" fill={D.plum} />
            </>
          ) : t.r < 0.82 ? (
            <rect width="100" height="100" fill={D.plum} />
          ) : null}
        </motion.svg>
      ))}
    </div>
  );
}

/** Texto grande: con el tamaño de accesibilidad al máximo, la fila se apila y el importe nunca se parte. */
export function LargeText() {
  const [big, setBig] = useState(false);
  const { ref, on } = useInView<HTMLDivElement>();
  const reduce = useReduce();
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setBig((b) => !b), 2800);
    return () => clearInterval(id);
  }, [on, reduce]);
  return (
    <div ref={ref} className="mx-auto w-full max-w-[24rem] rounded-[2.6rem] p-3" style={{ background: "#120910" }}>
      <div className="min-h-[22rem] rounded-[2.1rem] px-5 py-8" style={{ background: D.bg, color: D.sand, ...SF }}>
        <p className="text-[12px] uppercase tracking-[0.1em]" style={{ color: D.text3 }}>
          Text size {big ? "200%" : "100%"}
        </p>
        {MOVES.slice(0, 3).map((m) => (
          <motion.div
            key={m.who}
            layout
            className={`mt-2 rounded-[10px] px-4 py-3 ${big ? "flex flex-col gap-1" : "flex items-center justify-between"}`}
            style={{ background: D.plum }}
            transition={{ duration: DUR.base, ease: EASE.inOut }}
          >
            <motion.span layout className="font-medium" style={{ fontSize: big ? 26 : 15 }}>
              {m.who}
            </motion.span>
            <motion.span layout className="whitespace-nowrap font-semibold tabular-nums" style={{ fontSize: big ? 26 : 15, color: m.v > 0 ? D.positive : D.negative }}>
              {m.v > 0 ? "+" : "−"}
              {eur(Math.abs(m.v))}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
