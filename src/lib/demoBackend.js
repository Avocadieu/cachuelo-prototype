// ─── MODO DEMO SIN SUPABASE ──────────────────────────────────────────────────
// Si el .env tiene la URL de ejemplo (o ninguna), no hay servidor real: las
// acciones que escriben datos (ofertas, publicar) se guardan en este navegador
// para poder probar los flujos en Netlify sin errores "Failed to fetch".
// VITE_DEMO_MODE=true fuerza este modo aunque haya un Supabase real (el login
// sigue usando Supabase Auth; perfiles, feed y Mis cachuelos usan el mundo simulado).
const url = import.meta.env.VITE_SUPABASE_URL || '';
const forced = import.meta.env.VITE_DEMO_MODE === 'true';
export const isDemoBackend = forced || !url || /TU-PROYECTO|demo\.supabase|example\.supabase|\/\/x\.supabase/i.test(url);

/** Convierte errores técnicos en mensajes entendibles. */
export const friendlyError = (err) => {
  const m = err?.message || String(err || '');
  if (/Failed to fetch|NetworkError|Load failed|ERR_NAME|fetch/i.test(m)) return 'Sin conexión con el servidor. Revisa tu internet e inténtalo de nuevo.';
  if (/row-level security|permission denied/i.test(m)) return 'No tienes permiso para esta acción. ¿Ya verificaste tu identidad?';
  if (/duplicate key|already exists|unique/i.test(m)) return 'Ya enviaste esto antes.';
  return m || 'Ocurrió un error. Inténtalo de nuevo.';
};

const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || '[]') || []; } catch { return []; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin espacio */ } };
export const demoStore = { read, write };
