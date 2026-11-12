"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Logo nuevo de anico, dibujado por código (2026-10-18, propuesta de Alberto; Figma «ANICO-Portfolio-2026», nodo
   2335:8957). Cinco piezas del mismo módulo (62 × 62, hueco 6) y lo único que cambia es el radio de cada esquina,
   más el ancho de la «i» (medio módulo). Cada letra son dos mitades apiladas (arriba y abajo), cada una con sus
   cuatro esquinas: así se construye la «c» de Alberto —dos medios módulos con las esquinas opuestas a tope, que dejan
   la boca en el centro— y cualquier letra se puede interpolar con cualquier otra. El logo crece desde abajo y se curva. */

const H = 62; // alto del módulo
const W = 62; // ancho del módulo
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

/** Una sola letra a medio camino de otra (0 = `from`, 1 = `to`), centrada en x = 0 y con la parte de arriba en
    y = 0. Para el favicon, que pasa de una letra a la siguiente con el mismo gesto que el logo. */
export function glyph(from: Shape, to: Shape, t: number) {
  const w = lerp(from.w, to.w, t);
  return rect(-w / 2, 0, w, H / 2 + SEAM, mixHalf(from.top, to.top, t)) + rect(-w / 2, H / 2 - SEAM, w, H / 2 + SEAM, mixHalf(from.bot, to.bot, t));
}
export { H as MODULE };


/* ── Logo en Satoshi (2026-11-12, Alberto) ────────────────────────────────────────────────────────────────────────
   El de módulos no se leía (siluetas macizas, sin contraformas: «aaico», «anlco»). Ahora son cinco bloques que crecen
   desde abajo y, arriba, se recogen hacia la izquierda y destapan «anico» en Satoshi Bold (el peso de los titulares de la web; primero fue Black).
   Nacen iguales y repartidos; mientras se recogen se ajustan a su letra y la palabra se junta (Alberto, 2026-11-12).
   La «i» va sin punto (Alberto): se recorta con una máscara justo encima del asta.
   Licencia ITF FFL: la palabra es TEXTO VIVO con la fuente de la web, nunca trazos (pasarla a contornos como logo
   exige permiso escrito de ITF). El favicon sigue con las piezas de módulo de arriba.
   Medidas de Satoshi Bold (700) a 100 px (canvas measureText): avance, tinta izquierda/derecha, ascendente, descendente. */
const FS = 100;
const TRACK = -1;
const XH = 50.88; // altura de la x: el alto del logo. Todo lo que pase de aquí (el punto de la «i») queda fuera.
const METRICS: Record<(typeof WORD)[number], [adv: number, l: number, r: number, b: number]> = {
  a: [54.81, 4.09, 49.07, 1.27],
  n: [58.92, 6.34, 53.18, 0],
  i: [24.84, 4.93, 19.7, 0],
  c: [55.04, 3.37, 52.17, 1.27],
  o: [59.59, 3.37, 56.22, 1.2],
};
const GLYPHS = (() => {
  let x = 0;
  return WORD.map((ch) => {
    const [adv, l, r, b] = METRICS[ch];
    const g = { ch, x, l: x + l, w: r - l, b };
    x += adv + TRACK;
    return g;
  });
})();
const VB_X = GLYPHS[0].l;
const VB_W = GLYPHS[4].l + GLYPHS[4].w - VB_X;
const VB_B = Math.max(...GLYPHS.map((g) => g.b));
const FONT_TEST = "700 16px Satoshi";
/** De dónde salen los bloques: cinco cuadrados iguales, desde el borde izquierdo del logo y algo más separados de lo
    que acaba midiendo la palabra (sobresalen un poco por la derecha). Al destaparse, cada uno se ajusta a la caja de su
    letra (la «i» se estrecha) y se desliza hacia la izquierda a su sitio: la palabra se junta mientras se van. */
const START_GAP = 10;
const START_W = XH + VB_B;
const START_L = WORD.map((_, k) => VB_X + k * (START_W + START_GAP));

const FORM = 3800; // el logo formado, quieto, en cada vuelta del bucle
const EMPTY = 500; // sin logo, un instante, antes de volver a crecer

/** El logo. `play`: los bloques crecen desde abajo, una letra tras otra, y destapan la palabra (con movimiento reducido,
    ya formado). Cambiar `replay` lo vuelve a lanzar. `loop`: se forma, descansa, se tapa y baja, y otra vez, mientras
    esté montado (cabecera y cortinilla de carga). `rest`: cuánto descansa formado entre vuelta y vuelta. Si la fuente
    aún no ha llegado, los bloques esperan arriba en vez de destapar una letra de otra fuente. */
