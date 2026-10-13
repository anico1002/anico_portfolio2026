# Plan de contenidos de los casos de Product (2026-10-13)

> Base para que Alberto decida con calma qué cuenta cada caso. Sale de leer el repo de cada proyecto
> (solo lectura). Idea rectora, pedida por Alberto: **no reutilizar las láminas de la web actual**; cada caso
> se compone con piezas **redibujadas del producto real** (titulares en texto, componentes recreados en
> HTML/CSS con los tokens reales, animaciones propias) y con **un gesto propio** que lo diferencie de los
> demás. Los textos de aquí son borradores de enfoque, no copy final (habrá revisión de copywriter).
>
> Orden de montaje: **Gloop** (caso estrella) → SwifT → Interactius → 7news → Dovla → El Reto.
> WineUp queda fuera (no es un proyecto hecho juntos).

---

## 1 · Gloop — el caso estrella

**Por qué es el principal:** enseña el trabajo que Alberto vende hoy: producto de principio a fin, prototipo en
código con IA, app nativa en SwiftUI y entrega al repo del equipo de desarrollo.

**Enfoque:** el rediseño de una app social que ya existía (iOS y Android). Un test real de campo cambió la
dirección del producto y obligó a un sistema que lo sostuviera.

**El reto (documentado):** unas **500 personas** descargaron la app en un stand con QR en una feria de verano.
Hallazgo: *«el usuario no sabe qué hacer»*, al entrar y dentro de la experiencia; un público de 20-35 años que
no lee y quiere actuar en un clic. Principio que salió de ahí: **«la app enseña siempre una sola cosa que hacer
ahora, y está en el primer scroll»**. Después, el giro de producto: de los eventos a los equipos (*el equipo es
el contenedor*).

**Capítulos y gesto propio de cada uno**
1. **El hallazgo** — el principio en grande, como frase sola. Gesto: una pantalla con diez cosas que se apagan
   hasta dejar una sola encendida.
2. **El giro: del evento al equipo** — diagrama animado: los eventos orbitan alrededor de la persona y, con el
   scroll, se reordenan alrededor del equipo.
3. **El color significa algo** — cuatro chips (*en directo · lo tuyo · algo te espera · irreversible*) que al
   pasar recolorean una misma tarjeta de equipo recreada con los tokens reales (#9F4AFA, lima #C5E621,
   fucsia #FA0D50, danger #F5343A).
4. **Las cuatro capas** — vista explosionada: cuatro planos (comportamiento nativo · controles nativos vestidos
   · superficies de marca · momentos firma) que se juntan con el scroll hasta formar la pantalla.
5. **El canon de formas** — el «imago» (la esquina recta del logo) se convierte en la esquina de las tarjetas
   (radio 18, arriba a la izquierda recta) y en el avatar; radios en múltiplos de 6.
6. **El UI kit** — el kit web real (Foundations, ~15 componentes, código Swift y Kotlin copiable) grabado en
   movimiento dentro de un portátil. Es la pieza que faltaba («hay demasiado móvil»).
7. **Del diseño al código** — línea de proceso horizontal con fechas reales: test con 500 descargas → giro a
   equipos → kit presentado al cliente → v3 (15 pantallas, prototipo con 10 escenarios) → app SwiftUI entera en
   el iPhone → entrega al repo del equipo de desarrollo.
8. **Momentos firma** — los juegos (Culpable, Podium, De 0 a 100…) en una ruleta de portadas, el único sitio
   donde la marca hace lo que quiere.
9. **Resultado / próximos pasos.**

**Menos móvil:** de las capturas nativas se quedan solo 2-3 piezas (la noche, los Momentos), no una por sección.

**Dudas para Alberto**
- ¿Se puede nombrar la feria y enseñar el kit desplegado? (marcas de terceros, permiso del cliente).
- Autoría del código: ¿cómo contar el trabajo con IA (diseño y dirección tuyos, código asistido)?
- ¿Se puede decir que la app no está publicada aún, o mejor no mencionarlo?

---

## 2 · SwifT — la herramienta que no se ve

**Enfoque:** una app de macOS que vive en la barra de menús y traduce cualquier texto seleccionado con un atajo
(**⌥⌘T**; el ⌘⇧T era de la v1). Diseño y desarrollo de Alberto, icono y landing incluidos.

**El reto:** calidad y privacidad sin configuración. La v2.1 lleva su propia IA (TranslateGemma 4B, en el Mac,
sin internet), con Apple Translation y Google como red. Cada decisión fue una resta.

**Capítulos y gesto propio**
1. **Seleccionar, pulsar, listo** — la demo recreada en texto real: barrido de selección violeta, las teclas
   ⌥⌘T que se encienden y la frase que cambia de idioma (incluido árabe, de derecha a izquierda).
2. **«Everything you need. Nothing you don't.»** — titular en texto y las cuatro cards (*Select & translate,
   Auto-flip, Powered by Apple, Stays out of your way*) pasando de izquierda a derecha con el scroll.
3. **Frases trampa** — cards de traducción literal mala frente a la buena (modismos, «tío» ≠ «uncle», cifras que
   se conservan). Resultado del banco de 21 frases: **TranslateGemma 15 · Apple 11 · Google 10**.
4. **Tres motores, cero configuración** — cascada animada con el porqué de cada salto (textos largos a Apple;
   catalán, gallego y euskera a Google porque el modelo local invertía el sentido).
5. **Banderas imposibles** — la senyera, la gallega y la ikurriña dibujadas con la onda de las emoji de Apple,
   porque Unicode no tiene glifo para ellas.
6. **El icono** — de lo literal (bocadillo, A/文) a la marca abstracta «cálido + frío = dos idiomas».

