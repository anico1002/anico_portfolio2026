# Subir a GitHub y desplegar en Vercel

No hay credenciales guardadas en el proyecto (por seguridad). Sigue estos pasos con tu cuenta.

---

## 1. Subir a GitHub

### 1.1 Crear el repositorio en GitHub

1. Entra en [github.com/new](https://github.com/new).
2. Nombre del repo (ej.: `anico-portfolio`).
3. Elige **Private** o **Public**.
4. **No** marques "Add a README" (el proyecto ya tiene archivos).
5. Crea el repositorio.

### 1.2 Conectar y subir desde tu máquina

En la terminal, desde la carpeta del proyecto:

```bash
cd /Users/anico/Desktop/Vibe_Projects/anico_portfolio26_2

# Añadir todos los archivos y hacer commit
git add .
git commit -m "Portfolio anico: Next 16, hero-imgs, about, proyectos, INIT.md"

# Añadir el remoto (sustituye TU_USUARIO y NOMBRE_REPO por los tuyos)
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git

# Subir (te pedirá usuario/contraseña o token de GitHub)
git push -u origin main
```

Si ya tienes un `origin` y quieres cambiarlo:

```bash
git remote set-url origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
git push -u origin main
```

**Autenticación en GitHub:** Si pide contraseña, usa un **Personal Access Token** (Settings → Developer settings → Personal access tokens). No uses la contraseña de la cuenta si tienes 2FA.

---

## 2. Desplegar en Vercel

### Opción A: Desde la web (recomendada)

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub si quieres).
2. **Add New…** → **Project**.
3. **Import Git Repository**: elige el repo que acabas de subir (ej. `anico-portfolio`).
4. Vercel detecta Next.js. Deja **Build Command** y **Output Directory** por defecto.
5. **Deploy**. En unos minutos tendrás una URL tipo `anico-portfolio.vercel.app`.

Cada `git push` a `main` generará un nuevo despliegue automático.

### Opción B: Con Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Responde a las preguntas (link to existing project o crear uno nuevo). Para producción:

```bash
vercel --prod
```

---

## 3. Comprobar el despliegue

- Las imágenes en `public/` (hero-imgs, about.webp, anico_logo.svg, projects) se sirven en la raíz.
- No hace falta `.env` para este proyecto.
- Si algo falla, revisa los **Build Logs** en el dashboard de Vercel.

---

## 4. Probar en móvil sin desplegar

### Opción A: Emulador del navegador (rápido)

1. Arranca el proyecto: `npm run dev`
2. Abre en Chrome/Edge: **http://localhost:3000**
3. Abre las DevTools (F12 o Cmd+Option+I en Mac)
4. Activa el **modo dispositivo**: icono de móvil/tablet en la barra de herramientas, o **Cmd+Shift+M** (Mac) / **Ctrl+Shift+M** (Windows)
5. Elige un dispositivo (iPhone, Pixel, etc.) o un tamaño personalizado para ver el ratio de pantalla móvil

### Opción B: Ver en tu móvil real (misma WiFi)

1. **Misma WiFi:** El móvil tiene que estar en la **misma red WiFi** que el ordenador (no datos móviles).

2. Arranca el servidor:
   ```bash
   npm run dev:mobile
   ```

3. **Obtén la IP real de tu Mac:** En otra terminal ejecuta:
   ```bash
   ipconfig getifaddr en0
   ```
   (Si no devuelve nada, prueba `en1` o `en2`: `ipconfig getifaddr en1`). Verás una IP tipo `192.168.1.45`.

4. En el **móvil**, en el navegador escribe **exactamente** esa IP con el puerto:
   ```
   http://192.168.1.45:3000
   ```
   (Sustituye por la IP que te haya salido en el paso 3; **no** uses literalmente "192.168.x.x".)

5. **Si sigue sin cargar:**
   - **Firewall de Mac:** Preferencias del Sistema → Red → Firewall → Opciones. Asegúrate de permitir conexiones entrantes para "Node" o desactiva el firewall temporalmente para probar.
   - Comprueba que en el ordenador sí abre **http://localhost:3000** con el servidor en marcha.
   - Algunos routers aíslan dispositivos (red "invitados"): el móvil y el Mac deben estar en la misma red (misma WiFi doméstica).

---

*Si guardas en el futuro un token (por ejemplo para CI), usa variables de entorno en Vercel o en GitHub Actions, nunca en el código ni en archivos commiteados.*
