"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import LogoLetters from "@/components/case-study/LogoLetters";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Transición para TODOS los enlaces internos (B1 de la revisión): un barrido de máscara vertical
   del color invertido sube desde abajo hasta tapar la pantalla, se cambia de página tapada y el
   barrido sigue subiendo hasta descubrir la nueva. Es el mismo gesto del telón de la entrada
   (de abajo arriba). Se probaron los paneles laterales de Metalab y se descartaron por
   demasiado parecidos (2026-10-12). Con la pantalla tapada espera a que la página nueva esté lista
   (ruta, fuentes, imágenes y vídeos de la primera pantalla; tope 6 s) y mientras tanto el logo del
   centro hace el rodillo del hover del menú, en bucle. Mientras dura, la
   capa se come los clics y el scroll queda parado (B6). La miniatura → caso y la entrada B
   tienen su propia transición; esta es la de todo lo demás. */

type Phase = "idle" | "closing" | "covered" | "opening";
let state: { phase: Phase; href: string | null } = { phase: "idle", href: null };
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
  set({ phase: "closing", href });
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

/** Un giro del rodillo del logo: su duración, la ola de 15 ms de las 5 letras y una pausa breve. */
const ROLL_MS = DUR.base * 1000 + 4 * 15 + 150;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const twoFrames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
/** Una imagen o un vídeo, listos para pintarse sin hueco. */
function isReady(m: HTMLImageElement | HTMLVideoElement): Promise<unknown> {
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

  // Rodillo del logo: un giro en cuanto el barrido deja ver el logo y, mientras la página nueva no
  // esté lista, otro y otro. Al terminar la carga se acaba el giro en curso y se destapa.
  const [cycle, setCycle] = useState(0);
  const pathRef = useRef(path);
  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  const active = s.phase === "closing" || s.phase === "covered";
  useEffect(() => {
    if (!active || reduced()) return;
    let alive = true;
    let ready = false;
    (async () => {
      // Lista = la ruta es la nueva y ya ha pintado fuentes, imágenes y vídeos de la primera
      // pantalla (o han pasado 6 s, para no quedarse nunca tapado).
      const settle = (async () => {
        while (alive && (state.phase !== "covered" || pathRef.current !== state.href)) await sleep(50);
        await twoFrames();
        const media = [...document.querySelectorAll<HTMLImageElement | HTMLVideoElement>("main img, main video")].filter((m) => {
          const r = m.getBoundingClientRect();
          return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
        });
        await Promise.race([Promise.all([document.fonts?.ready, ...media.map((m) => isReady(m).catch(() => {}))]), sleep(6000)]);
      })();
      settle.then(() => (ready = true));
      // El logo está en el centro: el barrido no lo descubre hasta media subida. Antes de eso el
      // giro pasaría tapado, así que el primero espera a que se vea.
      if (state.phase === "closing") await sleep(DUR.base * 1000 * 0.55);
      do {
        setCycle((c) => c + 1);
        await sleep(ROLL_MS);
      } while (alive && !ready);
      if (alive && state.phase === "covered") set({ ...state, phase: "opening" });
    })();
    return () => {
      alive = false;
    };
  }, [active]);

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
            set({ ...state, phase: "idle", href: null });
            scrollLock.start();
          }
        }}
      >
        {/* Logo fijo en el centro: la máscara lo descubre y lo vuelve a tapar al pasar. Va en
            el color del fondo (el panel es del color del texto) y al mismo tamaño que en la cabecera. */}
        {/* Carga: el logo hace el rodillo del menú, en bucle mientras carga la página nueva.
            En el color del fondo (el panel es del texto). */}
        <LogoLetters cycle={cycle} className="h-[1.125rem] w-auto text-[var(--case-bg)] md:h-[1.375rem]" />
      </motion.div>
    </div>
  );
}
