// ─── CALIFICAR A LA OTRA PARTE (reseña verificada, en ambos sentidos) ───────
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn } from '../../ui/primitives.jsx';
import Sheet from '../../ui/Sheet.jsx';

export const TAGS = {
  trabajador: ['Puntual', 'Buen trabajo', 'Cuidadoso', 'Comunicación clara', 'Recomendado', 'Creativo'],
  contratante: ['Pago rápido', 'Instrucciones claras', 'Buen trato', 'Lugar accesible', 'Recomendado'],
};
const LABELS = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

export default function RatingSheet({ open, onClose, onSubmit, targetName, rol = 'trabajador', jobTitle }) {
  const { C } = useTheme();
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) { setStars(0); setTags([]); setText(''); } }, [open]);
  const toggle = (t) => setTags(v => (v.includes(t) ? v.filter(x => x !== t) : [...v, t]));
  const tooShort = text.trim().length > 0 && text.trim().length < 10;
  const send = async () => { setBusy(true); try { await onSubmit({ estrellas: stars, comentario: text, tags }); } finally { setBusy(false); } };

  return (
    <Sheet open={open} onClose={onClose} title={`Califica a ${targetName}`} subtitle={`${rol === 'trabajador' ? 'Como trabajador' : 'Como contratante'} · ${jobTitle || ''}`} z={720}
      footer={<Btn onClick={send} disabled={!stars || tooShort || busy} style={{ width: '100%' }}>{busy ? 'Publicando…' : 'Publicar reseña'}</Btn>}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '6px 0 4px' }} role="radiogroup" aria-label="Estrellas">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} role="radio" aria-checked={stars === n} aria-label={`${n} estrella${n > 1 ? 's' : ''}`} onClick={() => setStars(n)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, transform: stars >= n ? 'scale(1.08)' : 'none', transition: 'transform .15s' }}>
            <Star size={38} color={C.warning} fill={stars >= n ? C.warning : 'transparent'} strokeWidth={1.8} />
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 800, color: stars ? C.text : C.textMuted, minHeight: 20, marginBottom: 14 }}>{stars ? LABELS[stars] : 'Toca las estrellas'}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.textSec, marginBottom: 8 }}>¿Qué destacarías?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
        {TAGS[rol].map(t => (
          <button key={t} onClick={() => toggle(t)} aria-pressed={tags.includes(t)} className="lg-chip lg-glass lg-glass--strong" style={{ minHeight: 36 }}>{t}</button>
        ))}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value.slice(0, 300))} rows={3} placeholder="Cuenta cómo te fue (opcional)" aria-label="Comentario"
        style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${tooShort ? C.danger : C.border}`, borderRadius: 14, padding: '12px 14px', fontSize: 16, color: C.text, background: C.card, resize: 'none', fontFamily: 'inherit', outline: 'none' }} />
      <div style={{ fontSize: 11.5, color: tooShort ? C.danger : C.textMuted, marginTop: 6, lineHeight: 1.45 }}>
        {tooShort ? 'Escribe al menos 10 caracteres o deja el comentario vacío.' : 'Las reseñas son públicas y solo se pueden dejar después de un cachuelo completado. No incluyas teléfonos ni direcciones.'}
      </div>
    </Sheet>
  );
}
