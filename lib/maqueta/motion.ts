/* Sistema de movimiento de la maqueta (bloque A de docs/revision-calidad-2026-10-12.md).
   Todo lo que se mueve sale de aquí: nada de curvas ni duraciones sueltas en los componentes.
   Su gemelo en CSS (hover y transiciones de clase) son las variables --ease-* / --dur-* de
   app/maqueta/system.css; si cambias un valor, cámbialo en los dos sitios.

   Curvas: las de Metalab sacadas de su código (GSAP → cubic-bezier), cada una con UN papel:
   - out    → algo que ENTRA o reacciona (textos, fundidos, hover).       Power3.easeOut
   - inOut  → algo que se DESPLAZA o se recorta (máscaras, telón, imagen). Power3.easeInOut
   - screen → algo que CAMBIA DE PANTALLA (vuelo home → caso, elegir mitad). Power4.easeInOut

   Duraciones: tres canónicas (0,3 · 0,8 · 1,2, las de Metalab) más la del cambio de pantalla.
   Regla: las salidas usan una duración más corta que su entrada (hover: entra base, sale fast). */

export const EASE = {
  out: [0.215, 0.61, 0.355, 1],
  inOut: [0.645, 0.045, 0.355, 1],
  screen: [0.76, 0, 0.24, 1],
} as const;

export const DUR = {
  fast: 0.3, // salidas, relevos, retirar capas
  base: 0.8, // entradas, máscaras, hover
  slow: 1.2, // movimientos grandes, asentar imagen
  screen: 1.5, // home → caso (HOMEPAGE_TO_CASE_STUDY de Metalab)
  drift: 2.4, // movimiento ambiental (zoom lento de diapositivas); no es una transición
} as const;

/** Escalonado entre elementos hermanos (textos que entran uno tras otro). */
export const STAGGER = 0.1;

/** Entra con `base`, sale con `fast`: la regla de salidas más rápidas que entradas. */
export const inOrOut = (on: boolean) => (on ? DUR.base : DUR.fast);

/** Retraso intencionado (C5, Yakushev usa 1 s): lo que aparece al pasar el ratón espera un poco,
    para que cruzar por encima de una tarjeta al ir a otro sitio no haga saltar nada. */
export const HOVER_DELAY = 0.4;

/** ¿Pide el sistema reducir el movimiento? (F3). Solo en cliente. Con él, los gestos grandes
    (vuelo de la tarjeta, mitad que crece, telón) se saltan y se cambia de página directamente;
    para todos los demás la web no cambia en nada. */
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
