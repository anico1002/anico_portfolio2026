import SwiftCase from "@/components/case-study/swift/SwiftCase";
import { moreCases } from "@/lib/maqueta/media";
import { pageMeta } from "@/lib/maqueta/meta";

/* Caso de SwifT a medida (2026-10-13): la ruta fija tiene prioridad sobre /maqueta/[slug]. El contenido vive
   en components/case-study/swift/SwiftCase.tsx (de cliente); aquí solo se calcula el siguiente caso. */

export const metadata = pageMeta("SwifT Translator", { slug: "swift-project" });

export default function Page() {
  return <SwiftCase next={moreCases("swift-project")} />;
}
