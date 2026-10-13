/* Texto de enlace con hover de máscara (2026-10-12; sustituye al desenfoque, que en Safari daba
   problemas y obligaba a recalcular píxeles en cada fotograma): al pasar por encima, cada letra
   sale por arriba de su máscara y entra una copia igual por abajo, en ola de izquierda a
   derecha. La copia es una sombra de texto del mismo color (`currentColor`), así que sigue a la
   tinta adaptativa. La animación vive en app/maqueta/system.css (`.roll`). El texto real queda
   para lectores de pantalla; las letras sueltas, ocultas. */

import { Inv } from "@/components/case-study/Inv";

export default function RollText({ text }: { text: string }) {
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="roll-mask">
        {[...text].map((ch, i, all) => (
          <span key={i} style={{ ["--i" as string]: i }}>
            {/* «¿»/«¡» delante de mayúscula, a la altura de las mayúsculas (ver Inv). */}
            {ch === " " ? " " : /[¿¡]/.test(ch) && /\p{Lu}/u.test(all[i + 1] ?? "") ? <Inv ch={ch} /> : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
