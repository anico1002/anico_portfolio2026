import { useSyncExternalStore } from "react";

/* ¿Ha arrancado ya la maqueta? (D6, 2026-10-13). En la primera carga, `Boot` tapa la página hasta
   que la tipografía está lista; mientras tanto ninguna entrada debe empezar (se jugaría tapada y,
   en las de líneas, se partiría el texto con la fuente de reserva). `useSeen` no empieza a
   vigilar hasta que esto es `true`. En las navegaciones siguientes ya lo es: el portal espera a
   las fuentes por su cuenta. */

let booted = false;
const subs = new Set<() => void>();

export function setBooted() {
  if (booted) return;
  booted = true;
  subs.forEach((f) => f());
}

const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

export function useBooted() {
  return useSyncExternalStore(subscribe, () => booted, () => false);
}
