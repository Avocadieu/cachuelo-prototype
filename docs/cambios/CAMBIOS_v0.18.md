# Cachuelo v0.18: doble rol, catálogo ampliado y simulador

**Fecha:** 9 de octubre de 2026
**Base:** v0.17.1 (verificación, ofertas y zonas)
**Para:** Roger, Sergio Cotillo (tecnología), Miki (operaciones) y Mauricio (crecimiento)

---

## Resumen en 1 minuto

1. **Una sola cuenta sirve para todo.** La misma persona puede **publicar** cachuelos (rol contratante) y **postular** a otros (rol trabajador). Su perfil muestra las dos facetas por separado, cada una con su calificación, su historial y sus reseñas.
2. **El catálogo pasó de 12 a 62 categorías**, ordenadas en 12 grupos (Hogar, Oficios, Transporte, etc.). El usuario **escribe el servicio con sus propias palabras** ("se me atoró el lavadero") y la app lo **cataloga sola** (Gasfitería). Así se puede filtrar bien sin obligar a nadie a adivinar la categoría.
3. **Perfiles completos**, inspirados en Airtasker:
   - Un **portafolio de fotos** con la descripción de cada servicio realizado o contratado.
   - **Reseñas en los dos sentidos**: el contratante califica al trabajador y el trabajador califica al contratante.
   - La tasa de trabajos completados y cuántas veces lo volvieron a contratar.
4. **Simulador.** Puedes "entrar como" 16 personas ficticias (contratantes, trabajadores o ambas cosas) y recorrer el flujo completo:
   - ofertas, aceptar, pagar (Pago Protegido) y confirmar;
   - liberar el pago y calificar;
   - subir fotos al portafolio y ver la billetera.
5. **Corregimos un hueco de seguridad.** Antes cualquier usuario podía ponerse calificación 5 desde el navegador. Ahora los promedios los calcula solo el servidor.
6. **El repositorio quedó ordenado para GitHub:**
   - `README.md` nuevo (qué es, cómo instalar, variables, estructura, despliegue);
   - `CHANGELOG.md` con todas las versiones;
   - carpeta `docs/` con los reportes;
   - plantilla de Pull Request con checklist.

---

## Cómo probarlo (3 formas)

| Dónde | Para quién | Cómo |
|---|---|---|
| **Netlify** | Todo el equipo, desde el celular o la PC | Abrir la URL del sitio → Saltar → Continuar con Google → Hacerlo después → **Simulador de Cachuelo** |
| **Vista en Claude** | Quien tenga acceso al enlace compartido | Igual que arriba (sin mapa de Google; muestra "Explorar por zona") |
| **localhost** | Desarrollo (Roger, Sergio) | `npm install` → `npm run dev` → http://localhost:5173 |

**Ruta recomendada para revisar en 10 minutos**
1. **Inicio:** toca los grupos (Hogar, Oficios…), cambia "Ordenar por" y prueba el filtro "Sin ofertas".
2. **Simulador → "Contratar a alguien y pagar":** acepta una oferta, paga con la tarjeta de prueba `4111 1111 1111 1111` (vencimiento `12/29`, CVV `123`), confirma y califica.
3. **Simulador → "Hacer un cachuelo y cobrar":** sigue los botones morados hasta ver el dinero en **Cobros**.
4. **Simulador → "Perfil de doble rol":** cambia entre "Como trabajador" y "Como contratante".
5. **Publicar:** escribe "se me malogró la terma" y mira cómo se cataloga solo.

---

## 1. Lo que analizamos de Airtasker (revisión del sitio en vivo)

Revisamos airtasker.com/tasks en vivo: el listado, el detalle de una tarea, las ofertas y el perfil de un trabajador. Esto es lo que encontramos y lo que hicimos con cada cosa:

