/* Texto de enlace con hover de desenfoque → foco: al pasar por encima, cada letra se desenfoca
   y vuelve a enfocar, en ola de izquierda a derecha. Es el mismo gesto con el que entran los
   textos de la maqueta (FadeIn), así el hover habla el mismo idioma. La animación vive en
   app/maqueta/system.css (`.blur-text`) y se dispara con el hover del enlace que lo contiene.
   El texto real queda para lectores de pantalla; las letras sueltas, ocultas. */

export default function BlurText({ text }: { text: string }) {
  return (
    <span className="blur-text">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {[...text].map((ch, i) => (
          <span key={i} style={{ ["--i" as string]: i }}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
