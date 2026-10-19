// Fondos desenfocados horneados (auditoría 2026-10-19). Safari recalculaba en cada fotograma de scroll los `filter:
// blur()` de fotos a toda anchura (y con animación encima): hasta 400 ms por fotograma en Gloop. Aquí el desenfoque,
// el brillo y la saturación se aplican una vez a la imagen y la web la pinta tal cual, sin filtro. Como la imagen ya
// está borrosa, se guarda pequeña (sin detalle que perder) y pesa una fracción del original.
//   node scripts/media-opt/bake-blur.mjs
// `blur` es el radio CSS de antes y `shown` el ancho al que se pintaba en el lienzo de 1440 (para pasarlo a píxeles
// de la imagen); `brightness`/`saturation`, los mismos factores que tenía el filtro.
import sharp from "sharp";
import path from "path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const LIST = [
  { src: "public/maqueta/gloop/media/party-ev5.jpg", blur: 16, shown: 1300, brightness: 0.55, saturation: 1.2 },
  { src: "public/maqueta/gloop/media/party-ev6.jpg", blur: 18, shown: 1440, brightness: 0.55, saturation: 1.2 },
  { src: "public/maqueta/dovla/media/photo-travel.jpg", blur: 48, shown: 1800, brightness: 1, saturation: 0.9 },
  { src: "public/maqueta/dovla/media/photo-invest.jpg", blur: 56, shown: 1800, brightness: 0.85, saturation: 0.7 },
];
const OUT_W = 960;

for (const it of LIST) {
  const file = path.join(ROOT, it.src);
  const { width } = await sharp(file).metadata();
  // Primero a 960 px y después el desenfoque, con el radio pasado a esa escala.
  const sigma = (it.blur * OUT_W) / it.shown;
  const out = file.replace(/\.jpg$/i, "-blur.jpg");
  await sharp(file)
    .resize(OUT_W)
    .blur(sigma)
    .modulate({ brightness: it.brightness, saturation: it.saturation })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(`${path.relative(ROOT, out)}  ${width} → ${OUT_W} px, sigma ${sigma.toFixed(1)}`);
}
