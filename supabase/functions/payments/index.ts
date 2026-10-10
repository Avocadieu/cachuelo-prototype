// ─── EDGE FUNCTION: payments ─────────────────────────────────────────────────
// Corre en el servidor de Supabase (Deno). Aquí SÍ vive la llave secreta de
// Culqi (CULQI_SECRET_KEY) y la service_role. NUNCA en el frontend.
//
// Deploy (Windows, CMD o Git Bash, con Supabase CLI):
//   supabase secrets set CULQI_SECRET_KEY=sk_test_xxx
//   supabase functions deploy payments
//
// Acciones: create | release | dispute
// ⚠ Antes de pasar a producción, verificar los campos exactos contra
//   https://apidocs.culqi.com (cargos y devoluciones) con tus llaves de prueba.
import { createClient } from 'npm:@supabase/supabase-js@2';

// Mismas reglas que src/features/payments/pricing.js (el servidor RECALCULA:
// nunca confía en montos que manda el navegador).
const SERVICE_FEE_RATE = 0.10, SERVICE_FEE_MIN = 3, SERVICE_FEE_MAX = 60;
const CONNECTION_FEE = 5, YAPE_MAX = 500, AUTO_RELEASE_HOURS = 72;
const round2 = (n: number) => Math.round(n * 100) / 100;
const fee = (p: number) => round2(Math.min(SERVICE_FEE_MAX, Math.max(SERVICE_FEE_MIN, p * SERVICE_FEE_RATE)));

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: { user } } = await admin.auth.getUser(jwt);
    if (!user) return json({ error: 'Sesión inválida' }, 401);

    const body = await req.json();

    // ── CREATE: cobrar al aceptar ──────────────────────────────────────────
    if (body.action === 'create') {
      const { postulacion_id, modo, metodo, source, email } = body;
      if (!['protegido', 'directo'].includes(modo) || !['tarjeta', 'yape', 'plin'].includes(metodo)) return json({ error: 'Datos inválidos' }, 400);

      const { data: post } = await admin.from('postulaciones').select('id, postulante_id, cachuelo_id, monto_ofertado').eq('id', postulacion_id).single();
      if (!post) return json({ error: 'Postulación no encontrada' }, 404);
      const { data: cach } = await admin.from('cachuelos').select('id, titulo, precio, user_id').eq('id', post.cachuelo_id).single();
      if (!cach || cach.user_id !== user.id) return json({ error: 'Solo quien publicó puede aceptar y pagar' }, 403);

      // v0.17: si el trabajador hizo una contraoferta, se cobra el precio ofertado
      const price = round2(Number(post.monto_ofertado ?? cach.precio));
      const comision = modo === 'protegido' ? fee(price) : CONNECTION_FEE;
      const total = modo === 'protegido' ? round2(price + comision) : CONNECTION_FEE;
      if (metodo === 'yape' && total > YAPE_MAX) return json({ error: `Yape permite hasta S/ ${YAPE_MAX}. Usa tarjeta o Plin.` }, 400);

      // Plin / QR: se crea una ORDEN y se confirma por webhook (pendiente de implementar).
      if (metodo === 'plin') return json({ error: 'Plin (QR) aún no está habilitado en producción.' }, 501);

      // Tarjeta (tkn_…) o Yape (ype_…): token generado en el navegador con CulqiJS / Culqi Checkout
      const charge = await fetch('https://api.culqi.com/v2/charges', {
        method: 'POST',
        headers: { Authorization: `Bearer ${Deno.env.get('CULQI_SECRET_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),          // en céntimos
          currency_code: 'PEN',
          email: email || user.email,
          source_id: source?.tokenId,
          description: `Cachuelo: ${String(cach.titulo).slice(0, 70)}`,
          metadata: { postulacion_id, modo, cachuelo_id: cach.id },
        }),
      }).then(r => r.json());
      if (!charge?.id || charge.object === 'error') {
        return json({ error: charge?.user_message || 'El pago fue rechazado.' }, 402);
      }

      const { data: { user: receptor } } = await admin.auth.admin.getUserById(post.postulante_id);
      const { data: payment, error } = await admin.from('pagos').insert({
        postulacion_id, cachuelo_id: cach.id, cachuelo_titulo: cach.titulo,
        pagador_id: user.id, receptor_id: post.postulante_id,
        receptor_nombre: receptor?.user_metadata?.nombre || null,
        modo, metodo, monto_servicio: price, comision, total,
        estado: modo === 'protegido' ? 'retenido' : 'conexion_pagada',
        proveedor: 'culqi', proveedor_ref: charge.id,
        auto_release_at: modo === 'protegido' ? new Date(Date.now() + AUTO_RELEASE_HOURS * 3600e3).toISOString() : null,
      }).select().single();
      if (error) return json({ error: 'Pago cobrado pero no registrado. Contacta a soporte.', ref: charge.id }, 500);
      return json({ payment });
    }

    // ── RELEASE: el contratante confirma ───────────────────────────────────
    if (body.action === 'release') {
      const { data: p } = await admin.from('pagos').select('*').eq('id', body.paymentId).single();
      if (!p || p.pagador_id !== user.id) return json({ error: 'No autorizado' }, 403);
      if (p.estado !== 'retenido') return json({ error: 'Este pago ya no está retenido' }, 409);
      const { data: payment } = await admin.from('pagos')
        .update({ estado: 'liberado', released_at: new Date().toISOString() }).eq('id', p.id).select().single();
      // La transferencia al trabajador (Yape/Plin/CCI de metodos_cobro) se hace en
      // lote desde la cuenta de la empresa y se registra en transferido_at.
      return json({ payment });
    }

    // ── DISPUTE: cualquiera de las partes ──────────────────────────────────
    if (body.action === 'dispute') {
      const { data: p } = await admin.from('pagos').select('*').eq('id', body.paymentId).single();
      if (!p || (p.pagador_id !== user.id && p.receptor_id !== user.id)) return json({ error: 'No autorizado' }, 403);
      if (p.estado !== 'retenido') return json({ error: 'Solo se puede reportar un pago retenido' }, 409);
      const { data: payment } = await admin.from('pagos')
        .update({ estado: 'en_disputa', disputa_motivo: String(body.motivo || '').slice(0, 500) }).eq('id', p.id).select().single();
      return json({ payment });
    }

    return json({ error: 'Acción no soportada' }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
