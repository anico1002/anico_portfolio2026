"use client";

import AboutBlock from "@/components/case-study/AboutBlock";
import { takeHash } from "@/components/case-study/Portal";
import { scrollToId } from "@/components/case-study/SmoothScroll";
import Link from "next/link";
import SiteNav from "@/components/case-study/SiteNav";
import HomeHero from "@/components/case-study/HomeHero";
import RollText from "@/components/case-study/RollText";
import CursorLabel from "@/components/case-study/CursorLabel";
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
import { DUR, EASE, STAGGER, reducedMotion } from "@/lib/maqueta/motion";
import { go } from "@/components/case-study/Portal";
import Lines from "@/components/case-study/Lines";
import SiteFooter from "@/components/case-study/SiteFooter";

/* Home de una línea de trabajo (Product o Games). Composición de la maqueta del
   2026-10-11: titular, primer proyecto con el párrafo abajo a la derecha, cifras gigantes
   del rango de años y rejilla escalonada asimétrica. Las miniaturas con caso crecen a
   pantalla completa antes de cambiar de página. */

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "t-tag"; // titulillos: estilo único en app/new/system.css

export type P = { name: string; line: string; type: string; year: string; thumb?: string; href?: string; slot?: number }; // type: para filtros futuros; slot: forzar un hueco de la composición

// Ritmo de Yakushev (2026-10-12): mucho aire entre proyectos, casi uno por pantalla.
// Solo a veces coinciden dos, y entonces uno es pequeño y se mueve mucho más rápido con
// el scroll (slots 2 + 3 comparten fila). Se repite cada 6 proyectos.
// Todo lo que toca un lado de la rejilla llega al borde de la pantalla (2026-10-17); solo los centrados quedan dentro.
const layout: { col: string; ratio: string; offset: string; speed: number; bleed?: "left" | "right" }[] = [
  { col: "md:col-start-1 md:col-span-8", ratio: "4/3", offset: "md:mt-[40vh]", speed: 60, bleed: "left" },
  // A sangre por la derecha: la imagen llega al borde de la pantalla.
  { col: "md:col-start-5 md:col-span-8", ratio: "16/10", offset: "md:mt-[40vh]", speed: 80, bleed: "right" },
  // Pareja: la pequeña y rápida a la izquierda…
  { col: "md:col-start-1 md:col-span-3", ratio: "3/4", offset: "md:mt-[55vh]", speed: 300, bleed: "left" },
  // …y la grande y lenta a la derecha, en la misma fila.
  { col: "md:col-start-6 md:col-span-7", ratio: "1/1", offset: "md:mt-[30vh]", speed: 60, bleed: "right" },
  { col: "md:col-start-3 md:col-span-8", ratio: "16/10", offset: "md:mt-[40vh]", speed: 50 },
  // A sangre por la izquierda.
  { col: "md:col-start-1 md:col-span-7", ratio: "4/3", offset: "md:mt-[40vh]", speed: 90, bleed: "left" },
];

