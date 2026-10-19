/* Flecha de los enlaces (2026-10-13): diagonal hacia arriba a la derecha, dibujada en SVG. El
   carácter «↗» se descartó porque iOS lo pinta como emoji, y «→» no le gustaba a Alberto. Hace el
   mismo gesto que las letras de `RollText`, pero en diagonal: al pasar por encima del enlace sale
   por la esquina de arriba a la derecha de su máscara y entra una copia por la de abajo a la
   izquierda. Mide 0,72 em y usa `currentColor`, así que sigue el tamaño y el color del texto. La
   animación vive en app/new/system.css (`.arr`). */

function Glyph() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="square">
      <path d="M2.5 9.5 9.5 2.5M3.5 2.5h6v6" />
    </svg>
  );
}

export default function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`arr ${className}`}>
      <Glyph />
      <Glyph />
    </span>
  );
}
