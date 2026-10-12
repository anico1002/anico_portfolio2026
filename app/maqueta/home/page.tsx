import { SLIDES } from "@/lib/maqueta/sections";
import HomeView, { type P } from "@/components/case-study/HomeView";
import { casesIn, PENDING, type CaseCopy } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";

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
  const [elreto, swift, ...concepts] = casesIn("product").map(card);
  const items: P[] = [
    { name: "Gloop", line: "App social para grupos de amigos", type: "iOS nativo", year: "2026", thumb: "/maqueta/gloop/cover.jpg", href: "/maqueta/gloop" },
    elreto,
    swift,
    ...PENDING.map((p) => ({ ...p, line: "" })),
    ...concepts,
  ];
  return (
    <HomeView
      active="product"
      slides={SLIDES.product}
      title="Diseño {productos digitales|apps nativas|sistemas de diseño|prototipos} de la idea al código nativo."
      intro="Más de 25 años diseñando interfaces, ahora con la IA como herramienta de construcción. Estrategia, UX/UI, sistemas y prototipos que se pueden tocar."
      items={items}
      more={{
        eyebrow: "Marca y web",
        title: "Identidades que sostienen un producto.",
        items: casesIn("brand").map(card),
      }}
    />
  );
}
