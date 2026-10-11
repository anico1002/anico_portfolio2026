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

/* Maqueta de la home de Product. Miniaturas reales de public/projects; los casos nuevos
   aún sin miniatura van con placeholder. Gloop enlaza a su caso (/maqueta/gloop): su
   miniatura es la misma imagen que la portada del caso. Textos en castellano (borrador). */

const theme = {
  "--case-bg": "#0A0A0B",
  "--case-fg": "#F4F4F5",
  "--case-muted": "rgba(244,244,245,0.55)",
  "--case-line": "rgba(244,244,245,0.16)",
  "--case-ph": "rgba(244,244,245,0.07)",
} as React.CSSProperties;

const wrap = "px-4 md:px-6";
const grid = "grid grid-cols-12 gap-x-4 md:gap-x-6";
const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";

type P = { name: string; line: string; type: string; year: string; thumb?: string; href?: string }; // type: para filtros futuros

const projects: P[] = [
  { name: "Gloop", line: "App social para grupos de amigos", type: "iOS nativo", year: "2026", thumb: "/maqueta/gloop/cover.jpg", href: "/maqueta/gloop" },
  { name: "El Reto MasterChef", line: "La experiencia MasterChef llevada al móvil", type: "App iOS y Android", year: "2025", thumb: "/projects/elreto-masterchef/ElReto_thumb.png" },
  { name: "SwifT Translator", line: "Traductor para la barra de menús de macOS", type: "App macOS", year: "2026", thumb: "/projects/swift-project/SwifT_thumb.png" },
  { name: "7News", line: "", type: "App", year: "2026" },
  { name: "Dovla", line: "", type: "App", year: "2026" },
  { name: "Interactius", line: "", type: "Producto", year: "2026" },
  { name: "WineUp", line: "", type: "App", year: "" },
  { name: "Netflix App", line: "Rediseño de interacciones", type: "App · concepto", year: "2019", thumb: "/projects/netflix-app/Netflix_thumb.png" },
  { name: "Nike Shop", line: "Rediseño de la tienda", type: "App · concepto", year: "2019", thumb: "/projects/nike-shop/Nike_thumb.png" },
  { name: "Hawkers", line: "Rediseño de la app", type: "App", year: "2019", thumb: "/projects/hawkers/Hawkers_thumb.png" },
];

// Composición escalonada que se repite: posición en la rejilla, proporción, desfase
// vertical y velocidad de parallax distintos en cada tarjeta.
const layout: { col: string; ratio: string; offset: string; speed: number; bleed?: "left" | "right" }[] = [
  { col: "md:col-start-1 md:col-span-7", ratio: "4/3", offset: "", speed: 70 },
  { col: "md:col-start-9 md:col-span-4", ratio: "3/4", offset: "md:mt-48", speed: 170 },
  { col: "md:col-start-3 md:col-span-5", ratio: "1/1", offset: "md:mt-24", speed: 110 },
  // A sangre por la derecha: la imagen llega al borde de la pantalla.
  { col: "md:col-start-8 md:col-span-5", ratio: "4/3", offset: "md:mt-64", speed: 60, bleed: "right" },
  // A sangre por la izquierda.
  { col: "md:col-start-1 md:col-span-4", ratio: "3/4", offset: "md:mt-16", speed: 150, bleed: "left" },
  { col: "md:col-start-6 md:col-span-7", ratio: "16/10", offset: "md:mt-40", speed: 90 },
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

export default function ProductHome() {
  return (
    <main
      style={theme}
      className="relative min-h-screen bg-[var(--case-bg)] font-[family-name:var(--font-case-sans)] text-[var(--case-fg)] antialiased"
    >
      <SiteNav />

      {/* Entrada: declaración grande + cifras gigantes del rango de años (gesto Yakushev) */}
      <header className={`pt-32 md:pt-44 ${wrap}`}>
        <div className={grid}>
          <FadeIn className="col-span-12 md:col-span-10">
            <Eyebrow>Alberto Nicolás · Product Designer</Eyebrow>
            <h1 className="text-[clamp(40px,6.4vw,104px)] font-medium leading-[1.02] tracking-[-0.04em]">
              Diseño productos digitales de la idea al código nativo.
            </h1>
          </FadeIn>
        </div>
      </header>

      {/* El primer proyecto pegado al titular (a la izquierda) con el párrafo abajo a su
          derecha; después, las cifras bajo el primero y el segundo proyecto a la derecha; las cifras del rango de años, debajo del primero. Luego sigue la
          rejilla escalonada. */}
      <section className={`mt-10 md:mt-12 ${wrap}`}>
        <div className={`${grid} gap-y-20 md:gap-y-0`}>
          <Card p={projects[0]} i={0} slot={0} />
          {/* Primera pantalla: solo el primer proyecto y, abajo a la derecha (alineado con su
              base), el párrafo. El segundo proyecto entra ya con el scroll. */}
          <FadeIn delay={0.15} className="col-span-12 md:col-span-4 md:col-start-9 md:self-end md:pb-14">
            <p className="text-[clamp(16px,1.35vw,18px)] leading-[1.5] text-[var(--case-muted)]">
              Más de 25 años diseñando interfaces, ahora con la IA como herramienta de
              construcción. Estrategia, UX/UI, sistemas y prototipos que se pueden tocar.
            </p>
          </FadeIn>
          <Parallax speed={120} className="col-span-12 md:col-span-8 md:col-start-1 md:mt-20">
            <FadeIn>
              <p className="text-[clamp(96px,19vw,300px)] font-extrabold leading-[0.8] tracking-[-0.055em]">
                19–26
              </p>
            </FadeIn>
          </Parallax>
          <Card p={projects[1]} i={1} slot={1} offset="md:mt-24" />
          {projects.slice(2).map((p, k) => (
            <Card key={p.name} p={p} i={k + 2} slot={k + 2} />
          ))}
        </div>
      </section>

      <footer className={`mt-40 pb-12 md:mt-64 ${wrap}`}>
        <FadeIn>
          <Eyebrow>Contacto</Eyebrow>
          <p className="text-[clamp(56px,11vw,180px)] font-extrabold leading-[0.85] tracking-[-0.055em]">
            ¿Hablamos?
          </p>
        </FadeIn>
      </footer>
    </main>
  );
}
