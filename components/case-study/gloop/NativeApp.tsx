"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Lines from "@/components/case-study/Lines";
import { FadeIn } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import LazyVideo from "@/components/case-study/LazyVideo";

/* La app (Gloop, 2026-10-13, feedback de Alberto): «el prototipo no es un simple prototipo, es una app
   lista para las stores». Momento a sangre: la ventana se abre con el scroll y se mantiene un rato.
   2026-10-14: en vez de un móvil dibujado encima de una foto, el mockup del móvil en mano en la fiesta
   con la app en marcha (el visor de Momentos): `app-mano.mp4`, de scripts/mockups/mockup_video.py con la
   receta `scripts/mockups/recetas/gloop-app.json`. El texto, en el hueco oscuro de la izquierda.
   Pendiente: que se llegue aquí con un zoom desde el portátil del kit. */

export default function NativeApp() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useTransform(p, [0, 0.35], [14, 0]);
  const side = useTransform(p, [0, 0.35], [22, 0]);
  const clipPath = useTransform([inset, side], ([i, s]) => `inset(${i}% ${s}% ${i}% ${s}%)`);
  const bgScale = useTransform(p, [0, 1], [1.12, 1]);

  return (
    <div ref={ref} className={`relative mt-36 md:mt-56 ${reduce ? "" : "h-[240vh]"}`}>
      <motion.div
        className={`${reduce ? "relative" : "sticky top-0"} h-[100svh] overflow-hidden`}
        style={reduce ? undefined : { clipPath }}
      >
        { }
        <motion.div className="absolute inset-0" style={{ scale: reduce ? 1 : bgScale, transformOrigin: "60% 100%" }}>
          <LazyVideo
            src="/maqueta/gloop/media/app-mano.mp4"
            poster="/maqueta/gloop/media/app-mano-poster.jpg"
            aria-label="The Gloop app on a phone, in hand, in the middle of a concert: the night’s photos go by"
            className="h-full w-full object-cover object-[60%_100%]"
          />
        </motion.div>
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative grid h-full grid-cols-12 items-end gap-x-4 px-4 pb-12 text-white md:items-center md:gap-x-6 md:px-6 md:pb-0">
          <div className="col-span-12 md:col-span-4 md:col-start-2">
            <FadeIn>
              <p className="t-label t-tag text-white/60">The app</p>
            </FadeIn>
            <Lines as="h2" className="mt-4 t-statement">
              Install it, open it, enjoy it. A native app ready for the stores.
            </Lines>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
