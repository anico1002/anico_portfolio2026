"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import Arrow from "@/components/case-study/Arrow";
import {
  CaseHero,
  CaseHeroOverlay,
  Eyebrow,
  FadeIn,
  Placeholder,
  WindowReveal,
} from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import ShortcutDemo from "./ShortcutDemo";
import FeatureCards from "./FeatureCards";
import TrapBench from "./TrapBench";
import EngineCascade from "./EngineCascade";
import ImpossibleFlags from "./ImpossibleFlags";
import IconStory from "./IconStory";

/* Caso de SwifT, a medida (2026-10-13). Sustituye a la plantilla común: en lugar de las láminas de la web
   actual, piezas recreadas del producto real (components/case-study/swift/). Hechos del repo
   swift-translator (NOTES, código, banco de frases trampa); atajo de la v2.1: ⌥⌘T. Plan en
   docs/plan-contenidos-casos.md. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

/** Cabecera de capítulo: titulillo numerado, titular y, si hay, una línea en diagonal. */
function Head({ n, eyebrow, title, body }: { n: string; eyebrow: string; title: string; body?: string }) {
  return (
    <div className={`${grid} mb-14 gap-y-6 md:mb-20`}>
      <div className="col-span-12 md:col-span-7">
        <FadeIn>
          <p className="t-label t-tag text-[var(--case-muted)]">
            {n} · {eyebrow}
          </p>
        </FadeIn>
        <Lines as="h2" className="mt-4 t-statement" delay={STAGGER}>
          {title}
        </Lines>
      </div>
      {body && (
        <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:mt-20">
          <p className="t-body text-[var(--case-muted)]">{body}</p>
        </FadeIn>
      )}
    </div>
  );
}

export default function SwiftCase({ next: n }: { next: { name: string; href: string; thumb?: string } }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />

      <CaseHero
        videoReady
        poster={<Placeholder ratio="auto" className="h-full" src="/maqueta/swift/thumb.mp4" label="SwifT Translator" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="SwifT Translator"
            delay={t}
            facts={[
              ["Para", "Proyecto propio"],
              ["Rol", "Diseño y desarrollo"],
              ["Qué hice", "Producto · App macOS · Icono · Landing"],
              ["Año", "2026 · v2.1"],
            ]}
          />
        )}
      >
        <Placeholder ratio="auto" className="h-full" src="/maqueta/swift/thumb.mp4" label="SwifT Translator" />
      </CaseHero>

      {/* Intro */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              Traducir cualquier texto sin salir de lo que estás haciendo.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:mt-40">
            <p className="t-body text-[var(--case-muted)]">
              Traducir en el Mac obligaba a cambiar de app, abrir pestañas y copiar y pegar. SwifT vive en la barra de
              menús: seleccionas, pulsas un atajo y la traducción aparece encima, sin cuenta, sin claves y sin
              configurar nada. Diseño, desarrollo, icono y landing.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 01 · El gesto */}
      <section className={section}>
        <Head n="01" eyebrow="El gesto" title="Seleccionar, pulsar ⌥⌘T, listo." body="Funciona en cualquier app, aunque SwifT no esté en primer plano. El panel no le roba el foco a lo que estás haciendo." />
        <FadeIn>
          <ShortcutDemo />
        </FadeIn>
      </section>

      {/* 02 · Cuatro funciones, en horizontal */}
      <div className="mt-28 md:mt-44">
        <FeatureCards />
      </div>

      {/* 03 · Frases trampa */}
      <section className={section}>
        <Head
          n="03"
          eyebrow="Frases trampa"
          title="El motor se eligió con un banco de pruebas, no por impresiones."
          body="21 frases que esconden una trampa: modismos, preguntas que hay que traducir y no contestar, cifras, ironía, alfabetos de derecha a izquierda."
        />
        <TrapBench />
      </section>

      {/* 04 · Tres motores */}
      <section className={section}>
        <Head n="04" eyebrow="Por dentro" title="Tres motores. Cero configuración." body="SwifT elige el mejor para cada texto y, si falla, salta solo al siguiente." />
        <EngineCascade />
      </section>

      {/* 05 · Banderas imposibles */}
      <section className={section}>
        <Head
          n="05"
          eyebrow="Detalles"
          title="Las banderas que Unicode no dibuja."
          body="La senyera, la gallega y la ikurriña no tienen emoji en Apple. SwifT las pinta con la silueta y la onda de las demás, para que el selector de idiomas no tenga huecos."
        />
        <ImpossibleFlags />
      </section>

      {/* 06 · El icono */}
      <section className={section}>
        <Head n="06" eyebrow="El icono" title="De lo literal a un rayo." body="Se descartó lo evidente —el bocadillo, la A y el 文— por una marca abstracta que se lee igual a 16 px en la barra que a 512 en la tienda." />
        <IconStory />
      </section>

      {/* 07 · La landing */}
      <section className={section}>
        <Head n="07" eyebrow="Landing" title="Un producto que cabe en una frase merece una página que también." />
      </section>
      <div className="mt-4">
        <WindowReveal>
          <Placeholder ratio="auto" className="h-full" src="/maqueta/swift/hero.mp4" label="La landing de SwifT" />
        </WindowReveal>
      </div>

      {/* Datos, en pequeño (sin cifras gigantes) */}
      <section className={section}>
        <div className={`${grid} gap-y-10`}>
          {[
            ["14 idiomas", "Del catalán al árabe, con nombres en el idioma del sistema."],
            ["Cero telemetría", "Ni cuenta, ni claves, ni un solo dato enviado. Comprobado sobre el binario."],
            ["2,49 GB", "La IA se instala con un toque y se borra con un clic, devolviendo el espacio."],
          ].map(([t, d], k) => (
            <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 border-t border-[var(--case-line)] pt-5 md:col-span-3 ${k === 0 ? "md:col-start-2" : ""} ${k === 1 ? "md:col-start-6" : ""} ${k === 2 ? "md:col-start-10" : ""}`}>
              <p className="t-title">{t}</p>
              <p className="mt-3 t-small text-[var(--case-muted)]">{d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Resultado */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Resultado</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement" delay={STAGGER}>
              La mejor herramienta de traducción es la que no se ve.
            </Lines>
            <FadeIn delay={2 * STAGGER}>
              <a
                href="https://swift-translator.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fill mt-10 inline-flex items-center gap-3 border border-[var(--case-fg)] px-6 py-4 t-small"
              >
                Descargar SwifT <Arrow />
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name={n.name} href={n.href} thumb={n.thumb} />
      </section>
      <SiteFooter />
    </main>
  );
}
