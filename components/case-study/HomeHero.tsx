"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { endCurtain, useCurtain } from "@/components/case-study/Curtain";
import { MaskText } from "@/components/case-study/primitives";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Cabecera de la home de una sección (2026-10-12; antes era un titular estático y se sentía
   muy quieta). Continúa la entrada partida sin corte: pase de imágenes a pantalla completa
   con el titular de la sección en el centro y, después, la imagen se recoge con una máscara de
   abajo arriba hasta dejar abajo una franja del alto justo del texto de intro.

   Llegando desde la entrada, el telón del layout está encima con la misma imagen, velo y
   titular: esta cabecera arranca idéntica y, cuando ha pintado esa imagen, le pide al telón
   que se funda (`endCurtain`). Entrando directo, la imagen aparece con la máscara de siempre
   y hace la misma retirada. */

const SLIDE_MS = 2600; // cada diapositiva del pase (fundido + zoom lento de salida)

export default function HomeHero({ label, title, slides }: { label: string; title: string; slides: readonly string[] }) {
  const reduce = useReducedMotion();
  const curtain = useCurtain();
  // Se decide en el primer render: si hay telón, arrancar igual que él (su imagen, su titular).
  const [arrived] = useState(() => !!curtain);
  const [i, setI] = useState(() => Math.max(0, curtain ? slides.indexOf(curtain.src) : 0));
  const [band, setBand] = useState(0); // alto de la franja del texto, en px
  const [retracted, setRetracted] = useState(false);
  const text = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLImageElement>(null);

  // La franja mide lo que ocupe el texto (con sus márgenes): cambia con el ancho de pantalla.
  useLayoutEffect(() => {
    const el = text.current;
    if (!el) return;
    const m = () => setBand(el.getBoundingClientRect().height);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Relevo con el telón: cuando la primera imagen está pintada, el telón se funde; la retirada
  // empieza cuando el fundido ya va por la mitad. Directo: la máscara de entrada y luego retirada.
  useEffect(() => {
    let t = 0;
    const go = () => {
      if (arrived) endCurtain();
      t = window.setTimeout(() => setRetracted(true), (arrived ? DUR.slow + DUR.fast : DUR.base + DUR.fast) * 1000);
    };
    const img = first.current;
    if (img && !(img.complete && img.naturalWidth)) img.decode().then(go, go);
    else go();
    return () => clearTimeout(t);
  }, [arrived]);

  // Pase de imágenes (siempre en marcha: también en la franja).
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [reduce, slides.length]);

  const full = "inset(0% 0% 0px 0%)";
  const clipped = `inset(0% 0% ${band}px 0%)`;
  const hiddenBelow = "inset(100% 0% 0px 0%)";

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: arrived || reduce ? full : hiddenBelow }}
        animate={{ clipPath: retracted ? clipped : full }}
        transition={retracted ? { duration: DUR.slow, ease: EASE.inOut } : { duration: DUR.base, ease: EASE.inOut }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={slides[i]}
            ref={first}
            src={slides[i]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: DUR.base, ease: EASE.inOut }, scale: { duration: DUR.drift, ease: EASE.out } }}
          />
        </AnimatePresence>
        {/* Velo: el del telón (para que el relevo sea exacto) y se aclara al recogerse. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0.45 }}
          animate={{ opacity: retracted ? 0.15 : 0.45 }}
          transition={{ duration: DUR.slow, ease: EASE.inOut }}
        />
        {/* Titular de la sección en el centro (como en el telón): se desenfoca y se va al recogerse. */}
        <motion.p
          aria-hidden
          className="absolute inset-0 flex items-center justify-center t-d3 text-white"
          initial={arrived ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(14px)" }}
          animate={retracted ? { opacity: 0, filter: "blur(14px)" } : { opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: DUR.base, ease: EASE.out }}
        >
          {label}
        </motion.p>
        {/* Precarga del resto del pase. */}
        <div className="hidden">
          {slides.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s} src={s} alt="" />
          ))}
        </div>
      </motion.div>

      {/* Franja de abajo: el texto de intro, que entra cuando la imagen ya se está recogiendo. */}
      <div ref={text} className="absolute inset-x-0 bottom-0 px-4 pb-6 pt-8 md:px-6 md:pb-8 md:pt-10">
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <h1 className="col-span-12 md:col-span-10 lg:col-span-9">
            {retracted ? (
              <MaskText delay={DUR.slow / 2}>
                <span className="block t-hero">{title}</span>
              </MaskText>
            ) : (
              <span className="block t-hero opacity-0">{title}</span>
            )}
          </h1>
        </div>
      </div>
    </section>
  );
}
