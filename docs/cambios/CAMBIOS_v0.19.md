# CAMBIOS v0.19: Perfil v0.18 visible, interruptor Demo/Real y editar cachuelos · 19 oct 2026

**Base:** v0.18 + v0.18.1 (deploy automático en Netlify, PR #2, incluido en esta versión).

## Problema
El perfil de la v0.18 (doble rol, portafolio con fotos, estadísticas y reseñas por rol)
solo se mostraba en modo demo. Con la URL real de Supabase en el `.env`, la pestaña Perfil
abría el `ProfileScreen` antiguo, sin portafolio. La conexión del portafolio con Supabase
(tabla `portafolio` + bucket) todavía no está hecha.

## Cambios
- **Modo demo por defecto:** nueva variable `VITE_DEMO_MODE`. Con `true`, la app usa el
  mundo simulado (perfil v0.18, portafolio, Mis cachuelos, feed y Simulador) aunque haya un
  Supabase real. El login y el registro siguen usando Supabase Auth.
  - Local: `VITE_DEMO_MODE=true` en `.env` (documentado en `.env.example`, por defecto `false`).
  - Netlify: `VITE_DEMO_MODE = "true"` en `netlify.toml` (pisa al panel).
- **Interruptor Demo ⇄ Real (provisional):** en Simulador y en Configuración, tarjeta "Modo".
  Cambia entre datos ficticios y Supabase en este navegador (recarga la app). Solo aparece si
  hay un Supabase real configurado. En modo Real se ven las pantallas anteriores.
- **Editar cachuelo en Mis cachuelos v0.18:** botón "Editar cachuelo" en Publiqué mientras
  está abierto (sin oferta aceptada). En demo los cambios se guardan en el navegador, también
  para los cachuelos de las personas del simulador. "Reiniciar simulación" los borra.
- **Onboarding:** ya no dice "publica por S/5". Publicar es gratis; destacar cuesta S/3.
- **Deploy automático (v0.18.1):** ver [CAMBIOS_v0.18.1.md](CAMBIOS_v0.18.1.md).

## Archivos
- `src/lib/demoBackend.js`: `VITE_DEMO_MODE`, `hasRealBackend`, `setBackendMode`.
- `src/features/demo/BackendModeSwitch.jsx` (nuevo), `SimulatorScreen.jsx`, `DemoMyCachuelos.jsx`, `demoWorld.js`.
- `src/data/cachuelosApi.js`: `updateCachuelo` en modo demo.
- `src/App.jsx`: interruptor en Configuración, ruta de edición desde Mis cachuelos, texto del onboarding.
- `netlify.toml`, `.env.example`, `package.json` (0.19.0), `CLAUDE.md`, `referencias/PENDIENTES.txt` (#27–#30).

## Cómo probarlo
1. Perfil → tu perfil v0.18. Para ver portafolios con datos: ⚙️ Configuración → Simulador →
   "Entrar como…" una persona de prueba.
2. Mis cachuelos → Publiqué → "Editar cachuelo".
3. Configuración → tarjeta "Modo" → cambiar a Real y volver a Demo.

## Pendiente (#30)
Conectar perfil, portafolio, Mis cachuelos y la edición con Supabase (al final, junto con la
migración v0.18 en el proyecto real). Entonces quitar el interruptor y `VITE_DEMO_MODE`.