| Lo que tiene Airtasker | ¿Lo adoptamos? | Cómo quedó en Cachuelo |
|---|---|---|
| ~106 categorías, con buscador y selección múltiple | ✅ Adaptado | 62 categorías pensadas para Perú, en 12 grupos y con buscador. Quitamos las que aquí no aplican (Homestays, Stunt, Mining…) y agregamos las nuestras (Mandados y colas, Recojo de desmonte, Ventas e impulsación, Contabilidad/SUNAT). |
| Orden: recomendados, más recientes, más cerca, menor/mayor precio | ✅ | Selector "Ordenar por" en el Inicio. |
| Filtro "Tareas sin ofertas" | ✅ | Filtro **"Sin ofertas"**: el trabajador encuentra donde aún no hay competencia. |
| Tarjeta con número de ofertas y antigüedad | ✅ | Cada tarjeta muestra **"N ofertas"** (o "Sé el primero") y "hace 3 h". |
| Estados Abierto → Asignado → Completado | ✅ Ampliado | 5 pasos visibles: **Publicado → Asignado → Trabajo hecho → Pagado → Calificado**. |
| Oferta con calificación, % completado y "Recontratado X veces" | ✅ | Igual en cada oferta que recibes. |
| Perfil: portafolio de fotos, "Sobre mí", calificación, % completado, nº de tareas, "ID verificado", reseñas con el nombre de la tarea | ✅ | Todo eso, y además **separado por rol** (Airtasker solo muestra la faceta de trabajador). |
| "Request a quote" (pedir cotización directa) | ⏳ Pendiente | Lo evaluamos para v0.19 ("Invitar a mi cachuelo"). |
| Comisión de 25–40 % al trabajador | ❌ | Se mantiene lo que acordamos: el trabajador recibe el 100 % y el contratante paga el 10 % de Pago Protegido o S/ 5 de conexión. |
| Preguntas públicas en cada tarea | ⏳ Pendiente | Útil, pero exige moderación. Queda para después. |

---

## 2. Doble rol: publicar y postular con la misma cuenta

- **Inicio:** el saludo ahora dice *"Publica lo que necesitas o postula a un cachuelo"*.
- **Mis cachuelos** (nueva versión) tiene tres pestañas:
  - **Publiqué**: lo que publicaste como contratante, con las ofertas recibidas y su avance.
  - **Postulé**: tus ofertas como trabajador y en qué va cada una.
  - **Historial**: todo lo que completaste en ambos roles, con la calificación que recibiste.
- **Perfil:** dos tarjetas arriba, **"Como trabajador"** y **"Como contratante"**. Al tocar una, todo el perfil cambia a esa faceta: portafolio, historial y reseñas.
- **Regla de reputación:** la nota como trabajador y la nota como contratante **no se mezclan**. Un buen gasfitero puede ser un mal pagador, y viceversa. Cada quien ve la nota que le interesa.

---

## 3. Catálogo ampliado y servicio "a tu manera"

### 3.1 Las 62 categorías

| Grupo | Categorías |
|---|---|
| **Hogar y limpieza** | Limpieza · Lavado y planchado · Ayuda doméstica · Fumigación y plagas · Limpieza de tanques y cisternas |
| **Reparaciones y oficios** | Reparaciones · Gasfitería · Electricidad · Pintura · Carpintería y melamina · Armado de muebles · Cerrajería · Albañilería y construcción · Soldadura · Reparación de electrodomésticos · Vidriería |
| **Mudanza y transporte** | Mudanza · Delivery · Fletes y carga · Embalaje · Chofer · Mandados y colas |
| **Vehículos** | Mecánica · Lavado de autos · Reparación de bicicletas |
| **Jardín y exteriores** | Jardinería · Poda de árboles · Recojo de desmonte |
| **Tecnología** | Tecnología · Desarrollo web y apps · Reparación de celulares · Redes sociales · Digitación y data entry |
| **Diseño, foto y textos** | Diseño · Fotografía · Redacción · Video y edición · Traducción · Estampado y sublimación · Manualidades y arte |
| **Clases y tutorías** | Tutorías · Clases de idiomas · Clases de música · Entrenador personal y deporte |
| **Eventos y gastronomía** | Eventos · Cocina · Mozos y personal para eventos · DJ y animación · Decoración de eventos · Repostería · Bartender |
| **Cuidado y bienestar** | Cuidado de niños · Cuidado de adultos mayores · Mascotas · Belleza y peluquería · Costura y arreglos de ropa |
| **Negocios y oficina** | Asistencia administrativa · Ventas e impulsación · Volanteo y publicidad · Encuestas y cliente incógnito · Contabilidad y trámites tributarios |
| **Otros** | Otros (para lo que no encaje; el texto libre igual se puede buscar) |

