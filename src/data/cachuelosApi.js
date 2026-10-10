// ─── ESCRITURA DE CACHUELOS (con tolerancia a migración pendiente) ───────────
// Si todavía no se corrió supabase/migrations/2026-10-01_v0.15_mapa.sql,
// Supabase responde "column not found". En ese caso reintentamos SIN los campos
// de ubicación para no romper la publicación, y avisamos con geoSkipped=true.
import { supabase } from '../lib/supabase.js';
import { roundForPrivacy, fuzzPoint, ZONE_FUZZ_MAX_M } from './geo.js';
import { isDemoBackend, demoStore } from '../lib/demoBackend.js';
import { CATEGORIES } from './categories.js';

const DEMO_KEY = 'cachuelo_demo_cachuelos_v1';
export const DEMO_EVENT = 'cachuelo:demo-cachuelos';
/** Cachuelos publicados en modo demo (ya en el formato que usan las pantallas). */
export const readDemoCachuelos = () => demoStore.read(DEMO_KEY);

const GEO_FIELDS = ['departamento', 'ciudad', 'lat', 'lng', 'servicio'];  // + servicio (v0.18)

const isMissingColumn = (err) =>
  !!err && (err.code === 'PGRST204' || err.code === '42703' ||
    /column .* (does not exist|not find)|Could not find the '.*' column/i.test(err.message || ''));

const stripGeo = (payload) => {
  const copy = { ...payload };
  GEO_FIELDS.forEach(k => delete copy[k]);
  return copy;
};

/** Convierte el estado de LocationFields en columnas de la tabla cachuelos */
export const geoToColumns = (loc, tipo) => {
  if (tipo === 'Remoto' || !loc) return { departamento: null, ciudad: null, lat: null, lng: null };
  const hasPin = Number.isFinite(loc.lat) && Number.isFinite(loc.lng);
  return {
    departamento: loc.departamento || null,
    ciudad: loc.departamento && loc.departamento !== 'Lima' ? (loc.district || null) : null,
    lat: hasPin ? roundForPrivacy(loc.lat) : null,
    lng: hasPin ? roundForPrivacy(loc.lng) : null,
  };
};

export async function insertCachuelo(payload, author = {}) {
  if (isDemoBackend) {
    const cat = CATEGORIES.find(c => c.id === payload.categoria_id);
    const pos = payload.lat != null ? fuzzPoint(payload.lat, payload.lng, ZONE_FUZZ_MAX_M) : { lat: null, lng: null };
    const name = [author.nombre, author.apellido].filter(Boolean).join(' ') || 'Tú';
    const c = {
      id: `demo-${Date.now()}`, title: payload.titulo, servicio: payload.servicio || '', category: cat?.label || '', emoji: cat?.emoji || '💼', createdAt: new Date().toISOString(),
      location: payload.tipo === 'Remoto' ? 'Remoto' : (payload.distrito || 'Lima'), district: payload.distrito || '',
      departamento: payload.departamento || null, ciudad: payload.ciudad || null, lat: pos.lat, lng: pos.lng,
      payType: payload.tipo_pago, requisitos: payload.requisitos || [], duration: payload.duracion || '',
      price: Number(payload.precio), type: payload.tipo, featured: !!payload.destacado, remote: payload.tipo === 'Remoto',
      publisher: { name: `${name} (demo)`, rating: 0, verified: true, avatar: (name[0] || 'T').toUpperCase() },
      description: payload.descripcion || '', schedule: '', fecha_inicio: payload.fecha_flexible ? 'flexible' : (payload.fecha_inicio || ''),
      userId: payload.user_id || 'demo-user', demo: true,
    };
    demoStore.write(DEMO_KEY, [c, ...readDemoCachuelos()]);
    window.dispatchEvent(new CustomEvent(DEMO_EVENT));
    await new Promise(r => setTimeout(r, 500));
    return { error: null, geoSkipped: false, demo: true };
  }
  let { error } = await supabase.from('cachuelos').insert(payload);
  if (isMissingColumn(error)) {
    console.warn('[Cachuelo] Faltan columnas (migraciones v0.15 / v0.18). Guardando sin ubicación ni servicio.');
    ({ error } = await supabase.from('cachuelos').insert(stripGeo(payload)));
    return { error, geoSkipped: !error };
  }
  return { error, geoSkipped: false };
}

export async function updateCachuelo(id, payload) {
  let { error } = await supabase.from('cachuelos').update(payload).eq('id', id);
  if (isMissingColumn(error)) {
    console.warn('[Cachuelo] Columnas de mapa no encontradas. Corre la migración v0.15. Guardando sin ubicación.');
    ({ error } = await supabase.from('cachuelos').update(stripGeo(payload)).eq('id', id));
    return { error, geoSkipped: !error };
  }
  return { error, geoSkipped: false };
}
