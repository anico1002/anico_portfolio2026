"use client";

import { useEffect, useRef, useState } from "react";
import { WindowReveal } from "@/components/case-study/primitives";

/* La landing de SwifT dentro de un MacBook real (feedback 2026-10-16). Misma apertura de máscara que el resto
   de casos; dentro, foto de Unsplash de un MacBook Air en la mano sobre gris liso (photo-1625766763788,
   mockups-src/mac-hand), pasada a monocromo frío para que solo la pantalla tenga color. La web va encima con
   la perspectiva exacta de la foto (matrix3d sacado de las cuatro esquinas medidas de la pantalla) y es un vídeo
   en bucle que baja la página entera y vuelve a subir (scroll.mp4), así que siempre está en movimiento.
   La escena se dibuja a tamaño natural (2400×1600) y se escala para cubrir el marco, centrada en el portátil. */

const STAGE = { w: 2400, h: 1600 };
const SCREEN = { w: 1440, h: 900 };
const MATRIX =
  "matrix3d(0.86245067,0.12015857,0,0.0002017045,-0.012313774,0.77332063,0,-3.594118e-06,0,0,1,0,714.40002,293.60001,0,1)";
/** Centro del portátil en la foto (0–1). */
const FOCUS = { x: 0.56, y: 0.46 };

export default function LandingMac() {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const [t, setT] = useState({ k: 0.5, x: 0, y: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (on) v.play().catch(() => {});
    else v.pause();
  }, [on]);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      // Escritorio: la foto cubre el marco. Móvil (marco alto y estrecho): se ajusta al ancho con el portátil
      // casi a sangre, y arriba y abajo se funde con el gris de la foto.
      const narrow = cw < 768;
      const k = narrow ? (cw / STAGE.w) * 1.6 : Math.max(cw / STAGE.w, ch / STAGE.h);
      const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
      setT({
        k,
        x: clamp(cw / 2 - FOCUS.x * STAGE.w * k, cw - STAGE.w * k, 0),
        y: narrow ? ch / 2 - FOCUS.y * STAGE.h * k : clamp(ch / 2 - FOCUS.y * STAGE.h * k, ch - STAGE.h * k, 0),
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box}>
      <WindowReveal>
        <div ref={frame} className="relative h-full w-full overflow-hidden bg-[#b5b4ba]">
          <div
            className="absolute left-0 top-0 origin-top-left [mask-image:linear-gradient(transparent,#000_12%,#000_88%,transparent)] md:[mask-image:none]"
            style={{ width: STAGE.w, height: STAGE.h, transform: `translate(${t.x}px, ${t.y}px) scale(${t.k})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/maqueta/swift/landing/scene-mac.jpg" alt="" className="absolute inset-0 h-full w-full" />
            <div className="absolute left-0 top-0 origin-top-left overflow-hidden bg-white" style={{ width: SCREEN.w, height: SCREEN.h, transform: MATRIX }}>
              <video
                ref={vid}
                src="/maqueta/swift/landing/scroll.mp4"
                poster="/maqueta/swift/landing/scroll-poster.jpg"
                muted
                loop
                playsInline
                preload="none"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </WindowReveal>
    </div>
  );
}
