"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import LogoLetters, { scatter, type Scatter } from "@/components/case-study/LogoLetters";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Transición para TODOS los enlaces internos (B1 de la revisión): un barrido de máscara vertical
   del color invertido sube desde abajo hasta tapar la pantalla, se cambia de página tapada y el
   barrido sigue subiendo hasta descubrir la nueva. Es el mismo gesto del telón de la entrada
   (de abajo arriba). Se probaron los paneles laterales de Metalab y se descartaron por
   demasiado parecidos (2026-10-12). Con la pantalla tapada espera a que la página nueva esté lista
   (ruta, fuentes, imágenes y vídeos de la primera pantalla; tope 6 s) y las letras del logo del
   centro vuelven a su sitio con ese progreso. Mientras dura, la
   capa se come los clics y el scroll queda parado (B6). La miniatura → caso y la entrada B
   tienen su propia transición; esta es la de todo lo demás. */

type Phase = "idle" | "closing" | "covered" | "opening";
let state: { phase: Phase; href: string | null; spread: Scatter } = { phase: "idle", href: null, spread: scatter() };
const subs = new Set<() => void>();
const set = (s: typeof state) => {
  state = s;
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Navegar con la transición. Ignora la página actual y los clics durante otra transición. */
export function go(href: string) {
  if (state.phase !== "idle" || href === window.location.pathname) return;
  scrollLock.stop();
  set({ phase: "closing", href, spread: scatter() });
}

/** `Link` que pasa por el portal si el destino es de la maqueta. Cmd/Ctrl-clic y similares
    siguen abriendo pestaña nueva como siempre. */
export function TLink({ href, onClick, ...rest }: React.ComponentProps<typeof Link> & { href: string }) {
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (!href.startsWith("/maqueta")) return;
        e.preventDefault();
        go(href);
      }}
    />
  );
}

const SHUT = "inset(0% 0% 0% 0%)";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const twoFrames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
/** Una imagen o un vídeo, listos para pintarse sin hueco. */
function ready(m: HTMLImageElement | HTMLVideoElement): Promise<unknown> {
  if (m instanceof HTMLImageElement) return m.complete && m.naturalWidth ? Promise.resolve() : m.decode();
  if (m.readyState >= 2) return Promise.resolve();
  return new Promise<void>((r) => m.addEventListener("loadeddata", () => r(), { once: true }));
}

export default function PortalLayer() {
  const s = useSyncExternalStore(subscribe, () => state, () => state);
  const router = useRouter();
  const path = usePathname();

  // Sin movimiento: cambio directo, sin barrido.
  useEffect(() => {
    if (s.phase === "closing" && s.href && reduced()) {
      router.push(s.href);
      scrollLock.start();
      set({ ...state, phase: "idle", href: null });
    }
  }, [s, router]);

  // Progreso de carga (0–1) que pinta el logo. Tramos: tapar 0 → 0,15 · llega la ruta 0,35 ·
  // el resto se reparte entre fuentes, imágenes y vídeos que entran en la primera pantalla.
  const [progress, setProgress] = useState(0);

  // Tapada la pantalla: no se destapa hasta que la página nueva está lista (o pasan 6 s).
  useEffect(() => {
    if (s.phase !== "covered") return;
    if (path !== s.href) {
      setProgress(0.15);
      return;
    }
    let alive = true;
    setProgress(0.35);
    (async () => {
      await twoFrames();
      const media = [...document.querySelectorAll<HTMLImageElement | HTMLVideoElement>("main img, main video")].filter((m) => {
        const r = m.getBoundingClientRect();
        return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
      });
      const waits = [document.fonts?.ready ?? Promise.resolve(), ...media.map(ready)];
      let done = 0;
      const tick = () => alive && setProgress(0.35 + (0.65 * ++done) / waits.length);
      await Promise.race([Promise.all(waits.map((w) => w.then(tick, tick))), sleep(6000)]);
      if (!alive) return;
      setProgress(1);
      await sleep(DUR.fast * 1000 + 4 * 40 + 60); // que la última letra (ola de 40 ms) llegue a su sitio
      if (alive) set({ ...state, phase: "opening" });
    })();
    return () => {
      alive = false;
    };
  }, [s, path]);

  if (s.phase === "idle") return null;
  const shut = s.phase === "closing" || s.phase === "covered";
  // Entra por abajo (cerrado = recortado por arriba) y sale por arriba: siempre hacia arriba.
  const below = "inset(100% 0% 0% 0%)";
  const above = "inset(0% 0% 100% 0%)";
  return (
    <div aria-hidden className="fixed inset-0 z-[90]">
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-[var(--case-fg)]"
        initial={{ clipPath: below }}
        animate={{ clipPath: shut ? SHUT : above }}
        transition={shut ? { duration: DUR.base, ease: EASE.screen } : { duration: DUR.base, ease: EASE.inOut }}
        onAnimationComplete={() => {
          if (state.phase === "closing" && state.href) {
            set({ ...state, phase: "covered" });
            router.push(state.href);
          } else if (state.phase === "opening") {
            setProgress(0);
            set({ ...state, phase: "idle", href: null });
            scrollLock.start();
          }
        }}
      >
        {/* Logo fijo en el centro: la máscara lo descubre y lo vuelve a tapar al pasar. Va en
            el color del fondo (el panel es del color del texto) y al mismo tamaño que en la cabecera. */}
        {/* Carga: las letras del logo, desordenadas y desenfocadas, vuelven a su sitio
            enfocándose según avanza la carga. En el color del fondo (el panel es del texto). */}
        <LogoLetters progress={progress} spread={s.spread} className="h-[1.125rem] w-auto text-[var(--case-bg)] md:h-[1.375rem]" />
      </motion.div>
    </div>
  );
}
