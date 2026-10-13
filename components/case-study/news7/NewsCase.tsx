"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { DayEnds, LogoLoader, TopicBuilder, VersusTable, WristNotice } from "./NewsPieces";

/* Caso de 7news, a medida (2026-10-13). Hechos del repo 7News (README, DECISIONES, código). Sin capturas:
   piezas recreadas. Pendiente de Alberto: por qué «7» (y antes «8»). */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

function Head({ n, eyebrow, title, body }: { n: string; eyebrow: string; title: string; body?: string }) {
  return (
    <div className={`${grid} mb-14 gap-y-6 md:mb-20`}>
      <div className="col-span-12 md:col-span-7">
        <FadeIn>
          <p className="t-label t-tag text-[var(--case-muted)]">
            {n} · {eyebrow}
          </p>
        </FadeIn>
        <Lines as="h2" className="mt-4 t-statement" delay={STAGGER}>
          {title}
        </Lines>
      </div>
      {body && (
        <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:mt-20">
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
        poster={<Placeholder ratio="auto" className="h-full" src="/maqueta/7news/cover.jpg" label="7news" />}
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
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:mt-16">
            <p className="t-body text-[var(--case-muted)]">
              Un lector de noticias para iPhone y Apple Watch, hecho para mí. Los lectores de feeds son infinitos: nunca
              sabes si lees algo de hoy o de hace tres meses, y acabas por no abrirlos. 7news decide cuándo has
              terminado. Sin IA y sin servidor: todo pasa en el teléfono.
            </p>
          </FadeIn>
        </div>
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
          n="02"
          eyebrow="Crear un tema"
          title="Se escribe un tema y las fuentes se buscan solas."
          body="Un índice de feeds y un buscador web traen candidatos; cuatro filtros —relevancia, idioma, actividad real y que se pueda leer dentro— dejan solo los buenos."
        />
        <TopicBuilder />
      </section>

      <section className={section}>
        <Head n="03" eyebrow="La diferencia" title="Lo que cambia frente a un lector cualquiera." />
        <VersusTable />
      </section>

      <section className={section}>
        <Head n="04" eyebrow="Avisos" title="Del iPhone a la muñeca." body="Tres titulares al día como notificación local, reflejados en el Apple Watch. Sin servidor y sin coste." />
        <WristNotice />
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
