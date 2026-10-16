"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "@/components/case-study/Arrow";
import { DUR, EASE, HOVER_DELAY } from "@/lib/maqueta/motion";

/* Etiqueta «Ver caso» que sigue al ratón dentro de una tarjeta (C2, 2026-10-13). No hay cursor
   global: solo aparece donde aporta. Va un poco por detrás del puntero (se acerca un 18 % de la
   distancia en cada fotograma) y aparece con una máscara de abajo arriba tras el retraso
   intencionado de HOVER_DELAY (C5); al salir, se recoge enseguida. Solo con ratón: en táctil no
   se monta. Se coloca dentro de un contenedor `relative` (el marco de la tarjeta) y escucha el
   puntero en ese contenedor. */

export default function CursorLabel({ label = "View case" }: { label?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mouse, setMouse] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMouse(window.matchMedia("(hover: hover) and (pointer: fine)").matches));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!mouse || !el || !host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = 0;
    let timer = 0;

    const place = () => (el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`);
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      place();
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const aim = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      aim(e);
      // Entra donde está el puntero, sin viajar desde la última posición.
      pos.x = target.x;
      pos.y = target.y;
      place();
      timer = window.setTimeout(() => setOn(true), HOVER_DELAY * 1000);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      aim(e);
      if (reduce) {
        pos.x = target.x;
        pos.y = target.y;
        place();
      } else if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      clearTimeout(timer);
      setOn(false);
    };

    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [mouse]);

  if (!mouse) return null;
  return (
    <span ref={ref} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10">
      {/* Se centra en el puntero; la máscara recorta la pastilla al entrar y salir. */}
      <span
        className="block -translate-x-1/2 -translate-y-1/2"
        style={{
          clipPath: on ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          transition: `clip-path ${on ? DUR.base : DUR.fast}s cubic-bezier(${EASE.inOut.join(",")})`,
        }}
      >
        {/* Solo un cuadrado con la flecha (feedback de Alberto, 2026-10-17: fuera el texto «Ver caso»). */}
        <span className="grid h-11 w-11 place-items-center bg-white text-black" title={label}>
          <Arrow />
        </span>
      </span>
    </span>
  );
}
