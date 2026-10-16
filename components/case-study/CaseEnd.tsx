"use client";

import Arrow from "@/components/case-study/Arrow";
import RollText from "@/components/case-study/RollText";
import { TLink } from "@/components/case-study/Portal";
import { Placeholder } from "@/components/case-study/primitives";
import type { MoreItem } from "@/lib/maqueta/media";

/* Final de todos los casos (2026-10-16, idea de Alberto sacada de madebyaran.com). El caso termina en una capa
   con fondo propio (`CaseLayer`) que va por encima; debajo, pegado al borde inferior de la pantalla (sticky),
   espera este bloque. Al seguir bajando, el caso sube como un telón y lo descubre. En vez de un solo «siguiente
   caso», un carrusel con todos los proyectos de la sección, empezando por el siguiente, que pasa solo de lado
   (se para al pasar el ratón) y un enlace para verlos todos. Debajo van el «¿Hablamos?» y el pie. */

/** La capa del caso: todo lo que va antes del final, por encima del carrusel. */
export function CaseLayer({ children }: { children: React.ReactNode }) {
  return <div className="relative z-10 bg-[var(--case-bg)] pb-32 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] md:pb-48">{children}</div>;
}

export default function CaseEnd({ items, all }: { items: MoreItem[]; all: { label: string; href: string } }) {
  // Dos copias seguidas para que el bucle no tenga costura (la animación mueve el -50 %).
  const loop = [...items, ...items];
  return (
    <section className="sticky bottom-0 z-0 overflow-hidden pb-10 pt-16 md:pb-14 md:pt-24">
      <div className="flex items-end justify-between gap-6 px-4 md:px-6">
        <p className="t-label t-tag text-[var(--case-muted)]">Más proyectos</p>
        <TLink href={all.href} className="t-small">
          <RollText text={all.label} /> <Arrow />
        </TLink>
      </div>
      <div className="group mt-8 md:mt-10">
        <div
          className="flex w-max gap-4 pl-4 group-hover:[animation-play-state:paused] md:gap-6 md:pl-6"
          style={{ animation: `marquee ${items.length * 7}s linear infinite`, willChange: "transform" }}
        >
          {loop.map((c, k) => (
            <TLink key={`${c.href}-${k}`} href={c.href} className="block w-[72vw] shrink-0 sm:w-[22rem] md:w-[26rem]" aria-hidden={k >= items.length || undefined} tabIndex={k >= items.length ? -1 : undefined}>
              <div className="overflow-hidden">
                <div className="transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] hover:scale-[1.03]">
                  <Placeholder ratio="16/10" src={c.thumb} label={c.name} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="t-title">
                  <RollText text={c.name} />
                </p>
                <p className="shrink-0 t-small text-[var(--case-muted)]">{c.tag}</p>
              </div>
            </TLink>
          ))}
        </div>
      </div>
    </section>
  );
}
