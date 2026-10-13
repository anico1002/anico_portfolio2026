"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* El giro de producto (Gloop, 4-sep-2026, acordado con el cliente): la app deja de girar alrededor de
   los eventos y pasa a girar alrededor del equipo («the team is the container»). Diagrama en dos
   estados que se interpolan con el scroll: antes, el evento en el centro y la gente suelta alrededor;
   después, el equipo en el centro y las noches orbitando. Las fotos son las de la propia app. */

type Node = { id: string; kind: "person" | "night"; label?: string; img?: string; a: [number, number]; b: [number, number] };

// Posiciones en % del lienzo (a = antes, b = después). Después, la gente en anillo alrededor del equipo.
const NODES: Node[] = [
  { id: "p1", kind: "person", a: [16, 22], b: [50.0, 22.0] },
  { id: "p2", kind: "person", a: [82, 18], b: [68.2, 36.0] },
  { id: "p3", kind: "person", a: [88, 64], b: [68.2, 64.0] },
  { id: "p4", kind: "person", a: [70, 88], b: [50.0, 78.0] },
  { id: "p5", kind: "person", a: [22, 84], b: [31.8, 64.0] },
  { id: "p6", kind: "person", a: [8, 52], b: [31.8, 36.0] },
  { id: "n1", kind: "night", label: "Viernes", img: "/maqueta/gloop/media/photo-echoes.jpg", a: [50, 50], b: [16, 18] },
  { id: "n2", kind: "night", label: "Cumpleaños", img: "/maqueta/gloop/media/photo-skyline.jpg", a: [50, 50], b: [84, 22] },
  { id: "n3", kind: "night", label: "Fiesta mayor", img: "/maqueta/gloop/media/photo-splash.jpg", a: [50, 50], b: [82, 80] },
  { id: "n4", kind: "night", label: "Cena del piso", img: "/maqueta/gloop/media/photo-profile.jpg", a: [50, 50], b: [18, 82] },
];

const AVATAR = [G.brand, G.lime, G.accent, G.cyan, G.magenta, "#ffffff"];

function NodeView({ n, k, p }: { n: Node; k: number; p: MotionValue<number> }) {
  const left = useTransform(p, [0.2, 0.7], [`${n.a[0]}%`, `${n.b[0]}%`]);
  const top = useTransform(p, [0.2, 0.7], [`${n.a[1]}%`, `${n.b[1]}%`]);
  // Antes: las noches apiladas en el centro (una sola visible, «el evento»); después, separadas.
  const nightOpacity = useTransform(p, [0.2, 0.45], [n.id === "n1" ? 1 : 0, 1]);
  if (n.kind === "person")
    return (
      <motion.span
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 md:h-12 md:w-12"
        style={{ left, top, borderRadius: "30%", background: AVATAR[k % AVATAR.length], boxShadow: `0 0 0 3px ${G.base}` }}
      />
    );
  return (
    <motion.figure
      className="absolute w-[30%] max-w-[13rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden md:w-[22%]"
      style={{ left, top, opacity: nightOpacity, borderRadius: "0 18px 18px 18px", aspectRatio: "16 / 10" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={n.img} alt="" className="h-full w-full object-cover" loading="lazy" />
      <figcaption
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-[13px] font-semibold text-white"
        style={{ fontFamily: "var(--font-gloop)" }}
      >
        {n.label}
      </figcaption>
    </motion.figure>
  );
}

export default function TeamShift() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = reduce ? scrollYProgress : scrollYProgress;
  const teamOpacity = useTransform(p, [0.45, 0.7], [0, 1]);
  const teamScale = useTransform(p, [0.45, 0.7], [0.6, 1]);
  // Relevo de frases: la de antes sale hacia arriba y la de ahora entra desde abajo, en tramos pegados
  // (si se cruzaban, se leían las dos a la vez, una encima de otra).
  const before = useTransform(p, [0.44, 0.5], [1, 0]);
  const beforeY = useTransform(p, [0.44, 0.5], [0, -18]);
  const after = useTransform(p, [0.5, 0.56], [0, 1]);
  const afterY = useTransform(p, [0.5, 0.56], [18, 0]);

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[240vh]"} ${geist.variable}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center px-4 py-24 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-10 md:gap-x-6">
          <div className="relative col-span-12 md:col-span-7">
            <div className="relative aspect-square w-full md:aspect-[4/3]" style={{ background: G.base }}>
              {/* El equipo, en el centro cuando llega el giro: la forma «imago» de la marca. */}
              <motion.div
                className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ opacity: teamOpacity, scale: teamScale }}
              >
                <span
                  className="absolute inset-0"
                  style={{ borderRadius: "50% 50% 50% 0", background: `radial-gradient(circle at 30% 30%, ${G.brand}, ${G.brandDeep})` }}
                />
              </motion.div>
              {NODES.map((n, k) => (
                <NodeView key={n.id} n={n} k={k} p={p} />
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <p className="t-label t-tag text-[var(--case-muted)]">02 · El giro</p>
            <div className="relative mt-4">
              <motion.p style={{ opacity: before, y: beforeY }} className="t-statement">
                Antes, todo giraba alrededor del evento.
              </motion.p>
              <motion.p style={{ opacity: after, y: afterY }} className="absolute inset-0 t-statement">
                Ahora, alrededor del equipo.
              </motion.p>
            </div>
            <p className="mt-8 t-body text-[var(--case-muted)]">
              Las noches pasan; el grupo se queda. El equipo pasa a ser el contenedor de todo lo demás: la
              pregunta del día, los juegos, las fotos y las cuentas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
