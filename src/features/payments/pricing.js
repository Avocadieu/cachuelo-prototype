// ─── REGLAS DE COBRO (un solo lugar para cambiarlas) ─────────────────────────
// Modelo v0.16 (ver docs/cambios/CAMBIOS_v0.16.md → "Modelo de negocio"):
//   · Publicar: GRATIS (destacar sigue siendo pagado).
//   · Al ACEPTAR un postulante, el contratante elige:
//       A) Pago Protegido → paga precio + tarifa de servicio; el dinero queda
//          retenido y se libera al trabajador cuando confirma que terminó.
//       B) Pago directo   → paga solo la tarifa de conexión; arreglan el pago
//          entre ellos (sin protección).
//   El trabajador SIEMPRE recibe el 100 % del precio pactado.

export const PRICE_MIN = 10;               // S/ mínimo por cachuelo (evita el "precio 0")
export const SERVICE_FEE_RATE = 0.10;      // 10 % que paga el contratante en Pago Protegido (IGV INCLUIDO)
export const IGV_RATE = 0.18;              // 16 % IGV + 2 % IPM. Solo grava la tarifa de Cachuelo, NO el precio del trabajador
export const SERVICE_FEE_MIN = 3;          // S/ mínimo de tarifa
export const SERVICE_FEE_MAX = 60;         // S/ tope de tarifa (trabajos grandes)
export const CONNECTION_FEE = 5;           // S/ tarifa de conexión en Pago directo (Acta N°2: S/5)
export const YAPE_MAX_AMOUNT = 500;        // límite de Yape vía Culqi por operación
export const AUTO_RELEASE_HOURS = 72;      // si el contratante no confirma ni reclama, se libera solo

const round2 = (n) => Math.round(n * 100) / 100;

export const serviceFee = (price) =>
  round2(Math.min(SERVICE_FEE_MAX, Math.max(SERVICE_FEE_MIN, Number(price) * SERVICE_FEE_RATE)));

/** Desglose de lo que paga el contratante y lo que recibe el trabajador. */
export const breakdown = (price, mode = 'protegido') => {
  const p = round2(Number(price) || 0);
  if (mode === 'directo') return { price: p, fee: CONNECTION_FEE, total: CONNECTION_FEE, workerGets: p, chargedNow: CONNECTION_FEE };
  const fee = serviceFee(p);
  return { price: p, fee, total: round2(p + fee), workerGets: p, chargedNow: round2(p + fee) };
};

/** Separa una tarifa con IGV incluido en valor de venta + IGV (para la boleta). */
export const splitIGV = (amountWithIGV) => {
  const base = round2(Number(amountWithIGV) / (1 + IGV_RATE));
  return { base, igv: round2(Number(amountWithIGV) - base) };
};

export const formatPEN = (n) =>
  'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const METHODS = [
  { id: 'tarjeta', label: 'Tarjeta', sub: 'Débito o crédito', color: '#2563EB' },
  { id: 'yape',    label: 'Yape',    sub: 'Celular + código', color: '#742284' },
  { id: 'plin',    label: 'Plin',    sub: 'QR interoperable', color: '#00A19A' },
];
