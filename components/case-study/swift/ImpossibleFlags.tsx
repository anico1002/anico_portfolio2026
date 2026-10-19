"use client";

import { useReduce } from "@/lib/maqueta/reduce";

/* Banderas imposibles (SwifT): Unicode codifica la senyera, la gallega y la ikurriña como secuencias de
   etiquetas y Apple solo trae dibujo para las subdivisiones británicas; sin más, salen como una bandera
   negra. SwifT las pinta con la silueta y la onda de las emoji de Apple (renderiza una emoji, lee su alfa y
   pinta el diseño a través). Aquí, recreadas en SVG con una onda propia y un vaivén muy suave. */

const WAVE = "M0 10 C30 0 60 0 90 10 S150 20 180 10 L180 110 C150 120 120 120 90 110 S30 100 0 110 Z";

function Flag({ id, children, label, dark }: { id: string; children: React.ReactNode; label: string; dark?: boolean }) {
  const reduce = useReduce();
  return (
    <figure className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 180 120" data-loop className={`w-full max-w-[13rem] ${reduce ? "" : "flag-wave"}`}>
        <defs>
          <clipPath id={`wave-${id}`}>
            <path d={WAVE} />
          </clipPath>
          <linearGradient id={`shade-${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="0.3" stopColor="#000" stopOpacity="0.12" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.85" stopColor="#000" stopOpacity="0.14" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#wave-${id})`}>
          {children}
          <rect width="180" height="120" fill={`url(#shade-${id})`} />
        </g>
      </svg>
      <figcaption className={`t-label t-tag ${dark ? "text-[var(--case-muted)]" : ""}`}>{label}</figcaption>
    </figure>
  );
}

export default function ImpossibleFlags() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-10">
      <Flag id="unicode" label="Sin dibujo: 🏴" dark>
        <rect width="180" height="120" fill="#1d1d1f" />
      </Flag>
      <Flag id="ca" label="Catalán">
        {Array.from({ length: 9 }, (_, k) => (
          <rect key={k} y={(k * 120) / 9} width="180" height={120 / 9 + 0.5} fill={k % 2 ? "#DA121A" : "#FCDD09"} />
        ))}
      </Flag>
      <Flag id="gl" label="Gallego">
        <rect width="180" height="120" fill="#fff" />
        <path d="M0 0 L36 0 L180 102 L180 120 L144 120 L0 18 Z" fill="#0099CC" />
      </Flag>
      <Flag id="eu" label="Euskera">
        <rect width="180" height="120" fill="#D52B1E" />
        <path d="M0 0 L180 120 M180 0 L0 120" stroke="#009B48" strokeWidth="18" />
        <path d="M90 0 V120 M0 60 H180" stroke="#fff" strokeWidth="16" />
      </Flag>
    </div>
  );
}
