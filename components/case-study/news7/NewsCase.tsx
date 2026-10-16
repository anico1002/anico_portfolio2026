"use client";

import NextCase from "@/components/case-study/NextCase";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
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
function Head({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className={`${grid} mb-14 items-end gap-y-8 md:mb-20 md:[align-items:last_baseline]`}>
      <div className="col-span-12 md:col-span-6">
        <FadeIn>
          <p className="t-label t-tag text-[var(--case-muted)]">{eyebrow}</p>
        </FadeIn>
        <Lines as="h2" className="mt-4 t-statement text-balance" delay={STAGGER}>
          {title}
        </Lines>
      </div>
      {body && (
        <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8">
          <p className="t-body text-[var(--case-muted)]">{body}</p>
        </FadeIn>
      )}
    </div>
  );
}

export default function NewsCase({ next: n }: { next: { name: string; href: string; thumb?: string } }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />

      <CaseHero
        poster={<Placeholder ratio="auto" className="h-full" src="/maqueta/7news/media/hero.mp4" label="7news" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="7news"
            delay={t}
            facts={[
              ["Para", "Proyecto propio"],
              ["Rol", "Diseño y desarrollo"],
              ["Qué hice", "App iOS · Apple Watch · Logo"],
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
                <Eyebrow>Introducción</Eyebrow>
              </FadeIn>
              <Lines className="t-intro" delay={STAGGER}>
                El día se acaba.
              </Lines>
              <FadeIn delay={2 * STAGGER} className="mt-8">
                <p className="t-body text-[var(--case-muted)]">
                  Un lector de noticias para iPhone y Apple Watch, hecho para mí. Los lectores de feeds son infinitos: nunca
                  sabes si lees algo de hoy o de hace tres meses, y acabas por no abrirlos. 7news decide cuándo has
                  terminado. Sin IA y sin servidor: todo pasa en el teléfono.
                </p>
              </FadeIn>
            </div>
          </div>
          <div className="-mx-4 col-span-12 md:col-span-7 md:mx-0">
            <MaskReveal from="right" speed={0}>
              <LazyVideo
                src="/maqueta/7news/media/recorrido.mp4"
                poster="/maqueta/7news/media/recorrido-poster.jpg"
                aria-label="Recorrido por 7news: leer una noticia, elegir qué sale en portada, crear el tema Videojuegos y guardar para después"
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
        <Head eyebrow="La diferencia" title="Lo que cambia frente a otro reader." />
        <VersusTable />
      </section>

      <section className={section}>
        <Head eyebrow="Avisos" title="Del iPhone a la muñeca." body="Tres titulares al día como notificación local, reflejados en el Apple Watch. Sin servidor y sin coste." />
      </section>
      {/* El aviso: notificación real del simulador en el iPhone y el Watch flotando a su derecha
          (notice_anim.py → mockup_video.py → float_watch.py). Desde el 2026-10-14 se queda fija un rato y las
          cifras entran sobre la piedra (WatchStage). */}
      <WatchStage />

      <CaseClosing className={section} title="Un lector que se termina. Y por eso apetece volver a abrirlo." />

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name={n.name} href={n.href} thumb={n.thumb} />
      </section>
      <SiteFooter />
    </main>
  );
}
