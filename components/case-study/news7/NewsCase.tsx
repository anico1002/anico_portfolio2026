"use client";

import SectionHead from "@/components/case-study/SectionHead";
import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, MaskReveal, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import LazyVideo from "@/components/case-study/LazyVideo";
import { DayEnds, VersusTable, WatchStage } from "./NewsPieces";

/* Caso de 7news, a medida (2026-10-13). Hechos del repo 7News (README, DECISIONES, código). Piezas recreadas
   y, desde el 2026-10-14, la app de verdad en mockups (cabecera y recorrido). Pendiente de Alberto: por qué «7». */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

/* Cabecera de capítulo con el feedback general de Gloop (2026-10-14): titulillo sin número, titular
   equilibrado y el párrafo cerca de él, alineado con su última línea (no colgado arriba ni pegado al borde). */
const Head = SectionHead;

export default function NewsCase({ next: n }: { next: MoreCases }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />
      <CaseLayer>

      <CaseHero
        poster={<Placeholder ratio="auto" className="h-full" src="/maqueta/7news/media/hero.mp4" label="7news" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="7news"
            delay={t}
            facts={[
              ["Para", "Personal project"],
              ["Rol", "Lead Product Designer"],
              ["Qué hice", "iOS app · Apple Watch · Logo"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        {null}
      </CaseHero>

      {/* Intro (feedback 2026-10-14): se abre con la app de verdad y el flujo entero (leer, filtrar la portada, crear un
          tema, guardar…) a un lado, y el titular con su párrafo al otro, centrados en su hueco. En Gloop la apertura
          va a sangre; aquí, a media pantalla. Recorrido: scripts/case-media/news.sh → clip_prep.py →
          mockup_video.py (receta scripts/mockups/recetas/7news-recorrido.json). Fuera la carga del logo en grande. */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} items-center gap-y-12`}>
          <div className="col-span-12 md:col-span-5 md:flex md:justify-center">
            <div className="md:max-w-[26rem]">
              <FadeIn>
                <Eyebrow>Introduction</Eyebrow>
              </FadeIn>
              <Lines className="t-intro" delay={STAGGER}>
                The day has an end.
              </Lines>
              <FadeIn delay={2 * STAGGER} className="mt-8">
                <p className="t-body text-[var(--case-muted)]">
                A news reader for iPhone and Apple Watch, made for me. Feed readers never end: you can’t tell today’s
                story from one three months old, so you stop opening them. 7news tells you when you’re done. No AI, no
                server: everything happens on the phone.
                </p>
              </FadeIn>
            </div>
          </div>
          <div className="-mx-4 col-span-12 md:col-span-7 md:mx-0">
            <MaskReveal from="right" speed={0}>
              <LazyVideo
                src="/maqueta/7news/media/recorrido.mp4"
                poster="/maqueta/7news/media/recorrido-poster.jpg"
                aria-label="A tour of 7news: reading a story, choosing what makes the front page, creating a Video games topic and saving for later"
                className="aspect-[4/5] w-full object-cover md:aspect-auto md:h-[84vh]"
              />
            </MaskReveal>
          </div>
        </div>
      </section>

      <div className="mt-28 md:mt-40">
        <DayEnds />
      </div>

      {/* Más cerca del final de «El día se acaba» (feedback 2026-10-14: quedaba demasiado separado). */}
      <section className={`pt-12 md:pt-16 ${wrap}`}>
        <Head eyebrow="The difference" title="What changes compared with any other reader." />
        <VersusTable />
      </section>

      <section className={section}>
        <Head eyebrow="Notifications" title="From iPhone to wrist." body="Three headlines a day, mirrored on the Apple Watch. No server, no cost." />
      </section>
      {/* El aviso: notificación real del simulador en el iPhone y el Watch flotando a su derecha
          (notice_anim.py → mockup_video.py → float_watch.py). Desde el 2026-10-14 se queda fija un rato y las
          cifras entran sobre la piedra (WatchStage). */}
      <WatchStage />

      <CaseClosing className={section} title="A reader that ends. That’s exactly why you’ll want to open it again." />

      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