export default function LogoAnico({ className = "", play = true, replay = 0, loop = false, rest = FORM, color = "currentColor" }: { className?: string; play?: boolean; replay?: number; loop?: boolean; rest?: number; color?: string }) {
  const rects = useRef<(SVGRectElement | null)[]>([]);
  const texts = useRef<(SVGTextElement | null)[]>([]);
  const reduce = useReducedMotion();
  const clip = `anico-x-${useId().replace(/:/g, "")}`;
  useEffect(() => {
    const on = play && !reduce;
    // g: cuánto ha crecido el bloque (0–1). p: cuánto ha pasado de bloque igual a la caja de su letra, en su sitio
    // (0–1). m: cuánto se ha recogido hacia la izquierda para destapar la letra (0–1).
    const g: number[] = WORD.map(() => (on ? 0 : 1));
    const p: number[] = WORD.map(() => (on ? 0 : 1));
    const m: number[] = WORD.map(() => (on ? 0 : 1));
    const draw = () =>
      GLYPHS.forEach((G, k) => {
        const h = (XH + G.b) * g[k];
        const x = lerp(START_L[k], G.l, p[k]);
        const w = lerp(START_W, G.w, p[k]);
        const r = rects.current[k];
        r?.setAttribute("x", String(x));
        r?.setAttribute("y", String(G.b - h));
        r?.setAttribute("height", String(h));
        // Se recoge hacia la izquierda: el borde derecho del bloque corre hacia su borde izquierdo.
        r?.setAttribute("width", String(w * (1 - m[k])));
        // La letra viaja con su bloque hasta su sitio.
        const t = texts.current[k];
        t?.setAttribute("x", String(G.x + x - G.l));
        t?.setAttribute("opacity", m[k] > 0 ? "1" : "0");
      });
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
    const fontReady = () => document.fonts.load(FONT_TEST).then(() => undefined, () => undefined);
    // Crecer con la curva de las imágenes (inOut), y destapar con la misma, un poco más rápido.
    const form = async () => {
      runs = [];
      await Promise.all(WORD.map((_, k) => tween(g, k, 1, { duration: DUR.base, ease: EASE.inOut, delay: k * 0.09 })));
      await fontReady();
      if (!alive) return;
      // Juntarse y destapar a la vez: el bloque empieza a ajustarse a su letra y, poco después, a recogerse.
      await Promise.all(WORD.flatMap((_, k) => [
        tween(p, k, 1, { duration: DUR.base, ease: EASE.inOut, delay: k * 0.06 }),
        tween(m, k, 1, { duration: DUR.base * 0.75, ease: EASE.inOut, delay: k * 0.06 + DUR.base * 0.35 }),
      ]));
    };
    // Deshacer: el espejo de la entrada, más corto (las salidas van más rápidas). Los bloques vuelven a tapar sus letras
    // de izquierda a derecha y, a la vez, la palabra se abre otra vez en cuadrados iguales; luego bajan todos. Se abre
    // empezando por la «o» para que ningún bloque pise al de su derecha. (Antes cada letra encadenaba tapar → separarse
    // → bajar por su cuenta y, con el desfase, unas se separaban mientras las vecinas seguían tapando; Alberto,
    // 2026-11-12.)
    const unform = async () => {
      runs = [];
      const n = WORD.length - 1;
      await Promise.all(WORD.flatMap((_, k) => [
        tween(m, k, 0, { duration: DUR.base * 0.5, ease: EASE.inOut, delay: k * 0.05 }),
        tween(p, k, 0, { duration: DUR.base * 0.6, ease: EASE.inOut, delay: 0.15 + (n - k) * 0.05 }),
      ]));
      if (!alive) return;
      await Promise.all(WORD.map((_, k) => tween(g, k, 0, { duration: DUR.base * 0.5, ease: EASE.inOut, delay: k * 0.06 })));
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
    <svg viewBox={`${VB_X - 1} ${-XH - 1} ${VB_W + 2} ${XH + VB_B + 2}`} className={className} role="img" aria-label="anico" overflow="visible">
      <defs>
        <clipPath id={clip}>
          <rect x={VB_X - 10} y={-XH - 0.5} width={5 * START_W + 4 * START_GAP + 20} height={XH + VB_B + 10} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} fill={color}>
        {GLYPHS.map((G, k) => (
          <text
            key={G.ch}
            ref={(el) => void (texts.current[k] = el)}
            x={G.x}
            y={0}
            fontSize={FS}
            fontWeight={700}
            style={{ fontFamily: "Satoshi, sans-serif", fontKerning: "none" }}
            aria-hidden
          >
            {G.ch}
          </text>
        ))}
        {GLYPHS.map((G, k) => (
          <rect key={G.ch} ref={(el) => void (rects.current[k] = el)} x={G.l} y={-XH} width={G.w} height={0} />
        ))}
      </g>
    </svg>
  );
}
