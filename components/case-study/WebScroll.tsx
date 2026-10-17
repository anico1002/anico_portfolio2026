"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import Img from "@/components/case-study/Img";

/* Una web entera dentro de la máscara que se abre (2026-10-16, feedback de SwifT). La ventana se abre
   igual que WindowReveal y, ya a pantalla completa, se queda fija mientras el scroll recorre la página de
   arriba abajo, con su barra de navegación quieta encima como en la web de verdad. Es una captura a toda
   página (WebP), no un vídeo: pesa diez veces menos y el ritmo lo lleva quien lee. */

/** Alto de la barra del sitio (SiteNav, h-[3.5rem]): la web va debajo para que las dos barras no se pisen. */
const TOP = 56;

export default function WebScroll({
  page,
  nav,
  ratio,
  navRatio,
  label,
  hold = 0.4,
}: {
  /** Captura de la página sin la barra de arriba. */
  page: string;
  /** Barra de navegación, aparte (se queda fija). */
  nav?: string;
  /** Alto / ancho de la página y de la barra. */
  ratio: number;
  navRatio?: number;
  label: string;
  /** Pausa al final, en pantallas. */
  hold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const [m, setM] = useState({ vh: 900, travel: 3000 });
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const navH = navRatio ? vw * navRatio : 0;
      setM({ vh, travel: Math.max(0, vw * ratio - (vh - navH - TOP)) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ratio, navRatio]);

  const total = m.vh + m.travel + hold * m.vh; // alto del contenedor
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const openEnd = m.vh / total;
  const travelEnd = (m.vh + m.travel) / total;
  const inset = useTransform(scrollYProgress, [0.05 * openEnd, openEnd], [18, 0]);
  const side = useTransform(scrollYProgress, [0.05 * openEnd, openEnd], [26, 0]);
  const clipPath = useTransform([inset, side], ([i, s]) => `inset(${i}% ${s}% ${i}% ${s}%)`);
  const scale = useTransform(scrollYProgress, [0, openEnd], [1.3, 1]);
  const y = useTransform(scrollYProgress, [openEnd, travelEnd], [0, -m.travel]);

  // Franja blanca para la barra del sitio y, debajo, la barra de la web, quieta.
  const bar = (
    <div className="absolute inset-x-0 top-0 z-10 bg-white" style={{ paddingTop: TOP }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {nav && <Img src={nav} alt="" className="block w-full" />}
    </div>
  );
  const padTop = `calc(${TOP}px + ${navRatio ? navRatio * 100 : 0}vw)`;

  if (reduce)
    return (
      <div className="relative h-[100svh] w-full overflow-hidden bg-white">
        {bar}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Img src={page} alt={label} className="w-full" style={{ marginTop: padTop }} />
      </div>
    );

  return (
    <div ref={ref} className="relative w-full" style={{ height: total }}>
      <motion.div className="sticky top-0 h-screen w-full overflow-hidden bg-white" style={{ clipPath }}>
        <motion.div className="relative h-full w-full" style={{ scale }}>
          {bar}
          <motion.div style={{ y, paddingTop: padTop }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Img src={page} alt={label} className="block w-full" loading="lazy" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
