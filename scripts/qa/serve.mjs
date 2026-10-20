// Servidor estático para probar un paquete en local como lo serviría el hosting: /carpeta → /carpeta/ (como Cloudflare
// y Apache) y peticiones por rangos (sin ellas Safari no carga los vídeos y da falsos fallos). Puerto 4789 (o PORT).
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const root = process.argv[2];
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".txt":"text/plain", ".avif":"image/avif", ".webp":"image/webp", ".png":"image/png", ".jpg":"image/jpeg", ".mp4":"video/mp4", ".woff2":"font/woff2", ".svg":"image/svg+xml" };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split("?")[0]);
  let f = path.join(root, u);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!u.endsWith("/")) { res.writeHead(308, { location: u + "/" }); return res.end(); }
    f = path.join(f, "index.html");
  }
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
  const size = fs.statSync(f).size, type = types[path.extname(f)] || "application/octet-stream";
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (m) {
    const start = m[1] ? +m[1] : size - +m[2], end = m[1] && m[2] ? +m[2] : size - 1;
    res.writeHead(206, { "content-type": type, "accept-ranges": "bytes", "content-range": `bytes ${start}-${end}/${size}`, "content-length": end - start + 1 });
    return fs.createReadStream(f, { start, end }).pipe(res);
  }
  res.writeHead(200, { "content-type": type, "accept-ranges": "bytes", "content-length": size });
  fs.createReadStream(f).pipe(res);
}).listen(+(process.env.PORT || 4789), () => console.log("ok"));
