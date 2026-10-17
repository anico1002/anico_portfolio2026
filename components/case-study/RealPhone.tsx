"use client";

import { useEffect, useRef, useState } from "react";
import LazyVideo from "@/components/case-study/LazyVideo";
import Img from "@/components/case-study/Img";

/* Móvil de verdad (2026-10-14, feedback de Alberto: «mete un marco de móvil real»; Gloop y 7news). El marco es la plantilla
   transparente de iphone-mockups.com (titanio natural, algo girado; `media/iphone-frame.png`, recortada de
   mockups-src/im-transparent/view-1). La pantalla va encima en CSS con la perspectiva exacta de la plantilla
   (matrix3d sacado de su JSON de esquinas), así el vídeo sigue vivo y nítido. Todo se dibuja a tamaño
   natural (517×1184) y se escala al ancho del contenedor. */

const FRAME = { w: 517, h: 1184 };
const SCREEN = { w: 402, h: 874 }; // pantalla del iPhone en pt
const MATRIX =
  "matrix3d(0.89103341,-0.095177079,0,-0.00010865957,-0.0020559459,1.1679859,0,-7.3706067e-06,0,0,1,0,51.0896,87.80246,0,1)";

/** `src`: vídeo de la pantalla; o `children` para pintar otra cosa dentro (una captura, varias capas).
    `frame`: el marco (por defecto titanio natural; en 7news, el mismo pasado a negro). */
export default function RealPhone({
  src,
  label,
  className = "",
  frame = "/maqueta/gloop/media/iphone-frame.png",
  island = true,
  children,
}: {
  src?: string;
  label?: string;
  className?: string;
  frame?: string;
  island?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / FRAME.w));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ aspectRatio: `${FRAME.w} / ${FRAME.h}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: FRAME.w, height: FRAME.h, transform: `scale(${k})`, opacity: k ? 1 : 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Img src={frame} alt="" className="absolute inset-0 h-full w-full" />
        <div
          className="absolute left-0 top-0 origin-top-left overflow-hidden bg-black"
          style={{ width: SCREEN.w, height: SCREEN.h, transform: MATRIX, borderRadius: 52 }}
        >
          {src && <LazyVideo className="absolute inset-0 h-full w-full object-cover" src={src} aria-label={label} />}
          {children}
          {/* Isla dinámica: el marco no la lleva (va sobre la pantalla). */}
          {island && <span className="absolute left-1/2 top-[11px] h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black" />}
        </div>
      </div>
    </div>
  );
}
