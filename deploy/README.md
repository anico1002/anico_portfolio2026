# Publicar la web fuera de Vercel

Export estático de Next para el **Apache de MindYourGap**, que sirve **anico.design** (anico.es redirige ahí).
Desde el 2026-11-02 la web vive en la raíz y es pública: `/`, `/product`, `/games`, `/product/<caso>`, `/games/<caso>`.

**Atajos y redirecciones, solos.** `build.mjs` mira qué casos hay en el export y escribe en el `.htaccess`, para cada
uno, su atajo (`/gloop` → `/product/gloop/`), su URL vieja de `/new` y la de la web anterior (`/proyecto/<caso>`).
Un caso nuevo no necesita nada más que su página. Las URLs viejas de casos que ya no existen: `lib/maqueta/rutas-viejas.json`.
En desarrollo hace lo mismo `next.config.ts` (`redirects`).

El puente de **Cloudflare Pages** (anico-design.pages.dev) queda solo para redirigir: `node deploy/build.mjs cloudflare`
arma `deploy/cf-redirect-out/` (todo → anico.design, misma ruta). Subirlo cuando anico.design ya esté en el servidor.

## Pasos

```bash
# 1. Export con el dominio donde se va a publicar (la imagen para compartir el enlace lo lleva escrito)
SITE_URL=https://anico.design EXPORT_STATIC=1 npm run build

# 2. Paquete auditado (falla si falta cualquier archivo, si el dominio no cuadra o si el sitemap nombra algo que no está)
node deploy/build.mjs apache        # → deploy/apache-out/   (lleva .htaccess con redirecciones, robots.txt y sitemap.xml)

# 3. Revisión de navegación real del paquete, en local (~15 min). Tiene que salir «TODO LIMPIO».
npm run qa -- deploy/apache-out

# 4. Subir (Cloudflare: npx -y wrangler@latest pages deploy deploy/cf-out --project-name=anico-design --branch=main;
#    Apache: python3 deploy/subir-ftp.py — el contenido de deploy/apache-out/, .htaccess incluido)

# 5. La misma revisión sobre la web ya publicada
npm run qa -- https://anico.design
```

No se arma nunca un paquete a mano ni se sube sin los pasos 3 y 5.

## Fallos que ya pasaron (2026-10-19/20) y qué los evita

Todos llegaron a la web publicada y los vio Alberto, no la auditoría. La auditoría de entonces solo comprobaba que
existieran archivos; ninguna navegaba de verdad.

| Fallo | Causa | Qué lo evita ahora |
|---|---|---|
| La foto del About no cargaba | El paquete se armó a mano copiando carpetas y se quedó fuera `/about.webp`, de la raíz de `public/` | `deploy/build.mjs` copia todo lo que nombran las páginas y falla si falta algo |
| Al cambiar Product ⇄ Games desde el menú del móvil, pantalla negra para siempre | El export sirve las rutas con barra final (`/new/games/`) y el código las comparaba sin ella: la cortinilla nunca daba la página por cargada | `bare()` en `lib/maqueta/base.ts` en todas las comparaciones de rutas, y la cortinilla se quita sola como mucho a los 8 s |
| La imagen al compartir el enlace (WhatsApp, LinkedIn…) salía rota | `og:image` apuntaba a anico.design, donde ese archivo no existe | `SITE_URL` al construir; `build.mjs` comprueba que el export apunta al dominio del destino |
| «About» desde un caso: ~5 s en negro | La cortinilla esperaba a un vídeo tapado (tarjeta sin revelar) que nunca iba a cargar | `Portal.tsx` no espera a vídeos perezosos que nadie ha pedido |
| En Safari (portátil), hueco negro bajo el pie hasta volver a hacer scroll | Las letras de «Let’s talk» esperan 1,6 em por debajo para su entrada en ola; el `clip-path` las ocultaba pero Safari las contaba como alto de página (+170 px) | `contain: paint` en `.hablamos` (system.css; `overflow-y: clip` en `.roll-mask` cortaba la «k» en Safari); la revisión falla si la página es más alta que su contenido |
| Los «28+ years» en la intro y el About | Decisión de contenido: va a recruiters (edadismo) | La revisión busca «N years» en cada página |

## Lo que hay que mirar en Apache en concreto

- **Barra final**: Apache con `DirectorySlash` (por defecto) redirige `/games` → `/games/`, igual que
  Cloudflare. Si el servidor de Carlos lo tuviera desactivado, las URLs sin barra darían 404: el paso 5 lo detecta
  (prueba la carga directa de cada página con y sin barra).
- **Peticiones por rangos** (Safari no reproduce vídeo sin ellas): Apache las da de serie; el paso 5 lo comprueba en WebKit.
- **`.htaccess`** necesita `AllowOverride` activo en el servidor; si no, no hay cabeceras ni redirecciones.
  Comprobar con `curl -sI https://anico.design/gloop | grep -i location` (→ `/product/gloop/`).
- **Dominio único**: `curl -sI http://anico.es/new/gloop` → 301 a `https://anico.design/new/gloop` (y de ahí a su
  caso). Y que `curl -sIL http://anico.design/` acabe en 200 sin dar vueltas: si el servidor tuviera un proxy
  delante, la regla http → https podría hacer bucle (ver el `.htaccess`).
- **Analítica**: Umami (`components/SiteAnalytics.tsx`) solo cuenta en anico.design; el alias `anico.es.mialias.net`
  sirve la web para pruebas sin contar visitas.
