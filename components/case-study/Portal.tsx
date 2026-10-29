"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { scrollLock, scrollToId } from "@/components/case-study/SmoothScroll";
import LogoAnico from "@/components/case-study/LogoAnico";
import { DUR, EASE } from "@/lib/maqueta/motion";
import { BASE, bare } from "@/lib/maqueta/base";

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
// `instant`: el panel aparece ya cerrado, sin subir (atrás/adelante del navegador: la página ya ha
// cambiado y solo queda taparla y destaparla).
// `push`: aún hay que cambiar de ruta (con `instant` desde el menú; en atrás/adelante ya la ha cambiado el navegador).
let state: { phase: Phase; href: string | null; instant?: boolean; push?: boolean } = { phase: "idle", href: null };
const subs = new Set<() => void>();
const set = (s: typeof state) => {
  state = s;
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Navegar con la transición. Ignora la página actual y los clics durante otra transición. */
export function go(href: string, { covered = false }: { covered?: boolean } = {}) {
  // Enlaces a una sección (#about, 2026-10-17): en la misma página, scroll hasta ella; en otra, se navega y la
  // página nueva baja a la sección al llegar (`takeHash`).
  const [path, hash] = href.split("#");
  if (state.phase !== "idle") return;
  if (bare(path) === bare(window.location.pathname)) {
    if (hash) scrollToId(hash);
    return;
  }
  pendingHash = hash ?? null;
  scrollLock.stop();
  // `covered` (desde el menú, 2026-10-29): la pantalla ya está en negro, así que la cortinilla no sube a taparla;
  // sale directamente el logo de carga y luego sube como siempre.
  set(covered ? { phase: "covered", href: bare(path), instant: true, push: true } : { phase: "closing", href: bare(path) });
}

let pendingHash: string | null = null;
/** La sección a la que hay que bajar al llegar (una sola vez). */
export const takeHash = () => {
  const h = pendingHash;
  pendingHash = null;
  return h;
};

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
        if (!href.startsWith(BASE)) return;
        e.preventDefault();
        go(href);
      }}
    />
  );
}

const SHUT = "inset(0% 0% 0% 0%)";

/** Un giro del rodillo del logo: su duración, la ola de 80 ms de las 5 letras y una pausa breve. */
const ROLL_MS = DUR.base * 1000 + 4 * 80 + 150;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const twoFrames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
/** Una imagen o un vídeo, listos para pintarse sin hueco. */
function isReady(m: HTMLImageElement | HTMLVideoElement): Promise<unknown> {
  if (m instanceof HTMLImageElement) return m.complete && m.naturalWidth ? Promise.resolve() : m.decode();
  if (m.readyState >= 2) return Promise.resolve();
  // Un vídeo perezoso que nadie ha pedido (LazyVideo, `preload="none"`) no va a cargar: está tapado, p. ej. por la
  // máscara de una tarjeta aún sin revelar al saltar a About. Esperarlo alargaba la cortinilla ~3 s (2026-10-20).
  if (m.preload === "none" && m.readyState === 0) return Promise.resolve();
  // Un vídeo, con tope de 2,5 s (2026-10-17): el iPhone a veces no lo empieza a cargar hasta que se reproduce y la
  // cortinilla se quedaba los 6 s del tope general, con pinta de página colgada. Sin él, sale su póster.
  return new Promise<void>((r) => {
    m.addEventListener("loadeddata", () => r(), { once: true });
    setTimeout(r, 2500);
  });
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
  const [, setCycle] = useState(0); // marca el ritmo de la espera (el logo nuevo va en bucle por su cuenta)
  const pathRef = useRef(bare(path));
  useEffect(() => {
    pathRef.current = bare(path);
  }, [path]);

  // Atrás / adelante del navegador (2026-10-13): antes cambiaba de página en seco. El navegador
  // cambia la página al instante y eso no se puede retener, así que el panel la tapa en ese mismo
  // momento, espera a que esté lista (como en cualquier enlace) y la destapa con la segunda mitad
  // del barrido. Mismo gesto que el resto de la web.
  useEffect(() => {
    const onPop = () => {
      if (state.phase !== "idle" || reduced() || bare(window.location.pathname) === pathRef.current) return;
      scrollLock.stop();
      set({ phase: "covered", href: bare(window.location.pathname), instant: true });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (s.phase === "covered" && s.push && s.href) router.push(s.href);
  }, [s, router]);

  const active = s.phase === "closing" || s.phase === "covered";
  useEffect(() => {
    if (!active || reduced()) return;
    let alive = true;
    let ready = false;
    (async () => {
      // Lista = la ruta es la nueva y ya ha pintado fuentes, imágenes y vídeos de la primera
      // pantalla (o han pasado 6 s, para no quedarse nunca tapado).
      const settle = (async () => {
        // Con tope: si la ruta nueva no llegara a coincidir, la página se destapa igual (nunca negro para siempre).
        const t0 = Date.now();
        while (alive && (state.phase !== "covered" || pathRef.current !== state.href) && Date.now() - t0 < 8000) await sleep(50);
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
        className="absolute inset-0 flex items-center justify-center bg-black"
        initial={{ clipPath: s.instant ? SHUT : below }}
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
        {/* Carga: el logo hace el rodillo del menú, en bucle mientras carga la página nueva. La cortinilla es
            siempre negra con el logo blanco (2026-10-17): con el color por página, la del color del texto se
            daba la vuelta a mitad de camino al cambiar de tema debajo (p. ej. al entrar en Games). */}
        {/* Logo nuevo (2026-10-18): el mismo bucle que en la cabecera. El rodillo de antes es LogoLetters. */}
        <LogoAnico loop key={s.href ?? ""} className="h-[1.125rem] w-auto text-white md:h-[1.375rem]" />
      </motion.div>
    </div>
  );
}
