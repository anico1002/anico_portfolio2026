"use client";

import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import CaseClosing from "@/components/case-study/CaseClosing";
import { BandMedia, CaseHero, CaseHeroOverlay, Eyebrow, FadeIn } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { MarkdownToSlide } from "./DeckDemos";
import { TokenSync, ToneCheck } from "./BrandDemos";
import { AiLayer, DeckWindow, ImagePrompt, ManualWindow, WebLaptop, WebPhone } from "./AiPieces";
import TypePair from "./TypePair";
import LogoStory from "./LogoStory";
import { IX, ixFonts } from "./tokens";

/* Caso de Interactius, a medida (2026-10-13; rehecho el 2026-10-16 con el feedback de Alberto: fuera las
   formas geométricas, el Gantt y el texto líquido; dentro el logo en técnico, las dos tipografías, la web en
   un portátil y un capítulo central sobre la marca preparada para IA). El manual de marca vivo y su generador de presentaciones,
   contados con piezas recreadas con su retícula y sus tokens reales (components/case-study/interactius/).
   Hechos del repo interactius-brandguidelines. Pendiente de Alberto: cómo repartir el crédito con el resto
   del equipo (ver docs/plan-contenidos-casos.md). Las fotos del universo de marca no se versionan. */

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


export default function InteractiusCase({ next: n }: { next: MoreCases }) {
  return (
    <main className={`relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased ${ixFonts}`}>
      <SiteNav active="product" />
      <CaseLayer>

      <CaseHero
        videoReady
        poster={<BandMedia desktop="/maqueta/interactius/hero-band.mp4" mobile="/maqueta/interactius/thumb.mp4" label="Interactius" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="Interactius"
            delay={t}
            facts={[
              ["Para", "Interactius"],
              ["Rol", "Diseño de producto y de sistema"],
              ["Qué hice", "Rebranding · Web · Manual de marca · Herramientas"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        <BandMedia desktop="/maqueta/interactius/hero-band.mp4" mobile="/maqueta/interactius/thumb.mp4" label="Interactius" />
      </CaseHero>

      {/* Intro */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              Una marca nueva, una web y un manual pensado también para la IA.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Interactius, partner estratégico en experiencias y transformación cultural, renovó su marca en 2026: el
              rebranding, la web y un manual escrito para dos lectores, su equipo y los modelos de IA con los que ya
              trabaja. Cada decisión tiene su versión para personas y su versión para máquinas.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* El logotipo, en técnico (PROPUESTA: Alberto quiere repasarlo juntos). Lámina de construcción del
          repo (public/concepto/interactius-logo-tecnic.svg): retícula, medidas y los cortes marcados. */}
      <section className={section}>
        <Head
          eyebrow="El logotipo"
          title="Un macrón que corrige cómo se dice."
          body="Un logotipo construido sobre IBM Plex Mono con una sola intervención: el macrón sobre la última i. De ella sale todo el sistema."
        />
        <FadeIn>
          <div className="m-bleed overflow-hidden px-4 py-14 md:px-16 md:py-28" style={{ background: IX.light }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/maqueta/interactius/brand/interactius-logo-tecnic.svg" alt="Construcción del logotipo de interactīus" className="mx-auto w-full max-w-[64rem]" />
          </div>
        </FadeIn>
        <div className="mt-2">
          <LogoStory />
        </div>
      </section>

      {/* Tipografía: las dos de la marca y por qué */}
      <section className={section}>
        <Head
          eyebrow="Tipografía"
          title="Una letra que mide y otra que habla."
          body="IBM Plex Mono construye el logotipo y IBM Plex Serif pone la voz en los titulares. Las dos son libres: cualquier herramienta o IA puede usarlas."
        />
        <TypePair />
      </section>

      {/* La web corporativa (gran parte del trabajo, junto al rebranding): MacBook real y la versión móvil */}
      <section className={section}>
        <Head
          eyebrow="La web"
          title="La nueva marca, en su primera casa."
          body="La web pone la marca a trabajar: el logotipo en vertical en el margen, las dos letras, la fotografía liminal y los servicios y casos contados con la voz nueva."
        />
        <WebLaptop />
        <WebPhone />
      </section>

      {/* El manual: ventana de navegador, sin enlace */}
      <section className={section}>
        <Head
          eyebrow="El manual"
          title="Un manual que se consulta en la web, en tres idiomas."
          body="Quince secciones en castellano, inglés y catalán, con cada logo, color y tipografía listos para descargar."
        />
        <ManualWindow />
      </section>

      {/* Preparada para IA: el capítulo central */}
      <section className={section}>
        <Head
          eyebrow="Preparada para IA"
          title="La dirección de arte, convertida en instrucciones."
          body="El universo visual se describe en un prompt técnico que se copia con un clic, para que cualquier imagen generada encaje con la marca desde el primer intento."
        />
        <ImagePrompt />
      </section>

      <section className={section}>
        <Head eyebrow="El tono" title="La voz de la marca, en un prompt." body="Frases de 15 a 22 palabras, sin exclamaciones y con 48 conceptos de consultora vetados. Se copia con un clic, y el validador avisa antes de que nada salga de la oficina." />
        <ToneCheck />
      </section>

      <section className={section}>
        <Head eyebrow="Para máquinas" title="Todo el manual, en un formato que una IA sabe leer." />
        <AiLayer />
      </section>

      <section className={section}>
        <Head eyebrow="Un solo origen" title="Se cambia en un sitio y cambia en todos." body="Colores, tipografía y reglas viven en un único archivo. De ahí salen la web, los prompts, la API de marca y cada diapositiva." />
        <TokenSync />
      </section>

      {/* DeckMakr, a todo el ancho (PROVISIONAL: recreado; falta grabar la herramienta de verdad) */}
      <section className={section}>
        <Head
          eyebrow="DeckMak_r"
          title="Una propuesta comercial, lista en minutos."
          body="Montar cada presentación comercial le costaba días al equipo. Diseñé una herramienta que automatiza el proceso con IA: el equipo escribe la idea y recibe una propuesta con la marca impecable."
        />
      </section>
      <div className="mt-4 md:px-6">
        <DeckWindow>
          <MarkdownToSlide />
        </DeckWindow>
      </div>

      {/* Datos, en pequeño: repartidos a todo el ancho y pegados a la ventana de DeckMakr */}
      <section className={`pt-12 md:pt-16 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          {[
            ["15", "secciones del manual"],
            ["3", "idiomas: castellano, inglés y catalán"],
            ["17", "composiciones de diapositiva"],
            ["48", "conceptos vetados en el tono"],
          ].map(([t, d], k) => (
            <FadeIn key={d} delay={k * STAGGER} className="col-span-6 border-t border-[var(--case-line)] pt-5 md:col-span-3">
              <p className="t-title">{t}</p>
              <p className="mt-2 t-small text-[var(--case-muted)]">{d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <CaseClosing
        className={section}
        title="Actitud liminal para una marca de su tiempo. Un rebranding IA-ready de principio a fin."
      />

      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
