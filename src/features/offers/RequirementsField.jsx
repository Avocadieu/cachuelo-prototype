// ─── CAMPO "¿REQUIERE DOCUMENTOS?" (Publicar / Editar) ──────────────────────
import { useState } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { REQ_SUGGESTIONS, GENERIC_REQS } from '../compliance/requirements.js';

export default function RequirementsField({ category, value = [], onChange }) {
  const { C } = useTheme();
  const [custom, setCustom] = useState('');
  const suggestions = [...(REQ_SUGGESTIONS[category] || []), ...GENERIC_REQS].filter(s => !value.includes(s));
  const add = (r) => { const t = r.trim(); if (t && !value.includes(t) && value.length < 6) onChange([...value, t.slice(0, 80)]); };
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 16, background: C.infoSoft, marginBottom: 10 }}>
        <FileText size={18} color={C.headerBg} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.5 }}>
          <b style={{ color: C.text }}>¿Este cachuelo requiere algún documento?</b> Si para hacerlo se necesita licencia, brevete, certificado, carné de sanidad u otro, agrégalo aquí. Quien postule deberá confirmar que lo tiene.
          <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 4 }}>Solo requisitos relacionados con el trabajo. No se permite pedir sexo, edad, apariencia, estado civil ni similares (Ley 26772).</div>
        </div>
      </div>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {value.map(r => (
            <span key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 14, background: C.primary, color: '#fff', fontSize: 12.5, fontWeight: 700 }}>
              {r}
              <button onClick={() => onChange(value.filter(x => x !== r))} aria-label={`Quitar ${r}`} style={{ border: 'none', background: 'rgba(255,255,255,0.25)', width: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}><X size={11} color="#fff" /></button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {suggestions.slice(0, 6).map(s => (
          <button key={s} onClick={() => add(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 10px', borderRadius: 14, border: '1.5px dashed var(--c-bord)', background: C.card, color: C.text, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={12} /> {s}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { add(custom); setCustom(''); } }}
          placeholder="Otro requisito (ej.: certificado de trabajo en altura)" aria-label="Otro requisito"
          style={{ flex: 1, minWidth: 0, padding: '11px 12px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, fontSize: 16, outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={() => { add(custom); setCustom(''); }} disabled={!custom.trim()} style={{ padding: '0 14px', borderRadius: 14, border: 'none', background: custom.trim() ? C.primary : 'var(--c-card-el)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Agregar</button>
      </div>
    </div>
  );
}
