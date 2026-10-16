"use client";

import { useEffect, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";

/* Palabras clave que cambian de tipografía letra a letra (prueba 2026-10-17, sustituye al degradado ácido, que
   rompía el blanco y negro de la web). Al arrancar, cada letra pasa muy rápido por tres tipografías de peso parecido
   y ancho normal —serif, mono y una sans con carácter— y se queda en la del titular. Cada letra guarda el hueco de
   su glifo final (invisible debajo), así que el titular no se mueve mientras cambian. Reutilizable en Product y
   Games: `run` lo dispara (y lo repite si vuelve a ponerse a true). */

const FACES = ["var(--font-flip-serif)", "var(--font-flip-mono)", "var(--font-flip-grot)"];
const STEP = 65; // ms entre cambios de una letra
const HOPS = 7; // cambios por letra antes de quedarse
const START = 1100; // ms: arranca cuando el titular ya ha subido a su sitio
const LAG = 45; // ms entre el arranque de una letra y el de la siguiente

export default function FontFlip({ text, run = true }: { text: string; run?: boolean }) {
  const reduce = useReduce();
  const chars = [...text];
  // Para cada letra, la tipografía que lleva ahora (-1 = la del titular).
  const [face, setFace] = useState<number[]>(() => chars.map(() => -1));
  useEffect(() => {
    if (!run || reduce) return;
    const timers: number[] = [];
    chars.forEach((_, i) => {
      for (let h = 0; h <= HOPS; h++) {
        timers.push(
          window.setTimeout(() => {
            setFace((f) => {
              const n = [...f];
              n[i] = h === HOPS ? -1 : (i + h) % FACES.length;
              return n;
            });
          }, START + i * LAG + h * STEP)
        );
      }
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reduce, text]);
  return (
    <span className="font-flip">
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => (
        <span key={i} aria-hidden className="relative inline-block">
          <span className="invisible">{ch === " " ? " " : ch}</span>
          <span className="absolute inset-0 text-center" style={face[i] >= 0 ? { fontFamily: FACES[face[i]] } : undefined}>
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