**Datos:** 14 idiomas, macOS 13+, modelo de 2,49 GB, cero telemetría.
**Dudas:** el nombre (choca con Swift de Apple; valoras «Swifty»); la landing tiene copy desfasado.

---

## 3 · Interactius — un manual de marca que hace cosas

**Enfoque:** un manual de marca vivo y preparado para IA: una sola fuente de datos alimenta la web del manual
(ES/EN/CA), una API de marca, un validador de tono y un generador de presentaciones de Markdown a deck 16:9.

**El reto:** la marca anterior identificaba la firma pero no sostenía una conversación en sala. Y las
presentaciones se rompían: el generador tenía que ser imposible de romper (sin editor libre, retícula fija,
texto que se ajusta solo).

**Capítulos y gesto propio**
1. **Una sola fuente** — se cambia un color en el token y cambian a la vez la muestra, el JSON de la API y una
   barra del Gantt.
2. **De Markdown a slide en vivo** — se escribe `[ly: columnas]` con tres apartados y la diapositiva se monta;
   con un cuarto, la retícula se reajusta sola.
3. **El Gantt que se teclea** — `Discovery: 2-3.5` y la barra crece media celda; los hitos ◆ caen en su sitio.
4. **Texto que nunca se sale** — un párrafo que crece y se encoge dentro de la franja de la retícula.
5. **El tono** — una frase con «soluciones innovadoras» que se marca y propone la reescritura.

**Identidad:** IBM Plex Mono + Plex Serif; Opal, Bordeaux y Emerald (uno por servicio); logotipo `interactīus`.
**Dudas:** el reparto del crédito (en git hay mucho código de otra persona del equipo: ¿dirección de diseño tuya,
desarrollo compartido?); qué herramientas del workspace se cuentan; nada de nombres de clientes ni importes.

---

## 4 · 7news — el día se acaba

**Enfoque:** un lector de noticias nativo para iPhone y Apple Watch, hecho para uno mismo. Sin IA ni noticias
generadas: un lector de feeds que **decide cuándo has terminado**.

**El reto:** los lectores son infinitos y nunca sabes si lees algo de hoy o de hace tres meses. Decisiones:
ventana de 48 h, máximo 3 noticias por fuente, la misma noticia de varios medios agrupada, y un final:
**«Ya estás al día»**.

**Capítulos y gesto propio**
1. **De 678 a 32** — un muro infinito de titulares que se comprime con el scroll al aplicar cada regla, hasta
   quedarse en «Ya estás al día».
2. **Crear un tema** — se escribe «IA» y aparecen sus 7 fuentes, con las descartadas tachadas.
3. **El logo es la barra de carga** — el logotipo real se rellena de izquierda a derecha con el progreso (como
   el splash de la app).
4. **Del iPhone a la muñeca** — la notificación «3 cosas nuevas» que baja al Watch.

**Dudas:** ¿por qué «7» (y antes «8»)? No está escrito. Hay que hacer capturas en el simulador.

---

## 5 · Dovla — el banco que no grita

**Enfoque:** UI/UX de una app nativa iOS de neobanco, lista para que un equipo le conecte el backend. Listón
declarado: la usabilidad de Revolut; regla: ante dos soluciones defendibles, gana la más fácil.

**El reto:** partir de una identidad de agencia (color y tipografía) sin heredar su navegación; corregir lo que
no pasaba accesibilidad; y que la Home dejara de ser un extracto: *«un extracto no es un sitio al que llegar»*.

**Capítulos y gesto propio**
1. **El saldo que viaja en el tiempo** — con el scroll por los movimientos, la cifra muestra lo que había en cada
   uno (solo cambian los dígitos que varían) y se cruza con el logotipo en la barra.
2. **De extracto a escaparate** — antes/después arrastrable entre la lista larga y la Home por bloques.
3. **Un dato, no un piropo** — la gráfica de gasto comparada con el mismo día del mes pasado, no con el mes
   entero, con un control que enseña cómo cambia el mensaje.
4. **El patrón dovela** — teselado de cuartos de círculo generativo (la dovela sostiene el arco: el patrón dibuja
   el nombre).
5. **Texto grande** — un control en vivo que demuestra que un importe nunca se parte.

**Dudas:** ¿hay NDA, se puede nombrar? ¿La identidad es de la agencia (atribuirla) y el UI/UX tuyo? Todo es
provisional (paleta, logo, tipografía): ¿cambió algo desde septiembre? ¿Grabaste ya el vídeo del móvil?

---

## 6 · El Reto — la cocina como competición

**Enfoque:** plataforma gamificada para el concurso online de MasterChef World: energía (puntos) por mini retos
diarios, desafíos semanales en vídeo, directos con chefs y likes, hasta un casting televisado.

**El reto:** una sola base de código con dos superficies (web de escritorio y app móvil); el casting solo en la
app (cámara y micrófono); puntuación auditable; e IA en el bucle (transcripción, lectura de métricas, trivias).

**Capítulos y gesto propio**
1. **La energía** — la tarjeta de puntuación viva: «+30 ⚡» y la barra de nivel que se llena y sube cada 500 pts.
2. **Sigue al chef** — pasos del directo con cronómetro que se pone rojo al pasarse y «Foto subida».
3. **El embudo** — Top 1.000 → Top 100 → Top 5 → 15 aspirantes, estrechándose con el scroll.
4. **La marca** — círculos concéntricos y glows que derivan detrás del logo (el degradado #F3AD68 → #FC6B37).

**Dudas:** ¿2025 o 2026? ¿Se publicó en las tiendas? ¿De dónde salen las cifras del caso actual (+9K usuarios,
230K, 5M seguidores)? Autoría (diseño tuyo, código asistido). Nada de la «M» de MasterChef ni datos de usuarios.
