"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LazyVideo from "@/components/case-study/LazyVideo";
import Img from "@/components/case-study/Img";
import { DUR, EASE, STAGGER } from "@/lib/maqueta/motion";
import { CopilotMark } from "./CopilotMark";
import AskDemo from "./AskDemo";
import RealPhone from "@/components/case-study/RealPhone";
import { MaskReveal, Parallax, useSeen } from "@/components/case-study/primitives";

/* Piezas del caso de DesignOps Copilot (2026-11-01). Todo lo que se ve sale del prototipo real
   (~/Vibe_Projects/designops-copilot): la marca es su mismo componente y el iPad lleva el prototipo exportado
   (scripts/case-media/designops-app.sh) dentro de un iframe del mismo dominio. */

export const M = "/maqueta/designops/media";

/** La luz del Copilot (sus tokens --g1…--g4): solo donde está la IA. */
export const AI_LIGHT = { "--g1": "#FF5A36", "--g2": "#F0459B", "--g3": "#8B5CFF", "--g4": "#FF9A3D" } as React.CSSProperties;
const AI_GRADIENT = "linear-gradient(120deg, var(--g3), var(--g2) 45%, var(--g1) 75%, var(--g4))";
const INK = "#2C2357";

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

/** El logotipo del producto: «DesignOps» sobre «Copilot», en negrita y apretado (el Wordmark del prototipo). */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col whitespace-nowrap font-bold leading-[1.05] tracking-[-0.02em] ${className}`}>
      <span>DesignOps</span>
      <span>Copilot</span>
    </span>
  );
}

/* ── De las alertas a las decisiones ─────────────────────────────────────────────────────────── */

const SOURCES = ["Figma library", "4 code repositories", "Figma Check designs", "Buoy alerts"];
const DECISIONS = ["Fix it, with your approval", "Keep it, with a reason", "Report it to leadership"];

/** Píldora de cristal: blanco translúcido, desenfoque de lo que pasa por detrás (el brillo del fondo), canto
    iluminado. Entra deslizándose hacia el Copilot y luego flota, cada una a su ritmo. */
function Pill({ children, dim = false, from, delay, k, on }: { children: React.ReactNode; dim?: boolean; from: number; delay: number; k: number; on: boolean }) {
  const still = useReducedMotion();
  return (
    <motion.span
      initial={{ opacity: 0, x: from }}
      animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: from }}
      transition={{ duration: DUR.slow, ease: EASE.out, delay }}
      className="inline-flex"
    >
      <motion.span
        animate={still ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 4.2 + k * 0.7, ease: "easeInOut", repeat: Infinity, delay: k * 0.5 }}
        className={`inline-flex items-center rounded-full border border-white/80 bg-white/55 px-4 py-2.5 t-small shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_10px_30px_-14px_rgba(44,35,87,.35)] backdrop-blur-xl backdrop-saturate-150 ${dim ? "text-[#2C2357]/60" : "text-[#2C2357]"}`}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Un hilo de luz entre las columnas y el Copilot: una chispa que lo recorre hacia la derecha. */
function Wire({ delay }: { delay: number }) {
  const still = useReducedMotion();
  return (
    <span aria-hidden className="relative hidden h-px w-10 overflow-hidden bg-[#2C2357]/15 md:block lg:w-16">
      {!still && (
        <motion.span
          className="absolute top-0 h-px w-6"
          style={{ background: "linear-gradient(90deg, transparent, var(--g2), transparent)" }}
          initial={{ left: "-30%" }}
          animate={{ left: "110%" }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6, delay }}
        />
      )}
    </span>
  );
}

/** Fuentes a la izquierda, el Copilot en medio (lo único con la luz) y las decisiones a la derecha, sobre un brillo
    tenue de su degradado para que el cristal tenga algo que desenfocar. En móvil, en columna. */
export function FlowDiagram() {
  const wide = useWide();
  const box = useRef<HTMLDivElement>(null);
  // useSeen y no whileInView: en Safari, llegando navegando, whileInView no se disparaba (primitives.tsx).
  const on = useSeen(box, "-15% 0px");
  const d0 = 0.15;
  return (
    <div ref={box} style={AI_LIGHT} className="relative -mx-4 overflow-hidden px-4 py-16 md:-mx-6 md:px-6 md:py-28">
      {/* El brillo: tres manchas del degradado, muy abiertas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[18%] h-[60%] w-[34%] rounded-full opacity-[.16] blur-[80px]" style={{ background: "var(--g3)" }} />
        <div className="absolute left-[38%] top-[26%] h-[52%] w-[26%] rounded-full opacity-[.14] blur-[80px]" style={{ background: "var(--g2)" }} />
        <div className="absolute right-[6%] top-[20%] h-[56%] w-[30%] rounded-full opacity-[.12] blur-[90px]" style={{ background: "var(--g4)" }} />
      </div>
      <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-0">
        <div className="flex flex-wrap gap-2 md:flex-col md:items-end md:gap-3">
          {SOURCES.map((s, k) => (
            <Pill key={s} dim from={wide ? -40 : 0} delay={d0 + k * STAGGER} k={k} on={on}>
              {s}
            </Pill>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Wire delay={0} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: DUR.slow, ease: EASE.out, delay: d0 + 4 * STAGGER }}
            className="relative mx-0 md:mx-2"
          >
            <div aria-hidden className="absolute -inset-6 rounded-full opacity-50 blur-2xl" style={{ background: AI_GRADIENT }} />
            <div
              className="relative flex items-center gap-3 rounded-full py-3.5 pl-4 pr-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_14px_40px_-16px_rgba(139,92,255,.7)]"
              style={{ background: AI_GRADIENT }}
            >
              <CopilotMark size={32} kind="halftone" tone="white" />
              <Wordmark className="text-[17px] md:text-[19px]" />
            </div>
          </motion.div>
          <Wire delay={0.8} />
        </div>
        <div className="flex flex-wrap gap-2 md:flex-col md:items-start md:gap-3">
          {DECISIONS.map((s, k) => (
            <Pill key={s} from={wide ? 40 : 0} delay={d0 + (6 + k) * STAGGER} k={k + 4} on={on}>
              {s}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── La marca ─────────────────────────────────────────────────────────────────────────────────── */

/** La esfera de verdad, viva, sobre blanco: gira, el cursor aparta sus nodos y, con el puntero encima, piensa
    (pulsos). Detrás, un brillo leve de su propio degradado. Debajo, el campo para preguntarle, que se usa solo en bucle
    (AskDemo): mientras responde, la bola piensa, y así se entiende para qué pulsa. */
export function SphereStage() {
  const wide = useWide();
  const [hover, setHover] = useState(false);
  const [asking, setAsking] = useState(false);
  const size = wide ? 480 : 250;
  const box = useRef<HTMLDivElement>(null);
  const seen = useSeen(box, "-20% 0px");   // los puntos llegan de los lados al entrar la sección
  // la caja de la bola: el lienzo es más grande que la bola dibujada; se recorta el aire de arriba y abajo
  const ball = size * 0.72;
  return (
    <div
      ref={box}
      style={AI_LIGHT}
      className="relative -mx-4 flex flex-col items-center justify-center gap-6 overflow-hidden bg-white px-5 py-14 md:mx-0 md:aspect-[16/10] md:gap-4 md:py-0"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="relative flex shrink-0 items-center justify-center" style={{ height: ball, width: "100%" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            width: size * 0.9,
            height: size * 0.9,
            filter: `blur(${size * 0.12}px)`,
            background:
              "radial-gradient(circle at 60% 45%, rgba(240,69,155,.20), rgba(139,92,255,.16) 40%, rgba(255,154,61,.08) 62%, rgba(255,255,255,0) 72%)",
          }}
        />
        <div className="relative" style={{ width: size, height: size }}>
          <div className="absolute" style={{ left: -size / 2, top: -size / 2 }}>
            <CopilotMark size={size} kind="sphere" thinking={hover || asking} gather={seen} />
          </div>
        </div>
      </div>
      <AskDemo run={seen} onThink={setAsking} />
      <p className="absolute bottom-5 left-5 hidden t-small text-[#2C2357]/60 md:bottom-7 md:left-7 md:block">Move your cursor over it</p>
    </div>
  );
}

/** El isotipo quieto en semitono, a los tamaños en que vive: en claro y en oscuro (el panel). A sangre y sin hueco. */
export function MarkSizes() {
  const sizes = [56, 32, 20];
  const tiles: [string, string, string][] = [
    ["Light", "#F3F2F7", "text-[#2C2357]/55"],
    ["Dark", INK, "text-white/55"],
  ];
  return (
    <div style={AI_LIGHT} className="-mx-4 grid grid-cols-1 sm:grid-cols-2 md:-mx-6">
      {tiles.map(([label, bg, fg]) => (
        <div key={label} className="relative flex aspect-[4/3] items-center justify-center gap-6 md:gap-10" style={{ background: bg }}>
          {sizes.map((s) => (
            <CopilotMark key={s} size={s} kind="halftone" />
          ))}
          <p className={`absolute bottom-5 left-0 right-0 text-center t-small md:bottom-7 ${fg}`}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── El iPad navegable ───────────────────────────────────────────────────────────────────────── */

const APP = { w: 1600, h: 900, src: "/maqueta/designops/app/health/" };

/** iPad de frente, en apaisado 16:9, con su marco de verdad: aro de aluminio, bisel negro y cámara. Sombra corta y
    nítida, como las fotos de producto de Apple (una de contacto y otra más abierta, sin bruma). En escritorio, el
    prototipo de verdad dentro: se carga al acercarse y se escala al ancho de la pantalla. En móvil, el recorrido en vídeo. */
export function LiveIpad() {
  const wide = useWide();
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / APP.w));
    ro.observe(el);
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setNear(true), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  return (
    <div className="relative w-full">
      {/* De pie sobre la mesa (referencia de Alberto, 2026-11-01): una línea de contacto fina y oscura, algo más ancha
          que el iPad, y debajo una sombra gris del ancho del aparato que cae y se desvanece. */}
      <div
        aria-hidden
        className="absolute left-[3%] right-[3%] top-full h-[clamp(40px,8vw,130px)] blur-[2px]"
        style={{
          background: "linear-gradient(to bottom, rgba(16,14,30,.34), rgba(16,14,30,.14) 40%, rgba(16,14,30,0))",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute -left-[0.6%] -right-[0.6%] top-full -mt-[4px] h-[7px] rounded-[50%] bg-[rgba(8,8,16,.85)] blur-[2px]"
      />
      <div
        className="relative rounded-[clamp(18px,2.6vw,44px)] p-[0.45%] shadow-[0_1px_1px_rgba(16,14,30,.10)]"
        style={{ background: "linear-gradient(135deg, #f4f5f7 0%, #c9cbd0 22%, #e9eaee 48%, #a9acb2 78%, #d8dade 100%)" }}
      >
        <div className="relative rounded-[clamp(15px,2.3vw,40px)] bg-[#070708] p-[1.7%] shadow-[inset_0_0_0_1px_rgba(255,255,255,.10)]">
          <span aria-hidden className="absolute left-1/2 top-[0.75%] h-[clamp(4px,0.45vw,8px)] w-[clamp(4px,0.45vw,8px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_40%_40%,#2a3140,#08090c_70%)]" />
          <div
            ref={screen}
            className="relative overflow-hidden rounded-[clamp(8px,1.2vw,22px)] bg-[#E9E6F4]"
            style={{ aspectRatio: `${APP.w} / ${APP.h}` }}
          >
            <Img
              src={`${M}/dashboard-poster.png`}
              alt="The Health dashboard of DesignOps Copilot"
              sizes="100vw"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
            />
            {wide && near && scale > 0 && (
              <iframe
                src={APP.src}
                title="DesignOps Copilot, live prototype"
                onLoad={() => setTimeout(() => setReady(true), 400)}
                className="absolute left-0 top-0 border-0"
                style={{ width: APP.w, height: APP.h, transform: `scale(${scale})`, transformOrigin: "0 0" }}
              />
            )}
            {!wide && (
              <LazyVideo
                src={`${M}/walkthrough.mp4`}
                className="absolute inset-0 h-full w-full object-cover"
                aria-label="A walkthrough of the DesignOps Copilot dashboard"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── La app compañera ────────────────────────────────────────────────────────────────────────── */

/** El móvil sobre un fondo de la luz del Copilot que entra en cortinilla (de abajo arriba) y llena el hueco hasta el
    borde derecho; dentro, las manchas del degradado se mueven despacio y la bola del Copilot, en blanco, se forma
    detrás. El móvil, girado como en Gloop o Interactius, va por fuera de la máscara (si no, la cortinilla le cortaría
    las esquinas) y sube con parallax por encima. */
export function OnTheGoStage() {
  const still = useReducedMotion();
  const orbRef = useRef<HTMLDivElement>(null);
  const seen = useSeen(orbRef, "-20% 0px");
  const blob = (bg: string, cls: string, a: number[], b: number[], t: number) => (
    <motion.div
      aria-hidden
      className={`absolute rounded-full blur-[70px] ${cls}`}
      style={{ background: bg }}
      animate={still ? undefined : { x: a, y: b }}
      transition={{ duration: t, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
    />
  );
  return (
    // El fondo es más bajo que el móvil (feedback 2026-11-01): el móvil sobresale por arriba y por abajo; el margen
    // vertical del bloque le hace sitio para que no pise el texto ni la sección siguiente.
    <div style={AI_LIGHT} className="relative my-[22%] md:my-[20%]">
      <MaskReveal from="bottom" speed={40}>
        <div className="relative aspect-[5/4] overflow-hidden md:aspect-[4/3]" style={{ background: "#EEEAFB" }}>
          {blob("var(--g3)", "left-[-10%] top-[-6%] h-[70%] w-[70%] opacity-45", [0, 60, 0], [0, 40, 0], 9)}
          {blob("var(--g2)", "right-[-12%] top-[28%] h-[60%] w-[60%] opacity-35", [0, -50, 0], [0, -30, 0], 11)}
          {blob("var(--g4)", "bottom-[-18%] left-[18%] h-[55%] w-[60%] opacity-35", [0, 40, 0], [0, -40, 0], 13)}
          {/* La bola del Copilot en blanco detrás del móvil (feedback 2026-11-01: que se reconozca el Copilot, no
              partículas sueltas). Se forma al entrar, como la de la sección de la bola. */}
          <div ref={orbRef} aria-hidden className="absolute inset-0 flex items-center justify-center">
            {/* justo detrás del móvil y más grande que él, para que asome por los dos lados (feedback 2026-11-01) */}
            <div className="scale-[.7] md:scale-100">
              <CopilotMark size={820} kind="sphere" tone="white" gather={seen} />
            </div>
          </div>
        </div>
      </MaskReveal>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Parallax speed={220} className="w-[50%] max-w-[330px] md:w-[48%]">
          <div className="rotate-[14deg] drop-shadow-[0_40px_50px_rgba(44,35,87,0.35)]">
            <RealPhone src={`${M}/mobile.mp4`} label="Approving six fixes from a notification" />
          </div>
        </Parallax>
      </div>
    </div>
  );
}

/* ── Close-ups ───────────────────────────────────────────────────────────────────────────────── */

/** `zoom` acerca un poco la imagen desde arriba (recorta por abajo), sin volver a renderizar el close-up. */
export function CloseUp({ name, alt, ratio, sizes = "100vw", className = "", zoom }: { name: string; alt: string; ratio: string; sizes?: string; className?: string; zoom?: number }) {
  return (
    <div className={`relative overflow-hidden bg-[#dcdbe2] ${className}`} style={{ aspectRatio: ratio }}>
      <Img src={`${M}/${name}.png`} alt={alt} sizes={sizes} className="absolute inset-0 h-full w-full object-cover" style={zoom ? { transform: `scale(${zoom})`, transformOrigin: "50% 20%" } : undefined} />
    </div>
  );
}
