// ─── SELECTOR DE CATEGORÍA + CATALOGACIÓN AUTOMÁTICA (v0.18) ─────────────────
// El usuario escribe el servicio "a su manera" y la app lo cataloga sola en una
// categoría (para que se pueda filtrar). Puede cambiarla cuando quiera.
import { useEffect, useMemo, useState } from 'react';
import { Search, Sparkles, ChevronRight, X, Check } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import Sheet from '../../ui/Sheet.jsx';
import {
  CATEGORIES, CATEGORY_GROUPS, POPULAR_LABELS, getCategory, getGroup,
  suggestCategories, searchCategories,
} from '../../data/categories.js';

export const CatDot = ({ cat, size = 20 }) => (
  <span style={{ width: size, height: size, borderRadius: size * 0.3, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${cat.iconBgA}, ${cat.iconBgB})` }}>
    <cat.Icon size={size * 0.6} color="#fff" strokeWidth={2.5} />
  </span>
);

export const CatChip = ({ label, active, onPress, count, small }) => {
  const { C } = useTheme();
  const cat = getCategory(label);
  return (
    <button onClick={onPress} aria-pressed={!!active}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: small ? '6px 10px' : '8px 12px', borderRadius: 20, cursor: 'pointer',
        border: `1.5px solid ${active ? C.primary : C.border}`, background: active ? C.primary + '18' : C.card,
        color: active ? C.primary : C.text, fontSize: small ? 12 : 12.5, fontWeight: 700, fontFamily: 'inherit', flexShrink: 0, minHeight: small ? 32 : 38,
      }}>
      <CatDot cat={cat} size={small ? 16 : 18} />
      {label}
      {count != null && <span style={{ fontSize: 11, color: active ? C.primary : C.textMuted, fontWeight: 800 }}>{count}</span>}
    </button>
  );
};

/** Hoja con TODAS las categorías, agrupadas y con buscador. */
export function CategorySheet({ open, onClose, selected, onSelect, allowGroups = false, onSelectGroup, selectedGroup, counts }) {
  const { C } = useTheme();
  const [q, setQ] = useState('');
  useEffect(() => { if (!open) setQ(''); }, [open]);
  const results = useMemo(() => (q.trim() ? searchCategories(q) : null), [q]);
  const pick = (label) => { onSelect(label); onClose(); };
  return (
    <Sheet open={open} onClose={onClose} title="Categorías" subtitle={`${CATEGORIES.length} tipos de cachuelo en ${CATEGORY_GROUPS.length} grupos`}>
      <div style={{ position: 'sticky', top: 0, zIndex: 2, paddingBottom: 10, background: 'var(--lg-fill-strong)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '0 12px', background: C.card }}>
          <Search size={16} color={C.textMuted} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Busca: gasfitero, torta, perro, sunat…" aria-label="Buscar categoría"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, padding: '12px 0', color: C.text, fontFamily: 'inherit' }} />
          {q && <button onClick={() => setQ('')} aria-label="Borrar" style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={15} color={C.textMuted} /></button>}
        </div>
      </div>
      {results ? (
        results.length === 0
          ? <div style={{ fontSize: 13, color: C.textMuted, padding: '16px 4px' }}>No encontramos esa categoría. Elige <b>Otros</b> y escribe el servicio con tus palabras: igual podrán encontrarlo en la búsqueda.
              <div style={{ marginTop: 10 }}><CatChip label="Otros" onPress={() => pick('Otros')} /></div></div>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{results.map(c => <CatChip key={c.id} label={c.label} active={selected === c.label} count={counts?.[c.label]} onPress={() => pick(c.label)} />)}</div>
      ) : CATEGORY_GROUPS.map(g => {
        const cats = CATEGORIES.filter(c => c.group === g.id);
        const total = counts ? cats.reduce((s, c) => s + (counts[c.label] || 0), 0) : null;
        return (
          <div key={g.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${g.a}, ${g.b})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><g.Icon size={14} color="#fff" /></span>
              <span style={{ fontSize: 13.5, fontWeight: 900, color: C.text, flex: 1 }}>{g.label}</span>
              {allowGroups && (
                <button onClick={() => { onSelectGroup?.(g.id); onClose(); }} style={{ border: 'none', background: selectedGroup === g.id ? C.primary : 'var(--c-card-el)', color: selectedGroup === g.id ? '#fff' : C.primary, fontWeight: 800, fontSize: 11.5, padding: '6px 10px', borderRadius: 12, cursor: 'pointer' }}>
                  Todo el grupo{total != null ? ` · ${total}` : ''}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {cats.map(c => <CatChip key={c.id} small label={c.label} active={selected === c.label} count={counts?.[c.label]} onPress={() => pick(c.label)} />)}
            </div>
          </div>
        );
      })}
    </Sheet>
  );
}

/**
 * Campo "Categoría" para Publicar/Editar.
 * hintText: lo que escribió el usuario (título + servicio) para sugerir.
 */
export default function CategoryPicker({ value, onChange, hintText = '' }) {
  const { C } = useTheme();
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(!!value);
  const [auto, setAuto] = useState(false);
  const suggestions = useMemo(() => suggestCategories(hintText), [hintText]);
  const top = suggestions[0];

  useEffect(() => {                    // catalogación automática mientras no elija a mano
    if (touched || !top || top.score < 3 || value === top.cat.label) return;
    onChange(top.cat.label); setAuto(true);
  }, [top?.cat.label, top?.score, touched]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (label) => { setTouched(true); setAuto(false); onChange(label); };
  const cat = value ? getCategory(value) : null;
  const others = suggestions.filter(s => s.cat.label !== value);
  const chipsToShow = others.length ? others.map(s => s.cat.label) : (!value ? POPULAR_LABELS.slice(0, 8) : []);

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 6, display: 'block' }}>Categoría *</label>
      {cat ? (
        <div className="lg-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 16, border: `1.5px solid ${C.primary}`, background: C.primary + '10', marginBottom: 8 }}>
          <CatDot cat={cat} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 900, color: C.text }}>{value}</div>
            <div style={{ fontSize: 11.5, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
              {auto ? <><Sparkles size={11} color={C.primary} /> Catalogado automáticamente · {getGroup(cat.group).label}</> : <><Check size={11} color={C.success} /> {getGroup(cat.group).label}</>}
            </div>
          </div>
          <button onClick={() => setOpen(true)} style={{ border: 'none', background: 'var(--c-card-el)', color: C.primary, fontWeight: 800, fontSize: 12.5, padding: '8px 12px', borderRadius: 12, cursor: 'pointer', minHeight: 36 }}>Cambiar</button>
        </div>
      ) : null}
      {chipsToShow.length > 0 && (
        <>
          <div style={{ fontSize: 11.5, color: C.textMuted, margin: '2px 0 6px', fontWeight: 600 }}>
            {others.length ? (value ? '¿O quizá es…?' : 'Sugerencias según lo que escribiste') : 'Las más pedidas'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 8 }}>
            {chipsToShow.map(l => <CatChip key={l} small label={l} active={value === l} onPress={() => choose(l)} />)}
          </div>
        </>
      )}
      <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: C.primary, fontWeight: 800, fontSize: 13, cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}>
        Ver todas las categorías ({CATEGORIES.length}) <ChevronRight size={15} />
      </button>
      <CategorySheet open={open} onClose={() => setOpen(false)} selected={value} onSelect={choose} />
    </div>
  );
}
