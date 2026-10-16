import WineupCase from "@/components/case-study/wineup/WineupCase";
import { moreCases } from "@/lib/maqueta/media";

/* Caso de WineUp a medida (2026-10-16). El contenido vive en components/case-study/wineup/WineupCase.tsx. */

export const metadata = { title: "WineUp · maqueta" };

export default function Page() {
  return <WineupCase next={moreCases("wineup")} />;
}
