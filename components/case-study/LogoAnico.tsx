"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Logo nuevo de anico, dibujado por código (2026-10-18, propuesta de Alberto; Figma «ANICO-Portfolio-2026», nodo
   2335:8957). Cinco piezas del mismo módulo (62 × 62, hueco 6) y lo único que cambia es el radio de cada esquina,
   más el ancho de la «i» (medio módulo). Cada letra son dos mitades apiladas (arriba y abajo), cada una con sus
   cuatro esquinas: así se construye la «c» de Alberto —dos medios módulos con las esquinas opuestas a tope, que dejan
   la boca en el centro— y cualquier letra se puede interpolar con cualquier otra. El logo crece desde abajo y se curva. */

const H = 62; // alto del módulo
const W = 62; // ancho del módulo
const GAP = 6;
const S = 0; // esquina recta (2026-10-18, Alberto: sin el redondeo mínimo, que restaba limpieza)
const F = 31; // esquina a tope
const K = 0.5523; // Bézier que imita un cuarto de círculo
const SEAM = 0.6; // las dos mitades se solapan un poco para que no se vea la junta

type Half = [tl: number, tr: number, br: number, bl: number];
type Shape = { w: number; top: Half; bot: Half };

export const LETTERS: Record<"a" | "n" | "i" | "c" | "o", Shape> = {
  a: { w: W, top: [F, F, 0, 0], bot: [0, 0, S, F] },
  // Cúpula entera. Se probó solo el hombro de arriba a la derecha (un test leyó «AMICO»), pero también podía leerse
  // como «M» y Alberto prefirió esta (2026-10-18).
  n: { w: W, top: [F, F, 0, 0], bot: [0, 0, S, S] },
  i: { w: W / 2, top: [S, S, 0, 0], bot: [0, 0, S, S] },
  c: { w: W, top: [F, S, F, 0], bot: [0, F, S, F] },
  o: { w: W, top: [F, F, 0, 0], bot: [0, 0, F, F] },
};
export const WORD = ["a", "n", "i", "c", "o"] as const;

