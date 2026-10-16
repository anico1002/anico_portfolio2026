import NewsCase from "@/components/case-study/news7/NewsCase";
import { moreCases } from "@/lib/maqueta/media";

/* Caso de 7news a medida (2026-10-13). El contenido vive en components/case-study/news7/NewsCase.tsx. */

export const metadata = { title: "7news · maqueta" };

export default function Page() {
  return <NewsCase next={moreCases("7news")} />;
}
