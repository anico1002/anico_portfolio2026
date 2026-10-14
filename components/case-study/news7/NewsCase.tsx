"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, MaskReveal, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import LazyVideo from "@/components/case-study/LazyVideo";
import { DayEnds, LogoLoader, TopicBuilder, VersusTable } from "./NewsPieces";

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

      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              El día se acaba.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Un lector de noticias para iPhone y Apple Watch, hecho para mí. Los lectores de feeds son infinitos: nunca
              sabes si lees algo de hoy o de hace tres meses, y acabas por no abrirlos. 7news decide cuándo has
              terminado. Sin IA y sin servidor: todo pasa en el teléfono.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* La app entera, con contenido real (las fuentes del iPhone de Alberto, en el simulador): leer, filtrar la
          portada, crear un tema, borrar un grupo y los ajustes. Mockup en la pared de hormigón (2026-10-14):
          scripts/case-media/news.sh → clip_prep.py → mockup_video.py (receta scripts/mockups/recetas/7news-recorrido.json). */}
      <section className="pt-24 md:pt-36">
        {/* A pantalla completa: el móvil queda centrado y se recortan los lados. Sin FadeIn: un bloque más alto
            que la pantalla nunca llegaba a disparar su entrada. */}
        <LazyVideo
          src="/maqueta/7news/media/recorrido.mp4"
          poster="/maqueta/7news/media/recorrido-poster.jpg"
          aria-label="Recorrido por 7news: leer una noticia, elegir qué sale en portada, crear el tema Videojuegos, borrar un grupo y los ajustes"
          className="h-[100svh] w-full object-cover"
        />
      </section>

      {/* La marca: el logo es la barra de carga */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className="m-bleed">
          <LogoLoader />
        </div>
        <FadeIn className={`${grid} mt-6`}>
          <p className="col-span-12 t-small text-[var(--case-muted)] md:col-span-4 md:col-start-9">
            La pantalla de carga es el propio logo: empieza apagado y se rellena con el progreso real de la descarga.
          </p>
        </FadeIn>
      </section>

      <div className="mt-28 md:mt-40">
        <DayEnds />
      </div>

      <section className={section}>
        <Head
          eyebrow="Crear un tema"
          title="Se escribe un tema y las fuentes se buscan solas."
          body="Un índice de feeds y un buscador web traen candidatos; cuatro filtros —relevancia, idioma, actividad real y que se pueda leer dentro— dejan solo los buenos."
        />
        <TopicBuilder />
      </section>

      <section className={section}>
        <Head eyebrow="La diferencia" title="Lo que cambia frente a un lector cualquiera." />
        <VersusTable />
      </section>

      <section className={section}>
        <Head eyebrow="Avisos" title="Del iPhone a la muñeca." body="Tres titulares al día como notificación local, reflejados en el Apple Watch. Sin servidor y sin coste." />
        {/* El aviso (2026-10-14): notificación real del simulador (titulares del día) en el iPhone, en la pared
            con el suelo pasado a negro, y un Apple Watch flotando a su derecha, tocándolo solo por un canto, que
            recibe el aviso en cristal medio segundo después. La entrada se anima a partir de las capturas (con la
            pantalla bloqueada recordVideo no la recoge): notice_anim.py → mockup_video.py → float_watch.py. */}
        <div className="m-bleed">
          <MaskReveal from="right" speed={0}>
            <Placeholder ratio="3/2" src="/maqueta/7news/media/reloj.mp4" label="El aviso de 7news llega al iPhone y, al momento, al Apple Watch" />
          </MaskReveal>
        </div>
      </section>

      <section className={section}>
        <div className={`${grid} gap-y-10`}>
          {[
            ["48 horas", "La ventana del día. Lo anterior ya no es noticia."],
            ["3 por fuente", "Quien publica mucho deja de enterrar al resto."],
            ["0 €", "Sin servidor ni suscripciones: todo ocurre en el teléfono."],
          ].map(([t, d], k) => (
            <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 border-t border-[var(--case-line)] pt-5 md:col-span-3 ${k === 0 ? "md:col-start-2" : ""} ${k === 1 ? "md:col-start-6" : ""} ${k === 2 ? "md:col-start-10" : ""}`}>
              <p className="t-title">{t}</p>
              <p className="mt-3 t-small text-[var(--case-muted)]">{d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Resultado</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement" delay={STAGGER}>
              Un lector que se termina. Y por eso apetece volver a abrirlo.
            </Lines>
          </div>
        </div>
      </section>

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name={n.name} href={n.href} thumb={n.thumb} />
      </section>
      <SiteFooter />
    </main>
  );
}
