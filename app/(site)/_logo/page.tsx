"use client";

import { useState } from "react";
import LogoAnico from "@/components/case-study/LogoAnico";

/* Banco de pruebas del logo nuevo (2026-10-18): grande, a tamaño de menú y de favicon, sobre negro y sobre blanco.
   No está enlazado desde ninguna parte; el logo de la web sigue siendo el de siempre hasta que Alberto lo apruebe. */

export default function Page() {
  const [n, setN] = useState(0);
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-[#d9d9d9] md:px-12">
      <button type="button" onClick={() => setN((v) => v + 1)} className="mb-16 rounded-full border border-white/20 px-4 py-2 text-[13px]">
        Replay
      </button>
      <LogoAnico replay={n} className="w-full max-w-[56rem]" />
      <div className="mt-24 flex flex-wrap items-end gap-16">
        <div>
          <p className="mb-4 text-[12px] opacity-50">Menu · 22 px</p>
          <LogoAnico replay={n} className="h-[22px] w-auto" />
        </div>
        <div>
          <p className="mb-4 text-[12px] opacity-50">Mobile menu · 18 px</p>
          <LogoAnico replay={n} className="h-[18px] w-auto" />
        </div>
        <div>
          <p className="mb-4 text-[12px] opacity-50">Favicon · 16 px</p>
          <LogoAnico play={false} className="h-[16px] w-auto" />
        </div>
      </div>
      <div className="mt-24 bg-white px-8 py-12 text-[#0a0a0a]">
        <LogoAnico replay={n} className="w-full max-w-[28rem]" />
        <div className="mt-10">
          <LogoAnico play={false} className="h-[22px] w-auto" />
        </div>
      </div>
    </main>
  );
}
