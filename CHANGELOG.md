# Historial de versiones

Resumen corto de cada versión. El detalle completo, con capturas, decisiones y pasos, está en [`docs/cambios/`](docs/cambios/).

## v0.19: Perfil v0.18 visible, interruptor Demo/Real y editar cachuelos · 19 oct 2026
- Modo demo por defecto (`VITE_DEMO_MODE=true`, también en `netlify.toml`): se ve el perfil de doble rol con portafolio aunque haya un Supabase real; el login sigue siendo real.
- Interruptor provisional **Demo ⇄ Real** en Simulador y Configuración (se quita al final, PENDIENTES #30).
- "Editar cachuelo" en Mis cachuelos → Publiqué (mientras esté abierto).
- Onboarding corregido: publicar es gratis, destacar cuesta S/3.
- Incluye el deploy automático de v0.18.1 (PR #2).
- Los datos del perfil y el portafolio aún no se guardan en Supabase (pendiente para el final).
- Detalle: [docs/cambios/CAMBIOS_v0.19.md](docs/cambios/CAMBIOS_v0.19.md)

## v0.18.1: Deploy automático en Netlify · 17 oct 2026
- Netlify conectado a GitHub: merge a `main` publica solo; cada Pull Request tiene vista previa (modo demo, sin mapa).
- Variables `VITE_*` en el panel de Netlify; ya no se compila ni se arrastra `dist` a mano.
- Caché larga para `/assets`, sin caché para `index.html`.
- Detalle: [docs/cambios/CAMBIOS_v0.18.1.md](docs/cambios/CAMBIOS_v0.18.1.md)

## v0.18: Doble rol, catálogo ampliado y simulador · 9 oct 2026
- **Doble rol:** una cuenta publica y postula. "Mis cachuelos" tiene Publiqué / Postulé / Historial.
- **Catálogo:** de 12 a **62 categorías** en 12 grupos. El servicio se escribe libremente y se cataloga solo.
- **Inicio:** filtros por grupo, orden (recientes, precio, cercanía), filtro "Sin ofertas", contador de ofertas y antigüedad en cada tarjeta.
- **Perfiles:** estadísticas por rol, portafolio con fotos ("cachuelo verificado"), reseñas en ambos sentidos, % completados, "recontratado X veces".
- **Simulador:** 16 personas de prueba, 6 escenarios guiados y botón de reinicio.
- **Seguridad:** la reputación (rating, contadores) ya no se puede alterar desde la app; la calcula el servidor.
- **SQL:** `2026-10-10_v0.18_catalogo_perfiles.sql` (categorías, `servicio`, búsqueda en español, reseñas bidireccionales, portafolio + bucket).
- Repositorio ordenado: `README.md`, `CHANGELOG.md`, carpeta `docs/` y plantilla de Pull Request.
- Detalle: [docs/cambios/CAMBIOS_v0.18.md](docs/cambios/CAMBIOS_v0.18.md)

## v0.17.1: Correcciones · 9 oct 2026
- Contraoferta sin servidor ya no da "Failed to fetch" (modo demo guarda en el navegador).
- Zonas del mapa más pequeñas: 300 m con pin, 700 m por distrito, centro desplazado hasta 180 m.
- Publicar es gratis (solo "Destacado" cuesta S/ 3).

## v0.17: Verificación, ofertas y zonas · 9 oct 2026
- Verificación de identidad: DNI (ambos lados) + selfie + Certificado Único Laboral, con consentimiento (Ley 29733) y panel de revisión.
- Foto de perfil con aprobación; solo verificados publican o postulan.
- Mapa con zonas aproximadas en lugar de puntos exactos.
- Ofertas con contraoferta y comentario; requisitos/documentos por cachuelo.
- Filtro anti-discriminación (Ley 26772), centro de seguridad, avisos para categorías de riesgo.
- Corrección crítica: un usuario ya no puede darse rol de administrador.
- Detalle: [docs/cambios/CAMBIOS_v0.17.md](docs/cambios/CAMBIOS_v0.17.md)

## v0.16.1: Netlify, normativa e IGV · 5 oct 2026
- Guía de despliegue en Netlify y activación de Google Maps.
- Informe de normativa laboral (MTPE) e IGV: el 18 % aplica solo a la tarifa de Cachuelo.
- Detalle: [docs/informes/](docs/informes/)

## v0.16: Pagos · 5 oct 2026
- Pago Protegido (10 %, mín. S/ 3, máx. S/ 60) o pago directo (S/ 5). Tarjeta, Yape y Plin vía Culqi.
- Billetera, liberación al confirmar, reclamos; precio mínimo S/ 10.
- Edge Function `payments` (montos recalculados en el servidor).
- Detalle: [docs/cambios/CAMBIOS_v0.16.md](docs/cambios/CAMBIOS_v0.16.md)

## v0.15: Liquid Glass + mapa del Perú · 2 oct 2026
- Rediseño visual "Liquid Glass", barra de pestañas flotante y modo oscuro.
- Mapa interactivo de Google centrado en el Perú con alertas de cachuelos.
- Detalle: [docs/cambios/CAMBIOS_v0.15.md](docs/cambios/CAMBIOS_v0.15.md)
