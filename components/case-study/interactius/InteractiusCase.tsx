"use client";

import SectionHead from "@/components/case-study/SectionHead";
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
import Img from "@/components/case-study/Img";

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
const Head = SectionHead;


export default function InteractiusCase({ next: n }: { next: MoreCases }) {
  return (
    <main className={`relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased ${ixFonts}`}>
      <SiteNav active="product" />
      <CaseLayer>

      <CaseHero
        videoReady
        poster={<BandMedia desktop="/maqueta/interactius/hero-band.mp4" mobile="/maqueta/interactius/hero-portrait.mp4" label="Interactius" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="Interactius"
            delay={t}
            facts={[
              ["Para", "Interactius"],
              ["Rol", "Brand Designer"],
              ["Qué hice", "Rebranding · Web · Brand guidelines · AI tools"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        <BandMedia desktop="/maqueta/interactius/hero-band.mp4" mobile="/maqueta/interactius/hero-portrait.mp4" label="Interactius" />
      </CaseHero>

      {/* Intro */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-7">
            <FadeIn>
              <Eyebrow>Introduction</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              A new brand, a new website and guidelines built for AI too.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Interactius, a strategic partner in experience design and cultural transformation, renewed its brand in
              2026: the rebrand, the website and guidelines written for two readers, its team and the AI models it
              already works with. Every decision has a version for people and a version for machines.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* El logotipo, en técnico (PROPUESTA: Alberto quiere repasarlo juntos). Lámina de construcción del
          repo (public/concepto/interactius-logo-tecnic.svg): retícula, medidas y los cortes marcados. */}
      <section className={section}>
        <Head
          eyebrow="The logo"
          title="A macron that fixes how it’s said."
          body="A logotype built on IBM Plex Mono with a single intervention: the macron over the last i. The whole system grows from it."
        />
        <FadeIn>
          <div className="m-bleed overflow-hidden px-4 py-14 md:px-16 md:py-28" style={{ background: IX.light }}>
            { }
            <Img src="/maqueta/interactius/brand/interactius-logo-tecnic.svg" alt="Construction of the interactīus logotype" className="mx-auto w-full max-w-[64rem]" />
          </div>
        </FadeIn>
        <div className="mt-2">
          <LogoStory />
        </div>
      </section>

      {/* Tipografía: las dos de la marca y por qué */}
      <section className={section}>
        <Head
          eyebrow="Typography"
          title="One typeface that measures, one that speaks."
          body="IBM Plex Mono builds the logotype and IBM Plex Serif gives the headlines their voice. Both are open, so any tool or AI can use them."
        />
        <TypePair />
      </section>

      {/* La web corporativa (gran parte del trabajo, junto al rebranding): MacBook real y la versión móvil */}
      <section className={section}>
        <Head
          eyebrow="The website"
          title="The new brand, in its first home."
          body="The website puts the brand to work: the vertical logo in the margin, both typefaces, liminal photography, and services and cases told in the new voice."
        />
        <WebLaptop />
        <WebPhone />
      </section>

      {/* El manual: ventana de navegador, sin enlace */}
      <section className={section}>
        <Head
          eyebrow="The guidelines"
          title="AI-ready brand guidelines."
          body="A brand designed from day one to work with AI. The guidelines don’t just store the brand: they teach it, to the people who use it and to the tools already on the team."
        />
        <ManualWindow />
      </section>

      {/* Preparada para IA: el capítulo central */}
      <section className={section}>
        <Head
          eyebrow="Built for AI"
          title="Art direction, turned into instructions."
          body="The visual world lives in a technical prompt you copy in one click, so every generated image fits the brand on the first try."
        />
        <ImagePrompt />
      </section>

      <section className={section}>
        <Head eyebrow="Tone of voice" title="The brand’s voice, in a prompt." body="A voice of its own, recognizable in every sentence and turned into a tool: AI writes with it and people recognize it, without losing the brand’s corporate tone." />
        <ToneCheck />
      </section>

      <section className={section}>
        <Head eyebrow="For machines" title="The whole guidelines, in a format AI can read." />
        <AiLayer />
      </section>

      <section className={section}>
        <Head eyebrow="One source" title="Change it once, it changes everywhere." body="Colors, type and rules live in a single file. The website, the prompts, the brand API and every slide all come from it." />
        <TokenSync />
      </section>

      {/* DeckMakr, a todo el ancho (PROVISIONAL: recreado; falta grabar la herramienta de verdad) */}
      <section className={section}>
        <Head
          eyebrow="DeckMak_r"
          title="A sales proposal, ready in minutes."
          body="Building sales decks was eating up the team’s valuable time. I designed a tool that automates it with AI: the team writes the idea and gets a proposal in the brand’s corporate voice and tone."
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
            ["15", "guideline sections"],
            ["3", "languages: Spanish, English and Catalan"],
            ["17", "slide layouts"],
            ["48", "banned concepts in the tone"],
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
        title="A liminal attitude for a brand of its time. An AI-ready rebrand from start to finish."
      />

      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
