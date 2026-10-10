// ─── VERIFICACIÓN DE IDENTIDAD: almacenamiento ───────────────────────────────
// Qué se pide (decisión v0.17, ver docs/cambios/CAMBIOS_v0.17.md → "Verificación"):
//   1. DNI (anverso y reverso)
//   2. Selfie (para comparar con la foto del DNI)
//   3. Certificado Único Laboral (CUL, gratis en el MTPE). Ya incluye
//      antecedentes POLICIALES, PENALES y JUDICIALES. No pedimos el certificado
//      de antecedentes penales por separado: es redundante y la Ley 31944
//      prohíbe exigirlo a postulantes.
//
// MODO DEMO (por defecto): se guarda en este navegador (localStorage). Las
//   imágenes se guardan reducidas, solo para poder probar la revisión.
// MODO LIVE (VITE_VERIFICATION_MODE=live): archivos en el bucket PRIVADO
//   `verificaciones` de Supabase Storage y fila en la tabla `verificaciones`.
//   Solo el dueño y los administradores pueden verlos (RLS + políticas de Storage).
import { supabase } from '../../lib/supabase.js';

export const VERIFICATION_MODE = import.meta.env.VITE_VERIFICATION_MODE === 'live' ? 'live' : 'demo';
export const isDemoVerification = VERIFICATION_MODE === 'demo';

export const CUL_VALID_DAYS = 90;          // vigencia del CUL (MTPE)
export const MIN_AGE = 18;

const KEY = 'cachuelo_verif_demo_v1';
const EVT = 'cachuelo:verification';
const POLICY_VERSION = '2026-10-v1';      // versión de la política de privacidad aceptada

export const STATUS = {
  none:      { label: 'Sin verificar',  color: '#6B7280', icon: '○' },
  pendiente: { label: 'En revisión',    color: '#F59E0B', icon: '⏳' },
  observado: { label: 'Requiere cambios', color: '#EF4444', icon: '!' },
  aprobado:  { label: 'Verificado',     color: '#10B981', icon: '✓' },
  rechazado: { label: 'Rechazado',      color: '#EF4444', icon: '✕' },
};

const readAll = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { return {}; } };
const writeAll = (obj) => {
  try { localStorage.setItem(KEY, JSON.stringify(obj)); }
  catch { throw new Error('No hay espacio en este navegador para guardar las imágenes de prueba.'); }
  window.dispatchEvent(new CustomEvent(EVT));
};
export const onVerificationChange = (cb) => { window.addEventListener(EVT, cb); return () => window.removeEventListener(EVT, cb); };

/** Id a usar: el login simulado de Google no trae id, en demo usamos uno fijo. */
export const verifUserId = (user) => user?.id || (isDemoVerification ? 'demo-user' : null);

// ── Utilidades ────────────────────────────────────────────────────────────────
export const ageFrom = (isoDate) => {
  if (!isoDate) return null;
  const b = new Date(isoDate + 'T00:00:00'); const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  const m = n.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && n.getDate() < b.getDate())) a--;
  return a;
};
export const daysSince = (isoDate) => isoDate ? Math.floor((Date.now() - new Date(isoDate + 'T00:00:00').getTime()) / 86400e3) : null;
export const culIsValid = (emitido) => { const d = daysSince(emitido); return d != null && d >= 0 && d <= CUL_VALID_DAYS; };
export const dniIsValid = (dni) => /^\d{8}$/.test(dni || '');

/** Reduce una imagen a máx. `max` px (para demo y para subir más rápido con datos móviles). */
export function shrinkImage(file, max = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) { resolve(null); return; }
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => b ? resolve(b) : reject(new Error('No se pudo procesar la imagen')), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Archivo de imagen no válido')); };
    img.src = url;
  });
}
const blobToDataUrl = (blob) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });

/** Solo simulación: deja verificadas a las personas de prueba (y a ti, si lo pides). */
export function ensureDemoVerified(uid, nombres = '') {
  if (!isDemoVerification || !uid) return;
  const all = readAll();
  if (all[uid]?.estado === 'aprobado') return;
  const now = new Date().toISOString();
  all[uid] = { ...(all[uid] || {}), user_id: uid, nombres, dni: '00000000', estado: 'aprobado', motivo: null, enviado_at: all[uid]?.enviado_at || now, revisado_at: now, simulado: true };
  writeAll(all);
}

