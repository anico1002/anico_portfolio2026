"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { TLink, go } from "@/components/case-study/Portal";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { SECTION_COUNT } from "@/lib/maqueta/cases";
import { LINKEDIN, email } from "@/lib/maqueta/contact";
import Arrow from "@/components/case-study/Arrow";
import LogoAnico from "@/components/case-study/LogoAnico";
import RollText from "@/components/case-study/RollText";
import { BASE, bare } from "@/lib/maqueta/base";

/** En la cabecera el bucle es un guiño de vez en cuando (Alberto, 2026-10-18): unos 15 s formado entre vueltas. */
const WINK = 15000;

const noop = () => () => {};
/** Colores del tema oscuro para la capa del menú, sea cual sea el de la página. */
const DARK = { "--case-bg": "#000000", "--case-fg": "#F4F4F5", "--case-muted": "rgba(244,244,245,0.56)" } as React.CSSProperties;

/** Nav común de las maquetas: logo (lleva a la entrada) + menú + sol/luna, en blanco con
    `mix-blend-difference` (la inversión por píxel de Yakushev). Se probó una tinta adaptativa que
    medía el fondo y cambiaba el logo entero, pero saltaba con retraso (2026-10-12): los grises medios,
    donde la diferencia deja gris sobre gris, se evitan con un degradado del fondo bajo la barra en
    las cabeceras con imagen. Si va acoplada (`docked`), la mezcla la pone la capa que la envuelve.

    Sin placa de fondo (se probó la de Metalab y se descartó, 2026-10-12): se queda en su sitio
    cambiando de tinta según lo que pase por detrás.
    Hover: las letras ruedan dentro de su máscara, una tras otra (`RollText`).
    B3 · La hamburguesa abre una capa propia que baja con máscara y palabras grandes que suben con máscara. Desde el
    2026-10-29 también en escritorio (antes ahí el menú iba en texto, como en Yakushev): siempre en negro. */

const items = [
  ["product", "Product", `${BASE}/product`],
  ["games", "Games", `${BASE}/games`],
  // About es un bloque al final de cada home (2026-10-17): lleva al de la sección en la que estás. Contact sale del
  // menú: el contacto está en el pie de todas las páginas. Las dos páginas siguen en app/new, sin enlazar.
  ["about", "About", "#about"],
] as const;

type Key = (typeof items)[number][0];

/** Recuento de proyectos en superíndice junto a Product y Games (D5): informa de cuánto hay en cada
    sección antes de entrar. Fuera del rodillo del hover, y con su propio texto para lectores de
    pantalla («12 proyectos»). */
function Count({ k, big = false }: { k: Key; big?: boolean }) {
  const n = k === "product" || k === "games" ? SECTION_COUNT[k] : null;
  if (n == null) return null;
  return (
    <sup className={big ? "nav-count nav-count-big" : "nav-count"}>
      <span aria-hidden>({n})</span>
      <span className="sr-only">, {n} projects</span>
    </sup>
  );
}

/** Hamburguesa que nace del logo (2026-10-29, idea de Alberto para separarnos del menú en texto de Yakushev). Al cargar,
    a la vez que el logo: un módulo del logo (un cuadrado del alto de sus letras) crece desde abajo donde empezaba
    «Product», se estira hacia la derecha hasta donde acababa «About» y, antes de llegar, se recoge desde la izquierda con
    el mismo easing. Queda otra vez un cuadrado y se parte en tres franjas: arriba y abajo son las rayas, la del medio es
    el hueco (como las dos mitades de cada letra del logo). Abierta, las rayas se cruzan en una X. */
