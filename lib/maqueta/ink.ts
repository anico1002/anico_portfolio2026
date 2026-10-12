"use client";

import { useEffect, useState } from "react";

/* Tinta adaptativa (2026-10-12): texto en blanco o negro puro según lo que haya detrás.
   Sustituye a `mix-blend-mode: difference`, que sobre grises medios deja el texto gris sobre
   gris (fondo 128 → contraste 1:1) y hacía perder el logo. Aquí se mide el brillo real de lo
   que hay debajo de cada elemento —la imagen o el vídeo, con los velos que tenga encima, o el
   color de fondo— y se elige la tinta con más contraste: nunca baja de 5,3:1.

   Coste: un lienzo de 24×24 por elemento, varias veces por segundo como mucho. */

type Ink = "light" | "dark"; // tinta clara (sobre fondo oscuro) u oscura (sobre fondo claro)

const SIZE = 24;
let canvas: HTMLCanvasElement | null = null;
const ctx2d = () => {
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
  }
  return canvas.getContext("2d", { willReadFrequently: true });
};

const lin = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

function parseColor(c: string): [number, number, number, number] | null {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = "1"] = m[1].split(/[\s,/]+/).filter(Boolean);
  return [+r, +g, +b, +a];
}

/** Brillo medio (0–1, luminancia relativa) de la parte de una imagen/vídeo que cae en `rect`,
    respetando el encuadre object-cover y la escala con que se vea en ese momento. */
function mediaLum(m: HTMLImageElement | HTMLVideoElement, rect: DOMRect): number | null {
  const nw = m instanceof HTMLVideoElement ? m.videoWidth : m.naturalWidth;
  const nh = m instanceof HTMLVideoElement ? m.videoHeight : m.naturalHeight;
  if (!nw || !nh) return null;
  const box = m.getBoundingClientRect();
  const k = Math.max(box.width / nw, box.height / nh);
  const ox = box.left + (box.width - nw * k) / 2;
  const oy = box.top + (box.height - nh * k) / 2;
  const sx = (rect.left - ox) / k;
  const sy = (rect.top - oy) / k;
  const sw = rect.width / k;
  const sh = rect.height / k;
  const c = ctx2d();
  if (!c) return null;
  try {
    c.clearRect(0, 0, SIZE, SIZE);
    c.drawImage(m, Math.max(0, sx), Math.max(0, sy), Math.min(nw, sw), Math.min(nh, sh), 0, 0, SIZE, SIZE);
    const d = c.getImageData(0, 0, SIZE, SIZE).data;
    let sum = 0;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 8) continue;
      sum += lum(d[i], d[i + 1], d[i + 2]);
      n++;
    }
    return n ? sum / n : null;
  } catch {
    return null;
  }
}

/** Opacidad real (la suya por la de todos sus contenedores): un pase de imágenes oculto con
    opacidad 0 en el contenedor no debe contar como fondo. */
function effectiveOpacity(e: Element): number {
  let o = 1;
  for (let n: Element | null = e; n && n !== document.body; n = n.parentElement) o *= +getComputedStyle(n).opacity;
  return o;
}

/** Brillo de lo que hay detrás de `el` (sin contar a `el` ni a sus hijos). */
function behind(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const x = Math.min(Math.max(rect.left + rect.width / 2, 0), window.innerWidth - 1);
  const y = Math.min(Math.max(rect.top + rect.height / 2, 0), window.innerHeight - 1);
  // Capas de arriba abajo; los velos semitransparentes se mezclan al final, sobre la base.
  const veils: [number, number][] = [];
  for (const e of document.elementsFromPoint(x, y)) {
    if (el.contains(e) || e === el) continue;
    const cs = getComputedStyle(e);
    const op = effectiveOpacity(e);
    if (op < 0.05 || cs.visibility === "hidden") continue;
    if (e instanceof HTMLImageElement || e instanceof HTMLVideoElement) {
      const l = mediaLum(e, rect);
      if (l != null) {
        if (op >= 0.95) return veils.reduceRight((acc, [vl, a]) => acc * (1 - a) + vl * a, l);
        veils.push([l, op]);
      }
      continue;
    }
    const bg = parseColor(cs.backgroundColor);
    if (bg && bg[3] > 0) {
      const a = bg[3] * op;
      if (a >= 0.95) return veils.reduceRight((acc, [vl, va]) => acc * (1 - va) + vl * va, lum(bg[0], bg[1], bg[2]));
      veils.push([lum(bg[0], bg[1], bg[2]), a]);
    }
  }
  const body = parseColor(getComputedStyle(document.body).backgroundColor);
  return body ? lum(body[0], body[1], body[2]) : 1;
}

/** Tinta para el elemento de `ref`, según lo que tenga detrás. Se mide al montar, con el scroll
    y cada `everyMs` (para pases de imágenes y vídeos). Umbral en el punto de igual contraste
    entre blanco y negro (luminancia ≈ 0,18). */
export function useInk(ref: React.RefObject<HTMLElement | null>, everyMs = 400, fallback: Ink = "light"): Ink {
  const [ink, setInk] = useState<Ink>(fallback);
  useEffect(() => {
    // Para depurar desde la consola: __inkBehind(elemento) → luminancia de lo que tiene detrás.
    if (process.env.NODE_ENV !== "production") (window as unknown as { __inkBehind: typeof behind }).__inkBehind = behind;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      setInk(behind(el) > 0.18 ? "dark" : "light");
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    ask();
    const id = setInterval(ask, everyMs);
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
    };
  }, [ref, everyMs]);
  return ink;
}
