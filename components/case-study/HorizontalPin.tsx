"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";

/* Sección que se queda fija mientras el scroll vertical la recorre en horizontal (2026-10-13; el mismo
   gesto que la línea de proceso de Gloop). `head` va arriba, fijo; `children` es la tira de piezas. En
   móvil y con movimiento reducido se convierte en una lista vertical normal. */

export default function HorizontalPin({
  head,
  children,
  className = "",
}: {
  head: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      setWide(mq.matches);
      const t = track.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 48));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    mq.addEventListener("change", measure);
    return () => (ro.disconnect(), mq.removeEventListener("change", measure));
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.08, 0.95], [0, -dist]);
  const pinned = wide && !reduce;

  return (
    <div ref={ref} className={`relative ${className}`} style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-10"}>
        <div className="px-4 md:px-6">{head}</div>
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={`mt-12 flex gap-6 px-4 md:mt-16 md:gap-8 md:px-6 ${pinned ? "w-max" : "flex-col"}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
