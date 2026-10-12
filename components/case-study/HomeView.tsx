"use client";

import Link from "next/link";
import SiteNav from "@/components/case-study/SiteNav";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Eyebrow,
  FadeIn,
  FLIGHT_KEY,
  FLIGHT_S,
  MaskReveal,
  POWER4_INOUT,
  Parallax,
  Placeholder,
} from "@/components/case-study/primitives";

/* Home de una línea de trabajo (Product o Games). Composición de la maqueta del
   2026-10-11: titular, primer proyecto con el párrafo abajo a la derecha, cifras gigantes
   del rango de años y rejilla escalonada asimétrica. Las miniaturas con caso crecen a
   pantalla completa antes de cambiar de página. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";

export type P = { name: string; line: string; type: string; year: string; thumb?: string; href?: string }; // type: para filtros futuros

// Ritmo de Yakushev (2026-10-12): mucho aire entre proyectos, casi uno por pantalla.
// Solo a veces coinciden dos, y entonces uno es pequeño y se mueve mucho más rápido con
// el scroll (slots 2 + 3 comparten fila). Se repite cada 6 proyectos.
const layout: { col: string; ratio: string; offset: string; speed: number; bleed?: "left" | "right" }[] = [
  { col: "md:col-start-1 md:col-span-8", ratio: "4/3", offset: "md:mt-[40vh]", speed: 60 },
  // A sangre por la derecha: la imagen llega al borde de la pantalla.
  { col: "md:col-start-5 md:col-span-8", ratio: "16/10", offset: "md:mt-[40vh]", speed: 80, bleed: "right" },
  // Pareja: la pequeña y rápida a la izquierda…
  { col: "md:col-start-1 md:col-span-3", ratio: "3/4", offset: "md:mt-[55vh]", speed: 300 },
  // …y la grande y lenta a la derecha, en la misma fila.
  { col: "md:col-start-6 md:col-span-7", ratio: "1/1", offset: "md:mt-[30vh]", speed: 60 },
  { col: "md:col-start-3 md:col-span-8", ratio: "16/10", offset: "md:mt-[40vh]", speed: 50 },
  // A sangre por la izquierda.
  { col: "md:col-start-1 md:col-span-7", ratio: "4/3", offset: "md:mt-[40vh]", speed: 90, bleed: "left" },
];

function Card({ p, i, slot, offset }: { p: P; i: number; slot: number; offset?: string }) {
  // `i` numera el proyecto; `slot` es su hueco en la composición (las cifras ocupan uno).
  const l = layout[slot % layout.length];
  const router = useRouter();
  const frame = useRef<HTMLDivElement>(null);
  const [grow, setGrow] = useState<DOMRect | null>(null);

  // Al abrir un caso, la miniatura crece aquí mismo hasta pantalla completa y solo
  // entonces se cambia de página (el caso arranca con esa imagen ya a pantalla completa).
  const open = (e: React.MouseEvent) => {
    if (!p.href || !p.thumb || !frame.current) return;
    e.preventDefault();
    router.prefetch(p.href);
    setGrow(frame.current.getBoundingClientRect());
  };
  const landed = () => {
    try {
      sessionStorage.setItem(FLIGHT_KEY, "landed");
    } catch {}
    if (p.href) router.push(p.href);
  };
  // Texto solo en un lado (izquierda, bajo la imagen): número/año, nombre y descripción.
  const body = (
    <>
      {/* A sangre: la imagen se sale del margen hasta el borde (el texto sigue alineado). */}
      <div
        ref={frame}
        className={l.bleed === "right" ? "-mr-4 md:-mr-6" : l.bleed === "left" ? "-ml-4 md:-ml-6" : ""}
      >
        <MaskReveal from={i % 2 ? "right" : "left"} speed={0}>
          <Placeholder
            ratio={l.ratio}
            src={p.thumb}
            label={p.thumb ? p.name : `Miniatura de ${p.name} (pendiente)`}
          />
        </MaskReveal>
      </div>
      <p className={`mt-4 text-[12px] text-[var(--case-muted)] ${mono}`}>
        {String(i + 1).padStart(2, "0")}
        {p.year && ` / ${p.year}`}
      </p>
      <h3 className="mt-1.5 text-[clamp(20px,1.8vw,26px)] font-medium leading-tight tracking-[-0.02em]">{p.name}</h3>
      {p.line && <p className="mt-1 text-[15px] text-[var(--case-muted)]">{p.line}</p>}
    </>
  );
  // La tarjeta entera (número, imagen y textos) se desplaza a su velocidad, como en
  // Yakushev; dentro, la imagen hace su parallax interno en sentido contrario.
  return (
    <Parallax speed={l.speed} className={`col-span-12 ${l.col} ${offset ?? l.offset}`}>
      {/* Portal al body: dentro de la tarjeta (con transform) `fixed` no sería la pantalla. */}
      {grow &&
        p.thumb &&
        createPortal(
        <motion.img
          src={p.thumb}
          alt=""
          className="pointer-events-none fixed left-0 top-0 z-[100] object-cover"
          initial={{ x: grow.left, y: grow.top, width: grow.width, height: grow.height }}
          animate={{ x: 0, y: 0, width: "100vw", height: "100svh" }}
          transition={{ duration: FLIGHT_S, ease: POWER4_INOUT }}
          onAnimationComplete={landed}
        />,
          document.body
        )}
      {p.href ? (
        <Link href={p.href} onClick={open} className="group block">
          {body}
        </Link>
      ) : (
        body
      )}
    </Parallax>
  );
}

