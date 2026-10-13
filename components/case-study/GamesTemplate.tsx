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
  Placeholder,
  useSeen,
} from "@/components/case-study/primitives";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReduce } from "@/lib/maqueta/reduce";
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

/** Parallax muy sutil dentro de una imagen a sangre: la imagen va un 7 % más grande que su marco y
    se desplaza ±3 % en sentido contrario al scroll. El marco no se mueve, así que las láminas
    siguen pegadas una a otra. Sin movimiento reducido. */
function Drift({ on, children }: { on: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  if (!on || reduce) return <div ref={ref}>{children}</div>;
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ y, scale: 1.07 }}>{children}</motion.div>
    </div>
  );
}

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

/** Las láminas de un bloque, apiladas sin hueco. En móvil siempre a sangre; en escritorio, solo
    los bloques `bleed` (los demás, con los márgenes de la página). El bloque entra con el gesto de
    máscara de abajo arriba, hecho al revés: una capa del color del fondo lo tapa y se retira hacia
    arriba. Si se recortaran las láminas (clip-path), Chrome no pediría las de carga diferida y
    alguna se quedaba en gris (2026-10-13). */
function Stack({ items, bleed, label }: { items: GameMedia[]; bleed?: boolean; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "-8% 0px");
  return (
    <div ref={ref} className={`relative -mx-4 ${bleed ? "md:-mx-6" : "md:mx-0"}`}>
      {items.map((m, k) => (
        <Drift key={k} on={!!bleed}>
          {m.type === "img" ? (
            <Sheet m={m} />
          ) : m.type === "slides" ? (
            <Slides m={m} />
          ) : (
            <LazyVideo className="block h-auto w-full" src={m.src} aria-label={label} />
          )}
        </Drift>
      ))}
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

/** Texto de un bloque. Para no repetir siempre la misma composición (2026-10-13: «todo igual,
    aburrido»), cuatro maneras que se van turnando, con las posiciones de rejilla del resto de la
    web y su asimetría:
    0 · titular a la izquierda (1–6) y la línea abajo a la derecha (8–11);
    1 · titular a la derecha (7–12) y la línea debajo, aún más a la derecha (9–12);
    2 · frase grande centrada (3–10) y la línea estrecha debajo, hacia la derecha (7–10);
    3 · titulillo suelto a la izquierda y el titular desplazado (5–11), con la línea debajo.
    Regla de lectura (2026-10-13): la línea va siempre debajo del titular y alineada con él o más a
    la derecha, nunca a su izquierda (se leería antes que el titular). En móvil, todo en columna. */
function BlockText({ n, b }: { n: number; b: ResolvedGameBlock }) {
  const v = (n - 1) % 4;
  const eyebrow = (
    <FadeIn>
      <p className={`t-label text-[var(--case-muted)] ${mono}`}>
        {String(n).padStart(2, "0")} · {b.eyebrow}
      </p>
    </FadeIn>
  );
  const title = (cls: string) =>
    b.title && (
      <Lines as="h2" className={cls} delay={STAGGER}>
        {b.title}
      </Lines>
    );
  const body = (cls: string) =>
    b.body && (
      <FadeIn delay={2 * STAGGER} className={cls}>
        <p className="t-body text-[var(--case-muted)]">{b.body}</p>
      </FadeIn>
    );

  if (v === 1)
    return (
      <div className={`${grid} mb-12 gap-y-6 md:mb-20`}>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          {eyebrow}
          {title("mt-3 t-title")}
        </div>
        {body("col-span-12 md:col-span-4 md:col-start-9 md:mt-6")}
      </div>
    );
  if (v === 2)
    return (
      <div className={`${grid} mb-14 gap-y-6 md:mb-24`}>
        <div className="col-span-12 md:col-span-8 md:col-start-3">
          {eyebrow}
          {title("mt-4 t-statement")}
        </div>
        {body("col-span-12 md:col-span-4 md:col-start-7 md:mt-4")}
      </div>
    );
  if (v === 3)
    return (
      <div className={`${grid} mb-12 gap-y-6 md:mb-20`}>
        <div className="col-span-12 md:col-span-3 md:pt-2">{eyebrow}</div>
        <div className="col-span-12 md:col-span-7 md:col-start-5">
          {title("t-title")}
          {body("mt-6 md:max-w-[34ch]")}
        </div>
      </div>
    );
  return (
    <div className={`${grid} mb-12 gap-y-6 md:mb-16`}>
      <div className="col-span-12 md:col-span-6">
        {eyebrow}
        {title("mt-3 t-title")}
      </div>
      {body("col-span-12 md:col-span-4 md:col-start-8 md:self-end")}
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
          <Stack items={b.items} bleed={b.bleed} label={c.name} />
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
