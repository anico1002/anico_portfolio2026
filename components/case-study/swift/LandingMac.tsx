"use client";

import { useEffect, useRef, useState } from "react";
import { WindowReveal } from "@/components/case-study/primitives";

/* La landing de SwifT dentro de un MacBook (feedback 2026-10-16). La misma apertura de máscara que el resto
   de casos, pero dentro una escena limpia con un portátil minimal dibujado en CSS, para que se entienda que es
   la web y no se confunda con la cabecera a pantalla completa. La pantalla es un vídeo en bucle que baja la
   página entera y vuelve a subir (scroll.mp4, sacado de la captura a toda página), así que al pasar por aquí
   siempre está en movimiento. El scroll del caso no se para. */

export default function LandingMac() {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
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

  return (
    <div ref={box}>
      <WindowReveal>
        <div className="flex h-full w-full items-center justify-center" style={{ background: "radial-gradient(90% 80% at 50% 35%, #f4f3f7 0%, #e4e2ea 70%, #d9d7e0 100%)" }}>
          <div className="w-[88%] max-w-[64rem] md:w-[62%]">
            {/* Pantalla: bisel negro fino, esquinas redondas y notch */}
            <div className="relative rounded-[1.1rem] bg-[#111113] p-[1.2%] shadow-[0_50px_100px_-40px_rgba(30,20,60,0.45)] ring-1 ring-black/20">
              <span className="absolute left-1/2 top-[1.2%] z-10 h-[2.6%] w-[11%] -translate-x-1/2 rounded-b-[0.4rem] bg-[#111113]" />
              <div className="relative overflow-hidden rounded-[0.45rem] bg-white" style={{ aspectRatio: "16 / 10" }}>
                <video
                  ref={vid}
                  src="/maqueta/swift/landing/scroll.mp4"
                  poster="/maqueta/swift/landing/scroll-poster.jpg"
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
            </div>
            {/* Base: una lámina de aluminio fina, más ancha que la pantalla, con la muesca para abrir */}
            <div className="relative mx-[-7%] h-[0.7rem] rounded-b-[1rem] bg-gradient-to-b from-[#e9e9ec] via-[#cfd0d4] to-[#a9aab0] md:h-[1.1rem]">
              <span className="absolute left-1/2 top-0 h-[45%] w-[13%] -translate-x-1/2 rounded-b-[0.5rem] bg-[#bdbec3]" />
            </div>
          </div>
        </div>
      </WindowReveal>
    </div>
  );
}
