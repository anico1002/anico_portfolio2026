"use client";

import { useEffect, useRef, useState } from "react";
import NextCase from "@/components/case-study/NextCase";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import LazyVideo from "@/components/case-study/LazyVideo";
import Arrow from "@/components/case-study/Arrow";
import { invText } from "@/components/case-study/invText";
import {
  CaseHero,
  CaseHeroOverlay,
  Eyebrow,
  FadeIn,
  Phone,
  Placeholder,
  useSeen,
} from "@/components/case-study/primitives";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { motion } from "framer-motion";
import type { CaseCopy } from "@/lib/maqueta/cases";
import type { CaseMedia, GameMedia, ResolvedGameBlock } from "@/lib/maqueta/media";

/* Plantilla de Games: escaparate gráfico (2026-10-13). Product cuenta casos de éxito; aquí manda
   la imagen. Las láminas se diseñaron para ir una debajo de otra con continuidad, así que se apilan
   a todo el ancho y sin hueco, como en la web actual, y nunca se recortan salvo la franja de título
   que el texto del bloque ya dice (`cropTop`). Entre bloque y bloque, un texto breve con el estilo
   de toda la web. Misma cabecera, «Siguiente caso» y pie que Product. Bloques en lib/maqueta/games.ts. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "t-tag";
const SLIDE_MS = 3200; // cada diapositiva de un pase

/** Lámina a su proporción natural. Con `cropTop`, la caja toma la proporción ya recortada y la
    imagen sube lo que mide la franja (el margen en % se calcula sobre el ancho). */
