"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/case-study/ThemeToggle";
import BlurText from "@/components/case-study/BlurText";
import { TLink, go } from "@/components/case-study/Portal";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";

/** Nav común de las maquetas: logo (lleva a la entrada) + menú + sol/luna. `mix-blend-difference`
    para que se lea sobre cualquier fondo (también encima de imágenes y vídeos).

    Sin placa de fondo (se probó la de Metalab y se descartó, 2026-10-12): se queda en su sitio
    invirtiéndose según lo que pase por detrás, como Yakushev.
    Hover: las letras se desenfocan y vuelven a enfocar una tras otra (`BlurText`), el mismo
    lenguaje de desenfoque → foco con el que entran los textos.
    B3 · En móvil los cuatro enlaces no caben: «Menú» abre una capa propia con desenfoque y
    palabras grandes que suben con máscara (Yakushev). */

const items = [
  ["product", "Product", "/maqueta/home"],
  ["games", "Games", "/maqueta/games"],
  ["about", "Sobre mí", "/maqueta/sobre-mi"],
  ["contact", "Contacto", "/maqueta/contacto"],
] as const;

type Key = (typeof items)[number][0];

export default function SiteNav({ active = "product" }: { active?: Key | null }) {
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
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 mix-blend-difference md:px-6">
        <TLink href="/maqueta" aria-label="anico · inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/anico_logo.svg" alt="anico" className="h-[1.125rem] w-auto invert md:h-[1.375rem]" />
        </TLink>
        <div className="flex items-center gap-4 whitespace-nowrap t-nav text-white md:gap-6">
          {items.map(([key, label, href]) => (
            <TLink
              key={key}
              href={href}
              className={`hidden md:inline ${key === active ? "" : "opacity-50 hov hover:opacity-100"}`}
            >
              <BlurText text={label} />
            </TLink>
          ))}
          <button type="button" onClick={() => setOpen(true)} className="md:hidden" aria-expanded={open}>
            Menú
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            role="dialog"
            aria-modal
            aria-label="Menú"
            className="fixed inset-0 z-[70] flex flex-col bg-[color-mix(in_srgb,var(--case-bg)_72%,transparent)] px-4 pb-8 text-[var(--case-fg)] [backdrop-filter:blur(30px)] [-webkit-backdrop-filter:blur(30px)] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: DUR.base, ease: EASE.out } }}
            exit={{ opacity: 0, transition: { duration: DUR.fast, ease: EASE.out } }}
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
