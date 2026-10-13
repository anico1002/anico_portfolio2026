"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import {
  CaseHero,
  CaseHeroOverlay,
  Eyebrow,
  FadeIn,
  Parallax,
  Phone,
  Placeholder,
  WindowReveal,
} from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import Lines from "@/components/case-study/Lines";
import SiteFooter from "@/components/case-study/SiteFooter";
import OneThing from "@/components/case-study/gloop/OneThing";
import TeamShift from "@/components/case-study/gloop/TeamShift";
import ColorMeaning from "@/components/case-study/gloop/ColorMeaning";
import FourLayers from "@/components/case-study/gloop/FourLayers";
import ImagoCanon from "@/components/case-study/gloop/ImagoCanon";
import KitLaptop from "@/components/case-study/gloop/KitLaptop";
import ProcessLine from "@/components/case-study/gloop/ProcessLine";
import GameRoulette from "@/components/case-study/gloop/GameRoulette";

/* Caso de Gloop, rehecho a medida el 2026-10-13: es el caso estrella del portfolio (el que mejor enseña
   el trabajo que Alberto vende hoy). Ya no se apoya en capturas de móvil («hay demasiado móvil»): cada
   capítulo tiene su pieza propia, recreada con los tokens reales de la app (components/case-study/gloop/).
   Hechos sacados del repo de Gloop (specs, NOTES, git); textos en borrador, a falta de la revisión de copy.
   Plan completo en docs/plan-contenidos-casos.md. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

export default function GloopCase() {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav />

      {/* 0 · Cabecera: la miniatura de la home crece hasta aquí y funde al vídeo de la app. */}
      <CaseHero
        videoReady
        poster={<Placeholder ratio="auto" className="h-full" src="/maqueta/gloop/cover.jpg" label="Gloop" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="Gloop"
            delay={t}
            facts={[
              ["Proyecto", "App social para grupos de amigos"],
              ["Rol", "Lead Product Designer"],
              ["Entregables", "Estrategia · UX/UI · Design system · App nativa iOS"],
              ["Año", "2026 · En desarrollo"],
            ]}
          />
        )}
      >
        <Placeholder kind="vídeo" ratio="auto" className="h-full" src="/maqueta/gloop/media/hero.mp4" label="Gloop" />
      </CaseHero>

      {/* 1 · Intro: qué es y qué hice. */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              La vida de un grupo de amigos, en una sola app: la pregunta del día, la noche, los juegos, las fotos y
              las cuentas.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:mt-48">
            <p className="t-body text-[var(--case-muted)]">
              Rediseño de una app que ya existía en iOS y Android. Diseñé el producto de principio a fin: la
              estrategia, la experiencia, el sistema y una app nativa en SwiftUI que hoy vive en el repositorio del
              equipo de desarrollo.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2 · El hallazgo: de todo a la vez a una sola cosa. */}
      <div className="mt-24 md:mt-40">
        <OneThing />
      </div>

      {/* 3 · El giro: del evento al equipo. */}
      <TeamShift />

      {/* 4 · El color significa algo. */}
      <section className={section}>
        <ColorMeaning />
      </section>

      {/* 5 · Las cuatro capas. */}
      <div className="mt-24 md:mt-40">
        <FourLayers />
      </div>

      {/* 6 · El canon de formas. */}
      <section className={`pt-20 md:pt-32 ${wrap}`}>
        <ImagoCanon />
      </section>

      {/* 7 · El UI kit, vivo, en un portátil (a sangre, sobre la marca). */}
      <KitLaptop />

      {/* 8 · La app nativa: un único momento grande y dos piezas, no un móvil por sección. */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>La app nativa</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement" delay={STAGGER}>
              El handoff no es una maqueta: es una app en SwiftUI que funciona en el iPhone.
            </Lines>
          </div>
        </div>
      </section>
      <div className="mt-20 md:mt-28">
        <WindowReveal>
          <Placeholder kind="vídeo" ratio="auto" className="h-full" src="/maqueta/gloop/media/nativa.mp4" label="La app nativa en el iPhone" />
        </WindowReveal>
      </div>
      <section className={`pt-20 md:pt-32 ${wrap}`}>
        <div className={`${grid} items-start gap-y-14`}>
          <Parallax speed={60} className="col-span-12 md:col-span-3 md:col-start-2">
            <FadeIn>
              <Phone src="/maqueta/gloop/media/exp-noche.mp4" label="La noche en marcha" className="mx-auto max-w-[300px]" />
            </FadeIn>
            <FadeIn delay={STAGGER}>
              <p className="mt-5 t-small text-[var(--case-muted)]">La noche en marcha: caras, marcador y el juego que toca.</p>
            </FadeIn>
          </Parallax>
          <Parallax speed={180} className="col-span-12 md:col-span-3 md:col-start-8 md:mt-48">
            <FadeIn>
              <Phone src="/maqueta/gloop/media/exp-momentos.mp4" label="Momentos" className="mx-auto max-w-[300px]" />
            </FadeIn>
            <FadeIn delay={STAGGER}>
              <p className="mt-5 t-small text-[var(--case-muted)]">Momentos: las fotos de la noche, reveladas al día siguiente.</p>
            </FadeIn>
          </Parallax>
        </div>
      </section>

      {/* 9 · El método: IA para construir, criterio de diseño para decidir. */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-6">
            <FadeIn>
              <Eyebrow>El método</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement" delay={STAGGER}>
              La IA acelera la construcción. El criterio sigue siendo de diseño.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 mt-6 md:col-span-4 md:col-start-8 md:mt-24">
            <p className="t-body text-[var(--case-muted)]">
              Prototipo en código, vídeos de recorrido y desarrollo en SwiftUI con Claude Code. Ninguna pantalla
              avanza sin revisión de diseño, y cada cambio se valida en el dispositivo.
            </p>
          </FadeIn>
        </div>
      </section>
      <div className="mt-16 md:mt-24">
        <ProcessLine />
      </div>

      {/* 10 · Momentos firma: la ruleta de juegos. */}
      <section className="pt-36 md:pt-56">
        <GameRoulette />
      </section>

      {/* 11 · Próximos pasos. */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Próximos pasos</Eyebrow>
            </FadeIn>
            <Lines className="t-statement" delay={STAGGER}>
              La base nativa y el sistema ya están con el equipo de desarrollo. La siguiente fase lleva las
              experiencias completas a la app.
            </Lines>
          </div>
        </div>
      </section>

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name="El Reto MasterChef" href="/maqueta/elreto-masterchef" thumb="/projects/elreto-masterchef/ElReto_thumb.png" />
      </section>
      <SiteFooter />
    </main>
  );
}
