// ─── MIS COBROS Y PAGOS ──────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Banknote, Smartphone } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Screen, Btn } from '../../ui/primitives.jsx';
import { toast } from '../../ui/toast.jsx';
import { formatPEN } from './pricing.js';
import PaymentSheet from './PaymentSheet.jsx';
import PaymentStatusCard from './PaymentStatusCard.jsx';
import { listMyPayments, onPaymentsChange, getPayoutMethod, savePayoutMethod, STATUS_LABEL, isDemoPayments } from './paymentStore.js';

export default function WalletScreen({ user, onBack, onNavigate }) {
  const { C } = useTheme();
  // El login simulado de Google no trae id: en demo usamos uno de prueba
  const uid = user?.id || (isDemoPayments ? 'demo-user' : null);
  const [items, setItems] = useState([]);
  const [payout, setPayout] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ tipo: 'yape', valor: '', titular: '' });
  // Simulación (solo modo demo): recorrer el flujo sin chat ni base de datos
  const [sim, setSim] = useState({ open: false, postulacionId: null });
  const simPayment = items.find(p => p.postulacion_id === sim.postulacionId) || null;

  useEffect(() => {
    const load = () => listMyPayments(uid).then(setItems);
    load(); getPayoutMethod(uid).then(p => { setPayout(p); if (p) setForm(p); });
    return onPaymentsChange(load);
  }, [uid]);

  const mine = (p) => p.receptor_id === uid;
  const porCobrar = items.filter(p => mine(p) && ['retenido', 'en_disputa'].includes(p.estado)).reduce((a, p) => a + p.monto_servicio, 0);
  const cobrado = items.filter(p => mine(p) && p.estado === 'liberado').reduce((a, p) => a + p.monto_servicio, 0);
  const pagado = items.filter(p => p.pagador_id === uid).reduce((a, p) => a + p.total, 0);

  const valid = form.tipo === 'cci' ? /^\d{20}$/.test(form.valor) : /^9\d{8}$/.test(form.valor);
  const save = async () => {
    try { const p = await savePayoutMethod(uid, form); setPayout(p); setEditing(false); toast('Método de cobro guardado', 'success'); }
    catch (e) { toast(e.message, 'error'); }
  };

  const field = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, fontSize: 16, outline: 'none', fontFamily: 'inherit', marginBottom: 10 };

  return (
    <Screen withTabs activeTab="profile" onNavigate={onNavigate}>
      <div className="lg-header" style={{ padding: '48px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} aria-label="Volver" style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={19} color="#fff" /></button>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>Mis cobros y pagos</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['Por cobrar', porCobrar, '🔒'], ['Cobrado', cobrado, '✅']].map(([l, v, i]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 18, padding: '12px 14px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700 }}>{i} {l}</div>
              <div className="lg-num" style={{ color: '#fff', fontSize: 21, fontWeight: 900, marginTop: 2 }}>{formatPEN(v)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {isDemoPayments && <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B45309', background: 'rgba(245,158,11,0.15)', borderRadius: 10, padding: '7px 10px', marginBottom: 12 }}>MODO DEMO · montos de prueba guardados en este dispositivo</div>}

        {/* Método de cobro */}
        <div style={{ background: C.card, borderRadius: 20, padding: 14, border: '1px solid var(--lg-stroke)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: editing || !payout ? 12 : 0 }}>
            <span style={{ width: 36, height: 36, borderRadius: 12, background: C.infoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{payout?.tipo === 'cci' ? <Banknote size={18} color={C.headerBg} /> : <Smartphone size={18} color={C.headerBg} />}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>¿Dónde recibes tu dinero?</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{payout ? `${payout.tipo.toUpperCase()} · ${payout.tipo === 'cci' ? '•••• ' + payout.valor.slice(-4) : payout.valor.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}` : 'Agrega Yape, Plin o cuenta bancaria (CCI)'}</div>
            </div>
            {payout && !editing && <button onClick={() => setEditing(true)} style={{ border: 'none', background: 'none', color: C.primary, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>Cambiar</button>}
          </div>
          {(editing || !payout) && (
            <div className="lg-pop-in">
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {[['yape', 'Yape'], ['plin', 'Plin'], ['cci', 'Banco (CCI)']].map(([id, l]) => (
                  <button key={id} onClick={() => setForm({ ...form, tipo: id, valor: '' })} className="lg-chip lg-glass" aria-pressed={form.tipo === id} style={{ flex: 1, justifyContent: 'center' }}>{l}</button>
                ))}
              </div>
              <input inputMode="numeric" placeholder={form.tipo === 'cci' ? 'CCI (20 dígitos)' : 'Celular 9XX XXX XXX'} value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value.replace(/\D/g, '').slice(0, form.tipo === 'cci' ? 20 : 9) })} style={field} />
              <input placeholder="Nombre del titular" value={form.titular} onChange={e => setForm({ ...form, titular: e.target.value })} style={field} />
              <Btn onClick={save} disabled={!valid || form.titular.trim().length < 3} style={{ width: '100%', padding: 12 }}>Guardar</Btn>
            </div>
          )}
        </div>

        {isDemoPayments && (
          <div style={{ background: C.card, borderRadius: 20, padding: 14, border: '1px dashed var(--c-bord)', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 4 }}>🧪 Probar el flujo de pago</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 10, lineHeight: 1.45 }}>Simula que aceptas a un postulante en “Pintar sala y comedor” (S/ 180) y luego confirmas el trabajo.</div>
            {!simPayment
              ? <Btn onClick={() => setSim({ open: true, postulacionId: `demo-post-${Date.now()}` })} style={{ width: '100%', padding: 12 }}>Simular aceptación</Btn>
              : <PaymentStatusCard payment={simPayment} isPublisher onReleased={() => toast('En la app real aquí se abre la reseña', 'info')} />}
          </div>
        )}

        <div style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 10 }}>Movimientos</div>
        {items.length === 0 && <div style={{ textAlign: 'center', color: C.textMuted, fontSize: 13, padding: '30px 0' }}>Aún no tienes movimientos.<br />Aparecerán cuando aceptes o te acepten en un cachuelo.</div>}
        {items.map(p => {
          const incoming = mine(p);
          const st = STATUS_LABEL[p.estado] || STATUS_LABEL.retenido;
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.card, borderRadius: 16, padding: 12, marginBottom: 8, border: '1px solid var(--lg-stroke)' }}>
              <span style={{ width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: incoming ? C.successSoft : C.infoSoft }}>
                {incoming ? <ArrowDownLeft size={18} color={C.success} /> : <ArrowUpRight size={18} color={C.headerBg} />}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.cachuelo_titulo || 'Cachuelo'}</div>
                <div style={{ fontSize: 11.5, color: C.textMuted }}>{new Date(p.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} · {p.metodo} · <span style={{ color: st.color, fontWeight: 700 }}>{st.icon} {st.label}</span></div>
              </div>
              <div className="lg-num" style={{ fontSize: 14, fontWeight: 900, color: incoming ? C.success : C.text }}>{incoming ? '+' : '−'}{formatPEN(incoming ? p.monto_servicio : p.total)}</div>
            </div>
          );
        })}
        {pagado > 0 && <div style={{ textAlign: 'center', fontSize: 12, color: C.textMuted, marginTop: 8 }}>Total pagado como contratante: <b className="lg-num">{formatPEN(pagado)}</b></div>}
      </div>
      <PaymentSheet
        open={sim.open}
        onClose={() => setSim(s => ({ ...s, open: false }))}
        cachuelo={{ id: 'demo-cachuelo', title: 'Pintar sala y comedor', price: 180 }}
        payee={{ id: 'demo-worker', nombre: 'Carlos R.' }}
        payer={{ ...user, id: uid }}
        postulacionId={sim.postulacionId}
        onPaid={() => setSim(s => ({ ...s, open: false }))}
      />
    </Screen>
  );
}
