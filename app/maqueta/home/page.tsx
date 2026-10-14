import { SLIDES } from "@/lib/maqueta/sections";
import HomeView, { type P } from "@/components/case-study/HomeView";
import { casesIn, PENDING, type CaseCopy } from "@/lib/maqueta/cases";
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
  const [elreto, swift, ...rest] = casesIn("product").map(card);
  // Los casos a medida de proyectos hechos juntos van delante de los pendientes y de los conceptos.
  const OWN = ["/maqueta/interactius", "/maqueta/7news", "/maqueta/dovla"];
  const own = OWN.map((h) => rest.find((c) => c.href === h)).filter((c): c is P => !!c);
  const concepts = rest.filter((c) => !OWN.includes(c.href ?? ""));
  const items: P[] = [
    { name: "Gloop", line: "App social para grupos de amigos", type: "iOS nativo", year: "2026", thumb: "/maqueta/gloop/media/hero-mock.mp4", href: "/maqueta/gloop" },
    elreto,
    swift,
    ...own,
    ...PENDING.map((p) => ({ ...p, line: "" })),
    ...concepts,
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
