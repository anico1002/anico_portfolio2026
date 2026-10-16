"use client";

import SectionHead from "@/components/case-study/SectionHead";
import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { BrandGlow, ChefLive, DualSurface, EnergyCard, Funnel, retoFonts } from "./ElRetoPieces";

/* Caso de El Reto, a medida (2026-10-13). Hechos del repo ElReto-app-2026-Lovable (es.json, ui-kit.css,
   CLAUDE.md). Piezas recreadas + dos láminas de identidad de la web actual (trabajo de marca real).
   Pendiente de Alberto: el año (2025 en la web actual, 2026 en el repo), si se publicó en las tiendas y de
   dónde salen las cifras del caso actual; por eso aquí no van. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

/* Cabecera de capítulo con el feedback general de Gloop (2026-10-14): titulillo sin número, titular
   equilibrado y el párrafo cerca de él, alineado con su última línea (no colgado arriba ni pegado al borde). */
const Head = SectionHead;

// Reglas reales de la app (dashboard.* en es.json).
const RULES = [
  ["Mini reto diario a tiempo", "+30 acertando · +2 fallando"],
  ["Mini reto diario tardío", "+15 acertando · +1 fallando"],
  ["Desafío semanal a tiempo", "+100"],
  ["Desafío semanal tardío", "+50"],
  ["Vídeo de presentación aprobado", "+100"],
  ["Like en tus vídeos", "+1 por like"],
  ["SuperLike recibido", "+50"],
];

export default function ElRetoCase({ next: n, hero, outcomeTitle }: { next: MoreCases; hero: string; outcomeTitle: string }) {
  return (
    <main className={`relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased ${retoFonts}`}>
      <SiteNav active="product" />
      <CaseLayer>

      <CaseHero
        poster={<Placeholder ratio="auto" className="h-full" src={hero} label="El Reto MasterChef" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="MasterChef"
            delay={t}
            facts={[
              ["Para", "MasterChef World"],
              ["Rol", "Art Director"],
              ["Qué hice", "Identidad · UX/UI · App iOS y Android · Web"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        {null}
      </CaseHero>

      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              Convertir a la audiencia de MasterChef en concursantes.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Una plataforma para el concurso online de MasterChef World: mini retos diarios, desafíos semanales en
              vídeo, directos con chefs y un ranking hacia el casting televisado. Identidad, experiencia y una sola
              base de código para la web y la app.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* La marca */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className="m-bleed">
          <BrandGlow />
        </div>
        <FadeIn className={`${grid} mt-6`}>
          <p className="col-span-12 t-small text-[var(--case-muted)] md:col-span-4 md:col-start-9">
            Lenguaje de competición con acabado culinario premium: el naranja de la casa en degradado, brillos que se
            mueven y círculos concéntricos que recuerdan al fogón.
          </p>
        </FadeIn>
      </section>
      <div className="mt-20 md:mt-28">
        {["/projects/elreto-masterchef/02_Brand-Identity/ElReto_9.png", "/projects/elreto-masterchef/02_Brand-Identity/ElReto_10.png"].map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" loading="lazy" className="block h-auto w-full" />
        ))}
      </div>

      <section className={section}>
        <Head eyebrow="La energía" title="Cada gesto suma, y se ve al momento." body="La energía es la moneda del concurso: sube con los retos, los vídeos y los likes, y cada 500 puntos se sube de nivel." />
        <div className={`${grid} items-center gap-y-12`}>
          <div className="col-span-12 md:col-span-5">
            <EnergyCard />
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <p className="mb-4 t-label t-tag text-[var(--case-muted)]">¿Cómo ganar más puntos?</p>
            {RULES.map(([a, b], k) => (
              <FadeIn key={a} delay={k * 0.05} className="flex items-baseline justify-between gap-4 border-t border-[var(--case-line)] py-3">
                <span className="t-small">{a}</span>
                <span className="shrink-0 t-small font-medium tabular-nums">{b}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className={section}>
        <Head eyebrow="Sigue al chef" title="Cocinar en directo, paso a paso y contra el reloj." body="Un chef cocina en directo y cada participante le sigue en casa: pasos con su tiempo, foto obligatoria al terminar cada uno y una nota final por fidelidad, tiempo, presentación y completitud." />
        <ChefLive />
      </section>

      <div className="mt-28 md:mt-40">
        <Funnel />
      </div>

      <section className={section}>
        <Head eyebrow="Dos superficies" title="Una base de código, dos maneras de entrar." body="La web, en escritorio, para descubrir e inscribirse. La app, en el móvil, para todo lo demás: el casting solo se puede grabar allí, porque necesita cámara y micrófono." />
        <DualSurface />
      </section>

      <section className={section}>
        <Head eyebrow="IA en el bucle" title="La IA hace el trabajo que no escala." />
        <div className={`${grid} gap-y-8`}>
          {[
            ["Vídeos", "Transcripción automática de los vídeos de los participantes."],
            ["Métricas", "Lectura de las métricas de los reels a partir de una captura."],
            ["Retos", "Preguntas del mini reto diario generadas y revisadas."],
          ].map(([t, d], k) => (
            <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 border-t border-[var(--case-line)] pt-5 md:col-span-3 ${k === 0 ? "md:col-start-2" : ""} ${k === 1 ? "md:col-start-6" : ""} ${k === 2 ? "md:col-start-10" : ""}`}>
              <p className="t-title">{t}</p>
              <p className="mt-3 t-small text-[var(--case-muted)]">{d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <CaseClosing className={section} title={outcomeTitle} />

      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
