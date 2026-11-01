"use client";

import { useEffect, useRef, useState } from "react";
import LazyVideo from "@/components/case-study/LazyVideo";
import Img from "@/components/case-study/Img";
import { CopilotMark } from "./CopilotMark";

/* Piezas del caso de DesignOps Copilot (2026-11-01). Todo lo que se ve sale del prototipo real
   (~/Vibe_Projects/designops-copilot): la marca es su mismo componente y el iPad lleva el prototipo exportado
   (scripts/case-media/designops-app.sh) dentro de un iframe del mismo dominio. */

export const M = "/maqueta/designops/media";

/** La luz del Copilot (sus tokens --g1…--g4): solo donde está la IA. */
export const AI_LIGHT = { "--g1": "#FF5A36", "--g2": "#F0459B", "--g3": "#8B5CFF", "--g4": "#FF9A3D" } as React.CSSProperties;
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

/* ── De las alertas a las decisiones ─────────────────────────────────────────────────────────── */

const SOURCES = ["Figma library", "4 code repositories", "Figma Check designs", "Buoy alerts"];
const DECISIONS = ["Fix it, with your approval", "Keep it, with a reason", "Report it to leadership"];

function Pill({ children, dim = false }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-[var(--case-line)] px-4 py-2.5 t-small ${dim ? "text-[var(--case-muted)]" : ""}`}>
      {children}
    </span>
  );
}

/** Fuentes a la izquierda, el Copilot en medio (lo único con la luz) y las decisiones a la derecha. En móvil, en columna. */
export function FlowDiagram() {
  return (
    <div style={AI_LIGHT} className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10">
      <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
        {SOURCES.map((s) => (
          <Pill key={s} dim>
            {s}
          </Pill>
        ))}
      </div>
      <div className="relative flex items-center justify-center md:px-6">
        <span aria-hidden className="absolute left-0 right-0 top-1/2 hidden h-px bg-[var(--case-line)] md:block" />
        <div
          className="relative rounded-full p-[1.5px]"
          style={{ background: "linear-gradient(120deg, var(--g3), var(--g2) 45%, var(--g1) 75%, var(--g4))" }}
        >
          <div className="flex items-center gap-3 rounded-full bg-[var(--case-bg)] px-6 py-4">
            <CopilotMark size={28} kind="halftone" />
            <span className="t-title">Copilot</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 md:flex-col md:items-start">
        {DECISIONS.map((s) => (
          <Pill key={s}>{s}</Pill>
        ))}
      </div>
    </div>
  );
}

/* ── La marca ─────────────────────────────────────────────────────────────────────────────────── */

/** La esfera de verdad, viva: gira, el cursor aparta sus nodos y, con el puntero encima, piensa (pulsos). */
export function SphereStage() {
  const wide = useWide();
  const [think, setThink] = useState(false);
  const size = wide ? 480 : 250;
  return (
    <div
      style={AI_LIGHT}
      className="relative -mx-4 flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#EEEDF3] md:mx-0 md:aspect-[16/10]"
      onPointerEnter={() => setThink(true)}
      onPointerLeave={() => setThink(false)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute" style={{ left: -size / 2, top: -size / 2 }}>
          <CopilotMark size={size} kind="sphere" thinking={think} />
        </div>
      </div>
      <p className="absolute bottom-5 left-5 t-small text-[#2C2357]/60 md:bottom-7 md:left-7">
        {wide ? "Move your cursor over it" : "Touch it"}
      </p>
    </div>
  );
}

/** El isotipo quieto en semitono, a los tamaños en que vive: en la luz y sobre el oscuro del panel. */
export function MarkSizes() {
  const sizes = [56, 32, 20];
  return (
    <div style={AI_LIGHT} className="grid grid-cols-2 gap-[6px]">
      <div className="flex aspect-[4/3] items-center justify-center gap-6 bg-[#EEEDF3] md:gap-10">
        {sizes.map((s) => (
          <CopilotMark key={s} size={s} kind="halftone" />
        ))}
      </div>
      <div className="flex aspect-[4/3] items-center justify-center gap-6 md:gap-10" style={{ background: INK }}>
        {sizes.map((s) => (
          <CopilotMark key={s} size={s} kind="halftone" />
        ))}
      </div>
    </div>
  );
}

/* ── El iPad navegable ───────────────────────────────────────────────────────────────────────── */

const APP = { w: 1376, h: 1032, src: "/maqueta/designops/app/health/" };

/** iPad Pro de frente, minimal (cuerpo casi negro, bisel fino). En escritorio, el prototipo de verdad dentro: se carga
    al acercarse y se escala al ancho de la pantalla. En móvil no cabe usarlo: va el recorrido en vídeo. */
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
    <div className="mx-auto w-full max-w-[1240px]">
      <div className="rounded-[clamp(22px,3.4vw,48px)] bg-[#0d0d0f] p-[1.6%] shadow-[0_50px_120px_-40px_rgba(20,16,50,0.45),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <div
          ref={screen}
          className="relative overflow-hidden rounded-[clamp(12px,2vw,30px)] bg-[#E9E6F4]"
          style={{ aspectRatio: `${APP.w} / ${APP.h}` }}
        >
          <Img
            src={`${M}/dashboard-poster.png`}
            alt="The Health dashboard of DesignOps Copilot"
            sizes="(min-width: 768px) 90vw, 100vw"
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
  );
}

/* ── Close-ups ───────────────────────────────────────────────────────────────────────────────── */

export function CloseUp({ name, alt, ratio, sizes = "100vw", className = "" }: { name: string; alt: string; ratio: string; sizes?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#dcdbe2] ${className}`} style={{ aspectRatio: ratio }}>
      <Img src={`${M}/${name}.png`} alt={alt} sizes={sizes} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