function Burger({ x = false, intro = false }: { x?: boolean; intro?: boolean }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLSpanElement>(null);
  const span = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"bar" | "split">(intro && !reduce ? "bar" : "split");
  // Bordes izquierdo y derecho del bloque (px, desde la izquierda del cuadrado final) y su alto (0–1).
  const l = useMotionValue(0), r = useMotionValue(0), h = useMotionValue(0);
  const width = useTransform(() => r.get() - l.get());
  const height = useTransform(h, (v) => `${v * 100}%`);
  useEffect(() => {
    if (phase !== "bar" || !box.current || !span.current) return;
    const s = box.current.offsetHeight, off = span.current.offsetWidth - s;
    l.set(-off);
    r.set(-off + s);
    // Con caña (feedback 2026-10-29: la primera era lenta): curva de pantalla, más marcada, y tiempos cortos.
    const run: AnimationPlaybackControls[] = [];
    let alive = true;
    (async () => {
      run.push(animate(h, 1, { duration: DUR.fast, ease: EASE.screen }));
      await run[0];
      run.push(animate(r, s, { duration: 0.6, ease: EASE.screen }));
      run.push(animate(l, 0, { duration: 0.6, ease: EASE.screen, delay: 0.2 }));
      await run[2];
      if (alive) setPhase("split");
    })();
    return () => {
      alive = false;
      run.forEach((c) => c.stop());
    };
  }, [phase, l, r, h]);
  // El cuadrado se parte en tres: las franjas de arriba y abajo se afinan hasta quedar en rayas (feedback 2026-10-29:
  // finas) pegadas al hueco del medio. Abierta, las dos rayas se van al centro y se cruzan en una X.
  const LINE = "1.5px";
  const born = intro && !reduce;
  const top = x ? { top: "50%", height: LINE, y: "-50%", rotate: 45 } : { top: "33.334%", height: LINE, y: "-100%", rotate: 0 };
  const bot = x ? { top: "50%", height: LINE, y: "-50%", rotate: -45 } : { top: "66.667%", height: LINE, y: "0%", rotate: 0 };
  const t = { duration: DUR.fast, ease: EASE.screen };
  return (
    <span ref={box} aria-hidden className="relative block size-[1.125rem] md:size-[1.375rem]">
      {phase === "bar" ? (
        <>
          {/* Recorrido: lo que ocupaba el menú en texto (Product, Games, About), medido con su misma letra. */}
          <span ref={span} className="invisible absolute right-0 top-0 flex gap-4 whitespace-nowrap t-nav md:gap-6">
            {items.map(([key, label]) => (
              <span key={key}>
                {label}
                <Count k={key} />
              </span>
            ))}
          </span>
          <motion.span className="absolute bottom-0 bg-current" style={{ left: l, width, height }} />
        </>
      ) : (
        <>
          <motion.span
            className="absolute inset-x-0 bg-current"
            initial={born ? { top: "0%", height: "50%", y: "0%", rotate: 0 } : false}
            animate={top}
            transition={t}
          />
          <motion.span
            className="absolute inset-x-0 bg-current"
            initial={born ? { top: "50%", height: "50%", y: "0%", rotate: 0 } : false}
            animate={bot}
            transition={t}
          />
        </>
      )}
    </span>
  );
}

