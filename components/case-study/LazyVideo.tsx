"use client";

import { useEffect, useRef } from "react";
import { isFlying } from "@/components/case-study/Flight";
import videoOpt from "@/lib/maqueta/video-opt.json";

/* Vídeo gestionado (F2, 2026-10-13). Antes todos los vídeos arrancaban al cargar la página, aunque
   estuvieran a varias pantallas (Gloop tenía unos diez a la vez). Ahora:
   - no se descarga nada hasta que el vídeo está a menos de un cuarto de pantalla;
   - se reproduce solo mientras se ve y se pausa al salir (ahorra procesador y batería, y deja el
     hilo libre para que el scroll y las máscaras vayan finos).
   El `src` está desde el principio (con `preload="none"`), así el vuelo home → caso puede leer y
   fijar el fotograma exacto (Flight / endFlight) igual que antes.

   En móvil con poca red (2026-10-17, medido en un iPhone emulado con 4G):
   - cada vídeo lleva su póster (`<vídeo>-poster.jpg`, el primer fotograma; lo genera scripts/media-opt) y lo pone al
     acercarse, igual que el vídeo: sin él, mientras el vídeo no llega se ve un hueco;
   - la portada del caso (el vídeo visible de `[data-case-hero] [data-poster]`, sobre el que aterriza el vuelo) va
     primero: el resto de vídeos, el de la cabecera incluido, esperan a que pueda arrancar (tope 3 s). Antes se
     descargaban todos los de arriba a la vez y la portada llegaba la última. */

export const posterOf = (src: string) => src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg");

/* Versión justa de cada vídeo grande (auditoría 2026-10-19; las genera scripts/media-opt/videos.mjs): como un srcset,
   pero decidido al cargar, con el tamaño real del vídeo en pantalla.
   - `port`: recorte vertical del centro, sin reescalar. Para cajas altas y estrechas con object-cover centrado (la
     cabecera en móvil), que solo enseñan esa franja: mismos píxeles, menos de la mitad de peso.
   - `card`: a 1280 px. Cuando el vídeo se pinta a ese tamaño o menos (tarjetas, carrusel, pase de fondo).
   Si no, el original. */
type Variant = { w: number; h: number; card?: string; port?: string };
const VARIANTS = videoOpt as Record<string, Variant>;
function pick(v: HTMLVideoElement, src: string) {
  const e = VARIANTS[src];
  const bw = v.offsetWidth, bh = v.offsetHeight;
  if (!e || !bw || !bh) return src;
  const cs = getComputedStyle(v);
  const cover = cs.objectFit === "cover";
  if (e.port && cover && bw / bh <= 0.6 && cs.objectPosition === "50% 50%") return e.port;
  // Ancho al que se pinta el vídeo (con cover puede ser más que la caja), en píxeles de pantalla.
  const shown = (cover ? Math.max(bw / e.w, bh / e.h) : Math.min(bw / e.w, bh / e.h)) * e.w * (window.devicePixelRatio || 1);
  if (e.card && shown <= 1280 * 1.15) return e.card;
  return src;
}

/** Espera a que la portada del caso pueda reproducirse (o 3 s, o nada si no hay portada en vídeo pendiente). */
function heroFirst(v: HTMLVideoElement) {
  const hero = [...document.querySelectorAll<HTMLVideoElement>("[data-case-hero] [data-poster] video")].find(
    (h) => h.getClientRects().length > 0
  );
  if (!hero || hero === v || hero.readyState >= 3) return Promise.resolve();
  return new Promise<void>((r) => {
    hero.addEventListener("canplay", () => r(), { once: true });
    setTimeout(r, 3000);
  });
}

export default function LazyVideo({ className = "", src, ...rest }: React.VideoHTMLAttributes<HTMLVideoElement> & { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let off = false;
    // Cerca: póster y, en cuanto la cabecera lo permita, el vídeo.
    const near = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          near.disconnect();
          if (!v.poster) v.poster = posterOf(src);
          heroFirst(v).then(() => {
            if (off) return;
            const best = pick(v, src);
            if (best !== src) v.src = best;
            v.preload = "auto";
            // Si ya está a la vista, arrancarlo ahora (el `play` de abajo pudo llegar antes y no cargar nada).
            if (v.getClientRects().length && seenNow) play();
          });
        }
      },
      { rootMargin: "25% 0px" }
    );
    // A la vista: reproducir; fuera: pausar.
    let seenNow = false;
    // La portada del caso, mientras aterriza un vuelo encima, la arranca `endFlight` en el fotograma de la capa.
    const play = () => {
      if (!(isFlying() && v.closest("[data-poster]"))) v.play().catch(() => {});
    };
    const seen = new IntersectionObserver((es) => {
      seenNow = es.some((e) => e.isIntersecting);
      if (seenNow && v.preload === "auto") play();
      else if (!seenNow) v.pause();
    });
    near.observe(v);
    seen.observe(v);
    return () => {
      off = true;
      near.disconnect();
      seen.disconnect();
    };
  }, [src]);
  return <video ref={ref} className={className} src={src} preload="none" muted loop playsInline {...rest} />;
}
