# Informe v0.16.1 — 05/10/2026
**Despliegue en Netlify · Cumplimiento normativo laboral · IGV**

> Este informe no reemplaza la opinión de un abogado laboralista ni de un contador. Ordena los temas, propone cómo reflejarlos en la app y marca qué hay que validar con ellos antes del lanzamiento.

---

# PARTE A — Probar la app (con el mapa real) en Netlify

## A.0 Qué se logra
- Una URL pública con **https**, por ejemplo `https://cachuelo-prototipo.netlify.app`. Abre en cualquier celular, con ubicación y mapa funcionando (en `http://` el navegador bloquea la ubicación).
- **Cada cambio subido a GitHub se publica solo.**
- **Cada Pull Request genera una URL de prueba aparte** (Deploy Preview). Es el "apartado aparte" para revisar antes de tocar la versión principal.

## A.1 Preparar el repositorio (una sola vez)

**CMD**
```
cd /d F:\CACHUELO
git status
git rm -r --cached node_modules
git add .
git commit -m "v0.16.1: pagos, mapa, netlify.toml"
git push origin main
```

**Git Bash**
```
cd /f/CACHUELO
git status
git rm -r --cached node_modules
git add .
git commit -m "v0.16.1: pagos, mapa, netlify.toml"
git push origin main
```

- Si `git rm -r --cached node_modules` responde *"did not match any files"*, ya estaba hecho; sigue con el resto.
- El archivo **`netlify.toml`** (incluido en el zip) le dice a Netlify cómo construir la app: `npm run build`, carpeta `dist` y Node 20.
- Antes de hacer push, confirma con `git status` que **`.env` no aparece**: nunca se sube.

## A.2 Llave de Google Maps

**Opción 1 — Maps Demo Key (rápida, sin tarjeta)**
1. Entra a la página *Maps Demo Key* de Google Maps Platform → **Get a Demo Key** → acepta los términos y copia la key.
2. Tiene un límite diario; si se pasa, se pausa hasta el día siguiente y no cobra nada.
3. Soporta un **conjunto limitado de funciones**. Si el mapa carga pero **los pines no aparecen**, pasa a la opción 2. Los pines usan "Advanced Markers", que necesitan Map ID.

**Opción 2 — Key normal (recomendada para probar todo)**
1. Google Cloud Console → crea el proyecto **Cachuelo** → **Billing** (vincula una tarjeta; las primeras 10.000 cargas de mapa al mes son gratis).
2. **APIs & Services → Library → Maps JavaScript API → Enable**.
3. **APIs & Services → Credentials → Create credentials → API key**.
4. Edita la key → **Application restrictions: Websites** → agrega:
   - `https://cachuelo-prototipo.netlify.app/*` (tu URL final; ver A.3 paso 6)
   - `http://localhost:5173/*`
   - Cada URL de Deploy Preview que vayas a probar, por ejemplo `https://deploy-preview-3--cachuelo-prototipo.netlify.app/*`.
   - ⚠️ **No uses `https://*.netlify.app/*`**: cualquier sitio de Netlify del mundo podría usar tu key y cobrártelo.
5. **API restrictions → Restrict key → solo "Maps JavaScript API"**.
6. **Google Maps Platform → Map management → Create Map ID**, tipo **JavaScript**. Copia el Map ID.
7. **Billing → Budgets & alerts**: presupuesto de US$5 con alerta al 50 % y 90 %.

## A.3 Crear el sitio en Netlify
1. Entra a **app.netlify.com** con tu cuenta de **GitHub**.
2. **Add new site → Import an existing project → GitHub** → autoriza → elige **`cachuelo-prototype`**.
3. Branch: **`main`**. Build command y Publish directory se llenan solos desde `netlify.toml` (`npm run build` / `dist`).
4. **Antes de "Deploy"**, abre **Environment variables → Add variable** y crea:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | El mismo de tu `.env` |
| `VITE_SUPABASE_ANON_KEY` | El mismo de tu `.env` (la **anon**, nunca la service_role) |
| `VITE_GOOGLE_MAPS_API_KEY` | La key de A.2 |
| `VITE_GOOGLE_MAPS_MAP_ID` | El Map ID de A.2 (opcional con Demo Key) |
| `VITE_PAYMENTS_MODE` | `demo` |

