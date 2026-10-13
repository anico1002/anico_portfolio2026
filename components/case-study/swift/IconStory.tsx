"use client";

import { FadeIn, Parallax } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";

/* El icono de SwifT: se huyó de lo literal (bocadillo, A/文) hacia una marca abstracta con la idea
   «cálido + frío = dos idiomas» (ROADMAP.md §5 del repo). Los conceptos que se quedaron por el camino y
   el icono final: dos esquirlas espejadas, un rayo, con acabado de cristal (Icon Composer). Assets reales
   del repo, copiados en public/maqueta/swift/brand/. */

const CONCEPTS = [
  { src: "/maqueta/swift/brand/concept-converge.svg", name: "Converge" },
  { src: "/maqueta/swift/brand/concept-spark.svg", name: "Chispa" },
  { src: "/maqueta/swift/brand/concept-swift-s.svg", name: "La S" },
];

export default function IconStory() {
  return (
    <div className="grid grid-cols-12 items-center gap-x-4 gap-y-14 md:gap-x-6">
      <div className="col-span-12 md:col-span-5">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {CONCEPTS.map((c, k) => (
            <FadeIn key={c.name} delay={k * STAGGER}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={`Concepto «${c.name}»`} className="w-full opacity-60 grayscale-[0.3]" />
              <p className="mt-3 t-label t-tag text-[var(--case-muted)]">{c.name}</p>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={3 * STAGGER}>
          <p className="mt-10 t-body text-[var(--case-muted)]">
            Conceptos descartados: cálido y frío que se cruzan, una chispa, la S. Todos decían demasiado.
          </p>
        </FadeIn>
      </div>
      <Parallax speed={90} className="col-span-12 flex justify-center md:col-span-5 md:col-start-8">
        <FadeIn>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/swift/brand/app-icon-glass@2x.png" alt="Icono final de SwifT" className="w-[16rem] md:w-[22rem]" />
        </FadeIn>
      </Parallax>
    </div>
  );
}
