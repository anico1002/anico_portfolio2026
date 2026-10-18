"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import RollText from "@/components/case-study/RollText";
import { createPortal } from "react-dom";
import { TLink, go } from "@/components/case-study/Portal";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { SECTION_COUNT } from "@/lib/maqueta/cases";
import { LINKEDIN, email } from "@/lib/maqueta/contact";
import Arrow from "@/components/case-study/Arrow";
import LogoAnico from "@/components/case-study/LogoAnico";

/** En la cabecera el bucle es un guiño de vez en cuando (Alberto, 2026-10-18): unos 15 s formado entre vueltas. */
const WINK = 15000;

const noop = () => () => {};

/** Dos líneas (feedback 2026-10-17: «Menu» en texto pasa a hamburguesa de dos rayas); abierto, las rayas se cruzan
    en una X. */
function Burger({ x = false }: { x?: boolean }) {
  const line = "absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300";
  return (
    <span aria-hidden className="relative block h-[10px] w-6">
      <span className={`${line} top-0 ${x ? "translate-y-[4.25px] rotate-45" : ""}`} />
      <span className={`${line} bottom-0 ${x ? "-translate-y-[4.25px] -rotate-45" : ""}`} />
    </span>
  );
}

/** Nav común de las maquetas: logo (lleva a la entrada) + menú + sol/luna, en blanco con
    `mix-blend-difference` (la inversión por píxel de Yakushev). Se probó una tinta adaptativa que
    medía el fondo y cambiaba el logo entero, pero saltaba con retraso (2026-10-12): los grises medios,
    donde la diferencia deja gris sobre gris, se evitan con un degradado del fondo bajo la barra en
    las cabeceras con imagen. Si va acoplada (`docked`), la mezcla la pone la capa que la envuelve.

    Sin placa de fondo (se probó la de Metalab y se descartó, 2026-10-12): se queda en su sitio
    cambiando de tinta según lo que pase por detrás.
    Hover: las letras ruedan dentro de su máscara, una tras otra (`RollText`).
    B3 · En móvil los cuatro enlaces no caben: la hamburguesa abre una capa propia que baja con máscara y
    palabras grandes que suben con máscara (Yakushev). */

const items = [
  ["product", "Product", "/maqueta/home"],
  ["games", "Games", "/maqueta/games"],
  // About es un bloque al final de cada home (2026-10-17): lleva al de la sección en la que estás. Contact sale del
  // menú: el contacto está en el pie de todas las páginas. Las dos páginas siguen en app/maqueta, sin enlazar.
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
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);
  // «#about» va al bloque About de la home de la sección en la que estás (Games o Product).
  const to = (href: string) => (href.startsWith("#") ? `${active === "games" ? "/maqueta/games" : "/maqueta/home"}${href}` : href);
  // El menú de móvil se monta en #case-root (fuera de la barra): la barra lleva mezcla por diferencia
  // y, si el menú fuera dentro, se invertiría con ella.
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRoot(document.getElementById("case-root")));
    return () => cancelAnimationFrame(id);
  }, []);

  // Menú de móvil abierto: scroll parado; se cierra solo si la pantalla pasa a escritorio.
  useEffect(() => {
    if (!open) return;
    scrollLock.stop();
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => {
      scrollLock.start();
      mq.removeEventListener("change", close);
    };
  }, [open]);

  return (
    <>
      <nav
        className={`${docked ? "relative" : "fixed inset-x-0 top-0 z-50 mix-blend-difference"} flex h-[3.5rem] items-center ${parts === "menu" ? "justify-end" : "justify-between"} px-4 md:px-6 ${parts !== "all" ? "pointer-events-none" : ""}`}
      >
        {parts !== "menu" && (
          <TLink href="/maqueta" aria-label="anico · home" className="pointer-events-auto">
            {/* Logo nuevo en bucle (2026-10-18, a prueba). El de antes sigue en public/anico_logo.svg. */}
            <LogoAnico loop rest={WINK} className="h-[1.125rem] w-auto text-white md:h-[1.375rem]" />
          </TLink>
        )}
        {parts !== "logo" && (
          <div className="pointer-events-auto flex items-center gap-4 whitespace-nowrap t-nav text-white md:gap-6">
            {menu && items.map(([key, label, href]) => (
              <TLink
                key={key}
                href={to(href)}
                aria-current={key === active ? "page" : undefined}
                className={`hidden md:inline ${key === active ? "" : "opacity-50 hov hover:opacity-100"}`}
              >
                {/* La sección en la que ya estás no reacciona al hover. */}
                {key === active ? label : <RollText text={label} />}
                <Count k={key} />
              </TLink>
            ))}
            {menu && (
              <button
                type="button"
                onClick={() => {
                  setOpenAt(path);
                  setOpen(true);
                }}
                className="-m-3 p-3 md:hidden"
                aria-expanded={open}
                aria-label="Open menu"
              >
                <Burger />
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
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--case-bg)] px-4 pb-8 text-[var(--case-fg)] md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: DUR.base, ease: EASE.inOut } }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: DUR.fast, ease: EASE.inOut } }}
          >
            <div className="flex items-center justify-between py-4">
              <LogoAnico loop rest={WINK} className="h-[1.125rem] w-auto" />
              {/* Misma caja que la hamburguesa de la barra: la X sale justo donde estaban las dos rayas. */}
              <button type="button" onClick={() => setOpen(false)} className="-m-3 p-3" aria-label="Close menu">
                <Burger x />
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
                      // Otra página: la cortinilla tapa el menú y este se cierra al llegar (ver `openAt`).
                      if (dest.split("#")[0] !== window.location.pathname) return go(dest);
                      // La misma página (About desde su home): primero se cierra el menú, que tiene el scroll parado;
                      // con él parado el desplazamiento hasta la sección no hacía nada (feedback 2026-10-17).
                      setOpen(false);
                      requestAnimationFrame(() => requestAnimationFrame(() => go(dest)));
                    }}
                  >
                    {label}
                    <Count k={key} big />
                  </motion.button>
                </li>
              ))}
            </ul>
            <motion.div
              className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 t-small text-[var(--case-muted)]"
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
        )}
      </AnimatePresence>,
          root
        )}
    </>
  );
}