function Card({ p, i, slot, offset, onLeave }: { p: P; i: number; slot: number; offset?: string; onLeave?: () => void }) {
  // `i` numera el proyecto; `slot` es su hueco en la composición.
  const l = layout[(p.slot ?? slot) % layout.length];
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
    // Movimiento reducido (F3): sin vuelo, cambio directo de página.
    if (reducedMotion()) return go(p.href);
    onLeave?.();
    startFlight(p.thumb, frame.current, () => {
      markLanded();
      if (p.href) router.push(p.href, { scroll: true });
    });
  };
  // Texto dentro de la miniatura (2026-10-12): el año arriba a la izquierda y el nombre con su línea
  // abajo a la izquierda. Sobre imagen va en blanco con un degradado oscuro suave arriba y abajo; sin
  // imagen (fondo gris de pendiente), en el color del tema.
  const onImage = !!p.thumb;
  const [rw, rh] = l.ratio.split("/").map(Number);
  const horizontal = rw > rh;
  const body = (
    <>
      {/* A sangre: la imagen se sale del margen hasta el borde (el texto sigue alineado). */}
      <div
        ref={frame}
        // En móvil, las horizontales de borde a borde (`m-bleed`); en escritorio, el sangrado del hueco.
        className={`relative ${horizontal ? "m-bleed" : ""} ${l.bleed === "right" ? "md:-mr-6" : l.bleed === "left" ? "md:-ml-6" : ""}`}
      >
        <MaskReveal from={l.bleed ?? (i % 2 ? "right" : "left")} speed={0}>{/* nace del borde al que está pegada */}
          {p.thumb ? (
            <div className="relative">
              {/* Hover (C1): la imagen se acerca despacio dentro del marco. */}
              <div className="card-zoom">
                <Placeholder ratio={l.ratio} src={p.thumb} label={p.name} />
              </div>
              {/* Degradado dentro de la máscara: se descubre a la vez que la imagen. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.35), transparent 22%, transparent 62%, rgba(0,0,0,.5))" }}
              />
              {/* Esquina de abajo a la izquierda, donde va el nombre (2026-10-17): en las miniaturas claras (SwifT, en
                  blanco) el texto blanco no se leía. En todas, para no tener que marcar cuáles son claras: en las
                  oscuras apenas se nota. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 75% 60% at 0% 100%, rgba(0,0,0,.6), rgba(0,0,0,.25) 50%, transparent 80%)" }}
              />
              {/* Y al pasar por encima el pie se oscurece un poco más, para que el texto respire. */}
              <div
                aria-hidden
                className="card-shade pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,.35))" }}
              />
            </div>
          ) : (
            <div className="w-full bg-[var(--case-ph)]" style={{ aspectRatio: l.ratio }} />
          )}
        </MaskReveal>
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col justify-between p-4 md:p-6 ${onImage ? "text-white [text-shadow:0_1px_14px_rgba(0,0,0,.45)]" : "text-[var(--case-fg)]"}`}
        >
          <FadeIn delay={0.3} margin="0px">
            {p.year && <p className={`t-label ${mono} ${onImage ? "opacity-80" : "text-[var(--case-muted)]"}`}>{p.year}</p>}
          </FadeIn>
          <FadeIn delay={0.4} margin="0px">
            <h3 className="t-lead font-medium">{p.href ? <RollText text={p.name} /> : p.name}</h3>
            {p.line && <p className={`mt-1 t-small ${onImage ? "opacity-80" : "text-[var(--case-muted)]"}`}>{p.line}</p>}
          </FadeIn>
        </div>
        {/* «Ver caso» que sigue al ratón (C2), solo en tarjetas con caso. */}
        {p.href && <CursorLabel />}
      </div>
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
  reel,
  title,
  intro,
  items,
  more,
}: {
  active: "product" | "games";
  /** Pase de imágenes de la cabecera (las mismas que en la entrada partida). */
  slides: readonly string[];
  /** Vídeo de fondo fijo en lugar del pase (Product: el reel de motion). */
  reel?: string;
  /** Titular; admite `{a|b|c}` (palabras que cambian) y `*palabras*` (palabras clave). */
  title: string;
  intro: string;
  items: P[];
  /** Bloque secundario bajo la rejilla (p. ej. «Marca y web» en Product). */
  more?: { eyebrow: string; title: string; items: P[] };
}) {
  const [leaving, setLeaving] = useState(false);
  // Llegando desde otra página por «About»: baja al bloque en cuanto la página está montada.
  useEffect(() => {
    const h = takeHash() ?? (window.location.hash ? window.location.hash.slice(1) : null);
    if (h) requestAnimationFrame(() => scrollToId(h, true));
  }, []);
  const leave = () => setLeaving(true);
  return (
    <motion.main
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: DUR.base, ease: EASE.inOut }}
      className="relative min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >

      {/* Logo fijo arriba desde el principio; el menú, al pie de la cabecera (sube y se pega arriba). */}
      <SiteNav active={active} parts="logo" />
      <HomeHero title={title} slides={slides} reel={reel} alt={active === "games" ? "tech" : "serif"} nav={<SiteNav active={active} docked parts="menu" />} />

      {/* Los proyectos: el primero y después la rejilla escalonada. (Las cifras del rango de años, «19–26», se quitaron el 2026-10-12:
          copiaban mal el contador de Yakushev y ahí no tenían sentido.) */}
      {/* Intro de la sección como frase destacada, casi sola en pantalla (2026-10-12; antes iba pequeña y
          en gris junto a la primera miniatura). Mismo tratamiento y posición en la rejilla que las frases
          de los casos (p. ej. «Validar cada decisión…» en Gloop), t-statement, en las columnas 3–10: centrada
          en pantalla (2 columnas libres a cada lado). */}
      <section className={`pt-36 md:pt-56 ${wrap}`}>
        <div className={grid}>
          <Lines className="col-span-12 t-statement md:col-span-8 md:col-start-3">{intro}</Lines>
        </div>
      </section>

      <section className={`mt-36 md:mt-56 ${wrap}`}>
        <div className={`${grid} gap-y-20 md:gap-y-0`}>
          <Card p={items[0]} i={0} slot={0} offset="" onLeave={leave} />
          {items[1] && <Card p={items[1]} i={1} slot={1} onLeave={leave} />}
          {items.slice(2).map((p, k) => (
            <Card key={p.name} p={p} i={k + 2} slot={k + 2} onLeave={leave} />
          ))}
        </div>
      </section>

      {more && (
        <section className={`mt-40 md:mt-64 ${wrap}`}>
          <div className={grid}>
            <div className="col-span-12 md:col-span-8">
              <FadeIn>
                <Eyebrow>{more.eyebrow}</Eyebrow>
              </FadeIn>
              <Lines as="h2" className="t-h2" delay={STAGGER}>
                {more.title}
              </Lines>
            </div>
          </div>
          <div className={`${grid} gap-y-20 md:gap-y-0`}>
            {more.items.map((p, k) => (
              <Card key={p.name} p={p} i={items.length + k} slot={k + 1} onLeave={leave} />
            ))}
          </div>
        </section>
      )}

      <AboutBlock />

      <SiteFooter />
    </motion.main>
  );
}