export default function HomeView({
  active,
  eyebrow,
  title,
  intro,
  years,
  items,
  more,
}: {
  active: "product" | "games";
  eyebrow: string;
  title: string;
  intro: string;
  years: string;
  items: P[];
  /** Bloque secundario bajo la rejilla (p. ej. «Marca y web» en Product). */
  more?: { eyebrow: string; title: string; items: P[] };
}) {
  return (
    <main
      className="relative min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <SiteNav active={active} />

      <header className={`pt-32 md:pt-44 ${wrap}`}>
        <div className={grid}>
          <FadeIn className="col-span-12 md:col-span-10">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="text-[clamp(40px,6.4vw,104px)] font-medium leading-[1.02] tracking-[-0.04em]">{title}</h1>
          </FadeIn>
        </div>
      </header>

      {/* El primer proyecto pegado al titular con el párrafo abajo a su derecha; después
          las cifras del rango de años y el segundo proyecto; luego la rejilla escalonada. */}
      <section className={`mt-10 md:mt-12 ${wrap}`}>
        <div className={`${grid} gap-y-20 md:gap-y-0`}>
          <Card p={items[0]} i={0} slot={0} offset="" />
          <FadeIn delay={0.15} className="col-span-12 md:col-span-4 md:col-start-9 md:self-end md:pb-14">
            <p className="text-[clamp(16px,1.35vw,18px)] leading-[1.5] text-[var(--case-muted)]">{intro}</p>
          </FadeIn>
          <Parallax speed={120} className="col-span-12 md:col-span-8 md:col-start-1 md:mt-20">
            <FadeIn>
              <p className="text-[clamp(96px,19vw,300px)] font-extrabold leading-[0.8] tracking-[-0.055em]">{years}</p>
            </FadeIn>
          </Parallax>
          {items[1] && <Card p={items[1]} i={1} slot={1} offset="md:mt-24" />}
          {items.slice(2).map((p, k) => (
            <Card key={p.name} p={p} i={k + 2} slot={k + 2} />
          ))}
        </div>
      </section>

      {more && (
        <section className={`mt-40 md:mt-64 ${wrap}`}>
          <div className={grid}>
            <FadeIn className="col-span-12 md:col-span-8">
              <Eyebrow>{more.eyebrow}</Eyebrow>
              <h2 className="text-[clamp(32px,4.4vw,72px)] font-medium leading-[1.04] tracking-[-0.035em]">{more.title}</h2>
            </FadeIn>
          </div>
          <div className={`${grid} gap-y-20 md:gap-y-0`}>
            {more.items.map((p, k) => (
              <Card key={p.name} p={p} i={items.length + k} slot={k + 1} />
            ))}
          </div>
        </section>
      )}

      <footer className={`mt-40 pb-12 md:mt-64 ${wrap}`}>
        <FadeIn>
          <Eyebrow>Contacto</Eyebrow>
          <Link
            href="/maqueta/contacto"
            className="block text-[clamp(56px,11vw,180px)] font-extrabold leading-[0.85] tracking-[-0.055em] transition-opacity hover:opacity-70"
          >
            ¿Hablamos?
          </Link>
        </FadeIn>
      </footer>
    </main>
  );
}
