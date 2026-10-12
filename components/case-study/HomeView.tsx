"use client";

import Link from "next/link";
import { TLink } from "@/components/case-study/Portal";
import SiteNav from "@/components/case-study/SiteNav";
import HomeHero from "@/components/case-study/HomeHero";
import { markLanded, startFlight } from "@/components/case-study/Flight";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Eyebrow,
  FadeIn,
  MaskReveal,
  Parallax,
  Placeholder,
} from "@/components/case-study/primitives";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";

/* Home de una línea de trabajo (Product o Games). Composición de la maqueta del
   2026-10-11: titular, primer proyecto con el párrafo abajo a la derecha, cifras gigantes
   del rango de años y rejilla escalonada asimétrica. Las miniaturas con caso crecen a
   pantalla completa antes de cambiar de página. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css

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

function Card({ p, i, slot, offset, onLeave }: { p: P; i: number; slot: number; offset?: string; onLeave?: () => void }) {
  // `i` numera el proyecto; `slot` es su hueco en la composición.
  const l = layout[slot % layout.length];
  const router = useRouter();
  const frame = useRef<HTMLDivElement>(null);

  // La página del caso se precarga ANTES del clic (al pasar por encima y, en reposo, al
  // montarse la home): si se pidiera en el clic, su respuesta llegaría en mitad del vuelo y
  // React la procesaría entonces, congelando la animación unos instantes.
  useEffect(() => {
    if (!p.href) return;
    const href = p.href;
    const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1200));
    const id = idle(() => router.prefetch(href));
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id as number) : clearTimeout(id as unknown as number));
  }, [p.href, router]);

  // Al abrir un caso, la miniatura crece hasta pantalla completa en la capa del layout
  // (Flight) y solo entonces se cambia de página; el resto de la home se desvanece.
  const open = (e: React.MouseEvent) => {
    if (!p.href || !p.thumb || !frame.current) return;
    e.preventDefault();
    onLeave?.();
    startFlight(p.thumb, frame.current, () => {
      markLanded();
      if (p.href) router.push(p.href, { scroll: true });
    });
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
      <p className={`mt-4 t-label text-[var(--case-muted)] ${mono}`}>
        {String(i + 1).padStart(2, "0")}
        {p.year && ` / ${p.year}`}
      </p>
      <h3 className="mt-1.5 t-lead font-medium">{p.name}</h3>
      {p.line && <p className="mt-1 t-small text-[var(--case-muted)]">{p.line}</p>}
    </>
  );
  // La tarjeta entera (número, imagen y textos) se desplaza a su velocidad, como en
  // Yakushev; dentro, la imagen hace su parallax interno en sentido contrario.
  return (
    <Parallax speed={l.speed} className={`col-span-12 ${l.col} ${offset ?? l.offset}`}>
      {p.href ? (
        <Link href={p.href} onClick={open} onMouseEnter={() => p.href && router.prefetch(p.href)} className="group block">
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
  slides,
  title,
  intro,
  items,
  more,
}: {
  active: "product" | "games";
  /** Pase de imágenes de la cabecera (las mismas que en la entrada partida). */
  slides: readonly string[];
  /** Titular; admite `{a|b|c}` (palabras que cambian) y `*palabras*` (palabras clave). */
  title: string;
  intro: string;
  items: P[];
  /** Bloque secundario bajo la rejilla (p. ej. «Marca y web» en Product). */
  more?: { eyebrow: string; title: string; items: P[] };
}) {
  const [leaving, setLeaving] = useState(false);
  const leave = () => setLeaving(true);
  return (
    <motion.main
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: DUR.base, ease: EASE.inOut }}
      className="relative min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >

      {/* Logo fijo arriba desde el principio; el menú, al pie de la cabecera (sube y se pega arriba). */}
      <SiteNav active={active} parts="logo" />
      <HomeHero title={title} slides={slides} nav={<SiteNav active={active} docked parts="menu" />} />

      {/* El primer proyecto pegado al titular con el párrafo abajo a su derecha; después la
          rejilla escalonada. (Las cifras del rango de años, «19–26», se quitaron el 2026-10-12:
          copiaban mal el contador de Yakushev y ahí no tenían sentido.) */}
      <section className={`mt-24 md:mt-40 ${wrap}`}>
        <div className={`${grid} gap-y-20 md:gap-y-0`}>
          <Card p={items[0]} i={0} slot={0} offset="" onLeave={leave} />
          <FadeIn delay={STAGGER} className="col-span-12 md:col-span-4 md:col-start-9 md:self-end md:pb-14">
            <p className="t-body text-[var(--case-muted)]">{intro}</p>
          </FadeIn>
          {items[1] && <Card p={items[1]} i={1} slot={1} onLeave={leave} />}
          {items.slice(2).map((p, k) => (
            <Card key={p.name} p={p} i={k + 2} slot={k + 2} onLeave={leave} />
          ))}
        </div>
      </section>

      {more && (
        <section className={`mt-40 md:mt-64 ${wrap}`}>
          <div className={grid}>
            <FadeIn className="col-span-12 md:col-span-8">
              <Eyebrow>{more.eyebrow}</Eyebrow>
              <h2 className="t-h2">{more.title}</h2>
            </FadeIn>
          </div>
          <div className={`${grid} gap-y-20 md:gap-y-0`}>
            {more.items.map((p, k) => (
              <Card key={p.name} p={p} i={items.length + k} slot={k + 1} onLeave={leave} />
            ))}
          </div>
        </section>
      )}

      <footer className={`mt-40 pb-12 md:mt-64 ${wrap}`}>
        <FadeIn>
          <Eyebrow>Contacto</Eyebrow>
          <TLink
            href="/maqueta/contacto"
            className="block t-d2 hov hover:opacity-70"
          >
            ¿Hablamos?
          </TLink>
        </FadeIn>
      </footer>
    </motion.main>
  );
}
