---
name: Dilemas éticos en la práctica docente · CECAR
description: Cuaderno de decisiones con lectura amplia, navegación guiada y reflexión contextualizada.
colors:
  green: "#153f35"
  green-deep: "#0d3029"
  accent: "#d8ee9d"
  ink: "#202f2b"
  muted: "#596961"
  line: "#dce3de"
  paper: "#fff"
  ground: "#f4f7f5"
  soft: "#eaf1ec"
  error: "#933c31"
  focus: "#6b8929"
  error-background: "#fff2ec"
  error-border: "#e2b4a8"
  error-text: "#713529"
typography:
  headline:
    fontFamily: 'Manrope, "Segoe UI", sans-serif'
    fontSize: "clamp(32px,3.5vw,52px)"
    fontWeight: 800
    lineHeight: 1.13
    letterSpacing: "-.04em"
  title:
    fontFamily: 'Manrope, "Segoe UI", sans-serif'
    fontSize: "25px"
    lineHeight: 1.3
    letterSpacing: "-.025em"
  body:
    fontFamily: 'Manrope, "Segoe UI", sans-serif'
    fontSize: "15px"
    lineHeight: 1.85
  lead:
    fontSize: "16px"
    lineHeight: 1.85
  label:
    fontSize: "13px"
    fontWeight: 700
rounded:
  radius: "14px"
  button: "7px"
  control: "8px"
  panel: "10px"
  case: "12px"
spacing:
  compact: "12px"
  medium: "20px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "12px 21px"
  button-primary-hover:
    backgroundColor: "{colors.green-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.green}"
    rounded: "{rounded.button}"
    padding: "12px 21px"
  button-secondary-hover:
    backgroundColor: "{colors.soft}"
  detail-panel:
    backgroundColor: "{colors.soft}"
    rounded: "{rounded.panel}"
    padding: "24px 28px"
---

# Design System: Dilemas éticos en la práctica docente

## Iconos de jerarquía

Iconos de línea originales, decorativos, en principios, pasos, encabezados de actividades y herramientas. Una sola familia con `viewBox="0 0 24 24"`, trazo de 1.7 y extremos redondeados. Tamaños: 24px en encabezados, 22px en principios, 18px en pasos y 16px en herramientas. Usan el verde del sistema o heredan el blanco en el paso activo. Todos llevan `aria-hidden="true"` y `focusable="false"`: el texto conserva el significado y el nombre accesible. No sustituyen las fotografías WebP generadas con OpenAI ni añaden acciones nuevas.

## Overview

**Creative North Star: «Cuaderno de decisiones»**, dirección aprobada y registrada en `.impeccable/surface.md`.

Sistema construido en HTML, CSS y JavaScript nativos. La interfaz de lectura combina hojas amplias, líneas finas y superficies verdes para distinguir preguntas, decisiones y apoyos. El tono es académico y claro: primero comprender, luego contrastar y fundamentar, sin presentar una decisión aislada como sustituto del análisis. El recorrido es de autoaprendizaje sin escritura, entregas ni revisión docente: los argumentos se reconocen mediante opciones cerradas comprobables y explicaciones automáticas.

Este documento describe la implementación de `styles.css`, `index.html` y los renderizadores de `app.js`, contrastada con `README.md` y `PRODUCT.md`; conserva el mundo visual existente, sin proponer una identidad nueva. Las reglas CSS heredadas sin marcado correspondiente no describen actividades vigentes.

**Key Characteristics:**
- Verde bosque y blanco frío con acento lima contenido.
- Jerarquía sans, lectura espaciosa y rutas numeradas.
- Estados expresados mediante texto, símbolos y color.
- Escenas didácticas ficticias generadas con IA y marca institucional aportada por el usuario.

## Colors

### Primary

- `green`: cabecera institucional, navegación activa, botones principales, paso seleccionado del modelo y mapa conceptual.
- `green-deep`: hover de la acción principal y texto de la selección del navegador.
- `accent`: tensiones del caso inicial, números de ruta completada y etiquetas del paso activo.

### Neutral

- `ink` y `muted`: texto principal y texto de apoyo, respectivamente.
- `ground`: fondo general; `paper`: formularios, narrativas y tarjetas; `soft`: paneles explicativos y selecciones.
- `line`: separadores y bordes discretos. La barra lateral usa además un blanco verdoso (`#fbfcfb`).

### Estados

