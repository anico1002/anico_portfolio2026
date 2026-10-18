"use client";

import SectionHead from "@/components/case-study/SectionHead";
import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import LazyVideo from "@/components/case-study/LazyVideo";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, MaskReveal, Placeholder } from "@/components/case-study/primitives";
import { EASE, STAGGER } from "@/lib/maqueta/motion";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { D } from "./DovlaPieces";
import { CardFamily, ColorTokens, DovelaMosaic, KitSheet, LightDark, SpaceRadii, TypeScale } from "./DovlaKit";

/* Caso de Dovla, a medida. Rehecho el 2026-10-17 (Alberto): banca privada para clientes con mucho patrimonio, el UI
   kit como capítulo central (como en Interactius) y las dovelas que giran como hilo visual. Vídeos y capturas de la
   app real: scripts/case-media/dovla.sh (recorridos), dovla-kit.py (piezas del kit) y las recetas
   scripts/mockups/recetas/dovla-*.json. Todo en public/maqueta/dovla/{media,screens}, fuera de git.
   Pendiente de Alberto: si hay NDA y si se puede nombrar; la identidad (color y tipografía) viene de una agencia. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;
const Head = SectionHead;
const M = "/maqueta/dovla/media";

/** Cabecera de media pantalla (junto a una imagen): titulillo, titular y párrafo apilados, con los estilos de SectionHead. */
function SideHead({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div>
      <FadeIn>
        <p className="t-label t-tag text-[var(--case-muted)]">{eyebrow}</p>
      </FadeIn>
      <Lines as="h2" className="mt-4 t-statement text-balance" delay={STAGGER}>
        {title}
      </Lines>
      <FadeIn delay={2 * STAGGER} className="mt-8">
        <p className="t-body text-[var(--case-muted)]">{body}</p>
      </FadeIn>
    </div>
  );
}

/** El fondo de la página pasa a berenjena mientras la hoja de componentes ocupa la franja central de la pantalla (del 30 % al 70 %) y vuelve a
    negro al salir, con un fundido (como plastic.design; 2026-10-18, Alberto): las piezas son recortes de la app y
    sobre su propio berenjena se ven enteras. Capa fija bajo el contenido del caso, dentro de su capa. */
function useCentered<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-30% 0px -30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

