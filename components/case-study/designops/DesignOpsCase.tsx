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

// Las filas del tablero son los principios del producto (guion de Cowork, docs/case-study-draft.md del prototipo).
const DETAILS: { name: string; alt: string; title: string; body: string }[] = [
  {
    name: "cu-kpi",
    alt: "Close-up of the open, critical, adoption and fixed tiles",
    title: "One number anyone can repeat",
    body: "The share of what your users see that uses the system as intended. Each drift costs its instances times its severity times how visible the screen is, so a wrong color on the payment confirmation weighs more than one in a settings page nobody opens. That is what lets the Copilot say “fix these six and you go from 82 to 88”, and be right.",
  },
  {
    name: "cu-copilot",
    alt: "Close-up of the Copilot's weekly summary",
    title: "Speak design, not lint",
    body: "The Copilot talks like a designer: the title disappears in dark mode, the pay button uses an invented blue. Each week opens with that read in plain words, where it came from and how many points fixing it is worth.",
  },
  {
    name: "cu-drift",
    alt: "Close-up of the light and dark comparison on a drift",
    title: "Nothing changes without a yes",
    body: "Every drift shows what was found next to what the system says, on the real screen, with the Copilot's reasoning step by step. It drafts the fix, and the pull request opens only when someone approves.",
  },
  {
    name: "cu-exception",
    alt: "Close-up of the dialog to accept a drift as an exception, with its reason written",
    title: "An exception needs a reason",
    body: "Keeping a drift on purpose asks why. The reason is saved for the team, the drift stops counting and it never comes back. Next time, the Copilot checks the approved exceptions before raising anything.",
  },
  {
    name: "cu-panel",
    alt: "Close-up of the dark design system panel",
    title: "The system in one column",
    body: "Components and tokens sit in a dark panel, each with its health beside the name. Below them, what the system is missing: the pieces teams keep building on their own.",
  },
  {
    name: "cu-ask",
    alt: "Close-up of the Ask the Copilot field and its suggestions",
    title: "Ask before you change",
    body: "Before touching a token, ask what it reaches. The answer lists every component and screen it affects, and the places that would stay behind.",
  },
];

const AUDIENCE = [
  ["Design system lead", "Owns the system. Needs to know what to fix first, and to stop arguing the same exceptions again."],
  ["Head of Design", "Needs one number and a clear story for leadership."],
  ["Engineers", "Keep their own tools. The Copilot reaches them through the pull request it opens."],
];

const NEXT = [
  ["Before publishing", "Marketing builds landing pages with AI too. A check before anything goes live would catch drift where it starts."],
  ["Context for coding agents", "Most drift comes from agents that can't see the system. Giving them Brand DS prevents it at the source."],
  ["A guardian in every pull request", "Connected to the same memory of decisions, so an exception approved once is respected everywhere."],
];

const OBJECTIONS = [
  ["Figma Check designs?", "It only sees Figma, and it flags intentional exceptions as errors. Here it is one of the sources."],
  ["Buoy?", "A strong engineering tool for one repository. The Copilot sits above it, across Figma, code and teams, for the person who decides."],
  ["Something a team could build with AI?", "The same way a team could build its own analytics. Someone still has to look after the integrations, the history and the decisions."],
];

