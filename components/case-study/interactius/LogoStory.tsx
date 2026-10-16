"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { STAGGER } from "@/lib/maqueta/motion";
import { IX, IX_EXPO, mono, serif } from "./tokens";

/* El logotipo de Interactius, ampliado (feedback 2026-10-16: «incidir en el concepto del macrón y en la parte de
   branding»). Todo sale del manual (messages/es.json → concepto y logo; public/concepto y public/logo):
   1. el macrón: el punto de la i se alarga hasta ser la barra (la «ius» del manual, animada);
   2. las versiones de la marca: positiva, negativa, vertical (en el margen) e isotipo («El encuentro»). */

/* «ius» del manual (public/concepto/ius.svg): letras al 10 % y el macrón sólido. */
const IUS = ["M115.16 67.9047C106.042 67.9047 96.9529 65.3649 91.1577 57.9175L98.594 51.6403C102.965 56.4192 108.808 58.7927 115.258 58.7927C119.422 58.7927 125.649 57.729 125.649 52.4241C125.649 48.5631 121.848 47.7246 118.689 47.2312C113.905 46.4822 109.04 45.9387 104.377 44.5858C98.2289 42.5373 94.0849 37.9102 94.0849 31.3587C94.0849 19.1352 105.849 14.9963 116.337 14.9963C124.002 14.9963 131.328 16.3828 137.405 23.8809L129.898 30.085C126.119 25.9652 121.427 24.1083 115.944 24.1083C109.54 24.1083 106.338 26.1006 106.338 30.085C106.338 37.9938 122.562 36.4376 127.609 38.1193C133.798 39.9151 138 44.6819 138 51.1504C138 63.5677 125.755 67.9047 115.16 67.9047Z", "M79.8249 16.2218L79.8249 58.0093L88.6299 58.0093L88.6299 66.775L67.3991 66.775L67.3991 58.0093L66.7252 58.0093C64.1989 64.2698 58.8212 67.9507 52.0863 67.9507C47.1377 67.9507 43.1332 66.2852 40.0728 62.9541C36.9473 59.6884 35.3846 54.9858 35.3846 48.8463L35.3846 16.2218L47.8865 16.2218L47.8865 47.0828C47.8865 54.398 51.0445 58.0556 57.3606 58.0556C62.1479 58.0556 67.3991 55.381 67.3991 50.0219L67.3991 16.2218L79.8249 16.2218Z", "M0 57.9354H8.69768L8.69768 24.9187L0 24.9187L0 16.1758H21.2511L21.2511 57.9354H29.9926V66.7252L0 66.7252L0 57.9354Z"];
/** El punto de la i (sobre el asta, x 8,7–21,25) y el macrón entero (x 0–47,85); alto 8,76. */
const DOT = { x: 8.7, w: 12.55 };
const BAR = { x: 0, w: 47.85 };

function Macron() {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(false);
  const [long, setLong] = useState(false);
  const reduce = useReduce();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || reduce) return;
    // Punto → macrón, pausa, y vuelta a empezar mientras se ve.
    setLong(true);
    const id = window.setInterval(() => setLong((v) => !v), 2600);
    return () => clearInterval(id);
  }, [on, reduce]);
  const r = reduce || long ? BAR : DOT;
  return (
    <svg ref={ref} viewBox="-2 -2 142 72" className="w-full" aria-label="El macrón sobre la ī: el punto de la i alargado">
      {IUS.map((d, k) => (
        <path key={k} d={d} fill={IX.dark} opacity={0.1} />
      ))}
      <motion.rect y={0} height={8.76} fill={IX.dark} initial={false} animate={{ x: r.x, width: r.w }} transition={{ duration: 1.1, ease: IX_EXPO }} />
    </svg>
  );
}

const label = "text-[11px] uppercase tracking-[0.08em]";

function Card({ children, bg, caption, className = "" }: { children: React.ReactNode; bg: string; caption: string; className?: string }) {
  return (
    <figure className={className}>
      <div className="flex h-full items-center justify-center p-10 md:p-16" style={{ background: bg }}>
        {children}
      </div>
      <figcaption className={`mt-3 ${label}`} style={{ ...mono, color: IX.ash }}>
        {caption}
      </figcaption>
    </figure>
  );
}

export default function LogoStory() {
  return (
    <div className="space-y-24 md:space-y-36">
      {/* 1 · El macrón */}
      <div className="grid grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
        <FadeIn className="col-span-12 md:col-span-6">
          <div className="p-8 md:p-16" style={{ background: IX.warmLight }}>
            <Macron />
            <p className="mt-8 max-w-[38ch] text-[12px] leading-[1.7]" style={{ ...mono, color: IX.ash }}>
              /ˈmakron/ Marca escrita o impresa (¯) que indica una vocal larga en algunos idiomas, o una vocal
              acentuada en verso.
            </p>
          </div>
        </FadeIn>
        <div className="col-span-12 space-y-10 md:col-span-4 md:col-start-8">
          <FadeIn delay={STAGGER}>
            <p className={label} style={{ ...mono, color: IX.ash }}>Función fonética</p>
            <p className="mt-3 t-body text-[var(--case-muted)]">
              Interactíus se acentúa en la última i, y quien lee tiende a llevar el peso al centro de la palabra. El
              macrón fija la cadencia correcta: no adorna, regula cómo suena.
            </p>
          </FadeIn>
          <FadeIn delay={2 * STAGGER}>
            <p className={label} style={{ ...mono, color: IX.ash }}>Actitud liminal</p>
            <p className="mt-3 t-body text-[var(--case-muted)]">
              El punto de la i se alarga hasta romper la línea superior de la letra. Ese estiramiento marca la zona de
              transición, el espacio entre, y es el vector que rige cómo se mueve todo en pantalla.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* 2 · Las versiones de la marca */}
      <div className="grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-6">
        <Card bg={IX.warmLight} caption="Versión positiva" className="col-span-12 md:col-span-6 [&>div]:aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/interactius/brand/interactius-positivo.svg" alt="interactīus, versión positiva" className="w-[78%]" />
        </Card>
        <Card bg={IX.dark} caption="Versión negativa" className="col-span-12 md:col-span-6 [&>div]:aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/interactius/brand/interactius-negativo.svg" alt="interactīus, versión negativa" className="w-[78%]" />
        </Card>
        <Card bg={IX.grey} caption="Uso vertical · la marca en el margen" className="col-span-6 md:col-span-3 [&>div]:aspect-[3/4]">
          {/* El logo vertical del manual es el positivo girado: aquí, el SVG girado para que vaya nítido. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/interactius/brand/interactius-positivo.svg" alt="interactīus en vertical" className="w-[170%] max-w-none -rotate-90" />
        </Card>
        <Card bg={IX.warmDark} caption="Isotipo positivo" className="col-span-6 md:col-span-3 [&>div]:aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/interactius/brand/isotipo-positivo.svg" alt="Isotipo positivo" className="w-[62%]" />
        </Card>
        <Card bg={IX.dark} caption="Isotipo negativo" className="col-span-6 md:col-span-3 [&>div]:aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/interactius/brand/isotipo-negativo.svg" alt="Isotipo negativo" className="w-[62%]" />
        </Card>
        <FadeIn className="col-span-6 self-end md:col-span-3">
          <p className="text-[1.5rem] font-light leading-tight md:text-[1.9rem]" style={{ ...serif, color: "var(--case-fg)" }}>
            El isotipo, «el encuentro».
          </p>
          <p className="mt-4 t-small text-[var(--case-muted)]">
            Dos masas que se aproximan y una línea que divide sin separar. Los cuadrados son la presencia mínima en el
            lugar liminal.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
