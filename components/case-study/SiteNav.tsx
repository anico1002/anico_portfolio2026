"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/case-study/ThemeToggle";
import RollText from "@/components/case-study/RollText";
import Inked from "@/components/case-study/Inked";
import { TLink, go } from "@/components/case-study/Portal";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";

/** Nav común de las maquetas: logo (lleva a la entrada) + menú + sol/luna. Cada pieza lleva tinta
    adaptativa (`Inked`): blanco o negro puro según lo que pase por detrás. Antes era
    `mix-blend-difference`, que sobre grises medios dejaba el logo gris sobre gris (2026-10-12).

    Sin placa de fondo (se probó la de Metalab y se descartó, 2026-10-12): se queda en su sitio
    cambiando de tinta según lo que pase por detrás.
    Hover: las letras ruedan dentro de su máscara, una tras otra (`RollText`).
    B3 · En móvil los cuatro enlaces no caben: «Menú» abre una capa propia que baja con máscara y
    palabras grandes que suben con máscara (Yakushev). */

const items = [
  ["product", "Product", "/maqueta/home"],
  ["games", "Games", "/maqueta/games"],
  ["about", "Sobre mí", "/maqueta/sobre-mi"],
  ["contact", "Contacto", "/maqueta/contacto"],
] as const;

type Key = (typeof items)[number][0];

/** `menu={false}`: solo logo y sol/luna (en la entrada partida, donde las dos mitades ya son
    la elección y un menú encima sobraría). `docked`: la barra no va fija arriba sino en el flujo
    de la página; quien la monta la coloca (en las homes, al pie de la cabecera y `sticky`).
    `parts`: en las homes el logo y el menú van por separado (2026-10-12): el logo fijo arriba desde
    el principio y el menú al pie de la cabecera, para leer en orden logo → titular → menú. */
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
        className={`${docked ? "relative" : "fixed inset-x-0 top-0 z-50"} flex h-[3.5rem] items-center ${parts === "menu" ? "justify-end" : "justify-between"} px-4 md:px-6 ${parts === "logo" ? "pointer-events-none" : ""}`}
      >
        {parts !== "menu" && (
          <TLink href="/maqueta" aria-label="anico · inicio" className="pointer-events-auto">
            <Inked className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anico_logo.svg" alt="anico" className="ink-logo h-[1.125rem] w-auto md:h-[1.375rem]" />
            </Inked>
          </TLink>
        )}
        {parts !== "logo" && (
          <div className="flex items-center gap-4 whitespace-nowrap t-nav md:gap-6">
            {menu && items.map(([key, label, href]) => (
              <TLink
                key={key}
                href={href}
                aria-current={key === active ? "page" : undefined}
                className={`hidden md:inline ${key === active ? "" : "opacity-50 hov hover:opacity-100"}`}
              >
                {/* La sección en la que ya estás no reacciona al hover. */}
                <Inked>{key === active ? label : <RollText text={label} />}</Inked>
              </TLink>
            ))}
            {menu && (
              <button type="button" onClick={() => setOpen(true)} className="md:hidden" aria-expanded={open}>
                <Inked>Menú</Inked>
              </button>
            )}
            <Inked className="flex">
              <ThemeToggle />
            </Inked>
          </div>
        )}
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal
            aria-label="Menú"
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--case-bg)] px-4 pb-8 text-[var(--case-fg)] md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: DUR.base, ease: EASE.inOut } }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: DUR.fast, ease: EASE.inOut } }}
          >
            <div className="flex items-center justify-between py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anico_logo.svg" alt="anico" className="h-[1.125rem] w-auto dark-invert" />
              <button type="button" onClick={() => setOpen(false)} className="t-nav">
                Cerrar
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
                      setOpen(false);
                      go(href);
                    }}
                  >
                    {label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
