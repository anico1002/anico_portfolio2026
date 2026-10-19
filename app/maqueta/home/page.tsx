import { SLIDES } from "@/lib/maqueta/sections";
import HomeView, { type P } from "@/components/case-study/HomeView";
import { casesIn, PENDING, PRODUCT_FIRST, productInOrder, type CaseCopy } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";
import { yearsOfExperience } from "@/lib/maqueta/years";
import { BASE } from "@/lib/maqueta/base";
import { pageMeta, productIntro } from "@/lib/maqueta/meta";

// Se regenera a diario: los años de experiencia suben solos (lib/maqueta/years.ts).
export const metadata = pageMeta("Product");
export const revalidate = 86400;

/* Home de Product: apps y producto digital. Debajo, «Marca y web» (identidades y webs),
   separado para no mezclar públicos. Los casos aún sin contenido van sin enlace. */

// WineUp a la derecha (2026-10-17): en el hueco grande a sangre por la derecha.
const SLOT: Record<string, number> = { wineup: 1 };
const card = (c: CaseCopy): P => ({
  slot: SLOT[c.slug],
  name: c.name,
  line: c.line,
  type: c.services[0],
  year: c.year,
  thumb: thumbOf(c.slug),
  href: `${BASE}/${c.slug}`,
});

export default function ProductHome() {
  // Por fecha, lo más actual arriba (feedback 2026-10-16). Dentro de 2026, el orden también encaja cada
  // miniatura en un hueco de su forma (HomeView → layout): SwifT en el grande horizontal a sangre, 7News (móvil
  // en vertical) en el pequeño 3:4, Dovla en el cuadrado, Interactius en el 16:10 y El Reto (2025) en el 4:3.
  const items: P[] = [
    { name: "Gloop", line: "One app for every night out with your friends", type: "Native iOS", year: "2026", thumb: "/maqueta/gloop/media/hero-mock-25d-v2.mp4", href: `${BASE}/gloop` },
    ...productInOrder().slice(0, PRODUCT_FIRST.length).map(card),
    ...PENDING.map((p) => ({ ...p, line: "" })),
    ...productInOrder().slice(PRODUCT_FIRST.length).map(card),
  ];
  return (
    <HomeView
      active="product"
      slides={SLIDES.product}
      // «from first idea to native code» va unido con espacios duros: en móvil partía «from first idea / to native
      // code.» (feedback 2026-10-17); así queda «I design digital products / from first idea to native code.»
      title={"I design *digital products* from\u00a0first\u00a0idea\u00a0to\u00a0native\u00a0code."}
      intro={productIntro()}
      items={items}
      years={yearsOfExperience()}
      // «Brand & web» solo si queda algún proyecto de marca a la vista (2026-10-17: ocultos todos).
      more={
        casesIn("brand").length
          ? { eyebrow: "Brand & web", title: "Identities that carry a product.", items: casesIn("brand").map(card) }
          : undefined
      }
    />
  );
}
