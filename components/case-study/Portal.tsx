"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Transición «portal» para TODOS los enlaces internos (B1 de la revisión; la de Metalab):
   dos paneles del color invertido cierran desde los bordes hacia la línea central, se cambia
   de página con la pantalla tapada y reabren desde el centro hacia fuera. Mientras dura, la
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

  // Sin movimiento: cambio directo, sin paneles.
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
  const panel = (side: "left" | "right") => {
    const open = side === "left" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
    return (
      <motion.div
        className={`absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} w-1/2 bg-[var(--case-fg)]`}
        initial={{ clipPath: open }}
        animate={{ clipPath: shut ? SHUT : open }}
        transition={shut ? { duration: DUR.base, ease: EASE.screen } : { duration: DUR.base, ease: EASE.inOut }}
        onAnimationComplete={() => {
          if (side !== "left") return;
          if (state.phase === "closing" && state.href) {
            set({ ...state, phase: "covered" });
            router.push(state.href);
          } else if (state.phase === "opening") {
            set({ phase: "idle", href: null });
            scrollLock.start();
          }
        }}
      />
    );
  };
  return (
    <div aria-hidden className="fixed inset-0 z-[90]">
      {panel("left")}
      {panel("right")}
    </div>
  );
}
