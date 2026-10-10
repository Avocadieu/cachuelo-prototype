// ─── ESTADO DEL PAGO PROTEGIDO (dentro del chat) ─────────────────────────────
import { useState } from 'react';
import { ShieldCheck, Flag, Check } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn } from '../../ui/primitives.jsx';
import { haptic, toast } from '../../ui/toast.jsx';
import { formatPEN } from './pricing.js';
import { releasePayment, disputePayment, STATUS_LABEL } from './paymentStore.js';

const STEPS = ['Pagado', 'Retenido', 'Trabajo hecho', 'Liberado'];
const stepIndex = (estado) => ({ retenido: 1, en_disputa: 2, liberado: 3, reembolsado: 3 }[estado] ?? 0);

export default function PaymentStatusCard({ payment, isPublisher, onReleased }) {
  const { C } = useTheme();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [disputing, setDisputing] = useState(false);
  const [motivo, setMotivo] = useState('');
  if (!payment) return null;

  const st = STATUS_LABEL[payment.estado] || STATUS_LABEL.retenido;
  const idx = stepIndex(payment.estado);
  const name = payment.receptor_nombre || 'el trabajador';

  if (payment.modo === 'directo') {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 14, background: 'rgba(139,92,246,0.12)', fontSize: 12.5, color: C.textSec }}>
        🤝 <span>Acordaron <b>pago directo</b> ({formatPEN(payment.monto_servicio)}). Cachuelo no interviene en este pago.</span>
      </div>
    );
  }

  const release = async () => {
    setBusy(true);
    try { await releasePayment(payment.id); haptic(30); toast(`Liberamos ${formatPEN(payment.monto_servicio)} a ${name}`, 'success'); setConfirming(false); onReleased?.(); }
    catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  };
  const dispute = async () => {
    setBusy(true);
    try { await disputePayment(payment.id, motivo.trim()); toast('Reporte enviado. Te contactaremos por WhatsApp.', 'info'); setDisputing(false); }
    catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  };

  return (
    <div className="lg-glass lg-glass--strong" style={{ borderRadius: 20, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 34, height: 34, borderRadius: 11, background: st.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={18} color="#fff" /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--lg-ink-on-glass)' }}>Pago Protegido · {st.label}</div>
          <div className="lg-num" style={{ fontSize: 12, color: C.textMuted }}>{formatPEN(payment.monto_servicio)} para {isPublisher ? name : 'ti'}</div>
        </div>
      </div>

      {/* Línea de tiempo */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: i < STEPS.length - 1 ? 1 : 'none', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
              <span style={{ width: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i <= idx ? (payment.estado === 'en_disputa' && i === idx ? C.warning : C.success) : 'var(--c-card-el)',
                boxShadow: i <= idx ? 'inset 0 1px 0 rgba(255,255,255,0.4)' : 'inset 0 0 0 1.5px var(--c-bord)' }}>
                {i <= idx && <Check size={12} color="#fff" strokeWidth={3} />}
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: i <= idx ? C.text : C.textMuted, whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, margin: '0 2px 14px', background: i < idx ? C.success : 'var(--c-bord)', borderRadius: 1 }} />}
          </div>
        ))}
      </div>

      {payment.estado === 'retenido' && isPublisher && !confirming && !disputing && (
        <>
          <Btn onClick={() => setConfirming(true)} style={{ width: '100%', padding: '12px' }}>Confirmar trabajo terminado</Btn>
          <button onClick={() => setDisputing(true)} style={{ width: '100%', marginTop: 8, border: 'none', background: 'none', color: C.textMuted, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Flag size={13} /> Reportar un problema
          </button>
        </>
      )}
      {confirming && (
        <div className="lg-pop-in">
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5, marginBottom: 10 }}>¿Confirmas que <b>{name}</b> terminó el trabajo? Le liberaremos <b className="lg-num">{formatPEN(payment.monto_servicio)}</b>. Esta acción no se puede deshacer.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" onClick={() => setConfirming(false)} style={{ flex: 1, padding: 12 }}>Volver</Btn>
            <Btn onClick={release} disabled={busy} style={{ flex: 1.4, padding: 12 }}>{busy ? 'Liberando…' : 'Sí, liberar pago'}</Btn>
          </div>
        </div>
      )}
      {disputing && (
        <div className="lg-pop-in">
          <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={3} placeholder="Cuéntanos qué pasó (no se presentó, trabajo incompleto…)"
            style={{ width: '100%', boxSizing: 'border-box', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, padding: 12, fontSize: 16, fontFamily: 'inherit', resize: 'none', marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" onClick={() => setDisputing(false)} style={{ flex: 1, padding: 12 }}>Cancelar</Btn>
            <Btn variant="danger" onClick={dispute} disabled={busy || motivo.trim().length < 10} style={{ flex: 1.4, padding: 12 }}>Enviar reporte</Btn>
          </div>
        </div>
      )}
      {payment.estado === 'retenido' && !isPublisher && (
        <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.5 }}>💰 Tu pago está asegurado. Lo recibes cuando el contratante confirme, o automáticamente 72 h después si no hay reclamo.</div>
      )}
      {payment.estado === 'en_disputa' && <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.5 }}>⚠️ El equipo de Cachuelo está revisando este caso. El dinero sigue retenido hasta resolverlo.</div>}
      {payment.estado === 'liberado' && <div style={{ fontSize: 12.5, color: C.success, fontWeight: 700 }}>✅ Pago liberado {isPublisher ? `a ${name}` : 'a tu cuenta de cobro'}</div>}
    </div>
  );
}

/** Franja informativa para el detalle del cachuelo */
export const ProtectedBadge = () => {
  const { C } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '11px 13px', borderRadius: 16, background: C.successSoft, marginBottom: 14 }}>
      <ShieldCheck size={20} color={C.success} style={{ flexShrink: 0 }} />
      <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.45 }}>
        <b style={{ color: C.text }}>Pago Protegido disponible.</b> El contratante paga al aceptarte y el dinero se te entrega al terminar.
      </div>
    </div>
  );
};
