# Resumen v0.16 — 05/10/2026
**Pago Protegido (tarjeta, Yape, Plin) + modelo de cobro + mejoras de UX**

Base: v0.15. Todo lo de pagos funciona hoy en **MODO DEMO**: el flujo es completo, pero no se mueve dinero real. Pasar a cobro real requiere los pasos de la sección 6.

---

## 1. Decisión: ¿cómo cobra Cachuelo?

### El problema planteado
- **Cobrar por publicar:** la empresa gana aunque pongan "precio 0", pero frena las publicaciones al inicio (cuando más se necesitan).
- **Cobrar un % del trabajo:** se alinea con el valor real, pero los "vivos" ponen precio 0 y arreglan todo por fuera.
- **Retener el dinero al aceptar:** da confianza, pero es más responsabilidad para la empresa.

### Propuesta adoptada en el prototipo: modelo mixto "se cobra al aceptar"

| Momento | Qué paga el contratante | Qué recibe el trabajador |
|---|---|---|
| Publicar | **Gratis** (destacar sigue siendo pagado) | — |
| Aceptar → **Pago Protegido** (recomendado) | Precio + **10 %** de tarifa (mín. S/3, máx. S/60) | **100 %** del precio, al confirmar |
| Aceptar → **Pago directo** | Solo **S/5** de conexión | Le pagan por fuera, sin protección |

**Por qué este modelo:**
1. **Siempre hay ingreso cuando hay un "match".** Aunque elijan pago directo, pagan S/5 al aceptar. Poner "precio 0" ya no sirve para evitar el cobro, porque el cobro ocurre al aceptar y no depende del precio.
2. **Publicar gratis** llena la app de cachuelos en la marcha blanca. Es el problema principal de todo marketplace nuevo.
3. **El trabajador recibe el 100 %.** Para trabajadores informales, "cobro seguro y completo" es el gancho más fuerte, y lo que más incentiva a quedarse en la app.
4. **Pago Protegido ataca el miedo de ambos lados:** el contratante no pierde si el trabajador no se presenta; el trabajador no se queda sin cobrar.
5. **Reglas de las tiendas:** Apple permite (y exige) cobrar servicios físicos con pasarela propia y no con compra in-app. Cobrar por publicar o destacar podría considerarse "función digital" y caer en compra in-app, con comisión de Apple/Google. Que el ingreso principal sea la tarifa del servicio evita ese problema cuando la app vaya a las tiendas.

**Medidas contra los "vivos" (ya implementadas):**
- Precio mínimo de **S/10** (en la app y en la base de datos).
- **Escudo de contacto en el chat:** antes de aceptar, se ocultan teléfonos, correos, WhatsApp y "yapéame al…". El mensaje se envía, pero con el dato tapado.
- El trabajador ve en el detalle que existe Pago Protegido, así que tiene un motivo para pedirlo.
- **Pendiente:** que solo cuenten como "reseña verificada" los trabajos pagados por la app.

### ⚠️ Esto cambia acuerdos de las actas: votar en la próxima reunión (Acta N°3)

| Acta | Acuerdo actual | Propuesta v0.16 |
|---|---|---|
| N°1 #1 | "Los trabajos son pagados directamente entre las partes" | Se mantiene como opción (Pago directo) y se suma Pago Protegido |
| N°1 #2 / N°2 #4 | Cobro de S/5 por publicación | Los S/5 se cobran **al aceptar**, no al publicar |
| N°2 #5 | "Solo facilitamos el contacto, no somos responsables" | Con Pago Protegido la empresa **custodia dinero** y debe resolver reclamos (rol de Miki) |

Todo es configurable en `src/features/payments/pricing.js`. Si el equipo prefiere otro esquema, se cambian números, no código.

### Números de referencia (por cachuelo, Pago Protegido)
La comisión de la pasarela por pagos con Yape se estima entre **2,99 % y 3,99 %**. Cálculo prudente con 3,99 % + IGV sobre el total cobrado; la tarifa de Cachuelo se considera con IGV incluido:

| Precio pactado | Contratante paga | Tarifa Cachuelo (sin IGV) | Costo pasarela aprox. | **Neto aprox. Cachuelo** |
|---|---|---|---|---|
| S/ 50 | S/ 55 | S/ 4,24 | S/ 2,59 | **≈ S/ 1,65** |
| S/ 150 | S/ 165 | S/ 12,71 | S/ 7,77 | **≈ S/ 4,94** |
| S/ 400 | S/ 440 | S/ 33,90 | S/ 20,72 | **≈ S/ 13,18** |

**Lectura:** con 10 % el margen es delgado en trabajos chicos. Opciones a discutir con Cotillo (finanzas):
- Subir a 12 %.
- Subir el mínimo a S/5.
- Negociar tarifa con la pasarela.

Confirmar con Culqi si cobra una **comisión mínima por transacción**, porque afecta a los S/5 del pago directo.

---

## 2. Pasarela de pago (verificado)

