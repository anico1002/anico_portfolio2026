"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import PhoneFrame from "./PhoneFrame";

/* La app (Gloop, 2026-10-13, feedback de Alberto): «el prototipo no es un simple prototipo, es una app
   lista para las stores». Momento a sangre sobre una foto de fiesta (no los brillos, que ya salen con el
   portátil): la ventana se abre con el scroll, el móvil se queda a un lado con la app en marcha y el
   texto aparece al otro y se mantiene un rato, para que se vean las pantallas en movimiento.
   Pendiente de hablar: que se llegue aquí con un zoom desde la pantalla del portátil del design system. */

export default function NativeApp() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useTransform(p, [0, 0.35], [14, 0]);
  const side = useTransform(p, [0, 0.35], [22, 0]);
  const clipPath = useTransform([inset, side], ([i, s]) => `inset(${i}% ${s}% ${i}% ${s}%)`);
  const bgScale = useTransform(p, [0, 1], [1.25, 1.05]);
  const phoneY = useTransform(p, [0, 0.45], [140, 0]);

  return (
    <div ref={ref} className={`relative mt-36 md:mt-56 ${reduce ? "" : "h-[240vh]"}`}>
      <motion.div
        className={`${reduce ? "relative" : "sticky top-0"} h-[100svh] overflow-hidden`}
        style={reduce ? undefined : { clipPath }}
      >
        { }
        <motion.img
          src="/maqueta/gloop/media/party-ev2.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale: reduce ? 1.05 : bgScale, filter: "brightness(0.45) saturate(1.1)" }}
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-black/50" />
        <div className="relative grid h-full grid-cols-12 items-center gap-x-4 px-4 text-white md:gap-x-6 md:px-6">
          <motion.div className="col-span-7 col-start-3 md:col-span-3 md:col-start-3" style={reduce ? undefined : { y: phoneY }}>
            <PhoneFrame src="/maqueta/gloop/media/scr-nativa.mp4" label="La app de Gloop en marcha" className="mx-auto max-w-[190px] md:max-w-[300px]" />
          </motion.div>
          <div className="col-span-12 mt-8 md:col-span-4 md:col-start-8 md:mt-0">
            <FadeIn>
              <p className="t-label t-tag text-white/60">La app</p>
            </FadeIn>
            <Lines as="h2" className="mt-4 t-statement">
              No es un prototipo. Es una app nativa, lista para las stores.
            </Lines>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
