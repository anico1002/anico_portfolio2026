"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
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
const tBody = "text-[clamp(16px,1.35vw,18px)] leading-[1.55]";
const section = `pt-32 md:pt-48 ${wrap}`;

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

function themeOf(c: CaseCopy) {
  const vars = c.light
    ? { bg: "#F2F1EE", fg: "#0B0B0C", muted: "rgba(11,11,12,0.58)", line: "rgba(11,11,12,0.14)", ph: "rgba(11,11,12,0.06)" }
    : { bg: "#09090B", fg: "#F4F4F5", muted: "rgba(244,244,245,0.56)", line: "rgba(244,244,245,0.16)", ph: "rgba(244,244,245,0.07)" };
  const a2 = c.accent2 ?? c.accent;
  const k = c.light ? 0.6 : 1;
  // Glows fijos como en Gloop: acento arriba a la izquierda, secundario arriba a la derecha.
  const glow = [
    `radial-gradient(80% 50% at -6% -12%, ${rgba(c.accent, 0.5 * k)}, transparent 70%)`,
    `radial-gradient(70% 46% at 104% 8%, ${rgba(a2, 0.42 * k)}, transparent 66%)`,
  ].join(", ");
  return {
    style: {
      "--case-bg": vars.bg,
      "--case-fg": vars.fg,
      "--case-muted": vars.muted,
      "--case-line": vars.line,
      "--case-ph": vars.ph,
    } as React.CSSProperties,
    glow,
  };
}

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

const isTall = (m: MediaItem) => m.type !== "video" && m.h / m.w > 1.15;

/** Reparte las láminas en filas: las altas, de dos en dos; las apaisadas, alternando
    ancho completo y desplazadas, para que el ritmo no sea una columna plana. */
function rows(items: MediaItem[]) {
  const out: { items: MediaItem[]; cls: string[] }[] = [];
  let wide = 0;
  for (let i = 0; i < items.length; i++) {
    const m = items[i];
    if (isTall(m)) {
      if (items[i + 1] && isTall(items[i + 1])) {
        out.push({ items: [m, items[i + 1]], cls: ["md:col-span-6", "md:col-span-6 md:mt-32"] });
        i++;
      } else {
        out.push({ items: [m], cls: [out.length % 2 ? "md:col-span-7 md:col-start-6" : "md:col-span-7 md:col-start-1"] });
      }
    } else {
      const pattern = ["md:col-span-12", "md:col-span-10 md:col-start-3", "md:col-span-10 md:col-start-1"];
      out.push({ items: [m], cls: [pattern[wide++ % pattern.length]] });
    }
  }
  return out;
}

function Chapter({ n, eyebrow, title, body, items }: { n: number; eyebrow: string; title?: string; body?: string; items: MediaItem[] }) {
  const flip = n % 2 === 1;
  let k = 0;
  return (
    <section className={section}>
      <div className={`${grid} items-end gap-y-6`}>
        <FadeIn className={`col-span-12 md:col-span-7 ${flip ? "md:col-start-6" : "md:col-start-1"}`}>
          <p className={`mb-4 text-[12px] text-[var(--case-muted)] ${mono}`}>
            {String(n + 1).padStart(2, "0")} · {eyebrow}
          </p>
          {title && <h2 className={tStatement}>{title}</h2>}
        </FadeIn>
        {body && (
          <FadeIn className={`col-span-12 md:col-span-4 ${flip ? "md:col-start-1 md:row-start-1" : "md:col-start-9"}`}>
            <p className={`text-[var(--case-muted)] ${tBody}`}>{body}</p>
          </FadeIn>
        )}
      </div>
      {items.length > 0 && (
        <div className={`${grid} mt-14 gap-y-10 md:mt-20 md:gap-y-16`}>
          {rows(items).map((r, ri) =>
            r.items.map((m, j) => {
              const idx = ++k;
              return (
                <div key={`${ri}-${j}`} className={`col-span-12 ${r.cls[j]}`}>
                  <Reveal from={(["bottom", "left", "top", "right"] as const)[(ri + j) % 4]} speed={j ? 120 : 50}>
                    <MediaView item={m} alt={`${eyebrow} ${idx}`} />
                  </Reveal>
                  <p className={`mt-3 text-[11px] text-[var(--case-muted)] ${mono}`}>
                    {eyebrow} — {String(idx).padStart(2, "0")}
                  </p>
                </div>
              );
            })
          )}
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
  const { style, glow } = themeOf(c);
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
      style={style}
      className="relative isolate min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: glow }} />
      <SiteNav active={c.section === "games" ? "games" : "product"} />

      {/* 0 · Cabecera: la miniatura (la misma que creció en la home) funde a la portada. */}
      <CaseHero
        videoReady={!!media.hero}
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
          (media.hero.video ? (
            <video className="absolute inset-0 h-full w-full object-cover" src={media.hero.src} autoPlay muted loop playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="absolute inset-0 h-full w-full object-cover" src={media.hero.src} alt="" />
          ))}
      </CaseHero>

      {/* 1 · Frase de cabecera + resumen con el reto como pregunta */}
      <section className={`pt-24 md:pt-36 ${wrap}`}>
        <div className={grid}>
          <FadeIn className="col-span-12 md:col-span-10">
            <p className={tIntro}>{c.tagline}</p>
          </FadeIn>
        </div>
        <div className={`${grid} mt-20 gap-y-8 md:mt-32`}>
          <FadeIn className="col-span-12 md:col-span-5">
            <Eyebrow>Resumen</Eyebrow>
            <h2 className={tStatement}>{c.question}</h2>
          </FadeIn>
          <FadeIn delay={0.1} className="col-span-12 space-y-5 md:col-span-5 md:col-start-8 md:pt-10">
            {c.overview.map((p) => (
              <p key={p.slice(0, 24)} className={`text-[var(--case-muted)] ${tBody}`}>
                {p}
              </p>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* 2 · El móvil sobre su escenario (fondo de la web actual o el color del caso) */}
      {media.phone && (
        <div className="mt-28 md:mt-40">
          <WindowReveal>
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              {media.phone.bg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media.phone.bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0" style={{ background: `radial-gradient(60% 70% at 50% 40%, ${rgba(c.accent, 0.55)}, var(--case-bg))` }} />
              )}
              <div className="relative h-[78%]" style={{ aspectRatio: media.phone.ratio }}>
                <Phone label={c.name} src={media.phone.src} ratio={media.phone.ratio} className="h-full" />
              </div>
            </div>
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