// ── Lecturas ──────────────────────────────────────────────────────────────────
export async function getVerification(userId) {
  if (!userId) return null;
  if (isDemoVerification) return readAll()[userId] || null;
  const { data } = await supabase.from('verificaciones').select('*').eq('user_id', userId).maybeSingle();
  return data || null;
}

/** Para el panel de revisión (solo admin en live). */
export async function listVerifications(estado = 'pendiente') {
  if (isDemoVerification) return Object.values(readAll()).filter(v => !estado || v.estado === estado)
    .sort((a, b) => (a.enviado_at || '').localeCompare(b.enviado_at || ''));
  const { data } = await supabase.from('verificaciones').select('*').eq('estado', estado).order('enviado_at');
  return data || [];
}

/** URL temporal para ver un archivo privado (live) o la imagen guardada (demo). */
export async function fileUrl(v, field) {
  if (isDemoVerification) return v?.[`${field}_data`] || null;
  const path = v?.[`${field}_path`];
  if (!path) return null;
  const { data } = await supabase.storage.from('verificaciones').createSignedUrl(path, 300); // 5 min
  return data?.signedUrl || null;
}

// Copia una foto APROBADA del bucket privado al bucket público `avatars`.
// Solo un admin puede leer el privado y escribir avatares ajenos (políticas v0.17).
async function publishAvatar(userId, privatePath) {
  const { data: blob, error } = await supabase.storage.from('verificaciones').download(privatePath);
  if (error) throw new Error(`No se pudo leer la foto (${error.message})`);
  const dest = `${userId}.jpg`;
  const { error: e2 } = await supabase.storage.from('avatars').upload(dest, blob, { upsert: true, contentType: 'image/jpeg' });
  if (e2) throw new Error(`No se pudo publicar la foto (${e2.message})`);
  const { data } = supabase.storage.from('avatars').getPublicUrl(dest);
  return `${data.publicUrl}?v=${Date.now()}`;  // evita caché de la foto anterior
}

// ── Escrituras ────────────────────────────────────────────────────────────────
/**
 * Envía la verificación. files: { dni_frente, dni_reverso, selfie, cul } (File/Blob)
 * data: { nombres, dni, fecha_nac, cul_numero, cul_emitido, consentimiento }
 */
export async function submitVerification(user, data, files) {
  const uid = verifUserId(user);
  if (!uid) throw new Error('Inicia sesión para verificar tu identidad.');
  if (!data.consentimiento) throw new Error('Debes aceptar el tratamiento de tus datos.');
  if (ageFrom(data.fecha_nac) < MIN_AGE) throw new Error('Cachuelo es solo para mayores de 18 años.');
  if (!dniIsValid(data.dni)) throw new Error('El DNI debe tener 8 dígitos.');
  if (!culIsValid(data.cul_emitido)) throw new Error(`El CUL debe tener menos de ${CUL_VALID_DAYS} días de emitido.`);

  const now = new Date().toISOString();
  const base = {
    user_id: uid, nombres: data.nombres.trim(), dni: data.dni, fecha_nac: data.fecha_nac,
    cul_numero: data.cul_numero.trim(), cul_emitido: data.cul_emitido,
    estado: 'pendiente', motivo: null, enviado_at: now, revisado_at: null,
    consentimiento_at: now, politica_version: POLICY_VERSION,
  };

  if (isDemoVerification) {
    const out = { ...base };
    for (const f of ['dni_frente', 'dni_reverso', 'selfie', 'cul']) {
      const blob = files[f]?.type?.startsWith('image/') ? await shrinkImage(files[f], 720, 0.7) : null;
      out[`${f}_data`] = blob ? await blobToDataUrl(blob) : null;
      out[`${f}_nombre`] = files[f]?.name || null;
    }
    const all = readAll(); all[uid] = out; writeAll(all);
    return out;
  }

  // LIVE: subir a bucket privado <uid>/<campo>-<timestamp>.<ext>
  const stamp = Date.now();
  const paths = {};
  for (const f of ['dni_frente', 'dni_reverso', 'selfie', 'cul']) {
    const file = files[f];
    if (!file) throw new Error('Falta un archivo.');
    const body = file.type?.startsWith('image/') ? (await shrinkImage(file)) : file;  // el CUL puede ser PDF
    const ext = file.type === 'application/pdf' ? 'pdf' : 'jpg';
    const path = `${uid}/${f}-${stamp}.${ext}`;
    const { error } = await supabase.storage.from('verificaciones').upload(path, body, { upsert: false, contentType: file.type === 'application/pdf' ? 'application/pdf' : 'image/jpeg' });
    if (error) throw new Error(`No se pudo subir el archivo (${error.message}).`);
    paths[`${f}_path`] = path;
  }
  const { data: row, error } = await supabase.from('verificaciones').upsert({ ...base, ...paths }, { onConflict: 'user_id' }).select().single();
  if (error) throw new Error(error.message);
  return row;
}

