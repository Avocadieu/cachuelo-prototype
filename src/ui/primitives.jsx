// ─── PRIMITIVAS DE UI (Liquid Glass) ─────────────────────────────────────────
import { useRef, useState } from 'react';
import { Home, Map as MapIcon, Plus, Briefcase, User } from 'lucide-react';
import { LIGHT, useTheme } from './theme.js';
import { getCategory } from '../data/categories.js';

export const Stars = ({ rating = 0, size = 12 }) => {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span aria-label={`${rating} de 5 estrellas`} style={{ color: LIGHT.warning, fontSize: size, letterSpacing: 1 }}>
      {'★'.repeat(r)}{'☆'.repeat(5 - r)}
    </span>
  );
};

export const Avatar = ({ initials, src, size = 36, bg = LIGHT.primary, color = '#fff', fontSize = 13 }) => (
  <div style={{
    width: size, height: size, borderRadius: size, background: bg,
    color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize, flexShrink: 0, overflow: 'hidden',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
  }}>
    {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
  </div>
);

export const Badge = ({ children, color = LIGHT.primary, bg }) => (
  <span style={{
    background: bg || color + '1F', color,
    fontSize: 11, fontWeight: 700, padding: '3px 8px',
    borderRadius: 20, whiteSpace: 'nowrap',
    boxShadow: `inset 0 0 0 1px ${color}22`,
  }}>{children}</span>
);

/** Botón con acabado de vidrio. Variantes: primary | ghost | outline | danger */
export const Btn = ({ children, onClick, style = {}, variant = 'primary', disabled, type = 'button', ariaLabel }) => {
  const { C } = useTheme();
  const base = {
    border: 'none', borderRadius: 16, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 15, transition: 'transform .18s cubic-bezier(.34,1.56,.64,1), opacity .2s, box-shadow .2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '14px 22px', minHeight: 48, opacity: disabled ? 0.5 : 1, letterSpacing: 0.1,
    WebkitTapHighlightColor: 'transparent',
  };
  const variants = {
    primary: {
      background: `linear-gradient(145deg, ${C.primaryLight} 0%, ${C.primary} 45%, ${C.primaryDark} 100%)`,
      color: '#fff',
      boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -2px 6px rgba(150,45,10,0.25), 0 8px 20px -8px ${C.primary}`,
    },
    ghost: {
      background: 'var(--lg-fill-strong)', color: C.text,
      WebkitBackdropFilter: 'blur(16px) saturate(170%)', backdropFilter: 'blur(16px) saturate(170%)',
      boxShadow: 'inset 0 1px 0 var(--lg-highlight), inset 0 0 0 1px var(--lg-stroke), 0 4px 14px -8px rgba(13,27,62,0.35)',
    },
    outline: { background: 'transparent', color: C.primary, boxShadow: `inset 0 0 0 2px ${C.primary}` },
    danger: {
      background: `linear-gradient(145deg, #F87171 0%, ${C.danger} 50%, #DC2626 100%)`,
      color: '#fff', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.45), 0 8px 20px -8px rgba(239,68,68,0.8)',
    },
  };
  return (
    <button type={type} aria-label={ariaLabel} disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onPointerDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

// Nota: font-size 16px en inputs evita el zoom automático de Safari iOS al enfocar.
const fieldBase = (C) => ({
  width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 16,
  color: C.text, background: C.card, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', boxShadow: 'inset 0 1px 2px rgba(13,27,62,0.04)',
  transition: 'border-color .2s, box-shadow .2s',
});
const onFocusField = (e) => { e.target.style.borderColor = LIGHT.primary; e.target.style.boxShadow = `0 0 0 4px ${LIGHT.primary}22`; };
const onBlurField  = (e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = 'inset 0 1px 2px rgba(13,27,62,0.04)'; };

export const Input = ({ label, placeholder, type = 'text', value, onChange, icon, inputMode }) => {
  const { C } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 6, display: 'block', letterSpacing: 0.2 }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, display: 'flex' }}>{icon}</span>}
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange} inputMode={inputMode}
          aria-label={label || placeholder}
          onFocus={onFocusField} onBlur={onBlurField}
          style={{ ...fieldBase(C), padding: icon ? '13px 14px 13px 40px' : '13px 14px' }}
        />
      </div>
    </div>
  );
};

export const Textarea = ({ label, placeholder, value, onChange, rows = 4 }) => {
  const { C } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 6, display: 'block', letterSpacing: 0.2 }}>{label}</label>}
      <textarea
        placeholder={placeholder} value={value} onChange={onChange} rows={rows}
        aria-label={label || placeholder}
        onFocus={onFocusField} onBlur={onBlurField}
        style={{ ...fieldBase(C), padding: '13px 14px', resize: 'none', lineHeight: 1.5 }}
      />
    </div>
  );
};

