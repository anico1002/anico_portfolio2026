"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Telón de la entrada → home de sección (2026-10-12). La entrada hace crecer la mitad elegida
   hasta cubrir la pantalla con el titular en el centro; en ese momento este telón, idéntico
   (misma imagen y escala, mismo velo, mismo titular), toma el relevo en el layout para
   sobrevivir al cambio de página. Cuando la home ya está montada, se retira con un barrido de
   máscara de abajo arriba (Power3.easeInOut, como la cabecera de los casos) mientras la
   imagen se asienta con un parallax sutil. */

type Curtain = { src: string; scale: number; label: string; from: string };

let curtain: Curtain | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

export function startCurtain(c: Curtain) {
  curtain = c;
  emit();
}
const clear = () => {
  curtain = null;
  emit();
};

export default function CurtainLayer() {
  const c = useSyncExternalStore(subscribe, () => curtain, () => null);
  const path = usePathname();
  const [lift, setLift] = useState<string | null>(null);

  // Se levanta cuando la ruta ya es la de destino (dos fotogramas para que pinte la home).
  useEffect(() => {
    if (!c || path === c.from || lift === c.from) return;
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(() => (b = requestAnimationFrame(() => setLift(c.from))));
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [c, path, lift]);

  if (!c) return null;
  const up = lift === c.from;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden font-[family-name:var(--font-case-sans)] antialiased"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: up ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
      transition={{ duration: DUR.base, ease: EASE.inOut }}
      onAnimationComplete={() => {
        if (up) {
          setLift(null);
          clear();
        }
      }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ y: "0%" }}
        animate={{ y: up ? "-12%" : "0%" }}
        transition={{ duration: DUR.base, ease: EASE.inOut }}
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
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="t-d3 text-white">
            {c.label}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
