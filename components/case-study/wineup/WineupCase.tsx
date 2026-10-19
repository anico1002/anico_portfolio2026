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
import { useEffect, useRef, useState } from "react";
import Img from "@/components/case-study/Img";

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
      { }
      <Img src="/maqueta/gloop/media/iphone18-frame.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full" />
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
  // En móvil no hay parada (feedback 2026-10-17: los puntos salían tarde y casi fuera de pantalla): van los tres en
  // lista, ya visibles, como el resto del texto.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
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
            <div className="mt-10 grid gap-y-6 md:mt-12">
              {steps.map(([t, d], k) => (
                <motion.div
                  key={t}
                  className="border-t border-[var(--case-line)] pt-4 md:[grid-area:1/1]"
                  initial={false}
                  animate={!wide || k === shown ? { opacity: 1, y: 0 } : { opacity: 0, y: k < shown ? -24 : 24 }}
                  transition={{ duration: DUR.base, ease: EASE.out }}
                  aria-hidden={wide && k !== shown}
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
                   
                  <Img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
          poster={<BandMedia desktop={`${M}/hero-band-live2.mp4`} mobile={`${M}/hero-portrait.mp4`} label="WineUp" />}
          overlay={(t) => (
            <CaseHeroOverlay
              name="WineUp"
              delay={t}
              facts={[
                ["Para", "WineUp"],
                ["Rol", "Lead Product Designer"],
                ["Qué hice", "Architecture · UX/UI · Prototype"],
                ["Año", "2025"],
              ]}
            />
          )}
        >
          <BandMedia desktop={`${M}/hero-band-live2.mp4`} mobile={`${M}/hero-portrait.mp4`} label="WineUp" />
        </CaseHero>

        {/* Intro */}
        <section className={`pt-24 md:pt-36 ${wrap}`}>
          <div className={`${grid} gap-y-10`}>
            <div className="col-span-12 md:col-span-7">
              <FadeIn>
                <Eyebrow>Introduction</Eyebrow>
              </FadeIn>
              <Lines className="t-intro" delay={STAGGER}>
                A social network for people who love wine.
              </Lines>
            </div>
            <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-6">
              <p className="t-body text-[var(--case-muted)]">
                WineUp wants to be the place where wine lovers meet: to discover bottles, get to know each other and
                share what they’re drinking. With the brand already in place, my work was the app’s experience and
                interface.
              </p>
            </FadeIn>
          </div>
        </section>

        <Feature
          side="right"
          eyebrow="Two profiles"
          title="Two profiles, two experiences."
          body="For people who enjoy wine and for people who know it inside out. A world to discover, whatever your profile."
          clip="perfiles"
          label="Splash, profile choice and WineLover onboarding"
          photo={`${M}/bg-atardecer.jpg`}
        />
        <Feature
          side="left"
          eyebrow="The home screen"
          title="Everything that matters, at a glance."
          clip="home"
          label="WineUp home screen"
          bg={W.wine}
          steps={[
            ["Scanner", "The label as a way in: scan it and the bottle tells you everything it knows."],
            ["Recent scans", "What you tried last, with your rating and the community’s, one tap away."],
            ["Events and tastings", "Meet people nearby or taste from home: the community, right there."],
          ]}
        />
        <Feature
          side="right"
          eyebrow="Explore"
          title="Wines, wineries and people who know."
          body="Find who to follow, what people are drinking and where the toasts are happening near you."
          clip="explorar"
          label="Explore: discover, feed and map"
          photo={`${M}/bg-copa-noche.jpg`}
        />
        <Feature
          side="left"
          eyebrow="Virtual tastings"
          title="The bottle turns and the tasting begins."
          body="Every wine opens as if it were on your table. And with it, everything the community knows about that bottle."
          clip="vino"
          label="Wine page with the bottle turning"
          photo={`${M}/bg-cava.jpg`}
        />
        <Feature
          side="right"
          eyebrow="Profile"
          title="Your cellar, your milestones, your people."
          body="What you’ve tried, what’s still on your list and everything you’ve learned along the way."
          clip="cava"
          label="WineLover and WineExpert profiles"
          bg={EXPERT}
        />
        <Feature
          side="left"
          eyebrow="Learn by playing"
          title="Know more about wine, through play and good company."
          body="Challenges and trivia to go from Lover to Expert, at your own pace."
          clip="trivias"
          label="Trivia"
          photo={`${M}/bg-hojas.jpg`}
        />

        <CaseClosing
          className={section}
          title="Wine tastes better together. An app to share it with people who love it like you do."
          cta={{ label: "View the prototype", href: "https://cloud.protopie.io/p/60728aeeed322a3cf2520398?ui=false&scaleToFit=true&enableHotspotHints=true&cursorType=touch&mockup=true&bgColor=%23252525&bgImage=undefined&playSpeed=1" }}
        />
      </CaseLayer>
      <CaseEnd items={n.items} all={n.all} />
    </main>
  );
}
