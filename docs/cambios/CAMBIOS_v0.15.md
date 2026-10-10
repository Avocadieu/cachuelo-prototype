# Resumen v0.15 — 02/10/2026
**Rediseño Liquid Glass + Mapa interactivo del Perú**

Base: repositorio `Avocadieu/cachuelo-prototype`, commit `74ee21a` (v0.14).

---

## 0. Instalación (después de copiar los archivos)

**CMD (Windows)**
```
cd /d F:\CACHUELO
git rm -r --cached node_modules
npm install
npm run dev
```

**Git Bash**
```
cd /f/CACHUELO
git rm -r --cached node_modules
npm install
npm run dev
```

`git rm -r --cached node_modules` saca del repo los 5.340 archivos de `node_modules` que estaban subidos por error (no borra nada de tu disco). Hazlo una sola vez.

Luego, en Supabase → SQL Editor, ejecuta **`supabase/migrations/2026-10-02_v0.15_mapa.sql`**.
Si no la ejecutas, la app sigue publicando, pero sin el pin exacto (te avisa en pantalla).

Commit sugerido:
```
git add .
git commit -m "v0.15 rediseño liquid glass + mapa interactivo Perú"
git push
```

---

## 1. Sistema visual Liquid Glass

- **Nuevo archivo `src/styles/liquid-glass.css`** con todos los tokens de color (claro/oscuro) y las superficies de vidrio.
- **Regla de diseño:** el vidrio real (desenfoque + brillo especular) va solo en la capa de navegación: headers, tab bar, sheets y controles del mapa. Las tarjetas de contenido son translúcidas **sin** desenfoque; el fondo ambiental ya viene difuminado, así que se ven esmeriladas sin costo de GPU. Es la misma regla de Apple en iOS 26 y protege el rendimiento en Androids de gama de entrada.
- **Fondo ambiental** con manchas de luz azul/naranja/violeta que se mueven lentamente.
- **Headers:** los 13 headers azules ahora son vidrio azul, pegajosos al hacer scroll (el contenido pasa por detrás desenfocado), con esquinas inferiores redondeadas.
- **Tab bar flotante** tipo cápsula, con una "lente" que se desliza bajo la pestaña activa y botón central naranja de vidrio para Publicar.
- **Modales → sheets de vidrio:** los 7 modales (reportar, compartir, filtros, especialidades, zonas, foto, etc.) ahora suben con animación desde abajo **dentro** del teléfono. Antes usaban `position: fixed`, se salían del marco y quedaban debajo de la tab bar.
- **Botones** con relieve de vidrio (brillo superior, sombra interior), altura mínima 48 px (accesible para adultos mayores).
- **Tipografía única: Inter** (antes se descargaban Inter y Nunito). Números de precios con cifras tabulares.
- **Accesibilidad:** foco visible con teclado, `aria-label` en botones de solo ícono, `aria-pressed` en chips, respeto de `prefers-reduced-motion` y `prefers-reduced-transparency` (superficies sólidas), y respaldo para navegadores sin `backdrop-filter`.
- **Inputs a 16 px** (antes 14 px): evita el zoom automático de Safari iOS al tocar un campo.

## 2. Pantallas rediseñadas

- **Inicio**
  - Saludo según la hora de Lima (antes decía siempre "Buenos días").
  - Buscador tipo píldora + botón naranja de mapa.
  - Tarjeta "Explora el mapa de cachuelos" con conteo de cercanos y presenciales.
  - Categorías como tarjetas de vidrio; chips de filtro de vidrio.
  - **El filtro "Cerca" ahora funciona**: pide la ubicación solo al tocarlo, muestra cachuelos a ≤ 8 km ordenados por distancia, y maneja permiso denegado con mensaje claro.
- **Tarjeta de cachuelo:** nuevo diseño, muestra el tipo de pago, el departamento si es fuera de Lima y la distancia cuando hay ubicación.
- **Login:** logo real de Cachuelo en lugar del emoji 💼.
- **Perfil:** el contenido de pestañas deja ver el fondo (antes un bloque sólido en modo oscuro).
- **Chat:** burbujas propias con degradado azul; deja espacio para la tab bar flotante.

## 3. Mapa interactivo del Perú (nuevo)

Archivos: `src/features/map/` (`MapScreen.jsx`, `LocationFields.jsx`, `mapConfig.js`, `useGeolocation.js`) y `src/data/geo.js`.

