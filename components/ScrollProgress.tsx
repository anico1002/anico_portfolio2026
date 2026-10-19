"use client";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary origin-left z-[100] pointer-events-none"
      data-scroll-progress
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden
    />
  );
}
