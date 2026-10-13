"use client";

import LazyVideo from "@/components/case-study/LazyVideo";
import Lines from "@/components/case-study/Lines";
import { FadeIn, Parallax } from "@/components/case-study/primitives";
import { STAGGER } from "@/lib/maqueta/motion";
import { G } from "./tokens";

/* El UI kit de Gloop (2026-10-13: «una parte importante es el UI kit… hay demasiado móvil»). El kit
   web real (gloop-app.vercel.app/UI-kit) recorrido fotograma a fotograma y montado en vídeo
   (public/maqueta/gloop/media/kit.mp4, sin versionar), dentro de un portátil dibujado en CSS sobre
   los brillos de la marca. */

function Laptop({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[64rem]">
      {/* Pantalla con su marco */}
      <div className="rounded-t-[1.4rem] bg-[#0d0d0f] p-[1.6%] pb-[2.2%] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[0.4rem] bg-black" style={{ aspectRatio: "16 / 10" }}>
          {children}
        </div>
      </div>
      {/* Base */}
      <div className="relative mx-[-6%] h-[1.1rem] rounded-b-[1.2rem] bg-gradient-to-b from-[#c9cbd0] to-[#8e9096] md:h-[1.5rem]">
        <span className="absolute left-1/2 top-0 h-[40%] w-[14%] -translate-x-1/2 rounded-b-[0.6rem] bg-[#a5a7ad]" />
      </div>
    </div>
  );
}

export default function KitLaptop() {
  return (
    <section className="relative mt-36 overflow-hidden py-28 md:mt-56 md:py-40" style={{ background: G.base }}>
      <span aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[36rem] w-[36rem] rounded-full opacity-50 blur-[120px]" style={{ background: G.brandDeep }} />
      <span aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full opacity-30 blur-[120px]" style={{ background: G.accent }} />
      <div className="relative grid grid-cols-12 gap-x-4 px-4 text-white md:gap-x-6 md:px-6">
        <div className="col-span-12 md:col-span-6">
          <FadeIn>
            <p className="t-label t-tag text-white/60">06 · El UI kit</p>
          </FadeIn>
          <Lines as="h2" className="mt-4 t-statement" delay={STAGGER}>
            Un sistema que se lee, se copia y se pega en el código.
          </Lines>
        </div>
        <FadeIn delay={2 * STAGGER} className="col-span-12 mt-6 md:col-span-4 md:col-start-8 md:mt-24">
          <p className="t-body text-white/70">
            Fundamentos, componentes y patrones con su código en Swift y Kotlin, listo para copiar. Y el sistema
            entero en un solo Markdown preparado para IA: se pega en Cursor o en Claude y basta con pedir
            «rediseña esta pantalla con el sistema de Gloop».
          </p>
        </FadeIn>
      </div>
      <div className="relative mt-16 px-4 md:mt-24 md:px-16">
        <Parallax speed={80}>
          <Laptop>
            <LazyVideo className="absolute inset-0 h-full w-full object-cover" src="/maqueta/gloop/media/kit.mp4" poster="/maqueta/gloop/media/kit-poster.jpg" aria-label="Recorrido por el UI kit de Gloop" />
          </Laptop>
        </Parallax>
      </div>
      <div className="relative mt-16 grid grid-cols-12 gap-x-4 px-4 text-white md:mt-24 md:gap-x-6 md:px-6">
        {[
          ["Fundamentos", "Logo, color, tipografía, espaciado, radios, imagen, cristal y movimiento."],
          ["Componentes", "Botones, chips, campos, tarjetas, barra de pestañas iOS y Material 3, avatares…"],
          ["Para el equipo", "Tokens en JSON, Swift y Kotlin, y el prototipo en vivo con su QR."],
        ].map(([t, d], k) => (
          <FadeIn key={t} delay={k * STAGGER} className={`col-span-12 mt-8 md:col-span-3 md:mt-0 ${k === 0 ? "md:col-start-2" : ""} ${k === 2 ? "md:col-start-9" : ""}`}>
            <p className="t-label t-tag text-white/50">0{k + 1}</p>
            <p className="mt-2 t-lead">{t}</p>
            <p className="mt-2 t-small text-white/60">{d}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