> Los 12 originales conservan su número (id 1 a 12). Así no se rompe ningún cachuelo ya guardado.

### 3.2 Cómo funciona la catalogación automática

Al publicar, aparece un campo nuevo: **"¿Qué servicio necesitas? (escríbelo a tu manera)"**.

- Mientras el usuario escribe, la app propone la categoría y la marca como **"Catalogado automáticamente"**. Con un toque en **"Cambiar"** puede elegir otra.
- Si no hay ninguna pista, muestra las 8 categorías más pedidas y el botón **"Ver todas las categorías (62)"**, con buscador.
- El texto libre se guarda (campo `servicio`) y **también se busca**. Por ejemplo, buscar "sunarp" encuentra "Hacer cola en SUNARP".

Resultados reales de la prueba (15 frases, **15 acertadas** en la primera sugerencia):

| Lo que escribió el usuario | Categoría sugerida |
|---|---|
| "Se me atoró el lavadero de la cocina" | Gasfitería |
| "necesito alguien que pasee a mi perro" | Mascotas |
| "hacer cola en el banco por mí" | Mandados y colas |
| "me quedé afuera de mi casa, abrir chapa" | Cerrajería |
| "reparar pantalla de iphone" | Reparación de celulares |
| "torta para cumpleaños de 30 personas" | Repostería |
| "mozos para matrimonio" | Mozos y personal para eventos |
| "cambiar resistencia de terma, sale agua fría" | Gasfitería |

### 3.3 Filtros en el Inicio y en Buscar

- **Fila de grupos** con íconos: Todas, Hogar, Oficios, Transporte… Al tocar un grupo aparecen sus categorías, con el número de cachuelos de cada una.
- **"Ver todas (62)"** abre la hoja completa, con buscador. Se puede filtrar por grupo entero o por una categoría.
- **Ordenar por:** Recomendados, Más recientes, Más cerca, Menor precio, Mayor precio.
- **Filtros rápidos:** Todos, Destacados, Remoto, Cerca y **Sin ofertas**. Este último solo funciona en el demo por ahora, porque en vivo falta conectar el conteo de ofertas.
- **Buscar** entiende el título, el servicio escrito, la categoría, el grupo y la descripción, y no le importan las tildes.

### 3.4 Requisitos y seguridad por categoría

- **Requisitos sugeridos para 26 de las 50 categorías nuevas** (las demás usan los genéricos: licencia o permiso, certificado de capacitación), por ejemplo:
  - Electricidad: constancia técnica y EPP.
  - Chofer: brevete según el vehículo.
  - Repostería: carné de sanidad.
  - Cuidado de adultos mayores: técnico(a) en enfermería.
- Los **77 requisitos sugeridos** pasan por el filtro anti-discriminación (Ley 26772) **sin falsos positivos**.
- **Aviso de seguridad** en 14 categorías de riesgo nuevas: Electricidad, Gasfitería, Albañilería, Soldadura, Pintura, Poda, Fletes, Chofer, Mecánica, Fumigación, Tanques, Cuidado de niños, Cuidado de adultos mayores y Desmonte.

---

## 4. Perfiles, portafolio y calificaciones

### 4.1 Qué se ve en un perfil

**Cabecera**
- Foto, nombre, distrito, tiempo de respuesta y "Desde marzo de 2026".
- Insignias: **✓ DNI + CUL**, 🛠️ Trabajador, 📢 Contratante.

**Dos tarjetas de estadísticas**
- *Como trabajador:* ★ promedio (nº de reseñas), cachuelos hechos y % completados.
- *Como contratante:* ★ promedio, cuántos publicó y cuántos contrató.

**Avisos de confianza**
- "Recontratado 2 veces por los mismos clientes".
- "Paga con Pago Protegido · 8 trabajos pagados sin reclamos".

**Secciones**
- **Sobre mí** y **Habilidades** (categorías que hace; hasta 8).
- **Cachuelos abiertos ahora** (solo en la faceta contratante; se puede entrar a cada uno).
- **Portafolio**: fotos de lo que realizó o de lo que contrató.
- **Historial**: cada trabajo con la otra persona (se puede tocar para ver su perfil) y la nota que recibió.
- **Reseñas del rol**: gráfico de 1 a 5 estrellas, comentarios, etiquetas ("Puntual", "Pago rápido") y el nombre del cachuelo.

