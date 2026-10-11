"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Scroll suavizado (Lenis, el mismo que usa Yakushev): es lo que hace que los
    parallax se sientan elegantes en vez de ir a saltos con la rueda.
    Lenis guarda su propia posición objetivo: al cambiar de página hay que llevarlo
    arriba de golpe, o arrastra la posición de la página anterior. */
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis.current = new Lenis({ lerp: 0.085, autoRaf: true });
    return () => {
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
