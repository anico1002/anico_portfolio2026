"use client";

import { useEffect, useRef } from "react";

/* Vídeo gestionado (F2, 2026-10-13). Antes todos los vídeos arrancaban al cargar la página, aunque
   estuvieran a varias pantallas (Gloop tenía unos diez a la vez). Ahora:
   - no se descarga nada hasta que el vídeo está a menos de un cuarto de pantalla;
   - se reproduce solo mientras se ve y se pausa al salir (ahorra procesador y batería, y deja el
     hilo libre para que el scroll y las máscaras vayan finos).
   El `src` está desde el principio (con `preload="none"`), así el vuelo home → caso puede leer y
   fijar el fotograma exacto (Flight / endFlight) igual que antes. */

export default function LazyVideo({ className = "", ...rest }: React.VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Cerca: empezar a cargar.
    const near = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          v.preload = "auto";
          near.disconnect();
        }
      },
      { rootMargin: "25% 0px" }
    );
    // A la vista: reproducir; fuera: pausar.
    const seen = new IntersectionObserver((es) => {
      const on = es.some((e) => e.isIntersecting);
      if (on) v.play().catch(() => {});
      else v.pause();
    });
    near.observe(v);
    seen.observe(v);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);
  return <video ref={ref} className={className} preload="none" muted loop playsInline {...rest} />;
}
