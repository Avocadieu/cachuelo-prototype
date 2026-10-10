// ─── PAGOS: almacenamiento ───────────────────────────────────────────────────
// MODO DEMO (por defecto): todo se guarda en este navegador (localStorage) y no
//   se mueve dinero real. Sirve para probar el flujo completo en la marcha blanca.
// MODO LIVE (VITE_PAYMENTS_MODE=live): el frontend NUNCA cambia el estado de un
//   pago. Llama a la Edge Function `payments` (supabase/functions/payments),
//   que habla con Culqi usando la llave secreta del servidor y escribe en la
//   tabla `pagos` con service_role. RLS impide que un usuario se marque "pagado".
import { supabase } from '../../lib/supabase.js';
import { AUTO_RELEASE_HOURS } from './pricing.js';

export const PAYMENTS_MODE = import.meta.env.VITE_PAYMENTS_MODE === 'live' ? 'live' : 'demo';
export const isDemoPayments = PAYMENTS_MODE === 'demo';

const KEY = 'cachuelo_pagos_demo_v1';
const EVT = 'cachuelo:payments';

const readAll = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const writeAll = (list) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* almacenamiento lleno o bloqueado */ }
  window.dispatchEvent(new CustomEvent(EVT));
};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const onPaymentsChange = (cb) => {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
};

// ── Lecturas ──────────────────────────────────────────────────────────────────
export async function getPaymentForPostulacion(postulacionId) {
  if (!postulacionId) return null;
  if (isDemoPayments) return readAll().find(p => p.postulacion_id === postulacionId) || null;
  const { data } = await supabase.from('pagos').select('*').eq('postulacion_id', postulacionId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  return data || null;
}

export async function listMyPayments(userId) {
  if (!userId) return [];
  if (isDemoPayments) return readAll().filter(p => p.pagador_id === userId || p.receptor_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const { data } = await supabase.from('pagos').select('*')
    .or(`pagador_id.eq.${userId},receptor_id.eq.${userId}`).order('created_at', { ascending: false });
  return data || [];
}

// ── Simulación de la pasarela (solo demo) ────────────────────────────────────
const luhn = (num) => {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
};
async function simulateGateway({ metodo, source }) {
  await sleep(1400);
  if (metodo === 'tarjeta') {
    const n = (source.number || '').replace(/\D/g, '');
    if (!luhn(n)) throw new Error('Número de tarjeta inválido.');
    if (n.endsWith('0002')) throw new Error('Tarjeta rechazada por el banco (simulación). Prueba otra.');
  }
  if (metodo === 'yape' && source.code === '000000') throw new Error('Código de aprobación vencido. Genera uno nuevo en Yape.');
  return { ref: `demo_${metodo}_${Date.now().toString(36)}` };
}

// ── Escrituras ────────────────────────────────────────────────────────────────
/**
 * Crea el cobro al aceptar un postulante.
 * input: { modo, metodo, source, amounts:{price,fee,total}, postulacion_id, cachuelo_id,
 *          cachuelo_titulo, pagador_id, receptor_id, receptor_nombre, email }
 * source (demo): datos del formulario. source (live): { tokenId } de Culqi.
 */
export async function createPayment(input) {
  if (!isDemoPayments) {
    const { data, error } = await supabase.functions.invoke('payments', {
      body: { action: 'create', ...input, source: { tokenId: input.source?.tokenId } },
    });
    if (error) throw new Error(error.message || 'No se pudo procesar el pago.');
    if (data?.error) throw new Error(data.error);
    return data.payment;
  }
  const { ref } = await simulateGateway(input);
  const now = new Date();
  const payment = {
    id: `pay_${now.getTime().toString(36)}`,
    postulacion_id: input.postulacion_id, cachuelo_id: input.cachuelo_id,
    cachuelo_titulo: input.cachuelo_titulo, pagador_id: input.pagador_id,
    receptor_id: input.receptor_id, receptor_nombre: input.receptor_nombre,
    modo: input.modo, metodo: input.metodo,
    monto_servicio: input.amounts.price, comision: input.amounts.fee, total: input.amounts.total,
    estado: input.modo === 'protegido' ? 'retenido' : 'conexion_pagada',
    proveedor: 'demo', proveedor_ref: ref,
    created_at: now.toISOString(),
    auto_release_at: input.modo === 'protegido'
      ? new Date(now.getTime() + AUTO_RELEASE_HOURS * 3600e3).toISOString() : null,
    released_at: null, disputa_motivo: null,
  };
  writeAll([payment, ...readAll()]);
  return payment;
}

async function updateDemo(id, patch) {
  await sleep(700);
  const list = readAll();
  const i = list.findIndex(p => p.id === id);
  if (i < 0) throw new Error('Pago no encontrado.');
  list[i] = { ...list[i], ...patch };
  writeAll(list);
  return list[i];
}

/** El contratante confirma que el trabajo terminó → se libera al trabajador. */
export async function releasePayment(id) {
  if (!isDemoPayments) {
    const { data, error } = await supabase.functions.invoke('payments', { body: { action: 'release', paymentId: id } });
    if (error || data?.error) throw new Error(error?.message || data.error);
    return data.payment;
  }
  return updateDemo(id, { estado: 'liberado', released_at: new Date().toISOString() });
}

/** Cualquiera de las partes reporta un problema → Operaciones revisa (Acta N°1: rol de Miki). */
export async function disputePayment(id, motivo) {
  if (!isDemoPayments) {
    const { data, error } = await supabase.functions.invoke('payments', { body: { action: 'dispute', paymentId: id, motivo } });
    if (error || data?.error) throw new Error(error?.message || data.error);
    return data.payment;
  }
  return updateDemo(id, { estado: 'en_disputa', disputa_motivo: motivo });
}

// ── Método de cobro del trabajador (dónde recibe su dinero) ──────────────────
const PAYOUT_KEY = 'cachuelo_cobro_demo_v1';
export async function getPayoutMethod(userId) {
  if (isDemoPayments) { try { return JSON.parse(localStorage.getItem(PAYOUT_KEY) || 'null')?.[userId] || null; } catch { return null; } }
  const { data } = await supabase.from('metodos_cobro').select('*').eq('user_id', userId).maybeSingle();
  return data || null;
}
export async function savePayoutMethod(userId, method) {
  if (isDemoPayments) {
    let all = {}; try { all = JSON.parse(localStorage.getItem(PAYOUT_KEY) || '{}') || {}; } catch { /* vacío */ }
    all[userId] = { ...method, user_id: userId };
    localStorage.setItem(PAYOUT_KEY, JSON.stringify(all));
    return all[userId];
  }
  const { data, error } = await supabase.from('metodos_cobro')
    .upsert({ user_id: userId, ...method }, { onConflict: 'user_id' }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export const STATUS_LABEL = {
  retenido: { label: 'Retenido', color: '#2563EB', icon: '🔒' },
  liberado: { label: 'Liberado', color: '#10B981', icon: '✅' },
  en_disputa: { label: 'En revisión', color: '#F59E0B', icon: '⚠️' },
  reembolsado: { label: 'Reembolsado', color: '#6B7280', icon: '↩️' },
  conexion_pagada: { label: 'Pago directo', color: '#8B5CF6', icon: '🤝' },
};