/** La X de cerrar del menú: nace como las dos rayas de la barra y se cruza al abrir (feedback 2026-10-29). */
function CloseX() {
  const [x, setX] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setX(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return <Burger x={x} />;
}

/** `menu={false}`: solo logo y sol/luna (en la entrada partida, donde las dos mitades ya son
    la elección y un menú encima sobraría). `docked`: la barra no va fija arriba sino en el flujo
    de la página; quien la monta la coloca (en las homes, al pie de la cabecera y `sticky`).
    `parts`: en las homes el logo y el menú van por separado (2026-10-12): el logo fijo arriba desde
    el principio y el menú al pie de la cabecera, para leer en orden logo → titular → menú. Cada
    barra deja pasar los clics salvo en su contenido: si no, el menú pegado arriba tapaba el logo. */
export default function SiteNav({
  active = "product",
  menu = true,
  docked = false,
  parts = "all",
}: {
  active?: Key | null;
  menu?: boolean;
  docked?: boolean;
  parts?: "all" | "logo" | "menu";
}) {
  const [open, setOpen] = useState(false);
  // Al cambiar de página se cierra solo: así, al elegir Product o Games, el menú se queda puesto y la cortinilla sube
  // por encima de él (antes se recogía hacia arriba mientras la cortinilla subía: se veía un salto entre medias).
  const path = usePathname();
  const [openAt, setOpenAt] = useState(path);
  if (open && openAt !== path) {
    setOpen(false);
    setOpenAt(path);
  }
  // Contacto dentro del menú (2026-10-17): el email se monta en el navegador y se copia al tocarlo, como en el pie.
  const mail = useSyncExternalStore(noop, email, () => "");
  const [copied, setCopied] = useState(false);
  // Saliendo del menú hacia una página: su contenido se funde antes de que entre el logo de carga.
  const [leaving, setLeaving] = useState(false);
  if (!open && leaving) setLeaving(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);
  // «#about» va al bloque About de la home de la sección en la que estás (Games o Product).
  const to = (href: string) => (href.startsWith("#") ? `${active === "games" ? `${BASE}/games` : `${BASE}/product`}${href}` : href);
  // El menú de móvil se monta en #case-root (fuera de la barra): la barra lleva mezcla por diferencia
  // y, si el menú fuera dentro, se invertiría con ella.
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRoot(document.getElementById("case-root")));
    return () => cancelAnimationFrame(id);
  }, []);

  // Menú abierto: scroll parado.
  useEffect(() => {
    if (!open) return;
    scrollLock.stop();
    return () => scrollLock.start();
  }, [open]);

  return (
    <>
      <nav
        className={`${docked ? "relative" : "fixed inset-x-0 top-0 z-50 mix-blend-difference"} flex h-[3.5rem] items-center ${parts === "menu" ? "justify-end" : "justify-between"} px-4 md:px-6 ${parts !== "all" ? "pointer-events-none" : ""}`}
      >
        {parts !== "menu" && (
          <TLink href={BASE} aria-label="anico · home" className="pointer-events-auto">
            {/* Logo nuevo en bucle (2026-10-18, a prueba). El de antes sigue en public/anico_logo.svg. */}
            <LogoAnico loop rest={WINK} className="h-[1.125rem] w-auto text-white md:h-[1.375rem]" />
          </TLink>
        )}
        {parts !== "logo" && (
          <div className="pointer-events-auto flex items-center gap-4 whitespace-nowrap t-nav text-white md:gap-6">
            {menu && (
              <button
                type="button"
                onClick={() => {
                  setOpenAt(path);
                  setOpen(true);
                }}
                className="-m-3 p-3"
                aria-expanded={open}
                aria-label="Open menu"
              >
                <Burger intro />
              </button>
            )}
          </div>
        )}
      </nav>

      {root &&
        createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal
            aria-label="Menu"
            // Siempre en negro (transición a negro, 2026-10-29), también en las páginas claras.
            style={DARK}
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--case-bg)] px-4 pb-8 text-[var(--case-fg)] md:px-6 md:pb-12"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: DUR.base, ease: EASE.inOut } }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: DUR.fast, ease: EASE.inOut } }}
          >
            <motion.div
              className="flex min-h-0 flex-1 flex-col"
              animate={{ opacity: leaving ? 0 : 1 }}
              transition={{ duration: DUR.fast, ease: EASE.inOut }}
            >
            <div className="flex h-[3.5rem] items-center justify-between">
              <LogoAnico loop rest={WINK} className="h-[1.125rem] w-auto md:h-[1.375rem]" />
              {/* Misma caja que la hamburguesa de la barra: la X sale justo donde estaban las dos rayas. */}
              <button type="button" onClick={() => setOpen(false)} className="-m-3 p-3" aria-label="Close menu">
                <CloseX />
              </button>
            </div>
            <ul className="mt-auto space-y-1">
              {items.map(([key, label, href], i) => (
                <li key={key} className="overflow-hidden">
                  <motion.button
                    type="button"
                    className={`block t-h1 ${key === active ? "" : "text-[var(--case-muted)]"}`}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: DUR.base, ease: EASE.inOut, delay: (i + 1) * STAGGER }}
                    onClick={() => {
                      const dest = to(href);
                      const [destPath, hash] = dest.split("#");
                      const same = bare(destPath) === bare(window.location.pathname);
                      // La misma página y una sección (About desde su home): primero se cierra el menú, que tiene el
                      // scroll parado; con él parado el desplazamiento hasta la sección no hacía nada (2026-10-17).
                      if (same && hash) {
                        setOpen(false);
                        requestAnimationFrame(() => requestAnimationFrame(() => go(dest)));
                        return;
                      }
                      // Salida (feedback 2026-10-29): lo del menú se funde, queda el negro y sale el logo de carga
                      // (la cortinilla ya tapada); luego sube como siempre descubriendo la página nueva.
                      setLeaving(true);
                      window.setTimeout(() => {
                        // La sección en la que ya estás (Product desde Product): vuelve a cargar desde arriba, como
                        // recién llegada, con su entrada de cabecera.
                        if (same) {
                          window.scrollTo(0, 0);
                          window.location.reload();
                        } else go(dest, { covered: true });
                      }, DUR.fast * 1000);
                    }}
                  >
                    {/* La ola de letras del menú en texto de antes (RollText, la misma de «Let's talk» en el pie), ahora
                        en el hover de estas. La sección en la que ya estás no reacciona. */}
                    {key === active ? label : <RollText text={label} />}
                    <Count k={key} big />
                  </motion.button>
                </li>
              ))}
            </ul>
            {/* Email y LinkedIn en la esquina inferior derecha (feedback 2026-10-29). */}
            <motion.div
              className="mt-10 flex flex-wrap items-baseline justify-end gap-x-6 gap-y-2 self-end text-right t-small text-[var(--case-muted)] md:absolute md:bottom-12 md:right-6 md:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.base, ease: EASE.out, delay: (items.length + 1) * STAGGER }}
            >
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText(email()).then(() => setCopied(true), () => (window.location.href = `mailto:${email()}`))
                }
                aria-live="polite"
              >
                {copied ? "Email copied ✓" : mail || "Email"}
              </button>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                LinkedIn <Arrow />
              </a>
            </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
          root
        )}
    </>
  );
}
