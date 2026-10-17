"use client";

import SectionHead from "@/components/case-study/SectionHead";
import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import LazyVideo from "@/components/case-study/LazyVideo";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, MaskReveal, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { DovelaPattern, LargeText } from "./DovlaPieces";
import { CardFamily, ColorTokens, DovelaPhoto, KitSheet, KitToScreen, LightDark, SpaceRadii, TypeScale } from "./DovlaKit";

/* Caso de Dovla, a medida. Rehecho el 2026-10-17 (Alberto): banca privada para clientes con mucho patrimonio, el UI
   kit como capítulo central (como en Interactius) y las dovelas que giran como hilo visual. Vídeos y capturas de la
   app real: scripts/case-media/dovla.sh (recorridos), dovla-kit.py (piezas del kit) y las recetas
   scripts/mockups/recetas/dovla-*.json. Todo en public/maqueta/dovla/{media,screens}, fuera de git.
   Pendiente de Alberto: si hay NDA y si se puede nombrar; la identidad (color y tipografía) viene de una agencia. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;
const sub = `pt-24 md:pt-36 ${wrap}`;
const Head = SectionHead;
const M = "/maqueta/dovla/media";

/** Cabecera de media pantalla (junto a una imagen): titulillo, titular y párrafo apilados, con los estilos de SectionHead. */
function SideHead({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="md:max-w-[30rem]">
      <FadeIn>
        <p className="t-label t-tag text-[var(--case-muted)]">{eyebrow}</p>
      </FadeIn>
      <Lines as="h2" className="mt-4 t-statement text-balance" delay={STAGGER}>
        {title}
      </Lines>
      <FadeIn delay={2 * STAGGER} className="mt-8">
        <p className="t-body text-[var(--case-muted)] md:max-w-[26rem]">{body}</p>
      </FadeIn>
    </div>
  );
}

/* El kit va sobre un escenario berenjena noche a sangre: es el color de las hojas de la app. */
const stage = "m-bleed bg-[#1C0B17] px-4 py-24 md:px-6 md:py-36";

export default function DovlaCase({ next: n }: { next: MoreCases }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />
      <CaseLayer>

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
                  A native iOS app for a private bank. Its clients hold a great deal and expect to be known by name:
                  an adviser who answers, a concierge, cards that open lounges. The app puts all of it within reach
                  and keeps the volume low.
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
        <div className={`${grid} gap-y-6`}>
          <FadeIn className="col-span-12 md:col-span-6">
            <DovelaPhoto src={`${M}/photo-travel.jpg`} alt="A first-class cabin window, breaking into dovelas" ratio={2 / 3} />
          </FadeIn>
          <FadeIn delay={STAGGER} className="col-span-10 col-start-3 md:col-span-4 md:col-start-8 md:mt-40">
            <DovelaPhoto src={`${M}/photo-concierge.jpg`} alt="A yacht at sunset, breaking into dovelas" ratio={2 / 3} />
          </FadeIn>
        </div>
        <div className="m-bleed mt-24 md:mt-36">
          <DovelaPattern />
        </div>
      </section>

      {/* UI kit: el capítulo central. */}
      <section className={section}>
        <Head
          eyebrow="UI kit"
          title="Every screen comes from one kit."
          body="Colour, type, spacing and the components built from them are defined once. Screens are assembled from those pieces, so a change in the kit reaches the whole app, in both languages and both appearances."
        />
      </section>
      <div className={`${stage} mt-4`}>
        <KitToScreen />
      </div>

      <section className={sub}>
        <Head
          eyebrow="Colour"
          title="Aubergine for surfaces, sand for reading."
          body="The brand’s aubergine tired the eye at full screen, so the page went a step darker and aubergine moved to cards and tiles, where it lifts off the page. Sand on aubergine reads at 9 : 1."
        />
        <ColorTokens />
      </section>

      <section className={sub}>
        <Head eyebrow="Type" title="One typeface, eight styles." />
        <TypeScale />
      </section>

      <section className={sub}>
        <Head eyebrow="Spacing" title="Everything sits on the same grid." />
        <SpaceRadii />
      </section>

      <section className={sub}>
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
          body="Each card wears the dovela pattern in its own tone. In the app they rest in a fan, like a wallet: pick one and it rises to the top, scroll its activity and it steps aside."
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

      {/* Servicio privado. */}
      <section className={section}>
        <div className={`${grid} items-center gap-y-12`}>
          <div className="col-span-12 md:col-span-6">
            <SideHead
              eyebrow="Private service"
              title="The adviser is one tap from the balance."
              body="Lounges, a personal adviser and a concierge sit on the home screen next to the money. Each opens on its own photograph, with the benefits written plainly and a single way to ask for them."
            />
          </div>
          <FadeIn delay={STAGGER} className="col-span-10 col-start-2 md:col-span-4 md:col-start-8">
            <DovelaPhoto src={`${M}/photo-invest.jpg`} alt="A grand touring car at night, breaking into dovelas" ratio={2 / 3} />
          </FadeIn>
        </div>
      </section>

      <section className={section}>
        <Head
          eyebrow="Accessibility"
          title="At 200%, an amount never breaks."
          body="With the largest accessibility text, rows stack instead of cutting off. An amount shrinks before it wraps."
        />
        <LargeText />
      </section>

      <section className={section}>
        <div className={`${grid} items-center gap-y-12`}>
          <div className="col-span-12 md:col-span-6">
            <SideHead eyebrow="Appearance" title="Light and dark, from the same pieces." body="Two sets of tokens, one layout. Drag across the phone to switch." />
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <LightDark />
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={`${grid} gap-y-10`}>
          {[
            ["English and Spanish", "Bilingual from the first screen."],
            ["Light and dark", "Each with its own shades for money in and out."],
            ["Text up to 200%", "The full scale, with nothing cut off."],
          ].map(([t, d], k) => (
            <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 border-t border-[var(--case-line)] pt-5 md:col-span-3 ${k === 0 ? "md:col-start-2" : ""} ${k === 1 ? "md:col-start-6" : ""} ${k === 2 ? "md:col-start-10" : ""}`}>
              <p className="t-title">{t}</p>
              <p className="mt-3 t-small text-[var(--case-muted)]">{d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <CaseClosing className={section} title="A private bank built from one kit, ready for its engineers." />

      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
