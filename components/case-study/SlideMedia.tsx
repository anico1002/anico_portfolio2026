"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { OptSource } from "@/components/case-study/Img";
import { REEL } from "@/lib/maqueta/sections";

/* Diapositiva de los pases de fondo (entrada partida, cabecera de la home y telón entre las dos).
   Desde el 2026-10-14 el pase de Product son las miniaturas en movimiento de cada caso, así que
   una diapositiva puede ser imagen o vídeo. Convención: el póster de `x.mp4` es `x-poster.jpg`,
   al lado (primer fotograma); se pinta mientras el vídeo carga y en el telón. */

/** Versión para móvil de un vídeo, que el navegador elige por ancho: 1280 px (~2 MB) frente a 1920 px (~5 MB) en
    escritorio. Con menos se veía roto (feedback 2026-10-29): en el móvil solo se ve la franja central, muy ampliada. */
const LIGHT: Record<string, string> = { [REEL]: "/maqueta/hero-reel/reel-m.mp4" };

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
export const posterOf = (src: string) => (isVideo(src) ? src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg") : src);

/** Cuánto dura una diapositiva en pantalla: los vídeos se dejan ver un rato, sin esperar a que acaben. */
export const slideMs = (src: string, imageMs: number, videoMs: number) => (isVideo(src) ? videoMs : imageMs);

/** Pase: cada diapositiva aguanta lo suyo (imagen o vídeo) y pasa a la siguiente. Devuelve el
    índice y cuántos pasos lleva (0 = sigue en la primera, aún sin dar la vuelta). */
export function useSlideshow(slides: readonly string[], run: boolean, imageMs: number, videoMs: number, start = 0) {
  const [step, setStep] = useState(0);
  const i = (start + step) % slides.length;
  useEffect(() => {
    if (!run || slides.length < 2) return;
    const t = setTimeout(() => setStep((n) => n + 1), slideMs(slides[i], imageMs, videoMs));
    return () => clearTimeout(t);
  }, [run, i, slides, imageMs, videoMs]);
  return { i, step };
}

type Props = {
  src: string;
  /** Entra con fundido y un zoom lento de salida (1,08 → 1); `false` = ya está (telón). */
  enter?: boolean;
  /** Escala de partida (el telón arranca con la de la entrada). */
  fromScale?: number;
  /** Vídeo en marcha; en pausa se queda en su fotograma (mitad sin hover, movimiento reducido). */
  playing?: boolean;
  /** Segundo por el que arranca el vídeo (relevo con el telón). */
  startAt?: number;
  /** Duración del fundido de entrada (por defecto DUR.base; el pase rápido del móvil usa uno corto). */
  fade?: number;
  onReady?: () => void;
};

const SlideMedia = forwardRef<HTMLImageElement | HTMLVideoElement, Props>(function SlideMedia(
  { src, enter = true, fromScale = 1.08, playing = true, startAt = 0, fade = DUR.base, onReady },
  ref
) {
  const common = {
    "data-slide": src,
    className: "absolute inset-0 h-full w-full object-cover",
    initial: enter ? { opacity: 0, scale: fromScale } : { scale: fromScale },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0 },
    transition: enter
      ? { opacity: { duration: fade, ease: EASE.inOut }, scale: { duration: DUR.drift, ease: EASE.out } }
      : { duration: DUR.slow, ease: EASE.inOut },
  };
  if (!isVideo(src))
    return (
      <picture style={{ display: "contents" }}>
        <OptSource src={src} />
        <motion.img ref={ref as React.Ref<HTMLImageElement>} src={src} alt="" {...common} />
      </picture>
    );
  return <Video {...common} ref={ref as React.Ref<HTMLVideoElement>} src={src} playing={playing} startAt={startAt} onReady={onReady} />;
});

const Video = forwardRef<
  HTMLVideoElement,
  Omit<HTMLMotionProps<"video">, "ref"> & { src: string; playing: boolean; startAt: number; onReady?: () => void }
>(function Video({ src, playing, startAt, onReady, ...rest }, ref) {
  const [el, setEl] = useState<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [el, playing]);
  // Arranque a mitad (relevo con el telón): solo al montar. Si el vídeo ya venía en caché, la
  // metadata puede estar lista antes de que llegue el evento: por eso también al enganchar el nodo.
  const [from] = useState(startAt);
  const seek = (v: HTMLVideoElement) => {
    if (from > 0 && v.readyState >= 1 && !v.dataset.seeked) {
      v.dataset.seeked = "1";
      v.currentTime = from % (v.duration || Infinity);
    }
  };
  return (
    <motion.video
      ref={(v: HTMLVideoElement | null) => {
        setEl(v);
        if (v) seek(v);
        if (typeof ref === "function") ref(v);
        else if (ref) ref.current = v;
      }}
      src={LIGHT[src] ? undefined : src}
      poster={posterOf(src)}
      muted
      loop
      playsInline
      preload="auto"
      autoPlay={playing}
      onLoadedMetadata={(e) => seek(e.currentTarget)}
      onLoadedData={onReady}
      {...rest}
    >
      {LIGHT[src] && (
        <>
          <source src={LIGHT[src]} type="video/mp4" media="(max-width: 767px)" />
          <source src={src} type="video/mp4" />
        </>
      )}
    </motion.video>
  );
});

export default SlideMedia;
