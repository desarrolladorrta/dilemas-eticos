# Dilemas éticos en la práctica docente

RED de autoaprendizaje para **Teoría e Historia de la Pedagogía**, basado en `docs/info.md`.

## Publicar

Sitio estático, sin instalación ni compilación. Publica `index.html`, `styles.css`, `app.js` y `assets/` conservando sus rutas relativas.

- **GitHub Pages:** Settings → Pages → Deploy from a branch → rama y `/ (root)`.
- **Cloudflare Pages:** despliega la carpeta estática sin comando de compilación.
- **Vista local:** `python -m http.server 8080`, después `http://localhost:8080`.

**Nunca publiques `.env`.** La clave de OpenAI solo se usa en la generación previa de imágenes. El RED desplegado no llama a OpenAI, no necesita claves ni servidor y no genera costos de API por uso del estudiante. Puedes excluir del despliegue `docs/`, `scripts/`, `PRODUCT.md`, `DESIGN.md` y `.impeccable/`.

## Actividades

- Exploración de principios y perspectivas mediante ventanas de diálogo.
- Asociación de principios, reconocimiento de dilemas y mapa conceptual con corrección automática.
- Cada caso incluye una elección de acción con análisis de consecuencias y una pregunta de fundamentación con respuesta comprobable.
- No hay campos de escritura, tareas abiertas, portafolio ni entregas para el docente.
- Toda retroalimentación de actividades se abre en un diálogo con cierre por botón o Escape y retorno del foco al control de origen. El modelo de cuatro pasos conserva su lectura por pestañas.
- Opciones de extensión comparable y presentación aleatoria, con valores internos estables para corregir sin depender del orden visible.
- El progreso cuenta 17 aportes: cuatro principios, cuatro pasos, dos verificaciones, dos casos, un mapa y cuatro ítems de autoevaluación.

## Guardado y privacidad

Solo se guarda el avance y las selecciones en `localStorage`, clave `cecar-etica-v2`. No existe recepción o revisión docente. Si el almacenamiento está bloqueado, las actividades siguen funcionando durante la visita y se avisa que no habrá persistencia.

Los datos de la versión anterior no se migran porque las actividades cambiaron. La versión nueva no lee ni borra los antiguos textos personales de `cecar-etica-v1`. «Reiniciar recorrido» afecta únicamente a la versión actual.

Manrope se solicita a Google Fonts, con alternativa local si no hay conexión.

## Imágenes generadas con OpenAI

- `assets/caso-leo.webp`: docente que examina un dibujo del sistema solar junto a una maqueta.
- `assets/caso-excursion.webp`: escucha y acompañamiento antes de la visita al museo.

Ambas son **1536 × 1024 px**, adaptables sin recorte en las páginas de caso. Son escenas ficticias generadas con la API de OpenAI, identificadas como tales en los pies. No documentan personas ni hechos reales. Se usan también en el menú de casos. Los SVG anteriores fueron sustituidos y retirados.

Procedencia, modelo y prompts exactos: `docs/image-provenance/`. Para regenerar, configura localmente `OPENAI_API_KEY`, `OPENAI_IMAGE_MODEL`, `OPENAI_IMAGE_QUALITY` e `IMAGE_CONCURRENCY` en `.env` y ejecuta `python scripts/generate_images.py`. **Ese comando realiza solicitudes de pago**; no es parte del funcionamiento del RED ni debe ejecutarse para desplegarlo.

El logo blanco y favicon son los archivos proporcionados por el usuario, sin modificaciones.

## Criterios editoriales

Prevalece el nombre de curso solicitado sobre el del material fuente. No se muestran unidad, nivel o duración. El segundo caso desarrolla el esquema autorizado de inclusión y seguridad. Se conservan las referencias bibliográficas y no se inventan enlaces de video. El contenido fuente fue adaptado a autoaprendizaje sin producción escrita por solicitud del usuario.
