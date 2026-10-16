/* Teclas dibujadas (2026-10-17): una sola pieza para el atajo allá donde salga (titulares, textos y demos), para que
   siempre sean las mismas. Todo en em y con el color del texto (`currentColor`), sin tipografía propia: escala con el
   cuerpo de donde se use y sobrevive a un cambio de tipografía. `lit` = pulsada (violeta de SwifT). */

const LIT = "#7c3aed";

export function KeyCap({ k, lit = false }: { k: string; lit?: boolean }) {
  return (
    <span
      aria-hidden
      className="inline-grid h-[1.6em] min-w-[1.6em] place-items-center rounded-[0.36em] border px-[0.3em] leading-none transition-colors duration-150"
      style={{
        borderColor: lit ? LIT : "color-mix(in srgb, currentColor 25%, transparent)",
        background: lit ? LIT : "color-mix(in srgb, currentColor 6%, transparent)",
        color: lit ? "#fff" : undefined,
        boxShadow: "inset 0 -0.1em 0 color-mix(in srgb, currentColor 16%, transparent)",
      }}
    >
      {k}
    </span>
  );
}

/** El atajo dentro de un texto: las teclas a ~0,45 del cuerpo, centradas en la línea. */
export default function Keys({ keys, className = "text-[0.45em]" }: { keys: string[]; className?: string }) {
  return (
    <span className={`inline-flex gap-[0.25em] align-middle ${className}`} role="img" aria-label={keys.join(" ")}>
      {keys.map((k) => (
        <KeyCap key={k} k={k} />
      ))}
    </span>
  );
}
