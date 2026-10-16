"use client";

import { useEffect, useRef } from "react";
import { FadeIn } from "@/components/case-study/primitives";

/* La landing de SwifT en el iPhone plegable (2026-10-16, mockup de Pixeden que tenía Alberto). Escena con fondo
   claro sacada del PSD con su Photoshop por script, y la web a 1112 px (la proporción de la pantalla) encajada
   con su perspectiva, máscara de esquinas redondas y el brillo del cristal encima: scripts/mockups/duo_video.py.
   El vídeo baja la página entera y vuelve a subir; solo se reproduce mientras se ve. */

export default function DuoPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    const v = vid.current;
    if (!el || !v) return;
    const io = new IntersectionObserver((es) => (es.some((e) => e.isIntersecting) ? v.play().catch(() => {}) : v.pause()), { rootMargin: "10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="grid grid-cols-12 items-end gap-x-4 gap-y-6 px-4 md:gap-x-6 md:px-6">
      <FadeIn className="col-span-12 md:col-span-3 md:pb-10">
        <p className="t-body text-[var(--case-muted)]">Y en el móvil, la misma página: se recompone sola y se lee igual de bien.</p>
      </FadeIn>
      <div ref={ref} className="m-bleed col-span-12 overflow-hidden md:col-span-8 md:col-start-5" style={{ aspectRatio: "1600 / 1108" }}>
        <video
          ref={vid}
          src="/maqueta/swift/landing/duo.mp4"
          poster="/maqueta/swift/landing/duo-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
