import DovlaCase from "@/components/case-study/dovla/DovlaCase";
import { moreCases } from "@/lib/maqueta/media";

/* Caso de Dovla a medida (2026-10-13). El contenido vive en components/case-study/dovla/DovlaCase.tsx. */

export const metadata = { title: "Dovla · maqueta" };

export default function Page() {
  return <DovlaCase next={moreCases("dovla")} />;
}