Se puede **saltar de perfil en perfil** (de Ana a Diego, de Diego a Brayan…). El botón Volver regresa en orden.

### 4.2 Portafolio con fotos

- **Agregar experiencia** (desde tu perfil, o automáticamente al terminar un cachuelo):
  1. Eliges **de qué cachuelo es** (uno que completaste, como trabajador o como contratante) o marcas **"Experiencia externa"**.
  2. Subes **hasta 6 fotos**. Se reducen solas para no gastar datos.
  3. **Describes el servicio** (mínimo 20 caracteres).
- **"Cachuelo verificado"**: la experiencia está ligada a un cachuelo completado en la app. La externa sale como **"no verificada"**. Así nadie se inventa trabajos.
- **Visor**: galería deslizable, descripción, datos del cachuelo y la **reseña que dejó la otra persona** por ese trabajo.
- **Aviso de privacidad (Ley 29733)**: no subir rostros de terceros sin permiso, ni direcciones, placas o documentos.

### 4.3 Calificaciones en ambos sentidos

- Al confirmar un trabajo, el contratante califica al trabajador: estrellas, etiquetas y un comentario opcional.
- El trabajador también califica al contratante.
- Solo se califica **tras un cachuelo completado**, **una vez por persona y cachuelo**. Las reseñas publicadas **no se editan**.

---

## 5. Simulador

Desde **Inicio → "Simulador de Cachuelo"** o **Perfil → ⚙️ → "Simulador (demo)"**.

### 5.1 Personas de prueba (todas verificadas)

| Tipo | Personas |
|---|---|
| **Contratantes** | Ana García (Miraflores), Carlos Ríos (oficina en San Isidro), Patricia Mendoza (Surco), StartupPE, Sabores del Perú, TiendaLima, Lucía Paredes (Arequipa), Eventos Moche (Trujillo) |
| **Trabajadores** | Luis Quispe (gasfitero/electricista), Milagros Pérez (limpieza y mascotas), Jorge Mendoza (fletes, tiene camión), Kelly Rojas, Brayan Chávez, Sofía Vargas (profesora) |
| **Hacen ambas cosas** | Rosa Huamán (repostera que también contrata), Diego Torres (diseñador que contrata armado de muebles) |

El mundo de prueba incluye:
- 18 cachuelos abiertos;
- 26 trabajos en el historial (uno cancelado, para que el % completado sea realista);
- 50 reseñas en ambos sentidos;
- 15 ofertas pendientes;
- 11 experiencias de portafolio.

### 5.2 Escenarios guiados

1. **Contratar a alguien y pagar** (entras como Ana): ves las 2 ofertas de su limpieza, revisas el perfil de Milagros, la aceptas, pagas con Pago Protegido, simulas que terminó, confirmas y liberas el pago, la calificas y subes fotos.
2. **Hacer un cachuelo y cobrar** (entras como Luis): en "Postulé" simulas que Patricia acepta (el pago queda retenido para ti), marcas "trabajo terminado", simulas la confirmación, cobras el 100 %, calificas a Patricia y lo ves en **Cobros**.
3. **Perfil de doble rol**: el perfil de Rosa, cambiando entre trabajador y contratante.
4. **Publicar y recibir ofertas** (con tu cuenta): escribes el servicio a tu manera, publicas gratis y en "Mis cachuelos" tocas **"Simular ofertas de trabajadores"**. Llegan 2 o 3 ofertas de quienes tienen esa habilidad, con su perfil.
5. **Subir fotos a tu portafolio.**
6. **Pagos y cobros** (billetera).

**Otras herramientas**
- **Botones morados "Simular: …"**: hacen lo que haría la otra persona.
- **"Aprobar mi verificación (demo)"**: tu cuenta demo puede publicar o postular sin esperar la revisión. En producción la revisa el equipo.
- **"Reiniciar simulación"**: borra en este navegador lo que hiciste. Tu verificación se mantiene.

> Todo lo del simulador vive **solo en tu navegador**: no hay dinero ni datos reales. Si se prueba en otra computadora, empieza de cero.

