"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { FLIGHT_KEY, FLIGHT_S } from "@/components/case-study/primitives";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { scrollLock } from "@/components/case-study/SmoothScroll";

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
  scrollLock.stop();
  emit();
}

let overlay: HTMLDivElement | null = null;

/* Cada espera, con tope (2026-10-17): en el iPhone un vídeo que no se carga (oculto, ahorro de batería) no avisa
   nunca, y la capa se quedaba puesta con el scroll parado: la página parecía colgada (Interactius, WineUp). */
const once = (el: HTMLElement, ev: string, ms = 1500) =>
  new Promise<void>((r) => {
    el.addEventListener(ev, () => r(), { once: true });
    setTimeout(r, ms);
  });
const twoFrames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
let ending = false;

/** Desde la portada del caso: funde la capa y la retira, pero solo cuando la portada ya tiene
    imagen pintada. Si es un vídeo, primero lo lleva al mismo instante que la capa y espera a
    que ese fotograma esté dibujado (si no, durante el fundido se vería el fondo en blanco). */
export async function endFlight(poster?: HTMLVideoElement | null) {
  if (!flight || !overlay || ending) return;
  ending = true;
  const v = overlay.querySelector("video");
  // El fotograma que se VE en la capa: el congelado en el canvas al aterrizar (el vídeo de debajo siguió corriendo;
  // usar su tiempo hacía saltar la imagen al fundir, 2026-10-17) o, si no hay canvas, el del vídeo.
  const frozen = overlay.querySelector("canvas") as HTMLCanvasElement | null;
  const t = frozen?.dataset.t != null ? Number(frozen.dataset.t) : v?.currentTime;
  if (poster && t != null) {
    try {
      poster.pause();
      if (poster.readyState < 1) await once(poster, "loadedmetadata");
      const seeked = once(poster, "seeked");
      poster.currentTime = Math.min(t, (poster.duration || 1e9) - 0.05);
      await seeked;
      if (poster.readyState < 2) await once(poster, "loadeddata");
    } catch {}
  }
  await twoFrames();
  // Las dos imágenes, quietas en el mismo fotograma, mientras se funde la capa; después arranca la portada.
  await animate(overlay, { opacity: 0 }, { duration: DUR.fast, ease: EASE.inOut });
  poster?.play().catch(() => {});
  flight = null;
  ending = false;
  scrollLock.start();
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
  c.dataset.t = String(v.currentTime);
  v.pause();
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
  // Máscara e imagen a distinta velocidad (parallax interno, sutil): la máscara llega antes
  // (1,3 s, Power4.easeInOut de Metalab) y la imagen, colocada en proporción a la máscara, se
  // asienta más despacio (1,5 s, curva más suave). Siempre es igual o mayor que la máscara, así
  // que nunca asoman bordes. El cambio de página espera a que termine la imagen.
  // La imagen arranca EXACTAMENTE como se ve en la tarjeta (con el zoom que ya tiene allí):
  // cualquier ampliación extra al inicio se ve como un salto en el primer fotograma.
  const kw = f.media.width / f.frame.width;
  const kh = f.media.height / f.frame.height;
  const ox = (f.media.left - f.frame.left) / f.frame.width;
  const oy = (f.media.top - f.frame.top) / f.frame.height;
  const pct = (n: number) => `${n * 100}%`;
  const inner = {
    className: "absolute max-w-none object-cover",
    initial: { left: pct(ox), top: pct(oy), width: pct(kw), height: pct(kh) },
    animate: { left: "0%", top: "0%", width: "100%", height: "100%" },
    transition: { duration: FLIGHT_S, ease: EASE.inOut },
    onAnimationComplete: () => {
      if (ref.current) freeze(ref.current);
      f.onLanded();
    },
  };
  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="fixed z-[100] overflow-hidden"
      initial={f.frame}
      animate={FULL}
      transition={{ duration: FLIGHT_S - 0.2, ease: EASE.screen }}
    >
      {isVideo(f.src) ? (
        <motion.video
          {...inner}
          src={f.src}
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={(e) => {
            try {
              e.currentTarget.currentTime = f.time;
            } catch {}
          }}
        />
      ) : (
        <motion.img {...inner} src={f.src} alt="" />
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
