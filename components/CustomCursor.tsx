"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Solo escritorio con ratón (antes se comprobaba en un efecto y se pintaba dos veces).
const FINE = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const onFine = (cb: () => void) => {
  const q = window.matchMedia(FINE);
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
};

export default function CustomCursor() {
  const visible = useSyncExternalStore(onFine, () => window.matchMedia(FINE).matches, () => false);
  const reducedMotion = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || !visible) return;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    let raf = 0;
    const updateRing = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(updateRing);
    };
    raf = requestAnimationFrame(updateRing);

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, visible]);

  if (!visible || reducedMotion) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block -translate-x-1/2 -translate-y-1/2"
        style={{ left: 0, top: 0, willChange: "left, top" }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="fixed w-8 h-8 border border-primary rounded-full pointer-events-none z-[9998] hidden md:block opacity-50 -translate-x-1/2 -translate-y-1/2"
        style={{ left: 0, top: 0, willChange: "left, top" }}
        aria-hidden
      />
    </>
  );
}
