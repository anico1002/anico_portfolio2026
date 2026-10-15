import ElRetoCase from "@/components/case-study/elreto/ElRetoCase";
import { caseBySlug, nextCase } from "@/lib/maqueta/cases";
import { getCaseMedia, thumbOf } from "@/lib/maqueta/media";

/* Caso de El Reto a medida (2026-10-13). El contenido vive en components/case-study/elreto/ElRetoCase.tsx;
   aquí se calculan la cabecera (la misma imagen que crece desde la home) y el siguiente caso. */

export const metadata = { title: "El Reto MasterChef · maqueta" };

export default function Page() {
  const c = caseBySlug("elreto-masterchef")!;
  const media = getCaseMedia(c);
  const n = nextCase("elreto-masterchef");
  return (
    <ElRetoCase
      hero={media?.thumb ?? "/projects/elreto-masterchef/ElReto_thumb.png"}
      outcomeTitle={c.outcomeTitle}
      next={{ name: n.name, href: n.href, thumb: thumbOf(n.slug) }}
    />
  );
}