- `focus`: contorno visible de teclado.
- El diálogo de revisión distingue su etiqueta con `error-background` y `error-text`; la etiqueta informativa o de éxito usa fondo `soft` y texto verde. El tono se expresa también con texto, no solo con color.
- Se conservan los tokens del frontmatter y reglas heredadas de feedback inline y cabeceras de caso, pero los renderizadores actuales usan diálogos y fotografías, no esos bloques. El token raíz `--error` no se aplica a la retroalimentación actual.

## Typography

**Familia única:** Manrope, con fallback explícito `"Segoe UI", sans-serif`. Se solicita a Google Fonts con `display=swap` y pesos 400, 500, 600, 700 y 800. La lectura sigue disponible con la pila del sistema si la fuente externa no carga; no es una fuente alojada localmente. Los controles heredan la tipografía y se desactiva la síntesis tipográfica.

- **H1:** escala fluida del frontmatter, ancho máximo (820px), peso fuerte y ajuste equilibrado de líneas. La bienvenida tiene su propia escala (`clamp(34px,3.5vw,52px)`).
- **H2:** título de sección según el frontmatter; **H3:** (17px), interlínea (1.5).
- **Cuerpo:** párrafos hasta (73ch); entradillas hasta (67ch), en color de apoyo. La definición inicial usa (17px) e interlínea (1.9).
- **Navegación:** (13px), peso (600); metadatos y notas entre (10–12px). Porcentaje y números de ruta usan cifras tabulares.
- **Escalas responsive intencionales:** hasta (1100px), titular de bienvenida (36px) y pregunta del panel verde (21px); hasta (800px), H1 general (36px), bienvenida (34px) y su entradilla (14px); hasta (590px), H1 general (32px), H2 (23px), bienvenida (39px), su entradilla (15px) y pregunta del panel (24px). Desde (1500px), esta pregunta llega a (29px). Son excepciones explícitas de la cascada para su composición, no errores visuales por diferir de la escala base ni del detector previo.

## Layout

- Contenedor general centrado hasta (1680px), con barra lateral de (278px) y contenido flexible. Cabecera de (90px), padding horizontal (40px), logo mostrado a (182px) de ancho.
- Navegación lateral sticky en la parte superior, altura máxima de una ventana y desplazamiento propio. Contenido principal con padding superior (49px), horizontal `clamp(24px,4.5vw,78px)` y página hasta (1060px).
- Bienvenida en dos columnas (`1.2fr 1fr`), separación (40px); recorrido introductorio en tres columnas. Principios, menú de casos y mapa usan dos columnas; perspectivas, tres; pasos del modelo, cuatro.
- Ritmo por separadores y bloques: secciones a (40px), paneles con padding aproximadamente (22–30px), rejillas con separaciones específicas de (6–25px). No hay una escala de espaciado universal aplicada a todos los elementos.
- **Desde 1500px:** bienvenida con separación (60px) y mayor padding en la pregunta del caso.
- **Hasta 1100px:** lateral (235px), menor separación introductoria y pasos del modelo en dos columnas.
- **Hasta 800px:** cabecera (76px), logo (148px), estructura de bloque. La ruta se oculta y el botón «Recorrido» la despliega en el flujo, no como overlay; enlaces en dos columnas. El menú se cierra al cambiar de ruta y sincroniza `aria-expanded`.
- **Hasta 590px:** cabecera flexible con mínimo (92px), logo (138px) y nombre del curso en una fila propia; contenido con padding (23px 20px). Bienvenida, recorrido introductorio, casos, perspectivas, mapa y asociaciones pasan a una columna. Los principios y la ruta conservan dos columnas. La acción inicial ocupa todo el ancho. Los principios tienen mínimo (120px), frente a (105px) de base; las perspectivas pasan de mínimo (83px) a (60px), con contenido que puede aumentar su altura.
- **Impresión:** desaparecen cabecera, ruta, herramientas y navegación; contenido sin límite de ancho ni padding y mapa en blanco con texto negro. No existe una entrega o descarga asociada a esta hoja de impresión.

## Elevation & Depth

Superficies planas: bordes finos y cambios de fondo separan lectura, actividad y explicación. Las tarjetas y botones no tienen sombra; sobre la fotografía del menú, la etiqueta de estado usa una sombra pequeña (`0 3px 12px #0d30291f`) para mantener su separación. El diálogo recibe sombra amplia (`0 18px 80px #0d30292b`) y fondo modal oscurecido (`#102c27a6`).

La entrada de página dura (0.3s), con `ease-out`, opacidad de (.6 a 1) y desplazamiento vertical de (6px a 0). `prefers-reduced-motion: reduce` elimina esta animación y el desplazamiento suave.

