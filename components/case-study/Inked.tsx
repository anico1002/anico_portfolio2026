"use client";

import { useRef } from "react";
import { useInk } from "@/lib/maqueta/ink";

/* Envoltorio con tinta adaptativa: su texto (y lo que use `currentColor`) va en blanco o negro
   puro según lo que tenga detrás. `data-ink` permite ajustar otras cosas con CSS (p. ej. el logo,
   que es un SVG negro y se invierte con tinta clara). */

export default function Inked({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div";
}) {
  const ref = useRef<HTMLElement>(null);
  const ink = useInk(ref);
  return (
    <Tag ref={ref as never} data-ink={ink} className={`ink ${className}`}>
      {children}
    </Tag>
  );
}
