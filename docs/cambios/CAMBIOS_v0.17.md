# Resumen v0.17 / v0.17.1 — 09/10/2026
**Análisis de Airtasker · Verificación de identidad · Ofertas con contraoferta · Mapa por zonas · Seguridad**

Base: v0.16.1, la misma que está publicada en Netlify. La etiqueta del prototipo ahora dice "v0.17".

> Lo legal de este documento ordena los temas y propone cómo reflejarlos en la app. Antes del lanzamiento con usuarios reales debe revisarlo un abogado (protección de datos y laboral).

---

## Índice
1. [Análisis de Airtasker](#1-análisis-de-airtasker)
2. [Comisiones: Airtasker vs. Cachuelo](#2-comisiones-airtasker-vs-cachuelo)
3. [Verificación de identidad (DNI, selfie y CUL)](#3-verificación-de-identidad)
4. [Foto de perfil con aprobación](#4-foto-de-perfil-con-aprobación)
5. [Mapa: zonas en vez de puntos exactos](#5-mapa-zonas-en-vez-de-puntos-exactos)
6. [Ofertas con contraoferta y comentario](#6-ofertas-con-contraoferta-y-comentario)
7. [Requisitos y documentos al publicar](#7-requisitos-y-documentos-al-publicar)
8. [Seguro y responsabilidad](#8-seguro-y-responsabilidad)
9. [Seguridad adicional](#9-seguridad-adicional)
10. [Bugs encontrados y corregidos](#10-bugs-encontrados-y-corregidos)
11. [Base de datos (migración v0.17)](#11-base-de-datos-migración-v017)
12. [Archivos nuevos y modificados](#12-archivos-nuevos-y-modificados)
13. [Pruebas realizadas](#13-pruebas-realizadas)
14. [Cómo aplicar esta versión](#14-cómo-aplicar-esta-versión-paso-a-paso)
15. [Decisiones para el Acta N°3](#15-decisiones-para-el-acta-n3)
16. [Siguientes pasos recomendados](#16-siguientes-pasos-recomendados)

---

## 1. Análisis de Airtasker

**Cómo se hizo:** la extensión de Chrome no estaba conectada, así que se revisaron las páginas públicas de Airtasker directamente, más su centro de ayuda. La página de listado (`/tasks/`) solo se pudo leer en parte. Los detalles de filtros y diseño de esa pantalla no se confirmaron; las reglas de comisiones, pagos, verificación, seguros y cancelaciones sí, desde sus páginas oficiales.

### Cómo funciona Airtasker
1. El cliente publica una tarea con presupuesto, fecha y lugar (presencial u online).
2. Los "Taskers" hacen **ofertas con su precio y un comentario**. Hay preguntas públicas en la tarea.
3. El cliente elige una oferta. **Al asignarla paga**, y el dinero queda en custodia ("Airtasker Pay").
4. Hacen el trabajo. El Tasker pide el pago y **el cliente lo libera** (puede agregar propina).
5. Reseñas mutuas.

### Qué replicar, mejorar o no hacer

| Función de Airtasker | Decisión para Cachuelo | Estado |
|---|---|---|
| Ofertas con precio propio y comentario | **Replicar** | ✅ Hecho en v0.17 |
| Pago retenido al asignar y liberado al terminar | **Replicar** | ✅ v0.16 (Pago Protegido) |
| Insignias de verificación (ID con escaneo facial, antecedentes, licencias) | **Replicar adaptado:** DNI + selfie + CUL; licencias como "requisitos" | ✅ Hecho en v0.17 |
| Mapa y listado de tareas con filtros | Replicar | ✅ v0.15 (ahora con zonas) |
| Chat privado después de asignar | Replicar, con escudo de contacto | ✅ v0.16 |
| **Reglas de cancelación** (quien cancela paga la tarifa; cancelación automática a las 48 h sin respuesta) | **Replicar** | ⏳ Recomendado para v0.18 |
| **Reglas de pago** (no efectivo ni pago por fuera, salvo materiales con boleta) | Replicar | ⏳ Agregar a Términos y en avisos del chat |
| Propina / bono al liberar el pago | Replicar (simple) | ⏳ v0.18 |
| Subir el precio después de asignar (trabajo extra) | Replicar | ⏳ v0.18 |
| Alertas de nuevas tareas por categoría y zona | Replicar | ⏳ Requiere notificaciones push |
| Preguntas públicas en la tarea | Mejorar: con escudo de contacto y moderación | ⏳ Evaluar después del MVP |
| Seguro de responsabilidad civil para trabajos pagados en la plataforma | Fase 2 (ver sección 8) | ⏳ |
| Niveles de Tasker (Bronce → Platino) con comisión menor | **No copiar la comisión** (aquí el trabajador no paga). Sí copiar la idea de insignias por desempeño | ⏳ Pendiente #24 |
| **Comisión al trabajador (12,5 %–20 %)** | **No replicar** (ver sección 2) | ❌ |
| **Tarifa de conexión fija y alta** | **No replicar** | ❌ |
| Pago "por hora" con monto final abierto | **Airtasker no lo permite.** Para Pago Protegido debe haber un total fijo | ⚠️ Hoy el formulario permite "Por hora": ajustar en v0.18 |
| Membresía de clientes, créditos de Airtasker, cuentas para empresas | Después del lanzamiento | ❌ fuera del MVP |

---

## 2. Comisiones: Airtasker vs. Cachuelo

### Qué cobra Airtasker
- **Al cliente:** una "Connection Fee" al asignar, de **AUD 9,95 a AUD 59,95** según el precio (en Australia, con impuesto incluido).
  - Ejemplo: en una tarea de menos de AUD 50 paga AUD 9,95, es decir **20 % o más** del valor.
  - Si el cliente cancela por su culpa, esa tarifa no se devuelve.
- **Al trabajador:** una tarifa de servicio según su nivel (datos de su página de Irlanda, sin IVA):

  | Nivel | Comisión | Requisito (ganancias en 30 días) |
  |---|---|---|
  | Bronce | 20 % | menos de €400 |
  | Plata | 18,5 % | €400+ |
  | Oro | 14,9 % | €1.500+ |
  | Platino | 12,5 % | €3.500+ |

- **En total:** entre lo que paga el cliente y lo que se descuenta al trabajador, Airtasker se queda aproximadamente con **25 %–40 %** de cada tarea.

### ¿Es viable en Perú? **No. Nos quedamos con el modelo de la v0.16.**

1. **Montos bajos.** Un cachuelo típico cuesta S/50–150. Una tarifa fija equivalente a la de Airtasker se comería buena parte del pago y nadie la usaría.
2. **Fuga a WhatsApp y Facebook.** Con 25–40 % de comisión, el incentivo para arreglar por fuera es enorme. Pagar por Yape entre personas es gratis y cotidiano.
3. **Cobrar al trabajador es riesgoso aquí:**
   - Choca con el principio internacional de que quien busca trabajo no paga por conseguirlo.
   - Acercaría a Cachuelo a la figura de "agencia de empleo" (ver INFORME_v0.16.1, B.3).
   - Es justo lo que vuelve informal al trabajador.
4. **Diferenciación.** "El trabajador recibe el 100 %" es nuestro mejor argumento frente a Airtasker y a cualquier competidor que llegue.

**Modelo vigente (v0.16, sin cambios):**
- Publicar: gratis.
- Pago Protegido: el contratante paga **10 % (mín. S/3, máx. S/60), IGV incluido**.
- Pago directo: **S/5** de conexión.
- Trabajador: 100 %.

Comparación en un cachuelo de S/150: el contratante paga **S/15** con Cachuelo. En Airtasker, con su tabla, pagaría alrededor de 20 % + la comisión del trabajador.

**Lo que sí copiamos de Airtasker:**
1. Si alguien cancela, pierde la tarifa.
2. El seguro aplica solo a trabajos pagados por la app.
3. Prohibición explícita de pagos por fuera.

Las tres dan motivos para usar el Pago Protegido sin subir la comisión.

---

## 3. Verificación de identidad

### Lo que pidieron y lo que se implementó

| Pedido | Implementado | Por qué |
|---|---|---|
| DNI | ✅ Anverso y reverso | Identidad |
| Antecedentes penales | ✅ **Vía el CUL**, no como certificado aparte | El **Certificado Único Laboral** (gratis, del MTPE) ya incluye antecedentes **policiales, penales y judiciales**. Pedir además el certificado de antecedentes penales es redundante, y la **Ley N° 31944 (2023) prohíbe exigirlo a postulantes**: solo se puede pedir una declaración jurada y verificarlo si la persona es elegida. El CUL es el documento que se recomienda pedir en su lugar |
| Certificado Único Laboral | ✅ Número, fecha de emisión y archivo | Vigencia de **90 días**. La app no deja enviar un CUL más antiguo |
| Foto que coincida con el DNI | ✅ Selfie, revisada contra el DNI | Ver sección 4 |

### Flujo del usuario
1. **Se registra** → aparece automáticamente "Verifica tu identidad".
2. **5 pasos:**
   - datos (nombres, DNI de 8 dígitos, fecha de nacimiento: **bloquea a menores de 18**);
   - foto del DNI;
   - selfie;
   - CUL;
   - consentimiento.
3. **Consentimiento expreso.** Son datos sensibles (Ley N° 29733: DNI, imagen y antecedentes). La persona marca dos casillas: autorización de uso **solo para verificación y seguridad**, y declaración de veracidad.
4. **Estado "En revisión".** Puede **mirar** cachuelos, pero **no puede enviar ofertas ni publicar** hasta que la aprueben. Esto se valida en la app y **también en la base de datos**.
5. Puede elegir "Hacerlo después" y entrar solo a mirar.

> **Decisión tomada a criterio:** se pidió "al registrarse". Lo implementé como paso **inmediatamente después** del registro, dejando mirar sin verificarse. Si se bloquea todo hasta aprobar, la gente se va sin ver qué ofrece la app y el equipo queda con una cola de revisiones de personas que quizá nunca usen Cachuelo. Si prefieren bloquear todo, es un cambio pequeño.

### Panel de revisión (Operaciones)
Se entra por *Perfil → ⚙️ → Revisar verificaciones*. En producción solo lo ven usuarios con `rol = 'admin'`.

- Muestra lado a lado: selfie, DNI anverso, DNI reverso y CUL.
- Datos: nombre, DNI, edad, días del CUL y si está vigente.
- **Checklist obligatorio.** No se puede aprobar sin marcar los 6 puntos:
  1. La selfie coincide con la foto del DNI.
  2. El DNI es legible, no está alterado y el número coincide.
  3. Los nombres coinciden.
  4. Es mayor de 18.
  5. El CUL está verificado en la plataforma oficial del MTPE (número + DNI) y vigente.
  6. Antecedentes revisados según la política de Cachuelo.
- **Acciones:**
  - **Aprobar:** el perfil recibe el sello "verificado" y la selfie pasa a ser su foto.
  - **Pedir cambios:** con motivo; el usuario corrige y reenvía.
  - **Rechazar:** con motivo.

### Pendiente legal importante
- **Política de antecedentes.** Hay que definir con un abogado qué antecedentes impiden usar la app (por ejemplo, delitos violentos, sexuales o contra el patrimonio). Rechazar a alguien por antecedentes que no tienen relación con el servicio puede ser discriminación. La ley exige **proporcionalidad**.
- **¿CUL también para contratantes?** Se implementó para **todos**, como pidieron: el trabajador también entra a la casa de un desconocido. Es defendible por seguridad mutua, pero hay que justificarlo en la Política de Privacidad. Alternativa más liviana: DNI + selfie para todos y CUL solo para quien quiera trabajar. El cambio de código es pequeño.
- **Retención de documentos.** Recomendado: borrar las imágenes del DNI y del CUL unos 30 días después de aprobar, guardando solo el resultado. **Aún no está automatizado** (ver sección 16).
- **Inscribir el banco de datos** ante la Autoridad Nacional de Protección de Datos Personales y publicar la **Política de Privacidad** antes de pedir documentos reales.

---

## 4. Foto de perfil con aprobación
- **La primera foto de perfil es la selfie de la verificación.** Se publica solo cuando se aprueba.
- **Cambiar la foto después** también pasa por revisión: el perfil muestra "Foto en revisión" y sigue con la foto anterior.
- **En el panel**, pestaña "Fotos de perfil", el revisor compara la foto nueva con el DNI y elige "Coincide, aprobar" o "No coincide".
- **No se puede aprobar una foto** si la persona aún no tiene su identidad verificada (no hay DNI con qué comparar).
- **En producción:** las fotos pendientes están en un **almacenamiento privado**. Solo al aprobarse se copian al almacenamiento público de avatares, y **solo un admin puede escribir ahí**.

---

## 5. Mapa: zonas en vez de puntos exactos

**Antes (v0.15):** pin redondeado a ~110 m. Era casi la dirección.

**Ahora:**
- **Cada cachuelo se ve como un círculo sombreado de ~300 m de radio** (v0.17.1; antes 500 m), con un chip de categoría y precio en el centro, sin "cola" que apunte a un lugar.
  - Los cachuelos sin pin (solo distrito) usan un círculo de ~700 m (antes 1,2 km).
  - Al alejar el mapa se ven los chips y grupos; los círculos aparecen desde un nivel de zoom de barrio.
- **El centro del círculo NO es la dirección.** Al guardar, la base de datos **mueve el centro al azar entre 0 y 180 m** (60 % del radio). Así la ubicación real queda dentro del círculo, pero nadie puede deducirla:
  - Si el publicador edita sin mover el pin, la zona no cambia (no se puede "promediar" hasta adivinarla).
  - Los cachuelos que ya tenían pin se desplazan una sola vez al correr la migración.
- **Se quitó el botón "Cómo llegar"** de la tarjeta del mapa. Llevaba a un punto aproximado y daba una falsa idea de precisión.
- La tarjeta dice: *"Zona aproximada (radio ~300 m). La dirección exacta solo se comparte por chat con la persona aceptada."*
- **Al publicar**, el selector muestra el **tamaño real de la zona** (el anillo se ajusta al zoom) y explica que el centro se desplaza.

---

## 6. Ofertas con contraoferta y comentario
Se resuelve el pendiente #4 de `PENDIENTES.txt`, al estilo "Make an offer" de Airtasker.

- **Al postular**, el trabajador elige:
  - **"Acepto el precio"** (el publicado), o
  - **"Propongo otro"**: escribe su precio y ve la diferencia ("+S/30 respecto al precio publicado"). Mínimo S/10.
- **Comentario obligatorio** (mínimo 20 caracteres), con una guía: qué incluye su precio, cuándo puede, su experiencia. Los teléfonos y correos se ocultan automáticamente hasta que lo acepten.
- Si el cachuelo pide documentos, debe marcar **"Cumplo con los requisitos"**. En trabajos de riesgo, también la **casilla de seguridad** (sección 8).
- **El publicador**, en "Postulantes", ve cada oferta con su precio grande y una etiqueta:
  - **"Acepta tu precio"** (verde), o
  - **"Contraoferta · publicado S/ X"** (ámbar si es más caro, verde si es más barato).
- **Al aceptar**, el Pago Protegido se calcula con el **precio ofertado**, tanto en la app como en la Edge Function de pagos del servidor.

---

## 7. Requisitos y documentos al publicar
- En el paso 1 de Publicar aparece un recuadro: **"¿Este cachuelo requiere algún documento?"**, con **sugerencias según la categoría**:
  - Delivery: brevete y SOAT vigentes.
  - Cocina y Eventos: carné de sanidad.
  - Reparaciones: constancia técnica, experiencia en altura, equipo de protección.
  - Tutorías: constancia de estudios.
  - …y un campo libre para otros (hasta 6).
- Los requisitos se muestran en el detalle del cachuelo. El postulante confirma que los cumple.
- **Filtro de avisos discriminatorios (Ley N° 26772):**
  - Si el título, la descripción o los requisitos piden **sexo, edad, apariencia, estado civil, religión, nacionalidad o historial crediticio**, la app lo explica en lenguaje simple y **no deja avanzar**.
  - Probado con 12 frases discriminatorias (detectó todas) y 9 frases normales parecidas (ningún falso positivo). Ejemplo: "casa de mi señora madre" pasa, "se busca señorita" no.
- **Trabajos de riesgo** (Reparaciones, Mudanza, Jardinería, Delivery): aviso de seguridad al publicar y en el detalle.

---

## 8. Seguro y responsabilidad

### ¿Es obligatorio dar seguro? **No, hoy no.**
- **No hay una ley peruana** que obligue a las plataformas digitales a asegurar a quienes trabajan por ellas.
- **El SCTR** depende de que exista relación laboral y de que la actividad sea de alto riesgo.
- **Las pólizas privadas son voluntarias.**
- **Convenio 193 de la OIT** (junio 2026): pide protecciones mínimas, incluida la seguridad, a todos los que trabajan en plataformas. El Perú aún no lo ratifica y el Ministerio de Trabajo anunció que promoverá la formalización.

### Recomendación: por fases

**Fase 1 (ya implementada en el MVP): aviso claro + medidas de seguridad, no un simple "no nos hacemos responsables"**
- **Por qué no la frase seca:** una cláusula que exonere totalmente de responsabilidad puede considerarse **abusiva** según el Código de Protección y Defensa del Consumidor, y no protegería si Cachuelo fue negligente (por ejemplo, si verificó mal a alguien). Lo que sí protege es **decir con precisión qué es y qué no es Cachuelo, y hacer bien nuestra parte**: verificar, moderar, dar herramientas de seguridad.
- **Texto implementado**, al pie del detalle de cada cachuelo:
  > *"Cachuelo es una plataforma que conecta a personas que necesitan un servicio puntual con personas independientes que lo realizan. Cachuelo no es empleador de los usuarios, no presta el servicio ni dirige cómo se realiza. Por ahora Cachuelo no incluye un seguro de accidentes: cada persona es responsable de cuidar su seguridad y de contar con su propio seguro (SIS o EsSalud)."*
- **Trabajos de riesgo:** el postulante marca *"Cuento con la experiencia y el equipo de protección necesarios, y sé que Cachuelo no incluye seguro de accidentes"*.

**Fase 2 (con volumen): seguro opcional, como Airtasker**
- Airtasker contrata, mediante un corredor, un **seguro de responsabilidad civil frente a terceros** para los Taskers:
  - Cubre lesiones o daños causados durante la tarea.
  - **Solo si la tarea se pagó por la plataforma.**
  - No cubre trabajo mal hecho.
- **Propuesta para Cachuelo:** negociar con una aseguradora peruana una póliza de **accidentes personales + responsabilidad civil**, incluida o vendida por cachuelo en el Pago Protegido (por ejemplo, S/1–2 extra). Es otro motivo para pagar por la app y otra fuente de ingreso.

---

## 9. Seguridad adicional
Implementado:
- **Centro de seguridad en el chat**, cuando la oferta ya fue aceptada:
  - Llamada directa a **Policía 105**, **SAMU 106** y **Bomberos 116**.
  - **"Avisar a un contacto de confianza":** comparte por WhatsApp qué cachuelo es, la zona, con quién y desde qué hora.
  - Recomendaciones (pagar dentro de la app, confirmar que la persona es la del perfil, retirarse si algo incomoda, equipo de protección).
- **Solo usuarios verificados pueden publicar y enviar ofertas**, validado también en la base de datos.
- **Un DNI = una cuenta** (no se puede verificar dos cuentas con el mismo DNI).
- **Menores de 18 bloqueados** en el registro, en la verificación y en la base de datos.
- **Escudo de contacto también en las ofertas** (teléfonos y correos ocultos hasta aceptar).

Recomendado para después (sección 16): bloquear usuarios, confirmar llegada y salida del trabajo, verificar el celular por SMS, suspensión automática tras varios reportes.

---

## 10. Bugs encontrados y corregidos

| # | Gravedad | Bug | Arreglo |
|---|---|---|---|
| 1 | 🔴 **Crítico (seguridad)** | La política de `profiles` permitía a cualquier usuario editar **todas** las columnas de su perfil, incluido **`rol`**: alguien podía **hacerse admin** desde el navegador, o marcarse como verificado | Trigger en la base de datos: solo un admin puede cambiar `rol`, `dni_verificado` y `avatar_url`. **Probado** |
| 2 | 🔴 Alto | En el chat, el cachuelo se recargaba **sin el precio**, así que el **Pago Protegido calculaba sobre S/0** (venía de v0.16) | El chat carga el precio y usa el precio ofertado |
| 3 | 🟡 Medio | La protección del trigger de seguridad no funcionaba con `current_user` dentro de una función `SECURITY DEFINER` (detectado antes de entregar) | Se usa `auth.role()`. **Probado** |
| 4 | 🟢 Bajo | La etiqueta del prototipo decía "v0.15" estando en v0.16 | Ahora dice v0.17 |

---

## 11. Base de datos (migración v0.17)
Archivo: `supabase/migrations/2026-10-09_v0.17_verificacion_ofertas_zonas.sql`. Se corre **después** de v0.15 y v0.16. **Solo hace falta cuando conecten Supabase real**; en el modo demo actual no se usa.

| Cambio | Detalle |
|---|---|
| `is_admin()` | Función para saber si quien llama es admin |
| Protección de `profiles` | Bug #1 |
| `cachuelos.requisitos` | Lista de hasta 6 textos |
| `postulaciones.monto_ofertado`, `cumple_requisitos` | Ofertas; mínimo S/10 |
| Políticas de publicar y postular | Solo usuarios con `dni_verificado` |
| Zonas | Trigger que desplaza el centro 0–180 m al azar (reemplaza el redondeo de v0.15) + desplazamiento único de los cachuelos existentes |
| Tabla `verificaciones` | Datos, rutas de archivos, estado, motivo, consentimiento (fecha y versión de política), foto pendiente. Mayor de 18 obligatorio. DNI único |
| Trigger `proteger_verificacion` | El usuario no puede aprobarse solo; si cambia documentos vuelve a "pendiente" |
| `revisar_verificacion()` y `revisar_avatar()` | Solo admin. Al aprobar marca el perfil como verificado y publica la foto |
| Storage | Bucket **privado** `verificaciones` (cada usuario solo escribe en su carpeta; lee él y el admin). En `avatars` solo escribe el admin |

⚠️ **Al conectar Supabase real:**
1. Correr la migración.
2. En *Storage → Policies*, **borrar políticas antiguas del bucket `avatars`** que dejen subir fotos a usuarios comunes.
3. Nombrar al primer admin: `UPDATE public.profiles SET rol = 'admin' WHERE email = '…';`.

---

## 12. Archivos nuevos y modificados

**Nuevos**
| Archivo | Para qué |
|---|---|
| `src/lib/demoBackend.js` (v0.17.1) | Modo demo sin Supabase: ofertas y publicaciones se guardan en el navegador; mensajes de error entendibles |
| `src/features/verification/verificationStore.js` | Guardar y leer verificaciones (demo / live), revisión, fotos |
| `src/features/verification/VerificationScreen.jsx` | Onboarding de 5 pasos, tarjeta de estado, hoja "verifica para continuar" |
| `src/features/verification/AdminVerificationsScreen.jsx` | Panel de revisión de documentos y fotos |
| `src/features/offers/offersApi.js` | Guardar ofertas (tolera que falte la migración) |
| `src/features/offers/OfferForm.jsx` | Formulario de oferta con contraoferta |
| `src/features/offers/RequirementsField.jsx` | Campo de requisitos al publicar |
| `src/features/compliance/requirements.js` | Sugerencias por categoría y categorías de riesgo |
| `src/features/compliance/discriminationFilter.js` | Filtro Ley 26772 |
| `src/features/compliance/legal.js` | Textos de intermediación y seguridad |
| `src/features/compliance/SafetySheet.jsx` | Centro de seguridad |
| `supabase/migrations/2026-10-09_v0.17_…sql` | Migración |
| `CAMBIOS_v0.17.md` | Este documento |

**Modificados**
- `src/App.jsx`: registro (18+), Inicio, Detalle, Publicar, Editar, Postulantes, Chat, Perfil, Configuración y rutas.
- `src/data/geo.js`: radios de zona.
- `src/data/normalize.js`: requisitos.
- `src/features/map/MapScreen.jsx`: círculos, sin "Cómo llegar".
- `src/features/map/LocationFields.jsx`: anillo a escala real.
- `src/styles/liquid-glass.css`: chip de zona.
- `supabase/functions/payments/index.ts`: cobra el precio ofertado.
- `.env.example`: `VITE_VERIFICATION_MODE`.
- `CLAUDE.md`.

---

## 13. Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Build de producción | ✅ Sin errores |
| Lint (variables indefinidas, reglas de hooks) | ✅ 0 errores |
| **Las 4 migraciones en PostgreSQL 16** con un Supabase simulado | ✅ Corren sin errores; la v0.17 se puede repetir sin romper nada |
| Usuario intenta hacerse admin o verificarse solo | ✅ Bloqueado (el nombre sí se puede cambiar) |
| Zona: desplazamiento en 400 pruebas | ✅ Entre 0 y 182 m (siempre dentro del círculo de 300 m) |
| Editar sin mover el pin / moviéndolo | ✅ Conserva la zona / calcula una nueva |
| No verificado intenta postular | ✅ Bloqueado por la base de datos |
| Usuario envía su verificación como "aprobado" | ✅ Queda en "pendiente" |
| No-admin llama a la función de aprobar | ✅ "Solo administradores" |
| Subir archivos a la carpeta de otro usuario | ✅ Bloqueado |
| Oferta menor a S/10 / verificación de menor de 16 años | ✅ Rechazadas |
| **Recorrido en navegador:** registro → verificación (menor bloqueado, CUL vencido bloqueado) → enviar → "En revisión" → panel admin → aprobar → oferta con contraoferta y escudo → publicar con aviso discriminatorio bloqueado → cambio de foto → aprobación de foto | ✅ 0 errores de ejecución |

**No probado:** el mapa con círculos usando la key real de Google (este entorno no llega a Google). Es lo primero a revisar en Netlify. Tampoco se probaron flujos con Supabase real (publicar, postulantes, chat).

---

## 14. Cómo aplicar esta versión (paso a paso)

**CMD**, en tu carpeta del clon de Git:

1. Crea una rama aparte:
   ```
   cd /d F:\CACHUELO
   git checkout -b feature/v0.17-verificacion
   ```
2. Guarda `CACHUELO_v0.17.zip` en `F:\CACHUELO_versiones\` → clic derecho → **Extraer todo** → destino `F:\CACHUELO_versiones\`.
3. **Verifica dónde quedó** (Windows suele crear una carpeta dentro de otra):
   ```
   dir "F:\CACHUELO_versiones\CACHUELO_v0.17\CACHUELO_v0.17"
   ```
   Si ves `src`, `package.json` y `CAMBIOS_v0.17.md`, esa es la carpeta correcta. Si dice que no existe, usa `F:\CACHUELO_versiones\CACHUELO_v0.17`.
4. Copia sobre tu proyecto:
   ```
   robocopy "F:\CACHUELO_versiones\CACHUELO_v0.17\CACHUELO_v0.17" "F:\CACHUELO" /E
   ```
   Tu `.env` **no se toca**: no viene en el zip.
5. Compila y prueba:
   ```
   npm install
   npm run dev
   ```
   Abre `http://localhost:5173` → Continuar con Google → haz la verificación → Perfil → ⚙️ → Revisar verificaciones (demo) → aprueba → prueba enviar una oferta y publicar.
6. Publica en Netlify:
   ```
   npm run build
   ```
   Arrastra **solo** `F:\CACHUELO\dist` en la pestaña **Deploys**. Revisa el mapa en el celular: deben verse los círculos.
7. Guarda en GitHub:
   ```
   git add .
   git commit -m "v0.17: verificación de identidad, ofertas, zonas, seguridad"
   git push -u origin feature/v0.17-verificacion
   ```
   En GitHub: **Compare & pull request** → revisan → **Merge**.

**En modo demo:** la verificación se guarda en el navegador de cada celular. Para empezar de cero, en Chrome: ⋮ → Configuración → Privacidad → Datos de sitios → borrar los de tu URL de Netlify.

---

## 15. Decisiones para el Acta N°3
1. **Modelo de cobro:** mantener el de v0.16 y **descartar** el esquema de Airtasker (sección 2).
2. **Verificación:** ¿CUL para todos o solo para quien trabaja? (sección 3).
3. **Verificación al registrarse:** ¿permitir mirar sin verificarse (implementado) o bloquear todo?
4. **Política de antecedentes:** qué registros impiden usar la app (con abogado).
5. **Seguro:** aprobar Fase 1 (avisos) y cotizar la Fase 2 con aseguradoras.
6. **Operaciones:** quién revisa verificaciones y en qué plazo (rol de Miki). Es trabajo manual diario.
7. **Presupuesto legal:** Política de Privacidad, inscripción del banco de datos, Términos y Condiciones.

> **Disciplina de MVP:** la verificación manual agrega fricción (algunos no la completarán) y carga operativa diaria. Recomiendo medir en la marcha blanca cuántos la empiezan y cuántos la terminan, antes de sumar más requisitos.

---

## 16. Siguientes pasos recomendados
| Prioridad | Tarea |
|---|---|
| Alta | Probar el mapa con círculos en Netlify con la key real |
| Alta | Reglas de cancelación estilo Airtasker (quien cancela pierde la tarifa; cancelación automática a las 48 h) |
| Alta | Pago Protegido solo con total fijo (quitar "Por hora" o pedir un total estimado) |
| Alta | Borrado automático de imágenes de DNI y CUL a los 30 días de aprobadas (Edge Function programada) |
| Media | Dirección exacta privada: el publicador la escribe y solo se muestra al aceptado |
| Media | Bloquear usuarios; suspensión automática tras varios reportes |
| Media | Verificación del celular por SMS (OTP) |
| Media | Propina al liberar el pago; aumentar el precio por trabajo extra |
| Baja | Verificación automática (proveedor KYC con comparación facial) cuando la revisión manual no dé abasto |
| Baja | Seguro opcional (Fase 2) |

---

---

## 17. Ajustes v0.17.1 (después de probar en Netlify)

| # | Qué se reportó / encontró | Causa | Arreglo |
|---|---|---|---|
| 1 | Al enviar una contraoferta salía **"TypeError: Failed to fetch"** | En modo demo la app usa una dirección de Supabase de ejemplo: intentaba guardar la oferta en un servidor que no existe | **Modo demo sin servidor** (`src/lib/demoBackend.js`): si el `.env` tiene la URL de ejemplo, las **ofertas** y las **publicaciones** se guardan en el navegador. Ahora sale "Oferta enviada (modo demo)" y lo publicado aparece en Inicio y en el Mapa. Con Supabase real funciona igual que antes |
| 2 | Errores técnicos en inglés para el usuario | Se mostraba el mensaje crudo | Mensajes entendibles: "Sin conexión con el servidor…", "No tienes permiso… ¿ya verificaste tu identidad?", "Ya enviaste esto antes" |
| 3 | La zona del mapa se veía muy grande | Radio de 500 m (1,2 km sin pin) | **300 m** con pin, **700 m** solo distrito. El centro se desplaza hasta **180 m** (probado en PostgreSQL: máx. 182 m en 400 pruebas) |
| 4 | **Publicar seguía cobrando S/5** ("Cobro procesado S/5") | Pantalla antigua que no se actualizó cuando se aprobó el modelo de la v0.16 (publicar gratis) | Paso 3 renombrado a "Publicar": **Publicación gratis**; solo pide medio de pago si se activa **Destacado (+S/3)**. Botón "Publicar gratis". La pantalla final dice "Publicación gratuita · Solo pagas al aceptar a alguien" |

**Cómo resetear los datos de prueba (modo demo):** en Chrome del celular → ⋮ → Configuración → Privacidad → Datos de sitios → borra los de tu URL de Netlify. Se borran ofertas, publicaciones, verificaciones y pagos de prueba.

## Fuentes consultadas
- Airtasker — [Connection Fee](https://support.airtasker.com/hc/en-au/articles/360031769372) · [Tasker Tiers](https://www.airtasker.com/ie/tasker-tiers/) · [Seguro de responsabilidad civil](https://support.airtasker.com/hc/en-au/articles/217998398-How-does-third-party-liability-insurance-on-Airtasker-work-A-guide-for-customers) · [Insignias y verificación](https://support.airtasker.com/hc/en-au/articles/360001621807) · [Política de cancelación](https://www.airtasker.com/us/cancellation-policy) · [Precios y pagos](https://support.airtasker.com/hc/en-au/articles/360020792111-What-are-the-things-I-need-to-know-about-pricing-and-payments) · [Reglas de pago](https://support.airtasker.com/hc/en-au/articles/225553508-What-are-the-Payment-Guidelines)
- [Ley N° 31944 — qué no se puede exigir a un postulante (LexLatin)](https://lexlatin.com/opinion/ley-informacion-requerimientos-postulante-empleo-ley-31944-peru)
- [Certificado Único Laboral: contenido, vigencia y verificación (Sueldo Justo)](https://sueldojusto.pe/blog/certificado-unico-laboral/) · [gob.pe — Obtener tu CUL](https://www.gob.pe/institucion/mtpe/pages/47089-obtener-tu-certificado-unico-laboral-cul)
- [Gestión — empresas no pueden pedir antecedentes sin permiso (protección de datos)](https://gestion.pe/economia/empresas-pueden-consultar-fuentes-publicas-pero-no-pedir-antecedentes-sin-permiso-proteccion-de-datos-personales-postulantes-trabajadores-noticia/)
- [Seguros para trabajadores de plataformas en Perú (Sueldo Justo)](https://sueldojusto.pe/blog/seguros-trabajadores-plataformas-peru/)
- [Reglamento de la Ley de Protección de Datos Personales, DS 016-2024-JUS (LP)](https://lpderecho.pe/reglamento-ley-proteccion-datos-personales-decreto-supremo-016-2024-jus/)
- [El Peruano — Convenio 193 OIT sobre plataformas](https://elperuano.pe/noticia/298228-trabajas-para-una-app-conoce-que-cambia-con-el-nuevo-convenio-de-la-oit-sobre-plataformas) · [El Peruano — MTPE promoverá formalización en plataformas](https://elperuano.pe/noticia/301715-capacidad-adquisitiva-se-recuperara-a-nivel-de-2020)
