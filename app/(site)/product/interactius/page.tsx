import InteractiusCase from "@/components/case-study/interactius/InteractiusCase";
import { moreCases } from "@/lib/maqueta/media";
import { pageMeta } from "@/lib/maqueta/meta";

/* Caso de Interactius a medida (2026-10-13). El contenido vive en
   components/case-study/interactius/InteractiusCase.tsx; aquí solo se calcula el siguiente caso. */

export const metadata = pageMeta("Interactius", { slug: "interactius" });

export default function Page() {
  return <InteractiusCase next={moreCases("interactius")} />;
}
