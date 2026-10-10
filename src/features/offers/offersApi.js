// ─── OFERTAS (postulación con precio propio, estilo "Make an offer") ────────
// Si aún no se corrió la migración v0.17 (columnas monto_ofertado / cumple_requisitos),
// se guarda igual: el precio propuesto se agrega al mensaje para no perderlo.
import { supabase } from '../../lib/supabase.js';
import { isDemoBackend, demoStore } from '../../lib/demoBackend.js';

const DEMO_KEY = 'cachuelo_demo_ofertas_v1';
export const hasDemoOffer = (cachueloId) => demoStore.read(DEMO_KEY).some(o => o.cachuelo_id === cachueloId);

const isMissingColumn = (err) => !!err && (err.code === 'PGRST204' || err.code === '42703' ||
  /column .* (does not exist|not find)|Could not find the '.*' column/i.test(err.message || ''));

export async function insertPostulacion({ cachuelo_id, postulante_id, mensaje, monto_ofertado, cumple_requisitos }) {
  const payload = { cachuelo_id, postulante_id, mensaje, estado: 'Pendiente', monto_ofertado, cumple_requisitos };
  if (isDemoBackend) {                       // sin servidor: guardar en el navegador
    const row = { ...payload, id: `demo-post-${Date.now()}`, created_at: new Date().toISOString() };
    demoStore.write(DEMO_KEY, [row, ...demoStore.read(DEMO_KEY)]);
    await new Promise(r => setTimeout(r, 500));
    return { data: row, error: null, demo: true };
  }
  let res = await supabase.from('postulaciones').insert(payload).select().single();
  if (isMissingColumn(res.error)) {
    console.warn('[Cachuelo] Faltan columnas de ofertas. Corre la migración v0.17.');
    const { monto_ofertado: m, cumple_requisitos: _c, ...rest } = payload;
    res = await supabase.from('postulaciones').insert({ ...rest, mensaje: `[Oferta: S/ ${m}] ${mensaje}` }).select().single();
  }
  return res;
}

/** Extrae el precio ofertado (columna nueva o el prefijo de respaldo en el mensaje). */
export const offerAmount = (p, fallback) => {
  if (p?.monto_ofertado != null) return Number(p.monto_ofertado);
  const m = /^\[Oferta: S\/ ([\d.]+)\]/.exec(p?.mensaje || '');
  return m ? Number(m[1]) : fallback;
};
export const cleanMessage = (msg = '') => msg.replace(/^\[Oferta: S\/ [\d.]+\]\s*/, '');
