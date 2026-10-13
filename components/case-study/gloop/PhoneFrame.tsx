import LazyVideo from "@/components/case-study/LazyVideo";

/* Marco de iPhone para las pantallas nativas de Gloop (2026-10-13, feedback de Alberto: «solo con el
   marco del móvil, no ese fondo de glows»). Los `scr-*.mp4` son la pantalla sola, recortada de las
   composiciones de scripts/case-media/compose.py (misma rejilla, así que el recorte es exacto); las
   esquinas del recorte llevan restos del fondo y este marco las tapa. */

export default function PhoneFrame({ src, label, className = "" }: { src: string; label: string; className?: string }) {
  return (
    <div
      className={`relative w-full bg-[#0d0d0f] p-[3.2%] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15 ${className}`}
      style={{ aspectRatio: "1206 / 2560", borderRadius: "17% / 7.8%" }}
    >
      <div className="relative h-full w-full overflow-hidden bg-black" style={{ borderRadius: "14% / 6.4%" }}>
        <LazyVideo className="absolute inset-0 h-full w-full object-cover" src={src} aria-label={label} />
      </div>
    </div>
  );
}