- **Culqi** (recomendada para empezar):
  - Acepta **tarjetas** y **Yape**.
  - Con Yape, el cliente pone su celular y el **código de aprobación** de 6 dígitos que genera en su app. El código vence en 2 minutos y cada pago tiene un **máximo de S/500**. La app ya bloquea Yape cuando el total pasa de ese monto.
  - Requiere RUC.
- **Plin:**
  - Desde 2023 Yape y Plin son **interoperables con un QR único**. Por eso la opción "Plin" de la app muestra un QR que se puede pagar con Plin, Yape o la banca móvil.
  - En producción, ese QR lo genera la pasarela: Culqi (billeteras por QR) o Izipay, que integra Yape y Plin de forma nativa.
- **El dinero va primero a la cuenta de la empresa.** Pagar con tarjeta, Yape o Plin es pagarle a Cachuelo (vía la pasarela). Luego Cachuelo transfiere al trabajador por Yape, Plin o CCI, según el método de cobro que este registró. Al inicio, las transferencias pueden hacerse **manualmente en lote** (ej. 2 veces por semana) y registrarse en la tabla `pagos`.
- **Retención con tarjeta:** las "pre-autorizaciones" de tarjeta suelen durar pocos días y Yape no las permite. Como los cachuelos pueden durar hasta un mes, el modelo es **cobro inmediato + custodia + liberación**, no pre-autorización.

### Antes de cobrar dinero real (revisar con abogado y contador)
- **Custodia de dinero de terceros:** confirmar que el esquema (Cachuelo como "agente de cobro" del trabajador, definido en Términos y Condiciones) no entra en actividades reguladas por la SBS ni genera obligaciones ante la UIF.
- **SUNAT:** emitir comprobante electrónico por la tarifa de Cachuelo. El precio del trabajo es ingreso del trabajador, no de la empresa.
- **INDECOPI:** Libro de Reclamaciones virtual y una política de reembolsos clara.
- **Términos y Condiciones:** liberación automática a las 72 h, cómo se resuelven reclamos y en qué casos hay reembolso.

---

## 3. Lo implementado

### 3.1 Flujo de pago (`src/features/payments/`)
- **`PaymentSheet.jsx`** — se abre al tocar **Aceptar** en el chat (antes aceptaba directo):
  1. Elegir Pago Protegido o Pago directo, con desglose de montos ("el trabajador recibe el 100 %").
  2. Elegir medio: **Tarjeta** (detecta Visa/Mastercard/Amex/Diners, valida fecha), **Yape** (celular + código, con instrucciones) o **Plin** (QR interoperable).
  3. Pantalla de "procesando", luego éxito con número de operación.
  - Si la tarjeta es rechazada, el mensaje es claro y se puede reintentar.
- **`PaymentStatusCard.jsx`** — en el chat, para ambas partes:
  - Línea de tiempo: Pagado → Retenido → Trabajo hecho → Liberado.
  - El contratante puede **confirmar** que el trabajo terminó (con doble confirmación) o **reportar un problema** (con motivo).
  - El trabajador ve "tu pago está asegurado".
  - Al liberar el pago se abre la calificación que ya existía.
- **`WalletScreen.jsx`** — *Perfil → ⚙️ → Mis cobros y pagos*:
  - Saldos "Por cobrar" y "Cobrado".
  - Método de cobro (Yape, Plin o CCI de 20 dígitos).
  - Historial de movimientos.
  - En modo demo, un botón **"Simular aceptación"** para probar el flujo sin chat.
- **`paymentStore.js`** — modo `demo` (guarda en el navegador) o `live` (Edge Function). Se cambia con `VITE_PAYMENTS_MODE`.
- **`pricing.js`** — todas las reglas de cobro en un solo archivo.
- **`contactShield.js`** — el escudo de contacto del chat. Probado: tapa "987654321", "yapeame al 987 654 321", correos y "wsp: 999…"; no toca "llego a las 9 am" ni "150 soles".

### 3.2 Servidor (listo para cuando pasen a cobro real)
- **`supabase/migrations/2026-10-05_v0.16_pagos.sql`**:
  - Tablas `pagos` y `metodos_cobro`, con RLS. El cliente **solo puede leer** sus pagos; nadie puede marcarse "pagado" desde el navegador.
  - Precio mínimo S/10 en la base de datos.
  - Liberación automática a las 72 h con `pg_cron` (opcional, comentada).
- **`supabase/functions/payments/index.ts`** — Edge Function con las acciones `create`, `release` y `dispute`:
  - **Recalcula los montos en el servidor** (no confía en lo que manda el navegador).
  - Verifica que quien paga sea el dueño del cachuelo.
  - Cobra en Culqi con la llave secreta del servidor.
  - Plin queda marcado como "pendiente" hasta implementar la orden QR con webhook.
- **`.env.example`** — nuevas variables `VITE_PAYMENTS_MODE` y `VITE_CULQI_PUBLIC_KEY`. La llave **secreta** va solo en `supabase secrets`.

