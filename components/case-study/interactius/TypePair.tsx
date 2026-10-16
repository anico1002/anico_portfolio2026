"use client";

import { FadeIn } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { IX, mono, serif } from "./tokens";

/* Las dos tipografías de Interactius, con el porqué del manual (messages/es.json → tipografia, y
   universoVisual: «precisión técnica conviviendo con la sensibilidad artística»). IBM Plex Mono es la de
   marca y la base del logotipo (Regular y Semibold); IBM Plex Serif, la de contraste para titulares
   (Light y Regular). Ninguna lleva cursiva. Las dos son abiertas: cualquier herramienta, y cualquier IA,
   puede usarlas sin licencias de por medio. */

const FACES = [
  {
    role: "Marca",
    name: "IBM Plex Mono",
    style: mono,
    weights: [
      ["Regular", 400],
      ["Semibold", 600],
    ] as const,
    sample: "Strategic thinking",
    why: "Precision and technical character. It’s the logotype’s typeface and gives the brand its methodical rigor.",
  },
  {
    role: "Contraste",
    name: "IBM Plex Serif",
    style: serif,
    weights: [
      ["Light", 300],
      ["Regular", 400],
    ] as const,
    sample: "Liminal attitude",
    why: "A humanist, sophisticated dimension for headlines and highlights.",
  },
];

export default function TypePair() {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-4 md:gap-x-6">
      {FACES.map((f, k) => (
        <FadeIn key={f.name} delay={k * STAGGER} className="col-span-12 md:col-span-6">
          <div className="flex h-full flex-col justify-between p-6 md:min-h-[34rem] md:p-10" style={{ background: k ? IX.grey : IX.light, color: IX.dark }}>
            <div className="t-label t-tag flex items-baseline justify-between" style={{ color: IX.ash }}>
              <span>{f.role}</span>
              <span>{f.name}</span>
            </div>
            <p className="my-10 text-[7rem] leading-none md:my-0 md:text-[11rem]" style={{ ...f.style, fontWeight: f.weights[0][1] }}>
              Aa
            </p>
            <div>
              {f.weights.map(([w, n]) => (
                <p key={w} className="border-t py-3 text-[1.35rem] leading-tight md:text-[1.7rem]" style={{ ...f.style, fontWeight: n, borderColor: "rgba(10,10,10,0.12)" }}>
                  {f.sample}
                  <span className="t-label t-tag ml-3 align-middle font-[family-name:var(--font-case-sans)]" style={{ fontWeight: 400, color: IX.ash }}>
                    {w} {n}
                  </span>
                </p>
              ))}
              <p className="mt-6 max-w-[34ch] t-small" style={{ color: IX.ashDark }}>
                {f.why}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
