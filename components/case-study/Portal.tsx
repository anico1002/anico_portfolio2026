"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Transición para TODOS los enlaces internos (B1 de la revisión): un barrido de máscara vertical
   del color invertido sube desde abajo hasta tapar la pantalla, se cambia de página tapada y el
   barrido sigue subiendo hasta descubrir la nueva. Es el mismo gesto del telón de la entrada
   (de abajo arriba). Se probaron los paneles laterales de Metalab y se descartaron por
   demasiado parecidos (2026-10-12). Mientras dura, la
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

export default function PortalLayer() {
  const s = useSyncExternalStore(subscribe, () => state, () => state);
  const router = useRouter();
  const path = usePathname();

  // Sin movimiento: cambio directo, sin barrido.
  useEffect(() => {
    if (s.phase === "closing" && s.href && reduced()) {
      router.push(s.href);
      scrollLock.start();
      set({ phase: "idle", href: null });
    }
  }, [s, router]);

  // Tapada la pantalla: en cuanto la ruta es la nueva y ha pintado, reabrir.
  useEffect(() => {
    if (s.phase !== "covered" || path !== s.href) return;
    let a = 0;
    let b = 0;
    const t = setTimeout(() => {
      a = requestAnimationFrame(() => (b = requestAnimationFrame(() => set({ ...state, phase: "opening" }))));
    }, DUR.fast * 1000);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
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
        className="absolute inset-0 bg-[var(--case-fg)]"
        initial={{ clipPath: below }}
        animate={{ clipPath: shut ? SHUT : above }}
        transition={shut ? { duration: DUR.base, ease: EASE.screen } : { duration: DUR.base, ease: EASE.inOut }}
        onAnimationComplete={() => {
          if (state.phase === "closing" && state.href) {
            set({ ...state, phase: "covered" });
            router.push(state.href);
          } else if (state.phase === "opening") {
            set({ phase: "idle", href: null });
            scrollLock.start();
          }
        }}
      />
    </div>
  );
}
