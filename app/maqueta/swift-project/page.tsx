import SwiftCase from "@/components/case-study/swift/SwiftCase";
import { moreCases } from "@/lib/maqueta/media";

/* Caso de SwifT a medida (2026-10-13): la ruta fija tiene prioridad sobre /maqueta/[slug]. El contenido vive
   en components/case-study/swift/SwiftCase.tsx (de cliente); aquí solo se calcula el siguiente caso. */

export const metadata = { title: "SwifT Translator · maqueta" };

export default function Page() {
  return <SwiftCase next={moreCases("swift-project")} />;
}
