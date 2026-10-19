import GloopCase from "@/components/case-study/gloop/GloopCase";
import { moreCases } from "@/lib/maqueta/media";
import { pageMeta } from "@/lib/maqueta/meta";

/* Caso de Gloop: el contenido vive en components/case-study/gloop/GloopCase.tsx (de cliente); aquí solo se
   calcula, en el servidor, el carrusel de proyectos del final (CaseEnd). */

export const metadata = pageMeta("Gloop", { slug: "gloop" });

export default function Page() {
  return <GloopCase next={moreCases("gloop")} />;
}
