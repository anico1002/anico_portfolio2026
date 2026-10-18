"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";

/* Palabras clave «pruebo una serif y la descarto» (2026-10-17, idea de Alberto; sustituye al degradado ácido, que
   rompía el blanco y negro de la web). El titular entra entero con su ola; ya escrito, la palabra se borra letra a
   letra desde la derecha (con cursor), se escribe en la serif de antes (DM Serif Display cursiva: «mezclar sans y
   serif lo hace todo el mundo»), se queda un momento, se vuelve a borrar y se reescribe en la del titular. La
   palabra original queda debajo, invisible, y guarda el hueco: el resto del titular no se mueve. `run` lo dispara;
   reutilizable en Product y Games. */

const START = 2300; // ms: cuando la ola del titular ya ha terminado
const DEL = 45; // ms por letra al borrar
const TYPE = 80; // ms por letra al escribir
const HOLD = 1100; // ms con la serif escrita
const PAUSE = 260; // ms con la palabra borrada, antes de escribir
const STRIKE = 380; // ms que tarda en tacharse la serif (prueba C, 2026-10-17: descartar tachando)
const STRUCK = 650; // ms tachada antes de borrarla
const SELECT = 300; // ms que tarda en seleccionarse la serif (prueba B, 2026-10-17: seleccionar y borrar de golpe)
const SELECTED = 550; // ms seleccionada antes de borrarla
// Cómo se descarta la serif: «strike» (C, tacharla y borrarla letra a letra) o «select» (B, seleccionarla y borrarla
// de golpe, como al pulsar la tecla de borrar con todo seleccionado).
const REJECT: "strike" | "select" = "select";

type Face = "sans" | "serif";

/** La tipografía que se prueba y se descarta: la serif (Product) o una técnica (Games, 2026-10-18). */
const ALT = {
  serif: { fontFamily: "var(--font-case-serif)", fontStyle: "italic" },
  tech: { fontFamily: "var(--font-flip-tech)", fontWeight: 500 },
} as const;
// La de Games no se encoge al ancho de la palabra (a menor cuerpo se veía estrecha, Alberto 2026-10-18): va al
// final del titular y puede salir más ancha. Solo baja de cuerpo si no le cabe en la línea (móvil).
const FIT: Record<keyof typeof ALT, boolean> = { serif: true, tech: false };
// Chakra Petch tiene las minúsculas un 3 % más altas que la Satoshi (medido: x de 49,8 frente a 48,4): un 3 % menos
// de cuerpo las iguala y no parece más grande.
const SIZE: Record<keyof typeof ALT, number> = { serif: 1, tech: 0.97 };

