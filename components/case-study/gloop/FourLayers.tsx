"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import Lines from "@/components/case-study/Lines";
import { useReduce } from "@/lib/maqueta/reduce";
import { geist } from "./tokens";

/* Por capas (Gloop): lo nativo donde se espera, la marca donde se luce. El usuario ya conoce los gestos
   de su móvil y eso se lee profesional; todo a medida pierde eso, todo nativo pierde la marca. Copy
   rehecho el 2026-10-13 (fuera «fontanería»); los cuatro pasos están en revisión con Alberto. Vista explosionada: cuatro planos separados en profundidad que, con el scroll, se juntan
   y giran hasta quedar de frente formando una sola pantalla. Todo recreado con los tokens reales. */

const LAYERS = [
  { n: "1", title: "Feels like iPhone", body: "Gestures and navigation you already know." },
  { n: "2", title: "Dressed in Gloop", body: "Familiar controls, wearing the brand." },
  { n: "3", title: "Glows at night", body: "Backgrounds, glows and cards with their own light." },
  { n: "4", title: "Every team, its color", body: "Each group gets its own tone, recognizable at a glance." },
];

const W = 300;
const H = Math.round((W * 2622) / 1206); // la proporción de la captura real

/* Capas reales (2026-10-14, feedback de Alberto: «con el diseño real, que no se vea dibujado en HTML»): la home con
   la experiencia activa (Sónar 2027), partida en planos que juntos la recomponen píxel a píxel
   (scripts/mockups/split_layers.py → media/layers/). De abajo arriba: el fondo con el degradado de la cabecera, los
   equipos de colores, lo nativo (barra de estado y de pestañas) y los controles vestidos de Gloop. */
const L = "/maqueta/gloop/media/layers";
function Layer({ src, base = false }: { src: string; base?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="absolute inset-0 h-full w-full" style={base ? { borderRadius: 44 } : undefined} />
  );
}
const STACK = [
  () => <Layer src={`${L}/1-fondo.png`} base />,
  () => <Layer src={`${L}/2-equipos.png`} />,
  () => <Layer src={`${L}/3-nativo.png`} />,
  () => <Layer src={`${L}/4-controles.png`} />,
]; // de abajo arriba

/* Recorrido: 0–0,3 la pila separada (quieta, para leerla), 0,3–0,6 se junta, 0,6–0,85 gira de frente. */
function Plane({ k, p, children }: { k: number; p: MotionValue<number>; children: React.ReactNode }) {
  // Pila centrada en profundidad: los planos se reparten por delante y por detrás del centro.
  const z = useTransform(p, [0.3, 0.6], [(k - 1.5) * 95, 0]);
  const apart = useTransform(p, [0.5, 0.6], [1, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ z, transformStyle: "preserve-3d" }}>
      {/* Cristal del plano mientras está separado: se ve la lámina aunque lleve poco contenido. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ borderRadius: 44, background: "rgba(20,12,32,0.18)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.28)", opacity: apart }}
      />
      {children}
    </motion.div>
  );
}

export default function FourLayers() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = scrollYProgress;
  const rx = useTransform(p, [0.6, 0.85], [56, 0]);
  const rz = useTransform(p, [0.6, 0.85], [-36, 0]);
  const scale = useTransform(p, [0.6, 0.85], [0.86, 1]);
  // Ya juntas y de frente, entra el marco del iPhone con un fundido.
  const frame = useTransform(p, [0.86, 0.96], [0, 1]);

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[300vh]"} ${geist.variable}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center overflow-hidden px-4 py-20 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-8 md:gap-x-6">
          {/* Centrado en el hueco entre el margen y la pila (feedback 2026-10-14: pegado al margen quedaba raro). */}
          <div className="col-span-12 md:col-span-5 md:flex md:justify-center">
            <div className="md:max-w-[24rem]">
            <p className="t-label t-tag text-[var(--case-muted)]">In layers</p>
            <Lines className="mt-4 t-title">Native where you expect it. Brand where it shines.</Lines>
            {/* En móvil no cabe con la pila: solo el titular (cada plano lleva su etiqueta). */}
            {/* Cada número, en la línea base de su título (antes quedaba más arriba). */}
            <ol className="mt-8 hidden space-y-5 md:block">
              {LAYERS.map((l) => (
                <li key={l.n} className="grid grid-cols-[2rem_1fr] items-baseline gap-2">
                  <span className="t-label t-tag text-[var(--case-muted)]">0{l.n}</span>
                  <span>
                    <span className="block t-small font-medium">{l.title}</span>
                    <span className="block t-small text-[var(--case-muted)]">{l.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            </div>
          </div>
          <div className="col-span-12 flex h-[30rem] origin-top scale-[0.72] items-start justify-center md:h-auto md:scale-100 md:items-center md:col-span-7 md:col-start-6" style={{ perspective: 1800 }}>
            <motion.div
              className="relative"
              style={{
                width: W,
                height: H,
                transformStyle: "preserve-3d",
                rotateX: reduce ? 0 : rx,
                rotateZ: reduce ? 0 : rz,
                scale: reduce ? 1 : scale,
              }}
            >
              {STACK.map((C, k) => (
                <Plane key={k} k={reduce ? 1.5 : k} p={p}>
                  <C />
                </Plane>
              ))}
              {/* Marco real de iPhone 18 Pro (PSD de mockups-src, pantalla recortada: media/iphone18-frame.png). La
                  pantalla ocupa el 91,74 % × 96,66 % del marco, desde el 4,10 % / 1,69 %. Con la isla encima. */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  width: `${100 / 0.91744}%`,
                  height: `${100 / 0.96660}%`,
                  left: `${(-4.0968 / 91.744) * 100}%`,
                  top: `${(-1.6852 / 96.66) * 100}%`,
                  opacity: reduce ? 1 : frame,
                  z: 2,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/maqueta/gloop/media/iphone18-frame.png" alt="" className="absolute inset-0 h-full w-full" />
                <span className="absolute left-1/2 top-[2.4%] h-[3.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
