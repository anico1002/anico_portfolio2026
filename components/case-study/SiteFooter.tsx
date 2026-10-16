"use client";

import Arrow from "@/components/case-study/Arrow";
import RollText from "@/components/case-study/RollText";
import { TLink } from "@/components/case-study/Portal";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { scrollToTop } from "@/components/case-study/SmoothScroll";
import { EMAIL, LINKEDIN } from "@/lib/maqueta/contact";

/* Pie común de todas las páginas (E2, 2026-10-13). Antes cada página tenía el suyo: «¿Hablamos?»
   gigante en las homes y en «Sobre mí», y «anico · año / Hablemos ↗» en los casos. Ahora:
   - arriba, la llamada a contactar (`cta`; en la propia página de contacto no va, sería repetirse);
   - debajo, una franja fina: firma, email, LinkedIn y volver arriba.
   Todos los enlaces con el rodillo de letras; la flecha de volver arriba es la diagonal girada.
   Pendiente (Alberto): un pie más trabajado a pantalla completa; ahí cabría el cambio de fondo
   de Plastic (E4, en standby). */

const wrap = "px-4 md:px-6";
const mono = "t-tag";

/* «¿Hablamos?» entra cada vez que vuelve a pantalla (feedback 2026-10-16: «que se note que viene cada vez»).
   Va pegado a la línea del pie y sale de ella (feedback 2026-10-17), pero sin quedarse fija tras la primera vez. `show` permite mandarlo
   desde fuera (al final de los casos lo decide el telón, porque ahí está en pantalla aunque la capa lo tape). */
function Hablamos({ show }: { show?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (show !== undefined) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setInView(es.some((e) => e.isIntersecting)), { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [show]);
  const on = reduce || (show ?? inView);
  // La máscara es el propio borde: el contenedor recorta justo encima de la línea del pie y las letras suben desde
  // ella en ola (las mismas letras del rodillo del hover; la animación vive en system.css, `.hablamos`).
  return (
    <div ref={ref} className={`hablamos overflow-hidden pb-[0.08em] ${on ? "is-in" : ""}`}>
      <TLink href="/maqueta/contacto" className="block t-d2">
        <RollText text="Let’s talk" />
      </TLink>
    </div>
  );
}

export default function SiteFooter({ cta = true, show, flush = false }: { cta?: boolean; show?: boolean; flush?: boolean }) {
  return (
    <footer className={`pb-6 md:pb-8 ${flush ? "" : cta ? "mt-40 md:mt-64" : "mt-24"} ${wrap}`}>
      {cta && <Hablamos show={show} />}
      <div
        className={`flex flex-col gap-4 border-t border-[var(--case-line)] pt-5 md:flex-row md:items-baseline md:justify-between`}
      >
        <p className={`t-label text-[var(--case-muted)] ${mono}`}>anico · {new Date().getFullYear()}</p>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 t-small md:gap-x-8">
          <a href={`mailto:${EMAIL}`}>
            <RollText text={EMAIL} />
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
            <RollText text="LinkedIn" /> <Arrow />
          </a>
          <button type="button" onClick={scrollToTop} className="inline-flex items-center gap-1.5">
            <RollText text="Back to top" /> <Arrow className="-rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
}