/** Rectángulo de esquinas independientes, siempre con los mismos comandos (para poder animar de una forma a otra). */
function rect(x: number, y: number, w: number, h: number, [tl, tr, br, bl]: Half) {
  const q = (r: number) => r * (1 - K);
  const n = (v: number) => +v.toFixed(3);
  const R = x + w, B = y + h;
  return [
    `M${n(x + tl)} ${n(y)}`,
    `L${n(R - tr)} ${n(y)}`,
    `C${n(R - q(tr))} ${n(y)} ${n(R)} ${n(y + q(tr))} ${n(R)} ${n(y + tr)}`,
    `L${n(R)} ${n(B - br)}`,
    `C${n(R)} ${n(B - q(br))} ${n(R - q(br))} ${n(B)} ${n(R - br)} ${n(B)}`,
    `L${n(x + bl)} ${n(B)}`,
    `C${n(x + q(bl))} ${n(B)} ${n(x)} ${n(B - q(bl))} ${n(x)} ${n(B - bl)}`,
    `L${n(x)} ${n(y + tl)}`,
    `C${n(x)} ${n(y + q(tl))} ${n(x + q(tl))} ${n(y)} ${n(x + tl)} ${n(y)}Z`,
  ].join("");
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixHalf = (a: Half, b: Half, t: number) => a.map((v, i) => lerp(v, b[i], t)) as Half;

const FLAT: Half = [0, 0, 0, 0];
/** La «o» va pegada a la «c» (Alberto, 2026-10-18): con la boca y las esquinas curvas de la «c», el hueco normal la
    dejaba despegada. Mientras crecen rectas, las dos forman un solo bloque y se separan al curvarse. */
const gapAfter = (l: string) => (l === "c" ? 0 : GAP);

/** Las cinco letras colocadas una tras otra. Cada una crece desde abajo con su ancho final como un rectángulo de
    esquinas rectas (`g`: 0 = sin alto, 1 = alto entero) y después se curva donde toca (`c`: 0 = recta, 1 = letra).
    2026-10-18, Alberto: «que crezcan todos desde abajo… y después le aplicamos las curvas». */
function layout(g: number[], c: number[]) {
  let x = 0;
  return WORD.map((l, k) => {
    const L = LETTERS[l];
    const h = Math.max(0, H * g[k]), y = H - h, m = y + h / 2;
    // Mientras crece, las curvas no pueden pasar de la mitad de lo que ya mide.
    const cap = (r: Half) => r.map((v) => Math.min(v, h / 2)) as Half;
    const d = h <= 0 ? "" : rect(x, y, L.w, h / 2 + SEAM, cap(mixHalf(FLAT, L.top, c[k]))) + rect(x, m - SEAM, L.w, h / 2 + SEAM, cap(mixHalf(FLAT, L.bot, c[k])));
    x += L.w + gapAfter(l);
    return d;
  });
}
const ONE = WORD.map(() => 1);
const WIDTH = 4 * W + W / 2 + 3 * GAP;

/** Una sola letra a medio camino de otra (0 = `from`, 1 = `to`), centrada en x = 0 y con la parte de arriba en
    y = 0. Para el favicon, que pasa de una letra a la siguiente con el mismo gesto que el logo. */
export function glyph(from: Shape, to: Shape, t: number) {
  const w = lerp(from.w, to.w, t);
  return rect(-w / 2, 0, w, H / 2 + SEAM, mixHalf(from.top, to.top, t)) + rect(-w / 2, H / 2 - SEAM, w, H / 2 + SEAM, mixHalf(from.bot, to.bot, t));
}
export { H as MODULE };

const SPRING = { type: "spring", stiffness: 120, damping: 16 } as const;
const FORM = 3800; // el logo formado, quieto, en cada vuelta del bucle
const EMPTY = 500; // sin logo, un instante, antes de volver a crecer

/** El logo. `play`: crece desde abajo, una letra tras otra, y se curva (con movimiento reducido, ya formado).
    Cambiar `replay` lo vuelve a lanzar. `loop`: se forma, descansa, se deshace hacia abajo y otra vez, mientras esté
    montado (cabecera y cortinilla de carga). `rest`: cuánto descansa formado entre vuelta y vuelta. */
export default function LogoAnico({ className = "", play = true, replay = 0, loop = false, rest = FORM, color = "currentColor" }: { className?: string; play?: boolean; replay?: number; loop?: boolean; rest?: number; color?: string }) {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const reduce = useReducedMotion();
  useEffect(() => {
    const on = play && !reduce;
    const g: number[] = WORD.map(() => (on ? 0 : 1));
    const c: number[] = WORD.map(() => (on ? 0 : 1));
    const draw = () => layout(g, c).forEach((d, k) => paths.current[k]?.setAttribute("d", d));
    draw();
    if (!on) return;
    let alive = true;
    let timer = 0;
    let runs: ReturnType<typeof animate>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));
    const tween = (arr: number[], k: number, to: number, opts: Parameters<typeof animate>[2]) => {
      const r = animate(arr[k], to, { ...opts, onUpdate: (v: number) => ((arr[k] = v), draw()) });
      runs.push(r);
      return r;
    };
    // Crecer con la curva de las imágenes (inOut, la de máscaras y recortes; Alberto, 2026-10-18), por coherencia.
    // Formar: cada letra sube recta y, al llegar arriba, se curva. Deshacer: se endereza y baja.
    const form = () => {
      runs = [];
      return Promise.all(WORD.map((_, k) =>
        tween(g, k, 1, { duration: DUR.base, ease: EASE.inOut, delay: k * 0.09 }).then(() => tween(c, k, 1, SPRING)),
      ));
    };
    const unform = () => {
      runs = [];
      return Promise.all(WORD.map((_, k) =>
        tween(c, k, 0, { duration: DUR.fast, ease: EASE.inOut, delay: k * 0.09 }).then(() => tween(g, k, 0, { duration: DUR.fast, ease: EASE.inOut })),
      ));
    };
    (async () => {
      await wait(350);
      await form();
      while (loop && alive) {
        // Descanso con algo de azar (±30 %) para que la vuelta no llegue como un metrónomo.
        await wait(rest * (0.7 + Math.random() * 0.6));
        if (!alive) break;
        await unform();
        if (!alive) break;
        await wait(EMPTY);
        if (!alive) break;
        await form();
      }
    })();
    return () => {
      alive = false;
      clearTimeout(timer);
      runs.forEach((r) => r.stop());
    };
  }, [play, reduce, replay, loop, rest]);
  return (
    <svg viewBox={`-1 -1 ${WIDTH + 2} ${H + 2}`} className={className} role="img" aria-label="anico" overflow="visible">
      {WORD.map((l, k) => (
        <path key={l} ref={(el) => void (paths.current[k] = el)} d={layout(ONE, ONE)[k]} fill={color} />
      ))}
    </svg>
  );
}
