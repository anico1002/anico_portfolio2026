import DovlaCase from "@/components/case-study/dovla/DovlaCase";
import { moreCases } from "@/lib/maqueta/media";
import { pageMeta } from "@/lib/maqueta/meta";

/* Caso de Dovla a medida (2026-10-13). El contenido vive en components/case-study/dovla/DovlaCase.tsx. */

export const metadata = pageMeta("Dovla", { slug: "dovla" });

export default function Page() {
  return <DovlaCase next={moreCases("dovla")} />;
}