---

## 6. Seguridad y normativa

| Tema | Qué hicimos |
|---|---|
| 🔴 **Hueco encontrado:** cualquiera podía cambiar su propio `rating` y `cachuelos_completados` | Ahora están **protegidos** por el servidor. Solo los recalcula un trigger cuando entra una reseña válida. La app ya no calcula promedios. |
| Reseñas falsas | Solo entre las dos partes de un cachuelo **completado**, una por persona, sin edición. El servidor decide autor, destinatario y rol: no se confía en lo que manda la app. |
| Portafolio falso | "Verificado" solo si el cachuelo está completado **y** tuviste ese rol en él. Las fotos solo se pueden subir a tu propia carpeta. |
| Datos personales (Ley 29733) | Aviso al subir fotos. Las fotos de ejemplo del simulador son ilustraciones, no fotos de personas reales. |
| Discriminación (Ley 26772) | Los requisitos nuevos pasan el filtro sin falsos positivos. |
| Si falta el `.env` al compilar | Antes la app quedaba en blanco ("supabaseUrl is required"). Ahora entra sola en modo demo. |
| Repositorio | Revisamos que no haya llaves ni contraseñas reales en los archivos que se suben: `.env` sigue excluido y las llaves de ejemplo son ficticias. |

> ⚠️ **Pendiente heredado (no es de esta versión):** el acceso de administrador del prototipo usa un correo y una contraseña escritos dentro del código (`src/App.jsx`, pantalla de login). Si el repositorio de GitHub es **público**, cualquiera puede verlos. Recomendación: dejar el repositorio en **privado** hasta reemplazarlo por el rol `admin` de Supabase (ya existe desde v0.17).

---

## 7. Base de datos: migración v0.18

**Archivo:** `supabase/migrations/2026-10-10_v0.18_catalogo_perfiles.sql`. Se corre **después** de v0.15, v0.16 y v0.17, en Supabase → SQL Editor → Run. Se puede correr dos veces sin problema.

| Bloque | Qué hace |
|---|---|
| 1. Catálogo | Carga las 62 categorías con su grupo (ids fijos), ajusta el contador y deja el catálogo en solo lectura (lo editan los admins). |
| 2. Cachuelos | Nueva columna `servicio` (máx. 80 caracteres) y búsqueda en español (`busqueda`: "lavaderos" encuentra "lavadero"). |
| 3. Perfiles | Columnas `rating_contratante`, `resenas_trabajador`, `resenas_contratante`, `cachuelos_contratados` (y `bio`, `especialidades`, `zonas`, `disponible`, `avatar_url` si faltaban). Además, la protección de la reputación. |
| 4. Reseñas | Tabla `resenas` en ambos sentidos (`autor_id`, `destinatario_id`, `rol_destinatario`, `tags`). Validación en el servidor y recálculo automático de promedios. Las reseñas antiguas se marcan como "al trabajador". |
| 5. Portafolio | Tabla `portafolio` + bucket público `portafolio` (cada usuario sube solo en su carpeta) + validación de "verificado". |
| 6. Vista | `perfil_publico`: reputación por rol, sin correo ni teléfono. |

**Pruebas en una base de datos de prueba** (que imita Supabase):
- **22/22 pruebas nuevas pasan**: reputación protegida; no calificar sin completar; no duplicar; terceros bloqueados; rol falso en el portafolio bloqueado; fotos ajenas bloqueadas; etc.
- Las **11 pruebas de v0.17 siguen pasando**.

---

## 8. Pruebas de la app

| Prueba | Resultado |
|---|---|
| Recorrido automático completo en el navegador: filtros, hoja de categorías, orden, búsqueda, perfiles, contratar + pagar + calificar + portafolio, cobrar como trabajador, publicar con catalogación automática, ofertas simuladas, reinicio | **27/27 ✅**, sin errores en consola |
| Catalogación automática (15 frases reales) | **15/15 ✅** |
| Requisitos sugeridos vs filtro anti-discriminación | 77 revisados, **0 falsos positivos** |
| Compilación (`npm run build`) | ✅ sin errores |
| Revisión de código (lint) | 0 errores |
| Modo oscuro | Revisado en perfil y hojas ✅ |

