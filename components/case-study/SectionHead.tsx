"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";

/* Cabecera de sección de los casos (2026-10-17; antes era una copia en cada caso). Titulillo y titular a la
   izquierda; el párrafo, a la derecha y alineado con la última línea del titular. Si el párrafo es más alto que el
   titular, ya no cabe así (subiría por encima de él): pasa a empezar debajo del titular, en su misma columna, como en
   las intros. Lo decide midiendo, así que vale para cualquier texto, idioma o tipografía. */

const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";

export default function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: React.ReactNode; body?: React.ReactNode }) {
  const h = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const [stack, setStack] = useState(false);
  useLayoutEffect(() => {
    const th = h.current?.querySelector("h2");
    const bp = b.current;
    if (!th || !bp) return;
    const check = () => setStack(window.innerWidth >= 768 && bp.offsetHeight > th.offsetHeight + 4);
    check();
    document.fonts?.ready.then(check);
    const ro = new ResizeObserver(check);
    ro.observe(th);
    ro.observe(bp);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={`${grid} mb-14 gap-y-8 md:mb-20 ${stack ? "" : "items-end md:[align-items:last_baseline]"}`}>
      <div ref={h} className="col-span-12 md:col-span-6">
        <FadeIn>
          <p className="t-label t-tag text-[var(--case-muted)]">{eyebrow}</p>
        </FadeIn>
        <Lines as="h2" className="mt-4 t-statement text-balance" delay={STAGGER}>
          {title}
        </Lines>
      </div>
      {body && (
        <FadeIn delay={2 * STAGGER} className={`col-span-12 md:col-span-4 md:col-start-8 ${stack ? "md:row-start-2 md:mt-6" : ""}`}>
          <div ref={b}>
            <p className="t-body text-[var(--case-muted)]">{body}</p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
