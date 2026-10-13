"use client";

import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import { CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, Placeholder } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { BalanceTimeTravel, D, DovelaPattern, ExtractToShowcase, HonestChart, LargeText } from "./DovlaPieces";

/* Caso de Dovla, a medida (2026-10-13). Hechos del repo dovla-app (CLAUDE.md, NOTES, BRAND-NOTES, specs y
   código). Pendiente de Alberto: si hay NDA y si se puede nombrar; la identidad viene de una agencia (color
   y tipografía) y el UI/UX es suyo. Sin nombres de terceros. */

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

const SWATCHES = [
  { name: "Fondo", hex: D.bg, ink: D.sand, note: "Baja del berenjena: a pantalla completa cansaba" },
  { name: "Berenjena", hex: D.plum, ink: D.sand, note: "Pasa a ser el color de los objetos" },
  { name: "Arena", hex: D.sand, ink: D.bg, note: "Sobre berenjena, 9,06 : 1 (AAA)" },
  { name: "Ingreso", hex: D.positive, ink: D.bg, note: "Verde apagado hacia la paleta" },
  { name: "Gasto", hex: D.negative, ink: D.bg, note: "Sin tener que leer el signo" },
];

export default function DovlaCase({ next: n }: { next: { name: string; href: string; thumb?: string } }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />

      <CaseHero
        poster={<Placeholder ratio="auto" className="h-full" src="/maqueta/dovla/cover.jpg" label="Dovla" />}
        overlay={(t) => (
          <CaseHeroOverlay
            name="Dovla"
            delay={t}
            facts={[
              ["Para", "Un neobanco · en desarrollo"],
              ["Rol", "UI/UX"],
              ["Qué hice", "App iOS nativa · Design system · Accesibilidad"],
              ["Año", "2026"],
            ]}
          />
        )}
      >
        {null}
      </CaseHero>

      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <Eyebrow>Introducción</Eyebrow>
            </FadeIn>
            <Lines className="t-intro" delay={STAGGER}>
              El banco que no grita.
            </Lines>
          </div>
          <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:mt-16">
            <p className="t-body text-[var(--case-muted)]">
              UI/UX de la app nativa para iOS de un neobanco, lista para que el equipo de desarrollo le conecte el
              backend. El listón: la usabilidad de los mejores bancos digitales. La regla: ante dos soluciones
              defendibles, gana la más fácil de usar.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* La marca: el patrón */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className="m-bleed">
          <DovelaPattern />
        </div>
        <FadeIn className={`${grid} mt-6`}>
          <p className="col-span-12 t-small text-[var(--case-muted)] md:col-span-4 md:col-start-9">
            La dovela es la pieza que sostiene el arco. El patrón de cuartos de círculo dibuja el nombre de la marca.
          </p>
        </FadeIn>
      </section>

      <div className="mt-28 md:mt-40">
        <BalanceTimeTravel />
      </div>

      <section className={section}>
        <Head n="02" eyebrow="La Home" title="Un extracto no es un sitio al que llegar." body="La Home dejaba de listar un año de gastos. Ahora enseña lo de hoy y, en el sitio liberado, lo que puedes hacer: tarjetas, préstamos, patrimonio y lo gastado este mes." />
        <FadeIn className="m-bleed">
          <ExtractToShowcase />
        </FadeIn>
        <p className="mt-4 t-small text-[var(--case-muted)]">Arrastra para comparar.</p>
      </section>

      <section className={section}>
        <Head n="03" eyebrow="Gasto" title="Un dato, no un piropo." />
        <HonestChart />
      </section>

      <section className={section}>
        <Head n="04" eyebrow="Color" title="De la identidad de marca a una interfaz que se lee." body="El color y la tipografía venían de la identidad; la navegación y el contraste, no. El gris secundario original no pasaba accesibilidad (2,56 : 1) y se sustituyó." />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-3">
          {SWATCHES.map((s, k) => (
            <FadeIn key={s.name} delay={k * 0.06}>
              <div className="flex aspect-[4/5] flex-col justify-between p-4" style={{ background: s.hex, color: s.ink }}>
                <span className="text-[13px] font-medium">{s.name}</span>
                <span className="text-[12px] tabular-nums opacity-80">{s.hex}</span>
              </div>
              <p className="mt-3 t-small text-[var(--case-muted)]">{s.note}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className={section}>
        <Head n="05" eyebrow="Accesibilidad" title="Al 200 %, un importe nunca se parte." body="Con el texto de accesibilidad al máximo, las filas se apilan en lugar de recortar. Cumple el criterio de Apple para Texto Grande." />
        <LargeText />
      </section>

      <section className={section}>
        <div className={`${grid} gap-y-10`}>
          {[
            ["Castellano e inglés", "Bilingüe desde el primer día."],
            ["Claro y oscuro", "Los dos temas, con sus propios tonos de ingreso y gasto."],
            ["Texto al 200 %", "Escala completa sin que nada se corte."],
          ].map(([t, d], k) => (
            <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 border-t border-[var(--case-line)] pt-5 md:col-span-3 ${k === 0 ? "md:col-start-2" : ""} ${k === 1 ? "md:col-start-6" : ""} ${k === 2 ? "md:col-start-10" : ""}`}>
              <p className="t-title">{t}</p>
              <p className="mt-3 t-small text-[var(--case-muted)]">{d}</p>
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
              Una app nativa con su sistema y sus datos de prueba, lista para conectarle el backend.
            </Lines>
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
