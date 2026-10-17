// SSIM sobre la luminancia (ventanas de 8×8, constantes estándar): 1 = idéntica. Compara el original con su versión
// comprimida al mismo tamaño. Sirve de suelo objetivo para «no perder calidad» al optimizar imágenes.
import sharp from "sharp";

async function luma(input, w, h) {
  const { data } = await sharp(input).resize(w, h, { fit: "fill" }).flatten({ background: "#fff" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  return data;
}

export async function ssim(a, b, w, h) {
  const [x, y] = await Promise.all([luma(a, w, h), luma(b, w, h)]);
  const C1 = (0.01 * 255) ** 2, C2 = (0.03 * 255) ** 2, N = 8;
  let sum = 0, n = 0, worst = 1;
  for (let j = 0; j + N <= h; j += N)
    for (let i = 0; i + N <= w; i += N) {
      let mx = 0, my = 0;
      for (let v = 0; v < N; v++) for (let u = 0; u < N; u++) { const k = (j + v) * w + i + u; mx += x[k]; my += y[k]; }
      mx /= N * N; my /= N * N;
      let sx = 0, sy = 0, sxy = 0;
      for (let v = 0; v < N; v++) for (let u = 0; u < N; u++) { const k = (j + v) * w + i + u; const dx = x[k] - mx, dy = y[k] - my; sx += dx * dx; sy += dy * dy; sxy += dx * dy; }
      sx /= N * N - 1; sy /= N * N - 1; sxy /= N * N - 1;
      const s = ((2 * mx * my + C1) * (2 * sxy + C2)) / ((mx * mx + my * my + C1) * (sx + sy + C2));
      sum += s; n++; if (s < worst) worst = s;
    }
  return { mean: sum / n, worst };
}
