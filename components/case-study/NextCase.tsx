"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import RollText from "@/components/case-study/RollText";
import { markLanded, startFlight } from "@/components/case-study/Flight";
import { TLink, go } from "@/components/case-study/Portal";
import { reducedMotion } from "@/lib/maqueta/motion";
import { FadeIn, MaskReveal, Placeholder } from "@/components/case-study/primitives";
import Arrow from "@/components/case-study/Arrow";

/* «Siguiente caso» como cierre del relato (B5), con nuestro propio gesto (2026-10-12; el ticker
   gigante de Metalab se descartó por demasiado copiado). La portada del siguiente caso espera
   en una ventana recortada; al pasar por encima la ventana se abre (máscara) y el nombre hace el
   hover de letras que ruedan del menú. Composición asimétrica:
   texto estrecho a la izquierda, imagen grande a la derecha. Al hacer clic, la portada crece a
   pantalla completa y aterriza en la cabecera del caso siguiente (el vuelo de la home). En
   táctil no hay «pasar por encima»: la ventana se ve ya abierta (`.nc-img` en system.css). */

const mono = "t-tag"; // titulillos: estilo único en app/maqueta/system.css

export default function NextCase({ name, href, thumb }: { name: string; href: string; thumb?: string }) {
  const router = useRouter();
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const open = (e: React.MouseEvent) => {
    if (!thumb || !frame.current || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    // Movimiento reducido (F3): sin vuelo, cambio directo de página.
    if (reducedMotion()) return go(href);
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
            <RollText text={name} />
          </p>
          <p className="mt-6 t-small text-[var(--case-muted)]">
            Ver caso <Arrow />
          </p>
        </FadeIn>
        <div ref={frame} className="m-bleed order-1 col-span-12 md:order-2 md:col-span-7 md:col-start-6">
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
