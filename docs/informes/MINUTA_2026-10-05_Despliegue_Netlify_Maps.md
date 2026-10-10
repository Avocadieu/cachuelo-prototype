# Minuta de sesión — 05/10/2026
**Despliegue de Cachuelo v0.16.1 en Netlify y configuración de Google Maps**

Versión de código: **v0.16.1**. En esta sesión no hubo cambios de funcionalidad. Se trabajó en dejar el proyecto listo para probarse desde el celular, y se agregaron notas de despliegue al `CLAUDE.md`.

---

## 1. Resumen

| Tema | Resultado |
|---|---|
| Carpeta de trabajo | Se reemplazó la descarga ZIP por un **clon de Git** en `F:\CACHUELO` |
| Versión aplicada | v0.16.1 copiada sobre el clon |
| Supabase | **Modo demo** por ahora (valores de ejemplo), sin conectar la base real |
| Publicación | **Netlify con carga manual** de la carpeta `dist` |
| Google Maps | Proyecto en Google Cloud, API key restringida, Map ID y topes de gasto |

---

## 2. Problemas encontrados y cómo se resolvieron

| # | Problema | Causa | Solución |
|---|---|---|---|
| 1 | `fatal: not a git repository` en todos los comandos de Git | `F:\CACHUELO` venía de "Download ZIP" de GitHub, que no trae la carpeta oculta `.git` | Se renombró a `F:\CACHUELO_respaldo` y se clonó el repo: `git clone https://github.com/Avocadieu/cachuelo-prototype.git CACHUELO` |
| 2 | No se encontraba `.env` ni `.env.example` | Windows descomprimió el zip con **doble carpeta** (`CACHUELO_v0.16.1\CACHUELO_v0.16.1\`), y robocopy copió todo como subcarpeta en vez de reemplazar archivos | Se borró la subcarpeta mal ubicada y se repitió `robocopy` apuntando a la carpeta interna |
| 3 | No existía `.env` en el respaldo | Las descargas ZIP de GitHub nunca incluyen `.env` (está excluido a propósito) | Se creó con `copy .env.example .env` |
| 4 | ¿Es obligatorio configurar Supabase? | El cliente de Supabase se crea al abrir la app; con variables vacías la app muestra pantalla en blanco | Basta con los **valores de ejemplo** de `.env.example`: la app corre en modo demo |
| 5 | Netlify permite "cargar la carpeta" directamente | La carga manual **no compila**: subir el código fuente da pantalla en blanco y además expone `.env` y `referencias` | Compilar en la PC (`npm run build`) y subir **solo `dist`** |

---

## 3. Decisiones tomadas

1. **Una sola carpeta de trabajo: `F:\CACHUELO`.** Las versiones se manejan con Git (commits y la etiqueta `v0.16.1`), no con carpetas por versión.

   ```
   F:\
   ├─ CACHUELO\             ← trabajo diario (clon con .git)
   ├─ CACHUELO_respaldo\    ← descarga ZIP antigua (borrar en unas semanas)
   └─ CACHUELO_versiones\   ← zips que entrega Claude
   ```

2. **Supabase en modo demo** mientras el foco sea diseño, UX y mapa.

   | En modo demo funciona | Requiere Supabase real |
   |---|---|
   | Interfaz, feed de ejemplo, mapa, filtros, pagos simulados | Registro y login con correo, publicar, postular, chat |

3. **Netlify con carga manual** (sin conexión a GitHub, por ahora). La conexión automática con GitHub queda para cuando el equipo trabaje con ramas y Pull Requests.

4. **Las variables se leen del `.env` local.** En carga manual, Netlify no compila, así que no usa su panel de variables: las `VITE_*` quedan "horneadas" desde el `.env` de la PC al correr `npm run build`.

5. **Google Maps con key propia** (no Demo Key), para asegurar los pines (Advanced Markers + Map ID).
   - Restricción de la key: **solo** la URL de Netlify y `http://localhost:5173/*`. No usar `*.netlify.app`, porque cualquier sitio de Netlify podría usar la key.
   - Restricción de API: solo **Maps JavaScript API**.
   - Topes: presupuesto de US$5 con alertas, y cuota diaria de cargas de mapa (ej. 500/día).

---

## 4. Procedimiento vigente

### 4.1 Publicar o actualizar en Netlify
```
cd /d F:\CACHUELO
npm run build
```
Luego: Netlify → proyecto → pestaña **Deploys** → arrastrar **solo** `F:\CACHUELO\dist`. La URL no cambia.

Para volver atrás: en **Deploys**, elegir una versión anterior → **Publish deploy**.

### 4.2 Dónde está cada configuración

| Dato | Dónde se obtiene | Dónde se usa |
|---|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Cloud → APIs y servicios → Credenciales | `F:\CACHUELO\.env` |
| `VITE_GOOGLE_MAPS_MAP_ID` | Google Cloud → Google Maps Platform → Administración de mapas → Crear ID (JavaScript, Vector) | `F:\CACHUELO\.env`. Si está vacío, se usa `DEMO_MAP_ID` |
| URL pública | Netlify → Project configuration → Change project name | Restricción de la API key |
| `VITE_SUPABASE_URL` / `ANON_KEY` | Por ahora, valores de ejemplo | `F:\CACHUELO\.env` |

### 4.3 Diagnóstico rápido

| Síntoma | Causa |
|---|---|
| Pantalla en blanco | Se subió la carpeta equivocada (debe ser `dist`) o falta `.env` al compilar |
| "Explorar por zona" | La key no estaba en `.env` al compilar → corregir, `npm run build` y volver a subir |
| "El mapa no pudo cargar" | La URL de Netlify no coincide con la restricción de la key, o aún no pasan 5 minutos desde el cambio |
| Mapa sin pines | Falta Map ID |
| No funciona "Cerca de mí" | Permiso de ubicación denegado o se abrió con `http://` |

---

## 5. Estado y pendientes (marcar al completar)

**Despliegue**
- [ ] `npm run build` sin errores en `F:\CACHUELO`
- [ ] Primer deploy manual en Netlify y nombre de proyecto fijo
- [ ] Proyecto "Cachuelo" en Google Cloud con facturación
- [ ] Maps JavaScript API habilitada, key restringida, Map ID creado
- [ ] Presupuesto US$5 y cuota diaria configurados
- [ ] Key y Map ID en `.env` → nuevo build → nuevo deploy
- [ ] Prueba en celular: mapa, pines, tarjeta, "Cerca de mí", agregar a pantalla de inicio

**Respaldo**
- [ ] `git add .`, `git commit`, `git tag v0.16.1` y `git push`. El código queda respaldado en GitHub.

**Siguiente etapa** (ver informes anteriores)
- [ ] Votar en el Acta N°3 el modelo de cobro y el IGV incluido o adicional
- [ ] Implementar cumplimiento: mayoría de edad, filtro de discriminación y avisos de seguridad (prompts listos en el `INFORME_v0.16.1`)
- [ ] Conectar Supabase real cuando se quiera probar con usuarios
- [ ] Conectar Netlify con GitHub para que se publique solo con cada push

---

## 6. Cambios de archivos en esta sesión

| Archivo | Cambio |
|---|---|
| `CLAUDE.md` | Nueva sección "Despliegue": carga manual de `dist`, variables desde `.env` local, Supabase en demo, restricciones de la key |
| `MINUTA_2026-10-05_Despliegue_Netlify_Maps.md` | Nuevo (este documento) |

Sin cambios en el código de la app respecto de v0.16.1.
