"use client";

import { FadeIn, Parallax } from "@/components/case-study/primitives";

/* El icono de SwifT sobre una imagen, para que se vea el cristal (Icon Composer). Feedback 2026-10-16:
   fuera los tres conceptos descartados. PROVISIONAL: el fondo es un degradado hasta que Alberto pase la
   imagen buena (irá en `bg`); también pasará una lámina técnica del diseño del logo, que irá antes. */

export default function IconStory({ bg }: { bg?: string }) {
  return (
    <div
      className="m-bleed relative flex aspect-[4/5] items-center justify-center overflow-hidden md:aspect-[16/9]"
      style={
        bg
          ? { backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: "radial-gradient(120% 90% at 30% 20%, #f3c6dd 0%, #a77bf3 38%, #3a1d8f 75%, #12082f 100%)" }
      }
    >
      <Parallax speed={90}>
        <FadeIn>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/maqueta/swift/brand/app-icon-glass@2x.png" alt="Icono de SwifT" className="w-[15rem] md:w-[24rem]" />
        </FadeIn>
      </Parallax>
    </div>
  );
}
