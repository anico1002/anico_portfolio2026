"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";

/* Palabras clave «eligiendo tipografía» (2026-10-17, idea de Alberto; sustituye al degradado ácido, que rompía el
   blanco y negro de la web). La palabra entra normal; luego se selecciona como en un editor (la selección crece de
   izquierda a derecha y el texto se invierte sobre ella), cambia a una serif, a una slab y a una sans con carácter
   (PT Serif, Bitter, Familjen Grotesk, medidas contra la sans del titular: mismo ancho y misma altura de
   minúsculas, para que no haya saltos ni cambie el peso), vuelve a la del titular y se deselecciona. Entonces avisa
   (`onDone`) para que siga el resto del titular. La palabra en la tipografía del titular queda debajo, invisible, y
   guarda el hueco. Reutilizable en Product y Games: `run` lo dispara. */

const FACES = ["var(--font-flip-serif)", "var(--font-flip-mono)", "var(--font-flip-grot)"];
// Guion: [ms desde el arranque, seleccionado, tipografía (-1 = la del titular)]
const SCRIPT: [number, boolean, number][] = [
  [0, true, -1],
  [520, true, 0],
  [1000, true, 1],
  [1480, true, 2],
  [1960, true, -1],
  [2380, false, -1],
];
const END = 2650;
const START = 1100; // ms: cuando el titular ya ha subido a su sitio

export default function FontFlip({ text, run = true, onDone }: { text: string; run?: boolean; onDone?: () => void }) {
  const reduce = useReduce();
  const [face, setFace] = useState(-1);
  const [sel, setSel] = useState(false);
  const base = useRef<HTMLSpanElement>(null);
  const over = useRef<HTMLSpanElement>(null);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);
  useEffect(() => {
    if (!run) return;
    if (reduce) {
      done.current?.();
      return;
    }
    const timers = SCRIPT.map(([t, s, f]) =>
      window.setTimeout(() => {
        setSel(s);
        setFace(f);
      }, START + t)
    );
    timers.push(window.setTimeout(() => done.current?.(), START + END));
    return () => timers.forEach(clearTimeout);
  }, [run, reduce, text]);
  // Por si alguna tipografía saliera más ancha que la palabra: baja de cuerpo lo justo para no pisar lo de al lado.
  useLayoutEffect(() => {
    const b = base.current;
    const o = over.current;
    if (!b || !o) return;
    o.style.fontSize = "";
    const k = Math.min(1, b.offsetWidth / o.offsetWidth);
    o.style.fontSize = `${k}em`;
    o.style.top = `${((1 - k) / 2) * b.offsetHeight}px`;
  }, [face]);
  return (
    <span className="font-flip relative inline-block">
      {/* La selección: el color del texto de fondo, crece de izquierda a derecha. */}
      <span
        aria-hidden
        className="absolute -inset-x-[0.06em] inset-y-[0.04em] origin-left bg-current transition-transform duration-[260ms] ease-out"
        style={{ transform: `scaleX(${sel ? 1 : 0})` }}
      />
      <span ref={base} className={`relative transition-colors duration-150 ${face >= 0 ? "invisible" : ""}`} style={sel ? { color: "var(--case-bg)" } : undefined}>
        {text}
      </span>
      {face >= 0 && (
        <span ref={over} aria-hidden className="absolute left-0 top-0 whitespace-nowrap" style={{ fontFamily: FACES[face], color: "var(--case-bg)" }}>
          {text}
        </span>
      )}
    </span>
  );
}