---

## 9. Archivos

**Nuevos**
- `src/features/catalog/CategoryPicker.jsx`: selector y hoja de categorías, con catalogación automática.
- `src/features/profiles/UserProfileScreen.jsx`: perfil de doble rol.
- `src/features/profiles/Portfolio.jsx`: grilla, visor y formulario del portafolio.
- `src/features/profiles/RatingSheet.jsx`: calificar a la otra parte.
- `src/features/demo/demoWorld.js`: el mundo simulado (personas, cachuelos, historial, reseñas, ofertas, portafolio).
- `src/features/demo/DemoMyCachuelos.jsx`: Mis cachuelos con Publiqué / Postulé / Historial.
- `src/features/demo/SimulatorScreen.jsx`: Simulador y "Entrar como…".
- `src/features/demo/art.js`: ilustraciones de ejemplo (en lugar de fotos reales).
- `src/ui/Sheet.jsx`: hoja inferior reutilizable.
- `supabase/migrations/2026-10-10_v0.18_catalogo_perfiles.sql`

**Modificados**
- `src/App.jsx`: Inicio (grupos, orden, Sin ofertas, banner del simulador), tarjeta, detalle, publicar/editar (servicio + selector), buscar, configuración y rutas nuevas. Además, el chat ya no calcula el rating en el navegador.
- `src/data/categories.js`: 62 categorías, grupos y funciones de sugerencia y búsqueda.
- `src/data/cachuelosApi.js`, `src/data/normalize.js`: campo `servicio`.
- `src/features/compliance/requirements.js`: requisitos y categorías de riesgo nuevas.
- `src/features/verification/verificationStore.js`: verificación instantánea solo para el demo.
- `src/features/payments/PaymentSheet.jsx`: texto del botón final configurable.
- `src/lib/supabase.js`: no se rompe si falta el `.env`.
- `CLAUDE.md`: reglas nuevas y equipo actualizado.
- `package.json`: versión `0.18.0` y Node 18 o superior.

**Orden del repositorio (para GitHub)**
- `README.md` (nuevo): presentación del proyecto, instalación en Windows (CMD y Git Bash), variables de entorno, estructura, migraciones, despliegue y forma de trabajo.
- `CHANGELOG.md` (nuevo): resumen de v0.15 a v0.18 con enlaces al detalle.
- `.github/pull_request_template.md` (nuevo): checklist que aparece sola al abrir un Pull Request (build, sin `.env`, migraciones, celular y modo oscuro).
- **Movidos a `docs/`:**
  - `CAMBIOS_v0.15.md` a `CAMBIOS_v0.18.md` → `docs/cambios/`
  - `INFORME_v0.16.1_…` y `MINUTA_2026-10-05_…` → `docs/informes/`
  - Se actualizaron las referencias a esos archivos dentro del código.

---

## 10. Subir a GitHub y a Netlify (paso a paso)

Se usa el zip **`CACHUELO_v0.18_github.zip`**: es la misma v0.18, ya ordenada para el repositorio.

### Parte A · Preparar la carpeta

**A1. Descomprimir.** Clic derecho en el zip → "Extraer todo…" → destino `F:\CACHUELO_versiones`. Queda `F:\CACHUELO_versiones\CACHUELO_v0.18_github`. Comprueba en CMD:
```
dir F:\CACHUELO_versiones\CACHUELO_v0.18_github
```
Debes ver `README.md`, `CHANGELOG.md`, `docs`, `src`, `supabase` y `package.json`.

**A2. Partir de `main` actualizado y crear la rama.** En CMD:
```
cd /d F:\CACHUELO
git checkout main
git pull
git checkout -b v0.18
```
Si `git checkout main` reclama por cambios sin guardar (por ejemplo, la v0.18 que copiaste antes para Netlify), crea la rama directamente desde donde estás: `git checkout -b v0.18`.

**A3. Copiar los archivos sin tocar tu `.env`.** CMD, en una sola línea:
```
robocopy "F:\CACHUELO_versiones\CACHUELO_v0.18_github" "F:\CACHUELO" /E /XF .env /XD node_modules dist .git
```

