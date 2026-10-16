"use client";

import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import LazyVideo from "@/components/case-study/LazyVideo";
import { BandMedia, CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, Parallax } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";

/* Caso de WineUp, a medida (2026-10-16). Contexto de Alberto: una app para amantes del vino, una red social donde se
   unen, conectan y comparten; dos perfiles desde el principio (WineLover y WineExpert), cada uno con su onboarding (el
   prototipo solo tiene el de los lovers) y el experto se reconoce por la cabecera violeta. La marca ya venía definida;
   el trabajo de Alberto es la UX/UI de la app y, sobre todo, la distribución de la home. El caso gira en torno a eso:
   un apartado por cada parte de la app, cada uno con su grabación del prototipo de ProtoPie
   (scripts/case-media/protopie/rec.mjs) en móviles reales frontales. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const section = `pt-36 md:pt-56 ${wrap}`;
const M = "/maqueta/wineup/media";

/** Colores de la app (del prototipo): el ácido de la marca, el violeta del experto y un fondo de bodega. */
const W = { lime: "#CDE84F", violet: "#6A1FD0", cellar: "#160C10" };

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

/** iPhone frontal real (marco del PSD de iPhone 18 Pro, el mismo de Gloop) con un vídeo del prototipo dentro. La
    pantalla ocupa el 91,74 % × 96,66 % del marco, desde el 4,10 % / 1,69 %. */
function Phone({ src, label, className = "" }: { src: string; label: string; className?: string }) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: "805 / 1661" }}>
      <div className="absolute overflow-hidden rounded-[13%/6.2%] bg-black" style={{ left: "4.0968%", top: "1.6852%", width: "91.744%", height: "96.66%" }}>
        <LazyVideo className="h-full w-full object-cover" src={`${M}/${src}.mp4`} poster={`${M}/${src}-poster.jpg`} aria-label={label} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maqueta/gloop/media/iphone18-frame.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}

/** Banda a sangre con uno, dos o tres móviles frontales; el del medio (o el segundo) sube con parallax. */
function Stage({ phones, bg = W.cellar }: { phones: { src: string; label: string }[]; bg?: string }) {
  const n = phones.length;
  return (
    <div className="m-bleed overflow-hidden px-6 py-16 md:px-12 md:py-28" style={{ background: bg }}>
      <div className={`mx-auto flex items-center justify-center gap-5 md:gap-14 ${n === 1 ? "max-w-[15rem] md:max-w-[22rem]" : n === 2 ? "max-w-[44rem]" : "max-w-[64rem]"}`}>
        {phones.map((p, k) => (
          <Parallax key={p.src} speed={n > 1 && k % 2 === 1 ? 140 : 40} className="w-full max-w-[20rem] flex-1">
            <FadeIn delay={k * STAGGER}>
              <Phone src={p.src} label={p.label} />
            </FadeIn>
          </Parallax>
        ))}
      </div>
    </div>
  );
}

