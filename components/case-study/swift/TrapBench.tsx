"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { FadeIn, useSeen } from "@/components/case-study/primitives";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";

/* Frases trampa (SwifT): el motor se eligió con un banco de 21 frases trampa (design/EVAL_TRAP_BANK.md del
   repo), no por impresiones. Cuatro ejemplos limpios del banco —su origen, la trampa que caza (tal como la
   describe el banco) y la traducción buena— y el resultado: TranslateGemma 15 · Apple 11 · Google 10. */

const V = "#7c3aed";

const TRAPS = [
  { kind: "Modismo", from: "EN → ES", src: "It's raining cats and dogs.", trap: "Traducirlo palabra por palabra: «gatos y perros».", gold: "Está lloviendo a cántaros." },
  { kind: "Pregunta", from: "EN → ES", src: "I'm swamped this week, can we push it to Monday?", trap: "Contestar en vez de traducir: «Entiendo, puedo moverlo…».", gold: "Estoy hasta arriba esta semana, ¿lo podemos dejar para el lunes?" },
  { kind: "Cifras", from: "EN → ES", src: "The budget is €1,500.50.", trap: "Cambiar la cantidad al darle la vuelta al formato.", gold: "El presupuesto es de 1.500,50 €." },
  { kind: "Ironía", from: "EN → ES", src: "Oh great, another meeting. Just what I needed.", trap: "Quitarle el sarcasmo.", gold: "Ah, genial, otra reunión. Justo lo que necesitaba." },
];

const SCORES = [
  { name: "TranslateGemma 4B", n: 15, note: "en el Mac, sin internet" },
  { name: "Apple Translation", n: 11, note: "en el Mac" },
  { name: "Google Translate", n: 10, note: "en la nube" },
];

function Bars() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "-10% 0px");
  return (
    <div ref={ref} className="space-y-6">
      {SCORES.map((s, k) => (
        <div key={s.name}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="t-small font-medium">
              {s.name} <span className="text-[var(--case-muted)]">· {s.note}</span>
            </p>
            <p className="t-small tabular-nums">
              {s.n}
              <span className="text-[var(--case-muted)]">/21</span>
            </p>
          </div>
          <div className="mt-2 h-2 w-full bg-[var(--case-ph)]">
            <motion.div
              className="h-full"
              style={{ background: k === 0 ? V : "var(--case-muted)", originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: seen ? s.n / 21 : 0 }}
              transition={{ duration: DUR.slow, ease: EASE.inOut, delay: k * STAGGER }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrapBench() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-x-4 gap-y-8 md:gap-x-6">
        {TRAPS.map((t, k) => (
          <FadeIn key={t.kind} delay={(k % 2) * STAGGER} className={`col-span-12 md:col-span-5 ${k % 2 ? "md:col-start-7 md:mt-24" : "md:col-start-1"}`}>
            <article className="border-t border-[var(--case-line)] pt-5">
              <p className="t-label t-tag text-[var(--case-muted)]">
                {t.kind} · {t.from}
              </p>
              <p className="mt-4 t-lead">«{t.src}»</p>
              <p className="mt-4 t-small text-[var(--case-muted)]">
                <span className="mr-2 inline-block text-[#e5484d]">✕</span>
                {t.trap}
              </p>
              <p className="mt-2 t-body">
                <span className="mr-2 inline-block" style={{ color: V }}>✓</span>
                {t.gold}
              </p>
            </article>
          </FadeIn>
        ))}
      </div>
      <div className="mt-24 grid grid-cols-12 gap-x-4 md:mt-32 md:gap-x-6">
        <div className="col-span-12 md:col-span-6 md:col-start-4">
          <p className="mb-8 t-label t-tag text-[var(--case-muted)]">Banco de 21 frases trampa · aciertos</p>
          <Bars />
        </div>
      </div>
    </div>
  );
}
