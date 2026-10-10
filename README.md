# 📚 Biblioteca de Estudio — Medicina de Urgencia

Biblioteca personal de artefactos de estudio creados con Claude, ordenados por temática y publicados con GitHub Pages para revisarlos desde el celular o el iPad.

## Estructura

```
biblioteca-estudio/
├── index.html            ← portada: temáticas, búsqueda, favoritos y vistos recientemente
├── ver.html              ← visor con barra "← Biblioteca" (necesario en modo app del iPad)
├── catalogo.json         ← ÚNICO archivo que se edita para registrar artefactos
├── manifest.webmanifest  ← permite instalarla como app
├── sw.js                 ← copia sin conexión de lo que ya abriste
├── .nojekyll             ← indica a GitHub Pages que sirva los archivos tal cual
├── assets/               ← estilos, lógica e íconos de la portada
├── ultrasonido/
├── cardiologia/
├── toxicologia/
├── politrauma/
├── drogas-vasoactivas/
└── farmacologia/         ← "Revisiones farmacológicas"
```

## 1 · Publicar por primera vez (≈10 minutos, una sola vez)

1. Entra a <https://github.com/new>.
   - **Repository name:** `biblioteca-estudio`
   - **Public**
   - No marques "Add a README".
   - Pulsa **Create repository**.
2. En la página del repo vacío, haz clic en **"uploading an existing file"**.
3. Descomprime el ZIP en tu computador y **arrastra el contenido de la carpeta** (no la carpeta misma) a la ventana. Incluye `assets/` y todas las subcarpetas.
   - El archivo `.nojekyll` queda oculto en Mac. Si no se sube, no pasa nada: el sitio funciona igual.
4. Pulsa **Commit changes**.
5. Ve a **Settings → Pages**.
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` / `(root)`
   - Pulsa **Save**.
6. Espera 1–2 minutos. La dirección queda así:
   **`https://TU-USUARIO.github.io/biblioteca-estudio/`**

## 2 · Instalarla como app en iPad / iPhone

1. Abre la dirección en **Safari**.
2. Toca **Compartir → Agregar a pantalla de inicio**.
3. Se abre a pantalla completa, con ícono propio. Lo que ya abriste queda disponible sin conexión.

## 3 · Agregar un artefacto nuevo

### Opción A — Con Claude (recomendada)

Conecta el repositorio a la conversación y pide, por ejemplo:

> «Guarda este artefacto en mi biblioteca, temática Toxicología, etiquetas paracetamol y N-acetilcisteína».

Claude sube el HTML a la carpeta correcta y actualiza `catalogo.json`.

### Opción B — Manual

1. Descarga el artefacto como `.html` y ponle un nombre corto, **sin espacios ni tildes** (por ejemplo `intoxicacion-paracetamol.html`).
2. En GitHub, entra a la carpeta de la temática → **Add file → Upload files** → **Commit**.
3. Abre `catalogo.json` → ícono del lápiz ✏️ → agrega un bloque dentro de `"artefactos"`:

```json
{
  "id": "intoxicacion-paracetamol",
  "titulo": "Intoxicación por paracetamol",
  "tema": "toxicologia",
  "archivo": "toxicologia/intoxicacion-paracetamol.html",
  "descripcion": "Nomograma, dosis de NAC y criterios de derivación.",
  "etiquetas": ["paracetamol", "NAC", "hepatotoxicidad"],
  "fecha": "2026-10-10"
}
```

4. **Commit changes.** En ~1 minuto aparece en la portada.

> ⚠️ **El error más común:** olvidar la **coma** entre bloques. Cada `{ … }` va separado del siguiente por `,`, salvo el último.
> Si la portada queda en blanco, pega el contenido de `catalogo.json` en <https://jsonlint.com> para encontrar el error.

### Campos del catálogo

| Campo         | Obligatorio | Descripción |
|---------------|:-----------:|-------------|
| `id`          | ✔ | Identificador único, sin espacios. Se usa en la URL y en favoritos. |
| `titulo`      | ✔ | Nombre visible de la tarjeta. |
| `tema`        | ✔ | Uno de los `id` de `temas`: `ultrasonido`, `cardiologia`, `toxicologia`, `politrauma`, `drogas-vasoactivas`, `farmacologia`. |
| `archivo`     | ✔ | Ruta relativa al HTML. |
| `descripcion` |   | 1–2 líneas que se muestran en la tarjeta. |
| `etiquetas`   |   | Lista de palabras clave para la búsqueda. |
| `fecha`       |   | `AAAA-MM-DD`. Ordena las tarjetas, de la más nueva a la más antigua. |

## 4 · Agregar o cambiar temáticas

1. Crea la carpeta nueva.
2. En `catalogo.json`, agrega un elemento en `"temas"`:

```json
{ "id": "via-aerea", "nombre": "Vía aérea", "icono": "🫁", "color": "#0369a1" }
```

El orden de `"temas"` es el orden en que aparecen las secciones y los filtros.

## Notas

- **Favoritos y "vistos recientemente"** se guardan en cada dispositivo. No se sincronizan entre el iPad y el celular.
- **Visibilidad:** el sitio es **público**. Úsalo solo para material de estudio, sin datos de pacientes ni documentos internos.
- **Si un artefacto no se ve dentro del visor,** usa el botón ↗ de la barra superior para abrirlo solo.
- **Probar en tu computador:** abrir `index.html` con doble clic no carga el catálogo, porque el navegador lo bloquea. Usa `python3 -m http.server` dentro de la carpeta y abre <http://localhost:8000>.