/** Tres columnas de texto: título y párrafo. */
function Trio({ items, className = "" }: { items: string[][]; className?: string }) {
  return (
    <div className={`${grid} gap-y-10 ${className}`}>
      {items.map(([t, b], k) => (
        <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 md:col-span-3 ${["md:col-start-1", "md:col-start-5", "md:col-start-9"][k]}`}>
          <p className="t-title">{t}</p>
          <p className="mt-3 t-body text-[var(--case-muted)]">{b}</p>
        </FadeIn>
      ))}
    </div>
  );
}

/** Titular fijo a la izquierda (sticky) y, a la derecha, filas con filete: título y texto, numeradas si se pide. */
function Pinned({ eyebrow, title, items, numbered = false }: { eyebrow: string; title: string; items: string[][]; numbered?: boolean }) {
  return (
    <section className={section}>
      <div className={grid}>
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-32">
            <FadeIn>
              <Eyebrow>{eyebrow}</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement text-balance" delay={STAGGER}>
              {title}
            </Lines>
          </div>
        </div>
        <div className="col-span-12 mt-12 md:col-span-6 md:col-start-7 md:mt-0">
          {items.map(([t, b], k) => (
            <FadeIn key={t} className="border-t border-[var(--case-line,#e5e5e5)] py-10 md:py-14">
              <div className="grid grid-cols-6 gap-x-4 md:gap-x-6">
                {numbered && <span className="col-span-1 t-small tabular-nums text-[var(--case-muted)] pt-2">{String(k + 1).padStart(2, "0")}</span>}
                <div className={numbered ? "col-span-5" : "col-span-6"}>
                  <p className="t-title">{t}</p>
                  <p className="mt-3 max-w-[34em] t-body text-[var(--case-muted)]">{b}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

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
                The command center for your design system.
              </Lines>
            </div>
            {/* El hueco de la izquierda lo ocupa el close-up que mejor resume el producto (feedback 2026-11-01). El texto
                cuenta el problema y la primera idea, con el benchmark solo nombrado (guion de Cowork). */}
            <FadeIn className="-mx-4 col-span-12 md:col-span-6 md:ml-[-1.5rem] md:mr-0 md:row-start-2 md:mt-6">
              <CloseUp name="cu-score" zoom={1.1} ratio="4 / 3" sizes="(min-width: 768px) 58vw, 100vw" alt="Close-up of the health score ring at 82" />
            </FadeIn>
            <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6 md:self-end">
              <div className="flex flex-col gap-5 t-body text-[var(--case-muted)]">
                <p>
                  AI made interface cheap. Engineers and marketers ship screens in minutes, and each one brings its own
                  almost-right button, its own grey and its own spacing. The design system wears away one pull request at
                  a time, and the person who owns it ends up collecting warnings by hand, with no way to show leadership
                  how healthy it really is.
                </p>
                <p>
                  I started with a drift detector: scan Figma and code, flag what doesn&apos;t match, fix it in the pull
                  request. Then I mapped the market. Figma Check designs, Buoy, Design Bug Bot and Omlet already did that
                  part well.
                </p>
                <p>
                  Side by side, they shared a gap. They speak to engineers or only see Figma, and none of them remembers
                  a decision. Days after Check designs launched, designers were already asking how to stop it flagging
                  their intentional exceptions.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* El giro: de detectar a decidir, y para quién */}
        <section className={section}>
          <Head
            eyebrow="The shift"
            title="The detectors are the smoke alarms. This is the fire chief’s dashboard."
            body="So the question changed from how to detect drift better to who decides what to do with it, and what they need. The Copilot reads every detector and turns their alerts into three decisions a person can make."
          />
          <FadeIn>
            <FlowDiagram />
          </FadeIn>
          <FadeIn className="mt-24 md:mt-32">
            <p className="t-label t-tag text-[var(--case-muted)]">Who it&apos;s for</p>
          </FadeIn>
          <Trio items={AUDIENCE} className="mt-8" />
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
            eyebrow="Principles"
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

        {/* Lo siguiente y las objeciones (feedback 2026-11-01: que no sean muros de texto). Parada de scroll: el titular
            se queda fijo a la izquierda mientras las filas, en tabla con filetes, pasan a la derecha. */}
        <Pinned eyebrow="What's next" title="Where it goes from here." items={NEXT} numbered />
        <Pinned eyebrow="Fair questions" title="Isn’t this just…" items={OBJECTIONS} />

        <CaseClosing className={section} title="Every drift ends in a decision, and every decision is remembered." />
      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
