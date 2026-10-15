/* Texto de enlace con hover de máscara (2026-10-12; sustituye al desenfoque, que en Safari daba
   problemas y obligaba a recalcular píxeles en cada fotograma): al pasar por encima, cada letra
   sale por arriba de su máscara y entra una copia igual por abajo, en ola de izquierda a
   derecha. La copia es una sombra de texto del mismo color (`currentColor`), así que sigue a la
   tinta adaptativa. La animación vive en app/maqueta/system.css (`.roll`). El texto real queda
   para lectores de pantalla; las letras sueltas, ocultas. */

import { Inv } from "@/components/case-study/Inv";

export default function RollText({ text }: { text: string }) {
  // Una máscara por palabra (2026-10-15): con una sola, un nombre largo («Athlete Career Training»
  // en «Siguiente caso») se partía a mitad de palabra y la copia de la primera línea asomaba
  // encima de la segunda. Así solo se parte por los espacios y cada línea tiene su máscara.
  let i = 0;
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, w, words) => (
        <span key={w} aria-hidden>
          <span className="roll-mask">
            {[...word].map((ch, k, all) => (
              <span key={k} style={{ ["--i" as string]: i++ }}>
                {/* «¿»/«¡» delante de mayúscula, a la altura de las mayúsculas (ver Inv). */}
                {/[¿¡]/.test(ch) && /\p{Lu}/u.test(all[k + 1] ?? "") ? <Inv ch={ch} /> : ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
