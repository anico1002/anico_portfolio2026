"use client";

import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Arrow from "@/components/case-study/Arrow";
import RollText from "@/components/case-study/RollText";
import SiteFooter from "@/components/case-study/SiteFooter";
import { TLink } from "@/components/case-study/Portal";
import { Placeholder, YearSup } from "@/components/case-study/primitives";
import { useReduce } from "@/lib/maqueta/reduce";
import type { MoreItem } from "@/lib/maqueta/media";

/* Final de todos los casos (2026-10-16, idea de Alberto sacada de madebyaran.com). El caso termina en una capa
   con fondo propio (`CaseLayer`) que va por encima; debajo, pegada al borde inferior (sticky), espera una pantalla
   entera con todo el final: el carrusel de proyectos de la sección (empezando por el siguiente) y, debajo, el
   «¿Hablamos?» y el pie. Al seguir bajando, el caso sube como un telón y la descubre.
   - El carrusel pasa solo, en bucle, y se puede arrastrar (ratón o dedo) con inercia; si se arrastra, no se abre
     el proyecto al soltar. Al pasar el ratón se para.
   - El «¿Hablamos?» entra cada vez que el telón lo descubre (por el avance del telón, no por estar en pantalla:
     tapado por la capa también «está en pantalla»). */

/** La capa del caso: todo lo que va antes del final, por encima. El testigo del final marca el avance del telón. */
export function CaseLayer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 bg-[var(--case-bg)] pb-32 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] md:pb-48">
      {children}
      <span data-case-layer-end className="absolute inset-x-0 bottom-0 h-px" aria-hidden />
    </div>
  );
}

const SPEED = 40; // px/s del paso automático

function Strip({ items }: { items: MoreItem[] }) {
  const reduce = useReduce();
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const half = useRef(0);
  const drag = useRef({ on: false, moved: 0, v: 0, last: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => (half.current = el.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const wrap = (v: number) => {
    const h = half.current;
    if (!h) return v;
    return ((((v % h) + h) % h) - h); // siempre en (-h, 0]
  };

  useAnimationFrame((_, dt) => {
    const d = drag.current;
    if (d.on) return;
    const s = dt / 1000;
    // Inercia al soltar y, cuando se apaga, el paso automático (parado con el ratón encima o movimiento reducido).
    if (Math.abs(d.v) > 5) {
      x.set(wrap(x.get() + d.v * s));
      d.v *= Math.pow(0.04, s);
    } else if (!hover && !reduce) {
      x.set(wrap(x.get() - SPEED * s));
    }
  });

  const loop = [...items, ...items];
  return (
    <motion.div
      className="cursor-grab select-none overflow-hidden active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onPanStart={() => {
        drag.current = { on: true, moved: 0, v: 0, last: performance.now() };
      }}
      onPan={(_, info) => {
        const d = drag.current;
        d.moved += Math.abs(info.delta.x);
        x.set(wrap(x.get() + info.delta.x));
        d.v = info.velocity.x;
      }}
      onPanEnd={(_, info) => {
        drag.current.on = false;
        drag.current.v = info.velocity.x;
      }}
    >
      <motion.div ref={track} className="flex w-max gap-4 pl-4 md:gap-6 md:pl-6" style={{ x }}>
        {loop.map((c, k) => (
          <TLink
            key={`${c.href}-${k}`}
            href={c.href}
            draggable={false}
            onClickCapture={(e: React.MouseEvent) => {
              // Si se ha arrastrado, soltar no abre el proyecto.
              if (drag.current.moved > 6) {
                e.preventDefault();
                e.stopPropagation();
              }
              drag.current.moved = 0;
            }}
            className="block w-[68vw] shrink-0 sm:w-[18rem] md:w-[22rem] xl:w-[24rem]"
            aria-hidden={k >= items.length || undefined}
            tabIndex={k >= items.length ? -1 : undefined}
          >
            <div className="pointer-events-none overflow-hidden">
              <Placeholder ratio="16/10" src={c.thumb} label={c.name} />
            </div>
            <p className="mt-3 t-title">
              <RollText text={c.name} />
              <YearSup year={c.year} />
            </p>
          </TLink>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function CaseEnd({ items, all }: { items: MoreItem[]; all: { label: string; href: string } }) {
  const ref = useRef<HTMLElement>(null);
  const end = useRef<HTMLElement | null>(null);
  useEffect(() => {
    // El testigo está al final de la capa del caso (hermano anterior). Este efecto va antes que el de useScroll,
    // así que la referencia ya está puesta cuando empieza a medir.
    end.current = (ref.current?.previousElementSibling?.querySelector("[data-case-layer-end]") as HTMLElement) ?? null;
  }, []);
  // 0 cuando el borde de la capa está abajo (empieza a descubrirse), 1 cuando ha llegado arriba (todo a la vista).
  const { scrollYProgress } = useScroll({ target: end, offset: ["start end", "start start"] });
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p > 0.72) setShow(true);
    else if (p < 0.4) setShow(false);
  });

  return (
    <section ref={ref} className="sticky bottom-0 z-0 flex min-h-[100svh] flex-col justify-between overflow-hidden pt-20 md:pt-24">
      <div>
        <div className="flex items-end justify-between gap-6 px-4 md:px-6">
          <p className="t-label t-tag text-[var(--case-muted)]">More projects</p>
          <TLink href={all.href} className="t-small">
            <RollText text={all.label} /> <Arrow />
          </TLink>
        </div>
        <div className="mt-6 md:mt-8">
          <Strip items={items} />
        </div>
      </div>
      <SiteFooter flush show={show} />
    </section>
  );
}
