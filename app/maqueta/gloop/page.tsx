"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, MaskReveal, Parallax, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import Lines from "@/components/case-study/Lines";
import SiteFooter from "@/components/case-study/SiteFooter";
import OneThing from "@/components/case-study/gloop/OneThing";
import TeamShift from "@/components/case-study/gloop/TeamShift";
import ColorMeaning from "@/components/case-study/gloop/ColorMeaning";
import FourLayers from "@/components/case-study/gloop/FourLayers";
import ImagoCanon from "@/components/case-study/gloop/ImagoCanon";
import KitLaptop from "@/components/case-study/gloop/KitLaptop";
import NativeApp from "@/components/case-study/gloop/NativeApp";
import PhoneFrame from "@/components/case-study/gloop/PhoneFrame";
import ProcessLine from "@/components/case-study/gloop/ProcessLine";
import GameRoulette from "@/components/case-study/gloop/GameRoulette";

/* Caso de Gloop: el caso estrella del portfolio. Cada capítulo tiene su pieza propia, recreada con los
   tokens reales de la app (components/case-study/gloop/).

   Enfoque del copy (feedback de Alberto, 2026-10-13, «grábatelo a fuego»): quien lee es un recruiter o
   un cliente que entra por primera vez. Se cuenta QUÉ hizo Alberto (la dirección de arte de una app de
   fiesta entre amigos, el sistema, la app) con tono publicitario de agencia, nunca la cocina interna:
   nada de versiones, fechas, repositorios, SwiftUI, qué IA se usó ni qué partes son nativas. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

/** Foto de ambiente (las de concepto de la noche): entra como en la home, con la máscara que se abre desde
    un lado y la imagen asentándose, y luego hace su parallax interno sutil (Yakushev). */
function Mood({ src, ratio = "4/3", from = "left", className = "" }: { src: string; ratio?: string; from?: "left" | "right"; className?: string }) {
  return (
    <div className={`m-bleed ${className}`}>
      <MaskReveal from={from} speed={0}>
        <Placeholder ratio={ratio} src={src} label="Noche con amigos" />
      </MaskReveal>
    </div>
  );
}

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
              ["Proyecto", "App para salir con amigos"],
              ["Rol", "Art Direction · Product Design"],
              ["Entregables", "Dirección de arte · UX/UI · Design system · App iOS"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        <Placeholder kind="vídeo" ratio="auto" className="h-full" src="/maqueta/gloop/media/hero.mp4" label="Gloop" />
      </CaseHero>

      {/* 1 · Intro: qué es y de qué me encargué. El texto pequeño baja a la fila siguiente (feedback general). */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              Tus amigos, tus noches y todo lo que pasa en ellas. En una sola app, y con el aspecto de la fiesta que
              promete.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Me encargué de la dirección de arte desde la base: el lenguaje visual, el design system y el diseño
              UX/UI de la app. El encargo era uno: que toda la diversión de una noche cupiera en una app.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2 · El insight: por qué existe Gloop. */}
      <div className="mt-24 md:mt-40">
        <OneThing />
      </div>

      {/* 3 · Cambio de paradigma: la noche ya no depende del plan, sino de con quién la vives. */}
      <TeamShift />

      {/* 4 · El color habla. */}
      <section className={section}>
        <ColorMeaning />
      </section>

      {/* 5 · Por capas. */}
      <div className="mt-24 md:mt-40">
        <FourLayers />
      </div>

      {/* 6 · La forma. */}
      <section className={`pt-20 md:pt-32 ${wrap}`}>
        <ImagoCanon />
      </section>

      {/* 7 · El design system, con parada de scroll. */}
      <KitLaptop />

      {/* 8 · La app: no es un prototipo. */}
      <NativeApp />

      {/* 9 · La app en la mano, sobre la noche (feedback 2026-10-13): las fotos de concepto van detrás, lentas,
          y los móviles las pisan y pasan por encima a otra velocidad. El método se intercala entre las dos
          fotos para separarlo del proceso. */}
      <section className={`pt-28 md:pt-40 ${wrap}`}>
        <div className={`${grid} items-start`}>
          <Parallax speed={40} className="col-span-12 md:col-span-8 md:col-start-1 md:row-start-1">
            <Mood src="/maqueta/gloop/media/party-ev3.jpg" ratio="16/10" />
          </Parallax>
          <Parallax speed={260} className="relative z-10 col-span-8 col-start-3 -mt-24 md:col-span-3 md:col-start-8 md:row-start-1 md:mt-[22%]">
            <FadeIn>
              <PhoneFrame src="/maqueta/gloop/media/scr-noche.mp4" label="La noche en marcha" className="mx-auto max-w-[280px]" />
            </FadeIn>
          </Parallax>
        </div>
      </section>

      {/* 10 · El método, entre las dos fotos. */}
      <section className={`pt-28 md:pt-16 ${wrap}`}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-6 md:col-start-2">
            <FadeIn>
              <Eyebrow>El método</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement text-balance" delay={STAGGER}>
              La IA acelera. El criterio sigue siendo de diseño.
            </Lines>
            <FadeIn delay={2 * STAGGER} className="mt-8 max-w-[46ch]">
              <p className="t-body text-[var(--case-muted)]">
                Ninguna pantalla sale sin pasar por el ojo del diseño, y cada detalle se valida donde importa: en el
                móvil de verdad.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className={`pt-28 md:pt-40 ${wrap}`}>
        <div className={`${grid} items-start`}>
          <Parallax speed={40} className="col-span-12 md:col-span-8 md:col-start-5 md:row-start-1">
            <Mood src="/maqueta/gloop/media/party-ev6.jpg" ratio="16/10" from="right" />
          </Parallax>
          <Parallax speed={260} className="relative z-10 col-span-8 col-start-1 -mt-24 md:col-span-3 md:col-start-3 md:row-start-1 md:mt-[18%]">
            <FadeIn>
              <PhoneFrame src="/maqueta/gloop/media/scr-momentos.mp4" label="Momentos" className="mx-auto max-w-[280px]" />
            </FadeIn>
          </Parallax>
          <Parallax speed={340} className="relative z-10 col-span-8 col-start-5 mt-40 md:col-span-3 md:col-start-10 md:row-start-1 md:mt-[64%]">
            <FadeIn>
              <PhoneFrame src="/maqueta/gloop/media/scr-cuenta.mp4" label="La Cuenta" className="mx-auto max-w-[280px]" />
            </FadeIn>
          </Parallax>
        </div>
      </section>

      {/* 11 · El proceso, en horizontal. */}
      <div className="mt-28 md:mt-40">
        <ProcessLine />
      </div>

      {/* 12 · Momentos firma: los juegos. */}
      <section className="pt-36 md:pt-56">
        <GameRoulette />
      </section>

      {/* 13 · Cierre, centrado. */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 text-center md:col-span-8 md:col-start-3">
            <Lines className="t-statement" delay={STAGGER}>
              Las noches pasan. Lo que vives con los tuyos se queda en Gloop.
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
