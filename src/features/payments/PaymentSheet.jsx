// ─── HOJA DE PAGO (al aceptar un postulante) ─────────────────────────────────
// Paso 1: modalidad (Pago Protegido / Pago directo)
// Paso 2: medio (Tarjeta / Yape / Plin)
// Paso 3: procesando → listo
//
// En producción los datos de tarjeta NO pasan por nuestro código: se usa
// Culqi Checkout/CulqiJS, que devuelve un token (tkn_… / ype_…) y ese token va a
// la Edge Function. Aquí, en MODO DEMO, el formulario es propio y simulado.
import { useMemo, useState } from 'react';
import { ShieldCheck, Handshake, CreditCard, Smartphone, QrCode, Lock, ChevronLeft, X, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn } from '../../ui/primitives.jsx';
import { haptic, toast } from '../../ui/toast.jsx';
import { breakdown, formatPEN, METHODS, YAPE_MAX_AMOUNT, CONNECTION_FEE, SERVICE_FEE_RATE, AUTO_RELEASE_HOURS } from './pricing.js';
import { createPayment, isDemoPayments } from './paymentStore.js';

// ── Utilidades de tarjeta ─────────────────────────────────────────────────────
const cardBrand = (n) => {
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^3(0[0-5]|[68])/.test(n)) return 'Diners';
  return '';
};
const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const fmtExp = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };
const expValid = (v) => {
  const [m, y] = v.split('/').map(Number);
  if (!m || m > 12 || y == null || Number.isNaN(y)) return false;
  const now = new Date(); const yy = now.getFullYear() % 100;
  return y > yy || (y === yy && m >= now.getMonth() + 1);
};

// QR decorativo (determinístico) para la simulación de Plin
const DemoQR = ({ seed = 'cachuelo', size = 150 }) => {
  const cells = 21; const s = size / cells;
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967295; };
  const finder = (x, y) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  const rects = [];
  for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) {
    let on;
    if (finder(x, y)) { const fx = x > 13 ? x - 14 : x, fy = y > 13 ? y - 14 : y; on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4); }
    else on = rnd() > 0.52;
    if (on) rects.push(<rect key={`${x}-${y}`} x={x * s} y={y * s} width={s} height={s} rx={s * 0.2} />);
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="#0D1B3E" aria-label="Código QR de pago">{rects}</svg>;
};

const Row = ({ label, value, strong, C }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: strong ? 15 : 13.5, fontWeight: strong ? 900 : 600, color: strong ? C.text : C.textSec, padding: '4px 0' }}>
    <span>{label}</span><span className="lg-num">{value}</span>
  </div>
);

