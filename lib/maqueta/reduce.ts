import { useSyncExternalStore } from "react";

/* ¿Pide el sistema reducir el movimiento? Versión segura para la hidratación (F3, 2026-10-13).
   `useReducedMotion` de framer-motion lee la preferencia ya en el primer render del navegador; el
   servidor siempre dice «no», y los componentes que cambian de marcado según ella (Parallax,
   MaskReveal…) no coincidían con el HTML del servidor: con movimiento reducido la página se
   quedaba en blanco. Este hook responde «no» durante la hidratación, igual que el servidor, y se
   actualiza justo después (y si la preferencia cambia en vivo). */

const Q = "(prefers-reduced-motion: reduce)";

const subscribe = (f: () => void) => {
  const m = window.matchMedia(Q);
  m.addEventListener("change", f);
  return () => m.removeEventListener("change", f);
};

export function useReduce() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(Q).matches, () => false);
}
