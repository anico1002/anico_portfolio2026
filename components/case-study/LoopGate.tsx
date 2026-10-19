"use client";

import { useEffect } from "react";

/* Animaciones en bucle solo mientras se ven (auditoría 2026-10-19). Los bucles CSS (`[data-loop]`, `.gloop-drift`,
   `.wf-pan`) seguían corriendo a varias pantallas de distancia y le quitaban fotogramas al scroll. Un solo
   IntersectionObserver para toda la web marca con `data-on` los que están cerca de la pantalla; el CSS (system.css)
   pausa el resto. Un MutationObserver recoge los que aparecen al cambiar de página o al montar un bloque. */
const SEL = "[data-loop], .gloop-drift, .wf-pan";

export default function LoopGate() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.toggleAttribute("data-on", e.isIntersecting)),
      { rootMargin: "25% 0px" }
    );
    const seen = new WeakSet<Element>();
    const scan = (root: ParentNode) =>
      root.querySelectorAll(SEL).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    const root = document.getElementById("case-root") ?? document.body;
    scan(root);
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan(root);
      });
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
