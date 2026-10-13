import DovlaCase from "@/components/case-study/dovla/DovlaCase";
import { nextCase } from "@/lib/maqueta/cases";
import { thumbOf } from "@/lib/maqueta/media";

/* Caso de Dovla a medida (2026-10-13). El contenido vive en components/case-study/dovla/DovlaCase.tsx. */

export const metadata = { title: "Dovla · maqueta" };

export default function Page() {
  const n = nextCase("dovla");
  return <DovlaCase next={{ name: n.name, href: n.href, thumb: thumbOf(n.slug) }} />;
}
