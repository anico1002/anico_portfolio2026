"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import CaseClosing from "@/components/case-study/CaseClosing";
import WebScroll from "@/components/case-study/WebScroll";
import {
  CaseHero,
  CaseHeroOverlay,
  Eyebrow,
  FadeIn,
  Placeholder,
} from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import ShortcutDemo from "./ShortcutDemo";
import FeatureCards from "./FeatureCards";
import TrapBench from "./TrapBench";
import EngineCascade from "./EngineCascade";
import IconStory from "./IconStory";

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
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Traducir en el Mac obligaba a cambiar de app, abrir pestañas y copiar y pegar. SwifT vive en la barra de
              menús: seleccionas, pulsas un atajo y la traducción aparece encima, sin cuenta, sin claves y sin
              configurar nada. Diseño, desarrollo, icono y landing.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* El gesto */}
      <section className={section}>
        <Head eyebrow="El gesto" title="Seleccionar, pulsar ⌥⌘T, listo." body="Funciona en cualquier app, aunque SwifT no esté en primer plano. El panel no le roba el foco a lo que estás haciendo." />
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
          eyebrow="Frases trampa"
          title="El motor se eligió con un banco de pruebas, no por impresiones."
          body="21 frases que esconden una trampa: modismos, preguntas que hay que traducir y no contestar, cifras, ironía, alfabetos de derecha a izquierda."
        />
        <TrapBench />
      </section>

      {/* Tres motores */}
      <section className={section}>
        <Head eyebrow="Por dentro" title="Tres motores. Cero configuración." body="SwifT elige el mejor para cada texto y, si falla, salta solo al siguiente." />
        <EngineCascade />
      </section>

      {/* El icono */}
      <section className={section}>
        <Head eyebrow="El icono" title="Dos idiomas que se cruzan en un rayo." body="Una esquirla cálida y otra fría, espejadas, por los dos idiomas y la rapidez del atajo. Con acabado de cristal, se lee igual a 16 px en la barra que a 512 en el Dock." />
        <IconStory />
      </section>

      {/* La landing */}
      <section className={section}>
        <Head eyebrow="Landing" title="Un producto que cabe en una frase merece una página que también." />
      </section>
      {/* La landing en inglés, entera: la máscara se abre a pantalla completa y se queda fija mientras la
          página hace scroll (captura a toda página de swift-translator.vercel.app, 2026-10-16). */}
      <div className="mt-4">
        <WebScroll page="/maqueta/swift/landing/page.webp" nav="/maqueta/swift/landing/nav.webp" ratio={7050 / 2160} navRatio={90 / 2160} label="La landing de SwifT" />
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

      <CaseClosing
        className={section}
        title="La mejor herramienta de traducción es la que no se ve."
        cta={{ label: "Descargar SwifT", href: "https://swift-translator.vercel.app" }}
      />

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name={n.name} href={n.href} thumb={n.thumb} />
      </section>
      <SiteFooter />
    </main>
  );
}