export default function FontFlip({ text, run = true, alt = "serif" }: { text: string; run?: boolean; alt?: keyof typeof ALT }) {
  const reduce = useReduce();
  const [face, setFace] = useState<Face>("sans");
  const [n, setN] = useState(text.length); // letras visibles
  const [busy, setBusy] = useState(false); // cursor a la vista
  const [struck, setStruck] = useState(false); // la serif, tachada
  const [sel, setSel] = useState(false); // la serif, seleccionada
  const base = useRef<HTMLSpanElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [k, setK] = useState(1);
  // Línea base: la palabra superpuesta va anclada arriba y, con otra fuente y otro cuerpo, su línea base caía en otro
  // sitio (con Oxanium, más arriba: «hace el salto para arriba», 2026-10-18). Dos marcas de alto cero, una en cada
  // texto, dicen dónde está cada línea base, y la superpuesta baja o sube lo que haga falta.
  const root = useRef<HTMLSpanElement>(null);
  const over = useRef<HTMLSpanElement>(null);
  const baseMark = useRef<HTMLSpanElement>(null);
  const overMark = useRef<HTMLSpanElement>(null);
  const [dy, setDy] = useState(0);
  useLayoutEffect(() => {
    const r = root.current, o = over.current, bm = baseMark.current, om = overMark.current;
    if (!busy || !r || !o || !bm || !om) return;
    const want = bm.getBoundingClientRect().top - r.getBoundingClientRect().top;
    const has = om.getBoundingClientRect().top - o.getBoundingClientRect().top;
    setDy(want - has);
  }, [busy, face, k]);

  // Si la serif sale más ancha que la palabra, baja de cuerpo lo justo para no pisar lo de al lado.
  useLayoutEffect(() => {
    const b = base.current;
    const p = probe.current;
    if (!b || !p) return;
    const room = FIT[alt] ? b.offsetWidth : (b.closest(".t-hero") ?? b.parentElement!).getBoundingClientRect().right - b.getBoundingClientRect().left;
    setK(Math.min(1, room / p.offsetWidth));
  }, [text, alt]);

  useEffect(() => {
    if (!run || reduce) return;
    const L = text.length;
    const timers: number[] = [];
    let t = START;
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const erase = () => {
      for (let i = L - 1; i >= 0; i--) at((t += DEL), () => setN(i));
      t += PAUSE;
    };
    const write = (f: Face) => {
      at(t, () => setFace(f));
      for (let i = 1; i <= L; i++) at((t += TYPE), () => setN(i));
    };
    at(t, () => setBusy(true));
    erase();
    write("serif");
    t += HOLD;
    if (REJECT === "strike") {
      // Descarte C: se tacha como en una corrección y, tachada, se borra letra a letra.
      at(t, () => setStruck(true));
      t += STRIKE + STRUCK;
      erase();
      at(t, () => setStruck(false));
    } else {
      // Descarte B: se selecciona entera y desaparece de golpe.
      at(t, () => setSel(true));
      t += SELECT + SELECTED;
      at(t, () => {
        setSel(false);
        setN(0);
      });
      t += PAUSE;
    }
    write("sans");
    at((t += 500), () => setBusy(false));
    return () => timers.forEach(clearTimeout);
  }, [run, reduce, text]);

  const serif = face === "serif";
  return (
    <span ref={root} className="font-flip relative inline-block">
      <span ref={base} className={busy ? "invisible" : undefined}>
        <span ref={baseMark} className="inline-block h-0 w-0" />
        {text}
      </span>
      {/* Medida de la serif, invisible. */}
      <span ref={probe} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap" style={{ ...ALT[alt], fontSize: `${SIZE[alt]}em` }}>
        {text}
      </span>
      {busy && (
        <span
          ref={over}
          aria-hidden
          className="absolute left-0 top-0 whitespace-nowrap"
          style={{ ...(serif ? { ...ALT[alt], fontSize: `${k * SIZE[alt]}em` } : {}), top: dy }}
        >
          {/* Texto y copia invertida apilados en la misma celda (inline-grid): comparten línea base, así que la copia no
              se desplaza respecto al texto (antes, en absoluto, subía con la serif). */}
          <span className="relative inline-grid">
            {/* La selección (descarte B): crece de izquierda a derecha y el texto se invierte sobre ella. */}
            <span
              className="absolute -inset-x-[0.04em] inset-y-[0.04em] origin-left bg-current"
              style={{ transform: `scaleX(${sel ? 1 : 0})`, transition: sel ? `transform ${SELECT}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none" }}
            />
            <span className="relative [grid-area:1/1]">
              <span ref={overMark} className="inline-block h-0 w-0" />
              {text.slice(0, n)}
            </span>
            {/* Copia invertida, recortada con el mismo avance que la selección: el texto se invierte justo donde pasa. */}
            <span
              aria-hidden
              className="relative [grid-area:1/1]"
              style={{
                color: "var(--case-bg)",
                clipPath: sel ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: sel ? `clip-path ${SELECT}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none",
              }}
            >
              {text.slice(0, n)}
            </span>
            {/* La tachadura: crece de izquierda a derecha por el centro de las minúsculas y encoge con lo que se borra. */}
            <span
              className="absolute left-0 right-0 top-[58%] h-[0.06em] origin-left bg-current"
              style={{ transform: `scaleX(${struck ? 1 : 0})`, transition: struck ? `transform ${STRIKE}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none" }}
            />
          </span>
          <span className="type-caret" />
        </span>
      )}
    </span>
  );
}