## Shapes

Esquinas moderadas, no cápsulas: radio raíz para el campo verde inicial y el diálogo; botones, paneles y casos según el frontmatter. Otros radios observados: selectores (6px), perspectivas (9px), etiquetas (5px). Los separadores y bordes habituales son de (1px). Números de ruta y cierre de diálogo son circulares.

## Components

### Acciones y campos

- Botones principales y secundarios: mínimo (46px) de alto, tipografía (13px/700), borde verde y separación interna (14px). Hover principal más oscuro; secundario con fondo suave. El estado disabled general reduce opacidad a (.5) y cambia el cursor; no implica un flujo de carga implementado.
- Selectores nativos con etiqueta, ancho completo y padding (11px 10px). No hay campos de escritura, portafolio ni descarga.
- Radios y casillas nativos, dentro de etiquetas amplias; los grupos de respuestas usan `fieldset` con nombre asociado. La opción marcada suma fondo suave y borde verde. Los campos requeridos se comprueban con `checkValidity()` y las selecciones incompletas reciben una explicación en diálogo en lugar del aviso emergente nativo.
- Las respuestas de reconocimiento, decisión y fundamentación tienen extensión comparable, sin usar la longitud como pista. Las opciones de radio, asociaciones y mapa se barajan por grupo, mantienen su orden durante la visita y conservan valores canónicos para corregir y restaurar selecciones sin depender de la posición visible. Las letras de radio indican solo el orden de presentación.

### Ruta y progreso

Seis destinos por hash, más dos vistas de caso. El destino activo usa fondo verde y `aria-current="step"`; los completados añaden un check y círculo lima. La ruta no bloquea el acceso a secciones posteriores.

El elemento nativo `progress` tiene barra de (6px), porcentaje visible y nombre accesible «Tu avance» mediante `aria-labelledby="progress-label"`. Resume 17 aportes: cuatro principios, cuatro pasos del modelo, dos verificaciones de comprensión, dos casos, un mapa y cuatro ítems de autoevaluación. Al completar cambia también el mensaje textual.

### Exploración y retroalimentación

- Principios y perspectivas son botones con `aria-haspopup="dialog"`; muestran su contenido en el diálogo compartido y registran lo explorado con texto o check. No son pestañas seleccionables ni conservan un panel inline.
- El modelo sí permanece inline: cuatro botones agrupados, estado `aria-pressed` y panel `#model-detail` con `role="status"`. Al entrar se muestra y registra el primer paso. Su apariencia de pestañas no implica un widget ARIA `tablist`.
- Toda retroalimentación de actividades se presenta en diálogo: asociaciones, reconocimiento de dilemas, contraste de decisión, comprobación de argumentos, mapa y revisión del recorrido. Explica aciertos, riesgos, pendientes y posibilidades de reintento sin depender solo de rojo o verde.
- Casos con estados textuales «Por iniciar», «En exploración» y «Completado». Completar requiere tres perspectivas exploradas, una alternativa contrastada y un argumento cerrado correcto. La elección de acción no se califica como correcta o incorrecta: se contrastan los valores protegidos y los riesgos. Cambiar la acción invalida el contraste y el completado; cambiar el argumento invalida el completado hasta comprobarlo otra vez.
- Síntesis con mapa de corrección automática, cuatro casillas de autoevaluación y revisión de pendientes, sin producción escrita ni recepción docente.
- El estado y las selecciones se guardan solo en `localStorage`, clave `cecar-etica-v2`. No se migran, leen ni borran los textos de `cecar-etica-v1`. El reinicio afecta únicamente a v2. Si el almacenamiento falla, se avisa de que el recorrido puede completarse durante la visita, sin persistencia; no se ofrece descarga como alternativa.

### Diálogos

Principios, perspectivas, retroalimentación, glosario, referencias y confirmación de reinicio comparten un `dialog` nativo abierto con `showModal()`, título asociado y cierre con nombre «Cerrar ventana». La apertura de feedback, principios y perspectivas enfoca explícitamente el título (`tabindex="-1"`); el diálogo admite Escape, mantiene la interacción modal y devuelve el foco al control de origen al cerrar. El feedback añade «Continuar» o «Volver a intentarlo» y una etiqueta textual según su tono.

Ancho máximo (720px), ancho disponible `calc(100% - 32px)`, altura máxima (85vh) y padding (30px), reducido a (23px) hasta (590px). El título mide (24px), o (21px) en móvil; los párrafos de feedback pasan de (15px) a (14px), y su acción ocupa todo el ancho móvil. El glosario usa `details`/`summary`; sus letras abren el término correspondiente y enfocan su `summary`. El reinicio ofrece conservar o reiniciar el avance actual explícitamente.

