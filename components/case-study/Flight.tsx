"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { FLIGHT_KEY, FLIGHT_S, POWER3_INOUT, POWER4_INOUT } from "@/components/case-study/primitives";

/* Transición home → caso (HOMEPAGE_TO_CASE_STUDY de Metalab: 1,5 s, Power4.easeInOut).

   La capa que vuela vive en el layout de la maqueta, no en la home: así sobrevive al cambio de
   página y solo se retira cuando la portada del caso ya ha pintado su imagen (sin parpadeo).
   Arranca con el encuadre exacto que se ve en la tarjeta: el marco recorta y, dentro, la imagen
   sale con su zoom y su parallax del momento, y ambos crecen a pantalla completa a la vez.
   En vídeo, la portada del caso continúa desde el mismo fotograma. */

type Rect = { left: number; top: number; width: number; height: number };
type Flight = { src: string; frame: Rect; media: Rect; time: number; onLanded: () => void };

let flight: Flight | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
const box = (r: DOMRect): Rect => ({ left: r.left, top: r.top, width: r.width, height: r.height });

/** Desde la tarjeta: `frame` es el marco visible; dentro se busca la imagen/vídeo real. */
export function startFlight(src: string, frame: HTMLElement, onLanded: () => void) {
  const media = frame.querySelector("img, video") as HTMLImageElement | HTMLVideoElement | null;
  flight = {
    src,
    frame: box(frame.getBoundingClientRect()),
    media: box((media ?? frame).getBoundingClientRect()),
    time: media instanceof HTMLVideoElement ? media.currentTime : 0,
    onLanded,
  };
  emit();
}

let overlay: HTMLDivElement | null = null;

const once = (el: HTMLElement, ev: string) => new Promise<void>((r) => el.addEventListener(ev, () => r(), { once: true }));
const twoFrames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
let ending = false;

/** Desde la portada del caso: funde la capa y la retira, pero solo cuando la portada ya tiene
    imagen pintada. Si es un vídeo, primero lo lleva al mismo instante que la capa y espera a
    que ese fotograma esté dibujado (si no, durante el fundido se vería el fondo en blanco). */
export async function endFlight(poster?: HTMLVideoElement | null) {
  if (!flight || !overlay || ending) return;
  ending = true;
  const v = overlay.querySelector("video");
  if (poster && v) {
    try {
      if (poster.readyState < 1) await once(poster, "loadedmetadata");
      const seeked = once(poster, "seeked");
      poster.currentTime = Math.min(v.currentTime + 0.05, (poster.duration || 1e9) - 0.05);
      await seeked;
      if (poster.readyState < 3) await once(poster, "canplay");
      await poster.play().catch(() => {});
    } catch {}
  }
  await twoFrames();
  await animate(overlay, { opacity: 0 }, { duration: 0.35, ease: POWER3_INOUT });
  flight = null;
  ending = false;
  emit();
}

const FULL = { left: 0, top: 0, width: "100vw", height: "100svh" };

/** Congela el fotograma actual del vídeo de la capa en un canvas encima (encuadre object-cover):
    durante el cambio de página el navegador puede dejar de pintar el vídeo un instante y se
    vería en blanco; una imagen fija no. */
function freeze(wrap: HTMLDivElement) {
  const v = wrap.querySelector("video");
  if (!v || !v.videoWidth) return;
  const W = wrap.clientWidth;
  const H = wrap.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  const c = document.createElement("canvas");
  c.width = Math.round(W * dpr);
  c.height = Math.round(H * dpr);
  c.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  const k = Math.max(W / v.videoWidth, H / v.videoHeight);
  const sw = W / k;
  const sh = H / k;
  c.getContext("2d")?.drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, c.width, c.height);
  wrap.appendChild(c);
}

export default function FlightLayer() {
  const f = useSyncExternalStore(subscribe, () => flight, () => null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    overlay = ref.current;
    if (!f) return;
    // Seguridad: si la portada no avisara (error de carga), la capa no se queda puesta.
    const t = setTimeout(() => endFlight(), (FLIGHT_S + 4) * 1000);
    return () => clearTimeout(t);
  }, [f]);

  if (!f) return null;
  const ease = POWER4_INOUT;
  const tr = { duration: FLIGHT_S, ease };
  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed z-[100] overflow-hidden"
      initial={f.frame}
      animate={FULL}
      transition={tr}
      onAnimationComplete={() => {
        if (ref.current) freeze(ref.current);
        f.onLanded();
      }}
    >
      {isVideo(f.src) ? (
        <motion.video
          src={f.src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute max-w-none object-cover"
          initial={{ left: f.media.left - f.frame.left, top: f.media.top - f.frame.top, width: f.media.width, height: f.media.height }}
          animate={{ left: 0, top: 0, width: "100vw", height: "100svh" }}
          transition={tr}
          onLoadedMetadata={(e) => {
            try {
              e.currentTarget.currentTime = f.time;
            } catch {}
          }}
        />
      ) : (
        <motion.img
          src={f.src}
          alt=""
          className="absolute max-w-none object-cover"
          initial={{ left: f.media.left - f.frame.left, top: f.media.top - f.frame.top, width: f.media.width, height: f.media.height }}
          animate={{ left: 0, top: 0, width: "100vw", height: "100svh" }}
          transition={tr}
        />
      )}
    </motion.div>
  );
}

/** ¿Se llega al caso desde la miniatura de la home? (marca que deja la home al aterrizar). */
export const markLanded = () => {
  try {
    sessionStorage.setItem(FLIGHT_KEY, "landed");
  } catch {}
};