**A4. Borrar los reportes viejos de la raíz** (ahora viven en `docs/`). CMD, en una sola línea:
```
del CAMBIOS_v0.15.md CAMBIOS_v0.16.md CAMBIOS_v0.17.md CAMBIOS_v0.18.md INFORME_v0.16.1_Netlify_Normativa_IGV.md MINUTA_2026-10-05_Despliegue_Netlify_Maps.md
```
Si alguno no existe, CMD lo avisa y sigue: no pasa nada.

**A5. Verificar que compila.**
```
npm install
npm run build
```
Debe terminar con `✓ built in …`.

### Parte B · Subir a GitHub

**B1. Revisar qué se va a subir.**
```
git add -A
git status
```
- Deben aparecer los reportes como `renamed:` hacia `docs/` y los archivos nuevos.
- **Si aparece `.env`, detente** y avísame: no debe subirse nunca.

**B2. Guardar y subir la rama.**
```
git commit -m "v0.18: doble rol, catálogo de 62 categorías, perfiles con portafolio, simulador y repo ordenado"
git push -u origin v0.18
```

**B3. Abrir el Pull Request.**
1. Entra a github.com/Avocadieu/cachuelo-prototype. Aparecerá el aviso amarillo "v0.18 had recent pushes" → **Compare & pull request**.
2. Base: `main` ← Compare: `v0.18`.
3. La descripción ya trae la checklist. Marca lo que corresponda y pega como resumen la sección "Resumen en 1 minuto" de este reporte.
4. **Create pull request**. Sergio lo revisa → **Merge pull request** → **Confirm merge**.

**B4. Marcar la versión** (después del merge, recomendado):
```
git checkout main
git pull
git tag -a v0.18.0 -m "Cachuelo v0.18"
git push origin v0.18.0
```
Opcional: en GitHub → **Releases** → **Draft a new release** → elige `v0.18.0` → pega el resumen. Así el equipo tiene cada versión a un clic.

**B5. Los demás actualizan su copia.** Sergio (y quien tenga el repositorio), en su carpeta:
```
git checkout main
git pull
npm install
```

### Parte C · Netlify

```
npm run build
explorer dist
```
Netlify → tu sitio → **Deploys** → arrastra **solo la carpeta `dist`**. Prueba con Ctrl + F5.

> **Supabase:** no es necesario para probar en Netlify (todo corre en modo demo). Cuando conecten la base real, Sergio debe correr las migraciones **en orden**: v0.15 → v0.16 → v0.17 → v0.18 (lista exacta en `README.md`).

---

## 11. Pendientes y próximos pasos

1. **Conectar las pantallas nuevas a Supabase.** Perfil de doble rol, portafolio y Mis cachuelos con estados ya tienen sus tablas (v0.18). En modo real todavía se usan las pantallas antiguas. Estimado: 1 versión.
2. **"Invitar a mi cachuelo"** desde el perfil de un trabajador (equivalente a "Request a quote" de Airtasker).
3. **Preguntas públicas** en cada cachuelo, con moderación.
4. **Notificaciones** de "te llegó una oferta" y "te aceptaron" (hoy se simulan con botones).
5. **Franja horaria** en la publicación (mañana / mediodía / tarde), como Airtasker.
6. **Revisar el catálogo con Miki y Mauricio:** ¿falta alguna categoría típica de Lima o de provincias? Agregar una es solo una línea en `categories.js` + una fila en SQL.
7. **Login de administrador:** reemplazar el correo y la contraseña escritos en el código por el rol `admin` de Supabase. Mientras tanto, mantener el repositorio en privado.
8. **Límite del demo:** las fotos del portafolio se guardan en el navegador (~5 MB en total). Si se llena, la app avisa. En producción irán al bucket `portafolio`.

---

### Glosario rápido
- **Contratante:** quien publica y paga el cachuelo.
- **Trabajador:** quien postula y lo hace. Una misma cuenta puede ser ambos.
- **Catalogar:** asignar una categoría para poder filtrar.
- **Cachuelo verificado:** foto o reseña ligada a un trabajo completado dentro de la app.
- **Trigger:** regla automática de la base de datos que se ejecuta sola (aquí: recalcular calificaciones y validar reseñas).
- **Modo demo:** la app funciona sin servidor; los datos viven en el navegador.
