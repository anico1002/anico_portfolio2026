import NewsCase from "@/components/case-study/news7/NewsCase";
import { nextCase } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";

/* Caso de 7news a medida (2026-10-13). El contenido vive en components/case-study/news7/NewsCase.tsx. */

export const metadata = { title: "7news · maqueta" };

export default function Page() {
  const n = nextCase("7news");
  return <NewsCase next={{ name: n.name, href: n.href, thumb: thumbOf(n.slug) }} />;
}
