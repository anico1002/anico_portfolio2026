"use client";

import { useEffect, useRef, useState } from "react";
import NextCase from "@/components/case-study/NextCase";
import CaseClosing from "@/components/case-study/CaseClosing";
import SiteNav from "@/components/case-study/SiteNav";
import SiteFooter from "@/components/case-study/SiteFooter";
import Lines from "@/components/case-study/Lines";
import LazyVideo from "@/components/case-study/LazyVideo";
import {
  CaseHero,
  CaseHeroOverlay,
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
   de toda la web. Misma cabecera, «Siguiente caso» y pie que Product. Bloques en lib/maqueta/games.ts.
   Desde 2026-10-15 también la usan los casos de «Marca y web» (dentro de Product en el menú). */

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

/** Lámina a su proporción natural. Con `cropTop`/`cropLeft`, la caja toma la proporción ya
    recortada y la imagen, más ancha que la caja en lo que mide la franja izquierda, sube y se corre
    lo que miden las franjas (los márgenes en % se calculan sobre el ancho de la caja). */
function Sheet({ m }: { m: Extract<GameMedia, { type: "img" }> }) {
  const top = m.cropTop ?? 0;
  const left = m.cropLeft ?? 0;
  const pct = (px: number) => `-${((px / (m.w - left)) * 100).toFixed(4)}%`;
  return (
    <div
      className="relative overflow-hidden bg-[var(--case-ph)]"
      style={{ aspectRatio: `${m.w - left} / ${m.h - top}`, background: m.bg }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.src}
        alt=""
        loading="lazy"
        decoding="async"
        className="block h-auto max-w-none"
        style={{
          width: left ? `${((m.w / (m.w - left)) * 100).toFixed(4)}%` : "100%",
          marginTop: top ? pct(top) : undefined,
          marginLeft: left ? pct(left) : undefined,
        }}
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

/** Texto de un bloque: titulillo, titular y línea, siempre empezando en la misma columna y alineados por
    la izquierda (2026-10-15, Alberto: separar el texto del titular en un diseño tan vertical creaba un
    desorden raro). Todo por columnas de la rejilla, nunca anchos fijos: el titular ocupa una columna más
    que el párrafo (al ser más grande, si no, acabaría más corto que él). La asimetría la da la columna
    de arranque del grupo, que se va turnando (2026-10-13: «todo igual, aburrido»):
    0 · desde la 1 · 1 · desde la 7 · 2 · frase grande desde la 3 · 3 · desde la 5. En móvil, a todo el ancho. */
const SPOTS = [
  { title: "md:col-span-5 md:col-start-1", body: "md:col-span-4 md:col-start-1", size: "t-title", mb: "mb-12 md:mb-16" },
  { title: "md:col-span-5 md:col-start-7", body: "md:col-span-4 md:col-start-7", size: "t-title", mb: "mb-12 md:mb-20" },
  { title: "md:col-span-6 md:col-start-3", body: "md:col-span-5 md:col-start-3", size: "t-statement", mb: "mb-14 md:mb-24" },
  { title: "md:col-span-5 md:col-start-5", body: "md:col-span-4 md:col-start-5", size: "t-title", mb: "mb-12 md:mb-20" },
];

function BlockText({ n, b }: { n: number; b: ResolvedGameBlock }) {
  const spot = SPOTS[(n - 1) % SPOTS.length];
  return (
    <div className={`${grid} ${spot.mb}`}>
      <div className={`col-span-12 ${spot.title}`}>
        <FadeIn>
          <p className={`t-label text-[var(--case-muted)] ${mono}`}>{b.eyebrow}</p>
        </FadeIn>
        {b.title && (
          <Lines as="h2" className={`mt-3 ${spot.size}`} delay={STAGGER}>
            {b.title}
          </Lines>
        )}
      </div>
      {b.body && (
        <FadeIn delay={2 * STAGGER} className={`col-span-12 mt-6 ${spot.body}`}>
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
  let n = 0;

  return (
    <main className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased">
      <SiteNav active={c.section === "games" ? "games" : "product"} />

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

      {/* Intro corta: qué es, en una frase, y un párrafo. Por columnas, como los bloques (2026-10-15): los
          dos desde la 3, la frase en 6 y el párrafo en 5, para que formen grupo. */}
      <section className={`pt-28 md:pt-44 ${wrap}`}>
        <div className={`${grid} gap-y-10`}>
          <Lines className="col-span-12 t-statement md:col-span-6 md:col-start-3">{c.tagline}</Lines>
          <FadeIn delay={STAGGER} className="col-span-12 md:col-span-5 md:col-start-3">
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

      {/* Cierre común (CaseClosing). */}
      <CaseClosing title={c.outcomeTitle} cta={c.cta} />

      <section className="mt-36 overflow-hidden md:mt-56">
        <NextCase name={next.name} href={next.href} thumb={next.thumb} />
      </section>
      <SiteFooter />
    </main>
  );
}
