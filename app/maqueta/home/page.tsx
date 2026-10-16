import { SLIDES } from "@/lib/maqueta/sections";
import HomeView, { type P } from "@/components/case-study/HomeView";
import { casesIn, PENDING, PRODUCT_FIRST, productInOrder, type CaseCopy } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";
import { yearsOfExperience } from "@/lib/maqueta/years";

// Se regenera a diario: los años de experiencia suben solos (lib/maqueta/years.ts).
export const revalidate = 86400;

/* Home de Product: apps y producto digital. Debajo, «Marca y web» (identidades y webs),
   separado para no mezclar públicos. Los casos aún sin contenido van sin enlace. */

const card = (c: CaseCopy): P => ({
  name: c.name,
  line: c.line,
  type: c.services[0],
  year: c.year,
  thumb: thumbOf(c.slug),
  href: `/maqueta/${c.slug}`,
});

export default function ProductHome() {
  // Por fecha, lo más actual arriba (feedback 2026-10-16). Dentro de 2026, el orden también encaja cada
  // miniatura en un hueco de su forma (HomeView → layout): SwifT en el grande horizontal a sangre, 7News (móvil
  // en vertical) en el pequeño 3:4, Dovla en el cuadrado, Interactius en el 16:10 y El Reto (2025) en el 4:3.
  const items: P[] = [
    { name: "Gloop", line: "App social para grupos de amigos", type: "iOS nativo", year: "2026", thumb: "/maqueta/gloop/media/hero-mock.mp4", href: "/maqueta/gloop" },
    ...productInOrder().slice(0, PRODUCT_FIRST.length).map(card),
    ...PENDING.map((p) => ({ ...p, line: "" })),
    ...productInOrder().slice(PRODUCT_FIRST.length).map(card),
  ];
  return (
    <HomeView
      active="product"
      slides={SLIDES.product}
      title="Diseño *productos digitales* de la idea al código nativo."
      intro={`${yearsOfExperience()} años diseñando interfaces, ahora con la IA como herramienta de construcción. Estrategia, UX/UI, sistemas y prototipos que se pueden tocar.`}
      items={items}
      more={{
        eyebrow: "Marca y web",
        title: "Identidades que sostienen un producto.",
        items: casesIn("brand").map(card),
      }}
    />
  );
}
