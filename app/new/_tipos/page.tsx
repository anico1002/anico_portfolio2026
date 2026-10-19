/* Banco de pruebas de la palabra clave de Games (2026-10-18): el titular en Satoshi y «hundreds of millions.» en cada
   candidata, sin animación, para que Alberto elija. No está enlazado desde ninguna parte. La x de las candidatas se
   iguala a la de la Satoshi (font-size-adjust), como se vería en la web. */

const FONTS: [name: string, weight: number][] = [
  ["Oxanium", 500],
  ["Oxanium", 400],
  ["Chakra Petch", 500],
  ["Exo 2", 500],
  ["Tomorrow", 400],
  ["Saira", 500],
  ["Bai Jamjuree", 500],
  ["Space Grotesk", 500],
  ["Electrolize", 400],
  ["Orbitron", 500],
  ["Michroma", 400],
  ["Audiowide", 400],
  ["Space Mono", 400],
  ["Geist Mono", 500],
  ["Kode Mono", 500],
];

const families = [...new Set(FONTS.map(([f]) => f))]
  .map((f) => `family=${f.replace(/ /g, "+")}:wght@${[...new Set(FONTS.filter(([g]) => g === f).map(([, w]) => w))].sort().join(";")}`)
  .join("&");

export default function Page() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 font-[family-name:var(--font-case-sans)] text-[#0a0a0a] antialiased md:px-6">
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${families}&display=block`} />
      <p className="t-label t-tag mb-12 text-[#6b6b6b]">Games · keyword font</p>
      <div className="grid gap-y-14">
        {FONTS.map(([f, w], k) => (
          <div key={`${f}-${w}`} className="grid grid-cols-12 gap-x-4 border-t border-[#e5e5e5] pt-5 md:gap-x-6">
            <p className="col-span-12 mb-3 text-[13px] text-[#6b6b6b] md:col-span-2 md:mb-0">
              <span className="tabular-nums">{String.fromCharCode(65 + k)}</span> · {f} {w}
            </p>
            <p className="t-hero col-span-12 md:col-span-9" style={{ fontSizeAdjust: "from-font" }}>
              Interfaces for games played by{" "}
              <span style={{ fontFamily: `"${f}"`, fontWeight: w }}>hundreds of millions.</span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
