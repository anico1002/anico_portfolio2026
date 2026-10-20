# Publicar la web nueva fuera de Vercel

Export estático de Next (`/new`) para un hosting de archivos: hoy el puente de **Cloudflare Pages**
(anico-design.pages.dev), mañana el **Apache de MindYourGap** (anico.es). Los dos se arman igual.

## Pasos

```bash
# 1. Export con el dominio donde se va a publicar (la imagen para compartir el enlace lo lleva escrito)
SITE_URL=https://anico.es EXPORT_STATIC=1 npm run build          # Apache
SITE_URL=https://anico-design.pages.dev EXPORT_STATIC=1 npm run build   # Cloudflare

# 2. Paquete auditado (falla si falta cualquier archivo o si el dominio no cuadra)
node deploy/build.mjs apache        # → deploy/apache-out/   (lleva .htaccess y robots.txt)
node deploy/build.mjs cloudflare    # → deploy/cf-out/       (lleva _headers, _redirects y robots.txt)

# 3. Revisión de navegación real del paquete, en local (~15 min). Tiene que salir «TODO LIMPIO».
npm run qa -- deploy/apache-out

# 4. Subir (Cloudflare: npx -y wrangler@latest pages deploy deploy/cf-out --project-name=anico-design --branch=main;
#    Apache: el contenido de deploy/apache-out/ por FTP, .htaccess incluido —es un archivo oculto, que no se quede fuera—)

# 5. La misma revisión sobre la web ya publicada
npm run qa -- https://anico.es
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
| En Safari (portátil), hueco negro bajo el pie hasta volver a hacer scroll | Las letras de «Let’s talk» esperan 1,6 em por debajo para su entrada en ola; el `clip-path` las ocultaba pero Safari las contaba como alto de página (+170 px) | `overflow-y: clip` en `.roll-mask` (system.css); la revisión falla si la página es más alta que su contenido |
| Los «28+ years» en la intro y el About | Decisión de contenido: va a recruiters (edadismo) | La revisión busca «N years» en cada página |

## Lo que hay que mirar en Apache en concreto

- **Barra final**: Apache con `DirectorySlash` (por defecto) redirige `/new/games` → `/new/games/`, igual que
  Cloudflare. Si el servidor de Carlos lo tuviera desactivado, las URLs sin barra darían 404: el paso 5 lo detecta
  (prueba la carga directa de cada página con y sin barra).
- **Peticiones por rangos** (Safari no reproduce vídeo sin ellas): Apache las da de serie; el paso 5 lo comprueba en WebKit.
- **`.htaccess`** necesita `AllowOverride` activo en el servidor; si no, no hay noindex, ni cabeceras, ni la
  redirección de la raíz. Comprobar con `curl -sI https://anico.es/new/ | grep -i x-robots`.
- **La raíz** lleva a `/new/product/` en Apache y a `/new/` (la pantalla de elegir Product o Games) en Cloudflare.
  Pendiente de decidir con Alberto cuál quiere en anico.es.
