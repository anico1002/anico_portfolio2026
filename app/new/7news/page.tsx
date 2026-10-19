import NewsCase from "@/components/case-study/news7/NewsCase";
import { moreCases } from "@/lib/maqueta/media";
import { pageMeta } from "@/lib/maqueta/meta";

/* Caso de 7news a medida (2026-10-13). El contenido vive en components/case-study/news7/NewsCase.tsx. */

export const metadata = pageMeta("7news", { slug: "7news" });

export default function Page() {
  return <NewsCase next={moreCases("7news")} />;
}
