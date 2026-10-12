"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { scrollLock } from "@/components/case-study/SmoothScroll";

/* Telón de la entrada → home de sección. La entrada hace crecer la mitad elegida hasta cubrir
   la pantalla (ya sin titulares); en ese momento este telón, idéntico (misma imagen y
   escala, mismo velo; sin titular: al elegir, los titulares se van al momento), toma el relevo en el layout para sobrevivir al cambio de
   página. Ya no se levanta entero (2026-10-12): la cabecera de la home (HomeHero) pinta debajo
   exactamente lo mismo y, cuando lo tiene listo, llama a `endCurtain()`; el telón se funde y la
   cabecera sigue sola (pase de imágenes y máscara hasta la franja del texto). */

type Curtain = { src: string; scale: number; from: string };

let curtain: Curtain | null = null;
let ending = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

export function startCurtain(c: Curtain) {
  scrollLock.stop();
  curtain = c;
  ending = false;
  emit();
}
const clear = () => {
  if (!curtain) return;
  scrollLock.start();
  curtain = null;
  ending = false;
  emit();
};

/** El telón activo (lo lee la cabecera de la home para arrancar igual que él). */
export const useCurtain = () => useSyncExternalStore(subscribe, () => curtain, () => null);

/** Desde la cabecera de la home, cuando ya ha pintado la misma imagen: el telón se funde. */
export function endCurtain() {
  if (!curtain || ending) return;
  ending = true;
  emit();
}

export default function CurtainLayer() {
  const c = useCurtain();
  const fading = useSyncExternalStore(subscribe, () => ending, () => false);
  // La imagen se asienta (escala de la entrada → 1); el fundido espera a que termine para que el
  // relevo con la cabecera, que ya está a escala 1, sea exacto.
  const [settled, setSettled] = useState(false);

  // Asentada por tiempo, no por fin de animación: si la escala ya es 1 no hay animación que avise.
  // Y por seguridad, si la cabecera no avisara (error de carga), el telón no se queda puesto.
  useEffect(() => {
    if (!c) return;
    const a = setTimeout(() => setSettled(true), DUR.slow * 1000);
    const b = setTimeout(endCurtain, 6000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [c]);

  if (!c) return null;
  const out = fading && settled;
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] overflow-hidden font-[family-name:var(--font-case-sans)] antialiased"
      initial={{ opacity: 1 }}
      animate={{ opacity: out ? 0 : 1 }}
      transition={{ duration: DUR.fast, ease: EASE.inOut }}
      onAnimationComplete={() => {
        if (out) {
          setSettled(false);
          clear();
        }
      }}
    >
      <motion.img
        src={c.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: c.scale }}
        animate={{ scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE.inOut }}
      />
      <div className="absolute inset-0 bg-black/45" />
    </motion.div>
  );
}
