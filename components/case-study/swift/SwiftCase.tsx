"use client";

import SectionHead from "@/components/case-study/SectionHead";
import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import CaseClosing from "@/components/case-study/CaseClosing";
import {
  BandMedia,
  CaseHero,
  CaseHeroOverlay,
  Eyebrow,
  FadeIn,
} from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import ShortcutDemo from "./ShortcutDemo";
import FeatureCards from "./FeatureCards";
import TrapBench from "./TrapBench";
import EngineCascade from "./EngineCascade";
import IconStory from "./IconStory";
import Keys from "@/components/case-study/Keys";
import LandingMac from "./LandingMac";
import DuoPhone from "./DuoPhone";

/* Caso de SwifT, a medida (2026-10-13). Sustituye a la plantilla común: en lugar de las láminas de la web
   actual, piezas recreadas del producto real (components/case-study/swift/). Hechos del repo
   swift-translator (NOTES, código, banco de frases trampa); atajo de la v2.1: ⌥⌘T. Plan en
   docs/plan-contenidos-casos.md. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

/** Cabecera de capítulo: titulillo numerado, titular y, si hay, una línea en diagonal. */
/* Cabecera de capítulo con el feedback general de Gloop (2026-10-14): titulillo sin número, titular
   equilibrado y el párrafo cerca de él, alineado con su última línea (no colgado arriba ni pegado al borde). */
const Head = SectionHead;

export default function SwiftCase({ next: n }: { next: MoreCases }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />
      <CaseLayer>

      <CaseHero
        videoReady
        poster={<BandMedia desktop="/maqueta/swift/duo-band.mp4" mobile="/maqueta/swift/duo-portrait.mp4" label="SwifT Translator" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="SwifT Translator"
            delay={t}
            facts={[
              ["Para", "Personal project"],
              ["Rol", "Lead Product Designer"],
              ["Qué hice", "Product · macOS app · Logo · Landing page"],
              ["Año", "2026 · v2.1"],
            ]}
          />
        )}
      >
        <BandMedia desktop="/maqueta/swift/duo-band.mp4" mobile="/maqueta/swift/duo-portrait.mp4" label="SwifT Translator" />
      </CaseHero>

      {/* Intro */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-7">
            <FadeIn>
              <Eyebrow>Introduction</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              Translate any text without switching apps.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Translating on a Mac meant switching apps, opening tabs and copying and pasting. SwifT lives in the menu
              bar: select, hit a shortcut and the translation appears right there, with no account, no keys and
              nothing to set up.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* El gesto */}
      <section className={section}>
        <Head eyebrow="The gesture" title={<>Select, press <Keys keys={["⌥", "⌘", "T"]} />, done.</>} body="It works in any app, even when SwifT isn’t in front. The panel never steals focus from what you’re doing." />
        <FadeIn>
          <ShortcutDemo />
        </FadeIn>
      </section>

      {/* Cuatro funciones, en horizontal */}
      <div className="mt-28 md:mt-44">
        <FeatureCards />
      </div>

      {/* Frases trampa */}
      <section className={section}>
        <Head
          eyebrow="Edge cases"
          title="The engine was chosen by testing, not by gut feeling."
          body="21 sentences that trip up any translator: idioms, questions to translate rather than answer, numbers, irony, right-to-left scripts."
        />
        <TrapBench />
      </section>

      {/* Tres motores */}
      <section className={section}>
        <Head eyebrow="Under the hood" title="Three engines. Zero setup." body="SwifT picks the best one for each text and, if it fails, moves to the next on its own." />
        <EngineCascade />
      </section>

      {/* El icono */}
      <section className={section}>
        <Head eyebrow="The icon" title="Two languages crossing in a bolt." body="A warm shard and a cool one, mirrored, for the two languages and the speed of the shortcut. With a glass finish, it reads just as well at 16 px in the menu bar as at 512 in the Dock." />
        <IconStory />
      </section>

      {/* La landing */}
      <section className={section}>
        <Head eyebrow="Landing page" title="A product that fits in one sentence deserves a page that does too." />
      </section>
      {/* La landing en inglés dentro de un MacBook, con la misma apertura de máscara; la web baja y sube en bucle. */}
      <div className="mt-4">
        <LandingMac />
      </div>
      <div className="mt-16 md:mt-24">
        <DuoPhone />
      </div>

      {/* Datos, en pequeño (sin cifras gigantes), pegados al MacBook */}
      <section className={`pt-12 md:pt-16 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          {[
            ["14 languages", "From Catalan to Arabic, with names in the system language."],
            ["Zero telemetry", "No account, no keys, not a single byte sent. Verified on the binary."],
            ["2.49 GB", "The AI installs with one tap and deletes with one click, giving the space back."],
          ].map(([t, d], k) => (
            <FadeIn key={t} delay={k * STAGGER} className="col-span-12 border-t border-[var(--case-line)] pt-5 md:col-span-4">
              <p className="t-title">{t}</p>
              <p className="mt-3 t-small text-[var(--case-muted)]">{d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <CaseClosing
        className={section}
        title="The best translation tool is the one you never notice."
        cta={{ label: "Download SwifT", href: "https://swift-translator.vercel.app" }}
      />

      </CaseLayer>

      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
