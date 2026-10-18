"use client";

import { useEffect } from "react";
import { LETTERS, MODULE, WORD, glyph } from "@/components/case-study/LogoAnico";
import { DUR } from "@/lib/maqueta/motion";

/* Favicon animado (E5, 2026-10-13; idea de Alberto tras verlo en Yakushev): la «a» del logo en
   blanco sobre negro y, de vez en cuando, una vuelta por las letras —a, n, i, c, o— hasta volver a
   la «a», que es la imagen principal y donde descansa. Con el logo nuevo (2026-10-18) cada letra se
   transforma en la siguiente, el mismo gesto que el logo de la cabecera. El rodillo de antes está en
   el historial de git.
   Se dibuja en un canvas y se cambia el `href` de todos los <link rel="icon"> (uno propio delante y los de Next). Antes de que
   arranque (y sin JS, o con movimiento reducido) se ve la «a» fija de public/maqueta/favicon-anico.svg. */

const SIZE = 64;
const SCALE = 0.62; // el módulo mide 62: 38 px de 64
const REST_A = 4000; // descanso en la «a» antes de cada vuelta
const HOLD = 450; // cada letra intermedia, quieta
const MORPH = DUR.base * 1000; // cada cambio de letra
const FPS = 30;

/** Power3.easeInOut, la curva `inOut` del sistema. */
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export default function AnimatedFavicon() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Safari se queda con el primer icono de la página y Chrome con el último (2026-10-18: en Chrome no se movía, mandaba
    // el fijo que añade Next detrás del nuestro). Así que el nuestro va delante y cada fotograma va a todos los iconos;
    // al salir, cada uno recupera lo que tenía.
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.prepend(link);
    const icons = [...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')];
    const saved = icons.map((l) => [l.href, l.type] as const);
    const shapes = WORD.map((l) => LETTERS[l]);

    // Letra `i` y, si `p` > 0, a medio camino hacia la siguiente (0–1).
    const draw = (i: number, p = 0) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "#fff";
      ctx.save();
      ctx.translate(SIZE / 2, (SIZE - MODULE * SCALE) / 2);
      ctx.scale(SCALE, SCALE);
      ctx.fill(new Path2D(glyph(shapes[i % shapes.length], shapes[(i + 1) % shapes.length], ease(p))));
      ctx.restore();
      const url = canvas.toDataURL("image/png");
      for (const l of icons) {
        l.type = "image/png";
        l.href = url;
      }
    };

    // Guion: descanso en la «a» y después cinco cambios (a→n→i→c→o→a) con una pausa en cada letra.
    let timer = 0;
    let alive = true;
    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));
    const morph = async (i: number) => {
      const t0 = performance.now();
      for (;;) {
        const p = Math.min(1, (performance.now() - t0) / MORPH);
        draw(i, p);
        if (p >= 1 || !alive) break;
        await wait(1000 / FPS);
      }
    };
    (async () => {
      draw(0);
      while (alive) {
        await wait(REST_A);
        for (let i = 0; i < shapes.length && alive; i++) {
          await morph(i);
          if (i < shapes.length - 1) await wait(HOLD);
        }
        if (alive) draw(0);
      }
    })();

    return () => {
      alive = false;
      clearTimeout(timer);
      icons.forEach((l, k) => {
        l.href = saved[k][0];
        l.type = saved[k][1];
      });
      link.remove();
    };
  }, []);
  return null;
}
