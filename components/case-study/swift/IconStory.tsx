"use client";

import { Parallax } from "@/components/case-study/primitives";

/* El icono de SwifT sobre un fondo de cristal oscuro, para que se lea su acabado (Icon Composer). Feedback
   2026-10-16: fuera los tres conceptos descartados, y el fondo lo dibujamos nosotros en glass oscuro. Detrás,
   una luz cálida y una fría (las dos esquirlas del icono, los dos idiomas). Sin las placas con forma de rayo a los
   lados (feedback 2026-10-17): solo los glows. Todo en CSS, sin imagen. */

const SHARDS = {
  a: "M2.13726 123.562L140.468 1.51353C145.34 -2.78524 152.39 2.82934 149.744 8.90058L96.5395 130.949C95.5683 133.177 93.4461 134.606 91.1089 134.606H5.9824C0.413093 134.606 -2.12328 127.321 2.13726 123.562Z",
  b: "M227.863 106.438L89.5321 228.486C84.6599 232.785 77.6098 227.171 80.2564 221.099L133.46 99.051C134.432 96.8231 136.554 95.394 138.891 95.394H224.018C229.587 95.394 232.123 102.679 227.863 106.438Z",
};

/** El icono como app icon de cristal oscuro, dibujado (2026-10-16, Alberto: «un simulado de glass oscuro y
    encima el imago de los rayos»; no es exactamente el icono final, pero luce más). Loseta tipo squircle con
    desenfoque de lo que hay detrás, borde de luz en degradado, brillo arriba y las dos esquirlas en cristal claro. */
function GlassIcon() {
  return (
    <div className="relative aspect-square w-[15rem] md:w-[22rem]">
      {/* Loseta */}
      <div
        className="glass-ios h-full w-full overflow-hidden rounded-[22.5%] backdrop-blur-[28px]"
        style={{
          background: "linear-gradient(160deg, rgba(70,62,92,0.42) 0%, rgba(24,21,34,0.58) 55%, rgba(10,9,14,0.72) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -18px 40px rgba(0,0,0,0.45), 0 30px 60px -20px rgba(0,0,0,0.7)",
        }}
      >
        {/* Brillo superior, como el reflejo de una luz de estudio */}
        <div className="absolute inset-x-[-10%] top-[-35%] h-[70%] rounded-[50%] bg-gradient-to-b from-white/18 to-transparent" />
        {/* Las dos esquirlas, en cristal claro con canto de luz */}
        <svg viewBox="-60 -60 349 349" className="absolute inset-[14%] h-[72%] w-[72%]" aria-hidden>
          <defs>
            <linearGradient id="swift-ico-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#c9c4d6" />
            </linearGradient>
            <linearGradient id="swift-ico-b" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3f1f8" />
              <stop offset="1" stopColor="#9d97ae" />
            </linearGradient>
            <filter id="swift-ico-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <g opacity="0.6" filter="url(#swift-ico-glow)">
            <path d={SHARDS.a} fill="#ff9a7a" />
            <path d={SHARDS.b} fill="#8f6bff" />
          </g>
          <path d={SHARDS.a} fill="url(#swift-ico-a)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
          <path d={SHARDS.b} fill="url(#swift-ico-b)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

export default function IconStory({ bg }: { bg?: string }) {
  return (
    <div
      className="m-bleed relative flex aspect-[4/5] items-center justify-center overflow-hidden md:-mx-6 md:aspect-[16/9]"
      style={bg ? { backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "#0a0910" }}
    >
      {!bg && (
        <>
          {/* Luces: cálida arriba a la izquierda, fría abajo a la derecha. Degradados radiales en vez de blur de 90–100 px
              (auditoría 2026-10-19: sin filtro que recalcular en Safari). */}
          <div className="absolute left-[8%] top-[6%] -m-[90px] opacity-60" style={{ width: "calc(45% + 180px)", height: "calc(55% + 180px)", background: "radial-gradient(closest-side, #ff7a59 45%, transparent)" }} />
          <div className="absolute left-[30%] top-[22%] -m-[100px] opacity-40" style={{ width: "calc(30% + 200px)", height: "calc(40% + 200px)", background: "radial-gradient(closest-side, #e0459b 45%, transparent)" }} />
          <div className="absolute bottom-[4%] right-[8%] -m-[90px] opacity-70" style={{ width: "calc(48% + 180px)", height: "calc(60% + 180px)", background: "radial-gradient(closest-side, #6d3cf0 45%, transparent)" }} />
          <div className="absolute bottom-[18%] right-[30%] -m-[100px] opacity-40" style={{ width: "calc(28% + 200px)", height: "calc(35% + 200px)", background: "radial-gradient(closest-side, #2f7bff 45%, transparent)" }} />
          {/* Grano muy leve para que el negro no quede plano */}
          <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.5px, transparent 0.6px)", backgroundSize: "3px 3px" }} />
        </>
      )}
      <Parallax speed={90} className="relative">
        <GlassIcon />
      </Parallax>
    </div>
  );
}
