"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import BlurText from "@/components/case-study/BlurText";
import { markLanded, startFlight } from "@/components/case-study/Flight";
import { TLink } from "@/components/case-study/Portal";
import { FadeIn, MaskReveal, Placeholder } from "@/components/case-study/primitives";

/* «Siguiente caso» como cierre del relato (B5), con nuestro propio gesto (2026-10-12; el ticker
   gigante de Metalab se descartó por demasiado copiado). La portada del siguiente caso espera
   desenfocada y atenuada; al pasar por encima se enfoca, y el nombre hace la ola de desenfoque
   del menú: el mismo desenfoque → foco con el que entran los textos. Composición asimétrica:
   texto estrecho a la izquierda, imagen grande a la derecha. Al hacer clic, la portada crece a
   pantalla completa y aterriza en la cabecera del caso siguiente (el vuelo de la home). En
   táctil no hay «pasar por encima»: la imagen se ve ya enfocada (`.nc-img` en system.css). */

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

  return (
    <TLink href={href} onClick={open} className="group block px-4 md:px-6">
      <div className="grid grid-cols-12 gap-x-4 gap-y-8 md:gap-x-6">
        <FadeIn className="order-2 col-span-12 md:order-1 md:col-span-4 md:self-end">
          <p className={`t-label text-[var(--case-muted)] ${mono}`}>Siguiente caso</p>
          <p className="mt-3 t-statement font-medium">
            <BlurText text={name} />
          </p>
          <p className="mt-6 t-small text-[var(--case-muted)]">
            Ver caso <span aria-hidden>→</span>
          </p>
        </FadeIn>
        <div ref={frame} className="order-1 col-span-12 md:order-2 md:col-span-7 md:col-start-6">
          <MaskReveal from="bottom" speed={0}>
            <div className="nc-img">
              <Placeholder ratio="16/10" src={thumb} label={name} />
            </div>
          </MaskReveal>
        </div>
      </div>
    </TLink>
  );
}