/** Ícono de categoría con degradado + brillo de vidrio */
export const CategoryIcon = ({ label, size = 44, iconSize = 22, radius = 12 }) => {
  const cat = getCategory(label);
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(145deg, ${cat.iconBgB}, ${cat.iconBgA})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.45), 0 6px 14px -6px ${cat.iconBgA}`,
    }}>
      <cat.Icon size={iconSize} color="#fff" strokeWidth={2.2} />
    </div>
  );
};

// ─── TAB BAR FLOTANTE ────────────────────────────────────────────────────────
// "Buscar" salió de la barra (se llega desde la barra de búsqueda del Inicio)
// y su lugar lo ocupa "Mapa".
const TABS = [
  { id: 'home',        icon: Home,      label: 'Inicio'   },
  { id: 'map',         icon: MapIcon,   label: 'Mapa'     },
  { id: 'publish',     icon: Plus,      label: 'Publicar' },
  { id: 'mycachuelos', icon: Briefcase, label: 'Mis cachuelos' },
  { id: 'profile',     icon: User,      label: 'Perfil'   },
];
const TAB_ALIAS = { search: 'home' };

export const TabBar = ({ active, onNavigate, collapsed = false }) => {
  const current = TAB_ALIAS[active] || active;
  const idx = TABS.findIndex(t => t.id === current);
  const showLens = idx >= 0 && current !== 'publish';
  return (
    <nav className={`lg-glass lg-glass--strong lg-tabbar${collapsed ? ' lg-tabbar--min' : ''}`} aria-label="Navegación principal">
      <div className="lg-tab-lens" aria-hidden="true" style={{
        left: `calc(6px + (100% - 12px) * ${Math.max(idx, 0)} / ${TABS.length})`,
        width: `calc((100% - 12px) / ${TABS.length})`,
        opacity: showLens ? 1 : 0,
      }} />
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = current === tab.id;
        if (tab.id === 'publish') {
          return (
            <button key={tab.id} className="lg-tab" onClick={() => onNavigate(tab.id)} aria-label="Publicar cachuelo"
              aria-current={isActive ? 'page' : undefined}>
              <span className="lg-fab"><Icon size={26} color="#fff" strokeWidth={2.6} /></span>
            </button>
          );
        }
        return (
          <button key={tab.id} className="lg-tab" onClick={() => onNavigate(tab.id)}
            aria-current={isActive ? 'page' : undefined}>
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.9} />
            <span className="lg-tab__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// ─── SCREEN WRAPPER ──────────────────────────────────────────────────────────
export const TABBAR_SPACE = 100; // alto reservado para la tab bar flotante

// Al bajar, la tab bar se encoge (como iOS 26); al subir, vuelve.
export const Screen = ({ children, withTabs, activeTab, onNavigate, style = {} }) => {
  const [collapsed, setCollapsed] = useState(false);
  const lastY = useRef(0);
  const onScroll = (e) => {
    if (!withTabs) return;
    const y = e.currentTarget.scrollTop;
    const dy = y - lastY.current;
    if (Math.abs(dy) > 6) { setCollapsed(dy > 0 && y > 80); lastY.current = y; }
  };
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', ...style }}>
      <div onScroll={onScroll} style={{ flex: 1, overflowY: 'auto', paddingBottom: withTabs ? TABBAR_SPACE : 0, overscrollBehavior: 'contain' }}>
        {children}
      </div>
      {withTabs && <TabBar active={activeTab} onNavigate={onNavigate} collapsed={collapsed} />}
    </div>
  );
};

/** Tarjeta "esqueleto" mientras carga el feed */
export const SkeletonCard = () => (
  <div aria-hidden="true" style={{ borderRadius: 22, padding: 16, marginBottom: 12, background: 'var(--c-card)', border: '1px solid var(--lg-stroke)' }}>
    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
      <div className="lg-skel" style={{ width: 46, height: 46, borderRadius: 14 }} />
      <div style={{ flex: 1 }}>
        <div className="lg-skel" style={{ height: 14, width: '75%', borderRadius: 7, marginBottom: 8 }} />
        <div className="lg-skel" style={{ height: 12, width: '45%', borderRadius: 6 }} />
      </div>
      <div className="lg-skel" style={{ width: 54, height: 22, borderRadius: 8 }} />
    </div>
    <div className="lg-skel" style={{ height: 12, width: '60%', borderRadius: 6 }} />
  </div>
);
