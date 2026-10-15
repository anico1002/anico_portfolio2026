"use client";

import { Children, Fragment, isValidElement, useEffect, useRef } from "react";
import { useSeen } from "@/components/case-study/primitives";

/* Titulares que entran línea a línea (D1, 2026-10-13; Plastic y Yakushev): cada línea sube desde
   su propia máscara, una tras otra. Para los párrafos sigue `FadeIn` (por líneas sería ruido).

   Cómo: cada palabra va en su máscara y, una vez cargada la tipografía (Boot, D6) y con el ancho
   real, se mira en qué línea ha caído; todas las palabras de una línea comparten retraso, así que
   se ven subir como una sola línea. Si cambia el ancho se vuelve a medir. Los elementos dentro
   del texto (palabras clave `.kw`, signos `Inv`…) viajan pegados a su palabra, sin cortes de
   línea nuevos. La animación vive en app/maqueta/system.css (`.ln`). */

type Tag = "p" | "h1" | "h2" | "h3" | "span";

/** Parte el contenido en palabras: el texto por los espacios; los elementos, pegados a lo que
    tengan al lado sin espacio de por medio. */
function words(node: React.ReactNode): React.ReactNode[][] {
  const out: React.ReactNode[][] = [[]];
  const walk = (n: React.ReactNode) => {
    Children.forEach(n, (c) => {
      if (typeof c === "string" || typeof c === "number") {
        // Por los espacios normales: el espacio duro (\u00a0) deja las palabras juntas en una línea.
        String(c)
          .split(/([ \t\n]+)/)
          .forEach((part) => {
            if (!part) return;
            if (/^[ \t\n]+$/.test(part)) out.push([]);
            else out[out.length - 1].push(part);
          });
      } else if (isValidElement(c) && c.type === Fragment) {
        walk((c.props as { children?: React.ReactNode }).children);
      } else if (c != null && c !== false) {
        out[out.length - 1].push(c);
      }
    });
  };
  walk(node);
  return out.filter((w) => w.length);
}

export default function Lines({
  children,
  as: T = "p",
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  /** Retraso de la primera línea, en segundos. */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useSeen(ref, "-12% 0px");

  // Línea de cada palabra: misma altura en pantalla = misma línea.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      let line = -1;
      let top = -Infinity;
      el.querySelectorAll<HTMLElement>(":scope > .ln-w").forEach((w) => {
        const t = w.offsetTop;
        if (t > top + 2) {
          line++;
          top = t;
        }
        w.style.setProperty("--l", String(line));
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ws = words(children);
  return (
    <T
      ref={ref as React.Ref<never>}
      className={`ln ${className}`}
      data-on={seen ? "" : undefined}
      style={{ ["--d" as string]: `${delay}s` }}
    >
      {ws.map((w, i) => (
        <Fragment key={i}>
          <span className="ln-w">
            <span className="ln-i">{w}</span>
          </span>
          {i < ws.length - 1 && " "}
        </Fragment>
      ))}
    </T>
  );
}
