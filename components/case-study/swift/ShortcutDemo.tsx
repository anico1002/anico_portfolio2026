"use client";

import { KeyCap } from "@/components/case-study/Keys";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReduce } from "@/lib/maqueta/reduce";
import { DUR, EASE } from "@/lib/maqueta/motion";

/* SwifT en acción, recreado (no es una captura): una ventana de macOS con un mensaje; se selecciona con
   el barrido violeta de la landing, se encienden ⌥ ⌘ T (el atajo de la v2.1) y aparece el panel de
   traducción arriba a la derecha, como el NSPanel real (material translúcido, radio 12, cabecera
   «SwifT  ES → EN», texto seleccionable y «Copy»). Va pasando por varias frases, árabe incluido. */

const PHRASES = [
  { from: "ES", to: "EN", text: "¿Lo dejamos para el lunes? Esta semana voy hasta arriba.", out: "Can we push it to Monday? I'm swamped this week." },
  { from: "EN", to: "ES", text: "It's raining cats and dogs out there.", out: "Está lloviendo a cántaros." },
  { from: "EN", to: "AR", text: "Where are you from?", out: "من أين أنت؟", rtl: true },
  { from: "EN", to: "ES", text: "Oh great, another meeting. Just what I needed.", out: "Ah, genial, otra reunión. Justo lo que necesitaba." },
];

type Step = "idle" | "select" | "keys" | "panel";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ShortcutDemo() {
  const [i, setI] = useState(0);
  const [step, setStep] = useState<Step>("idle");
  const [key, setKey] = useState(-1);
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const p = PHRASES[i];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setOn(es.some((e) => e.isIntersecting)), { rootMargin: "-15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    if (reduce) {
      setStep("panel");
      return;
    }
    let alive = true;
    (async () => {
      let k = i;
      while (alive) {
        setStep("idle");
        setKey(-1);
        await sleep(700);
        if (!alive) return;
        setStep("select");
        await sleep(900);
        if (!alive) return;
        setStep("keys");
        for (let n = 0; n < 3 && alive; n++) {
          setKey(n);
          await sleep(170);
        }
        await sleep(250);
        if (!alive) return;
        setStep("panel");
        await sleep(2800);
        if (!alive) return;
        setStep("idle");
        setKey(-1);
        await sleep(500);
        k = (k + 1) % PHRASES.length;
        setI(k);
      }
    })();
    return () => {
      alive = false;
    };
    // `i` solo al arrancar: el bucle lleva su propia cuenta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduce]);

  const selected = step !== "idle";
  const font = { fontFamily: '-apple-system, "SF Pro Text", "Inter", system-ui, sans-serif' };

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[64rem] overflow-hidden rounded-[0.9rem] bg-[#f5f5f7] text-[#1d1d1f] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.45)] ring-1 ring-black/10" style={font}>
      {/* Barra de menús de macOS con el rayo de SwifT */}
      <div className="flex h-7 items-center justify-between bg-white/80 px-4 text-[12px] backdrop-blur">
        <span className="font-semibold">Mensajes</span>
        <span className="flex items-center gap-3 text-[#6e6e73]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/swift/brand/mark-black.svg" alt="" className="h-3.5 w-3.5" />
          <span>mar 13 oct 9:41</span>
        </span>
      </div>
      {/* Ventana */}
      <div className="relative flex aspect-[16/9] items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[34rem] rounded-[0.8rem] bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <div className="mb-4 flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <p className="text-[12px] text-[#aeaeb2]">Marta · 9:41</p>
          <div className="mt-2 inline-block max-w-full rounded-[1.1rem] bg-[#f5f5f7] px-4 py-3 text-[17px] leading-snug md:text-[20px]">
            {/* Selección: el barrido violeta de la landing, de izquierda a derecha. Va como fondo del propio
                texto (con `box-decoration-break`), así sigue bien las frases de dos líneas. */}
            <span
              className="rounded-[4px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              style={{
                backgroundImage: "linear-gradient(rgba(124,58,237,0.2), rgba(124,58,237,0.2))",
                backgroundRepeat: "no-repeat",
                backgroundSize: selected ? "100% 100%" : "0% 100%",
                transition: `background-size ${selected ? 0.8 : 0.2}s cubic-bezier(${EASE.inOut.join(",")})`,
              }}
            >
              {p.text}
            </span>
          </div>
        </div>

        {/* Atajo */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {["⌥", "⌘", "T"].map((k, n) => (
            // La misma tecla de toda la web (components/case-study/Keys.tsx), a tamaño de demo.
            <span key={k} className="text-[22px] font-medium text-[#1d1d1f]">
              <KeyCap k={k} lit={step !== "idle" && step !== "select" && key >= n} />
            </span>
          ))}
        </div>

        {/* Panel de traducción (NSPanel no activante, 340 de ancho, arriba a la derecha) */}
        <AnimatePresence>
          {step === "panel" && (
            <motion.div
              key={i}
              className="absolute right-3 top-3 w-[min(340px,80%)] rounded-[12px] bg-white/80 p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/10 backdrop-blur-xl"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: DUR.fast, ease: EASE.out }}
            >
              <div className="flex items-center justify-between text-[12px] font-semibold text-[#6e6e73]">
                <span>
                  SwifT&nbsp;&nbsp;{p.from} → {p.to}
                </span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#aeaeb2] text-[10px] text-white">✕</span>
              </div>
              <p className="mt-2 text-[14px] leading-snug" dir={p.rtl ? "rtl" : "ltr"}>
                {p.out}
              </p>
              <div className="mt-3 flex justify-end">
                <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-medium">Copy</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
