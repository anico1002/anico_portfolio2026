"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { markLanded, startFlight } from "@/components/case-study/Flight";
import { TLink } from "@/components/case-study/Portal";
import { MaskReveal, Placeholder } from "@/components/case-study/primitives";

/* «Siguiente caso» como cierre del relato (B5, gesto de Metalab): un ticker gigante que avanza
   sin parar y, encima, la portada del siguiente caso. Al pasar por encima, el ticker se apaga
   a 0,2 y la imagen se asienta de 1,15 a 1. Al hacer clic, la portada crece a pantalla completa
   y aterriza en la cabecera del caso siguiente, con la misma transición que desde la home. */

const mono = "font-[family-name:var(--font-case-mono)] uppercase tracking-[0.08em]";

export default function NextCase({ name, href, thumb }: { name: string; href: string; thumb?: string }) {
  const router = useRouter();
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const open = (e: React.MouseEvent) => {
    if (!thumb || !frame.current || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    startFlight(thumb, frame.current, () => {
      markLanded();
      router.push(href, { scroll: true });
    });
  };

  const phrase = `Siguiente caso • ${name} • `;
  return (
    <TLink href={href} onClick={open} className="group relative block py-10 md:py-16">
      {/* Ticker detrás: 0,8 s por carácter (Metalab), dos copias para el bucle. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <div className="ticker hov flex whitespace-nowrap t-d1 group-hover:opacity-20" style={{ ["--ticker-s" as string]: `${phrase.length * 0.8}s` }}>
          <span className="pr-[0.25em]">{phrase}</span>
          <span className="pr-[0.25em]">{phrase}</span>
        </div>
      </div>
      <div className="relative mx-auto w-[min(76vw,34rem)]">
        <div ref={frame}>
          <MaskReveal from="bottom" speed={0}>
            <div className="hov scale-[1.15] group-hover:scale-100">
              <Placeholder ratio="16/10" src={thumb} label={name} />
            </div>
          </MaskReveal>
        </div>
        <p className={`mt-4 t-label text-[var(--case-muted)] ${mono}`}>
          Siguiente caso · {name} <span aria-hidden>→</span>
        </p>
      </div>
    </TLink>
  );
}
