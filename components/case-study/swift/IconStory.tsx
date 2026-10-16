"use client";

import { FadeIn, Parallax } from "@/components/case-study/primitives";

/* El icono de SwifT sobre un fondo de cristal oscuro, para que se lea su acabado (Icon Composer). Feedback
   2026-10-16: fuera los tres conceptos descartados, y el fondo lo dibujamos nosotros en glass oscuro. Detrás,
   una luz cálida y una fría (las dos esquirlas del icono, los dos idiomas); delante, dos grandes placas de
   cristal esmerilado con la forma de cada esquirla, que difuminan esas luces. Todo en CSS, sin imagen. */

const SHARDS = {
  a: "M2.13726 123.562L140.468 1.51353C145.34 -2.78524 152.39 2.82934 149.744 8.90058L96.5395 130.949C95.5683 133.177 93.4461 134.606 91.1089 134.606H5.9824C0.413093 134.606 -2.12328 127.321 2.13726 123.562Z",
  b: "M227.863 106.438L89.5321 228.486C84.6599 232.785 77.6098 227.171 80.2564 221.099L133.46 99.051C134.432 96.8231 136.554 95.394 138.891 95.394H224.018C229.587 95.394 232.123 102.679 227.863 106.438Z",
};

/** Una esquirla del rayo (mark-black.svg) como placa de cristal: el recorte es un clipPath en unidades
    relativas (0–1), así escala con su caja sin medir nada. */
function Shard({ id, className }: { id: keyof typeof SHARDS; className: string }) {
  return (
    <div
      className={`absolute backdrop-blur-[40px] ${className}`}
      style={{
        clipPath: `url(#swift-shard-${id})`,
        background: "linear-gradient(150deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 60%)",
      }}
    />
  );
}

export default function IconStory({ bg }: { bg?: string }) {
  return (
    <div
      className="m-bleed relative flex aspect-[4/5] items-center justify-center overflow-hidden md:aspect-[16/9]"
      style={bg ? { backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "#0a0910" }}
    >
      {!bg && (
        <>
          {/* Luces: cálida arriba a la izquierda, fría abajo a la derecha */}
          <div className="absolute left-[8%] top-[6%] h-[55%] w-[45%] rounded-full bg-[#ff7a59] opacity-60 blur-[90px]" />
          <div className="absolute left-[30%] top-[22%] h-[40%] w-[30%] rounded-full bg-[#e0459b] opacity-40 blur-[100px]" />
          <div className="absolute bottom-[4%] right-[8%] h-[60%] w-[48%] rounded-full bg-[#6d3cf0] opacity-70 blur-[90px]" />
          <div className="absolute bottom-[18%] right-[30%] h-[35%] w-[28%] rounded-full bg-[#2f7bff] opacity-40 blur-[100px]" />
          {/* Placas de cristal con la forma de cada esquirla, grandes y fuera de centro */}
          <svg width="0" height="0" className="absolute" aria-hidden>
            <defs>
              {(Object.keys(SHARDS) as (keyof typeof SHARDS)[]).map((k) => (
                <clipPath key={k} id={`swift-shard-${k}`} clipPathUnits="objectBoundingBox">
                  <path d={SHARDS[k]} transform="scale(0.004367)" />
                </clipPath>
              ))}
            </defs>
          </svg>
          <Shard id="a" className="left-[-6%] top-[-14%] aspect-square w-[62%] md:w-[46%]" />
          <Shard id="b" className="bottom-[-18%] right-[-8%] aspect-square w-[62%] md:w-[46%]" />
          {/* Grano muy leve para que el negro no quede plano */}
          <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.5px, transparent 0.6px)", backgroundSize: "3px 3px" }} />
        </>
      )}
      <Parallax speed={90} className="relative">
        <FadeIn>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/swift/brand/app-icon-glass@2x.png" alt="Icono de SwifT" className="w-[15rem] md:w-[24rem]" />
        </FadeIn>
      </Parallax>
    </div>
  );
}
