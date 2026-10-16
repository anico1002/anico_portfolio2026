"use client";

import Arrow from "@/components/case-study/Arrow";
import RollText from "@/components/case-study/RollText";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const noop = () => () => {};
import { useReduce } from "@/lib/maqueta/reduce";
import { scrollToTop } from "@/components/case-study/SmoothScroll";
import { LINKEDIN, email } from "@/lib/maqueta/contact";

/* Pie común de todas las páginas (E2, 2026-10-13). Antes cada página tenía el suyo: «¿Hablamos?»
   gigante en las homes y en «Sobre mí», y «anico · año / Hablemos ↗» en los casos. Ahora:
   - arriba, la llamada a contactar (`cta`; en la propia página de contacto no va, sería repetirse);
   - debajo, una franja fina: firma, email, LinkedIn y volver arriba.
   Todos los enlaces con el rodillo de letras; la flecha de volver arriba es la diagonal girada.
   Pendiente (Alberto): un pie más trabajado a pantalla completa; ahí cabría el cambio de fondo
   de Plastic (E4, en standby). */

const wrap = "px-4 md:px-6";

/* «¿Hablamos?» entra cada vez que vuelve a pantalla (feedback 2026-10-16: «que se note que viene cada vez»).
   Va pegado a la línea del pie y sale de ella (feedback 2026-10-17), pero sin quedarse fija tras la primera vez. `show` permite mandarlo
   desde fuera (al final de los casos lo decide el telón, porque ahí está en pantalla aunque la capa lo tape). */
function Hablamos({ show, onCopy, mail, copied }: { show?: boolean; onCopy: () => void; mail: string; copied: boolean }) {
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
  // ella en ola. Aire bajo las letras igual al margen lateral de la página (16 / 24 px), 2026-10-17 (las mismas letras del rodillo del hover; la animación vive en system.css, `.hablamos`).
  return (
    <div ref={ref} className={`hablamos overflow-hidden pb-4 md:pb-6 ${on ? "is-in" : ""}`}>
      <div className="group flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <button type="button" onClick={onCopy} className="block text-left t-d2" aria-label="Let’s talk: copy my email">
          <RollText text="Let’s talk" />
        </button>
        {/* Al pasar por encima se ve qué hará el clic: tu email y «Click to copy»; al copiar, el aviso. */}
        <span
          aria-live="polite"
          className={`t-small text-[var(--case-muted)] transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {copied ? "Email copied ✓" : mail ? `${mail} · Click to copy` : ""}
        </span>
      </div>
    </div>
  );
}

export default function SiteFooter({ cta = true, show, flush = false }: { cta?: boolean; show?: boolean; flush?: boolean }) {
  // El email se monta en el navegador (no está en el HTML) y los dos clics, «Let’s talk» y el del pie, lo copian.
  const mail = useSyncExternalStore(noop, email, () => ""); // en el servidor (HTML), vacío
  const [copied, setCopied] = useState<"cta" | "foot" | null>(null); // dónde se ha copiado: el aviso sale solo ahí
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), 2200);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = (where: "cta" | "foot") => () => {
    navigator.clipboard?.writeText(email()).then(() => setCopied(where), () => (window.location.href = `mailto:${email()}`));
  };
  return (
    <footer className={`pb-6 md:pb-8 ${flush ? "" : cta ? "mt-40 md:mt-64" : "mt-24"} ${wrap}`}>
      {cta && <Hablamos show={show} onCopy={copy("cta")} mail={mail} copied={copied === "cta"} />}
      <div
        className={`flex flex-col gap-4 border-t border-[var(--case-line)] pt-5 md:flex-row md:items-baseline md:justify-between`}
      >
        <p className="t-small text-[var(--case-muted)]">© {new Date().getFullYear()} anico. All rights reserved</p>
        {/* Enlaces del pie en gris y en el color del texto al pasar (como el menú; 2026-10-17). */}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 t-small text-[var(--case-muted)] md:gap-x-8 [&_a:hover]:text-[var(--case-fg)] [&_button:hover]:text-[var(--case-fg)] [&_a]:transition-colors [&_button]:transition-colors">
          {/* El email: se ve (montado en el navegador, no en el HTML) y al clicar se copia, con aviso. */}
          <button type="button" onClick={copy("foot")} className="relative">
            <RollText text={mail || "Email"} />
            <span
              aria-live="polite"
              className={`pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap t-small text-[var(--case-fg)] transition-opacity duration-300 ${copied === "foot" ? "opacity-100" : "opacity-0"}`}
            >
              {copied === "foot" ? "Email copied ✓" : ""}
            </span>
          </button>
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
