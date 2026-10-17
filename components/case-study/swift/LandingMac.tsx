"use client";

import { useEffect, useRef, useState } from "react";
import { WindowReveal } from "@/components/case-study/primitives";
import Img from "@/components/case-study/Img";

/* La landing de SwifT en un MacBook real (2026-10-16). Alberto eligió entre cuatro fotos frontales, neutras y
   claras la «B»: MacBook Air de frente sobre mármol blanco (Unsplash photo-1654555023156, mockups-src/mac-marble).
   El iPhone 8 que salía al lado se borró de la foto (relleno con el mármol): el móvil de esta sección es el iPhone
   plegable de DuoPhone. Misma apertura de máscara que el resto de casos; la landing de escritorio en bucle baja la
   página entera y vuelve a subir. La pantalla va encima con la perspectiva de la foto (matrix3d de sus esquinas).
   La escena se dibuja a tamaño natural (2400×1350) y se escala al marco, centrada en el portátil. */

const STAGE = { w: 2400, h: 1350 };
const SCREENS = [
  {
    src: "/maqueta/swift/landing/scroll.mp4",
    poster: "/maqueta/swift/landing/scroll-poster.jpg",
    w: 1440,
    h: 900,
    m: "matrix3d(0.64895464,0.00085785526,0,-4.6218677e-06,-0.00067662175,0.65968616,0,-1.8566142e-06,0,0,1,0,842.40002,292,0,1)",
  },
];
/** Centro del portátil en la foto (0–1). */
const FOCUS = { x: 0.563, y: 0.5 };

export default function LandingMac() {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
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
    for (const v of vids.current) {
      if (!v) continue;
      if (on) v.play().catch(() => {});
      else v.pause();
    }
  }, [on]);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      // Escritorio: la foto cubre el marco. Móvil (marco alto y estrecho): los dos dispositivos a lo ancho y el
      // blanco del mármol arriba y abajo.
      const narrow = cw < 768;
      // En escritorio, un 20 % menos que «cubrir» (feedback 2026-10-17: el portátil quedaba justo y la punta derecha de
      // la base se perdía en el borde); los bordes de la foto se funden con el fondo del marco, del mismo blanco.
      const k = narrow ? (cw / STAGE.w) * 1.9 : Math.max(cw / STAGE.w, ch / STAGE.h) * 0.8;
      const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
      setT({
        k,
        x: narrow ? clamp(cw / 2 - FOCUS.x * STAGE.w * k, cw - STAGE.w * k, 0) : cw / 2 - FOCUS.x * STAGE.w * k,
        y: ch / 2 - FOCUS.y * STAGE.h * k,
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
        <div ref={frame} className="relative h-full w-full overflow-hidden bg-[#fbfbfb]">
          <div
            className="absolute left-0 top-0 origin-top-left [mask-image:linear-gradient(transparent,#000_10%,#000_90%,transparent)] md:[mask-image:radial-gradient(ellipse_65%_70%_at_56%_50%,#000_70%,transparent_100%)]"
            style={{ width: STAGE.w, height: STAGE.h, transform: `translate(${t.x}px, ${t.y}px) scale(${t.k})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Img src="/maqueta/swift/landing/scene-marble.jpg" alt="" className="absolute inset-0 h-full w-full" />
            {SCREENS.map((s, i) => (
              <div key={s.src} className="absolute left-0 top-0 origin-top-left overflow-hidden bg-white" style={{ width: s.w, height: s.h, transform: s.m }}>
                <video
                  ref={(el) => {
                    vids.current[i] = el;
                  }}
                  src={s.src}
                  poster={s.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            ))}
          </div>
        </div>
      </WindowReveal>
    </div>
  );
}
