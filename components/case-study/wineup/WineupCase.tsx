"use client";

import CaseEnd, { CaseLayer } from "@/components/case-study/CaseEnd";
import type { MoreCases } from "@/lib/maqueta/media";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import Lines from "@/components/case-study/Lines";
import LazyVideo from "@/components/case-study/LazyVideo";
import { BandMedia, CaseHero, CaseHeroOverlay, Eyebrow, FadeIn, MaskReveal, Parallax } from "@/components/case-study/primitives";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

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

/** Colores de la app (del prototipo): el ácido de la marca, el violeta del experto, un fondo de bodega y el burdeos de
    la tarjeta de «Catas virtuales» de la home (medido: #730017). */
const W = { lime: "#CDE84F", violet: "#6A1FD0", cellar: "#160C10", wine: "#730017" };

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

/** Fondo de color con un degradado suave hacia un tono algo más oscuro del mismo color, para que no quede plano. */
const shade = (c: string) =>
  c.startsWith("linear-gradient")
    ? c
    : `linear-gradient(165deg, ${c} 0%, color-mix(in srgb, ${c} 55%, #000) 50%, color-mix(in srgb, ${c} 8%, #000) 100%)`;
/** Velo negro sobre las fotos (2026-10-17): toda la foto un punto más oscura, más en los bordes y en la base, para
    que no se lea como una foto cuadrada pegada y lo que destaque sea el móvil. */
const VEIL =
  "radial-gradient(ellipse 70% 65% at 50% 40%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%), linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 60%)";
/** El degradado de la cabecera del experto en la app (medido del prototipo: de #861AD6 a #571697), llevado casi a negro. */
const EXPERT = "linear-gradient(180deg, #861AD6 0%, #571697 45%, #0C0316 100%)";

/** Apartado en dos mitades que se alternan (feedback 2026-10-17): a un lado, un solo móvil con el clip de lo que se
    cuenta, sobre un fondo a sangre hasta el borde (color de la app o foto); al otro, titulillo, titular y párrafo
    juntos a la izquierda, metidos una columna hacia dentro para que no vayan pegados al borde. En móvil, el texto
    primero y la imagen debajo, a todo el ancho. */
