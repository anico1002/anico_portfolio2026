import InteractiusCase from "@/components/case-study/interactius/InteractiusCase";
import { moreCases } from "@/lib/maqueta/media";

/* Caso de Interactius a medida (2026-10-13). El contenido vive en
   components/case-study/interactius/InteractiusCase.tsx; aquí solo se calcula el siguiente caso. */

export const metadata = { title: "Interactius · maqueta" };

export default function Page() {
  return <InteractiusCase next={moreCases("interactius")} />;
}
