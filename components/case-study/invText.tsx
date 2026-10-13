import { Fragment } from "react";
import { Inv } from "@/components/case-study/Inv";

/* Aparte de Inv.tsx porque se llama también desde páginas de servidor (Inv es de cliente). */

/** Sube los «¿» y «¡» que van delante de mayúscula; el resto del texto queda igual. */
export function invText(text: string) {
  const parts = text.split(/([¿¡](?=\p{Lu}))/u);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 ? <Inv key={i} ch={p} /> : <Fragment key={i}>{p}</Fragment>));
}
