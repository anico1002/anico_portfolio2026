"use client";

import SectionHead from "@/components/case-study/SectionHead";
import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import { CaseHero, CaseHeroOverlay, FadeIn, Placeholder } from "@/components/case-study/primitives";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { useReduce } from "@/lib/maqueta/reduce";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { D } from "./DovlaPieces";
import { CardWallet, ColorTokens, DovelaIntro, DovelaMosaic, KitSheet, LightDark, SpaceRadii, TypeScale } from "./DovlaKit";

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

const INTRO = {
  eyebrow: "Introduction",
  title: "Wealth likes a quiet room.",
  body: "A native iOS app for a private bank whose clients are never a number. Each one has an adviser who answers, a concierge and cards that open private lounges. The app keeps all of it within reach and never raises its voice.",
};
const IDENTITY = {
  eyebrow: "Identity",
  title: "The stone that holds the arch.",
  body: "A dovela is the wedge-shaped stone that keeps an arch standing. The pattern built from it turns slowly behind the balance and breaks up every photograph in the app.",
};

/** Cabecera de media pantalla (junto a una imagen): titulillo, titular y párrafo apilados, con los estilos de SectionHead. */
function SideHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div>
      <FadeIn>
        <p className="t-label t-tag text-[var(--case-muted)]">{eyebrow}</p>
      </FadeIn>
      <Lines as="h2" className="mt-4 t-statement text-balance" delay={STAGGER}>
        {title}
      </Lines>
      {body && (
        <FadeIn delay={2 * STAGGER} className="mt-8">
          <p className="t-body text-[var(--case-muted)]">{body}</p>
        </FadeIn>
      )}
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
  const reduce = useReduce();
  // En móvil la cabecera es vertical y el vídeo ya sale ampliado: el acercamiento es solo para escritorio.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
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
        poster={
          // El móvil 3D, más grande en la cabecera (2026-10-18, Alberto: «queda muy pequeño… aunque se corte por arriba y
          // por abajo»). Arranca con el encuadre de la miniatura (hero-3d-bg.mp4: el mismo plano a 108 mm, centrado en el
          // móvil), para que el vuelo desde la tarjeta aterrice sin salto, y mientras la cabecera se recoge a la franja de
          // arriba se asienta (1,25×) y sube hasta quedar centrado en ella.
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 108 / 85, x: "0%", y: "0%" }}
            animate={wide ? { scale: 1.25, x: "0%", y: "-22%" } : { scale: 1, x: "0%", y: "0%" }}
            transition={{ duration: DUR.slow, ease: EASE.inOut, delay: 0.2 }}
          >
            <Placeholder ratio="auto" className="h-full" src={`${M}/hero-3d.mp4`} label="Dovla" />
          </motion.div>
        }
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

      {/* Intro + Identidad en un solo bloque (2026-10-18, Alberto): en escritorio, titular y párrafo arriba, la mancha
          diagonal de dovelas con el móvil a la izquierda y el texto de la dovela abajo a la derecha, sobre negro. En
          móvil, apilado. El vídeo de la tarjeta promo (media/promo.mp4) ya no se usa: no aportaba. */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        {wide ? (
          <DovelaIntro video={`${M}/app-flow.mp4`} intro={INTRO} identity={IDENTITY} />
        ) : (
          <>
            <Head eyebrow={INTRO.eyebrow} title={INTRO.title} body={INTRO.body} />
            <div className="relative left-1/2 w-screen -translate-x-1/2">
              <DovelaMosaic video={`${M}/app-flow.mp4`} />
            </div>
            <div className="mt-24">
              <Head eyebrow={IDENTITY.eyebrow} title={IDENTITY.title} body={IDENTITY.body} />
            </div>
          </>
        )}
      </section>

      {/* UI kit: el capítulo central. Color, tipografía y espaciado en un solo bloque, con los párrafos alternando
          a un lado y a otro entre las muestras (2026-10-18, Alberto: «un bloque más homogéneo»). */}
      <section className={`pt-16 md:pt-20 ${wrap}`}>
        <Head
          eyebrow="UI kit"
          title="Every screen comes from one kit."
          body="Colour, type, spacing and the components built from them are defined once. Screens are assembled from those pieces, so a change in the kit reaches the whole app, in both languages and both appearances."
        />
        <div>
          <ColorTokens />
        </div>
        {/* El texto del color va debajo de la paleta, en el hueco de la columna del «Aa» (2026-10-18, Alberto: que no
            queden dos párrafos seguidos encima de los colores). */}
        <div className="mt-24 md:mt-32">
          <TypeScale
            lead={
              <FadeIn>
                <p className="t-body text-[var(--case-muted)]">
                  The brand’s aubergine tired the eye at full screen, so the page went a step darker and aubergine moved
                  to cards and tiles, where it lifts off the page. Sand on aubergine reads at 9 : 1.
                </p>
              </FadeIn>
            }
          />
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

      {/* Tarjetas: el monedero. */}
      <section className={section}>
        {/* Titular a la izquierda y párrafo más estrecho, una columna más a la derecha y más abajo, en el hueco sobre el
            móvil (2026-10-18, Alberto): así el texto va con el móvil y no pegado a la tarjeta grande. */}
        <div className={`${grid} gap-y-8`}>
          <div className="col-span-12 md:col-span-6">
            <SideHead eyebrow="Cards" title="Four cards, one family." />
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-3 md:col-start-9 md:mt-[9vw]">
            <p className="t-body text-[var(--case-muted)]">
              Each card wears the dovela pattern in its own tone. In the app they rest in a fan, like a wallet.
            </p>
          </FadeIn>
        </div>
        {/* El monedero como en la app, con el móvil al lado (2026-10-18, Alberto: el vídeo de tarjetas iba aparte y
            muy separado). El vídeo de escena de antes, media/cards.mp4, sigue guardado. */}
        <div className="mt-10 md:mt-0">
          <CardWallet video={`${M}/cards-screen.mp4`} />
        </div>
      </section>

      {/* Accesibilidad: un solo bloque con claro y oscuro (2026-10-18, Alberto). Titular y párrafo a la izquierda; a la
          derecha, el móvil frontal y ampliado, fundido a negro por abajo, con la raya para cambiar de modo. */}
      <section className={section}>
        <div className={`${grid} items-center gap-y-12`}>
          <div className="col-span-12 md:col-span-5">
            <SideHead
              eyebrow="Accessibility"
              title="Clear at any size, in any light."
              body="Every style follows the reader’s text size up to 200%, and an amount shrinks before it breaks. VoiceOver reads each transaction as a single sentence, and the spending chart can be heard as well as seen. Light and dark have their own shades for money in and out, and the whole app speaks English and Spanish."
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
