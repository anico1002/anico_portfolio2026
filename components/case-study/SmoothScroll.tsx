"use client";

import { cancelFrame, frame } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Scroll suavizado (Lenis, el mismo que usa Yakushev): es lo que hace que los
    parallax se sientan elegantes en vez de ir a saltos con la rueda.
    Lenis guarda su propia posición objetivo: al cambiar de página hay que llevarlo
    arriba de golpe, o arrastra la posición de la página anterior. */

let lenis: Lenis | null = null;
let locks = 0;

/* Posición de cada página (2026-10-13): al volver con atrás/adelante se recupera donde estabas
   (p. ej. la home a la altura de la tarjeta del caso que abriste); con un enlace normal, arriba. */
const saved = new Map<string, number>();
let popped = false;

/** Bloqueo de scroll mientras dura una transición o un menú (B6). Con contador: cada `stop`
    necesita su `start`, así dos capas a la vez no se desbloquean la una a la otra. */
export const scrollLock = {
  stop() {
    locks++;
    lenis?.stop();
  },
  start() {
    locks = Math.max(0, locks - 1);
    if (!locks) lenis?.start();
  },
};

/** Volver arriba con el mismo scroll suavizado (o de golpe sin movimiento reducido). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.5, easing: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2) });
  else window.scrollTo({ top: 0 });
}

/** Ir a una sección de la página (#id) con el mismo scroll suavizado; `instant`, de golpe (al llegar de otra página). */
export function scrollToId(id: string, instant = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, instant ? { immediate: true, force: true } : { duration: 1.5, easing: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2) });
  else el.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Lenis avanza en el mismo bucle de fotogramas que framer-motion, justo antes de que este lea el scroll
    // (auditoría 2026-10-19). Con su propio rAF (`autoRaf`) los parallax podían leer la posición del fotograma
    // anterior: tironcitos, sobre todo en monitores de 120/144 Hz.
    lenis = new Lenis({ lerp: 0.085, autoRaf: false });
    const tick = ({ timestamp }: { timestamp: number }) => lenis?.raf(timestamp);
    frame.update(tick, true);
    if (locks) lenis.stop();
    return () => {
      cancelFrame(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    // La restauración la hacemos nosotros (el navegador la haría antes de que la página nueva exista).
    window.history.scrollRestoration = "manual";
    const onPop = () => (popped = true);
    // Entre el «atrás» y la restauración, el navegador recorta el scroll al cambiar el contenido y
    // eso pisaría la posición guardada de la página a la que se vuelve: ahí no se guarda.
    const onScroll = () => !popped && saved.set(window.location.pathname, window.scrollY);
    window.addEventListener("popstate", onPop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const y = popped ? (saved.get(pathname) ?? 0) : 0;
    popped = false;
    lenis?.scrollTo(y, { immediate: true, force: true });
    window.scrollTo(0, y);
  }, [pathname]);

  return null;
}