export default function PaymentSheet({ open, onClose, onPaid, cachuelo, payee, payer, postulacionId, doneLabel = 'Ir al chat' }) {
  const { C } = useTheme();
  const [step, setStep] = useState('mode');          // mode | method | processing | done
  const [mode, setMode] = useState('protegido');
  const [method, setMethod] = useState('tarjeta');
  const [card, setCard] = useState({ number: '', exp: '', cvv: '', email: payer?.email || '' });
  const [yape, setYape] = useState({ phone: '', code: '' });
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const amounts = useMemo(() => breakdown(cachuelo?.price, mode), [cachuelo?.price, mode]);
  const yapeBlocked = amounts.chargedNow > YAPE_MAX_AMOUNT;
  const payeeName = payee?.nombre || 'el trabajador';
  if (!open) return null;

  const digits = card.number.replace(/\D/g, '');
  const brand = cardBrand(digits);
  const formOk =
    method === 'tarjeta' ? digits.length >= 15 && expValid(card.exp) && card.cvv.length >= 3 && /\S+@\S+\.\S+/.test(card.email)
    : method === 'yape' ? /^9\d{8}$/.test(yape.phone) && /^\d{6}$/.test(yape.code)
    : true;

  const pay = async () => {
    setError(''); setStep('processing'); haptic(15);
    try {
      const payment = await createPayment({
        modo: mode, metodo: method,
        source: method === 'tarjeta' ? { number: digits, exp: card.exp } : method === 'yape' ? yape : {},
        amounts: { price: amounts.price, fee: amounts.fee, total: amounts.chargedNow },
        postulacion_id: postulacionId, cachuelo_id: cachuelo?.id, cachuelo_titulo: cachuelo?.title,
        pagador_id: payer?.id, receptor_id: payee?.id, receptor_nombre: payeeName, email: card.email || payer?.email,
      });
      setResult(payment); setStep('done'); haptic(30);
    } catch (e) {
      setError(e.message || 'No se pudo completar el pago.'); setStep('method'); haptic(60);
    }
  };

  const finish = () => {
    onPaid?.(result);
    toast(mode === 'protegido' ? `${formatPEN(amounts.price)} protegidos para ${payeeName}` : 'Conexión confirmada', 'success');
    setStep('mode'); setResult(null);
  };

  const field = { width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, fontSize: 16, outline: 'none', fontFamily: 'inherit' };
  const lbl = { fontSize: 12.5, fontWeight: 700, color: C.textSec, margin: '0 0 6px', display: 'block' };

  return (
    <div className="lg-scrim" onClick={step === 'processing' ? undefined : onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 700, background: 'var(--lg-scrim)', display: 'flex', alignItems: 'flex-end' }}>
      <div className="lg-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Pago"
        style={{ width: '100%', maxHeight: '92%', overflowY: 'auto', background: 'var(--lg-fill-strong)', padding: '10px 18px 26px', boxSizing: 'border-box' }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--c-bord)', margin: '0 auto 12px' }} />

        {/* Cabecera */}
        {step !== 'done' && step !== 'processing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {step === 'method' && (
              <button onClick={() => setStep('mode')} aria-label="Atrás" style={{ width: 34, height: 34, borderRadius: 17, border: 'none', background: 'var(--c-card-el)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={18} color={C.textSec} />
              </button>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.text, letterSpacing: -0.3 }}>{step === 'mode' ? `Aceptar a ${payeeName}` : 'Medio de pago'}</div>
              <div style={{ fontSize: 12.5, color: C.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cachuelo?.title}</div>
            </div>
            <button onClick={onClose} aria-label="Cerrar" style={{ width: 34, height: 34, borderRadius: 17, border: 'none', background: 'var(--c-card-el)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={17} color={C.textSec} />
            </button>
          </div>
        )}

        {isDemoPayments && step !== 'done' && (
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B45309', background: 'rgba(245,158,11,0.15)', borderRadius: 10, padding: '7px 10px', marginBottom: 12 }}>
            MODO DEMO · no se cobra dinero real
          </div>
        )}

        {/* ── Paso 1: modalidad ── */}
        {step === 'mode' && (
          <>
            {[
              { id: 'protegido', Icon: ShieldCheck, title: 'Pago Protegido', tag: 'Recomendado', color: C.success,
                text: `Pagas ahora y lo guardamos. Se lo entregamos a ${payeeName} cuando confirmes que el trabajo terminó.`,
                perks: ['Si no se presenta, te devolvemos el dinero', 'Reseña verificada para ambos', `Tarifa de servicio ${Math.round(SERVICE_FEE_RATE * 100)}%`] },
              { id: 'directo', Icon: Handshake, title: 'Pago directo', tag: null, color: C.purple,
                text: `Le pagas a ${payeeName} por tu cuenta. Solo pagas la tarifa de conexión de ${formatPEN(CONNECTION_FEE)}.`,
                perks: ['Sin protección ni reembolso', 'Cachuelo no interviene en el pago'] },
            ].map(o => {
              const sel = mode === o.id;
              return (
                <button key={o.id} onClick={() => { setMode(o.id); haptic(); }} aria-pressed={sel}
                  style={{ width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer', marginBottom: 10, padding: 14, borderRadius: 20,
                    background: sel ? `${o.color}14` : C.card, border: `2px solid ${sel ? o.color : 'var(--lg-stroke)'}`,
                    boxShadow: sel ? `0 10px 24px -14px ${o.color}` : 'inset 0 1px 0 var(--lg-highlight)', transition: 'all .2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 12, background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.4)' }}><o.Icon size={19} color="#fff" /></span>
                    <span style={{ flex: 1, fontSize: 15.5, fontWeight: 900, color: C.text }}>{o.title}</span>
                    {o.tag && <span style={{ fontSize: 10.5, fontWeight: 800, color: '#fff', background: o.color, padding: '3px 8px', borderRadius: 10 }}>{o.tag}</span>}
                    <span style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${sel ? o.color : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {sel && <span style={{ width: 11, height: 11, borderRadius: 6, background: o.color }} />}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.45, marginBottom: 6 }}>{o.text}</div>
                  {o.perks.map(p => <div key={p} style={{ fontSize: 12, color: C.textMuted, display: 'flex', gap: 6 }}><span style={{ color: o.color }}>•</span>{p}</div>)}
                </button>
              );
            })}

            <div style={{ background: C.card, borderRadius: 16, padding: '10px 14px', margin: '4px 0 14px', boxShadow: 'inset 0 0 0 1px var(--c-bord)' }}>
              {mode === 'protegido' ? (
                <>
                  <Row C={C} label="Precio pactado" value={formatPEN(amounts.price)} />
                  <Row C={C} label="Tarifa de servicio (incl. IGV)" value={formatPEN(amounts.fee)} />
                  <div style={{ borderTop: `1px dashed ${C.border}`, margin: '6px 0' }} />
                  <Row C={C} strong label="Pagas hoy" value={formatPEN(amounts.chargedNow)} />
                  <div style={{ fontSize: 11.5, color: C.success, fontWeight: 700, marginTop: 4 }}>{payeeName} recibe el 100%: {formatPEN(amounts.workerGets)}</div>
                </>
              ) : (
                <>
                  <Row C={C} label="Tarifa de conexión (incl. IGV)" value={formatPEN(amounts.fee)} />
                  <Row C={C} label={`Pagas a ${payeeName} por fuera`} value={formatPEN(amounts.price)} />
                  <div style={{ borderTop: `1px dashed ${C.border}`, margin: '6px 0' }} />
                  <Row C={C} strong label="Pagas hoy en la app" value={formatPEN(amounts.chargedNow)} />
                </>
              )}
            </div>
            <Btn onClick={() => setStep('method')} style={{ width: '100%' }}>Continuar · {formatPEN(amounts.chargedNow)}</Btn>
          </>
        )}

        {/* ── Paso 2: medio de pago ── */}
        {step === 'method' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
              {METHODS.map(m => {
                const disabled = m.id === 'yape' && yapeBlocked;
                const sel = method === m.id;
                const Icon = m.id === 'tarjeta' ? CreditCard : m.id === 'yape' ? Smartphone : QrCode;
                return (
                  <button key={m.id} disabled={disabled} onClick={() => { setMethod(m.id); setError(''); haptic(); }} aria-pressed={sel}
                    style={{ padding: '12px 6px', borderRadius: 16, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, fontFamily: 'inherit',
                      background: sel ? `${m.color}16` : C.card, border: `2px solid ${sel ? m.color : 'var(--lg-stroke)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 34, height: 34, borderRadius: 11, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} color="#fff" /></span>
                    <span style={{ fontSize: 13.5, fontWeight: 900, color: C.text }}>{m.label}</span>
                    <span style={{ fontSize: 10.5, color: C.textMuted }}>{disabled ? `Máx. ${formatPEN(YAPE_MAX_AMOUNT)}` : m.sub}</span>
                  </button>
                );
              })}
            </div>

            {method === 'tarjeta' && (
              <div className="lg-pop-in">
                <label style={lbl}>Número de tarjeta</label>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <input inputMode="numeric" autoComplete="cc-number" placeholder="4111 1111 1111 1111" value={card.number}
                    onChange={e => setCard({ ...card, number: fmtCard(e.target.value) })} style={{ ...field, paddingRight: 92, letterSpacing: 1 }} />
                  {brand && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 900, color: C.headerBg }}>{brand}</span>}
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={lbl}>Vence (MM/AA)</label>
                    <input inputMode="numeric" autoComplete="cc-exp" placeholder="08/28" value={card.exp} onChange={e => setCard({ ...card, exp: fmtExp(e.target.value) })}
                      style={{ ...field, borderColor: card.exp.length === 5 && !expValid(card.exp) ? C.danger : C.border }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={lbl}>CVV</label>
                    <input inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} style={field} />
                  </div>
                </div>
                <label style={lbl}>Correo (para tu comprobante)</label>
                <input type="email" autoComplete="email" placeholder="tucorreo@gmail.com" value={card.email} onChange={e => setCard({ ...card, email: e.target.value })} style={{ ...field, marginBottom: 10 }} />
                {isDemoPayments && <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 6 }}>Prueba: 4111 1111 1111 1111 (aprobada) · 4000 0000 0000 0002 (rechazada)</div>}
              </div>
            )}

            {method === 'yape' && (
              <div className="lg-pop-in">
                <div style={{ background: 'rgba(116,34,132,0.10)', borderRadius: 14, padding: '10px 12px', fontSize: 12.5, color: C.textSec, lineHeight: 1.5, marginBottom: 12 }}>
                  Abre <b>Yape</b> → menú ☰ → <b>Código de aprobación</b>. Cópialo aquí; vence en 2 minutos.
                </div>
                <label style={lbl}>Celular de tu Yape</label>
                <input inputMode="numeric" placeholder="9XX XXX XXX" value={yape.phone} onChange={e => setYape({ ...yape, phone: e.target.value.replace(/\D/g, '').slice(0, 9) })} style={{ ...field, marginBottom: 12 }} />
                <label style={lbl}>Código de aprobación (6 dígitos)</label>
                <input inputMode="numeric" placeholder="••••••" value={yape.code} onChange={e => setYape({ ...yape, code: e.target.value.replace(/\D/g, '').slice(0, 6) })} style={{ ...field, letterSpacing: 6, textAlign: 'center', fontSize: 20, marginBottom: 10 }} />
              </div>
            )}

            {method === 'plin' && (
              <div className="lg-pop-in" style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', background: '#fff', padding: 12, borderRadius: 18, boxShadow: '0 8px 24px -12px rgba(13,27,62,0.5)', marginBottom: 10 }}>
                  <DemoQR seed={`${postulacionId}-${amounts.chargedNow}`} />
                </div>
                <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5, marginBottom: 10 }}>
                  Escanea con <b>Plin</b>, <b>Yape</b> o tu banca móvil (QR interoperable).<br />Monto exacto: <b className="lg-num">{formatPEN(amounts.chargedNow)}</b>
                </div>
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5, color: C.danger, background: C.dangerSoft, borderRadius: 12, padding: '10px 12px', marginBottom: 10 }}>
                <AlertTriangle size={15} /> {error}
              </div>
            )}

            <Btn onClick={pay} disabled={!formOk} style={{ width: '100%', marginTop: 4 }}>
              <Lock size={16} /> {method === 'plin' ? 'Ya pagué' : `Pagar ${formatPEN(amounts.chargedNow)}`}
            </Btn>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: C.textMuted, marginTop: 10 }}>
              <Lock size={11} /> Pago procesado por pasarela certificada. Cachuelo no guarda tu tarjeta.
            </div>
          </>
        )}

        {/* ── Procesando ── */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '40px 0 30px' }}>
            <div className="spinner" style={{ width: 46, height: 46, border: `4px solid ${C.primary}33`, borderTopColor: C.primary, borderRadius: '50%', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Procesando pago…</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 4 }}>No cierres esta ventana</div>
          </div>
        )}

        {/* ── Listo ── */}
        {step === 'done' && result && (
          <div className="lg-pop-in" style={{ textAlign: 'center', padding: '14px 0 4px' }}>
            <div style={{ width: 74, height: 74, borderRadius: 37, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(145deg, #34D399, ${C.success})`, boxShadow: `inset 0 2px 0 rgba(255,255,255,0.45), 0 14px 30px -12px ${C.success}` }}>
              <Check size={38} color="#fff" strokeWidth={3} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.text, letterSpacing: -0.3 }}>
              {mode === 'protegido' ? '¡Pago protegido!' : '¡Conexión confirmada!'}
            </div>
            <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.55, margin: '8px 6px 16px' }}>
              {mode === 'protegido'
                ? <>Guardamos <b className="lg-num">{formatPEN(amounts.price)}</b> para {payeeName}. Se liberan cuando confirmes que el trabajo terminó, o solos {AUTO_RELEASE_HOURS} h después si no hay reclamo.</>
                : <>Ya puedes coordinar el pago de <b className="lg-num">{formatPEN(amounts.price)}</b> directamente con {payeeName}.</>}
            </div>
            <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 16 }}>Operación {result.proveedor_ref}</div>
            <Btn onClick={finish} style={{ width: '100%' }}>{doneLabel}</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
