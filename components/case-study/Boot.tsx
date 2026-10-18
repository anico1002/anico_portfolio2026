"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LogoAnico from "@/components/case-study/LogoAnico";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { setBooted } from "@/lib/maqueta/boot";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Arranque de la maqueta (D6, 2026-10-13): en la primera carga, una capa del color del fondo tapa
   la página hasta que la tipografía está lista, para que nada se pinte ni se parta en líneas con la
   fuente de reserva. Se pinta ya en el HTML del servidor, así que tapa desde el primer fotograma.
   - Si la fuente llega enseguida (lo normal: va precargada), la capa se quita sin más y no se ve.
   - Si tarda más de WAIT, aparece el logo con el rodillo del portal, en bucle mientras carga; al
     terminar se acaba el giro en curso y la capa se va con el barrido de abajo arriba (el gesto
     del portal), mientras empiezan las entradas de debajo.
   Tope de 6 s, como el portal, para no quedarse nunca tapado. Sin movimiento: se quita sin barrido. */

const WAIT = 250;
const ROLL_MS = DUR.base * 1000 + 4 * 80 + 150; // un giro del logo (mismo valor que en Portal)
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function Boot() {
  const [phase, setPhase] = useState<"covered" | "opening" | "done">("covered");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let alive = true;
    let ready = false;
    scrollLock.stop();
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), sleep(6000)]);
    fonts.then(() => (ready = true));
    (async () => {
      await Promise.race([fonts, sleep(WAIT)]);
      if (!alive) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (ready || reduce) {
        await fonts;
        if (!alive) return;
        setBooted();
        scrollLock.start();
        setPhase("done");
        return;
      }
      // Tarda: el logo gira hasta que llega la fuente y después se destapa.
      do {
        setCycle((c) => c + 1);
        await sleep(ROLL_MS);
      } while (alive && !ready);
      if (!alive) return;
      setBooted();
      setPhase("opening");
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (phase === "done") return null;
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[95] flex items-center justify-center bg-[var(--case-bg)] text-[var(--case-fg)]"
      initial={false}
      animate={{ clipPath: phase === "opening" ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
      transition={{ duration: DUR.base, ease: EASE.inOut }}
      onAnimationComplete={() => {
        if (phase !== "opening") return;
        scrollLock.start();
        setPhase("done");
      }}
    >
      {/* El logo solo se ve si la carga tarda (antes del primer giro está transparente). */}
      <span className="transition-opacity duration-300" style={{ opacity: cycle > 0 ? 1 : 0 }}>
        <LogoAnico loop play={cycle > 0} className="h-[1.125rem] w-auto md:h-[1.375rem]" />
      </span>
    </motion.div>
  );
}
