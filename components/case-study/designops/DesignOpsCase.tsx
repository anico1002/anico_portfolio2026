"use client";

import SectionHead from "@/components/case-study/SectionHead";
import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import CaseClosing from "@/components/case-study/CaseClosing";
import LazyVideo from "@/components/case-study/LazyVideo";
import { BandMedia, CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, MaskReveal } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { CloseUp, FlowDiagram, LiveIpad, M, MarkSizes, OnTheGoStage, SphereStage } from "./DesignOpsPieces";

/* Caso de DesignOps Copilot, a medida (2026-11-01). Proyecto propio: el centro de mando del responsable del design
   system, con un copiloto de IA que convierte los desvíos en decisiones. Medios: scripts/case-media/designops-app.sh
   (el prototipo navegable), web-rec.mjs + designops/*.json (grabaciones), designops/screens.mjs y closeups.sh
   (close-ups) y scripts/mockups/css_scene.mjs (el iPad de la cabecera). Todo en public/maqueta/designops, fuera de git. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;
const Head = SectionHead;

const DETAILS: { name: string; ratio: string; alt: string; title: string; body: string }[] = [
  {
    name: "cu-kpi",
    ratio: "16 / 9",
    alt: "Close-up of the open, critical, adoption and fixed tiles",
    title: "One number",
    body: "The share of what your users see that uses the system as intended. A wrong color on the payment screen weighs more than one in settings. Around it, four tiles: what's open, what's critical, how much of the product uses official components and what got fixed this week.",
  },
  {
    name: "cu-copilot",
    ratio: "4 / 5",
    alt: "Close-up of the Copilot's weekly summary",
    title: "The Copilot speaks first",
    body: "Each week opens with a summary in plain words: what came in, where it came from and how many points fixing it is worth. One button takes you straight to the fixes.",
  },
  {
    name: "cu-drift",
    ratio: "16 / 9",
    alt: "Close-up of the light and dark comparison on a drift",
    title: "Approval first",
    body: "Every drift shows what was found next to what the system says, on the real screen and in both themes. The Copilot drafts the fix, and the pull request opens when someone says yes. Keeping a drift on purpose asks why, and from then on it stays out of the list.",
  },
  {
    name: "cu-panel",
    ratio: "4 / 5",
    alt: "Close-up of the dark design system panel",
    title: "The system in one column",
    body: "Components and tokens sit in a dark panel, each with its health beside the name. Below them, what the system is missing: the pieces teams keep building on their own.",
  },
  {
    name: "cu-ask",
    ratio: "16 / 9",
    alt: "Close-up of the Ask the Copilot field and its suggestions",
    title: "Ask before you change",
    body: "Before touching a token, ask what it reaches. The answer lists every component and screen it affects, and the places that would stay behind.",
  },
];

export default function DesignOpsCase({ next: n }: { next: MoreCases }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />
      <CaseLayer>
        <CaseHero
          videoReady
          poster={<BandMedia desktop={`${M}/hero-band.mp4`} mobile={`${M}/hero-portrait.mp4`} label="DesignOps Copilot" />}
          overlay={(t) => (
            <CaseHeroOverlay
              name="DesignOps Copilot"
              delay={t}
              facts={[
                ["Para", "Personal project"],
                ["Rol", "Lead Product Designer"],
                ["Qué hice", "Product · Web app · AI copilot · Identity"],
                ["Año", "2026"],
              ]}
            />
          )}
        >
          <BandMedia desktop={`${M}/hero-band.mp4`} mobile={`${M}/hero-portrait.mp4`} label="DesignOps Copilot" />
        </CaseHero>

        {/* Intro */}
        <section className={`pt-24 md:pt-36 ${wrap}`}>
          <div className={`${grid} gap-y-10`}>
            <div className="col-span-12 md:col-span-7">
              <FadeIn>
                <Eyebrow>Introduction</Eyebrow>
              </FadeIn>
              <Lines className="t-intro" delay={STAGGER}>
                A copilot for whoever looks after the design system.
              </Lines>
            </div>
            {/* El hueco de la izquierda lo ocupa el close-up que mejor resume el producto (feedback 2026-11-01): así los
                textos de la intro y del giro no caen en la misma pantalla. */}
            <FadeIn className="-mx-4 col-span-12 md:col-span-6 md:ml-[-1.5rem] md:mr-0 md:row-start-2 md:mt-6">
              <CloseUp name="cu-score" ratio="4 / 3" sizes="(min-width: 768px) 58vw, 100vw" alt="Close-up of the health score ring at 82" />
            </FadeIn>
            <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6 md:self-end">
              <div className="flex flex-col gap-5 t-body text-[var(--case-muted)]">
                <p>
                  With AI, anyone can ship a screen in minutes, and each one arrives with its own almost-right button, its
                  own grey and its own spacing. The system wears away one pull request at a time.
                </p>
                <p>
                  The person who looks after it usually finds out late, in a review or a bug report, and spends the week
                  chasing fixes with teams that have already moved on.
                </p>
                <p>
                  DesignOps Copilot watches Figma and code, tells the design system lead what is drifting and what it
                  costs, and fixes it once they approve. Each morning starts with one number: how much of what users see
                  still uses the system as intended.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* El giro: de detectar a decidir */}
        <section className={section}>
          <Head
            eyebrow="The shift"
            title="The detectors already exist. The decisions still land on one desk."
            body="Checkers flag drift for engineers, one source at a time, and forget every exception. The Copilot reads them all and turns their alerts into a short list someone can act on."
          />
          <FadeIn>
            <FlowDiagram />
          </FadeIn>
        </section>

        {/* La marca */}
        <section className={section}>
          <Head
            eyebrow="Identity"
            title="A sphere of signals that settles into a D."
            body="Each dot is something the Copilot reads in Figma or in code. While it thinks, they pulse. At rest, the right side slides into a crescent: the D of DesignOps. Its warm light marks the AI, and nothing else in the product uses it."
          />
          <FadeIn>
            <SphereStage />
          </FadeIn>
          <FadeIn className="mt-[6px]">
            <MarkSizes />
          </FadeIn>
        </section>

        {/* Onboarding */}
        <section className={section}>
          <Head
            eyebrow="Onboarding"
            title="Two minutes, one question at a time."
            body="The Copilot sets itself up in conversation: the Figma library, the repositories, what matters most. Then the sphere opens into the first score and bursts into the dashboard."
          />
          <FadeIn>
            <div className="relative -mx-4 aspect-[16/10] overflow-hidden bg-[#ECEAF5] md:-mx-6">
              <LazyVideo
                src={`${M}/onboarding.mp4`}
                className="absolute inset-0 h-full w-full object-cover"
                aria-label="The Copilot-led onboarding, from the first hello to the dashboard"
              />
            </div>
          </FadeIn>
        </section>

        {/* El dashboard, navegable: casi a todo el ancho, sobre un degradado muy leve que sube hacia blanco */}
        <section
          className={`${section} pb-20 md:pb-32`}
          style={{ background: "linear-gradient(to bottom, var(--case-bg) 0%, var(--case-bg) 35%, #ECEBF1 100%)" }}
        >
          <Head
            eyebrow="The dashboard"
            title="Go ahead, click around."
            body={
              <>
                <span className="hidden md:inline">
                  This is the working prototype. Approve the six fixes and watch the score climb from 82 to 88, drag the
                  slider on a drift, or ask the Copilot what breaks if you change a color.
                </span>
                <span className="md:hidden">
                  On a phone it plays as a tour. Open this page on a computer to use the prototype yourself.
                </span>
              </>
            }
          />
          <FadeIn className="md:px-[1.5vw]">
            <LiveIpad />
          </FadeIn>
        </section>

        {/* Close-ups */}
        <section className={section}>
          <Head
            eyebrow="Details"
            title="One ink, one light, and quiet everywhere else."
            body="Neutrals and a single deep violet carry the interface. Status gets a small dot instead of a fill. The gradient belongs to the Copilot, so you always know where the AI is."
          />
          {/* En damero (feedback 2026-11-01): las imágenes, a sangre y del mismo alto, se tocan por las esquinas en el
              centro de la página; los textos van en los huecos blancos, en la columna del texto de la cabecera (8–11) o
              en su espejo (2–5). Sin parallax vertical, para que las esquinas casen siempre. */}
          <div className="-mx-4 md:-mx-6">
            {DETAILS.map((d, k) => {
              const right = k % 2 === 1;
              return (
                <div key={d.name} className="grid grid-cols-1 md:grid-cols-2">
                  <MaskReveal from={right ? "right" : "left"} speed={0} className={right ? "md:col-start-2 md:row-start-1" : "md:col-start-1 md:row-start-1"}>
                    <CloseUp name={d.name} ratio="4 / 3" sizes="(min-width: 768px) 50vw, 100vw" alt={d.alt} />
                  </MaskReveal>
                  <div className={`flex items-center px-4 py-14 md:row-start-1 md:px-6 md:py-0 ${right ? "md:col-start-1" : "md:col-start-2"}`}>
                    <div className={`${grid} w-full md:grid-cols-6`}>
                      <div className={`col-span-12 md:col-span-4 ${right ? "md:col-start-2" : "md:col-start-2"}`}>
                        <FadeIn>
                          <p className="t-title">{d.title}</p>
                        </FadeIn>
                        <FadeIn delay={STAGGER} className="mt-4">
                          <p className="t-body text-[var(--case-muted)]">{d.body}</p>
                        </FadeIn>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* La app compañera: el texto a la izquierda y, a sangre por la derecha, el móvil sobre la luz del Copilot */}
        <section className={section}>
          <div className={`${grid} items-center gap-y-12`}>
            <div className="col-span-12 md:col-span-4 md:col-start-2">
              <FadeIn>
                <p className="t-label t-tag text-[var(--case-muted)]">On the go</p>
              </FadeIn>
              <Lines as="h2" className="mt-4 t-statement text-balance" delay={STAGGER}>
                Approve from the lock screen.
              </Lines>
              <FadeIn delay={2 * STAGGER} className="mt-8">
                <p className="t-body text-[var(--case-muted)]">
                  The companion app keeps mornings short: one notification, six fixes, one tap. The score updates when the
                  pull request merges.
                </p>
              </FadeIn>
            </div>
            <div className="col-span-12 -mx-4 md:col-span-5 md:col-start-8 md:mx-0 md:-mr-6">
              <OnTheGoStage />
            </div>
          </div>
        </section>

        <CaseClosing className={section} title="A design system that tells you what it needs." />
      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
