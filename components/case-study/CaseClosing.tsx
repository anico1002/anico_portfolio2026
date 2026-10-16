"use client";

import Lines from "@/components/case-study/Lines";
import Arrow from "@/components/case-study/Arrow";
import { invText } from "@/components/case-study/invText";
import { FadeIn } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";

/* Cierre común de todos los casos (feedback 2026-10-16: «abrimos igual y cerramos igual en todos»): la
   frase final centrada, sin titulillo «Resultado» ni párrafo, en seis columnas centradas (4–9) y con las
   dos últimas palabras juntas (espacio duro) para que no quede una sola abajo. El botón, si lo hay, debajo. */

export default function CaseClosing({
  title,
  cta,
  className = "pt-32 md:pt-48 px-4 md:px-6",
}: {
  title: string;
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
        <div className="col-span-12 text-center md:col-span-6 md:col-start-4">
          <Lines as="h2" className="t-statement [text-wrap:pretty]" delay={STAGGER}>
            {invText(title.replace(/ (\S+)$/, " $1"))}
          </Lines>
          {cta && (
            <FadeIn delay={2 * STAGGER}>
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fill mt-10 inline-flex items-center gap-3 border border-[var(--case-fg)] px-6 py-4 t-small"
              >
                {cta.label} <Arrow />
              </a>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