- **Pestaña "Mapa"** en la tab bar (reemplaza "Buscar"; la búsqueda se abre desde el buscador del Inicio y desde "Filtros" en el mapa).
- **Mapa limitado al Perú** (no deja alejarse del país; zoom mínimo 5).
- **Pines tipo alerta:** cada cachuelo es una burbuja con ícono de categoría + precio. Los **destacados laten** con un pulso naranja y llevan estrella. Esto le da valor visible al pago extra por destacado (Acta N°2, punto 12).
- **Agrupación (clusters):** al alejar, los pines se juntan en burbujas azules con el número; al tocarlas se acerca.
- **Al tocar un pin**, sube una tarjeta de vidrio con todo el detalle: categoría, título, precio y tipo de pago, lugar y distancia, duración, fecha de inicio, descripción, publicador (verificado, estrellas) y los botones **"Ver detalle y postular"**, **Cómo llegar** (abre Google Maps, gratis) y **Compartir**.
- **Filtros sobre el mapa:** búsqueda por texto, "Destacados" y las 12 categorías.
- **"Cerca de mí"**: centra en tu ubicación y muestra tu punto azul.
- **"Ver todos"**: encuadra todos los resultados.
- **Lista "En esta zona"**: cachuelos visibles en pantalla, ordenados por cercanía.
- **Memoria de vista:** al volver del detalle, el mapa queda donde estaba (filtros y pin incluidos). Usa `reuseMaps`, así que no se cobra una carga nueva cada vez.
- **Cachuelos antiguos sin coordenadas** aparecen en el centro aproximado de su distrito (con un pequeño desplazamiento para que no se encimen) y la tarjeta avisa "ubicación aproximada".
- **Remotos** no se pintan en el mapa; se indica cuántos hay.
- **Sin API key, o si Google falla** (key inválida, restringida, sin internet): la pestaña muestra **"Explorar por zona"** (lista agrupada por distrito/departamento). La app nunca se rompe.

## 4. Publicar y Editar con ubicación

- Antes solo había 43 distritos de Lima. Ahora: **Departamento (25) → Distrito (Lima Metropolitana) o Ciudad (provincias)**.
- **Selector en mapa:** el pin queda fijo al centro y el usuario mueve el mapa debajo (patrón Uber/Rappi, más fácil en táctil). Incluye botón "Mi ubicación".
- **Privacidad:** se guarda una zona aproximada (≈ 110 m), nunca la puerta exacta. El texto lo explica al usuario. El redondeo se hace en el frontend **y** en la base de datos (trigger).
- **Remoto:** oculta la ubicación y explica que no sale en el mapa.
- **Validaciones:** precio mayor que 0; ubicación obligatoria solo si es presencial.
- Si la migración no se ha corrido, publica igual sin coordenadas y lo avisa (`src/data/cachuelosApi.js`).
- Después de publicar un presencial, el botón lleva a **"Ver en el mapa"**.

## 5. Bugs corregidos

| # | Bug (existía en v0.14) | Arreglo |
|---|---|---|
| 1 | Al tocar una notificación de postulación **vista/aceptada/rechazada** la app lanzaba error (`normalizeCachuelos is not defined`) | Función movida a `src/data/normalize.js` y compartida |
| 2 | **Editar un cachuelo reseteaba el tipo de pago a "Fijo"** (el feed no traía `payType`) | `payType` agregado a la normalización |
| 3 | Filtro **"Cerca"** del Inicio no hacía nada | Implementado con geolocalización |
| 4 | Saludo fijo "Buenos días" | Según hora de Lima |
| 5 | Modales se salían del teléfono / quedaban bajo la tab bar | Sheets dentro del teléfono, `z-index` correcto |
| 6 | Fondos blancos fijos en modo oscuro (reportar, compartir, publicar, chat, notificaciones, mensajes de error/éxito) | Reemplazados por tokens del tema |
| 7 | Zoom de iOS al tocar inputs | Inputs a 16 px |
| 8 | Elegir "Cerca"/"Remoto" borraba la categoría elegida | Ahora se combinan |
| 9 | Al abrir un detalle desde el mapa, la tab bar marcaba "Inicio" | Marca la pestaña de origen |

## 6. En un celular real

- En pantallas ≤ 520 px la app ocupa **toda la pantalla** (sin el marco del iPhone). Sirve para que Miki y Mauricio la prueben en sus celulares durante la marcha blanca.
- Se agregaron `theme-color`, `viewport-fit=cover` y metas de app web para iPhone.
- **Ojo:** la geolocalización y el mapa necesitan **https** (o `localhost`). Si abres desde el celular con la IP de tu PC (`http://192.168.x.x:5173`), el navegador bloquea la ubicación. Para probar en celulares, publica en Netlify (gratis, con https).

## 7. Estructura nueva del código

```
src/
├─ App.jsx                      pantallas (4.804 → 4.577 líneas; lo genérico salió a módulos)
├─ styles/liquid-glass.css      sistema visual
├─ ui/theme.js                  colores claro/oscuro + contexto
├─ ui/primitives.jsx            Btn, Input, Badge, Avatar, Stars, CategoryIcon, TabBar, Screen
├─ data/categories.js           12 categorías
├─ data/places.js               departamentos, ciudades, distritos
├─ data/geo.js                  coordenadas aprox., distancia, privacidad
├─ data/normalize.js            fila Supabase → objeto de pantalla
├─ data/cachuelosApi.js         insertar/editar con tolerancia a migración
└─ features/map/                MapScreen, LocationFields, mapConfig, useGeolocation
supabase/migrations/2026-10-02_v0.15_mapa.sql
.env.example
```

Dependencias nuevas: `@vis.gl/react-google-maps@1.10.1` (librería React respaldada por Google) y `@googlemaps/markerclusterer@2.6.2`.

## 8. Base de datos (migración v0.15)

