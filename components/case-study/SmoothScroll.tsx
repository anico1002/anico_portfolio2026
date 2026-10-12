"use client";

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

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.085, autoRaf: true });
    if (locks) lenis.stop();
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
