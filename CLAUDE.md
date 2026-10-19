# CLAUDE.md — Contexto del proyecto Cachuelo

Claude Code lee este archivo al iniciar cada sesión. Mantenlo corto y al día.

## Qué es
Cachuelo: app peruana para publicar y encontrar trabajos puntuales (máx. 1 mes, Acta N°2).
Equipo: Sergio Cotillo (tecnología/finanzas), Miki (operaciones), Mauricio (crecimiento), Roger (producto y desarrollo).

## Stack
- React 18 + Vite 5 (SPA). Supabase (Postgres, Auth, RLS, Edge Functions).
- Google Maps vía `@vis.gl/react-google-maps`. Pagos: Culqi (tarjeta, Yape) — ver `src/features/payments/`.
- Desarrollo en Windows (CMD y Git Bash). Deploy web: Netlify.

## Estructura
- `src/App.jsx` — pantallas (grande; extraer a `src/screens/` cuando se toque una pantalla).
- `src/ui/` — tema, primitivas (Btn, Input, TabBar, Screen), toasts.
- `src/data/` — categorías, lugares, geo, normalización, escrituras a Supabase.
- `src/features/map/` — mapa y selector de ubicación.
- `src/features/payments/` — Pago Protegido (reglas en `pricing.js`).
- `src/features/verification/` — verificación de identidad (DNI + selfie + CUL), panel de revisión admin, foto de perfil con aprobación.
- `src/features/offers/` — ofertas con contraoferta y requisitos del cachuelo.
- `src/features/compliance/` — filtro Ley 26772, requisitos por categoría, textos legales, centro de seguridad.
- `src/features/catalog/` — selector de categorías (62 en 12 grupos) y catalogación automática del servicio escrito libremente.
- `src/features/profiles/` — perfil de doble rol (trabajador / contratante), portafolio con fotos, calificaciones.
- `src/features/demo/` — SOLO modo demo: mundo simulado (personas, ofertas, historial), Simulador "Entrar como…", Mis cachuelos simulado.
- `supabase/migrations/` — SQL versionado (correr en orden). `supabase/functions/` — Edge Functions.
- `docs/cambios/` — reporte de cada versión · `docs/informes/` — informes y minutas · `CHANGELOG.md` — resumen de versiones.

## Reglas
- Código en inglés; textos de la app y explicaciones en español peruano.
- Nunca poner llaves secretas en el frontend (service_role, CULQI_SECRET_KEY). Solo en `supabase secrets`.
- Toda escritura sensible (pagos, estados) pasa por Edge Functions; RLS solo permite lectura al cliente.
- Estilos: tokens y clases de `src/styles/liquid-glass.css`; vidrio solo en la capa de navegación.
- Inputs con font-size 16px (evita zoom en iOS). Botones ≥ 44–48 px de alto.
- Cada cambio: rama propia → `npm run build` sin errores → Pull Request → merge a `main`.
- Registrar cada versión en `docs/cambios/CAMBIOS_vX.YY.md` y resumirla en `CHANGELOG.md`.
- Privacidad: el mapa público muestra ZONAS (círculo ~300 m con pin, ~700 m por distrito; centro desplazado hasta 180 m por trigger SQL), nunca puntos exactos.
- Cobro: publicar es GRATIS (solo destacar +S/3). Se cobra al aceptar: Pago Protegido 10 % o S/5 de conexión.
- Solo usuarios con `profiles.dni_verificado` publican o postulan (validado en app y en RLS). `rol`, `dni_verificado` y `avatar_url` solo los cambia un admin.
- No pedir certificado de antecedentes penales por separado (Ley 31944): se usa el CUL.
- Una misma cuenta PUBLICA (contratante) y POSTULA (trabajador). La reputación se lleva por rol (rating / rating_contratante).
- Categorías: los id de `src/data/categories.js` deben coincidir con la tabla `categorias` (1–12 originales, 13–62 de v0.18). No cambiar id ni label existentes.
- Reseñas: solo tras un cachuelo completado, una por persona y cachuelo, en ambos sentidos. Promedios y contadores los calcula el servidor (trigger), nunca la app.
- Portafolio "verificado" = ligado a un cachuelo completado (lo decide el trigger `validar_portafolio`).

## Comandos
- `npm install` · `npm run dev` · `npm run build`

## Despliegue (estado actual)
- Netlify con deploy AUTOMÁTICO desde GitHub (`netlify.toml`): merge a `main` = producción; cada PR = vista previa (forzada a modo demo y sin key de Maps).
- Las variables `VITE_*` de producción están en el panel de Netlify (Environment variables), no en el `.env` local. Cambiarlas exige redeploy.
- Carga manual (arrastrar SOLO `dist`) queda solo para emergencias.
- Hay un Supabase real, pero desde v0.19 la app corre en MODO DEMO (`VITE_DEMO_MODE=true` en `.env` y `netlify.toml`) porque el perfil v0.18, el portafolio y Mis cachuelos aún no leen Supabase. Interruptor provisional Demo/Real en Simulador y Configuración (`src/features/demo/BackendModeSwitch.jsx`). Quitar ambos al conectar los datos (PENDIENTES #30).
- Google Maps: key restringida a la URL de Netlify + `http://localhost:5173/*`; key y Map ID en `.env` local y en el panel de Netlify.
