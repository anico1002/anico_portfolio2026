"use client";

interface PhoneMockupProps {
  mediaUrl: string;
  isVideo: boolean;
  bgUrl?: string;
  phoneRatio?: string; // e.g. "9/16" or "393/852"
  palette?: number;   // project palette index (1–5) for gradient fallback
}

const PALETTE_GRADIENTS: Record<number, string> = {
  1: "from-neutral-900 to-neutral-700",
  2: "from-slate-900 to-slate-700",
  3: "from-zinc-900 to-zinc-600",
  4: "from-stone-900 to-stone-700",
  5: "from-gray-900 to-gray-700",
};

export default function PhoneMockup({
  mediaUrl,
  isVideo,
  bgUrl,
  phoneRatio = "9/16",
  palette = 1,
}: PhoneMockupProps) {
  const gradient = PALETTE_GRADIENTS[palette] ?? PALETTE_GRADIENTS[1];

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28 flex flex-col items-center justify-center min-h-[600px]">
      {/* Background */}
      {bgUrl ? (
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}
      <div className="absolute inset-0 bg-black/30" />

      {/* Phone frame */}
      <div className="relative z-10 w-[260px] sm:w-[290px] md:w-[320px]">
        {/* Outer shell */}
        <div className="bg-neutral-950 rounded-[2.8rem] p-[10px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
          {/* Top area: speaker + front camera */}
          <div className="flex items-center justify-center pt-2 pb-3 gap-2">
            <div className="w-14 h-[5px] bg-neutral-800 rounded-full" />
            <div className="w-[5px] h-[5px] bg-neutral-700 rounded-full" />
          </div>

          {/* Screen */}
          <div
            className="relative w-full overflow-hidden rounded-[1.8rem] bg-black"
            style={{ aspectRatio: phoneRatio }}
          >
            {isVideo ? (
              <video
                src={mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img
                src={mediaUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          {/* Bottom area: home indicator */}
          <div className="flex items-center justify-center pt-3 pb-2">
            <div className="w-24 h-[4px] bg-neutral-700 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
