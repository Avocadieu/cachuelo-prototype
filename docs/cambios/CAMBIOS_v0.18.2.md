# CAMBIOS v0.18.2: Modo demo forzado · 19 oct 2026

## Problema
El perfil de la v0.18 (doble rol, portafolio con fotos, estadísticas y reseñas por rol)
solo se mostraba en modo demo. Con la URL real de Supabase en el `.env`, la pestaña Perfil
abría el `ProfileScreen` antiguo, sin portafolio. La conexión del portafolio con Supabase
(tabla `portafolio` + bucket) todavía no está hecha.

## Cambio
- Nueva variable `VITE_DEMO_MODE`. Con `true`, la app usa el mundo simulado (perfil v0.18,
  portafolio, Mis cachuelos, feed y Simulador) aunque haya un Supabase real configurado.
- El login y el registro siguen usando Supabase Auth.
- Archivo: `src/lib/demoBackend.js`. Documentado en `.env.example` (por defecto `false`).

## Además
- **Interruptor Demo ⇄ Real (provisional):** en Simulador y en Configuración, tarjeta "Modo".
  Cambia entre datos ficticios y Supabase en este navegador (recarga la app). Solo aparece si
  hay un Supabase real en el `.env`. Se elimina al final (PENDIENTES #30).
- **Editar cachuelo en Mis cachuelos v0.18:** botón "Editar cachuelo" en Publiqué mientras
  está abierto (sin oferta aceptada). En demo los cambios se guardan en el navegador, también
  para los cachuelos de las personas del simulador. "Reiniciar simulación" los borra.
- **Onboarding:** ya no dice "publica por S/5". Publicar es gratis; destacar cuesta S/3.

## Cómo usarlo
1. En `.env` agregar `VITE_DEMO_MODE=true`.
2. `npm run build` (o `npm run dev`).
3. Perfil → tu perfil v0.18. Para ver portafolios con datos: Configuración → Simulador →
   "Entrar como…" una persona de prueba.

## Pendiente
Conectar perfil, portafolio y Mis cachuelos con Supabase (se hará al final, junto con la
migración v0.18 en el proyecto real). Entonces quitar `VITE_DEMO_MODE`.