5. **Deploy**. En 1–2 minutos tendrás una URL tipo `https://nombre-raro-123.netlify.app`.
6. **Site configuration → Change site name** → `cachuelo-prototipo`. La URL queda `https://cachuelo-prototipo.netlify.app`; usa esta en la restricción de la key (A.2 paso 4).

> ⚠️ **Importante:** las variables `VITE_` se "hornean" al construir. Si cambias una variable en Netlify, ve a **Deploys → Trigger deploy → Clear cache and deploy site**. Si no, la app sigue con el valor anterior.

## A.4 Ajustar Supabase para la URL nueva
1. **Authentication → URL Configuration**:
   - **Site URL:** `https://cachuelo-prototipo.netlify.app`
   - **Redirect URLs:** agrega esa URL y `http://localhost:5173`. Sin esto, los correos de "recuperar contraseña" llevan a una dirección equivocada.
2. **SQL Editor:** corre las migraciones `2026-10-02_v0.15_mapa.sql` y `2026-10-05_v0.16_pagos.sql`, en ese orden, si no las corriste.

## A.5 Probar en el celular (checklist)
- [ ] Abrir la URL → registrarse o iniciar sesión.
- [ ] **Mapa:** se ven los pines, los clusters se abren al tocarlos, la tarjeta muestra el detalle, "Ver detalle y postular" funciona.
- [ ] **"Cerca de mí":** el navegador pide permiso; al aceptar aparece tu punto azul.
- [ ] **Publicar un cachuelo presencial** moviendo el pin y luego verlo en el mapa.
- [ ] **Modo oscuro** (configuración del celular) y **pantalla completa** sin el marco del iPhone.
- [ ] **Agregar a pantalla de inicio:** Chrome → ⋮ → *Agregar a pantalla principal*; Safari → Compartir → *Agregar a inicio*. Se abre como una app.
- [ ] Probar con datos móviles, no solo WiFi.

**Si el mapa no carga:**

| Síntoma | Causa probable |
|---|---|
| "Explorar por zona" en vez del mapa | Falta `VITE_GOOGLE_MAPS_API_KEY` o no se redeployó |
| "El mapa no pudo cargar" | La URL no está en las restricciones de la key, o la API no está habilitada |
| Mapa sin pines | Falta Map ID, o la Demo Key no soporta Advanced Markers |
| La ubicación no funciona | Permiso denegado en el navegador, o se abrió en `http://` |

En Chrome de escritorio: **F12 → Console**; el error de Google dice exactamente qué falta.

## A.6 Flujo para cualquier mejora futura

```
1. git checkout -b feature/nombre-mejora      ← rama aparte
2. (cambios con Claude Code)
3. npm run build                              ← que no falle
4. git add . && git commit -m "feat: ..."
5. git push -u origin feature/nombre-mejora
6. GitHub → "Compare & pull request" → Create
7. Netlify comenta en el PR con un link de Deploy Preview
   → lo prueban los 3 desde el celular
8. Si está bien → "Merge pull request" → main se publica solo
9. git checkout main && git pull
```

- Para que el mapa funcione en un Deploy Preview, agrega su URL a las restricciones de la key (A.2 paso 4).
- **Si algo sale mal en producción:** Netlify → **Deploys** → elige un deploy anterior → **Publish deploy**. Vuelve atrás en segundos.

---

# PARTE B — Cumplimiento normativo laboral (MTPE y relacionados)

## B.1 Situación legal actual (octubre 2026)
- **No hay una ley peruana específica para trabajo en plataformas.** Ha habido varios proyectos de ley, sobre todo para repartidores y conductores, y ninguno se aprobó.
- **Convenio 193 de la OIT** (aprobado el 12/06/2026): fija mínimos de protección para trabajadores de plataformas, sean dependientes o independientes. **No los convierte automáticamente en empleados.** El Perú aún no lo ha ratificado.
- **MTPE (agosto 2026):** anunció que promoverá la formalización laboral en plataformas digitales. Hay que diseñar pensando en que **vendrán exigencias**: transparencia, protección social y seguros.

