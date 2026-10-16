import ElRetoCase from "@/components/case-study/elreto/ElRetoCase";
import { caseBySlug } from "@/lib/maqueta/cases";
import { getCaseMedia, moreCases } from "@/lib/maqueta/media";

/* Caso de El Reto a medida (2026-10-13). El contenido vive en components/case-study/elreto/ElRetoCase.tsx;
   aquí se calculan la cabecera (la misma imagen que crece desde la home) y el siguiente caso. */

export const metadata = { title: "El Reto MasterChef · maqueta" };

export default function Page() {
  const c = caseBySlug("elreto-masterchef")!;
  const media = getCaseMedia(c);
  return (
    <ElRetoCase
      hero={media?.thumb ?? "/projects/elreto-masterchef/ElReto_thumb.png"}
      outcomeTitle={c.outcomeTitle}
      next={moreCases("elreto-masterchef")}
    />
  );
}
