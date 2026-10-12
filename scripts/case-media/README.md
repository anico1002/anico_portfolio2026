# case-media — capturas y vídeos nativos para los casos de estudio

Graba una app iOS en el simulador **sin ventana y sin cursor** (toques reales con AXe) y monta
composiciones tipo Metalab: la pantalla con esquinas de iPhone sobre un campo de color.
Hecho para Gloop (2026-10-12); los guiones de toques son de Gloop, el resto sirve para cualquier app.

## Preparar (una vez por Mac)

1. AXe en `axe/` (ignorado): `gh release download v1.8.0 -R cameroncooke/AXe -p 'AXe-macOS-v1.8.0-universal.tar.gz' -D axe && tar xzf axe/*.tar.gz -C axe`
   (no hay Homebrew en el MacBook; el binario va suelto).
2. Compilar la app en un derivedData **fuera de su repo**, arrancar el simulador sin abrir Simulator.app:
   ```bash
   xcodebuild -project ~/Vibe_Projects/Gloop-app/ios/GloopDesign.xcodeproj -scheme GloopDesign \
     -destination "generic/platform=iOS Simulator" -derivedDataPath /tmp/gloop-dd build -quiet
   SIM=$(xcrun simctl list devices available | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')
   xcrun simctl boot $SIM; xcrun simctl status_bar $SIM override --time 9:41 --batteryState charged --batteryLevel 100
   xcrun simctl ui $SIM appearance dark
   xcrun simctl install $SIM "/tmp/gloop-dd/Build/Products/Debug-iphonesimulator/Gloop Design.app"
   ```

## Piezas

| Script | Qué hace |
|---|---|
| `shot.sh out.png [args]` | lanza con argumentos de Gloop (`-GloopScenario`, `-GloopRoute`, `-GloopCover`, `-GloopTab`) y captura |
| `ui.sh` | lista botones/textos visibles con su marco (para guionizar toques) |
| `overview.sh` | vídeo-resumen ~1 min navegando con toques reales → `clips/overview-raw.mp4` |
| `clips.sh <nombre>` | flujos cortos: `ruleta diario unirse visor cuenta podium…` → `clips/` |
| `compose.py <salida> [norm\|compose]` | recorta arranques, 30 fps, y monta cada pieza con la proporción de su hueco |

Lecciones: `recordVideo` solo emite fotogramas cuando cambia la pantalla y el arranque en frío deja
~3 s de negro (se recorta con `blackdetect`); tocar por coordenadas es más fiable que por etiqueta
(los `€` y espacios finos no casan); la web recorta con `object-cover`, así que cada pieza sale ya
con la proporción exacta de su hueco.

**Las capturas de Gloop no se suben** (repo público, UI sin publicar): el resultado va a
`public/maqueta/gloop/media/`, ignorado por git.
