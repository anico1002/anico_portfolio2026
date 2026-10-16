"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import { STAGGER } from "@/lib/maqueta/motion";
import { IX, IX_EXPO, mono } from "./tokens";

/* El logotipo de Interactius, ampliado (feedback 2026-10-16: «incidir en el concepto del macrón y en la parte de
   branding»). Todo sale del manual (messages/es.json → concepto y logo; public/concepto y public/logo):
   1. el macrón: el punto de la i se alarga hasta ser la barra (la «ius» del manual, animada);
   2. las versiones positiva y negativa, cada una con su isotipo pequeño encima. */

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
    const t0 = window.setTimeout(() => setLong(true), 250);
    const id = window.setInterval(() => setLong((v) => !v), 2600);
    return () => (clearTimeout(t0), clearInterval(id));
  }, [on, reduce]);
  const r = reduce || long ? BAR : DOT;
  return (
    <svg ref={ref} viewBox="-2 -2 142 72" className="w-full" aria-label="The macron over the ī: the dot of the i, stretched">
      {IUS.map((d, k) => (
        <path key={k} d={d} fill={IX.dark} opacity={0.1} />
      ))}
      <motion.rect y={0} height={8.76} fill={IX.dark} initial={false} animate={{ x: r.x, width: r.w }} transition={{ duration: 1.1, ease: IX_EXPO }} />
    </svg>
  );
}

/** Positiva o negativa: el isotipo pequeño arriba (fuera del logo), el logotipo al centro y el rótulo abajo. */
function Version({ tone }: { tone: "positivo" | "negativo" }) {
  const pos = tone === "positivo";
  return (
    <FadeIn className="col-span-12 md:col-span-6">
      <figure className="flex aspect-[16/10] flex-col items-center justify-between p-6 md:p-10" style={{ background: pos ? IX.light : IX.dark }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/maqueta/interactius/brand/isotipo-${tone}.svg`} alt={`Isotipo ${tone}`} className="w-7 md:w-9" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/maqueta/interactius/brand/interactius-${tone}.svg`} alt={`interactīus, ${pos ? "positive" : "negative"} version`} className="w-[78%]" />
        <figcaption className="t-label t-tag" style={{ color: pos ? IX.ash : "rgba(255,255,255,0.6)" }}>
          {pos ? "Positive" : "Negative"} version
        </figcaption>
      </figure>
    </FadeIn>
  );
}

/** Va pegado a la lámina técnica (8 px), y las versiones a 8 px del macrón: es todo el mismo apartado. */
export default function LogoStory() {
  return (
    <div className="space-y-2">
      {/* 1 · El macrón */}
      <div className="grid grid-cols-12 items-start gap-x-2 gap-y-10">
        <FadeIn className="col-span-12 md:col-span-6">
          <div className="p-8 md:p-16" style={{ background: IX.light }}>
            <Macron />
            <p className="mt-8 max-w-[38ch] text-[12px] leading-[1.7]" style={{ ...mono, color: IX.ash }}>
              /ˈmakrɒn/ A written or printed mark (¯) that indicates a long vowel in some languages, or a stressed vowel
              in verse.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={STAGGER} className="col-span-12 md:col-span-4 md:col-start-8 mb-10 md:mb-0 md:self-center">
          <p className="t-label t-tag text-[var(--case-muted)]">Phonetic function</p>
          <p className="mt-3 t-body text-[var(--case-muted)]">
            Interactius is stressed on the last i, but readers tend to put the weight in the middle of the word. The
            macron sets the right cadence: it isn’t decoration, it controls how the name sounds.
          </p>
          <p className="mt-4 t-body text-[var(--case-muted)]">
            The dot of the i stretches until it breaks the letter’s top line. That stretch marks the zone of
            transition, the space in between, and it’s the vector that drives how everything moves on screen.
          </p>
        </FadeIn>
      </div>

      {/* 2 · Versiones positiva y negativa */}
      <div className="grid grid-cols-12 gap-2">
        <Version tone="positivo" />
        <Version tone="negativo" />
      </div>
    </div>
  );
}