## B.2 Qué es un cachuelo ante la ley y cómo cuidarlo
- **Qué es:** un **servicio independiente puntual** (locación de servicios, Código Civil). No es un contrato de trabajo.
- **El riesgo — primacía de la realidad:** si en la práctica hay **subordinación** (horario fijo recurrente, órdenes, exclusividad, sanciones, uniforme), un juez o SUNAFIL puede considerarlo relación laboral, sin importar cómo se llame. Ese riesgo aplica a:
  - **el contratante**, si repite el mismo "cachuelo" todos los días con el mismo trabajador;
  - **Cachuelo**, si la plataforma controlara a los trabajadores.

**Reglas de producto para que Cachuelo siga siendo intermediario y no empleador:**

| Regla | Estado en la app |
|---|---|
| El precio lo fija quien publica, no Cachuelo | ✅ Ya es así |
| El trabajador elige a qué postular; no hay asignación automática | ✅ Ya es así |
| Sin sanciones por rechazar o no postular; sin metas ni exclusividad | ✅ No existe (mantenerlo así) |
| No dar órdenes sobre *cómo* hacer el trabajo | ✅ Solo facilita contacto y pago |
| Duración máx. 1 mes (Acta N°2) | ✅ Publicar limita a 30 días |
| **Detectar relaciones encubiertas:** mismo contratante + mismo trabajador, muchas veces seguidas | ❌ **Por hacer:** aviso al contratante sugiriendo formalizar |
| Lenguaje: "cachuelo", "servicio", "pago acordado"; evitar "empleado", "jornada", "sueldo", "contratar personal" | ⚠️ Revisar textos |

## B.3 Requisitos concretos y cómo llevarlos a la app

**1. Solo mayores de 18 años** — prioridad alta, fácil
- El trabajo de adolescentes tiene autorizaciones y límites especiales (Código de los Niños y Adolescentes). Lo más seguro es **no admitir menores**.
- **App:** en el registro ya se pide la fecha de nacimiento → **bloquear a menores de 18** y agregar una casilla "Declaro ser mayor de edad".
- Los cachuelos no pueden pedir ni ofrecer trabajo de menores.

**2. Avisos sin discriminación** (Ley 26772 y su reglamento, DS 002-98-TR) — prioridad alta
- La ley prohíbe requisitos discriminatorios en las ofertas y **alcanza también a quienes sirven de intermediarios**. Las sanciones las pone el MTPE.
- **Prohibido:** sexo, edad, raza, religión, estado civil, "buena presencia", condición económica, historial crediticio, etc.
- **Sí se permiten** requisitos objetivos ligados al trabajo: "con brevete A-I", "experiencia en drywall", "con herramientas propias".
- **App:**
  - Filtro al publicar que **detecta frases discriminatorias** ("solo mujeres", "menor de 30", "buena presencia", "varón") y pide reformular.
  - El motivo "Discriminación" en el botón **Reportar**.
  - Revisión por Operaciones (Miki).

**3. ¿Somos "agencia privada de empleo"?** — prioridad media, consultar a un abogado
- Las agencias que intermedian **empleo** deben inscribirse en el **RENAPE** del MTPE (DS 020-2012-TR).
- **Postura de Cachuelo:** intermedia **servicios independientes puntuales**, no empleos. Aun así es una zona gris → **pedir opinión legal** antes del lanzamiento.
- **Lo que ya ayuda:** el modelo v0.16 **no le cobra nada al trabajador**; solo cobra al contratante. Es el principio internacional de que quien busca trabajo no paga por conseguirlo. **Mantenerlo siempre.**

