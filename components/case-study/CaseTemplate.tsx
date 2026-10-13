"use client";

import NextCase from "@/components/case-study/NextCase";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SiteNav from "@/components/case-study/SiteNav";
import {
  CaseHero,
  CaseHeroOverlay,
  Eyebrow,
  FadeIn,
  Parallax,
  Phone,
  Placeholder,
  WindowReveal,
  useSeen,
} from "@/components/case-study/primitives";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import type { CaseCopy } from "@/lib/maqueta/cases";
import type { CaseMedia, MediaItem } from "@/lib/maqueta/media";
import Arrow from "@/components/case-study/Arrow";
import { invText } from "@/components/case-study/invText";
import Lines from "@/components/case-study/Lines";
import SiteFooter from "@/components/case-study/SiteFooter";
import LazyVideo from "@/components/case-study/LazyVideo";
import { useReduce } from "@/lib/maqueta/reduce";

/* Plantilla de caso de la maqueta: el mismo lenguaje que Gloop (máscaras y curvas de
   Metalab, parallax de Yakushev) alimentado por lib/maqueta/cases.ts + los medios de
   public/projects/<slug>/. Estructura de textos al estilo plastic.design: frase de
   cabecera, resumen con el reto como pregunta, capítulos con titular-frase y pie corto. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css
const tIntro = "t-intro";
const tStatement = "t-statement";
const tTitle = "t-title";
const tBody = "t-body";
const section = `pt-32 md:pt-48 ${wrap}`;


/** Lámina a su proporción natural: se abre con la máscara de Metalab, sin recortar. */
function Reveal({ children, from = "bottom", speed = 60 }: { children: React.ReactNode; from?: "top" | "bottom" | "left" | "right"; speed?: number }) {
  const reduce = useReduce();
  const closed = {
    top: "inset(0% 0% 100% 0%)",
    bottom: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "-8% 0px");
  if (reduce) return <div ref={ref}>{children}</div>;
  return (
    <Parallax speed={speed}>
      <motion.div
        ref={ref}
        initial={{ clipPath: closed }}
        animate={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : closed }}
        transition={{ duration: DUR.base, ease: EASE.inOut }}
      >
        {children}
      </motion.div>
    </Parallax>
  );
}

/** Como WindowReveal, pero con la proporción del propio medio (16:9 a todo el ancho): la
    ventana se abre con el scroll y termina mostrando el vídeo entero, sin recorte. */
function FeatureReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0.1, 1], [16, 0]);
  const side = useTransform(scrollYProgress, [0.1, 1], [24, 0]);
  const clipPath = useTransform([inset, side], ([i, sd]) => `inset(${i}% ${sd}% ${i}% ${sd}%)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  if (reduce) return <div ref={ref} className="aspect-video w-full">{children}</div>;
  return (
    <div ref={ref} className="relative aspect-video w-full">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
        <motion.div className="h-full w-full" style={{ scale }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Grupo 1a/1b/1c…: fundido en bucle, como en la web actual. */
function Slides({ srcs, w, h, alt }: { srcs: string[]; w: number; h: number; alt: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % srcs.length), 2600);
    return () => clearInterval(t);
  }, [srcs.length]);
  return (
    <div className="relative w-full" style={{ aspectRatio: `${w}/${h}` }}>
      {srcs.map((s, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s}
          src={s}
          alt={k === i ? alt : ""}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover xfade"
          style={{ opacity: k === i ? 1 : 0 }}
        />
      ))}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {srcs.map((s, k) => (
          <span key={s} className={`h-1.5 w-1.5 rounded-full bg-white hov ${k === i ? "opacity-100" : "opacity-40"}`} />
        ))}
      </div>
    </div>
  );
}

function MediaView({ item, alt }: { item: MediaItem; alt: string }) {
  if (item.type === "video")
    return <LazyVideo className="block h-auto w-full" src={item.src} aria-label={alt} />;
  if (item.type === "slides") return <Slides srcs={item.srcs} w={item.w} h={item.h} alt={alt} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.src} alt={alt} loading="lazy" className="block h-auto w-full" style={{ aspectRatio: `${item.w}/${item.h}` }} />
  );
}

const ratio = (m: MediaItem) => (m.type === "video" ? 16 / 9 : m.w / m.h);
const isTall = (m: MediaItem) => ratio(m) < 0.87;
const isStrip = (m: MediaItem) => ratio(m) > 2.6;

// Velocidades de parallax distintas por pieza (gesto Yakushev), como en Gloop.
const SPEEDS = [50, 170, 130, 60, 150, 90];

/** Láminas que siguen a la fila principal: por parejas escalonadas 7 + 5 columnas con
    desfase vertical, alternando el lado ancho (la alta va al hueco estrecho); las tiras
    muy apaisadas, a lo ancho; la suelta, descentrada. */
function scatter(items: MediaItem[]) {
  const out: { m: MediaItem; cls: string; from: "top" | "bottom" | "left" | "right" }[] = [];
  let pair = 0;
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    const b = items[i + 1];
    if (isStrip(a)) {
      out.push({ m: a, cls: "md:col-span-12", from: "bottom" });
      continue;
    }
    if (!b || isStrip(b)) {
      out.push({ m: a, cls: pair % 2 ? "md:col-span-8 md:col-start-5" : "md:col-span-8 md:col-start-2", from: pair % 2 ? "right" : "left" });
      pair++;
      continue;
    }
    // Ancha a la izquierda + estrecha a la derecha, o al revés; la alta, siempre estrecha.
    let wideFirst = pair % 2 === 0;
    if (isTall(a) && !isTall(b)) wideFirst = false;
    if (isTall(b) && !isTall(a)) wideFirst = true;
    out.push(
      wideFirst
        ? { m: a, cls: "md:col-span-7 md:col-start-1", from: "top" }
        : { m: a, cls: "md:col-span-5 md:col-start-1", from: "top" },
      wideFirst
        ? { m: b, cls: "md:col-span-5 md:col-start-8 md:mt-28", from: "bottom" }
        : { m: b, cls: "md:col-span-7 md:col-start-6 md:mt-28", from: "bottom" }
    );
    pair++;
    i++;
  }
  return out;
}

/** Capítulo asimétrico: imagen grande a un lado y texto estrecho al otro, alternando el
    lado en cada capítulo; después, el resto de láminas escalonadas. Sin imágenes, el
    titular y el texto van en diagonal. */
function Chapter({ n, eyebrow, title, body, items }: { n: number; eyebrow: string; title?: string; body?: string; items: MediaItem[] }) {
  const flip = n % 2 === 1;
  const [lead, ...rest] = items;
  // Titulillo y cuerpo con su fundido; el titular, por líneas (D1).
  const text = (
    <>
      <FadeIn>
        <p className={`t-label text-[var(--case-muted)] ${mono}`}>
          {String(n + 1).padStart(2, "0")} · {eyebrow}
        </p>
      </FadeIn>
      {title && (
        <Lines as="h3" className={`mt-3 ${tTitle}`} delay={STAGGER}>
          {title}
        </Lines>
      )}
      {body && (
        <FadeIn delay={2 * STAGGER}>
          <p className={`mt-4 text-[var(--case-muted)] ${tBody}`}>{body}</p>
        </FadeIn>
      )}
    </>
  );

  if (!lead)
    return (
      <section className={section}>
        <div className={`${grid} gap-y-8`}>
          <div className={`col-span-12 md:col-span-7 ${flip ? "md:col-start-5" : "md:col-start-2"}`}>
            <FadeIn>
              <p className={`mb-4 t-label text-[var(--case-muted)] ${mono}`}>
                {String(n + 1).padStart(2, "0")} · {eyebrow}
              </p>
            </FadeIn>
            {title && (
              <Lines as="h3" className={tStatement} delay={STAGGER}>
                {title}
              </Lines>
            )}
          </div>
          {body && (
            <FadeIn className={`col-span-12 md:col-span-4 md:mt-10 ${flip ? "md:col-start-2" : "md:col-start-8"}`}>
              <p className={`text-[var(--case-muted)] ${tBody}`}>{body}</p>
            </FadeIn>
          )}
        </div>
      </section>
    );

  const tall = isTall(lead);
  const media = tall ? "md:col-span-5" : "md:col-span-7";
  return (
    <section className={section}>
      <div className={`${grid} items-center gap-y-8`}>
        <div className={`col-span-12 ${media} ${flip ? `${tall ? "md:col-start-8" : "md:col-start-6"} md:order-2` : "md:col-start-1"}`}>
          <Reveal from={flip ? "right" : "left"} speed={flip ? 150 : 90}>
            <MediaView item={lead} alt={eyebrow} />
          </Reveal>
        </div>
        <div
          className={`col-span-12 md:col-span-4 ${flip ? `md:order-1 ${tall ? "md:col-start-2" : "md:col-start-1"}` : tall ? "md:col-start-8" : "md:col-start-9"}`}
        >
          {text}
        </div>
      </div>
      {rest.length > 0 && (
        <div className={`${grid} mt-20 gap-y-10 md:mt-32 md:gap-y-24`}>
          {scatter(rest).map(({ m, cls, from }, k) => (
            <div key={k} className={`col-span-12 ${cls}`}>
              <Reveal from={from} speed={SPEEDS[k % SPEEDS.length]}>
                <MediaView item={m} alt={`${eyebrow} ${k + 2}`} />
              </Reveal>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function CaseTemplate({
  copy: c,
  media,
  next,
}: {
  copy: CaseCopy;
  media: CaseMedia;
  next: { name: string; href: string; thumb?: string };
}) {
  const facts: [string, string][] = [
    ["Para", c.client ?? "Proyecto propio"],
    ["Rol", c.role],
    ["Qué hice", c.services.join(" · ")],
    ["Año", c.year],
  ];
  const chapters = [
    ...c.chapters,
    ...media.extraTitles.map((t) => ({ eyebrow: t, title: undefined as string | undefined, body: undefined })),
  ];

  return (
    <main
      className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <SiteNav active={c.section === "games" ? "games" : "product"} />

      {/* 0 · Cabecera: la miniatura (la misma que creció en la home) funde a la portada. */}
      <CaseHero
        videoReady={!!media.hero && media.hero.src !== media.thumb}
        poster={<Placeholder ratio="auto" className="h-full" src={media.thumb} label={c.name} />}
        overlay={(t) => <CaseHeroOverlay name={c.name} facts={facts} delay={t} />}
      >
        {media.hero &&
          media.hero.src !== media.thumb &&
          (media.hero.video ? (
            <LazyVideo className="absolute inset-0 h-full w-full object-cover" src={media.hero.src} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="absolute inset-0 h-full w-full object-cover" src={media.hero.src} alt="" />
          ))}
      </CaseHero>

      {/* 1 · Introducción asimétrica. Con móvil (patrón Gloop): texto a la izquierda, fijo
          mientras pasa el móvil en parallax a la derecha. Sin móvil: frase grande arriba a la
          izquierda y el resumen bajando en diagonal por la derecha. */}
      {media.phone ? (
        <section className={`pt-24 md:pt-36 ${wrap}`}>
          <div className={`${grid} items-start gap-y-14`}>
            <div className="col-span-12 md:sticky md:top-28 md:col-span-5">
              <FadeIn>
                <Eyebrow>Introducción</Eyebrow>
              </FadeIn>
              <Lines className={tStatement} delay={STAGGER}>
                {c.tagline}
              </Lines>
              <Lines as="h2" className={`mt-10 ${tTitle}`} delay={2 * STAGGER}>
                {invText(c.question)}
              </Lines>
              <FadeIn delay={3 * STAGGER} className="mt-6 space-y-5">
                {c.overview.map((p) => (
                  <p key={p.slice(0, 24)} className={`text-[var(--case-muted)] ${tBody}`}>
                    {p}
                  </p>
                ))}
              </FadeIn>
            </div>
            <Parallax speed={90} className="col-span-12 md:col-span-4 md:col-start-8">
              <FadeIn>
                <Phone label={c.name} src={media.phone.src} ratio={media.phone.ratio} className="mx-auto max-w-[360px]" />
              </FadeIn>
            </Parallax>
          </div>
        </section>
      ) : (
        <section className={`pt-24 md:pt-36 ${wrap}`}>
          <div className={`${grid} gap-y-12`}>
            <div className="col-span-12 md:col-span-8">
              <FadeIn>
                <Eyebrow>Introducción</Eyebrow>
              </FadeIn>
              <Lines className={tIntro} delay={STAGGER}>
                {c.tagline}
              </Lines>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 md:mt-56">
              <Lines as="h2" className={tTitle}>
                {invText(c.question)}
              </Lines>
              <FadeIn delay={STAGGER} className="mt-6 space-y-5">
                {c.overview.map((p) => (
                  <p key={p.slice(0, 24)} className={`text-[var(--case-muted)] ${tBody}`}>
                    {p}
                  </p>
                ))}
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* 2a · Momento grande del caso: su medio estrella crece hasta pantalla completa. */}
      {c.feature && (
        <div className="mt-28 md:mt-40">
          <FeatureReveal>
            {/\.(mp4|webm|mov)$/i.test(c.feature) ? (
              <LazyVideo className="h-full w-full object-cover" src={c.feature} aria-label={c.name} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.feature} alt={c.name} className="h-full w-full object-cover" />
            )}
          </FeatureReveal>
        </div>
      )}

      {/* 2b · Momento grande: la imagen de escenario del proyecto se abre a sangre. */}
      {media.phone?.bg && (
        <div className="mt-28 md:mt-40">
          <WindowReveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media.phone.bg} alt="" className="h-full w-full object-cover" />
          </WindowReveal>
        </div>
      )}

      {/* 3 · Capítulos: titular-frase + texto + láminas a su proporción */}
      {chapters.map((ch, i) => (
        <Chapter key={i} n={i} eyebrow={ch.eyebrow} title={ch.title} body={ch.body} items={media.chapters[i] ?? []} />
      ))}

      {/* 4 · Cifras gigantes (gesto Yakushev) */}
      {c.stats && (
        <section className={section}>
          {c.stats.map(([n, l]) => (
            <FadeIn key={l}>
              <div className={`${grid} items-end border-t border-[var(--case-line)] pt-4`}>
                <p className="col-span-12 t-d1 md:col-span-8">
                  {n}
                </p>
                <p className={`col-span-12 pb-3 md:col-span-4 md:col-start-9 ${tBody} text-[var(--case-muted)]`}>{l}</p>
              </div>
            </FadeIn>
          ))}
        </section>
      )}

      {/* 5 · Resultado + enlace */}
      <section className={section}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-7 md:col-start-3">
            <FadeIn>
              <Eyebrow>Resultado</Eyebrow>
            </FadeIn>
            <Lines as="h2" className={tStatement} delay={STAGGER}>
              {invText(c.outcomeTitle)}
            </Lines>
            <FadeIn delay={2 * STAGGER}>
              <p className={`mt-6 max-w-[56ch] text-[var(--case-muted)] ${tBody}`}>{c.outcome}</p>
              {c.cta && (
                <a
                  href={c.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-fill mt-10 inline-flex items-center gap-3 border border-[var(--case-fg)] px-6 py-4 t-small"
                >
                  {c.cta.label} <Arrow />
                </a>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 6 · Siguiente caso + contacto */}
      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name={next.name} href={next.href} thumb={next.thumb} />
      </section>
      {/* Pie común (E2): «¿Hablamos?» + franja con email, LinkedIn y volver arriba. */}
      <SiteFooter />
    </main>
  );
}
