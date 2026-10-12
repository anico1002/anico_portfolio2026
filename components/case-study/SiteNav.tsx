"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/case-study/ThemeToggle";
import { TLink, go } from "@/components/case-study/Portal";
import { scrollLock } from "@/components/case-study/SmoothScroll";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";

/** Nav común de las maquetas: logo (lleva a la entrada) + menú + sol/luna. `mix-blend-difference`
    para que se lea sobre cualquier fondo (también encima de imágenes y vídeos).

    B2 · Con el scroll (de 50 a 400 px, como Metalab) la barra se recoge en una placa de cristal
    detrás del menú: es una capa aparte y SIN mezcla, porque la mezcla solo funciona si el texto
    está en el mismo contexto de apilado que la página. Como la placa es del color del fondo, el
    texto en `difference` encima sale del color del texto: se lee igual en claro y en oscuro.
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
  const group = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [open, setOpen] = useState(false);

  // La placa se mide sobre el grupo de la derecha (menú + sol/luna); la nav es fija, así que
  // solo cambia al redimensionar o cuando carga la fuente.
  useLayoutEffect(() => {
    const m = () => {
      const r = group.current?.getBoundingClientRect();
      if (r) setBox({ left: r.left, top: r.top, width: r.width, height: r.height });
    };
    m();
    document.fonts?.ready.then(m);
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const { scrollY } = useScroll();
  const p = useTransform(scrollY, [50, 400], [0, 1]);
  // De barra a todo el ancho (transparente) a placa ajustada al menú.
  const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
  const padX = 14;
  const padY = 9;
  const left = useTransform(p, [0, 1], [0, (box?.left ?? 0) - padX]);
  const width = useTransform(p, [0, 1], [vw, (box?.width ?? 0) + padX * 2]);
  const top = useTransform(p, [0, 1], [0, (box?.top ?? 0) - padY]);
  const height = useTransform(p, [0, 1], [(box?.top ?? 0) * 2 + (box?.height ?? 0), (box?.height ?? 0) + padY * 2]);

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
      {box && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-40"
          style={{
            left,
            top,
            width,
            height,
            opacity: p,
            background: "color-mix(in srgb, var(--case-bg) 62%, transparent)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />
      )}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 mix-blend-difference md:px-6">
        <TLink href="/maqueta" aria-label="anico · inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/anico_logo.svg" alt="anico" className="h-[1.125rem] w-auto invert md:h-[1.375rem]" />
        </TLink>
        <div ref={group} className="flex items-center gap-4 whitespace-nowrap t-nav text-white md:gap-6">
          {items.map(([key, label, href]) => (
            <TLink
              key={key}
              href={href}
              className={`hidden md:inline ${key === active ? "" : "opacity-50 hov hover:opacity-100"}`}
            >
              {label}
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
