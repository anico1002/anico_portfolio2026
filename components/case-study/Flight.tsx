"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
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
type Flight = { src: string; frame: Rect; media: Rect; time: number; still: HTMLVideoElement | null; onLanded: () => void };

let flight: Flight | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

/** ¿Hay un vuelo en curso? La portada sobre la que aterriza no debe arrancar sola: la arranca `endFlight` al fundir. */
export const isFlying = () => flight != null;

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
const box = (r: DOMRect): Rect => ({ left: r.left, top: r.top, width: r.width, height: r.height });

/** Desde la tarjeta: `frame` es el marco visible; dentro se busca la imagen/vídeo real. */
export function startFlight(src: string, frame: HTMLElement, onLanded: () => void) {
  const media = frame.querySelector("img, video") as HTMLImageElement | HTMLVideoElement | null;
  flight = {
    // El archivo que la tarjeta ya tiene cargado (su versión ligera, `Img`), no el original: si no, la capa
    // descargaría el PNG pesado justo al empezar a volar.
    // Lo mismo con los vídeos: la tarjeta puede llevar su versión de 1280 px (LazyVideo, video-opt.json).
    src: media?.currentSrc || src,
    frame: box(frame.getBoundingClientRect()),
    media: box((media ?? frame).getBoundingClientRect()),
    time: media instanceof HTMLVideoElement ? media.currentTime : 0,
    // El vídeo de la tarjeta, si ya pinta: su fotograma abre el vuelo al instante (ver `Still`).
    still: media instanceof HTMLVideoElement && media.readyState >= 2 ? media : null,
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
    // Un segundo y poco como mucho para dejar la portada en el mismo fotograma (2026-10-17: con 4G las tres esperas
    // encadenadas sumaban hasta 4,5 s con la imagen quieta, la página parecía congelada). Si el vídeo no llega a
    // tiempo, la capa se funde sobre su póster (el primer fotograma) y el vídeo arranca cuando llegue.
    const sync = (async () => {
      try {
        poster.pause();
        if (poster.readyState < 1) await once(poster, "loadedmetadata");
        const seeked = once(poster, "seeked");
        poster.currentTime = Math.min(t, (poster.duration || 1e9) - 0.05);
        await seeked;
        if (poster.readyState < 2) await once(poster, "loadeddata");
      } catch {}
    })();
    await Promise.race([sync, new Promise((r) => setTimeout(r, 1200))]);
    if (poster.readyState < 2 && poster.poster) {
      const img = new Image();
      img.src = poster.poster;
      await Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 1000))]);
    }
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
  // Si el vídeo de la capa no llegó a reproducirse, sigue puesto el fotograma de la tarjeta (`Still`): ya está quieto.
  if (wrap.querySelector("canvas")) return;
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

/** El fotograma que se veía en la tarjeta, congelado en un canvas, mientras el vídeo de la capa no puede reproducirse.
    Sin él (2026-10-17, iPhone emulado con 4G), la capa volvía a pedir el vídeo a la red y crecía vacía hasta 1,4 s.
    Lleva el tiempo del fotograma (`data-t`): si se aterriza con él puesto, la portada continúa desde ahí. */
function Still({ video, time, ...rest }: React.ComponentProps<typeof motion.canvas> & { video: HTMLVideoElement; time: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c || !video.videoWidth) return;
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.dataset.t = String(time);
    try {
      c.getContext("2d")?.drawImage(video, 0, 0);
    } catch {}
  }, [video, time]);
  return <motion.canvas ref={ref} {...rest} />;
}

export default function FlightLayer() {
  const f = useSyncExternalStore(subscribe, () => flight, () => null);
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const landed = useRef(false);
  // Cada vuelo nuevo arranca sin vídeo en marcha: se reajusta al renderizar (no en un efecto, que pintaría antes un
  // fotograma con el estado del vuelo anterior).
  const [prev, setPrev] = useState(f);
  if (f !== prev) {
    setPrev(f);
    setLive(false);
  }
  useEffect(() => {
    landed.current = false;
  }, [f]);

  useEffect(() => {
    overlay = ref.current;
    if (!f) return;
    // Aterriza al acabar el vuelo, por reloj y no con el fin de la animación de la imagen: si la imagen ya llena el
    // marco (miniaturas del pie, sin zoom ni parallax), esa animación no tiene recorrido, «acaba» al instante y la
    // página cambiaba en cuanto se pulsaba (salto, 2026-10-17).
    const land = setTimeout(() => {
      landed.current = true;
      ref.current?.querySelector("video")?.pause();
      if (ref.current) freeze(ref.current);
      f.onLanded();
    }, FLIGHT_S * 1000);
    // Seguridad: si la portada no avisara (error de carga), la capa no se queda puesta.
    const t = setTimeout(() => endFlight(), (FLIGHT_S + 4) * 1000);
    return () => (clearTimeout(land), clearTimeout(t));
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
        <>
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
            // Solo mientras vuela: aterrizado, la capa ya está quieta en su fotograma y la portada se ajusta a él.
            onPlaying={(e) => (landed.current ? e.currentTarget.pause() : setLive(true))}
          />
          {f.still && !live && <Still {...inner} video={f.still} time={f.time} />}
        </>
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
