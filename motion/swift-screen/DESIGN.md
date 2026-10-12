# Design System — SwifT Translator

## Overview

Landing de producto macOS al estilo Apple: fondo blanco con secciones alternas en gris muy claro,
tipografía del sistema en negrita con interlineado apretado y un único acento violeta reservado para
CTAs y antetítulos. Composición centrada en el hero; después, rejillas de tarjetas blancas con radio
18 y sombra suave. Tono sereno, preciso y sin ruido: el producto se presenta como algo que desaparece.

## Colors

- **Background**: `#FFFFFF` — superficie principal.
- **Background Alt**: `#F5F5F7` — secciones alternas.
- **Text**: `#1D1D1F` — titulares y texto principal.
- **Text Secondary**: `#6E6E73` — párrafos.
- **Text Tertiary**: `#AEAEB2` — notas y metadatos.
- **Accent**: `#7C3AED` — CTA «Download», antetítulos, iconos de feature.
- **Accent Hover**: `#8B5CF6`.
- **Window dots**: `#FF5F57` · `#FFBD2E` · `#28C840` — semáforo de la ventana macOS.

## Typography

- **Sans**: -apple-system / SF Pro Display (400, 500, 600, 700). Todo el sitio.
- Display 64 px / 700 / -1.5 px · H2 48 px / 700 / -1 px · H3 20 px / 600 · cuerpo 18 px / 400 en `#6E6E73`.
- Antetítulos en mayúsculas, pequeños y violetas («FEATURES», «HOW IT WORKS»).

## Elevation

Tarjetas blancas sobre `#F5F5F7` con `0 4px 24px rgba(0,0,0,.08)` y borde `rgba(0,0,0,.08)`; la
ventana de demo sube a `0 8px 40px rgba(0,0,0,.12)`. Nada de cristal ni degradados fuertes.

## Components

- **App icon squircle**: rayo blanco sobre negro, esquinas de icono macOS.
- **Keycaps ⌥ ⌘ T**: teclas pequeñas con borde gris, inline en el texto.
- **Notes demo window**: ventana macOS con semáforo, etiqueta «ARABIC · AR» y texto traducido.
- **Trust strip**: fila de «✦ Powered by Apple Translation · ✦ No account required…».
- **Feature cards 2×2** con icono violeta en cuadrado redondeado.
- **Engine rows**: TranslateGemma 4B / Apple Translation / Google Translate con su etiqueta.
- **Language tiles**: 14 banderas en baldosas grises.

## Do's and Don'ts

### Do's
- Mucho blanco; un solo acento violeta por pantalla.
- Titulares en dos líneas cortas con punto final («Translate anything. One shortcut.»).
- Sombras suaves y radios generosos.

### Don'ts
- Ni fondos oscuros ni degradados saturados.
- Ni más de un color de acento.
- Ni movimiento brusco: el producto «se aparta del camino».
