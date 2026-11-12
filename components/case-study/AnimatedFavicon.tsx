"use client";

import { useEffect } from "react";
import { FONT_TEST, METRICS, WORD, X_HEIGHT } from "@/components/case-study/LogoAnico";
import { DUR } from "@/lib/maqueta/motion";

/* Favicon animado (E5, 2026-10-13; idea de Alberto tras verlo en Yakushev): la «a» del logo en blanco sobre negro y,
   de vez en cuando, una vuelta por las letras —a, n, i, c, o— hasta volver a la «a», que es la imagen principal y donde
   descansa. Desde el 2026-11-12 va con el logo en Satoshi Bold y el mismo gesto de la cabecera, en una sola casilla:
   al llegar, el bloque blanco del favicon fijo se ajusta a la «a» y se recoge hacia la izquierda; para pasar a la
   letra siguiente, el bloque vuelve a tapar la actual de izquierda a derecha, se ajusta a la caja de la siguiente
   y se recoge otra vez. La «i» sin punto, como en el logo. (Las versiones de módulos están en el historial de git.)
   Se dibuja en un canvas con la fuente de la web (texto vivo: nada de contornos, por la licencia ITF FFL) y se cambia
   el `href` de todos los <link rel="icon"> (uno propio delante y los de Next). Antes de que arranque (sin JS, con
   movimiento reducido o mientras llega Satoshi) se ve el bloque fijo de public/maqueta/favicon-bloque.svg. */

const SIZE = 64;
const FS = 75; // altura de la x: 38 px de 64, lo que medía el módulo del favicon anterior
const K = FS / 100; // las medidas de METRICS son a 100 px
const XH = X_HEIGHT * K;
const BASE = (SIZE + XH) / 2; // línea base: la altura de la x queda centrada en vertical
const REST_A = 4000; // descanso en la «a» antes de cada vuelta
const HOLD = 450; // cada letra intermedia, quieta
const MORPH = DUR.base * 1000; // cada cambio de letra
const FPS = 30;

/** Power3.easeInOut, la curva `inOut` del sistema. */
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
/** Tramo `a`–`b` de un progreso 0–1, ya con la curva. */
const seg = (p: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (p - a) / (b - a))));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Caja de tinta de cada letra, centrada en la casilla, y dónde va su origen de texto. */
const BOX = WORD.map((ch) => {
  const [, l, r, b] = METRICS[ch];
  const w = (r - l) * K;
  const x = (SIZE - w) / 2;
  return { ch, x, w, ox: x - l * K, b: b * K };
});
/** El bloque del favicon fijo: un cuadrado de la altura de la x, centrado. */
const SQUARE = { x: (SIZE - XH) / 2, w: XH };

export default function AnimatedFavicon() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let alive = true;
    let timer = 0;
    let icons: HTMLLinkElement[] = [];
    let saved: (readonly [string, string])[] = [];
    let link: HTMLLinkElement | null = null;

    /** Un fotograma: letra `ch` a la vista (o ninguna) y un bloque en `x`, `w`. */
    const render = (ch: string | null, x: number, w: number, bottom: number) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "#fff";
      ctx.save();
      // Todo lo que pase de la altura de la x (el punto de la «i») queda fuera.
      ctx.beginPath();
      ctx.rect(0, BASE - XH - 0.5, SIZE, SIZE);
      ctx.clip();
      if (ch) {
        const G = BOX[WORD.indexOf(ch as (typeof WORD)[number])];
        ctx.font = `700 ${FS}px Satoshi`;
        ctx.textBaseline = "alphabetic";
        ctx.fillText(ch, G.ox, BASE);
      }
      if (w > 0.2) ctx.fillRect(x, BASE - XH, w, XH + bottom);
      ctx.restore();
      return canvas.toDataURL("image/png");
    };

    // Cambio de la letra `from` (o del cuadrado, si es null) a la `to`, con progreso 0–1. Tres tramos que se pisan,
    // como en la cabecera: tapar de izquierda a derecha, ajustarse a la caja nueva, recogerse hacia la izquierda.
    // Cada fotograma se dibuja y codifica una sola vez: las vueltas siguientes reutilizan el PNG.
    const frames = new Map<string, string>();
    const STEPS = Math.round((MORPH / 1000) * FPS);
    const frame = (from: number | null, to: number, k: number) => {
      const key = `${from}:${to}:${k}`;
      let url = frames.get(key);
      if (url) return url;
      const p = k / STEPS;
      const A = from === null ? SQUARE : BOX[from];
      const B = BOX[to];
      const cover = from === null ? 1 : seg(p, 0, 0.35);
      const fit = seg(p, from === null ? 0 : 0.25, from === null ? 0.6 : 0.7);
      const open = seg(p, from === null ? 0.4 : 0.6, 1);
      const x = lerp(A.x, B.x, fit);
      const full = lerp(A.w, B.w, fit);
      let ch: string | null = null;
      let w = full;
      if (cover < 1 && from !== null) {
        ch = BOX[from].ch;
        w = full * cover;
      } else if (open > 0) {
        ch = B.ch;
        w = full * (1 - open);
      }
      const bottom = ch ? Math.max(B.b, from === null ? 0 : BOX[from].b) : 0;
      url = render(ch, x, w, bottom);
      frames.set(key, url);
      return url;
    };
    const show = (url: string) => {
      for (const l of icons) {
        l.type = "image/png";
        l.href = url;
      }
    };

    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));
    const morph = async (from: number | null, to: number) => {
      const t0 = performance.now();
      for (;;) {
        const p = Math.min(1, (performance.now() - t0) / MORPH);
        show(frame(from, to, Math.round(p * STEPS)));
        if (p >= 1 || !alive) break;
        await wait(1000 / FPS);
      }
    };

    (async () => {
      // Sin Satoshi no se dibuja nada: se queda el bloque fijo.
      await document.fonts.load(FONT_TEST).catch(() => undefined);
      if (!alive || !document.fonts.check(FONT_TEST)) return;
      // Safari se queda con el primer icono de la página y Chrome con el último (2026-10-18: en Chrome no se movía,
      // mandaba el fijo que añade Next detrás del nuestro). Así que el nuestro va delante y cada fotograma va a todos
      // los iconos; al salir, cada uno recupera lo que tenía.
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      document.head.prepend(link);
      icons = [...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')];
      saved = icons.map((l) => [l.href, l.type] as const);
      // Llegada: el bloque fijo se convierte en la «a».
      await morph(null, 0);
      // Guion: descanso en la «a» y después cinco cambios (a→n→i→c→o→a) con una pausa en cada letra.
      while (alive) {
        await wait(REST_A);
        for (let i = 0; i < WORD.length && alive; i++) {
          await morph(i, (i + 1) % WORD.length);
          if (i < WORD.length - 1) await wait(HOLD);
        }
      }
    })();

    return () => {
      alive = false;
      clearTimeout(timer);
      icons.forEach((l, k) => {
        l.href = saved[k][0];
        l.type = saved[k][1];
      });
      link?.remove();
    };
  }, []);
  return null;
}