export default function DovlaCase({ next: n }: { next: MoreCases }) {
  const { ref: kitRef, on: kitOn } = useCentered<HTMLElement>();
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />
      <CaseLayer>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: D.bg }}
        initial={false}
        animate={{ opacity: kitOn ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE.inOut }}
      />

      <CaseHero
        poster={<Placeholder ratio="auto" className="h-full" src={`${M}/hero.mp4`} label="Dovla" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="Dovla"
            delay={t}
            facts={[
              ["Para", "A private bank · In development"],
              ["Rol", "Lead Product Designer"],
              ["Qué hice", "iOS app · UI kit · Accessibility"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        {null}
      </CaseHero>

      {/* Intro: titular y párrafo a un lado, la app de verdad al otro (como 7news). */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} items-center gap-y-12`}>
          <div className="col-span-12 md:col-span-5 md:flex md:justify-center">
            <div className="md:max-w-[26rem]">
              <FadeIn>
                <Eyebrow>Introduction</Eyebrow>
              </FadeIn>
              <Lines className="t-intro" delay={STAGGER}>
                Wealth likes a quiet room.
              </Lines>
              <FadeIn delay={2 * STAGGER} className="mt-8">
                <p className="t-body text-[var(--case-muted)]">
                  A native iOS app for a private bank whose clients are never a number. Each one has an adviser who
                  answers, a concierge and cards that open private lounges. The app keeps all of it within reach and
                  never raises its voice.
                </p>
              </FadeIn>
            </div>
          </div>
          <div className="-mx-4 col-span-12 md:col-span-7 md:mx-0">
            <MaskReveal from="right" speed={0}>
              <LazyVideo
                src={`${M}/promo.mp4`}
                poster={`${M}/promo-poster.jpg`}
                aria-label="The travel benefits sheet in Dovla, with the photograph breaking into turning dovelas"
                className="aspect-[4/5] w-full object-cover md:aspect-auto md:h-[84vh]"
              />
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* La dovela: el patrón y las fotos que se deshacen en dovelas. */}
      <section className={section}>
        <Head
          eyebrow="Identity"
          title="The stone that holds the arch."
          body="A dovela is the wedge-shaped stone that keeps an arch standing. The pattern built from it turns slowly behind the balance and breaks up every photograph in the app."
        />
        <div className="m-bleed">
          <DovelaMosaic video={`${M}/app-flow.mp4`} />
        </div>
      </section>

      {/* UI kit: el capítulo central. Color, tipografía y espaciado en un solo bloque, con los párrafos alternando
          a un lado y a otro entre las muestras (2026-10-18, Alberto: «un bloque más homogéneo»). */}
      <section className={section}>
        <Head
          eyebrow="UI kit"
          title="Every screen comes from one kit."
          body="Colour, type, spacing and the components built from them are defined once. Screens are assembled from those pieces, so a change in the kit reaches the whole app, in both languages and both appearances."
        />
        <div className={grid}>
          <FadeIn className="col-span-12 md:col-span-4">
            <p className="t-body text-[var(--case-muted)]">
              The brand’s aubergine tired the eye at full screen, so the page went a step darker and aubergine moved to
              cards and tiles, where it lifts off the page. Sand on aubergine reads at 9 : 1.
            </p>
          </FadeIn>
        </div>
        <div className="mt-12 md:mt-16">
          <ColorTokens />
        </div>
        <div className="mt-24 md:mt-32">
          <TypeScale />
        </div>
        <div className={`${grid} mt-20 md:mt-28`}>
          <FadeIn className="col-span-12 md:col-span-4 md:col-start-8">
            <p className="t-body text-[var(--case-muted)]">
              The type comes in one family and eight styles, and each style grows with the reader’s text size. Spacing
              and corners follow a single short scale, so every piece lands on the same grid.
            </p>
          </FadeIn>
        </div>
        <div className="mt-12 md:mt-16">
          <SpaceRadii />
        </div>
      </section>

      <section ref={kitRef} className={section}>
        <Head
          eyebrow="Components"
          title="The pieces every screen is built from."
          body="Rows, buttons, cards and charts, each designed once with its states. A transaction looks the same on the home screen, in the statement and under a card."
        />
        <KitSheet />
      </section>

      {/* Tarjetas: la familia y el monedero en vídeo. */}
      <section className={section}>
        <Head
          eyebrow="Cards"
          title="Four cards, one family."
          body="Each card wears the dovela pattern in its own tone. In the app they rest in a fan, like a wallet."
        />
        <CardFamily />
      </section>
      <FadeIn className="mt-20 md:mt-28">
        <LazyVideo
          src={`${M}/cards.mp4`}
          poster={`${M}/cards-poster.jpg`}
          aria-label="Choosing a card from the fan, turning it over and opening its activity"
          className="aspect-[4/5] w-full object-cover md:aspect-[16/9]"
        />
      </FadeIn>

      {/* Accesibilidad: un solo bloque con claro y oscuro (2026-10-18, Alberto). Titular y párrafo a la izquierda; a la
          derecha, el móvil frontal y ampliado, fundido a negro por abajo, con la raya para cambiar de modo. */}
      <section className={section}>
        <div className={`${grid} items-center gap-y-12`}>
          <div className="col-span-12 md:col-span-5">
            <SideHead
              eyebrow="Accessibility"
              title="Clear at any size, in any light."
              body="Every style follows the reader’s text size up to 200%, and an amount shrinks before it breaks. Light and dark each have their own shades for money in and out, and the app speaks English and Spanish from the first screen."
            />
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <LightDark />
            <p className="mt-2 text-center t-small text-[var(--case-muted)]">Drag across the phone to switch.</p>
          </div>
        </div>
      </section>

      <CaseClosing className={section} title="Private banking for great fortunes, built on security and transparency." />

      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
