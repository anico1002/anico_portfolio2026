"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SiteNav from "@/components/case-study/SiteNav";
import {
  CaseHero,
  Eyebrow,
  FadeIn,
  MaskReveal,
  MaskText,
  Parallax,
  Phone,
  Placeholder,
  POWER3_INOUT,
  WindowReveal,
} from "@/components/case-study/primitives";
import type { CaseCopy } from "@/lib/maqueta/cases";
import type { CaseMedia, MediaItem } from "@/lib/maqueta/media";

/* Plantilla de caso de la maqueta: el mismo lenguaje que Gloop (máscaras y curvas de
   Metalab, parallax de Yakushev) alimentado por lib/maqueta/cases.ts + los medios de
   public/projects/<slug>/. Estructura de textos al estilo plastic.design: frase de
   cabecera, resumen con el reto como pregunta, capítulos con titular-frase y pie corto. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";
const tIntro = "text-[clamp(28px,4.3vw,64px)] leading-[1.12] tracking-[-0.025em]";
const tStatement = "text-[clamp(26px,3.1vw,44px)] leading-[1.18] tracking-[-0.03em]";
const tTitle = "text-[clamp(24px,2.4vw,34px)] leading-[1.15] tracking-[-0.02em]";
const tBody = "text-[clamp(16px,1.35vw,18px)] leading-[1.55]";
const section = `pt-32 md:pt-48 ${wrap}`;


/** Lámina a su proporción natural: se abre con la máscara de Metalab, sin recortar. */
function Reveal({ children, from = "bottom", speed = 60 }: { children: React.ReactNode; from?: "top" | "bottom" | "left" | "right"; speed?: number }) {
  const reduce = useReducedMotion();
  const closed = {
    top: "inset(0% 0% 100% 0%)",
    bottom: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];
  if (reduce) return <div>{children}</div>;
  return (
    <Parallax speed={speed}>
      <motion.div
        initial={{ clipPath: closed }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.8, ease: POWER3_INOUT }}
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
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0.1, 1], [16, 0]);
  const side = useTransform(scrollYProgress, [0.1, 1], [24, 0]);
  const clipPath = useTransform([inset, side], ([i, sd]) => `inset(${i}% ${sd}% ${i}% ${sd}%)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  if (reduce) return <div className="aspect-video w-full">{children}</div>;
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
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: k === i ? 1 : 0 }}
        />
      ))}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {srcs.map((s, k) => (
          <span key={s} className={`h-1.5 w-1.5 rounded-full bg-white transition-opacity ${k === i ? "opacity-100" : "opacity-40"}`} />
        ))}
      </div>
    </div>
  );
}

function MediaView({ item, alt }: { item: MediaItem; alt: string }) {
  if (item.type === "video")
    return <video className="block h-auto w-full" src={item.src} autoPlay muted loop playsInline aria-label={alt} />;
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
  const text = (
    <>
      <p className={`text-[12px] text-[var(--case-muted)] ${mono}`}>
        {String(n + 1).padStart(2, "0")} · {eyebrow}
      </p>
      {title && <h3 className={`mt-3 ${tTitle}`}>{title}</h3>}
      {body && <p className={`mt-4 text-[var(--case-muted)] ${tBody}`}>{body}</p>}
    </>
  );

  if (!lead)
    return (
      <section className={section}>
        <div className={`${grid} gap-y-8`}>
          <FadeIn className={`col-span-12 md:col-span-7 ${flip ? "md:col-start-5" : "md:col-start-2"}`}>
            <p className={`mb-4 text-[12px] text-[var(--case-muted)] ${mono}`}>
              {String(n + 1).padStart(2, "0")} · {eyebrow}
            </p>
            {title && <h3 className={tStatement}>{title}</h3>}
          </FadeIn>
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
        <FadeIn
          className={`col-span-12 md:col-span-4 ${flip ? `md:order-1 ${tall ? "md:col-start-2" : "md:col-start-1"}` : tall ? "md:col-start-8" : "md:col-start-9"}`}
        >
          {text}
        </FadeIn>
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
  // Cuanto más largo el nombre, menor el cuerpo (puede ir a dos líneas).
  const nameVw = Math.min(12, 150 / c.name.length);
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
        overlay={(t) => (
          <div className={`${grid} h-full content-between gap-y-6 pb-6 pt-4 md:pb-7 md:pt-3 ${wrap}`}>
            <div className="col-span-12 self-start overflow-hidden md:col-span-8">
              <motion.h1
                className="font-extrabold leading-[0.88] tracking-[-0.045em]"
                style={{ fontSize: `clamp(44px, ${nameVw}vw, 200px)` }}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: POWER3_INOUT, delay: t }}
              >
                {c.name}
              </motion.h1>
            </div>
            <div className="col-span-12 self-end md:col-span-4 md:col-start-9">
              <MaskText delay={t + 0.2}>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className={`${mono} text-[12px] text-[var(--case-muted)]`}>{k}</dt>
                      <dd className="mt-1 text-[clamp(14px,1.1vw,16px)] leading-snug">{v}</dd>
                    </div>
                  ))}
                </dl>
              </MaskText>
            </div>
          </div>
        )}
      >
        {media.hero &&
          media.hero.src !== media.thumb &&
          (media.hero.video ? (
            <video className="absolute inset-0 h-full w-full object-cover" src={media.hero.src} autoPlay muted loop playsInline />
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
            <FadeIn className="col-span-12 md:sticky md:top-28 md:col-span-5">
              <Eyebrow>Introducción</Eyebrow>
              <p className={tStatement}>{c.tagline}</p>
              <h2 className={`mt-10 ${tTitle}`}>{c.question}</h2>
              <div className="mt-6 space-y-5">
                {c.overview.map((p) => (
                  <p key={p.slice(0, 24)} className={`text-[var(--case-muted)] ${tBody}`}>
                    {p}
                  </p>
                ))}
              </div>
            </FadeIn>
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
            <FadeIn className="col-span-12 md:col-span-8">
              <Eyebrow>Introducción</Eyebrow>
              <p className={tIntro}>{c.tagline}</p>
            </FadeIn>
            <FadeIn delay={0.1} className="col-span-12 md:col-span-4 md:col-start-9 md:mt-56">
              <h2 className={tTitle}>{c.question}</h2>
              <div className="mt-6 space-y-5">
                {c.overview.map((p) => (
                  <p key={p.slice(0, 24)} className={`text-[var(--case-muted)] ${tBody}`}>
                    {p}
                  </p>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* 2a · Momento grande del caso: su medio estrella crece hasta pantalla completa. */}
      {c.feature && (
        <div className="mt-28 md:mt-40">
          <FeatureReveal>
            {/\.(mp4|webm|mov)$/i.test(c.feature) ? (
              <video className="h-full w-full object-cover" src={c.feature} autoPlay muted loop playsInline aria-label={c.name} />
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
                <p className="col-span-12 text-[clamp(80px,16vw,260px)] font-extrabold leading-[0.82] tracking-[-0.055em] md:col-span-8">
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
          <FadeIn className="col-span-12 md:col-span-7 md:col-start-3">
            <Eyebrow>Resultado</Eyebrow>
            <h2 className={tStatement}>{c.outcomeTitle}</h2>
            <p className={`mt-6 max-w-[56ch] text-[var(--case-muted)] ${tBody}`}>{c.outcome}</p>
            {c.cta && (
              <a
                href={c.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 border border-[var(--case-fg)] px-6 py-4 text-[15px] transition-colors hover:bg-[var(--case-fg)] hover:text-[var(--case-bg)]"
              >
                {c.cta.label} <span aria-hidden>↗</span>
              </a>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 6 · Siguiente caso + contacto */}
      <footer className="mt-36 overflow-hidden pb-10 md:mt-56">
        <Link href={next.href} className="group block">
          <div className={wrap}>
            <MaskReveal from="bottom" className="mx-auto max-w-[560px]">
              <Placeholder ratio="16/9" src={next.thumb} label={next.name} />
            </MaskReveal>
          </div>
          <FadeIn>
            <p className={`mt-8 text-center text-[13px] text-[var(--case-muted)] ${mono}`}>Siguiente caso · {next.name}</p>
            <p className="mt-2 whitespace-nowrap text-center text-[15vw] font-extrabold leading-none tracking-[-0.055em] transition-opacity group-hover:opacity-70">
              {next.name.length > 12 ? "Siguiente" : next.name}
            </p>
          </FadeIn>
        </Link>
        <div className={`mt-24 flex items-end justify-between border-t border-[var(--case-line)] pt-6 ${wrap}`}>
          <p className={`text-[12px] text-[var(--case-muted)] ${mono}`}>anico · {new Date().getFullYear()}</p>
          <Link href="/maqueta/contacto" className="text-[clamp(28px,3vw,44px)] font-medium tracking-[-0.03em] hover:opacity-70">
            Hablemos →
          </Link>
        </div>
      </footer>
    </main>
  );
}
