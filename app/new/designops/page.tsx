import DesignOpsCase from "@/components/case-study/designops/DesignOpsCase";
import { moreCases } from "@/lib/maqueta/media";
import { pageMeta } from "@/lib/maqueta/meta";

/* Caso de DesignOps Copilot a medida (2026-11-01). El contenido vive en components/case-study/designops/DesignOpsCase.tsx. */

export const metadata = pageMeta("DesignOps Copilot", { slug: "designops" });

export default function Page() {
  return <DesignOpsCase next={moreCases("designops")} />;
}
