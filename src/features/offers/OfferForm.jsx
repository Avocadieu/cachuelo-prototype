// ─── FORMULARIO DE OFERTA (en el detalle del cachuelo) ──────────────────────
// El trabajador acepta el precio publicado o propone otro, y SIEMPRE deja un
// comentario (qué incluye su precio, cuándo puede, experiencia).
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn } from '../../ui/primitives.jsx';
import { haptic } from '../../ui/toast.jsx';
import { PRICE_MIN, formatPEN } from '../payments/pricing.js';
import { shieldContact } from '../payments/contactShield.js';
import { SAFETY_CHECK_APPLY } from '../compliance/legal.js';

const MIN_COMMENT = 20;

export default function OfferForm({ cachuelo, requisitos = [], risky, onSubmit, submitting, applied }) {
  const { C } = useTheme();
  const [mode, setMode] = useState('same');          // same | other
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [reqOk, setReqOk] = useState(false);
  const [safetyOk, setSafetyOk] = useState(false);

  const price = Number(cachuelo?.price || 0);
  const offer = mode === 'same' ? price : Number(amount || 0);
  const diff = offer - price;
  const shielded = shieldContact(comment);
  const valid = offer >= PRICE_MIN && comment.trim().length >= MIN_COMMENT
    && (requisitos.length === 0 || reqOk) && (!risky || safetyOk);

  if (applied) {
    return (
      <div style={{ textAlign: 'center', padding: '6px 0' }}>
        <CheckCircle size={30} color={C.success} />
        <div style={{ fontSize: 15, fontWeight: 900, color: C.text, marginTop: 6 }}>¡Oferta enviada!</div>
        <div style={{ fontSize: 12.5, color: C.textSec, marginTop: 4 }}>Te avisaremos cuando el contratante la vea o te acepte.</div>
      </div>
    );
  }

  const field = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, fontSize: 16, outline: 'none', fontFamily: 'inherit' };
  const opt = (id, title, sub) => (
    <button onClick={() => { setMode(id); haptic(); }} aria-pressed={mode === id}
      style={{ flex: 1, padding: '11px 10px', borderRadius: 16, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        background: mode === id ? `${C.primary}14` : C.card, border: `2px solid ${mode === id ? C.primary : 'var(--lg-stroke)'}` }}>
      <div style={{ fontSize: 13.5, fontWeight: 900, color: C.text }}>{title}</div>
      <div className="lg-num" style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>{sub}</div>
    </button>
  );

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 900, color: C.text, marginBottom: 10 }}>Haz tu oferta</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {opt('same', 'Acepto el precio', formatPEN(price))}
        {opt('other', 'Propongo otro', 'Contraoferta')}
      </div>
      {mode === 'other' && (
        <div className="lg-pop-in" style={{ marginBottom: 10 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: C.textSec }}>S/</span>
            <input inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, '').slice(0, 7))} placeholder={String(price)} aria-label="Tu precio"
              style={{ ...field, paddingLeft: 40, fontSize: 20, fontWeight: 900 }} />
          </div>
          {amount && (
            <div style={{ fontSize: 12, marginTop: 6, color: offer < PRICE_MIN ? C.danger : diff > 0 ? C.warning : C.success, fontWeight: 700 }}>
              {offer < PRICE_MIN ? `El mínimo es ${formatPEN(PRICE_MIN)}` : diff === 0 ? 'Igual al precio publicado'
                : `${diff > 0 ? '+' : '−'}${formatPEN(Math.abs(diff))} respecto al precio publicado`}
            </div>
          )}
        </div>
      )}
      <textarea value={comment} onChange={e => setComment(e.target.value.slice(0, 600))} rows={4}
        placeholder={mode === 'other' ? 'Explica tu precio: qué incluye (materiales, movilidad), cuándo puedes y tu experiencia.' : 'Cuéntale por qué eres ideal: experiencia, cuándo puedes empezar, qué incluye.'}
        aria-label="Comentario de tu oferta" style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.textMuted, margin: '4px 2px 8px' }}>
        <span>{comment.trim().length < MIN_COMMENT ? `Mínimo ${MIN_COMMENT} caracteres` : '✓'}</span><span>{comment.length}/600</span>
      </div>
      {shielded.flagged && <div style={{ fontSize: 12, color: C.warning, background: 'rgba(245,158,11,0.12)', borderRadius: 12, padding: '8px 10px', marginBottom: 8 }}>🔒 Ocultaremos teléfonos o correos: el contacto se comparte al aceptar la oferta.</div>}

      {requisitos.length > 0 && (
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 14, background: C.infoSoft, marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={reqOk} onChange={e => setReqOk(e.target.checked)} style={{ width: 19, height: 19, accentColor: C.primary, flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.45 }}>Cumplo con los requisitos indicados y mostraré los documentos si me los piden.</span>
        </label>
      )}
      {risky && (
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 14, background: 'rgba(245,158,11,0.12)', marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={safetyOk} onChange={e => setSafetyOk(e.target.checked)} style={{ width: 19, height: 19, accentColor: C.warning, flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.45 }}>{SAFETY_CHECK_APPLY}</span>
        </label>
      )}

      <Btn onClick={() => onSubmit({ monto: offer, mensaje: shielded.text.trim(), cumpleRequisitos: requisitos.length ? reqOk : null })}
        disabled={!valid || submitting} style={{ width: '100%', marginTop: 4 }}>
        {submitting ? 'Enviando…' : <><Send size={17} /> Enviar oferta · {formatPEN(offer || 0)}</>}
      </Btn>
    </div>
  );
}