### 3.3 Mejoras de UX/UI
- **Tab bar que se encoge** al hacer scroll hacia abajo y vuelve al subir (comportamiento de iOS 26).
- **Esqueletos de carga** en el feed en lugar de mostrar cachuelos de ejemplo mientras carga.
- **Toasts** (avisos flotantes de vidrio) para confirmar acciones: pago protegido, pago liberado, reporte enviado.
- **Vibración corta** (Android) al elegir opciones, pagar y en errores.
- **Franja de confianza** en el detalle del cachuelo: "Pago Protegido disponible".
- **Publicar:** aviso si el precio es menor a S/10 y explicación de cómo se cobra ("publicar es gratis…").
- Chat: aviso cuando se ocultó un dato de contacto.

### 3.4 Bugs corregidos
| Bug | Arreglo |
|---|---|
| En **Perfil**, el header de vidrio tapaba el botón ⚙️ y no se podía tocar (venía de v0.15) | Los headers "hero" ya no se superponen a sus botones |
| Aceptar un postulante no tenía ningún paso de cobro | Ahora abre el flujo de pago |
| Se podía publicar con precio S/0 | Mínimo S/10 en app y base de datos |

---

## 4. Archivos nuevos y modificados

**Nuevos:**
- `src/features/payments/` (6 archivos)
- `src/ui/toast.jsx`
- `supabase/migrations/2026-10-05_v0.16_pagos.sql`
- `supabase/functions/payments/index.ts`
- `CLAUDE.md`
- `CAMBIOS_v0.16.md`

**Modificados:**
- `src/App.jsx`
- `src/ui/primitives.jsx`
- `src/styles/liquid-glass.css`
- `.env.example`
- `.gitignore`

## 5. Probado
- Build sin errores y lint sin errores.
- Recorrido automático en navegador:
  - Inicio → Perfil → Configuración → Mis cobros.
  - Simular aceptación.
  - Yape, Plin y tarjeta rechazada → tarjeta aprobada.
  - Pago protegido → confirmar → liberado.
  - **0 errores de ejecución.**
- **No probado:** cobro real con Culqi (necesita cuenta y llaves `pk_test`/`sk_test`), Edge Function desplegada y flujo desde el chat con usuarios reales de Supabase.

## 6. Hoja de ruta para cobrar de verdad
1. **Ya (marcha blanca):** modo demo para validar con usuarios que entienden y aceptan el Pago Protegido.
2. **Cuenta Culqi con RUC** → llaves de prueba → `supabase secrets set CULQI_SECRET_KEY=sk_test_…` → `supabase functions deploy payments` → correr la migración v0.16.
3. **Reemplazar el formulario demo por Culqi Checkout/CulqiJS** (tokeniza la tarjeta o Yape en el navegador; los datos de tarjeta nunca pasan por nuestro código).
4. **Plin:** orden QR + webhook de confirmación.
5. **Transferencias a trabajadores:** manual en lote al inicio y automatizar cuando haya volumen.
6. **Legal y tributario:** sección 2.
7. Cambiar a `VITE_PAYMENTS_MODE=live`.

## 7. Instalación de esta versión
1. Copiar el zip sobre `F:\CACHUELO`.
2. `npm install`, luego `npm run dev`.
3. En Supabase, correr las migraciones v0.15 y v0.16 (si aún no se corrió la v0.15).

Si ya hiciste `git rm -r --cached node_modules` en la v0.15, no lo repitas.

---

## 8. Trabajar con Claude Code (recomendado desde ahora)

**Sí, conviene.** El proyecto ya tiene más de 20 archivos y una base de datos con migraciones. Claude Code trabaja directo sobre tu carpeta y tu Git: lee el proyecto, edita, corre `npm run build` y prueba, en vez de pasar zips por el chat.

No pude ver el tutorial de X (no permite acceso automático). Lo que describes, un "apartado aparte" del repositorio antes de tocar `main`, es una **rama** (y opcionalmente un **worktree**).

**Flujo recomendado:**

**CMD**
```
cd /d F:\CACHUELO
git checkout -b feature/pagos-culqi
claude
```

**Git Bash**
```
cd /f/CACHUELO
git checkout -b feature/pagos-culqi
claude
```

1. Le pides el cambio a Claude Code. Revisas lo que propone y aceptas.
2. `npm run build` (que no falle).
3. `git add . && git commit -m "feat: ..."` y `git push -u origin feature/pagos-culqi`.
4. En GitHub, abres un **Pull Request** y Miki o Mauricio lo revisan.
5. Merge a `main`. Así `main` siempre funciona.

**Alternativa con worktree:**
- `claude --worktree pagos` crea una copia aislada en `.claude/worktrees/` con su propia rama. Puedes trabajar dos cosas en paralelo sin que se mezclen.
- `.claude/worktrees/` ya quedó en el `.gitignore`.

**`CLAUDE.md`:** quedó en la raíz del proyecto. Claude Code lo lee al iniciar cada sesión, con el contexto (stack, estructura, reglas de seguridad, español). Así no tienes que explicar el proyecto cada vez.

Este chat (Proyecto CACHUELO) queda para lo que no es código: estrategia, actas, decisiones, legal, minutas.
