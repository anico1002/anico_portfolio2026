/* eslint-disable @next/next/no-img-element */
import opt from "@/lib/maqueta/opt.json";

/* Imagen con su versión ligera (2026-10-17). Si `src` tiene versiones AVIF en public/opt/ (las genera
   scripts/media-opt/images.mjs, con la calidad medida contra el original), el navegador elige el ancho justo para su
   pantalla; si no las tiene, o el navegador no sabe leer AVIF, sale el original. El <picture> va con
   `display: contents`, así que no cuenta para la maquetación: el <img> se coloca exactamente igual que antes.

   `sizes`: por defecto el ancho de la pantalla, que es el máximo que ocupa cualquier imagen; así nunca se pide una
   versión más pequeña de lo que se ve. Las perezosas (`loading="lazy"`) usan además `auto` donde el navegador lo
   admite, que mide la caja real. */

const OPT = opt as Record<string, number[]>;

export const optSrcSet = (src: string) => {
  const ws = OPT[src];
  if (!ws) return null;
  const base = "/opt" + src.replace(/\.(png|jpe?g)$/i, "");
  return ws.map((w) => `${base}.${w}.avif ${w}w`).join(", ");
};

/** Solo la fuente AVIF, para envolver a mano un <img> que no puede ser `Img` (un `motion.img`):
    `<picture style={{ display: "contents" }}><OptSource src={src} /><motion.img src={src} … /></picture>`. */
export function OptSource({ src, sizes = "100vw" }: { src: string; sizes?: string }) {
  const set = optSrcSet(src);
  return set ? <source type="image/avif" srcSet={set} sizes={sizes} /> : null;
}

export default function Img({ src, alt, sizes, loading, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const set = optSrcSet(src);
  const img = <img src={src} alt={alt} loading={loading} {...rest} />;
  if (!set) return img;
  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={set} sizes={sizes ?? (loading === "lazy" ? "auto, 100vw" : "100vw")} />
      {img}
    </picture>
  );
}
