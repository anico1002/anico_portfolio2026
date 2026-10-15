# Estudio de tipografía para el portfolio (2026-10-15)

Alberto quiere dejar Instrument Sans (Google Fonts) y **licenciar una sans de autor**: limpia, en el estilo
actual de la web (nada de tipos con mucho carácter), barata (20–30 € le parece lógico; 800 € no) y que usen
buenas agencias. Serif y mono son un extra; variable, casi siempre viene de serie. Le interesa apoyar a
tipógrafos pequeños.

## Comparador

- **Privado, en claude.ai** (móvil y fuera de casa): https://claude.ai/artifact/PmHETffoTSWVQ3U9kuwvDZ
  No compartir: lleva fuentes en versión de prueba.
- **Local**: `fuentes-prueba/comparador/index.html` (fuera de git, solo en el MacBook). Fuentes de prueba de
  cada fundición en `fuentes-prueba/` (zips oficiales que descargó Alberto).
- Cada candidata compuesta en Product (negro + ácido) y Games (blanco + efecto de videojuego), con deslizador
  de peso. Efectos de Games: **mosaico suave** (el que quedó; los demás eran «sucios») y peso a saltos.

## Candidatas (licencia web más pequeña, precios del 2026-10-15, sin IVA)

| | Fuente | Fundición | 1 estilo web | Notas |
|---|---|---|---|---|
| 01 | PP Neue Montreal | Pangram Pangram | 40 USD | La usa Plastic; nº 2 en webs de agencia en A1. **Gratis en portfolio personal** según su FAQ. **En prueba en la maqueta.** |
| 02 | PP Mori | Pangram Pangram | 40 USD | |
| 03 | PP Telegraf | Pangram Pangram | 40 USD | La de la marca de Metacampus |
| 13 | Satoshi | ITF · Fontshare | gratis | Le encaja mucho, pero en A1 no sale en webs de agencia (sobre todo SaaS) |
| 04 | Aeonik | CoType | 50 GBP | Mono propia; Revolut |
| 05 | TT Hoves Pro | TypeType | 48 USD/año | Mono incluida |
| 06 | Atyp | Suitcase Type | 75 € | |
| 07 | Haffer | Displaay | 55 € | Eje mono; GoCardless. Le gusta bastante |
| 08 | Pangea | Fontwerk | 56 € | Pangea Mono en camino |
| 10 | Messina Sans | Luzi Type | 75 CHF | «Muy limpia, kerning perfecto»; MIT, Superhuman |
| 11 | Nohemi | Rajesh Rajput | pago voluntario | Cierres especiales; le gusta el tipógrafo |
| 12 | Origin | Rajesh Rajput | pago voluntario | Funciona en pesos fuertes |

Descartadas: Right (Pangram, demasiado carácter), Suisse (no variable), Cognate y Megna (las quitó él),
Saans/Arizona (caras y fuera de estilo).

## Neue Montreal en la maqueta (en prueba)

- Versión oficial gratuita de Pangram (OTF, sin Medium ni Bold) en `public/fonts-licencia/` (**fuera de git**:
  el repo es público). En el otro Mac no está: allí la web cae en Instrument Sans.
- Pesos igualados al grosor de Instrument (medido en el trazo de la «l»): 300–400 → Regular, 500–700 →
  Semibold, 800+ → Extrabold. Al comprar: Regular + Medium + Bold (~120 USD) para recuperar la jerarquía.
- El archivo variable de la web de Pangram ignoraba el peso en Safari/iOS: usar siempre los OTF oficiales.
- Volver atrás: quitar "PP Neue Montreal" de `--font-case-sans` en `app/maqueta/layout.tsx`.

## Ácido (en prueba)

Palabras clave de los titulares (`*palabras*` → `.kw`) con un degradado naranja → fucsia → morado → azul que
fluye (10 s). Sustituye a DM Serif Display cursiva. Idea de Alberto: el «peso a saltos» combinado con el ácido,
por pensar.
