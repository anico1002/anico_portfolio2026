"use client";

import { useSyncExternalStore } from "react";

/** `prefers-reduced-motion` como estado de React, sin efecto ni render doble (auditoría 2026-10-19: las versiones con
    setState dentro de un efecto pintaban primero con movimiento y además nunca quitaban el listener). */
const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const q = window.matchMedia(QUERY);
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
};
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