/** Notas de diseño en pequeño, a lo ancho, debajo de una banda. */
function Notes({ items }: { items: [string, string][] }) {
  return (
    <div className={`${grid} mt-12 gap-y-8 md:mt-16`}>
      {items.map(([t, d], k) => (
        <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 border-t border-[var(--case-line)] pt-5 ${items.length === 3 ? "md:col-span-4" : "md:col-span-3"}`}>
          <p className="t-title">{t}</p>
          <p className="mt-3 t-small text-[var(--case-muted)]">{d}</p>
        </FadeIn>
      ))}
    </div>
  );
}

export default function WineupCase({ next: n }: { next: MoreCases }) {
  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="product" />
      <CaseLayer>
        <CaseHero
          videoReady
          poster={<BandMedia desktop={`${M}/hero-band.mp4`} mobile={`${M}/thumb.mp4`} label="WineUp" />}
          overlay={(t) => (
            <CaseHeroOverlay
              name="WineUp"
              delay={t}
              facts={[
                ["Para", "WineUp"],
                ["Rol", "UX/UI"],
                ["Qué hice", "Arquitectura · UX/UI · Prototipo"],
                ["Año", "2025"],
              ]}
            />
          )}
        >
          <BandMedia desktop={`${M}/hero-band.mp4`} mobile={`${M}/thumb.mp4`} label="WineUp" />
        </CaseHero>

        {/* Intro */}
        <section className={`pt-24 md:pt-36 ${wrap}`}>
          <div className={`${grid} gap-y-10`}>
            <div className="col-span-12 md:col-span-8">
              <FadeIn>
                <Eyebrow>Introducción</Eyebrow>
              </FadeIn>
              <Lines className="t-intro" delay={STAGGER}>
                Una red social para quien ama el vino.
              </Lines>
            </div>
            <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6">
              <p className="t-body text-[var(--case-muted)]">
                WineUp quiere ser el sitio donde se encuentran los amantes del vino: para descubrir botellas, conocer a
                otros y compartir lo que beben. Con la marca ya definida, el trabajo fue la experiencia y la interfaz de
                la app, y sobre todo cómo se ordena la home.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Dos perfiles */}
        <section className={section}>
          <Head
            eyebrow="Dos perfiles"
            title="Quien disfruta del vino y quien sabe de vino."
            body="La app empieza preguntando quién eres. WineLover y WineExpert tienen cada uno su onboarding, y el experto se reconoce en toda la app por su cabecera violeta."
          />
          <Stage
            phones={[
              { src: "splash", label: "Splash de WineUp" },
              { src: "onboarding", label: "Onboarding de WineLover" },
            ]}
          />
        </section>

        {/* La home */}
        <section className={section}>
          <Head
            eyebrow="La home"
            title="Todo lo importante, en un solo vistazo."
            body="La pantalla que más vueltas tuvo. Arriba, lo que más se usa; debajo, lo último que has probado; al final, las dos puertas a la comunidad."
          />
          <Stage phones={[{ src: "home", label: "Home de WineUp" }]} bg={W.lime} />
          <Notes
            items={[
              ["Escáner", "La etiqueta como puerta de entrada: se escanea y la botella cuenta todo lo que sabe."],
              ["Scans recientes", "Lo último que has probado, con tu nota y la de la comunidad, a un dedo."],
              ["Eventos y catas", "Quedar con otros cerca de ti o catar desde casa: la comunidad, a la vista."],
            ]}
          />
        </section>

        {/* Explorar */}
        <section className={section}>
          <Head
            eyebrow="Explorar"
            title="Vinos, bodegas y gente que sabe."
            body="Expertos y amantes a los que seguir, el feed de lo que comparte la comunidad y un mapa con las bodegas y los eventos que tienes cerca."
          />
          <Stage
            phones={[
              { src: "explore", label: "Explorar: descubre y feed" },
              { src: "mapa", label: "Explorar: el mapa" },
            ]}
          />
        </section>

        {/* La ficha del vino */}
        <section className={section}>
          <Head
            eyebrow="Catas virtuales"
            title="La botella gira y empieza la cata."
            body="Cada vino tiene su ficha: región, uva, crianza, valoraciones y reseñas de la comunidad. Y una botella que gira al abrirla, el detalle que la hace sentir como sacarla de la estantería."
          />
          <Stage phones={[{ src: "vino", label: "Ficha del vino con la botella girando" }]} bg="#3A0F1E" />
        </section>

        {/* Perfil y experto */}
        <section className={section}>
          <Head
            eyebrow="Perfil"
            title="Tu cava, tus logros y tu gente."
            body="Lo que has probado, lo que quieres probar y tus listas. En estadísticas, el nivel, las rachas y los logros. El perfil del experto suma su feed de contenidos, en violeta."
          />
          <Stage
            phones={[
              { src: "perfil", label: "Perfil de WineLover" },
              { src: "expert", label: "Perfil de WineExpert con su feed" },
            ]}
            bg={W.violet}
          />
        </section>

        {/* Aprender jugando */}
        <section className={section}>
          <Head
            eyebrow="Aprender jugando"
            title="Saber más de vino, sin que parezca una clase."
            body="Retos y trivias por temas, de la introducción a las denominaciones de origen, con su progreso. Lo que aprendes suma en tu perfil."
          />
          <Stage phones={[{ src: "trivias", label: "Trivias" }]} />
        </section>

        <CaseClosing className={section} title="Una app para descubrir el vino con los que más saben y con los tuyos." />
      </CaseLayer>
      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