**4. Certificado Único Laboral (CUL) y DNI** — ya acordado (Acta N°2 #6)
- El CUL es gratuito (MTPE) e incluye antecedentes policiales, penales y judiciales.
- **Atención — Ley 29733 de Protección de Datos Personales:**
  - Los antecedentes y el DNI son **datos sensibles**: requieren **consentimiento expreso**, una **política de privacidad**, inscribir el banco de datos ante la Autoridad Nacional de Protección de Datos Personales y medidas de seguridad.
  - **Recomendación:** no guardar el PDF del CUL. Verificarlo y guardar solo "verificado: sí / fecha".

**5. Seguridad en trabajos de riesgo** — prioridad media
- En categorías como **Reparaciones (altura o electricidad), Mudanza, Jardinería con herramientas**:
  - Al publicar: aviso "Este trabajo puede implicar riesgos. Acuerden equipo de protección. Cachuelo no provee seguro".
  - Al postular: casilla "Cuento con la experiencia y el equipo necesarios".
- **A futuro** (en línea con el Convenio 193): **seguro de accidentes personales por cachuelo**, opcional, contratado con una aseguradora. Además es una fuente de ingreso.

**6. Tributos del trabajador** — informativo
- Lo que gana el trabajador es **su** ingreso: rentas de cuarta categoría si es persona natural.
- Si el contratante es una **empresa**, puede pedirle un recibo por honorarios.
- **App:** opción "Necesito comprobante" al publicar, para que el trabajador lo sepa antes de postular.

**7. Consumidor** — prioridad alta antes de cobrar dinero real
- **Libro de Reclamaciones virtual** (INDECOPI).
- **Términos y Condiciones:**
  - Cachuelo es intermediario.
  - Mandato de cobro en Pago Protegido.
  - Reglas de liberación a las 72 h, reembolsos y reclamos.
- Precios mostrados **con impuestos incluidos** (ver Parte C).

## B.4 Prompts listos para Claude Code (implementar B.3)
Crea una rama (`git checkout -b feature/cumplimiento`) y pega uno por uno:

1. *"Lee CLAUDE.md. En el registro (LoginScreen), bloquea a menores de 18 usando fecha_nac: muestra error claro y deshabilita 'Crear cuenta'. Agrega la casilla obligatoria 'Declaro ser mayor de 18 años y acepto los Términos y la Política de Privacidad'. Agrega en Supabase un CHECK o trigger que rechace fecha_nac de menores. Corre npm run build."*
2. *"Crea src/features/compliance/discriminationFilter.js con una lista de patrones discriminatorios en español peruano (sexo, edad, apariencia, estado civil, religión, raza, nacionalidad, condición económica). Úsalo en PublishScreen y EditCachueloScreen: si el título o la descripción coinciden, muestra un aviso de vidrio que explique la Ley 26772 en lenguaje simple y bloquee 'Siguiente' hasta reformular. Agrega pruebas con ejemplos válidos e inválidos."*
3. *"Agrega 'Discriminación' y 'Trabajo de menores' como motivos en ReporteModal."*
4. *"Para las categorías Reparaciones, Mudanza y Jardinería, muestra un aviso de seguridad al publicar y una casilla obligatoria al postular. Textos en src/features/compliance/safety.js."*
5. *"Detecta cuando el mismo contratante acepta al mismo trabajador 4 o más veces en 30 días y muéstrale al contratante una sugerencia amable de formalizar la relación, con un enlace informativo del MTPE."*

---

# PARTE C — ¿Cobramos IGV? ¿Qué nos corresponde?

## C.1 Respuesta corta
**Sí, Cachuelo cobra IGV (18 % = 16 % IGV + 2 % IPM), pero solo sobre lo que Cachuelo cobra por su servicio:**
- ✅ Tarifa de servicio del Pago Protegido (10 %).
- ✅ Tarifa de conexión del Pago directo (S/5).
- ✅ Destacar anuncio, publicidad y cualquier plan pagado.
- ❌ **Nunca** sobre el precio del trabajo. Ese dinero es del trabajador y es otra operación, de otra persona.

SUNAT trata la **intermediación** de una plataforma y el **servicio de fondo** (el trabajo) como **operaciones independientes**. Para la intermediación, la base imponible es el total de lo que se cobra por ella.

## C.2 Cómo mostrarlo (decisión tomada en v0.16.1)
La ley de protección al consumidor exige mostrar el **precio total con impuestos**. Por eso las tarifas de la app son **con IGV incluido** y se rotulan así: "Tarifa de servicio (incl. IGV)".

**Ejemplo, cachuelo de S/150 con Pago Protegido:**

| Concepto | Monto |
|---|---|
| Precio del trabajo (del trabajador, sin IGV de Cachuelo) | S/ 150,00 |
| Tarifa Cachuelo (incl. IGV) | S/ 15,00 |
| → Valor de venta | S/ 12,71 |
| → IGV 18 % | S/ 2,29 |
| **Paga el contratante** | **S/ 165,00** |
| **Recibe el trabajador** | **S/ 150,00** |
| **IGV que declara Cachuelo** | **S/ 2,29**, menos el crédito fiscal del IGV que factura la pasarela |

- En el código: `IGV_RATE` y `splitIGV()` en `pricing.js` hacen este cálculo, para la boleta.
- **Alternativa** si el equipo prefiere: "10 % + IGV" (11,8 % en total). Sube el ingreso, pero el contratante ve un número más alto. Se decide en el Acta N°3.

## C.3 Lo que hay que tener listo (con el contador)
1. **RUC, régimen tributario y emisión electrónica.**
   - Una SAC/EIRL nueva normalmente entra al **Régimen MYPE Tributario**. El contador confirma según la proyección de ingresos.
   - Facturación electrónica (SUNAT o un proveedor) para emitir **boleta** (personas) o **factura** (empresas que la pidan) **solo por la tarifa de Cachuelo**.
2. **El dinero del trabajador que pasa por nuestra cuenta (Pago Protegido) es el punto más delicado.**
   - Si no está bien documentado, SUNAT podría considerar **los S/165 completos** como ingreso de Cachuelo y cobrar IGV y renta sobre todo.
   - **Necesitamos:**
     - Términos y Condiciones con **mandato de cobro**: el trabajador autoriza a Cachuelo a cobrar en su nombre.
     - Registro contable separado (cuenta de "fondos de terceros").
     - Constancia de cada transferencia al trabajador. La tabla `pagos` ya tiene `transferido_at` y `transferencia_ref` para esto.
   - **Ideal a futuro:** que la pasarela haga el "split" del pago, para que el dinero del trabajador nunca entre a la cuenta de la empresa.
3. **Detracciones:** confirmar con el contador si la tarifa podría calificar como "comisión mercantil" sujeta a detracción cuando el contratante sea una **empresa** y supere el monto mínimo. Con personas naturales no aplica.
4. **Impuesto a la Renta:** Cachuelo paga renta **sobre su utilidad**: tarifas menos costos (pasarela, servidores, Google Maps, etc.).
5. **El IGV que nos cobran Culqi, Netlify, Google y otros proveedores locales** con factura es **crédito fiscal** y se descuenta del IGV a pagar. Pedir siempre factura con el RUC de la empresa.

## C.4 Respuesta a "¿qué nos correspondería cobrar además del monto?"
- **Al que publica (contratante):** el precio del trabajo + **la tarifa de Cachuelo con IGV incluido**. Nada más.
- **Al que hace el trabajo:** **nada**. Recibe el 100 %. Así lo protege el modelo y evita la discusión de "agencia de empleo" (B.3.3).
- **Ingresos adicionales posibles, todos con IGV incluido:**
  - destacar anuncios;
  - planes para empresas que publican seguido;
  - seguro opcional por cachuelo;
  - publicidad no invasiva (Acta N°1 #5).

---

# PARTE D — Cambios de código en v0.16.1

| Archivo | Cambio |
|---|---|
| `netlify.toml` (nuevo) | Build `npm run build` → `dist`, Node 20, redirección SPA, cabeceras de seguridad, permiso de geolocalización |
| `src/features/payments/pricing.js` | `IGV_RATE` (18 %) y `splitIGV()` para separar valor de venta e IGV |
| `src/features/payments/PaymentSheet.jsx` | Rótulos "Tarifa de servicio (incl. IGV)" y "Tarifa de conexión (incl. IGV)" |
| `INFORME_v0.16.1_Netlify_Normativa_IGV.md` (nuevo) | Este documento |

Build verificado sin errores.

## Pendientes para votar en el Acta N°3
1. Modelo de cobro v0.16 (propuesto en `CAMBIOS_v0.16.md`).
2. Tarifa **10 % con IGV incluido** vs. **10 % + IGV**.
3. Presupuesto para abogado laboralista y contador: RENAPE, mandato de cobro, régimen tributario, Términos y Condiciones.
4. Implementar B.3 (mayoría de edad, filtro de discriminación, avisos de seguridad) antes de la marcha blanca con usuarios reales.
