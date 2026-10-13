"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import Arrow from "@/components/case-study/Arrow";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, Parallax, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { GanttTyped, MarkdownToSlide } from "./DeckDemos";
import { FitTextDemo, TokenSync, ToneCheck } from "./BrandDemos";
import { IX, ixFonts, mono } from "./tokens";

/* Caso de Interactius, a medida (2026-10-13): el manual de marca vivo y su generador de presentaciones,
   contados con piezas recreadas con su retícula y sus tokens reales (components/case-study/interactius/).
   Hechos del repo interactius-brandguidelines. Pendiente de Alberto: cómo repartir el crédito con el resto
   del equipo (ver docs/plan-contenidos-casos.md). Las fotos del universo de marca no se versionan. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;

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

const SHAPES = [
  { src: "/maqueta/interactius/brand/shape-polygon.svg", name: "Pensamiento estratégico", color: IX.opal },
  { src: "/maqueta/interactius/brand/shape-ellipse.svg", name: "Diseño de experiencias", color: IX.bordeaux },
  { src: "/maqueta/interactius/brand/shape-wave.svg", name: "Transformación cultural", color: IX.emerald },
];

export default function InteractiusCase({ next: n }: { next: { name: string; href: string; thumb?: string } }) {
  return (
    <main className={`relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased ${ixFonts}`}>
      <SiteNav active="product" />

      <CaseHero
        videoReady={false}
        poster={<Placeholder ratio="auto" className="h-full" src="/maqueta/interactius/cover.jpg" label="Interactius" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="Interactius"
            delay={t}
            facts={[
              ["Para", "Interactius"],
              ["Rol", "Diseño de producto y de sistema"],
              ["Qué hice", "Manual de marca · Generador de presentaciones · API de marca"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        {null}
      </CaseHero>

      {/* Intro */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              Un manual de marca que no se lee: se usa.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:row-start-2 md:mt-6">
            <p className="t-body text-[var(--case-muted)]">
              Interactius, una consultora de estrategia, experiencias y transformación cultural, renovó su marca en
              2026. El manual se convirtió en una herramienta: una sola fuente de datos alimenta la web en tres
              idiomas, una API de marca, un validador de tono y un generador de presentaciones.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* La marca: tres servicios, tres formas */}
      <section className={section}>
        <div className={`${grid} items-end gap-y-12`}>
          <div className="col-span-12 md:col-span-5">
            <FadeIn>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/maqueta/interactius/brand/interactius-positivo.svg" alt="interactīus" className="dark-invert h-auto w-full max-w-[26rem]" />
            </FadeIn>
            <FadeIn delay={STAGGER}>
              <p className="mt-8 t-body text-[var(--case-muted)]">
                El macrón sobre la ī corrige la pronunciación y se convierte en recurso gráfico. Lema de la nueva
                marca: «Actitud liminal».
              </p>
            </FadeIn>
          </div>
          <div className="col-span-12 grid grid-cols-3 gap-3 md:col-span-6 md:col-start-7 md:gap-6">
            {SHAPES.map((s, k) => (
              <Parallax key={s.name} speed={40 + k * 60}>
                <FadeIn delay={k * STAGGER}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt="" className="w-full" />
                  <p className="mt-4 t-label t-tag" style={{ color: s.color === IX.opal ? undefined : s.color }}>
                    {s.name}
                  </p>
                </FadeIn>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* Universo fotográfico: un respiro entre tanta interfaz */}
      <div className="m-bleed mt-28 grid grid-cols-2 gap-1 md:mt-40 md:grid-cols-4">
        {[1, 2, 3, 4].map((k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={k} src={`/maqueta/interactius/media/universo-0${k}.jpg`} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
        ))}
      </div>

      <section className={section}>
        <Head n="01" eyebrow="Una sola fuente" title="Se cambia en un sitio y cambia en todos." body="Los colores, la tipografía y las reglas viven en un único archivo. De ahí salen el manual, la API de marca, los kits y cada diapositiva." />
        <TokenSync />
      </section>

      <section className={section}>
        <Head
          n="02"
          eyebrow="Presentaciones"
          title="Se escribe en Markdown. La diapositiva se monta sola."
          body="Sin editor libre: arrastrar cajas rompe la retícula y la marca. Se escribe el contenido y el generador elige entre 17 composiciones basadas en el máster oficial de 51 diapositivas."
        />
        <MarkdownToSlide />
      </section>

      <section className={section}>
        <Head n="03" eyebrow="Roadmaps" title="Un calendario que se teclea." body="Semanas, rangos, medias semanas e hitos. Las barras alternan los colores de los tres servicios." />
        <GanttTyped />
      </section>

      <section className={section}>
        <Head
          n="04"
          eyebrow="Diseño líquido"
          title="Ningún texto se sale de la retícula."
          body="Si un párrafo no cabe, el cuerpo baja lo justo para que siga dentro de su banda. El lienzo es fijo, así que el resultado es siempre el mismo."
        />
        <FitTextDemo />
      </section>

      <section className={section}>
        <Head n="05" eyebrow="El tono" title="La marca también suena de una manera." body="Frases de 15 a 22 palabras y una lista de palabras prohibidas que el validador marca antes de que nada salga de la oficina." />
        <ToneCheck />
      </section>

      {/* Datos, en pequeño */}
      <section className={section}>
        <div className={`${grid} gap-y-10`} style={mono}>
          {[
            ["15", "secciones del manual"],
            ["3", "idiomas: castellano, inglés y catalán"],
            ["17", "composiciones de diapositiva"],
            ["235", "tests que vigilan el sistema"],
          ].map(([t, d], k) => (
            <FadeIn key={d} delay={k * STAGGER} className={`col-span-6 border-t border-[var(--case-line)] pt-5 md:col-span-2 ${k === 0 ? "md:col-start-2" : ""}`}>
              <p className="t-title">{t}</p>
              <p className="mt-2 t-small text-[var(--case-muted)]">{d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Resultado</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement" delay={STAGGER}>
              La marca deja de ser un PDF que nadie abre y pasa a ser la herramienta con la que se trabaja.
            </Lines>
            <FadeIn delay={2 * STAGGER}>
              <a href="https://brand.interactius.com" target="_blank" rel="noopener noreferrer" className="btn-fill mt-10 inline-flex items-center gap-3 border border-[var(--case-fg)] px-6 py-4 t-small">
                Ver el manual <Arrow />
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
