"use client";

import { useSyncExternalStore } from "react";

const root = () => document.getElementById("case-root");

// El tema vive en el atributo de #case-root (lo fija el layout antes de pintar).
function subscribe(cb: () => void) {
  const r = root();
  if (!r) return () => {};
  const mo = new MutationObserver(cb);
  mo.observe(r, { attributes: true, attributeFilter: ["data-case-theme"] });
  return () => mo.disconnect();
}
const read = () => (root()?.dataset.caseTheme === "light" ? "light" : "dark");

/** Sol/luna en el menú: cambia el tema de toda la maqueta y lo recuerda. */
export default function ThemeToggle() {
  // En el servidor no se sabe: el botón no se muestra hasta hidratar.
  const theme = useSyncExternalStore(subscribe, read, () => null);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    const r = root();
    if (r) r.dataset.caseTheme = next;
    try {
      localStorage.setItem("case-theme", next);
    } catch {}
  };

  // Muestra el destino: luna en claro (pasar a oscuro), sol en oscuro (pasar a claro).
  const toDark = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={toDark ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
      className="-m-1.5 flex h-7 w-7 items-center justify-center opacity-70 hov hover:opacity-100"
      style={{ visibility: theme ? "visible" : "hidden" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        {toDark ? (
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
          </>
        )}
      </svg>
    </button>
  );
}