Tabla `cachuelos`:
- Columnas nuevas: `departamento`, `ciudad`, `lat`, `lng`.
- Regla: las coordenadas deben estar dentro del Perú (o vacías).
- Trigger que **redondea lat/lng a 3 decimales** en el servidor.
- Índice `(lat, lng)` para cachuelos activos.
- Los presenciales antiguos quedan marcados como `departamento = 'Lima'`.

## 9. Activar el mapa (Google Maps)

1. Ve a Google Cloud Console y crea un proyecto "Cachuelo".
2. **Opción prototipo (sin tarjeta):** usa la *Maps Demo Key* de Google Maps Platform. Es gratis, sin facturación, con límite diario.
3. **Opción producción:** activa facturación y la **Maps JavaScript API**, y crea una API key.
4. **Restringe la key** (obligatorio: queda visible en el navegador):
   - Restricción de aplicación: *Sitios web* → `http://localhost:5173/*` y tu dominio de Netlify.
   - Restricción de API: solo *Maps JavaScript API*.
5. Para producción, crea un **Map ID** (Map Management). Para pruebas sirve `DEMO_MAP_ID`, que ya es el valor por defecto.
6. Copia `.env.example` a `.env`, completa `VITE_GOOGLE_MAPS_API_KEY` (y `VITE_GOOGLE_MAPS_MAP_ID`) y reinicia `npm run dev`.
7. En Billing, crea una **alerta de presupuesto** (ej. US$5) y una cuota diaria.

**Costos (verificados en octubre 2026):**
- Desde marzo 2025, Google da topes gratis por producto en lugar de los US$200 de crédito.
- *Dynamic Maps* (el mapa web): **10.000 cargas gratis al mes**; luego ~US$7 por cada 1.000.
- Cada vez que se crea un mapa cuenta como carga; con `reuseMaps` no se cobra de nuevo al ir y volver dentro de la app.
- Cuando migren a app nativa (Expo/React Native), el **Maps SDK de Android/iOS es gratis e ilimitado**.
- "Cómo llegar" abre la app de Google Maps por enlace: no consume la API.

## 10. Seguridad: pendientes que encontré (no cambiados en v0.15)

1. **Credenciales de admin en el frontend** (`cachuelo@mvp.com` / `cachuelomvp` en `App.jsx`). Cualquiera las ve en el JS publicado. Recomendado: columna `profiles.rol = 'admin'` + políticas RLS, y quitar la contraseña del código.
2. **"Continuar con Google" es simulado:** crea un usuario sin `id`, así que fallan postular y publicar. Hay que configurar el proveedor Google en Supabase Auth (`signInWithOAuth`) o esconder el botón hasta entonces.
3. **RLS** (pendiente #18 de `referencias/PENDIENTES.txt`): revisar antes de abrir a usuarios reales, sobre todo `mensajes`, `reportes` y los datos personales de `profiles` (teléfono, fecha de nacimiento).

## 11. Checklist de prueba

- [ ] `npm install` y `npm run dev` sin errores.
- [ ] Migración SQL corrida; la consulta de verificación muestra las 4 columnas.
- [ ] Inicio claro/oscuro: header de vidrio, saludo correcto, "Cerca" pide ubicación.
- [ ] Mapa **sin** key: "Explorar por zona" con los cachuelos agrupados.
- [ ] Mapa **con** key: pines, clusters, tarjeta al tocar, "Ver detalle y postular", "Cerca de mí", lista.
- [ ] Publicar presencial en Lima y en provincia (ej. Cusco); el pin aparece en el mapa.
- [ ] Publicar remoto: no pide ubicación; aparece con filtro "Remoto".
- [ ] Editar un cachuelo: conserva el tipo de pago y permite mover el pin.
- [ ] Notificación de "postulación aceptada" abre el detalle sin error.
- [ ] En celular (por Netlify): pantalla completa, sin zoom al escribir.

## 12. Decisiones tomadas a criterio (fáciles de revertir)

- **"Buscar" salió de la tab bar** y entró "Mapa". Para volver: `TABS` en `src/ui/primitives.jsx`.
- **Inter** como fuente única (Nunito se quitó).
- **Publicar en todo el Perú** (antes solo Lima).
- **Radio de "Cerca" = 8 km** (`NEAR_KM` en `HomeScreen`).
- **Privacidad ≈ 110 m** (redondeo a 3 decimales).

## 13. Lo que no se pudo probar aquí

- Se probó en navegador headless: claro/oscuro, escritorio y celular, sin key y con key inválida. Sin errores de ejecución.
- **No se pudo probar el mapa de Google renderizado con una key real** (el entorno de pruebas no tiene acceso a Google). Es lo primero a verificar al configurar la key.

## 14. Sugerencias para v0.16 (disciplina de MVP)

- Cargar el mapa solo cuando se abre la pestaña (*code splitting*) para que la app inicie más rápido. El bundle actual pesa ~530 KB.
- Consultar a Supabase solo los cachuelos dentro de la zona visible del mapa (con el índice nuevo), cuando haya cientos de publicaciones.
- Modo "Urgente" (pendiente #25) como pin rojo en el mapa.
