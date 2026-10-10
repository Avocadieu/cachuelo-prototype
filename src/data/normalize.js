import { getCategoryById } from './categories.js';
// ─── NORMALIZACIÓN: fila de Supabase → objeto que usan las pantallas ─────────
// (antes vivía dentro de App y NotificationsScreen fallaba al usarla)
export const normalizeCachuelos = (data, profileMap = {}) => data.map(c => {
  const p = profileMap[c.user_id];
  const pubName = p ? `${p.nombre || ''} ${p.apellido || ''}`.trim() || p.email?.split('@')[0] || 'Usuario' : 'Usuario';
  const pubAvatar = p ? (`${p.nombre?.[0] || ''}${p.apellido?.[0] || ''}`).toUpperCase() || 'U' : 'U';
  return {
    id: c.id,
    title: c.titulo,
    servicio: c.servicio || '',
    createdAt: c.created_at || null,
    category: c.categorias?.label || getCategoryById(c.categoria_id)?.label || '',
    emoji: c.categorias?.emoji || getCategoryById(c.categoria_id)?.emoji || '💼',
    location: c.tipo === 'Remoto' ? 'Remoto' : (c.distrito || 'Lima'),
    district: c.distrito || '',
    departamento: c.departamento || null,
    ciudad: c.ciudad || null,
    lat: c.lat ?? null,
    lng: c.lng ?? null,
    payType: c.tipo_pago || 'Fijo',
    requisitos: Array.isArray(c.requisitos) ? c.requisitos : [],
    duration: c.duracion || '',
    price: Number(c.precio),
    type: c.tipo,
    featured: c.destacado,
    remote: c.tipo === 'Remoto',
    publisher: {
      name: pubName,
      rating: p?.rating || 0,
      verified: p?.dni_verificado || false,
      avatar: pubAvatar,
    },
    description: c.descripcion || '',
    schedule: c.horario || '',
    fecha_inicio: c.fecha_flexible ? 'flexible' : (c.fecha_inicio || ''),
    userId: c.user_id,
  };
});