### Ilustraciones y procedencia

Cada caso incluye una figura antes de la narrativa, con imagen de ancho completo, altura automática, borde fino y radio de (12px). Las mismas fotografías aparecen en el menú de casos con proporción (3:2), coincidente con los archivos originales: aunque el CSS declara `object-fit: cover`, no impone un recorte distinto de esa proporción. Las figuras de caso conservan la imagen completa sin recorte.

| Archivo | Texto alternativo implementado | Pie visible |
| --- | --- | --- |
| `assets/caso-leo.webp` | Un docente examina un dibujo del sistema solar en un escritorio donde también hay una maqueta tridimensional. | El aprendizaje demostrado y los materiales disponibles son dimensiones diferentes de la evaluación. |
| `assets/caso-excursion.webp` | Una educadora escucha a un adolescente y revisa un mapa con él, mientras otro adulto acompaña al grupo a la entrada de un museo. | Escuchar y planificar apoyos permite analizar la inclusión junto con la seguridad del grupo. |

Ambos WebP declaran (1536 × 1024px), fueron generados con la API de OpenAI durante la construcción y representan escenas ficticias, no personas ni hechos reales documentados. Cada pie añade «Imagen generada con IA · escena ficticia.», con cuerpo (12px), interlínea (1.8), máximo (76ch) y nota final (10px). El menú reutiliza el alt contextual y carga las imágenes con `loading="lazy"`.

Los sidecars de procedencia en `assets/` y los registros de `docs/image-provenance/` documentan su generación, modelo y prompts. Los SVG anteriores fueron sustituidos y retirados. La aplicación del estudiante no llama a OpenAI ni necesita claves o generación en tiempo de uso.

**Rasters de entrega:** `assets/logo-cecar.png` y `assets/favicon.ico` fueron proporcionados por el usuario. No se atribuyen a generación del RED. El logo blanco conserva su proporción, dimensiones declaradas (574 × 182), alt «CECAR, Corporación Universitaria del Caribe» y enlace con nombre «CECAR · inicio». El favicon se enlaza directamente desde el documento.

### Accesibilidad y revisión registrada

- Documento en español, landmarks nativos, enlaces y controles semánticos, etiquetas asociadas y símbolos decorativos ocultos con `aria-hidden`.
- El enlace «Saltar al contenido» aparece al recibir foco. Su activación enfoca `main#content` (`tabindex="-1"`) y desplaza al contenido sin convertir `#content` en una ruta de la aplicación. Los cambios de ruta llevan también el foco al contenido y actualizan el título de página.
- Foco visible en controles y enlaces: contorno (3px), separación (4px). El título del diálogo recibe foco programático sin contorno; los controles mantienen el suyo. Una región `aria-live="polite"` anuncia el reinicio. Se respeta movimiento reducido.
- **Resultado de revisión actual comunicado:** revisión independiente **SHIP en el alcance de los cambios**, con **64 checks y 5 comprobaciones adicionales en navegador** comunicados. Sustituye el registro de la revisión anterior; no presenta diferencias intencionales de tamaño entre breakpoints como defectos visuales.
- Este registro no constituye certificación WCAG ni acredita una evaluación exhaustiva de conformidad. Esta pasada documental no repite las pruebas ni amplía sus resultados.

## Do's and Don'ts

### Do

- Mantener el «cuaderno de decisiones», los valores de la implementación y la jerarquía de lectura antes de aplicación.
- Conservar estados textuales, foco visible, navegación por teclado y controles nativos junto con sus señales visuales.
- Acompañar cada figura con su alt contextual, pie y procedencia; preservar el logo institucional aportado.
- Distinguir revisión funcional aprobada de certificación de accesibilidad.
- Mantener argumentos comprobables, alternativas de extensión comparable y valores canónicos independientes del orden aleatorio.

### Don't

- No reemplazar el análisis de tensiones por respuestas moralizantes o mensajes basados solo en color.
- No inventar imágenes de personas reales, fuentes audiovisuales no verificadas ni atribuciones de marca.
- No presentar la fuente remota como local ni el guardado del navegador como un servicio de servidor.
- No introducir unidad, nivel, tiempo o una certificación inexistente en esta interfaz.
- No reintroducir escritura, portafolio, descarga ni revisión docente, ni migrar o borrar los textos de v1 desde el flujo v2.
