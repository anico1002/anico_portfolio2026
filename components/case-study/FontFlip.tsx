"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";

/* Palabras clave que cambian de tipografía (prueba 2026-10-17, sustituye al degradado ácido, que rompía el blanco y
   negro de la web). Al arrancar, la palabra entera pasa muy rápido por tres tipografías de peso parecido y ancho
   normal —serif, slab y una sans con carácter (PT Serif, Bitter, Familjen Grotesk)— y se queda en la del titular. Toda a la vez, no letra a letra (eso
   quedaba caótico, Alberto 2026-10-17). La palabra en la tipografía del titular queda invisible debajo y guarda el
   hueco, así que el titular no se mueve mientras cambia. Reutilizable en Product y Games: `run` lo dispara. */

const FACES = ["var(--font-flip-serif)", "var(--font-flip-mono)", "var(--font-flip-grot)"];
const SEQ = [0, 1, 2, 0, 1, 2]; // orden de tipografías antes de volver a la del titular
const STEP = 110; // ms en cada tipografía
const START = 1100; // ms: arranca cuando el titular ya ha subido a su sitio

export default function FontFlip({ text, run = true }: { text: string; run?: boolean }) {
  const reduce = useReduce();
  const [face, setFace] = useState(-1); // -1 = la del titular
  const base = useRef<HTMLSpanElement>(null);
  const over = useRef<HTMLSpanElement>(null);
  // Si una tipografía es más ancha que la palabra (la mono, sobre todo), baja de cuerpo lo justo para ocupar el
  // mismo hueco y no pisar el texto de al lado; centrada en vertical sobre la línea.
  useLayoutEffect(() => {
    const b = base.current;
    const o = over.current;
    if (!b || !o) return;
    o.style.fontSize = "";
    const k = Math.min(1, b.offsetWidth / o.offsetWidth);
    o.style.fontSize = `${k}em`;
    o.style.top = `${((1 - k) / 2) * b.offsetHeight}px`;
  }, [face]);
  useEffect(() => {
    if (!run || reduce) return;
    const timers = SEQ.map((f, k) => window.setTimeout(() => setFace(f), START + k * STEP));
    timers.push(window.setTimeout(() => setFace(-1), START + SEQ.length * STEP));
    return () => timers.forEach(clearTimeout);
  }, [run, reduce, text]);
  return (
    <span className="font-flip relative inline-block">
      <span ref={base} className={face >= 0 ? "invisible" : undefined}>{text}</span>
      {face >= 0 && (
        <span ref={over} aria-hidden className="absolute left-0 top-0 whitespace-nowrap" style={{ fontFamily: FACES[face] }}>
          {text}
        </span>
      )}
    </span>
  );
}
