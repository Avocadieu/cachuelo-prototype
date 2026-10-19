# Cachuelo v0.18.1: deploy automático en Netlify

**Fecha:** 17 de octubre de 2026
**Base:** v0.18 (doble rol, catálogo ampliado y simulador)

---

## Resumen en 1 minuto

1. **Se acabó arrastrar la carpeta `dist`.** Netlify queda conectado al repositorio de GitHub: cada vez que se hace merge a `main`, el sitio se compila y se publica solo.
2. **Vista previa por cada Pull Request.** Antes de aprobar un cambio, cualquiera del equipo puede abrirlo desde el celular con su propia URL. Las vistas previas corren siempre en **modo demo** (sin cobros ni documentos reales) y sin mapa de Google.
3. **Las variables `VITE_*` pasan al panel de Netlify.** Ya no dependen del `.env` de la PC de quien compila.
4. **Carga más rápida en visitas repetidas:** los archivos de `/assets` se guardan en caché del navegador; `index.html` nunca, así cada deploy se ve al instante.

## Qué cambió en el código

- `netlify.toml`
  - Contextos `deploy-preview` y `branch-deploy` que fuerzan `VITE_PAYMENTS_MODE=demo`, `VITE_VERIFICATION_MODE=demo` y vacían `VITE_GOOGLE_MAPS_API_KEY` (la key está restringida al dominio de producción).
  - `SECRETS_SCAN_OMIT_KEYS` con las `VITE_*`: son públicas por diseño y el escáner de secretos de Netlify tumbaría el build al encontrarlas en el JS.
  - Cabeceras de caché: `/assets/*` inmutable por 1 año; `/index.html` sin caché.
- `README.md`: nueva sección "Publicar en Netlify (deploy automático)" con los pasos para conectar el repo.
- `CLAUDE.md`: estado de despliegue actualizado.

## Pasos pendientes (una sola vez, en el panel de Netlify)

Los hace quien administre el sitio (Sergio). Detalle en `README.md` → "Conectar el repositorio".

1. Link repository → GitHub → `Avocadieu/cachuelo-prototype`, rama `main`.
2. Copiar las variables `VITE_*` del `.env` a **Environment variables**.
3. Activar Deploy Previews; dejar Branch deploys apagado.
4. Trigger deploy y revisar que el sitio cargue con mapa y login.

## Riesgos y notas

- Si el panel no tiene las variables, el build pasa pero la app queda en modo demo sin Supabase real: revisar el paso 2.
- Si el escáner "smart detection" de Netlify igual marca la key de Google Maps, agregar en el panel `SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES` con el valor de la key.
