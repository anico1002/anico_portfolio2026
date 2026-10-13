"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { G, geist } from "./tokens";

/* Las cuatro capas (Gloop, canon del 11-oct-2026): «native plumbing, branded surfaces, custom signature
   moments». El usuario ya conoce la UX nativa y se lee profesional; todo a medida pierde eso, todo nativo
   pierde la marca. Vista explosionada: cuatro planos separados en profundidad que, con el scroll, se juntan
   y giran hasta quedar de frente formando una sola pantalla. Todo recreado con los tokens reales. */

const LAYERS = [
  { n: "1", title: "Comportamiento", body: "Siempre nativo: navegación, gestos, hojas y scroll como los espera iOS." },
  { n: "2", title: "Controles", body: "Nativos, vestidos solo con APIs públicas. El cristal, solo en los botones." },
  { n: "3", title: "Superficies", body: "La marca: fondos, brillos y tarjetas planas que nunca parecen botones." },
  { n: "4", title: "Momentos firma", body: "Lo propio, solo donde suma: juegos, el Revelado, el visor, la ruleta." },
];

const W = 300;
const H = 640;
const font = { fontFamily: "var(--font-gloop)" };

/** Capa 3 · superficies de marca (la base de la pantalla). */
function Surfaces() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: G.base, borderRadius: 44 }}>
      <span className="absolute -left-16 -top-10 h-56 w-56 rounded-full opacity-60 blur-3xl" style={{ background: G.brandDeep }} />
      <span className="absolute -bottom-10 -right-16 h-48 w-48 rounded-full opacity-40 blur-3xl" style={{ background: G.accent }} />
      <div className="absolute inset-x-5 top-[104px] space-y-[5px]">
        {["Crew del día", "La Cuenta"].map((t, i) => (
          <div key={t} className="px-4 py-3" style={{ background: G.fill6, borderRadius: "0 18px 18px 18px", ...font }}>
            <p className="text-[14px] font-semibold text-white">{t}</p>
            <p className="text-[12px]" style={{ color: G.text50 }}>{i ? "Te deben 34,26 €" : "4 de 6 han contestado"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Capa 4 · momento firma: un juego a pantalla grande. */
function Signature() {
  return (
    <div className="absolute inset-x-5 top-[250px] h-[250px] overflow-hidden" style={{ borderRadius: 18 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maqueta/gloop/media/photo-fingersup.jpg" alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <p className="absolute bottom-16 left-4 text-[34px] font-extrabold leading-none text-white" style={font}>
        Culpable
      </p>
      <span className="absolute bottom-4 left-4 right-4 flex h-10 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-black" style={font}>
        Jugar
      </span>
    </div>
  );
}

/** Capa 2 · controles nativos vestidos (cristal solo en botones). */
function Controls() {
  const glass = { background: "rgba(255,255,255,0.14)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" };
  return (
    <div className="absolute inset-0">
      <span className="absolute left-5 top-[52px] h-9 w-9 rounded-full" style={glass} />
      <span className="absolute right-5 top-[52px] h-9 w-9 rounded-full" style={glass} />
      <div className="absolute inset-x-5 bottom-6 flex h-14 items-center justify-around rounded-full" style={glass}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-5 w-5 rounded-[6px]" style={{ background: i === 0 ? "#fff" : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>
    </div>
  );
}

/** Capa 1 · comportamiento nativo: gestos y estructura, en línea fina. */
function Behavior() {
  const line = "rgba(255,255,255,0.55)";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" fill="none" stroke={line} strokeWidth="1.5">
      {/* Atrás con gesto desde el borde */}
      <path d="M8 300 q22 0 34 0" strokeDasharray="4 5" />
      <path d="M36 292 l8 8 -8 8" />
      {/* Scroll */}
      <path d="M288 120 v160" strokeLinecap="round" strokeWidth="3" stroke="rgba(255,255,255,0.35)" />
      {/* Título grande que se pliega */}
      <rect x="20" y="96" width="150" height="2" />
      {/* Asa de la hoja */}
      <rect x="125" y="580" width="50" height="5" rx="2.5" />
      {/* Toque y pulsación larga */}
      <circle cx="150" cy="375" r="18" />
      <circle cx="150" cy="375" r="30" strokeDasharray="3 5" />
    </svg>
  );
}

const STACK = [Surfaces, Signature, Controls, Behavior]; // de abajo arriba (capas 3, 4, 2, 1)
const LAYER_OF = [2, 3, 1, 0]; // índice en LAYERS de cada plano

/* Recorrido: 0–0,3 la pila separada (quieta, para leerla), 0,3–0,6 se junta, 0,6–0,85 gira de frente. */
function Plane({ k, p, label, children }: { k: number; p: MotionValue<number>; label: string; children: React.ReactNode }) {
  // Pila centrada en profundidad: los planos se reparten por delante y por detrás del centro.
  const z = useTransform(p, [0.3, 0.6], [(k - 1.5) * 95, 0]);
  const apart = useTransform(p, [0.5, 0.6], [1, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ z, transformStyle: "preserve-3d" }}>
      {/* Cristal del plano mientras está separado: se ve la lámina aunque lleve poco contenido. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ borderRadius: 44, background: "rgba(20,12,32,0.62)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)", opacity: apart }}
      />
      {children}
      <motion.span
        className="pointer-events-none absolute left-full top-6 ml-4 hidden whitespace-nowrap t-label t-tag text-[var(--case-muted)] md:block"
        style={{ opacity: apart }}
      >
        {label}
      </motion.span>
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

  return (
    <div ref={ref} className={`relative ${reduce ? "" : "h-[300vh]"} ${geist.variable}`}>
      <div className={`${reduce ? "" : "sticky top-0"} flex min-h-screen items-center overflow-hidden px-4 py-20 md:px-6`}>
        <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-8 md:gap-x-6">
          <div className="col-span-12 md:col-span-4">
            <p className="t-label t-tag text-[var(--case-muted)]">04 · Las cuatro capas</p>
            <p className="mt-4 t-title">Fontanería nativa, superficies de marca y momentos propios.</p>
            {/* En móvil no cabe con la pila: solo el titular (cada plano lleva su etiqueta). */}
            <ol className="mt-8 hidden space-y-5 md:block">
              {LAYERS.map((l) => (
                <li key={l.n} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="t-label t-tag text-[var(--case-muted)]">0{l.n}</span>
                  <span>
                    <span className="block t-small font-medium">{l.title}</span>
                    <span className="block t-small text-[var(--case-muted)]">{l.body}</span>
                  </span>
                </li>
              ))}
            </ol>
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
                <Plane key={k} k={reduce ? 1.5 : k} p={p} label={`0${LAYERS[LAYER_OF[k]].n} · ${LAYERS[LAYER_OF[k]].title}`}>
                  <C />
                </Plane>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
