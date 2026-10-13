"use client";

import { useEffect, useRef } from "react";

/* Signos de apertura del castellano a la altura de las mayúsculas (2026-10-13). Casi todas las
   fuentes dibujan «¿» y «¡» como el «?» y el «!» girados: cuelgan por debajo de la línea base, como
   una «p». Delante de minúscula («, ¿qué…») es lo correcto, pero delante de mayúscula
   («¿Hablamos?») se ven caídos. Las fuentes cuidadas traen una variante alta (función OpenType
   `case`); Instrument Sans no la trae, y no queremos depender de que la traiga la próxima.

   Así que el signo se mide a sí mismo: con la fuente real que tiene (familia, peso, estilo), se
   mira cuánto baja de la línea base y se sube exactamente eso. Vale para cualquier tipografía: si
   la fuente ya lo dibuja alto, la medida da 0 y no se mueve. Se vuelve a medir cuando cargan las
   fuentes. En em, así que sigue al tamaño del texto. */

const ctx = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : null;

function drop(el: HTMLElement) {
  if (!ctx) return 0;
  const s = getComputedStyle(el);
  ctx.font = `${s.fontStyle} ${s.fontWeight} 100px ${s.fontFamily}`;
  // Lo que baja de la línea base, en fracción del cuerpo (100 px).
  return Math.max(0, ctx.measureText(el.textContent ?? "").actualBoundingBoxDescent) / 100;
}

export function Inv({ ch }: { ch: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => (el.style.top = `-${drop(el).toFixed(3)}em`);
    set();
    let alive = true;
    document.fonts?.ready.then(() => alive && set());
    return () => {
      alive = false;
    };
  }, []);
  return (
    <span ref={ref} className="relative">
      {ch}
    </span>
  );
}
