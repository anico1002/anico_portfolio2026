"use client";

import { FadeIn, MaskReveal } from "@/components/case-study/primitives";
import Lines from "@/components/case-study/Lines";
import { STAGGER } from "@/lib/maqueta/motion";

/* About al final de cada home (2026-10-17, decidido con Alberto: fuera la página de contacto y About como bloque
   en Product y en Games, porque cada visitante puede mirar solo una de las dos). Cada home lo enseña en su color:
   Product en negro y Games en blanco. Contenido de la antigua página «Sobre mí», en inglés y en tono publicitario. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";

const DOING = ["Product design", "Game UI/UX", "Brand art direction", "Interactive prototyping", "AI-native apps", "Web3 & VR", "Illustration"];

export default function AboutBlock({ years }: { years: number }) {
  return (
    <section id="about" className={`scroll-mt-16 pt-40 md:pt-64 ${wrap}`}>
      <div className={grid}>
        <div className="col-span-12 md:col-span-9">
          <FadeIn>
            <p className="mb-4 t-label t-tag text-[var(--case-muted)]">About</p>
          </FadeIn>
          <Lines as="h2" className="t-hero" delay={STAGGER}>
            {`${years} years designing interfaces people actually use.`}
          </Lines>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        {/* Foto a todo el ancho (2026-10-17). */}
        <MaskReveal from="bottom" speed={40} className="m-bleed md:-mx-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about.webp" alt="Alberto Nicolás" className="block h-auto w-full" style={{ aspectRatio: "1296/630" }} />
        </MaskReveal>
      </div>

      <div className={`${grid} mt-24 gap-y-16 md:mt-36`}>
        <FadeIn className="col-span-12 space-y-5 md:col-span-5 md:col-start-2">
          <p className="t-body">
            Senior designer across digital product, game UI/UX, brand art direction and immersive tech.
          </p>
          <p className="t-body text-[var(--case-muted)]">
            I work with agencies, studios and brands on products, games, identities and the web, using AI to take an
            idea from first sketch to a prototype you can touch and code ready to ship.
          </p>
          <p className="t-body text-[var(--case-muted)]">Based in Barcelona. Open to new projects.</p>
        </FadeIn>
        {/* «What I do» separado del texto, al otro lado (2026-10-17: fuera «Worked with» y Gameloft). */}
        <FadeIn delay={STAGGER} className="col-span-12 md:col-span-2 md:col-start-10">
          <p className="mb-6 t-label t-tag text-[var(--case-muted)]">What I do</p>
          <ul className="space-y-2 t-small">
            {DOING.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
