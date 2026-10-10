# Cachuelo

App peruana para **publicar y encontrar trabajos puntuales** ("cachuelos") de hasta un mes: limpieza, gasfitería, mudanzas, clases, eventos y más. Una misma cuenta puede **publicar** (contratante) y **postular** (trabajador).

> **Estado:** prototipo **v0.18** (octubre 2026). Funciona completo en **modo demo**, sin servidor: los datos de prueba viven en el navegador. Ver [CHANGELOG.md](CHANGELOG.md).

**Equipo:** Sergio Cotillo (tecnología y finanzas) · Miki (operaciones) · Mauricio (crecimiento) · Roger (producto y desarrollo)

---

## Qué hace hoy

| Área | Funciones |
|---|---|
| **Buscar** | Feed con 62 categorías en 12 grupos, filtros (destacados, remoto, cerca, sin ofertas), orden (recientes, precio, cercanía) y búsqueda por texto libre |
| **Mapa** | Google Maps del Perú con **zonas aproximadas** (nunca la dirección exacta) |
| **Publicar** | Gratis. El servicio se escribe "a tu manera" y se **cataloga solo**. Requisitos y documentos por categoría, más un filtro anti-discriminación (Ley 26772) |
| **Ofertas** | Aceptar el precio o contraofertar, con comentario |
| **Pagos** | Pago Protegido (10 %) o pago directo (S/ 5). Tarjeta, Yape y Plin vía Culqi. El trabajador recibe el 100 % |
| **Confianza** | Verificación con DNI + selfie + Certificado Único Laboral, foto de perfil con aprobación, centro de seguridad |
| **Perfiles** | Doble rol (trabajador / contratante), portafolio con fotos, reseñas en ambos sentidos, % completados, "recontratado X veces" |
| **Simulador** (demo) | "Entrar como" 16 personas de prueba y recorrer el flujo completo de contratar, pagar, calificar y cobrar |

---

## Empezar en tu computadora (Windows)

Necesitas **Node.js 18 o superior** ([nodejs.org](https://nodejs.org)) y **Git**.

**CMD**
```
git clone https://github.com/Avocadieu/cachuelo-prototype.git
cd cachuelo-prototype
copy .env.example .env
npm install
npm run dev
```

**Git Bash**
```
git clone https://github.com/Avocadieu/cachuelo-prototype.git
cd cachuelo-prototype
cp .env.example .env
npm install
npm run dev
```

Abre **http://localhost:5173**. Para entrar: Saltar → Continuar con Google → Hacerlo después → **Simulador de Cachuelo**.

### Variables de entorno (`.env`)

El archivo `.env` **nunca se sube a GitHub** (está en `.gitignore`). Cada quien tiene el suyo. Plantilla: [.env.example](.env.example).

| Variable | Para qué | ¿Obligatoria? |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Conectar a Supabase. Con el valor de ejemplo, la app entra en **modo demo** | No (demo) |
| `VITE_GOOGLE_MAPS_API_KEY` / `VITE_GOOGLE_MAPS_MAP_ID` | Mapa de Google. Sin ellas se muestra "Explorar por zona" | No |
| `VITE_PAYMENTS_MODE` | `demo` (sin dinero real) o `live` (Culqi) | No (demo) |
| `VITE_CULQI_PUBLIC_KEY` | Llave **pública** de Culqi | Solo en live |
| `VITE_VERIFICATION_MODE` | `demo` o `live` (bucket privado de Supabase) | No (demo) |

> 🔒 **Nunca** pongas en el frontend la `service_role` de Supabase ni la llave secreta de Culqi: van solo en `supabase secrets`.

---

## Estructura

```
src/
  App.jsx                  Pantallas principales (se irán extrayendo a src/screens/)
  ui/                      Tema, componentes base (Btn, Input, TabBar, Sheet), toasts
  styles/liquid-glass.css  Sistema visual "Liquid Glass"
  data/                    Categorías (catálogo), distritos, geografía, escrituras a Supabase
  lib/                     Cliente de Supabase y detector de modo demo
  features/
    map/                   Mapa con zonas y selector de ubicación
    payments/              Pago Protegido, billetera, reglas de precio (pricing.js)
    verification/          DNI + selfie + CUL, panel de revisión
    offers/                Ofertas, contraofertas y requisitos
    compliance/            Filtro Ley 26772, requisitos por categoría, seguridad
    catalog/               Selector de categorías y catalogación automática
    profiles/              Perfil de doble rol, portafolio, calificaciones
    demo/                  SOLO modo demo: mundo simulado y Simulador
supabase/
  schema.sql               Esquema base
  migrations/              SQL por versión (correr en orden)
  functions/payments/      Edge Function de pagos (Culqi)
docs/
  cambios/                 Reporte detallado de cada versión (CAMBIOS_vX.YY.md)
  informes/                Informes y minutas (normativa, IGV, despliegue)
referencias/               Capturas, mockups y notas de diseño
```

---

## Base de datos (Supabase)

Correr en **Supabase → SQL Editor**, **en este orden** (todas se pueden volver a correr sin romper nada):

1. `supabase/schema.sql` (solo en un proyecto nuevo)
2. `supabase/migrations/2026-10-02_v0.15_mapa.sql`
3. `supabase/migrations/2026-10-05_v0.16_pagos.sql`
4. `supabase/migrations/2026-10-09_v0.17_verificacion_ofertas_zonas.sql`
5. `supabase/migrations/2026-10-10_v0.18_catalogo_perfiles.sql`

---

## Publicar en Netlify (carga manual)

1. Verifica que tu `.env` esté en la carpeta: las variables `VITE_*` se incluyen **al compilar**.
2. `npm run build`
3. Netlify → tu sitio → **Deploys** → arrastra **solo la carpeta `dist`**.

La llave de Google Maps debe estar restringida a la URL exacta del sitio y a `http://localhost:5173/*`. Nunca uses `*.netlify.app`.

---

## Cómo trabajamos (Git)

1. Crea una rama por cambio: `git checkout -b nombre-del-cambio`
2. `npm run build` debe terminar sin errores.
3. Revisa con `git status` que **no aparezca `.env`**.
4. `git commit` → `git push -u origin nombre-del-cambio` → abre un **Pull Request** → merge a `main`.
5. Cada versión se documenta en `docs/cambios/CAMBIOS_vX.YY.md` y se resume en `CHANGELOG.md`.

Las reglas para trabajar con Claude Code están en [CLAUDE.md](CLAUDE.md).