function Sheet({ m }: { m: Extract<GameMedia, { type: "img" }> }) {
  const top = m.cropTop ?? 0;
  return (
    <div className="relative overflow-hidden bg-[var(--case-ph)]" style={{ aspectRatio: `${m.w} / ${m.h - top}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.src}
        alt=""
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
        style={top ? { marginTop: `-${((top / m.w) * 100).toFixed(4)}%` } : undefined}
      />
    </div>
  );
}

/** Pase de diapositivas (series a, b, c…): fundido cruzado, solo mientras se ve. */
function Slides({ m }: { m: Extract<GameMedia, { type: "slides" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || m.srcs.length < 2) return;
    const id = window.setInterval(() => setI((k) => (k + 1) % m.srcs.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [on, m.srcs.length]);
  return (
    <div ref={ref} className="relative overflow-hidden bg-[var(--case-ph)]" style={{ aspectRatio: `${m.w} / ${m.h}` }}>
      {m.srcs.map((s, k) => (
        // Todas montadas (la siguiente ya está cargada cuando le toca); visible solo la actual.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s}
          src={s}
          alt=""
          loading={k === 0 ? "lazy" : undefined}
          decoding="async"
          className="xfade absolute inset-0 h-full w-full object-cover"
          style={{ opacity: k === i ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

/** Móvil sobre su fondo (Two Dots): el fondo a todo el ancho y el móvil centrado encima. */
function PhoneOnBg({ m, ratio, label }: { m: Extract<GameMedia, { type: "phone" }>; ratio: string; label: string }) {
  return (
    // En móvil el fondo apaisado (12:5) dejaría el teléfono diminuto: ahí se encuadra en vertical
    // (es un fondo decorativo, se puede recortar por los lados; las láminas, nunca).
    <div className="relative aspect-[4/5] overflow-hidden md:aspect-[12/5]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.bg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      {/* El móvil ocupa el 84 % del alto del fondo; su ancho sale de la proporción del vídeo. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ height: "84%", aspectRatio: ratio.replace("/", " / ") }}>
          <Phone label={label} src={m.src} ratio={ratio} />
        </div>
      </div>
    </div>
  );
}

/** Las láminas de un bloque, apiladas sin hueco. El bloque entra con el gesto de máscara de abajo
    arriba del resto de medios, pero hecho al revés: una capa del color del fondo lo tapa y se
    retira hacia arriba. Si se recortaran las láminas (clip-path), Chrome no pediría las que llevan
    carga diferida mientras siguen recortadas y alguna se quedaba en gris (2026-10-13). Dentro,
    nada se mueve por su cuenta: es una pieza. */
function Stack({ items, ratio, label }: { items: GameMedia[]; ratio: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "-8% 0px");
  return (
    <div ref={ref} className="relative -mx-4 md:mx-0">
      {items.map((m, k) =>
        m.type === "img" ? (
          <Sheet key={k} m={m} />
        ) : m.type === "slides" ? (
          <Slides key={k} m={m} />
        ) : m.type === "video" ? (
          <LazyVideo key={k} className="block h-auto w-full" src={m.src} aria-label={label} />
        ) : (
          <PhoneOnBg key={k} m={m} ratio={ratio} label={label} />
        )
      )}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[var(--case-bg)]"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: seen ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
        transition={{ duration: DUR.slow, ease: EASE.inOut }}
      />
    </div>
  );
}

/** Texto de un bloque: titulillo numerado y titular a la izquierda; la línea, estrecha a la derecha. */
function BlockText({ n, b }: { n: number; b: ResolvedGameBlock }) {
  return (
    <div className={`${grid} mb-12 gap-y-6 md:mb-16`}>
      <div className="col-span-12 md:col-span-6">
        <FadeIn>
          <p className={`t-label text-[var(--case-muted)] ${mono}`}>
            {String(n).padStart(2, "0")} · {b.eyebrow}
          </p>
        </FadeIn>
        {b.title && (
          <Lines as="h2" className="mt-3 t-title" delay={STAGGER}>
            {b.title}
          </Lines>
        )}
      </div>
      {b.body && (
        <FadeIn delay={2 * STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 md:self-end">
          <p className="t-body text-[var(--case-muted)]">{b.body}</p>
        </FadeIn>
      )}
    </div>
  );
}

export default function GamesTemplate({
  copy: c,
  media,
  blocks,
  next,
}: {
  copy: CaseCopy;
  media: CaseMedia;
  blocks: ResolvedGameBlock[];
  next: { name: string; href: string; thumb?: string };
}) {
  const facts: [string, string][] = [
    ["Para", c.client ?? "Proyecto propio"],
    ["Rol", c.role],
    ["Qué hice", c.services.join(" · ")],
    ["Año", c.year],
  ];
  const ratio = c.phoneRatio ?? "393/852";
  let n = 0;

  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active="games" />

      {/* Cabecera: la misma que en Product (la miniatura de la home funde a la portada). */}
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

      {/* Intro corta: qué es, en una frase, y un párrafo. Aquí habla la imagen. */}
      <section className={`pt-28 md:pt-44 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <Lines className="col-span-12 t-statement md:col-span-8 md:col-start-3">{c.tagline}</Lines>
          <FadeIn delay={STAGGER} className="col-span-12 md:col-span-4 md:col-start-7">
            <p className="t-body text-[var(--case-muted)]">{c.overview[0]}</p>
          </FadeIn>
        </div>
      </section>

      {/* Bloques: un texto breve y sus láminas apiladas. El primero, sin texto, es la portada. */}
      {blocks.map((b, i) => (
        <section key={i} className={`${i === 0 ? "pt-24 md:pt-36" : "pt-28 md:pt-48"} ${wrap}`}>
          {b.eyebrow && <BlockText n={++n} b={b} />}
          <Stack items={b.items} ratio={ratio} label={c.name} />
        </section>
      ))}

      {/* Cierre breve: la frase de resultado y el enlace, sin cifras ni párrafos. */}
      <section className={`pt-32 md:pt-48 ${wrap}`}>
        <div className={grid}>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <FadeIn>
              <Eyebrow>Resultado</Eyebrow>
            </FadeIn>
            <Lines as="h2" className="t-statement" delay={STAGGER}>
              {invText(c.outcomeTitle)}
            </Lines>
            {c.cta && (
              <FadeIn delay={2 * STAGGER}>
                <a
                  href={c.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-fill mt-10 inline-flex items-center gap-3 border border-[var(--case-fg)] px-6 py-4 t-small"
                >
                  {c.cta.label} <Arrow />
                </a>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name={next.name} href={next.href} thumb={next.thumb} />
      </section>
      <SiteFooter />
    </main>
  );
}
