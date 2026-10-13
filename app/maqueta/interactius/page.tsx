import InteractiusCase from "@/components/case-study/interactius/InteractiusCase";
import { nextCase } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";

/* Caso de Interactius a medida (2026-10-13). El contenido vive en
   components/case-study/interactius/InteractiusCase.tsx; aquí solo se calcula el siguiente caso. */

export const metadata = { title: "Interactius · maqueta" };

export default function Page() {
  const n = nextCase("interactius");
  return <InteractiusCase next={{ name: n.name, href: n.href, thumb: thumbOf(n.slug) }} />;
}
