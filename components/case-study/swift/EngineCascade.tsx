"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* Tres motores, cero configuración (SwifT v2.1). La lógica real de TranslationService.buildPriority: el
   modelo en el Mac encabeza la cadena, pero se salta con textos de más de 180 caracteres (generaría
   demasiado despacio) y con catalán, gallego y euskera (invertía el sentido o no traducía; Apple tampoco
   los soporta, así que van a Google). MyMemory queda oculto como último recurso. Un texto de ejemplo cae
   cada vez en su carril, con el porqué. Cifras medidas en el repo (NOTES.md y el comentario del código). */

const V = "#7c3aed";

const LANES = [
  { name: "TranslateGemma 4B", tag: "On the Mac · offline" },
  { name: "Apple Translation", tag: "On the Mac · instant" },
  { name: "Google Translate", tag: "Safety net" },
];

const CASES = [
  { text: "“¿Lo dejamos para el lunes?”", meta: "Short message · ES → EN", lane: 0, why: "What the app translates most: it goes to the most accurate engine, in under half a second." },
  { text: "A 330-character paragraph", meta: "Long text · EN → ES", lane: 1, why: "The model would take 2.77 s to write it all. From 180 characters up, Apple." },
  { text: "“See you on Monday?”", meta: "Into Catalan · EN → CA", lane: 2, why: "In Catalan the model flipped the meaning, and Apple doesn’t support it. Straight to Google." },
];

export default function EngineCascade() {
  const [k, setK] = useState(0);
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setK((x) => (x + 1) % CASES.length), 3600);
    return () => clearInterval(id);
  }, [on, reduce]);
  const c = CASES[k];

  return (
    <div ref={ref}>
      <div className="grid grid-cols-3 gap-2 md:gap-6">
        {LANES.map((l, n) => {
          const hit = c.lane === n;
          return (
            <div key={l.name} className="flex flex-col">
              {/* La etiqueta es el propio trazo de la barra que crece hacia arriba (feedback 2026-10-16): va pegada a
                  la línea, a todo su ancho, con las esquinas de arriba redondas y las de abajo rectas. Crece en alto desde
                  el grosor del trazo (2 px); el texto entra cuando ya hay sitio. Mismo tempo que antes. */}
              <div className="relative h-36 md:h-44">
                <AnimatePresence>
                  {hit && (
                    <motion.div
                      key={k}
                      className="absolute inset-x-0 bottom-0 overflow-hidden text-white"
                      style={{ background: V }}
                      initial={{ height: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                      animate={{ height: "auto", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                      exit={{ height: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0, transition: { duration: DUR.fast, ease: EASE.inOut } }}
                      transition={{ duration: DUR.base, ease: EASE.inOut }}
                    >
                      <motion.div className="px-3 pb-4 pt-3 md:px-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: DUR.fast, delay: DUR.base * 0.45, ease: EASE.out }}>
                        <p className="t-small font-medium">{c.text}</p>
                        <p className="mt-1 text-[11px] opacity-80 md:text-[12px]">{c.meta}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div
                className="border-t-2 pt-4 transition-colors"
                style={{ borderColor: hit ? V : "var(--case-line)", transitionDuration: `${DUR.base}s` }}
              >
                <p className="t-small font-medium">{l.name}</p>
                <p className="mt-1 t-label text-[var(--case-muted)]">{l.tag}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-10 min-h-[4.5rem] md:mt-14">
        <AnimatePresence mode="wait">
          <motion.p
            key={k}
            className="max-w-[46ch] t-lead"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
          >
            {c.why}
          </motion.p>
        </AnimatePresence>
        <p className="mt-6 t-small text-[var(--case-muted)]">And if everything fails, MyMemory, hidden, as a last resort.</p>
      </div>
    </div>
  );
}
