"use client";

import { useEffect } from "react";
import { LETTERS } from "@/components/case-study/LogoLetters";
import { DUR } from "@/lib/maqueta/motion";

/* Favicon animado (E5, 2026-10-13; idea de Alberto tras verlo en Yakushev): la «a» del logo en
   blanco sobre negro y, de vez en cuando, el rodillo del logo de carga letra a letra —a, n, i, c,
   o— hasta volver a la «a», que es la imagen principal y donde descansa. Cada cambio es el mismo
   gesto que el hover del menú: la letra sale por arriba y la siguiente entra por abajo.
   Se dibuja en un canvas y se cambia el `href` de un <link rel="icon"> propio. Antes de que
   arranque (y sin JS, o con movimiento reducido) se ve la «a» fija de public/maqueta/favicon.svg. */

const SIZE = 64;
const SCALE = 0.4; // las letras miden 95 de alto: 38 px de 64
const REST_A = 4000; // descanso en la «a» antes de cada vuelta
const HOLD = 450; // cada letra intermedia, quieta
const ROLL = DUR.base * 1000; // cada cambio de letra
const FPS = 30;

// Ancho de cada letra en el lienzo del logo (0–439), para centrarla.
const SPANS: Record<string, [number, number]> = {
  a: [0, 82.4],
  n: [102.2, 187],
  ı: [207.1, 232.7],
  c: [249.4, 335.8],
  o: [348.4, 439],
};

/** Power3.easeInOut, la curva `inOut` del sistema. */
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export default function AnimatedFavicon() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const paths = LETTERS.map((l) => ({ key: l.key, path: new Path2D(l.d) }));
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);

    const letter = (i: number, dy: number) => {
      const { key, path } = paths[i % paths.length];
      const [x0, x1] = SPANS[key];
      ctx.save();
      ctx.translate(SIZE / 2, SIZE / 2 + dy);
      ctx.scale(SCALE, SCALE);
      ctx.translate(-(x0 + x1) / 2, -47.5);
      ctx.fill(path);
      ctx.restore();
    };
    // Letra `i` y, si `p` > 0, el relevo a la siguiente a medio camino (0–1).
    const draw = (i: number, p = 0) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "#fff";
      const y = ease(p) * SIZE;
      letter(i, -y);
      if (p > 0) letter(i + 1, SIZE - y);
      link.href = canvas.toDataURL("image/png");
    };

    // Guion: descanso en la «a» y después cinco relevos (a→n→i→c→o→a) con una pausa en cada letra.
    let timer = 0;
    let alive = true;
    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));
    const roll = async (i: number) => {
      const t0 = performance.now();
      for (;;) {
        const p = Math.min(1, (performance.now() - t0) / ROLL);
        draw(i, p);
        if (p >= 1 || !alive) break;
        await wait(1000 / FPS);
      }
    };
    (async () => {
      draw(0);
      while (alive) {
        await wait(REST_A);
        for (let i = 0; i < paths.length && alive; i++) {
          await roll(i);
          if (i < paths.length - 1) await wait(HOLD);
        }
        if (alive) draw(0);
      }
    })();

    return () => {
      alive = false;
      clearTimeout(timer);
      link.remove();
    };
  }, []);
  return null;
}