/** Decisión del administrador. En live pasa por la función SQL `revisar_verificacion` (valida rol admin). */
export async function reviewVerification(userId, estado, motivo = null) {
  if (!['aprobado', 'observado', 'rechazado'].includes(estado)) throw new Error('Estado inválido');
  if (isDemoVerification) {
    const all = readAll(); if (!all[userId]) throw new Error('No encontrada');
    all[userId] = { ...all[userId], estado, motivo, revisado_at: new Date().toISOString() };
    if (estado === 'aprobado') all[userId].avatar_aprobado = all[userId].selfie_data; // la selfie aprobada pasa a ser la foto de perfil
    writeAll(all); return all[userId];
  }
  let avatarUrl = null;
  if (estado === 'aprobado') {
    const { data: v } = await supabase.from('verificaciones').select('selfie_path').eq('user_id', userId).single();
    if (v?.selfie_path) avatarUrl = await publishAvatar(userId, v.selfie_path);
  }
  const { data, error } = await supabase.rpc('revisar_verificacion', { p_user_id: userId, p_estado: estado, p_motivo: motivo, p_avatar_url: avatarUrl });
  if (error) throw new Error(error.message);
  return data;
}

// ── Cambio de foto de perfil (siempre pasa por aprobación) ───────────────────
export async function submitAvatarChange(user, file) {
  const uid = verifUserId(user);
  const blob = await shrinkImage(file, 720, 0.8);
  if (!blob) throw new Error('Elige una imagen.');
  if (isDemoVerification) {
    const all = readAll();
    all[uid] = { ...(all[uid] || { user_id: uid, estado: 'none' }), avatar_pendiente: await blobToDataUrl(blob), avatar_enviado_at: new Date().toISOString() };
    writeAll(all); return all[uid];
  }
  const path = `${uid}/avatar-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from('verificaciones').upload(path, blob, { contentType: 'image/jpeg' });
  if (error) throw new Error(error.message);
  const { data, error: e2 } = await supabase.from('verificaciones')
    .update({ avatar_pendiente_path: path, avatar_enviado_at: new Date().toISOString() }).eq('user_id', uid).select().single();
  if (e2) throw new Error(e2.message);
  return data;
}

export async function reviewAvatar(userId, approve, motivo = null) {
  if (isDemoVerification) {
    const all = readAll(); const v = all[userId]; if (!v) throw new Error('No encontrada');
    all[userId] = approve
      ? { ...v, avatar_aprobado: v.avatar_pendiente, avatar_pendiente: null, avatar_motivo: null }
      : { ...v, avatar_pendiente: null, avatar_motivo: motivo };
    writeAll(all); return all[userId];
  }
  let avatarUrl = null;
  if (approve) {
    const { data: v } = await supabase.from('verificaciones').select('avatar_pendiente_path').eq('user_id', userId).single();
    if (v?.avatar_pendiente_path) avatarUrl = await publishAvatar(userId, v.avatar_pendiente_path);
  }
  const { data, error } = await supabase.rpc('revisar_avatar', { p_user_id: userId, p_aprobar: approve, p_motivo: motivo, p_avatar_url: avatarUrl });
  if (error) throw new Error(error.message);
  return data;
}

export async function listPendingAvatars() {
  if (isDemoVerification) return Object.values(readAll()).filter(v => v.avatar_pendiente);
  const { data } = await supabase.from('verificaciones').select('*').not('avatar_pendiente_path', 'is', null);
  return data || [];
}