function Feature({
  side,
  eyebrow,
  title,
  body,
  clip,
  label,
  bg,
  photo,
  steps,
}: {
  side: "left" | "right";
  eyebrow: string;
  title: string;
  body?: string;
  clip: string;
  label: string;
  bg?: string;
  photo?: string;
  /** Puntos que se van sustituyendo bajo el párrafo, uno cada vez, mientras el apartado se queda fijo con el scroll. */
  steps?: [string, string][];
}) {
  const right = side === "right";
  const pin = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pin, offset: ["start start", "end end"] });
  const [shown, setShown] = useState(0);
  // Un punto cada vez: el tramo fijo se reparte en tantas partes como puntos y cada uno sustituye al anterior.
  useMotionValueEvent(scrollYProgress, "change", (v) => steps && setShown(Math.max(0, Math.min(steps.length - 1, Math.floor(v * steps.length)))));
  const content = (
      <div className={`${grid} items-center gap-y-12 ${steps ? "md:h-full" : ""}`}>
        <div className={`col-span-12 md:col-span-4 md:row-start-1 ${right ? "md:col-start-2" : "md:col-start-8"}`}>
          <FadeIn>
            <Eyebrow>{eyebrow}</Eyebrow>
          </FadeIn>
          <Lines as="h2" className="t-statement text-balance" delay={STAGGER}>
            {title}
          </Lines>
          {body && (
            <FadeIn delay={2 * STAGGER} className="mt-5">
              <p className="t-body text-[var(--case-muted)]">{body}</p>
            </FadeIn>
          )}
          {steps && (
            // Todos en la misma celda (la caja mide lo que el más alto): no se acumulan ni descuadran el bloque.
            <div className="mt-10 grid md:mt-12">
              {steps.map(([t, d], k) => (
                <motion.div
                  key={t}
                  className="[grid-area:1/1] border-t border-[var(--case-line)] pt-4"
                  initial={false}
                  animate={k === shown ? { opacity: 1, y: 0 } : { opacity: 0, y: k < shown ? -24 : 24 }}
                  transition={{ duration: DUR.base, ease: EASE.out }}
                  aria-hidden={k !== shown}
                >
                  <p className="t-label t-tag text-[var(--case-muted)]">
                    {k + 1} / {steps.length}
                  </p>
                  <p className="mt-3 t-title">{t}</p>
                  <p className="mt-2 t-small text-[var(--case-muted)]">{d}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className={`col-span-12 -mx-4 md:row-start-1 md:col-span-6 md:mx-0 ${right ? "md:col-start-7 md:-mr-6" : "md:col-start-1 md:-ml-6"}`}>
          {/* Tres capas a distinta velocidad (feedback 2026-10-17): el fondo, más bajo que el móvil, entra con la máscara y
              va lento; la foto se mueve dentro de él (parallax interno de MaskReveal); el móvil, por encima y sin
              máscara, sobresale arriba y abajo y va más rápido. */}
          <div className="relative flex aspect-[4/5] items-center justify-center md:aspect-auto md:h-[min(92vh,60rem)]">
            <MaskReveal from={right ? "right" : "left"} speed={50} className="absolute inset-x-0 top-[12%]">
              <div className="relative aspect-[100/95] w-full md:aspect-auto md:h-[min(70vh,45.6rem)]" style={{ background: shade(bg ?? W.cellar) }}>
                {photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
                {photo && <span aria-hidden className="absolute inset-0" style={{ background: VEIL }} />}
              </div>
            </MaskReveal>
            <Parallax speed={220} className="relative z-10 aspect-[805/1661] h-[90%]">
              <FadeIn delay={STAGGER} className="h-full w-full">
                <Phone src={clip} label={label} />
              </FadeIn>
            </Parallax>
          </div>
        </div>
      </div>
  );
  // Con pasos, el apartado mide tres pantallas y su contenido se queda fijo (sticky) mientras aparecen los puntos; en
  // móvil no se fija y los puntos salen según se baja. Sin pasos, el mismo contenedor sin alto extra (el ref de
  // useScroll tiene que existir siempre).
  return (
    <section className={section}>
      <div ref={pin} className={steps ? "md:h-[300vh]" : ""}>
        <div className={steps ? "md:sticky md:top-0 md:flex md:h-[100svh] md:items-center" : ""}>{content}</div>
      </div>
    </section>
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
                ["Rol", "Lead Product Designer"],
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
                la app.
              </p>
            </FadeIn>
          </div>
        </section>

        <Feature
          side="right"
          eyebrow="Dos perfiles"
          title="Dos perfiles, dos experiencias."
          body="Para quien disfruta del vino y para quien lo conoce a fondo. Un mundo por descubrir, sea cual sea tu perfil."
          clip="perfiles"
          label="Splash, elección de perfil y onboarding de WineLover"
          photo={`${M}/bg-atardecer.jpg`}
        />
        <Feature
          side="left"
          eyebrow="La home"
          title="Todo lo importante, en un solo vistazo."
          clip="home"
          label="Home de WineUp"
          bg={W.wine}
          steps={[
            ["Escáner", "La etiqueta como puerta de entrada: se escanea y la botella cuenta todo lo que sabe."],
            ["Scans recientes", "Lo último que has probado, con tu nota y la de la comunidad, a un dedo."],
            ["Eventos y catas", "Quedar con otros cerca de ti o catar desde casa: la comunidad, a la vista."],
          ]}
        />
        <Feature
          side="right"
          eyebrow="Explorar"
          title="Vinos, bodegas y gente que sabe."
          body="Descubre a quién seguir, qué se está bebiendo y dónde se brinda cerca de ti."
          clip="explorar"
          label="Explorar: descubre, feed y mapa"
          photo={`${M}/bg-copa-noche.jpg`}
        />
        <Feature
          side="left"
          eyebrow="Catas virtuales"
          title="La botella gira y empieza la cata."
          body="Cada vino se abre como si estuviera en tu mesa. Y con él, todo lo que la comunidad sabe de esa botella."
          clip="vino"
          label="Ficha del vino con la botella girando"
          photo={`${M}/bg-cava.jpg`}
        />
        <Feature
          side="right"
          eyebrow="Perfil"
          title="Tu cava, tus logros y tu gente."
          body="Lo que has probado, lo que te queda por probar y todo lo que has aprendido por el camino."
          clip="cava"
          label="Perfil de WineLover y de WineExpert"
          bg={EXPERT}
        />
        <Feature
          side="left"
          eyebrow="Aprender jugando"
          title="Saber más de vino, jugando y en buena compañía."
          body="Retos y trivias para pasar de curioso a entendido, a tu ritmo."
          clip="trivias"
          label="Trivias"
          photo={`${M}/bg-hojas.jpg`}
        />

        <CaseClosing className={section} title="Una app para descubrir el vino con los que más saben y con los tuyos." />
      </CaseLayer>
      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
