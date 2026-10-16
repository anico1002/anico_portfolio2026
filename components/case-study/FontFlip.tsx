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

type Face = "sans" | "serif";

export default function FontFlip({ text, run = true }: { text: string; run?: boolean }) {
  const reduce = useReduce();
  const [face, setFace] = useState<Face>("sans");
  const [n, setN] = useState(text.length); // letras visibles
  const [busy, setBusy] = useState(false); // cursor a la vista
  const base = useRef<HTMLSpanElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [k, setK] = useState(1);

  // Si la serif sale más ancha que la palabra, baja de cuerpo lo justo para no pisar lo de al lado.
  useLayoutEffect(() => {
    const b = base.current;
    const p = probe.current;
    if (b && p) setK(Math.min(1, b.offsetWidth / p.offsetWidth));
  }, [text]);

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
    erase();
    write("sans");
    at((t += 500), () => setBusy(false));
    return () => timers.forEach(clearTimeout);
  }, [run, reduce, text]);

  const serif = face === "serif";
  return (
    <span className="font-flip relative inline-block">
      <span ref={base} className={busy ? "invisible" : undefined}>
        {text}
      </span>
      {/* Medida de la serif, invisible. */}
      <span ref={probe} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap" style={{ fontFamily: "var(--font-case-serif)", fontStyle: "italic" }}>
        {text}
      </span>
      {busy && (
        <span
          aria-hidden
          className="absolute left-0 top-0 whitespace-nowrap"
          style={serif ? { fontFamily: "var(--font-case-serif)", fontStyle: "italic", fontSize: `${k}em` } : undefined}
        >
          {text.slice(0, n)}
          <span className="type-caret" />
        </span>
      )}
    </span>
  );
}
