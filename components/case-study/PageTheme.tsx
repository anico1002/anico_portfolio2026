"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { themeFor } from "@/lib/maqueta/theme";

/** Pone en #case-root el color de la página actual (lib/maqueta/theme.ts) al navegar. La primera carga la resuelve
    el script del layout antes de pintar; esto cubre los cambios de página sin recarga. El fondo se funde (la
    transición de `main` en el layout), así que no hay fogonazo al pasar de una home negra a un caso blanco. */
export default function PageTheme() {
  const path = usePathname();
  useLayoutEffect(() => {
    const r = document.getElementById("case-root");
    if (r) r.dataset.caseTheme = themeFor(path);
  }, [path]);
  return null;
}
