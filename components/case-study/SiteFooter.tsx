"use client";

import Arrow from "@/components/case-study/Arrow";
import RollText from "@/components/case-study/RollText";
import { TLink } from "@/components/case-study/Portal";
import { FadeIn } from "@/components/case-study/primitives";
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

export default function SiteFooter({ cta = true }: { cta?: boolean }) {
  return (
    <footer className={`pb-6 md:pb-8 ${cta ? "mt-40 md:mt-64" : "mt-24"} ${wrap}`}>
      {cta && (
        <FadeIn>
          <TLink href="/maqueta/contacto" className="block t-d2">
            <RollText text="¿Hablamos?" />
          </TLink>
        </FadeIn>
      )}
      <div
        className={`${cta ? "mt-16 md:mt-24" : ""} flex flex-col gap-4 border-t border-[var(--case-line)] pt-5 md:flex-row md:items-baseline md:justify-between`}
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
            <RollText text="Volver arriba" /> <Arrow className="-rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
}
