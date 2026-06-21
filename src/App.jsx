import { supabase } from './lib/supabase.js';
import undraw1 from './assets/undraw1.svg';
import undraw2 from './assets/undraw2.svg';
import undraw3 from './assets/undraw3.svg';
import { useState, useEffect, createContext, useContext } from 'react';
import {
  Home, Search, PlusCircle, Briefcase, User, Star, MapPin, Clock,
  ChevronRight, ChevronLeft, X, Check, ArrowLeft, Bell, Settings,
  Shield, FileText, BarChart2, Users, Download, TrendingUp, Award,
  Phone, Mail, CreditCard, Zap, Camera, Truck, Wrench, BookOpen,
  Leaf, Monitor, Calendar, MessageCircle, Filter, Heart, Share2,
  LogOut, Eye, CheckCircle, AlertCircle, Package, Send, Hash,
  DollarSign, Trash2, Pencil, Flag,
  Sparkles, Palette, ChefHat, GraduationCap, PartyPopper
} from 'lucide-react';

// ─── TEMA ────────────────────────────────────────────────────────────────────
const LIGHT = {
  primary: '#FF6B35', primaryLight: '#FF8C5A', primaryDark: '#E55A25',
  headerBg: '#2563EB', headerDark: '#1D4ED8', headerLight: '#3B82F6',
  success: '#10B981', warning: '#F59E0B', danger: '#EF4444', purple: '#8B5CF6',
  // Themed via CSS variables (fallback = light values)
  bg: 'var(--c-bg,#F0F4FF)', card: 'var(--c-card,#FFFFFF)',
  cardElevated: 'var(--c-card-el,#F8FAFF)',
  text: 'var(--c-text,#0D1B3E)', textSec: 'var(--c-tsec,#4A5780)',
  textMuted: 'var(--c-tmut,#8A93B0)', border: 'var(--c-bord,#DDE3F5)',
};
const DARK = {
  primary: '#FF7A47', primaryLight: '#FF9563', primaryDark: '#E86A35',
  headerBg: '#1E40AF', headerDark: '#1E3A8A', headerLight: '#2563EB',
  success: '#34D399', warning: '#FCD34D', danger: '#F87171', purple: '#C4B5FD',
  bg: 'var(--c-bg,#0B0F1A)', card: 'var(--c-card,#1C2438)',
  cardElevated: 'var(--c-card-el,#242E48)',
  text: 'var(--c-text,#F0F4FF)', textSec: 'var(--c-tsec,#A8B4D8)',
  textMuted: 'var(--c-tmut,#6874A0)', border: 'var(--c-bord,#2E3C5E)',
};

// Fallback module-level C (used in default prop values & pre-hook code)
let C = LIGHT;

const ThemeCtx = createContext({ C: LIGHT, isDark: false, toggleDark: () => {} });
const useTheme = () => useContext(ThemeCtx);

// ─── DISTRITOS DE LIMA ───────────────────────────────────────────────────────
const DISTRITOS = [
  'Ancón','Ate','Barranco','Breña','Carabayllo','Cercado de Lima','Chaclacayo',
  'Chorrillos','Cieneguilla','Comas','El Agustino','Independencia','Jesús María',
  'La Molina','La Victoria','Lince','Los Olivos','Lurigancho','Lurín',
  'Magdalena del Mar','Miraflores','Pachacámac','Pucusana','Pueblo Libre',
  'Puente Piedra','Punta Hermosa','Punta Negra','Rímac','San Bartolo','San Borja',
  'San Isidro','San Juan de Lurigancho','San Juan de Miraflores','San Luis',
  'San Martín de Porres','San Miguel','Santa Anita','Santa María del Mar',
  'Santa Rosa','Santiago de Surco','Surquillo','Villa El Salvador','Villa María del Triunfo',
];

// ─── DATOS MOCK ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1,  label: 'Limpieza',     Icon: Sparkles,      iconBgA: '#0EA5E9', iconBgB: '#38BDF8', color: '#E0F2FE' },
  { id: 2,  label: 'Mudanza',      Icon: Package,        iconBgA: '#F97316', iconBgB: '#FDBA74', color: '#FEF3C7' },
  { id: 3,  label: 'Redacción',    Icon: FileText,       iconBgA: '#10B981', iconBgB: '#6EE7B7', color: '#F0FDF4' },
  { id: 4,  label: 'Diseño',       Icon: Palette,        iconBgA: '#8B5CF6', iconBgB: '#C4B5FD', color: '#FDF4FF' },
  { id: 5,  label: 'Reparaciones', Icon: Wrench,         iconBgA: '#F59E0B', iconBgB: '#FDE68A', color: '#FFF7ED' },
  { id: 6,  label: 'Cocina',       Icon: ChefHat,        iconBgA: '#F43F5E', iconBgB: '#FDA4AF', color: '#FEF9C3' },
  { id: 7,  label: 'Delivery',     Icon: Truck,          iconBgA: '#14B8A6', iconBgB: '#5EEAD4', color: '#ECFDF5' },
  { id: 8,  label: 'Tutorías',     Icon: GraduationCap,  iconBgA: '#3B82F6', iconBgB: '#93C5FD', color: '#EFF6FF' },
  { id: 9,  label: 'Jardinería',   Icon: Leaf,           iconBgA: '#22C55E', iconBgB: '#86EFAC', color: '#F0FDF4' },
  { id: 10, label: 'Tecnología',   Icon: Monitor,        iconBgA: '#6366F1', iconBgB: '#A5B4FC', color: '#F5F3FF' },
  { id: 11, label: 'Fotografía',   Icon: Camera,         iconBgA: '#EC4899', iconBgB: '#F9A8D4', color: '#FDF2F8' },
  { id: 12, label: 'Eventos',      Icon: PartyPopper,    iconBgA: '#EF4444', iconBgB: '#FCA5A5', color: '#FFF1F2' },
];

const CategoryIcon = ({ label, size = 44, iconSize = 22, radius = 12 }) => {
  const cat = CATEGORIES.find(c => c.label === label) || { Icon: Briefcase, iconBgA: '#6B7280', iconBgB: '#9CA3AF' };
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(135deg, ${cat.iconBgA}, ${cat.iconBgB})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 12px ${cat.iconBgA}50`,
    }}>
      <cat.Icon size={iconSize} color="#fff" strokeWidth={2} />
    </div>
  );
};

const CACHUELOS = [
  {
    id: 1, title: 'Limpieza de departamento en Miraflores',
    category: 'Limpieza', emoji: '🧹', location: 'Miraflores, Lima',
    duration: '1 día', price: 80, type: 'Presencial', featured: true,
    publisher: { name: 'Ana García', rating: 4.8, verified: true, avatar: 'AG' },
    description: 'Necesito limpieza profunda de departamento de 3 habitaciones. Incluye baños, cocina y áreas comunes. Se proveen materiales.',
    schedule: 'Sábado 15 Mar, 8am–5pm',
    remote: false,
  },
  {
    id: 2, title: 'Redacción de artículos SEO (10 artículos)',
    category: 'Redacción', emoji: '✍️', location: 'Remoto',
    duration: '2 semanas', price: 350, type: 'Remoto', featured: true,
    publisher: { name: 'StartupPE', rating: 4.9, verified: true, avatar: 'SP' },
    description: 'Redacción de 10 artículos de 1200 palabras sobre tecnología y finanzas. Se requiere manejo de SEO básico.',
    schedule: 'Flexible – entrega en 14 días',
    remote: true,
  },
  {
    id: 3, title: 'Mudanza de oficina – San Isidro',
    category: 'Mudanza', emoji: '📦', location: 'San Isidro, Lima',
    duration: '1 día', price: 150, type: 'Presencial', featured: false,
    publisher: { name: 'Carlos Ríos', rating: 4.5, verified: false, avatar: 'CR' },
    description: 'Mudanza de una oficina pequeña. Se necesitan 2 personas fuertes. Hay ascensor en el edificio.',
    schedule: 'Domingo 16 Mar, 7am–2pm',
    remote: false,
  },
  {
    id: 4, title: 'Diseño de logo para restaurante',
    category: 'Diseño', emoji: '🎨', location: 'Remoto',
    duration: '5 días', price: 200, type: 'Remoto', featured: false,
    publisher: { name: 'Sabores del Perú', rating: 4.7, verified: true, avatar: 'SB' },
    description: 'Diseño de logo profesional + manual de marca básico para restaurante de comida criolla. Incluye 3 revisiones.',
    schedule: 'Flexible – entrega en 5 días',
    remote: true,
  },
  {
    id: 5, title: 'Clases de matemáticas para secundaria',
    category: 'Tutorías', emoji: '📚', location: 'Surco, Lima',
    duration: '1 mes', price: 400, type: 'Presencial', featured: false,
    publisher: { name: 'Familia Mendoza', rating: 4.6, verified: true, avatar: 'FM' },
    description: '8 clases de 2h para alumno de 4to secundaria. Álgebra y geometría. Horario a coordinar entre semana.',
    schedule: '2 veces/semana – Mar a Abr',
    remote: false,
  },
  {
    id: 6, title: 'Fotografía de producto para e-commerce',
    category: 'Fotografía', emoji: '📷', location: 'Lince, Lima',
    duration: '1 día', price: 180, type: 'Presencial', featured: true,
    publisher: { name: 'TiendaLima', rating: 4.9, verified: true, avatar: 'TL' },
    description: 'Sesión de fotos de 40 productos de ropa. Fondo blanco y lifestyle. Se provee estudio casero.',
    schedule: 'A coordinar esta semana',
    remote: false,
  },
];

// ─── UTILIDADES ──────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 12 }) => (
  <span style={{ color: C.warning, fontSize: size, letterSpacing: 1 }}>
    {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
  </span>
);

const Avatar = ({ initials, src, size = 36, bg = C.primary, color = '#fff', fontSize = 13 }) => (
  <div style={{
    width: size, height: size, borderRadius: size, background: bg,
    color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize, flexShrink: 0, overflow: 'hidden',
  }}>
    {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
  </div>
);

const Badge = ({ children, color = C.primary, bg }) => (
  <span style={{
    background: bg || color + '18', color,
    fontSize: 10, fontWeight: 600, padding: '2px 7px',
    borderRadius: 20, whiteSpace: 'nowrap',
  }}>{children}</span>
);

const Btn = ({ children, onClick, style = {}, variant = 'primary', disabled }) => {
  const { C } = useTheme();
  const base = {
    border: 'none', borderRadius: 14, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 14, transition: 'all .2s', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 6, padding: '13px 22px',
    opacity: disabled ? 0.55 : 1, letterSpacing: 0.1,
  };
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
      color: '#fff', boxShadow: `0 4px 16px ${C.primary}45`,
    },
    outline: { background: 'transparent', color: C.primary, border: `2px solid ${C.primary}` },
    ghost: { background: C.cardElevated, color: C.text },
    danger: {
      background: `linear-gradient(135deg, ${C.danger} 0%, #DC2626 100%)`,
      color: '#fff', boxShadow: '0 4px 12px rgba(239,68,68,0.35)',
    },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, type = 'text', value, onChange, icon }) => {
  const { C } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, marginBottom: 6, display: 'block', letterSpacing: 0.2 }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted }}>{icon}</span>}
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{
            width: '100%', padding: icon ? '12px 14px 12px 40px' : '12px 14px',
            border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14,
            color: C.text, background: C.card, outline: 'none', fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
};

const Textarea = ({ label, placeholder, value, onChange, rows = 4 }) => {
  const { C } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, marginBottom: 6, display: 'block', letterSpacing: 0.2 }}>{label}</label>}
      <textarea
        placeholder={placeholder} value={value} onChange={onChange} rows={rows}
        style={{
          width: '100%', padding: '12px 14px', border: `1.5px solid ${C.border}`,
          borderRadius: 12, fontSize: 14, color: C.text, background: C.card,
          outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  );
};

// ─── PHONE FRAME ─────────────────────────────────────────────────────────────
const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Nunito', system-ui, -apple-system, sans-serif; }
  .light-mode {
    --c-bg:#F0F4FF; --c-card:#FFFFFF; --c-card-el:#F5F7FF;
    --c-text:#0D1B3E; --c-tsec:#4A5780; --c-tmut:#8A93B0; --c-bord:#DDE3F5;
  }
  .dark-mode {
    --c-bg:#0B0F1A; --c-card:#1C2438; --c-card-el:#242E48;
    --c-text:#F0F4FF; --c-tsec:#A8B4D8; --c-tmut:#6874A0; --c-bord:#2E3C5E;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 1s linear infinite; }
`;

const PhoneFrame = ({ children, isDark, onToggleDark }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px',
    minHeight: '100vh',
    background: isDark
      ? 'linear-gradient(160deg, #050710 0%, #0a0e1f 50%, #0d1530 100%)'
      : 'linear-gradient(160deg, #1a237e 0%, #1565c0 50%, #0d47a1 100%)',
    transition: 'background 0.4s ease',
  }}>
    <style>{THEME_CSS}</style>

    {/* Brand label */}
    <div style={{ marginBottom: 20, textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ boxShadow: '0 4px 14px rgba(255,107,53,0.55)', borderRadius: 10 }}>
          <CachueloMark size={32} />
        </div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>Cachuelo</div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
        Prototipo v0.11 · Lima, Perú 🇵🇪
      </div>
    </div>

    {/* Phone shell */}
    <div style={{
      width: 375, background: '#000', borderRadius: 52,
      boxShadow: isDark
        ? '0 0 0 2px #222, 0 0 0 4px #111, 0 50px 100px rgba(0,0,0,0.9), inset 0 0 0 1px #333'
        : '0 0 0 2px #333, 0 0 0 4px #111, 0 50px 100px rgba(0,0,0,0.7), inset 0 0 0 1px #444',
      padding: '14px 8px 8px', position: 'relative',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 30, background: '#000', borderRadius: 20,
        zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
        <div style={{ width: 60, height: 6, borderRadius: 3, background: '#111' }} />
      </div>

      {/* Screen */}
      <div className={isDark ? 'dark-mode' : 'light-mode'} style={{
        width: '100%', height: 780, borderRadius: 44, overflow: 'hidden',
        background: isDark ? '#0D1018' : '#F0F4FF', position: 'relative',
      }}>
        {/* Status bar */}
        <div style={{
          background: 'transparent', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '12px 20px 0', position: 'absolute',
          top: 0, left: 0, right: 0, zIndex: 20, pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#EDF0FA' : '#0D1B3E' }}>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              {[3,5,7,9].map(h => <div key={h} style={{ width: 3, height: h, background: isDark ? '#EDF0FA' : '#0D1B3E', borderRadius: 1 }} />)}
            </div>
            <div style={{ width: 14, height: 8, border: `1.5px solid ${isDark ? '#EDF0FA' : '#0D1B3E'}`, borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 2, height: 4, background: isDark ? '#EDF0FA' : '#0D1B3E', borderRadius: 1 }} />
              <div style={{ width: '70%', height: '100%', background: isDark ? '#EDF0FA' : '#0D1B3E', borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* App content */}
        <div style={{ position: 'absolute', inset: 0, paddingTop: 24, overflowY: 'auto' }}>
          {children}
        </div>
      </div>

      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
        <div style={{ width: 120, height: 5, background: '#333', borderRadius: 3 }} />
      </div>
    </div>

    {/* Bottom: dark mode toggle + stack */}
    <div style={{ marginTop: 24, textAlign: 'center' }}>
      <button onClick={onToggleDark} style={{
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20,
        color: '#fff', fontSize: 12, fontWeight: 700, padding: '7px 18px',
        cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center',
        gap: 6, margin: '0 auto 16px',
      }}>
        {isDark ? '☀️ Modo claro' : '🌙 Modo oscuro'}
      </button>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['React', 'Vite', 'Supabase', 'PostgreSQL'].map(t => (
          <span key={t} style={{
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
            fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)',
          }}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

// ─── TAB BAR ─────────────────────────────────────────────────────────────────
const TabBar = ({ active, onNavigate }) => {
  const { C } = useTheme();
  const tabs = [
    { id: 'home',        icon: Home,       label: 'Inicio'       },
    { id: 'search',      icon: Search,     label: 'Buscar'       },
    { id: 'publish',     icon: PlusCircle, label: 'Publicar'     },
    { id: 'mycachuelos', icon: Briefcase,  label: 'Mis Cachuelos'},
    { id: 'profile',     icon: User,       label: 'Perfil'       },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: C.card, borderTop: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'flex-end', paddingBottom: 8,
      boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isPublish = tab.id === 'publish';
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, border: 'none', background: 'transparent', cursor: 'pointer',
              padding: isPublish ? '0 0 4px' : '8px 0 4px', position: 'relative',
            }}
          >
            {isPublish ? (
              <div style={{
                width: 54, height: 54, borderRadius: 27,
                background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 20px ${C.primary}55`,
                marginTop: -24, border: `3px solid ${C.card}`,
              }}>
                <Icon size={24} color="#fff" />
              </div>
            ) : (
              <div style={{ position: 'relative', padding: '4px 12px', borderRadius: 12,
                background: isActive ? `${C.primary}15` : 'transparent', transition: 'all .2s' }}>
                <Icon size={20} color={isActive ? C.primary : C.textMuted} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
            )}
            <span style={{
              fontSize: 9, fontWeight: isActive || isPublish ? 800 : 500,
              color: isPublish ? C.primary : isActive ? C.primary : C.textMuted,
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── SCREEN WRAPPER ──────────────────────────────────────────────────────────
const Screen = ({ children, withTabs, activeTab, onNavigate, style = {} }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', ...style }}>
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: withTabs ? 72 : 0 }}>
      {children}
    </div>
    {withTabs && <TabBar active={activeTab} onNavigate={onNavigate} />}
  </div>
);

// ─── LOGO MARK ───────────────────────────────────────────────────────────────
const CachueloMark = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="14" fill="#FF6B35" />
    <rect width="48" height="48" rx="14" fill="url(#cmg)" />
    <defs>
      <linearGradient id="cmg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF8C5A" />
        <stop offset="1" stopColor="#E55A25" />
      </linearGradient>
    </defs>
    {/* Briefcase body */}
    <rect x="9" y="22" width="30" height="19" rx="4" fill="white" opacity="0.95" />
    {/* Briefcase handle */}
    <path d="M18 22v-4a6 6 0 0 1 12 0v4" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Center clasp */}
    <rect x="21" y="29" width="6" height="5" rx="2" fill="#FF6B35" opacity="0.85" />
    {/* Sparkle top-right */}
    <circle cx="38" cy="11" r="2.5" fill="white" opacity="0.7" />
    <line x1="38" y1="7" x2="38" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line x1="38" y1="13" x2="38" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line x1="34" y1="11" x2="36" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line x1="40" y1="11" x2="42" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════════════
//  PANTALLAS
// ════════════════════════════════════════════════════════════════════════════

// 1. SPLASH ─────────────────────────────────────────────────────────────────
const SplashScreen = () => {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(160deg, ${C.headerBg} 0%, ${C.headerDark} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 100, height: 100, background: 'rgba(255,255,255,0.15)',
        borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <CachueloMark size={64} />
      </div>
      <div style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>Cachuelo</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6, marginBottom: 48 }}>
        Trabajos puntuales en Perú
      </div>
      {/* Spinner */}
      <div style={{ position: 'relative', width: 36, height: 36 }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .spinner { animation: spin 1s linear infinite; }
        `}</style>
        <div className="spinner" style={{
          width: 36, height: 36, border: '3px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff', borderRadius: '50%',
        }} />
      </div>
      <div style={{ position: 'absolute', bottom: 32, color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
        Lima, Perú 🇵🇪
      </div>
    </div>
  );
};

// 2. ONBOARDING ──────────────────────────────────────────────────────────────
const OnboardingScreen = ({ onDone }) => {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      emoji: '🔍', color: '#EFF6FF', accent: '#3B82F6',
      title: 'Encuentra cachuelos', sub: 'Explora cientos de trabajos puntuales cerca de ti. Filtra por categoría, precio y modalidad.',
    },
    {
      emoji: '📢', color: '#FFF7ED', accent: C.primary,
      title: 'Publica tu necesidad', sub: 'Publica lo que necesitas por solo S/5. Tu cachuelo llega a miles de trabajadores calificados.',
    },
    {
      emoji: '⭐', color: '#F0FDF4', accent: C.success,
      title: 'Califica y crece', sub: 'Sistema de reputación que protege a ambas partes. Construye tu historial y consigue más trabajo.',
    },
  ];
  const s = slides[slide];
  return (
    <div style={{ position: 'absolute', inset: 0, background: s.color, display: 'flex', flexDirection: 'column' }}>
      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '52px 20px 0' }}>
        <button onClick={onDone} style={{ background: 'none', border: 'none', color: C.textSec, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
          Saltar
        </button>
      </div>
      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 160, height: 160,
          background: `${s.accent}18`,
          borderRadius: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 80,
        }}>{s.emoji}</div>
      </div>
      {/* Text */}
      <div style={{ padding: '0 32px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 12 }}>{s.title}</div>
        <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>{s.sub}</div>
        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '28px 0' }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: i === slide ? 24 : 8, height: 8, borderRadius: 4,
              background: i === slide ? s.accent : '#D1D5DB',
              transition: 'width .3s',
            }} />
          ))}
        </div>
        <Btn
          onClick={() => slide < slides.length - 1 ? setSlide(slide + 1) : onDone()}
          style={{ width: '100%', fontSize: 15, background: s.accent }}
        >
          {slide < slides.length - 1 ? 'Siguiente' : 'Comenzar'}
        </Btn>
      </div>
    </div>
  );
};

// 3. LOGIN ────────────────────────────────────────────────────────────────────
const PAISES = ['Perú','Argentina','Bolivia','Brasil','Chile','Colombia','Ecuador','México','Paraguay','Uruguay','Venezuela','Otro'];

const DISTRITOS_LIMA = [
  'Ancón','Ate','Barranco','Breña','Carabayllo','Cercado de Lima','Chaclacayo','Chorrillos',
  'Cieneguilla','Comas','El Agustino','Independencia','Jesús María','La Molina','La Victoria',
  'Lince','Los Olivos','Lurigancho','Lurín','Magdalena del Mar','Miraflores','Pachacámac',
  'Pucusana','Pueblo Libre','Puente Piedra','Punta Hermosa','Punta Negra','Rímac','San Bartolo',
  'San Borja','San Isidro','San Juan de Lurigancho','San Juan de Miraflores','San Luis',
  'San Martín de Porres','San Miguel','Santa Anita','Santa María del Mar','Santa Rosa',
  'Santiago de Surco','Surquillo','Villa El Salvador','Villa María del Triunfo',
];

const DEPARTAMENTOS_PERU = [
  'Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca',
  'Callao','Cusco','Huancavelica','Huánuco','Ica','Junín','La Libertad',
  'Lambayeque','Lima','Loreto','Madre de Dios','Moquegua','Pasco',
  'Piura','Puno','San Martín','Tacna','Tumbes','Ucayali',
];

const CIUDADES_PERU = {
  'Amazonas':     ['Chachapoyas','Bagua','Bagua Grande','Luya','Utcubamba','Condorcanqui'],
  'Áncash':       ['Huaraz','Chimbote','Nuevo Chimbote','Caraz','Casma','Huarmey','Yungay','Recuay'],
  'Apurímac':     ['Abancay','Andahuaylas','Chalhuanca','Tambobamba','Chincheros'],
  'Arequipa':     ['Arequipa','Camaná','Mollendo','Caravelí','Cotahuasi','Islay'],
  'Ayacucho':     ['Ayacucho','Huanta','San Miguel','Coracora','Cangallo','Vilcashuamán'],
  'Cajamarca':    ['Cajamarca','Jaén','Chota','Cutervo','Cajabamba','San Ignacio','Hualgayoc','Celendín'],
  'Callao':       ['Callao','Bellavista','La Perla','La Punta','Mi Perú','Ventanilla'],
  'Cusco':        ['Cusco','Sicuani','Calca','Quillabamba','Urubamba','Espinar','Chumbivilcas'],
  'Huancavelica': ['Huancavelica','Acobamba','Lircay','Castrovirreyna','Churcampa','Pampas'],
  'Huánuco':      ['Huánuco','Tingo María','Ambo','La Unión','Huacaybamba','Puerto Inca'],
  'Ica':          ['Ica','Chincha Alta','Pisco','Nazca','Palpa'],
  'Junín':        ['Huancayo','La Oroya','Tarma','San Ramón','Satipo','Chupaca','Junín'],
  'La Libertad':  ['Trujillo','Chepén','Otuzco','Pacasmayo','Ascope','Virú','Huamachuco'],
  'Lambayeque':   ['Chiclayo','Lambayeque','Ferreñafe','Motupe','Olmos'],
  'Lima':         ['Lima','Barranca','Huacho','Huaral','Cañete','Mala','Matucana','Oyón'],
  'Loreto':       ['Iquitos','Requena','Yurimaguas','Nauta','Caballococha'],
  'Madre de Dios':['Puerto Maldonado','Iberia','Iñapari','Laberinto'],
  'Moquegua':     ['Moquegua','Ilo','Omate'],
  'Pasco':        ['Cerro de Pasco','Oxapampa','Yanahuanca'],
  'Piura':        ['Piura','Sullana','Paita','Talara','Huancabamba','Ayabaca','Sechura','Chulucanas'],
  'Puno':         ['Puno','Juliaca','Azángaro','Ilave','Macusani','Yunguyo','Desaguadero'],
  'San Martín':   ['Moyobamba','Tarapoto','Rioja','Juanjuí','Tocache','Bellavista','Saposoa'],
  'Tacna':        ['Tacna','Tarata','Candarave','Locumba'],
  'Tumbes':       ['Tumbes','Zarumilla','Aguas Verdes','Zorritos'],
  'Ucayali':      ['Pucallpa','Atalaya','Aguaytía','Contamana','Sepahua'],
};

// ─── WELCOME SCREEN ──────────────────────────────────────────────────────────
// Slide 1: Person sitting outdoors, browsing phone for gigs
const BrowseSVG = () => (
  <img src={undraw1} alt="Encuentra trabajo" style={{ width: '100%', maxWidth: 300, maxHeight: 260, objectFit: 'contain' }} />
);

const PublishSVG = () => (
  <img src={undraw2} alt="Publica tu cachuelo" style={{ width: '100%', maxWidth: 300, maxHeight: 260, objectFit: 'contain' }} />
);

const GrowSVG = () => (
  <img src={undraw3} alt="Cobra y crece" style={{ width: '100%', maxWidth: 300, maxHeight: 260, objectFit: 'contain' }} />
);

const WelcomeScreen = ({ onEmailLogin, onGoogleLogin, onPhoneLogin }) => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % 3), 3500);
    return () => clearInterval(t);
  }, []);

  const slides = [
    { title: 'Encuentra trabajo cerca de ti', sub: 'Explora cientos de cachuelos disponibles hoy mismo. Filtra por categoría, precio y zona.', illustration: <BrowseSVG /> },
    { title: 'Publica lo que necesitas', sub: 'Crea tu cachuelo en minutos y recibe postulantes calificados al instante.', illustration: <PublishSVG /> },
    { title: 'Cobra y construye tu reputación', sub: 'Sistema de calificaciones que protege a ambas partes y te abre más puertas.', illustration: <GrowSVG /> },
  ];

  const { title, sub, illustration } = slides[slide];

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '18px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <CachueloMark size={34} />
        <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Cachuelo</span>
      </div>

      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 24px 0' }}>
        {illustration}
      </div>

      {/* Title + dots */}
      <div style={{ padding: '0 28px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 19, fontWeight: 800, color: C.text, lineHeight: 1.35, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{sub}</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? 20 : 8, height: 8, borderRadius: 4,
              background: i === slide ? C.headerBg : C.border,
              transition: 'all .3s', cursor: 'pointer',
            }} />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ padding: '0 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn onClick={onEmailLogin} style={{ width: '100%', borderRadius: 50, fontSize: 14, padding: '14px 0' }}>
          Iniciar sesión y buscar Cachuelos
        </Btn>
        <button onClick={onGoogleLogin} style={{
          width: '100%', borderRadius: 50, fontSize: 14, padding: '14px 0',
          border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer',
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.text,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>
        <button onClick={onPhoneLogin} style={{
          width: '100%', borderRadius: 50, fontSize: 14, padding: '14px 0',
          border: `1.5px solid ${C.border}`, background: C.card, cursor: 'pointer',
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.text,
        }}>
          <Phone size={16} color={C.textSec} /> Continuar con Teléfono
        </button>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, onAdmin, onBack }) => {
  const { C } = useTheme();
  const [mode, setMode] = useState('login'); // login | register | phone
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [reg, setReg] = useState({
    nombre: '', apellido: '', pais: 'Perú', fechaNac: '',
    email: '', emailConf: '', telefono: '', distrito: '', pass: '', passConf: '',
  });
  const updReg = (k, v) => setReg(r => ({ ...r, [k]: v }));

  const emailMismatch = reg.emailConf && reg.email !== reg.emailConf;
  const passMismatch  = reg.passConf  && reg.pass  !== reg.passConf;

  const passReqs = {
    length: reg.pass.length >= 8,
    upper:  /[A-Z]/.test(reg.pass),
    number: /[0-9]/.test(reg.pass),
    symbol: /[^A-Za-z0-9]/.test(reg.pass),
  };
  const passValid = Object.values(passReqs).every(Boolean);

  const handleLogin = async () => {
    setError('');
    // Bypass admin dashboard
    if (email === 'cachuelo@mvp.com' && pass === 'cachuelomvp') { onAdmin(); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) { setError('Correo o contraseña incorrectos.'); return; }
    onLogin({
      id: data.user.id,
      email: data.user.email,
      nombre: data.user.user_metadata?.nombre || data.user.email.split('@')[0],
      apellido: data.user.user_metadata?.apellido || '',
    });
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    setForgotSent(true);
  };

const handleRegister = async () => {
  setError('');
  setLoading(true);
  const { data, error } = await supabase.auth.signUp({
    email: reg.email,
    password: reg.pass,
    options: {
      data: {
        nombre:       reg.nombre,
        apellido:     reg.apellido,
        pais:         reg.pais,
        telefono:     '+51' + reg.telefono.replace(/\D/g, ''),
        departamento: 'Lima',
        ciudad:       'Lima',
        distrito:     reg.distrito,
        fecha_nac:    reg.fechaNac,
      }
    }
  });
  setLoading(false);
  if (error) { setError(error.message); return; }
  // Supabase no retorna error cuando el correo ya existe, pero sí retorna identities vacío
  if (data.user?.identities?.length === 0) {
    setError('Este correo ya está registrado. Intenta iniciar sesión.');
    return;
  }
  // Supabase requiere confirmación de email → mostrar mensaje
  if (!data.session) { setRegSuccess(true); return; }
  // Sin confirmación → entrar directo
  onLogin({ id: data.user.id, email: data.user.email, nombre: reg.nombre, apellido: reg.apellido });
};

  const regFilled = reg.nombre && reg.apellido && reg.email && reg.emailConf && reg.fechaNac
    && reg.telefono && reg.distrito && reg.pass && reg.passConf
    && !emailMismatch && !passMismatch && passValid;

  const selectStyle = {
    width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`,
    borderRadius: 10, fontSize: 14, color: C.text, background: C.card,
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.card, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${C.headerBg}, ${C.headerDark})`,
        padding: '60px 24px 40px', textAlign: 'center', position: 'relative',
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            position: 'absolute', top: 16, left: 16,
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(255,255,255,0.2)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
        )}
        <div style={{ fontSize: 40, marginBottom: 8 }}>💼</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Cachuelo</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Trabajos puntuales en Perú</div>
      </div>

      <div style={{ padding: '28px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: C.cardElevated, borderRadius: 10, padding: 3, marginBottom: 24, border: `1px solid ${C.border}` }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? C.text : C.textSec,
              boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all .2s',
            }}>
              {m === 'login' ? 'Iniciar Sesión' : 'Registrarme'}
            </button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <>
            <Input label="Correo electrónico" placeholder="tu@correo.com" type="email"
              value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={15} />} />
            <Input label="Contraseña" placeholder="••••••••" type="password"
              value={pass} onChange={e => setPass(e.target.value)} />
            <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 14 }}>
              <button onClick={() => { setForgotMode(true); setForgotEmail(email); setForgotSent(false); }}
                style={{ background: 'none', border: 'none', color: C.primary, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {forgotMode && (
              <div style={{ background: '#F0F9FF', border: `1px solid ${C.primary}30`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                {forgotSent ? (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 4 }}>¡Correo enviado!</div>
                    <div style={{ fontSize: 12, color: C.textSec, marginBottom: 10 }}>
                      Revisa tu bandeja de entrada (y spam) para restablecer tu contraseña.
                    </div>
                    <button onClick={() => setForgotMode(false)}
                      style={{ background: 'none', border: 'none', color: C.primary, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                      Volver al login
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 8 }}>
                      Ingresa tu correo y te enviaremos un link para restablecer tu contraseña.
                    </div>
                    <Input
                      placeholder="tu@correo.com"
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      icon={<Mail size={15} />}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => setForgotMode(false)}
                        style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, color: C.textSec, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                        Cancelar
                      </button>
                      <button onClick={handleForgotPassword} disabled={!forgotEmail || loading}
                        style={{ flex: 2, padding: '10px 0', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 700, opacity: (!forgotEmail || loading) ? 0.6 : 1 }}>
                        {loading ? 'Enviando...' : 'Enviar link'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {error && (
              <div style={{ background: '#FEF2F2', border: `1px solid ${C.danger}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: C.danger }}>
                {error}
              </div>
            )}
            <Btn onClick={handleLogin} style={{ width: '100%', marginBottom: 16 }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Btn>
          </>
        )}

        {/* ── REGISTRO ── */}
        {mode === 'register' && (
          <>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Input label="Nombre *" placeholder="Ej: María"
                  value={reg.nombre} onChange={e => updReg('nombre', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <Input label="Apellido *" placeholder="Ej: García"
                  value={reg.apellido} onChange={e => updReg('apellido', e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>País de nacimiento</label>
              <select value={reg.pais} onChange={e => updReg('pais', e.target.value)} style={selectStyle}>
                {PAISES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Fecha de nacimiento *</label>
              <input type="date" value={reg.fechaNac} onChange={e => updReg('fechaNac', e.target.value)} style={selectStyle} />
            </div>

            <Input label="Correo electrónico *" placeholder="tu@correo.com" type="email"
              value={reg.email} onChange={e => updReg('email', e.target.value)} icon={<Mail size={15} />} />

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: emailMismatch ? C.danger : C.textSec, marginBottom: 4, display: 'block' }}>
                Confirmar correo *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted }}><Mail size={15} /></span>
                <input
                  type="email" placeholder="Repite tu correo" value={reg.emailConf}
                  onChange={e => updReg('emailConf', e.target.value)}
                  style={{
                    width: '100%', padding: '11px 12px 11px 38px',
                    border: `1.5px solid ${emailMismatch ? C.danger : C.border}`,
                    borderRadius: 10, fontSize: 14, color: C.text,
                    background: emailMismatch ? '#FEF2F2' : '#fff',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
              {emailMismatch && <div style={{ fontSize: 11, color: C.danger, marginTop: 4 }}>Los correos no coinciden</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>
                Número de teléfono *
              </label>
              <div style={{ display: 'flex', border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.card }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px',
                  background: C.cardElevated, borderRight: `1.5px solid ${C.border}`,
                  fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  🇵🇪 +51
                </div>
                <input
                  type="tel"
                  placeholder="987 654 321"
                  value={reg.telefono}
                  onChange={e => updReg('telefono', e.target.value.replace(/[^0-9 ]/g, ''))}
                  style={{
                    flex: 1, padding: '11px 12px', border: 'none', outline: 'none',
                    fontSize: 14, color: C.text, background: 'transparent', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>
                Distrito *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, pointerEvents: 'none', zIndex: 1 }}>
                  <MapPin size={15} />
                </span>
                <select
                  value={reg.distrito}
                  onChange={e => updReg('distrito', e.target.value)}
                  style={{ ...selectStyle, paddingLeft: 36, color: reg.distrito ? C.text : C.textMuted }}
                >
                  <option value="" disabled hidden>Selecciona tu distrito</option>
                  {DISTRITOS_LIMA.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>
                Contraseña *
              </label>
              <input
                type="password"
                placeholder="Mín. 8 caracteres"
                value={reg.pass}
                onChange={e => updReg('pass', e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: `1.5px solid ${reg.pass && !passValid ? C.danger : C.border}`,
                  borderRadius: 10, fontSize: 14, color: C.text,
                  background: C.card, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              {reg.pass && (
                <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
                  {[
                    { ok: passReqs.length, label: '8 caracteres' },
                    { ok: passReqs.upper,  label: '1 mayúscula' },
                    { ok: passReqs.number, label: '1 número' },
                    { ok: passReqs.symbol, label: '1 símbolo (!@#...)' },
                  ].map(({ ok, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                      <span style={{ color: ok ? C.success : C.danger, fontWeight: 700 }}>{ok ? '✓' : '✗'}</span>
                      <span style={{ color: ok ? C.success : C.textMuted }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: passMismatch ? C.danger : C.textSec, marginBottom: 4, display: 'block' }}>
                Confirmar contraseña *
              </label>
              <input
                type="password" placeholder="Repite tu contraseña" value={reg.passConf}
                onChange={e => updReg('passConf', e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: `1.5px solid ${passMismatch ? C.danger : C.border}`,
                  borderRadius: 10, fontSize: 14, color: C.text,
                  background: passMismatch ? '#FEF2F2' : '#fff',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              {passMismatch && <div style={{ fontSize: 11, color: C.danger, marginTop: 4 }}>Las contraseñas no coinciden</div>}
            </div>

            {regSuccess && (
              <div style={{ background: '#ECFDF5', border: `1px solid ${C.success}40`, borderRadius: 10, padding: '12px 14px', marginBottom: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>📧</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>¡Revisa tu correo!</div>
                <div style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>Te enviamos un link para confirmar tu cuenta.</div>
              </div>
            )}
            {error && (
              <div style={{ background: '#FEF2F2', border: `1px solid ${C.danger}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: C.danger }}>
                {error}
              </div>
            )}
            <Btn onClick={handleRegister} style={{ width: '100%', marginBottom: 16 }} disabled={!regFilled || loading || regSuccess}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Btn>
          </>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>O continúa con</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Social */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" onClick={() => onLogin({ email: 'google@user.com', nombre: 'Usuario', apellido: 'Google' })} style={{ flex: 1, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 16 }}>🇬</span> Google
          </Btn>
          <Btn variant="ghost" onClick={() => setMode('phone')} style={{ flex: 1, border: `1px solid ${C.border}` }}>
            <Phone size={15} /> Teléfono
          </Btn>
        </div>

        {mode === 'phone' && (
          <div style={{ marginTop: 16 }}>
            <Input label="Número de celular" placeholder="+51 987 654 321" type="tel" icon={<Phone size={15} />} />
            <Btn style={{ width: '100%' }} onClick={() => onLogin({ email: 'sms@user.com', nombre: 'Usuario', apellido: 'SMS' })}>Enviar código SMS</Btn>
          </div>
        )}

        {/* Legal */}
        <div style={{
          marginTop: 24, padding: 14, background: '#FFF7ED',
          borderRadius: 10, border: `1px solid #FED7AA`,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <AlertCircle size={14} color={C.warning} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}>
              <strong>Aviso Legal:</strong> Cachuelo es una plataforma de intermediación. Solo facilitamos el contacto entre partes. No somos empleadores ni garantizamos resultados. Al registrarte aceptas nuestros{' '}
              <span style={{ color: C.primary, fontWeight: 600 }}>Términos de Uso</span> y{' '}
              <span style={{ color: C.primary, fontWeight: 600 }}>Política de Privacidad</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. HOME ─────────────────────────────────────────────────────────────────────
const HomeScreen = ({ onNavigate, onViewCachuelo, cachuelos, user, onNotifications }) => {
  const { C, isDark } = useTheme();
  const [filter, setFilter] = useState('Todos');
  const [selectedCat, setSelectedCat] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    const fetchCount = async () => {
      const readIds = JSON.parse(localStorage.getItem('cachuelo_read_notifs') || '[]');
      let count = 0;

      // Postulaciones recibidas no leídas (como publicador)
      const { data: misCachuelos } = await supabase.from('cachuelos').select('id').eq('user_id', user.id);
      const cachIds = (misCachuelos || []).map(c => c.id);
      if (cachIds.length > 0) {
        const { data: posts } = await supabase.from('postulaciones').select('id').in('cachuelo_id', cachIds);
        count += (posts || []).filter(p => !readIds.includes(`pub-${p.id}`)).length;
      }

      // Mis postulaciones con estado cambiado, no leídas (como postulante)
      const { data: misPostulaciones } = await supabase.from('postulaciones')
        .select('id').eq('postulante_id', user.id).neq('estado', 'Pendiente');
      count += (misPostulaciones || []).filter(p => !readIds.includes(`post-${p.id}`)).length;

      // Mensajes no leídos (siempre exacto desde BD)
      const { count: c3 } = await supabase.from('mensajes')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id).eq('leido', false);
      count += c3 || 0;

      setNotifCount(count);
    };
    fetchCount();
  }, [user?.id]);
  const filters = ['Todos', 'Destacados', 'Remoto', 'Cerca'];

  const filteredCachuelos = cachuelos.filter(c => {
    if (filter === 'Destacados') return c.featured;
    if (filter === 'Remoto') return c.remote;
    if (selectedCat) return c.category === selectedCat;
    return true;
  });

  return (
    <Screen withTabs activeTab="home" onNavigate={onNavigate}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.headerBg} 0%, ${C.headerDark} 100%)`,
        padding: '44px 20px 20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Buenos días 👋</div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginTop: 2 }}>Hola, {user?.nombre || 'Cachueler@'}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onNotifications} style={{
              width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <Bell size={18} color="#fff" />
              {notifCount > 0 && (
                <div style={{ position: 'absolute', top: 5, right: 5, minWidth: 16, height: 16, background: '#FCD34D', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#000', padding: '0 3px' }}>
                  {notifCount > 99 ? '99+' : notifCount}
                </div>
              )}
            </button>
            <button onClick={() => onNavigate('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Avatar initials={user ? (`${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`).toUpperCase() || 'U' : 'U'} size={38} bg="rgba(255,255,255,0.25)" fontSize={13} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          background: 'rgba(255,255,255,0.95)', borderRadius: 12, display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          <Search size={16} color="#9BA3BC" />
          <input placeholder="Buscar cachuelos..." style={{
            flex: 1, border: 'none', outline: 'none', fontSize: 14,
            color: '#0D1B3E', padding: '12px 0', fontFamily: 'inherit', background: 'transparent',
          }} onClick={() => onNavigate('search')} readOnly />
          <button onClick={() => onNavigate('search')} style={{
            background: C.primary, border: 'none', borderRadius: 8,
            padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}>
            <Filter size={14} color="#fff" />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 0 16px' }}>
        {/* Categories */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Categorías</div>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCat === cat.label;
            const catBg = isSelected ? C.primary
              : isDark ? 'rgba(255,255,255,0.07)' : cat.color;
            const catBorder = isSelected ? C.primary
              : isDark ? 'rgba(255,255,255,0.12)' : 'transparent';
            return (
              <button key={cat.id} onClick={() => setSelectedCat(isSelected ? null : cat.label)}
                style={{
                  flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 6, background: catBg, border: `1.5px solid ${catBorder}`,
                  borderRadius: 16, padding: '10px 12px', cursor: 'pointer', minWidth: 68,
                  transition: 'all .2s',
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: isSelected ? 'rgba(255,255,255,0.25)' : `linear-gradient(135deg, ${cat.iconBgA}, ${cat.iconBgB})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isSelected ? 'none' : `0 3px 8px ${cat.iconBgA}50`,
                }}>
                  <cat.Icon size={18} color="#fff" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: isSelected ? '#fff' : C.text, whiteSpace: 'nowrap' }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {filters.map(f => (
            <button key={f} onClick={() => { setFilter(f); setSelectedCat(null); }}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none',
                fontWeight: 600, fontSize: 12, cursor: 'pointer',
                background: filter === f ? C.primary : C.cardElevated,
                color: filter === f ? '#fff' : C.text,
                border: filter === f ? 'none' : `1px solid ${C.border}`,
                transition: 'all .2s',
              }}>{f}</button>
          ))}
        </div>

        {/* Feed */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
              {filteredCachuelos.length} cachuelo{filteredCachuelos.length !== 1 ? 's' : ''} disponible{filteredCachuelos.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredCachuelos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 600 }}>Sin resultados</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Intenta con otro filtro</div>
            </div>
          )}

          {filteredCachuelos.map(c => (
            <CachuCard key={c.id} c={c} onPress={() => onViewCachuelo(c)} />
          ))}
        </div>
      </div>
    </Screen>
  );
};

// Card de cachuelo
const CachuCard = ({ c, onPress }) => {
  const { C, isDark } = useTheme();
  return (
  <div onClick={onPress} style={{
    background: C.card, borderRadius: 18, padding: 16, marginBottom: 12,
    boxShadow: '0 2px 16px rgba(13,27,62,0.07)', cursor: 'pointer',
    border: `1px solid ${C.border}`, transition: 'transform .15s, box-shadow .15s',
    overflow: 'hidden', position: 'relative',
  }}
    onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.975)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(13,27,62,0.05)'; }}
    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(13,27,62,0.07)'; }}
  >
    {c.featured && (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${C.warning}, ${C.primary})` }} />
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
        <CategoryIcon label={c.category} size={44} iconSize={22} radius={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.3, marginBottom: 4 }}>{c.title}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {c.featured && <Badge color={C.warning}>⭐ Destacado</Badge>}
            <Badge color={c.remote ? C.purple : C.success}>{c.remote ? '🌐 Remoto' : '📍 Presencial'}</Badge>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>S/{c.price}</div>
        <div style={{ fontSize: 10, color: C.textMuted }}>Total</div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textSec }}>
        <MapPin size={12} /> {c.location}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textSec }}>
        <Clock size={12} /> {c.duration}
      </span>
    </div>

    {/* Publisher */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar initials={c.publisher.avatar} size={28} bg={C.primaryLight} fontSize={11} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: 4 }}>
            {c.publisher.name}
            {c.publisher.verified && <CheckCircle size={12} color={C.success} />}
          </div>
          <Stars rating={c.publisher.rating} />
        </div>
      </div>
      <ChevronRight size={16} color={C.textMuted} />
    </div>
  </div>
  );
};

// ── REPORTE MODAL ─────────────────────────────────────────────────────────────
const MOTIVOS_REPORTE = [
  'Fraude o estafa',
  'Contenido inapropiado',
  'Spam o publicidad falsa',
  'Información falsa',
  'Comportamiento sospechoso',
  'Otro',
];

const ReporteModal = ({ tipo, targetId, targetTitle, reporterId, onClose }) => {
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!motivo) { setErrorMsg('Selecciona un motivo.'); return; }
    if (!reporterId) { setErrorMsg('Debes iniciar sesión para reportar.'); return; }
    setSubmitting(true);
    const payload = {
      reporter_id: reporterId,
      tipo,
      motivo,
      descripcion: descripcion.trim() || null,
      estado: 'pendiente',
      ...(tipo === 'cachuelo' ? { reported_cachuelo_id: targetId } : { reported_user_id: targetId }),
    };
    const { error } = await supabase.from('reportes').insert(payload);
    setSubmitting(false);
    if (!error) {
      setDone(true);
    } else {
      console.error('Error al reportar:', error);
      setErrorMsg(`Error: ${error.message} (código: ${error.code})`);
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: C.card, borderRadius: '20px 20px 0 0', padding: '20px 20px 36px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 20px' }} />
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>Reporte enviado</div>
            <div style={{ fontSize: 13, color: C.textSec, marginBottom: 24 }}>Gracias. Nuestro equipo revisará tu reporte en breve.</div>
            <Btn onClick={onClose} style={{ width: '100%' }}>Cerrar</Btn>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Flag size={18} color={C.danger} />
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                Reportar {tipo === 'cachuelo' ? 'cachuelo' : 'usuario'}
              </div>
            </div>
            {targetTitle && <div style={{ fontSize: 12, color: C.textSec, marginBottom: 20 }}>{targetTitle}</div>}
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>¿Cuál es el motivo?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {MOTIVOS_REPORTE.map(m => (
                <button key={m} onClick={() => setMotivo(m)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  borderRadius: 10, border: `2px solid ${motivo === m ? C.danger : C.border}`,
                  background: motivo === m ? '#FEF2F2' : '#fff', cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: 8, border: `2px solid ${motivo === m ? C.danger : C.border}`, background: motivo === m ? C.danger : '#fff', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.text, fontWeight: motivo === m ? 600 : 400 }}>{m}</span>
                </button>
              ))}
            </div>
            <Textarea label="Detalles adicionales (opcional)" placeholder="Describe qué ocurrió..." value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} />
            {errorMsg && (
              <div style={{ background: '#FEF2F2', border: `1px solid ${C.danger}40`, borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 12, color: C.danger }}>
                {errorMsg}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</Btn>
              <Btn onClick={handleSubmit} disabled={!motivo || submitting}
                style={{ flex: 2, background: C.danger, borderColor: C.danger }}>
                {submitting ? 'Enviando...' : <><Flag size={14} /> Enviar reporte</>}
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 5. DETALLE DE CACHUELO ──────────────────────────────────────────────────────
const DetailScreen = ({ cachuelo, onBack, onNavigate, user, onRequireAuth, onViewPublisher, onVerPostulantes }) => {
  const { C, isDark } = useTheme();
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicantCount, setApplicantCount] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReporte, setShowReporte] = useState(false);

  const isOwner = user?.id && cachuelo?.userId && user.id === cachuelo.userId;

  useEffect(() => {
    if (!user?.id || !cachuelo?.id) return;
    if (isOwner) {
      supabase.from('postulaciones')
        .select('id', { count: 'exact' })
        .eq('cachuelo_id', cachuelo.id)
        .then(({ count }) => setApplicantCount(count ?? 0));
    } else {
      supabase.from('postulaciones')
        .select('id')
        .eq('cachuelo_id', cachuelo.id)
        .eq('postulante_id', user.id)
        .maybeSingle()
        .then(({ data }) => { if (data) setApplied(true); });
    }
  }, [user?.id, cachuelo?.id, isOwner]);

  if (!cachuelo) return null;

  const shareText = `🛠 ${cachuelo.title}\n📍 ${cachuelo.location} | ⏱ ${cachuelo.duration} | 💰 S/${cachuelo.price}\n\nPostúlate en Cachuelo 👇`;
  const shareUrl  = 'https://cachuelo.pe';

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: cachuelo.title, text: shareText, url: shareUrl }); }
      catch (_) {}
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const pubName    = cachuelo.publisher?.name    || 'Usuario';
  const pubRating  = cachuelo.publisher?.rating  ?? 0;
  const pubVerified = cachuelo.publisher?.verified ?? false;
  const pubAvatar  = cachuelo.publisher?.avatar  || 'U';
  const fechaDisplay = cachuelo?.fecha_inicio === 'flexible'
    ? 'A coordinar'
    : cachuelo?.fecha_inicio
      ? new Date(cachuelo.fecha_inicio + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : cachuelo?.schedule || '';

  const handleApply = async () => {
    if (!user) { onRequireAuth(); return; }
    if (applied || applying) return;
    setApplying(true);
    const { data: postData, error } = await supabase.from('postulaciones').insert({
      cachuelo_id: cachuelo.id,
      postulante_id: user.id,
      mensaje: message,
      estado: 'Pendiente',
    }).select().single();
    setApplying(false);
    if (!error) {
      setApplied(true);
      if (postData?.id) {
        await supabase.from('postulacion_historial').insert({ postulacion_id: postData.id, estado: 'Pendiente' });
      }
    }
  };

  return (
    <Screen withTabs activeTab="home" onNavigate={onNavigate}>
      {/* Sticky header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`,
        padding: '44px 20px 20px',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', flex: 1, noWrap: true,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Detalle del Cachuelo
          </div>
          <button onClick={handleShare} style={{
            width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 size={16} color="#fff" />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {/* Title card */}
        <div style={{ background: C.card, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
            <CategoryIcon label={cachuelo.category} size={54} iconSize={26} radius={16} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: C.text, lineHeight: 1.3, marginBottom: 6 }}>{cachuelo.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {cachuelo.featured && <Badge color={C.warning}>⭐ Destacado</Badge>}
                <Badge color={cachuelo.remote ? C.purple : C.success}>{cachuelo.type}</Badge>
                <Badge color={C.primary}>{cachuelo.category}</Badge>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 0, background: C.cardElevated, borderRadius: 12, overflow: 'hidden' }}>
            {[
              { icon: DollarSign, label: 'Pago', value: `S/${cachuelo.price}`, color: C.primary },
              { icon: MapPin, label: 'Lugar', value: cachuelo.location, color: C.success },
              { icon: Clock, label: 'Duración', value: cachuelo.duration, color: C.purple },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  flex: 1, padding: '12px 8px', textAlign: 'center',
                  borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                }}>
                  <Icon size={16} color={item.color} style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 11, color: C.textMuted }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginTop: 2 }}>{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>Descripción</div>
          <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.7 }}>{cachuelo.description}</p>
          {fechaDisplay ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fecha de inicio</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: C.success + '20', borderRadius: 10 }}>
                <Calendar size={14} color={C.success} />
                <span style={{ fontSize: 12, color: C.success, fontWeight: 500 }}>{fechaDisplay}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Publisher */}
        <div onClick={() => cachuelo.userId && onViewPublisher?.(cachuelo.userId)}
          style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: cachuelo.userId ? 'pointer' : 'default' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Publicado por</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials={pubAvatar} size={48} bg={C.primaryLight} fontSize={16} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{pubName}</span>
                {pubVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#ECFDF5', padding: '2px 7px', borderRadius: 10 }}>
                    <Shield size={10} color={C.success} />
                    <span style={{ fontSize: 10, color: C.success, fontWeight: 600 }}>Verificado</span>
                  </div>
                )}
              </div>
              {pubRating > 0
                ? <><Stars rating={pubRating} size={14} /><span style={{ fontSize: 11, color: C.textSec, marginLeft: 4 }}>{pubRating} / 5</span></>
                : <span style={{ fontSize: 11, color: C.textMuted }}>Sin reseñas todavía</span>
              }
            </div>
            {cachuelo.userId && <ChevronRight size={18} color={C.textMuted} />}
          </div>
        </div>

        {/* Message + Apply / Owner panel */}
        {isOwner ? (
          <div style={{ background: C.card, borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Tu publicación</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.cardElevated, borderRadius: 12, padding: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: C.primary + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} color={C.primary} />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.primary, lineHeight: 1 }}>
                  {applicantCount === null ? '...' : applicantCount}
                </div>
                <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>
                  {applicantCount === 1 ? 'persona se postuló' : 'personas se postularon'}
                </div>
              </div>
            </div>
            {applicantCount > 0 && (
              <Btn onClick={() => onVerPostulantes?.(cachuelo)} style={{ width: '100%', marginTop: 14 }}>
                <Users size={16} /> Ver postulantes
              </Btn>
            )}
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Textarea
              label="Tu mensaje (opcional)"
              placeholder="Cuéntale por qué eres el candidato ideal para este cachuelo..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
            />
            <Btn
              onClick={handleApply}
              style={{ width: '100%', fontSize: 15, padding: '14px 0' }}
              disabled={applied || applying}
            >
              {applied ? <><CheckCircle size={18} /> Postulado con éxito</> : applying ? 'Enviando...' : <><Send size={18} /> Postularme</>}
            </Btn>
            {applied && (
              <p style={{ fontSize: 11, color: C.success, textAlign: 'center', marginTop: 8 }}>
                ¡Tu postulación fue enviada! El publicador te contactará pronto.
              </p>
            )}
          </div>
        )}

        {user && !isOwner && (
          <button onClick={() => setShowReporte(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
            cursor: 'pointer', color: C.textMuted, fontSize: 12, padding: '12px 0', margin: '0 auto',
          }}>
            <Flag size={12} /> Reportar este cachuelo
          </button>
        )}
      </div>

      {showReporte && (
        <ReporteModal
          tipo="cachuelo"
          targetId={cachuelo.id}
          targetTitle={cachuelo.title}
          reporterId={user?.id}
          onClose={() => setShowReporte(false)}
        />
      )}

      {/* Share bottom sheet */}
      {showShareModal && (
        <div
          onClick={() => setShowShareModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: C.card, borderRadius: '20px 20px 0 0', padding: '20px 20px 36px' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>Compartir cachuelo</div>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 20, lineHeight: 1.4 }}>
              {cachuelo.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '💬', label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}` },
                { emoji: '✈️', label: 'Telegram',  color: '#0088CC', href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
                { emoji: '🐦', label: 'X (Twitter)', color: '#000', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}` },
                { emoji: '💼', label: 'LinkedIn', color: '#0077B5', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
              ].map(({ emoji, label, color, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  onClick={() => setShowShareModal(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: '#F9FAFB', textDecoration: 'none', border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color }}>{label}</span>
                </a>
              ))}
              <button onClick={handleCopyLink} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                borderRadius: 12, background: copied ? '#F0FDF4' : '#F9FAFB',
                border: `1px solid ${copied ? C.success : C.border}`, cursor: 'pointer', width: '100%',
              }}>
                <span style={{ fontSize: 22 }}>{copied ? '✅' : '🔗'}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: copied ? C.success : C.text }}>
                  {copied ? '¡Copiado!' : 'Copiar enlace'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
};

// 6. PUBLICAR ─────────────────────────────────────────────────────────────────
const PublishScreen = ({ onNavigate, user, onPublished }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', category: '', description: '',
    price: '', payType: 'Fijo', district: '', duration: '',
    durNum: '', durUnit: 'día(s)', startDate: '',
    tipo: 'Presencial', featured: false, payMethod: '',
  });
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const stepLabels = ['Info básica', 'Detalles', 'Pago'];

  const handlePublish = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    const cat = CATEGORIES.find(c => c.label === form.category);
    const { error: err } = await supabase.from('cachuelos').insert({
      user_id: user.id,
      titulo: form.title,
      descripcion: form.description,
      categoria_id: cat?.id || null,
      precio: Number(form.price),
      tipo_pago: form.payType,
      distrito: form.district,
      duracion: form.duration,
      tipo: form.tipo,
      destacado: form.featured,
      fecha_inicio: form.startDate === 'flexible' ? null : (form.startDate || null),
      fecha_flexible: form.startDate === 'flexible',
      estado: 'Activo',
    });
    setSaving(false);
    if (err) { console.error('Supabase insert error:', err); setError(`Error: ${err.message} (code: ${err.code})`); return; }
    await onPublished?.();
    setPublished(true);
  };

  if (published) {
    return (
      <Screen withTabs activeTab="publish" onNavigate={onNavigate}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center', minHeight: 600 }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>¡Cachuelo Publicado!</div>
          <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 32 }}>
            Tu cachuelo ya está visible para cientos de trabajadores. Te notificaremos cuando lleguen postulaciones.
          </div>
          <div style={{ background: '#ECFDF5', borderRadius: 16, padding: 16, marginBottom: 24, width: '100%' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 4 }}>Cobro procesado</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.success }}>
              S/{form.featured ? 8 : 5}
            </div>
            <div style={{ fontSize: 11, color: '#166534' }}>
              Publicación {form.featured ? '+ Destacado' : 'estándar'}
            </div>
          </div>
          <Btn style={{ width: '100%' }} onClick={() => { setPublished(false); setStep(1); setForm({ title:'',category:'',description:'',price:'',payType:'Fijo',district:'',duration:'',featured:false,payMethod:'' }); onNavigate('home'); }}>
            Volver al inicio
          </Btn>
        </div>
      </Screen>
    );
  }

  return (
    <Screen withTabs activeTab="publish" onNavigate={onNavigate}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 20px' }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Publicar Cachuelo</div>
        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 0 }}>
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {i > 0 && <div style={{ flex: 1, height: 2, background: done || active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }} />}
                  <div style={{
                    width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                    background: done ? C.success : active ? '#fff' : 'rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? '#fff' : active ? C.primary : 'rgba(255,255,255,0.7)',
                    fontWeight: 700, fontSize: 12,
                  }}>
                    {done ? <Check size={14} /> : n}
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }} />}
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '20px 20px 16px' }}>
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Input label="Título del cachuelo *" placeholder="Ej: Necesito diseñador para logo" value={form.title} onChange={e => upd('title', e.target.value)} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 6, display: 'block' }}>Categoría *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => upd('category', cat.label)}
                    style={{
                      padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${form.category === cat.label ? C.primary : C.border}`,
                      background: form.category === cat.label ? C.primary + '18' : C.card,
                      color: form.category === cat.label ? C.primary : C.text,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: `linear-gradient(135deg, ${cat.iconBgA}, ${cat.iconBgB})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <cat.Icon size={11} color="#fff" strokeWidth={2.5} />
                    </div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <Textarea label="Descripción *" placeholder="Describe detalladamente lo que necesitas..." value={form.description} onChange={e => upd('description', e.target.value)} rows={4} />
            <Btn onClick={() => setStep(2)} style={{ width: '100%' }} disabled={!form.title || !form.category || !form.description}>
              Siguiente <ChevronRight size={16} />
            </Btn>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Input label="Pago (S/) *" placeholder="200" type="number" value={form.price} onChange={e => upd('price', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Tipo de pago</label>
                <select value={form.payType} onChange={e => upd('payType', e.target.value)} style={{
                  width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`,
                  borderRadius: 10, fontSize: 14, color: C.text, background: C.card, outline: 'none', fontFamily: 'inherit',
                }}>
                  {['Fijo', 'Por hora', 'Por entrega', 'A convenir'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 6, display: 'block' }}>Modalidad</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Presencial', 'Remoto'].map(t => (
                  <button key={t} onClick={() => upd('tipo', t)} style={{
                    flex: 1, padding: '9px 0', borderRadius: 10,
                    border: `1.5px solid ${form.tipo === t ? C.primary : C.border}`,
                    background: form.tipo === t ? C.primary + '12' : C.card,
                    color: form.tipo === t ? C.primary : C.text,
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}>
                    {t === 'Presencial' ? '📍' : '🌐'} {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>
                Distrito *
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} color={C.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={form.district}
                  onChange={e => upd('district', e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px 11px 34px',
                    border: `1.5px solid ${form.district ? C.primary : C.border}`,
                    borderRadius: 10, fontSize: 14, color: form.district ? C.text : C.textMuted,
                    background: C.card, outline: 'none', fontFamily: 'inherit',
                    appearance: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">Selecciona un distrito...</option>
                  {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec }}>Fecha de inicio *</label>
                <button onClick={() => upd('startDate', form.startDate === 'flexible' ? '' : 'flexible')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: form.startDate === 'flexible' ? C.primary : C.textMuted }}>
                  <div style={{ width: 32, height: 18, borderRadius: 9, background: form.startDate === 'flexible' ? C.primary : C.border, position: 'relative', transition: 'background .2s' }}>
                    <div style={{ position: 'absolute', top: 2, left: form.startDate === 'flexible' ? 16 : 2, width: 14, height: 14, borderRadius: 7, background: '#fff', transition: 'left .2s' }} />
                  </div>
                  A coordinar
                </button>
              </div>
              {form.startDate !== 'flexible' && (
                <input type="date" value={form.startDate} min={new Date().toISOString().split('T')[0]}
                  onChange={e => upd('startDate', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', boxSizing: 'border-box', border: `1.5px solid ${form.startDate ? C.primary : C.border}`, borderRadius: 10, fontSize: 14, color: form.startDate ? C.text : C.textMuted, background: C.card, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }} />
              )}
              {form.startDate === 'flexible' && (
                <div style={{ padding: '10px 14px', background: C.primary + '12', borderRadius: 10, fontSize: 13, color: C.primary, fontWeight: 500 }}>
                  📅 Se coordinará con el trabajador aceptado
                </div>
              )}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Duración máxima (máx. 30 días)</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {['1 día','2 días','1 semana','2 semanas','3 semanas','1 mes'].map(d => (
                  <button key={d} onClick={() => { upd('duration', d); upd('durNum', ''); upd('durUnit', 'día(s)'); }} style={{
                    padding: '7px 12px', borderRadius: 20, border: `1.5px solid ${form.duration === d ? C.primary : C.border}`,
                    background: form.duration === d ? C.primary : '#fff',
                    color: form.duration === d ? '#fff' : C.text,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>{d}</button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.textSec, whiteSpace: 'nowrap' }}>Otro:</span>
                <input
                  type="number" min="1" max="30" placeholder="Nº"
                  value={form.durNum}
                  onChange={e => {
                    const n = e.target.value;
                    upd('durNum', n);
                    if (n) upd('duration', `${n} ${form.durUnit}`);
                    else upd('duration', '');
                  }}
                  style={{
                    width: 64, padding: '8px 10px', textAlign: 'center',
                    border: `1.5px solid ${form.durNum ? C.primary : C.border}`,
                    borderRadius: 10, fontSize: 13, color: C.text, outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <select
                  value={form.durUnit}
                  onChange={e => {
                    upd('durUnit', e.target.value);
                    if (form.durNum) upd('duration', `${form.durNum} ${e.target.value}`);
                  }}
                  style={{
                    flex: 1, padding: '8px 10px', border: `1.5px solid ${C.border}`,
                    borderRadius: 10, fontSize: 13, color: C.text,
                    background: C.card, outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  <option value="día(s)">día(s)</option>
                  <option value="semana(s)">semana(s)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}><ChevronLeft size={16} /> Atrás</Btn>
              <Btn onClick={() => setStep(3)} style={{ flex: 2 }} disabled={!form.price || !form.district || !form.duration || !form.startDate && form.startDate !== 'flexible'}>
                Siguiente <ChevronRight size={16} />
              </Btn>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Resumen de costos</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.textSec }}>Publicación estándar</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>S/5.00</span>
              </div>

              {/* Featured toggle */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, margin: '8px 0',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>⭐ Destacado</div>
                  <div style={{ fontSize: 11, color: C.textSec }}>Aparece primero en resultados</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.warning }}>+S/3</span>
                  <div
                    onClick={() => upd('featured', !form.featured)}
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: form.featured ? C.primary : '#D1D5DB',
                      cursor: 'pointer', position: 'relative', transition: 'background .2s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 2,
                      left: form.featured ? 22 : 2,
                      width: 20, height: 20, borderRadius: 10,
                      background: '#fff', transition: 'left .2s',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>S/{form.featured ? 8 : 5}.00</span>
              </div>
            </div>

            {/* Payment methods */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 8, display: 'block' }}>Método de pago</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'yape', label: 'Yape', emoji: '💜', desc: 'Pago instantáneo' },
                  { id: 'plin', label: 'Plin', emoji: '💚', desc: 'Pago instantáneo' },
                  { id: 'card', label: 'Tarjeta', emoji: '💳', desc: 'Visa / Mastercard' },
                ].map(m => (
                  <button key={m.id} onClick={() => upd('payMethod', m.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    border: `1.5px solid ${form.payMethod === m.id ? C.primary : C.border}`,
                    borderRadius: 12, background: form.payMethod === m.id ? C.primary + '08' : '#fff',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <span style={{ fontSize: 22 }}>{m.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: C.textSec }}>{m.desc}</div>
                    </div>
                    {form.payMethod === m.id && <CheckCircle size={18} color={C.primary} style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#DC2626' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => setStep(2)} style={{ flex: 1 }} disabled={saving}><ChevronLeft size={16} /> Atrás</Btn>
              <Btn onClick={handlePublish} style={{ flex: 2 }} disabled={!form.payMethod || saving}>
                <Zap size={16} /> {saving ? 'Publicando...' : `Publicar S/${form.featured ? 8 : 5}`}
              </Btn>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
};

// 7. EDITAR CACHUELO ──────────────────────────────────────────────────────────
const EDIT_DURATION_PRESETS = ['1 día','2 días','1 semana','2 semanas','3 semanas','1 mes'];

const parseCustomDur = (dur) => {
  if (!dur || EDIT_DURATION_PRESETS.includes(dur)) return { durNum: '', durUnit: 'día(s)' };
  const m = dur.match(/^(\d+)\s+(\S+)/);
  if (!m) return { durNum: '', durUnit: 'día(s)' };
  return { durNum: m[1], durUnit: m[2].startsWith('semana') ? 'semana(s)' : 'día(s)' };
};

const EditCachueloScreen = ({ cachuelo, onBack, onSaved, onNavigate }) => {
  const parsed = parseCustomDur(cachuelo?.duration);
  const [form, setForm] = useState({
    title:       cachuelo?.title        || '',
    category:    cachuelo?.category     || '',
    description: cachuelo?.description  || '',
    price:       cachuelo?.price        ? String(cachuelo.price) : '',
    payType:     cachuelo?.payType      || 'Fijo',
    district:    cachuelo?.location     || '',
    duration:    cachuelo?.duration     || '',
    durNum:      parsed.durNum,
    durUnit:     parsed.durUnit,
    startDate:   cachuelo?.fecha_inicio || '',
    tipo:        cachuelo?.type         || 'Presencial',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);
  const [saved, setSaved]   = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const cat = CATEGORIES.find(c => c.label === form.category);
    const { error: err } = await supabase.from('cachuelos').update({
      titulo:       form.title,
      descripcion:  form.description,
      categoria_id: cat?.id || null,
      precio:       Number(form.price),
      tipo_pago:    form.payType,
      distrito:     form.district,
      duracion:     form.duration,
      tipo:         form.tipo,
      fecha_inicio: form.startDate === 'flexible' ? null : (form.startDate || null),
      fecha_flexible: form.startDate === 'flexible',
    }).eq('id', cachuelo.id);
    setSaving(false);
    if (err) { setError(`Error: ${err.message}`); return; }
    await onSaved?.();
    setSaved(true);
  };

  const canSave = form.title && form.category && form.description && form.price && form.district && form.duration;

  if (saved) return (
    <Screen withTabs activeTab="mycachuelos" onNavigate={onNavigate}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center', minHeight: 500 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>¡Cambios guardados!</div>
        <div style={{ fontSize: 13, color: C.textSec, marginBottom: 32 }}>Tu cachuelo ha sido actualizado.</div>
        <Btn style={{ width: '100%' }} onClick={onBack}>Volver a Mis Cachuelos</Btn>
      </div>
    </Screen>
  );

  return (
    <Screen withTabs activeTab="mycachuelos" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>Editar Cachuelo</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 1, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cachuelo?.title}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 32px' }}>
        {/* Info básica */}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Info básica</div>
        <Input label="Título *" placeholder="Ej: Necesito diseñador para logo" value={form.title} onChange={e => upd('title', e.target.value)} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 6, display: 'block' }}>Categoría *</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => upd('category', cat.label)}
                style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${form.category === cat.label ? C.primary : C.border}`, background: form.category === cat.label ? C.primary + '18' : C.card, color: form.category === cat.label ? C.primary : C.text, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: `linear-gradient(135deg, ${cat.iconBgA}, ${cat.iconBgB})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <cat.Icon size={11} color="#fff" strokeWidth={2.5} />
                </div>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <Textarea label="Descripción *" placeholder="Describe detalladamente lo que necesitas..." value={form.description} onChange={e => upd('description', e.target.value)} rows={4} />

        {/* Detalles */}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Detalles</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Input label="Pago (S/) *" placeholder="200" type="number" value={form.price} onChange={e => upd('price', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Tipo de pago</label>
            <select value={form.payType} onChange={e => upd('payType', e.target.value)} style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, background: C.card, outline: 'none', fontFamily: 'inherit' }}>
              {['Fijo', 'Por hora', 'Por entrega', 'A convenir'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 6, display: 'block' }}>Modalidad</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Presencial', 'Remoto'].map(t => (
              <button key={t} onClick={() => upd('tipo', t)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: `1.5px solid ${form.tipo === t ? C.primary : C.border}`, background: form.tipo === t ? C.primary + '12' : C.card, color: form.tipo === t ? C.primary : C.text, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                {t === 'Presencial' ? '📍' : '🌐'} {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Distrito *</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={15} color={C.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select value={form.district} onChange={e => upd('district', e.target.value)} style={{ width: '100%', padding: '11px 14px 11px 34px', border: `1.5px solid ${form.district ? C.primary : C.border}`, borderRadius: 10, fontSize: 14, color: form.district ? C.text : C.textMuted, background: C.card, outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' }}>
              <option value="">Selecciona un distrito...</option>
              {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec }}>Fecha de inicio</label>
            <button onClick={() => upd('startDate', form.startDate === 'flexible' ? '' : 'flexible')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: form.startDate === 'flexible' ? C.primary : C.textMuted }}>
              <div style={{ width: 32, height: 18, borderRadius: 9, background: form.startDate === 'flexible' ? C.primary : C.border, position: 'relative', transition: 'background .2s' }}>
                <div style={{ position: 'absolute', top: 2, left: form.startDate === 'flexible' ? 16 : 2, width: 14, height: 14, borderRadius: 7, background: '#fff', transition: 'left .2s' }} />
              </div>
              A coordinar
            </button>
          </div>
          {form.startDate !== 'flexible' && (
            <input type="date" value={form.startDate} onChange={e => upd('startDate', e.target.value)} style={{ width: '100%', padding: '11px 14px', boxSizing: 'border-box', border: `1.5px solid ${form.startDate ? C.primary : C.border}`, borderRadius: 10, fontSize: 14, color: form.startDate ? C.text : C.textMuted, background: C.card, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }} />
          )}
          {form.startDate === 'flexible' && (
            <div style={{ padding: '10px 14px', background: C.primary + '12', borderRadius: 10, fontSize: 13, color: C.primary, fontWeight: 500 }}>
              📅 Se coordinará con el trabajador aceptado
            </div>
          )}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 8, display: 'block' }}>Duración *</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {EDIT_DURATION_PRESETS.map(d => (
              <button key={d} onClick={() => { upd('duration', d); upd('durNum', ''); upd('durUnit', 'día(s)'); }}
                style={{ padding: '7px 12px', borderRadius: 20, border: `1.5px solid ${form.duration === d ? C.primary : C.border}`, background: form.duration === d ? C.primary : C.card, color: form.duration === d ? '#fff' : C.text, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{d}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.textSec, whiteSpace: 'nowrap' }}>Otro:</span>
            <input type="number" min="1" max="30" placeholder="Nº" value={form.durNum}
              onChange={e => { const n = e.target.value; upd('durNum', n); if (n) upd('duration', `${n} ${form.durUnit}`); else upd('duration', ''); }}
              style={{ width: 64, padding: '8px 10px', textAlign: 'center', border: `1.5px solid ${form.durNum ? C.primary : C.border}`, borderRadius: 10, fontSize: 13, color: C.text, outline: 'none', fontFamily: 'inherit', background: C.card }} />
            <select value={form.durUnit}
              onChange={e => { upd('durUnit', e.target.value); if (form.durNum) upd('duration', `${form.durNum} ${e.target.value}`); }}
              style={{ flex: 1, padding: '8px 10px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.text, background: C.card, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <option value="día(s)">día(s)</option>
              <option value="semana(s)">semana(s)</option>
            </select>
          </div>
        </div>

        {error && <div style={{ background: '#FEF2F2', border: `1px solid ${C.danger}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: C.danger }}>{error}</div>}
        <Btn onClick={handleSave} style={{ width: '100%' }} disabled={!canSave || saving}>
          {saving ? 'Guardando...' : '💾 Guardar cambios'}
        </Btn>
      </div>
    </Screen>
  );
};

// 8. BUSCAR ────────────────────────────────────────────────────────────────────
const PRECIO_OPTS = [
  { label: 'Hasta S/100', min: 0, max: 100 },
  { label: 'S/100–S/300', min: 100, max: 300 },
  { label: 'S/300–S/600', min: 300, max: 600 },
  { label: 'S/600+',      min: 600, max: Infinity },
];
const DURACION_OPTS = ['Horas', 'Días', 'Semanas', 'Meses/+'];

const matchDuracion = (c, dur) => {
  const d = (c.duration || '').toLowerCase();
  if (dur === 'Horas')   return d.includes('hora');
  if (dur === 'Días')    return d.includes('día');
  if (dur === 'Semanas') return d.includes('semana');
  if (dur === 'Meses/+') return d.includes('mes') || d.includes('indefinido') || d.includes('año');
  return true;
};

const FilterChip = ({ label, active, onPress }) => {
  const { C } = useTheme();
  return (
    <button onClick={onPress} style={{
      padding: '7px 14px', borderRadius: 20,
      border: `1.5px solid ${active ? C.primary : C.border}`,
      background: active ? C.primary + '18' : C.card,
      color: active ? C.primary : C.textSec,
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      whiteSpace: 'nowrap', transition: 'all .15s', fontFamily: 'inherit',
    }}>{label}</button>
  );
};

const SearchScreen = ({ onNavigate, onViewCachuelo, cachuelos }) => {
  const { C, isDark } = useTheme();
  const [query, setQuery]           = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ modalidad: null, precioRange: null, distrito: null, duracion: null });

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? null : val }));

  const clearAll = () => { setFilters({ modalidad: null, precioRange: null, distrito: null, duracion: null }); setSelectedCat(null); setQuery(''); };

  const results = cachuelos.filter(c => {
    if (query && !c.title.toLowerCase().includes(query.toLowerCase()) && !c.category.toLowerCase().includes(query.toLowerCase())) return false;
    if (selectedCat && c.category !== selectedCat) return false;
    if (filters.modalidad && c.type !== filters.modalidad) return false;
    if (filters.precioRange) {
      const r = PRECIO_OPTS.find(o => o.label === filters.precioRange);
      if (r && (c.price < r.min || c.price > r.max)) return false;
    }
    if (filters.distrito && !c.location.includes(filters.distrito)) return false;
    if (filters.duracion && !matchDuracion(c, filters.duracion)) return false;
    return true;
  });

  const activeCount = (selectedCat ? 1 : 0) + Object.values(filters).filter(Boolean).length;
  const hasActive   = query || activeCount > 0;

  const activeChips = [
    selectedCat        && { key: 'cat',    label: selectedCat,        onRemove: () => setSelectedCat(null) },
    filters.modalidad  && { key: 'mod',    label: filters.modalidad,  onRemove: () => setFilter('modalidad', filters.modalidad) },
    filters.precioRange && { key: 'precio', label: filters.precioRange, onRemove: () => setFilter('precioRange', filters.precioRange) },
    filters.distrito   && { key: 'dist',   label: filters.distrito,   onRemove: () => setFilter('distrito', filters.distrito) },
    filters.duracion   && { key: 'dur',    label: filters.duracion,   onRemove: () => setFilter('duracion', filters.duracion) },
  ].filter(Boolean);

  return (
    <Screen withTabs activeTab="search" onNavigate={onNavigate}>
      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 16px' }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Buscar</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.95)', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
            <Search size={16} color="#8A93B0" />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Buscar cachuelos, categorías..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0D1B3E', padding: '12px 0', fontFamily: 'inherit', background: 'transparent' }}
              autoFocus
            />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="#8A93B0" /></button>}
          </div>
          {/* Botón filtros */}
          <button onClick={() => setShowFilters(true)} style={{
            position: 'relative', width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: activeCount > 0 ? '#fff' : 'rgba(255,255,255,0.2)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Filter size={18} color={activeCount > 0 ? C.primary : '#fff'} />
            {activeCount > 0 && (
              <div style={{
                position: 'absolute', top: -4, right: -4, width: 17, height: 17, borderRadius: 9,
                background: C.primary, color: '#fff', fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{activeCount}</div>
            )}
          </button>
        </div>

        {/* Chips de filtros activos */}
        {activeChips.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 10, paddingBottom: 2, scrollbarWidth: 'none' }}>
            {activeChips.map(chip => (
              <div key={chip.key} style={{
                display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '4px 8px 4px 12px',
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{chip.label}</span>
                <button onClick={chip.onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 0 }}>
                  <X size={11} color="rgba(255,255,255,0.85)" />
                </button>
              </div>
            ))}
            <button onClick={clearAll} style={{
              flexShrink: 0, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 20, padding: '4px 12px', fontSize: 12, color: 'rgba(255,255,255,0.9)',
              cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
            }}>Limpiar</button>
          </div>
        )}
      </div>

      {/* ── Contenido ── */}
      <div style={{ padding: '16px 20px' }}>
        {!hasActive ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Explorar categorías</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCat(cat.label)}
                  style={{
                    padding: '14px 8px', borderRadius: 16,
                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
                    background: isDark ? 'rgba(255,255,255,0.06)' : cat.color,
                    cursor: 'pointer', textAlign: 'center', transition: 'all .2s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: `linear-gradient(135deg, ${cat.iconBgA}, ${cat.iconBgB})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 10px ${cat.iconBgA}50`,
                  }}>
                    <cat.Icon size={22} color="#fff" strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{cat.label}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
              {selectedCat && ` en ${selectedCat}`}
            </div>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>😔</div>
                <div style={{ fontWeight: 600 }}>Sin resultados</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Intenta con otra búsqueda o ajusta los filtros</div>
              </div>
            ) : (
              results.map(c => <CachuCard key={c.id} c={c} onPress={() => onViewCachuelo(c)} />)
            )}
          </>
        )}
      </div>

      {/* ── Panel de filtros (bottom sheet) ── */}
      {showFilters && (
        <div onClick={() => setShowFilters(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: '100%', background: C.card, borderRadius: '20px 20px 0 0', padding: '20px 20px 36px', maxHeight: '82vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 16px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Filtros</div>
              {activeCount > 0 && (
                <button onClick={clearAll} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Limpiar todo
                </button>
              )}
            </div>

            {/* Modalidad */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Modalidad</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Presencial', 'Remoto'].map(m => (
                  <FilterChip key={m} label={m} active={filters.modalidad === m} onPress={() => setFilter('modalidad', m)} />
                ))}
              </div>
            </div>

            {/* Precio */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Rango de precio</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {PRECIO_OPTS.map(o => (
                  <FilterChip key={o.label} label={o.label} active={filters.precioRange === o.label} onPress={() => setFilter('precioRange', o.label)} />
                ))}
              </div>
            </div>

            {/* Distrito */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Distrito</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 150, overflowY: 'auto', paddingRight: 4 }}>
                {DISTRITOS.map(d => (
                  <FilterChip key={d} label={d} active={filters.distrito === d} onPress={() => setFilter('distrito', d)} />
                ))}
              </div>
            </div>

            {/* Duración */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Duración</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DURACION_OPTS.map(d => (
                  <FilterChip key={d} label={d} active={filters.duracion === d} onPress={() => setFilter('duracion', d)} />
                ))}
              </div>
            </div>

            <button onClick={() => setShowFilters(false)} style={{
              width: '100%', padding: '14px 0', borderRadius: 14,
              background: C.primary, border: 'none', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Ver {results.length} resultado{results.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </Screen>
  );
};

// 8. MIS CACHUELOS ────────────────────────────────────────────────────────────
const MyCachuelos = ({ onNavigate, onViewCachuelo, user, onVerPostulantes, onIniciarChat, onEditar }) => {
  const { C } = useTheme();
  const [tab, setTab] = useState('publicados');
  const [publicados, setPublicados] = useState([]);
  const [postulados, setPostulados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const fetchData = async () => {
      setLoading(true);
      const [pubRes, postRes] = await Promise.all([
        supabase.from('cachuelos')
          .select('*, categorias(label, emoji), postulaciones(id)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('postulaciones')
          .select('id, estado, cachuelos(id, titulo, precio, distrito, duracion, estado, categorias(label, emoji))')
          .eq('postulante_id', user.id)
          .order('created_at', { ascending: false }),
      ]);
      if (!pubRes.error && pubRes.data) {
        setPublicados(pubRes.data.map(c => ({
          id: c.id, title: c.titulo, emoji: c.categorias?.emoji || '💼',
          price: Number(c.precio), duration: c.duracion || '',
          status: c.estado, applicants: c.postulaciones?.length || 0,
          // campos para onViewCachuelo
          category: c.categorias?.label || '', location: c.distrito || 'Lima',
          type: c.tipo, featured: c.destacado, remote: c.tipo === 'Remoto',
          description: c.descripcion || '', fecha_inicio: c.fecha_flexible ? 'flexible' : (c.fecha_inicio || ''),
          payType: c.tipo_pago || 'Fijo',
          userId: c.user_id, publisher: { name: user.nombre || 'Yo', rating: 0, verified: false, avatar: (user.nombre?.[0] || 'Y').toUpperCase() },
        })));
      }
      if (!postRes.error && postRes.data) {
        setPostulados(postRes.data.map(p => ({
          id: p.cachuelos?.id, postulacionId: p.id,
          title: p.cachuelos?.titulo, category: p.cachuelos?.categorias?.label || '',
          price: Number(p.cachuelos?.precio), location: p.cachuelos?.distrito || 'Lima',
          duration: p.cachuelos?.duracion || '', status: p.estado,
          cachueloEstado: p.cachuelos?.estado,
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  const statusColor = s => ({ Activo: C.success, Pausado: C.warning, Cerrado: C.danger, Completado: C.purple, Pendiente: C.warning, Visto: C.purple, Aceptado: C.success, Rechazado: C.danger }[s] || C.textMuted);

  return (
    <Screen withTabs activeTab="mycachuelos" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 20px' }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Mis Cachuelos</div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 3 }}>
          {['publicados','postulados'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? C.primary : 'rgba(255,255,255,0.8)',
              transition: 'all .2s',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted, fontSize: 13 }}>Cargando...</div>
        ) : tab === 'publicados' ? (() => {
          const pubActivos    = publicados.filter(c => c.status !== 'Cerrado' && c.status !== 'Completado');
          const pubRealizados = publicados.filter(c => c.status === 'Cerrado' || c.status === 'Completado');
          const CardPub = ({ c }) => (
            <div key={c.id} onClick={() => onViewCachuelo(c)}
              style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', cursor: 'pointer', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <CategoryIcon label={c.category || c.title} size={44} iconSize={20} radius={12} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Badge color={statusColor(c.status)}>{c.status}</Badge>
                    <span style={{ fontSize: 11, color: C.textSec }}>{c.duration}</span>
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, flexShrink: 0 }}>S/{c.price}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} color={C.textMuted} />
                  <span style={{ fontSize: 12, color: C.textSec }}>{c.applicants} postulante{c.applicants !== 1 ? 's' : ''}</span>
                </div>
                {c.status !== 'Cerrado' && c.status !== 'Completado' && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={e => { e.stopPropagation(); onEditar?.(c); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSec, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      ✏️ Editar
                    </button>
                    <button onClick={e => { e.stopPropagation(); onVerPostulantes?.(c); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.primary, fontSize: 12, fontWeight: 600 }}>
                      Ver postulantes
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
          return (
            <>
              {pubActivos.length === 0 && pubRealizados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 44, marginBottom: 10 }}>📋</div>
                  <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Aún no publicaste cachuelos</div>
                  <div style={{ fontSize: 13, color: C.textSec, marginBottom: 20 }}>Publica tu primer cachuelo y empieza a recibir postulantes</div>
                </div>
              ) : (
                <>
                  {pubActivos.map(c => <CardPub key={c.id} c={c} />)}
                  {pubRealizados.length > 0 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 14px' }}>
                        <div style={{ flex: 1, height: 1, background: C.border }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.textSec }}>Realizados ({pubRealizados.length})</span>
                        <div style={{ flex: 1, height: 1, background: C.border }} />
                      </div>
                      {pubRealizados.map(c => (
                        <div key={c.id} style={{ opacity: 0.75 }}>
                          <CardPub c={c} />
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
              <Btn style={{ width: '100%' }} onClick={() => onNavigate('publish')}>
                <PlusCircle size={16} /> Publicar nuevo cachuelo
              </Btn>
            </>
          );
        })() : (() => {
          const postActivos    = postulados.filter(c => c.cachueloEstado !== 'Cerrado' && c.cachueloEstado !== 'Completado');
          const postRealizados = postulados.filter(c => c.cachueloEstado === 'Cerrado' || c.cachueloEstado === 'Completado');
          const CardPost = ({ c }) => (
            <div key={c.postulacionId}
              style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <CategoryIcon label={c.category || c.title} size={44} iconSize={20} radius={12} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.textSec }}>{c.duration}</div>
                </div>
                <Badge color={statusColor(c.status)}>{c.status}</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textSec }}><MapPin size={11} />{c.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textSec }}><DollarSign size={11} />S/{c.price}</span>
                </div>
                <button onClick={() => onIniciarChat?.({ postulacion_id: c.postulacionId, cachuelo: null, postulante: null })}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: C.headerBg, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  <MessageCircle size={13} /> Chatear
                </button>
              </div>
            </div>
          );
          return postulados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
              <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Aún no te postulaste a ningún cachuelo</div>
              <div style={{ fontSize: 13, color: C.textSec, marginBottom: 20 }}>Explora los cachuelos disponibles y postúlate</div>
              <Btn onClick={() => onNavigate('home')}>Explorar cachuelos</Btn>
            </div>
          ) : (
            <>
              {postActivos.map(c => <CardPost key={c.postulacionId} c={c} />)}
              {postRealizados.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 14px' }}>
                    <div style={{ flex: 1, height: 1, background: C.border }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.textSec }}>Realizados ({postRealizados.length})</span>
                    <div style={{ flex: 1, height: 1, background: C.border }} />
                  </div>
                  {postRealizados.map(c => (
                    <div key={c.postulacionId} style={{ opacity: 0.75 }}>
                      <CardPost c={c} />
                    </div>
                  ))}
                </>
              )}
            </>
          );
        })()}
      </div>
    </Screen>
  );
};

// ── RESEÑAS ───────────────────────────────────────────────────────────────────
const ResenasSection = ({ resenas, loading }) => {
  if (loading) return <div style={{ textAlign: 'center', padding: '20px 0', color: C.textMuted, fontSize: 13 }}>Cargando reseñas...</div>;
  if (!resenas.length) return <div style={{ textAlign: 'center', padding: '20px 0', color: C.textMuted, fontSize: 13, fontStyle: 'italic' }}>Aún no tiene reseñas</div>;
  return resenas.map(r => {
    const fecha = new Date(r.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
    return (
      <div key={r.id} style={{ background: C.card, borderRadius: 14, padding: '14px 16px', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <Stars rating={r.estrellas} size={15} />
          <span style={{ fontSize: 11, color: C.textMuted }}>{fecha}</span>
        </div>
        {r.cachuelo_titulo && (
          <div style={{ fontSize: 11, color: C.textSec, marginBottom: r.comentario ? 6 : 0 }}>💼 {r.cachuelo_titulo}</div>
        )}
        {r.comentario && (
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, fontStyle: 'italic' }}>"{r.comentario}"</div>
        )}
      </div>
    );
  });
};

// 9. PERFIL ────────────────────────────────────────────────────────────────────
const ConfigScreen = ({ onBack, onNavigate, onLogout, onAdmin, onAdminTools, user }) => {
  const { C } = useTheme();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user?.id]);

  const rating      = profile?.rating ?? 0;
  const completados = profile?.cachuelos_completados ?? 0;
  const isAdmin     = profile?.rol === 'admin';

  const menuItems = [
    { icon: Shield,    label: 'Verificar DNI',          desc: 'Aumenta tu confiabilidad',    color: C.primary,  action: null },
    { icon: Award,     label: 'Verificar CUL',          desc: 'Certificado único laboral',   color: C.purple,   action: null },
    { icon: Star,      label: 'Mis calificaciones',     desc: completados > 0 ? `${rating.toFixed(1)} · ${completados} reseña${completados !== 1 ? 's' : ''}` : 'Sin reseñas aún', color: C.warning, action: null },
    ...(isAdmin ? [
      { icon: Wrench,    label: 'Herramientas Admin',   desc: 'Gestionar cachuelos',         color: '#7C3AED',  action: onAdminTools },
      { icon: BarChart2, label: 'Dashboard Admin',      desc: 'KPIs y métricas',             color: C.success,  action: onAdmin },
    ] : []),
    { icon: FileText,  label: 'Términos y condiciones', desc: 'Aviso legal completo',        color: C.textSec,  action: null },
    { icon: Settings,  label: 'Configuración',          desc: 'Notificaciones y privacidad', color: C.textSec,  action: null },
    { icon: LogOut,    label: 'Cerrar sesión',          desc: '',                            color: C.danger,   action: onLogout },
  ];

  return (
    <Screen withTabs activeTab="profile" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>Mi cuenta</div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 40px' }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isDanger = item.color === C.danger;
          return (
            <button key={i} onClick={item.action || (() => {})} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 16px', background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 16, marginBottom: 8, cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDanger ? 'rgba(239,68,68,0.1)' : item.color + '18',
              }}>
                <Icon size={19} color={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isDanger ? C.danger : C.text }}>{item.label}</div>
                {item.desc && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{item.desc}</div>}
              </div>
              {!isDanger && <ChevronRight size={16} color={C.textMuted} />}
            </button>
          );
        })}
      </div>
    </Screen>
  );
};

const AVATAR_PALETTES = [
  { bg: 'linear-gradient(135deg,#DBEAFE,#93C5FD)', color: '#1E40AF' },
  { bg: 'linear-gradient(135deg,#D1FAE5,#6EE7B7)', color: '#065F46' },
  { bg: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', color: '#92400E' },
  { bg: 'linear-gradient(135deg,#FCE7F3,#F9A8D4)', color: '#9D174D' },
  { bg: 'linear-gradient(135deg,#EDE9FE,#C4B5FD)', color: '#5B21B6' },
];
const getAvatarPalette = (seed) => AVATAR_PALETTES[(seed || 0) % AVATAR_PALETTES.length];
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return 'hoy';
  if (d === 1) return 'ayer';
  if (d < 7) return `hace ${d} días`;
  if (d < 30) return `hace ${Math.floor(d / 7)} sem.`;
  if (d < 365) return `hace ${Math.floor(d / 30)} mes${Math.floor(d / 30) > 1 ? 'es' : ''}`;
  return `hace ${Math.floor(d / 365)} año${Math.floor(d / 365) > 1 ? 's' : ''}`;
};

const ProfileScreen = ({ onNavigate, onAdmin, onAdminTools, onLogout, user }) => {
  const { C } = useTheme();
  const [profile, setProfile] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingEspecialidades, setEditingEspecialidades] = useState(false);
  const [tempEspecialidades, setTempEspecialidades] = useState([]);
  const [savingEsp, setSavingEsp] = useState(false);
  const [editingZonas, setEditingZonas] = useState(false);
  const [tempZonas, setTempZonas] = useState([]);
  const [savingZonas, setSavingZonas] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => { if (data) { setProfile(data); setBioText(data.bio || ''); } });
    supabase.from('resenas').select('*').eq('trabajador_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setResenas(data || []));
    supabase.from('postulaciones')
      .select('*, cachuelos(titulo, distrito, precio, duracion, categorias(label, emoji))')
      .eq('postulante_id', user.id).eq('estado', 'Aceptado')
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setTrabajos(data || []));
  }, [user?.id]);

  const handleSelectPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleConfirmPhoto = async () => {
    if (!previewFile || !user?.id) return;
    setUploadingPhoto(true);
    const ext = previewFile.name.split('.').pop();
    const path = `${user.id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, previewFile, { upsert: true });
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      setProfile(p => ({ ...p, avatar_url: publicUrl }));
    }
    setUploadingPhoto(false);
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const handleSaveBio = async () => {
    const { error } = await supabase.from('profiles').update({ bio: bioText }).eq('id', user.id);
    if (!error) setProfile(p => ({ ...p, bio: bioText }));
    setEditingBio(false);
  };

  const handleSaveEspecialidades = async () => {
    setSavingEsp(true);
    const { error } = await supabase.from('profiles').update({ especialidades: tempEspecialidades }).eq('id', user.id);
    if (!error) setProfile(p => ({ ...p, especialidades: tempEspecialidades }));
    setSavingEsp(false);
    setEditingEspecialidades(false);
  };

  const handleSaveZonas = async () => {
    setSavingZonas(true);
    const { error } = await supabase.from('profiles').update({ zonas: tempZonas }).eq('id', user.id);
    if (!error) setProfile(p => ({ ...p, zonas: tempZonas }));
    setSavingZonas(false);
    setEditingZonas(false);
  };

  const handleToggleDisponible = async () => {
    const next = !(profile?.disponible ?? false);
    await supabase.from('profiles').update({ disponible: next }).eq('id', user.id);
    setProfile(p => ({ ...p, disponible: next }));
  };

  const nombre      = profile?.nombre   || user?.nombre   || '';
  const apellido    = profile?.apellido || user?.apellido || '';
  const email       = profile?.email    || user?.email    || '';
  const fullName    = [nombre, apellido].filter(Boolean).join(' ') || email.split('@')[0];
  const initials    = `${nombre[0] || ''}${apellido[0] || ''}`.toUpperCase() || '??';
  const rating      = profile?.rating ?? 0;
  const completados = profile?.cachuelos_completados ?? 0;
  const dniVerificado = profile?.dni_verificado ?? false;
  const isAdmin     = profile?.rol === 'admin';
  const disponible  = profile?.disponible ?? false;
  const bio         = profile?.bio || '';
  const especialidades = profile?.especialidades || [];
  const zonas       = profile?.zonas || [];
  const starDist    = [5,4,3,2,1].map(s => ({ s, n: resenas.filter(r => Math.round(r.estrellas || 0) === s).length }));
  const maxStar     = Math.max(...starDist.map(x => x.n), 1);

  const ReviewCard = ({ r, i }) => {
    const pal = getAvatarPalette(i);
    const ini = (r.cachuelo_titulo || '?').slice(0, 2).toUpperCase();
    return (
      <div style={{ background: C.card, borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: pal.color, flexShrink: 0 }}>{ini}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{r.cachuelo_titulo || 'Cachuelo'}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>
              {timeAgo(r.created_at)} · <span style={{ color: C.warning }}>{'★'.repeat(Math.round(r.estrellas || 0))}{'☆'.repeat(5 - Math.round(r.estrellas || 0))}</span>
            </div>
          </div>
        </div>
        {r.comentario && <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5, fontStyle: 'italic' }}>"{r.comentario}"</div>}
      </div>
    );
  };

  const StarChart = () => (
    <div style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: C.text, lineHeight: 1 }}>{rating.toFixed(1)}</div>
          <div style={{ color: C.warning, fontSize: 13, margin: '4px 0' }}>{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{resenas.length} reseña{resenas.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ flex: 1 }}>
          {starDist.map(({ s, n }) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.textSec, width: 10 }}>{s}</span>
              <div style={{ flex: 1, height: 7, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(n / maxStar) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.warning}, #FCD34D)`, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 10, color: C.textMuted, width: 14 }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Screen withTabs activeTab="profile" onNavigate={onNavigate}>

      {/* ── HEADER COMPACTO ── */}
      <div style={{ position: 'relative' }}>
        <div style={{ background: `linear-gradient(160deg, ${C.headerBg} 0%, ${C.headerDark} 70%, #1A3A8F 100%)`, padding: '44px 20px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: 40, padding: 3, background: `linear-gradient(135deg, ${C.primary}, ${C.warning})` }}>
                <div style={{ width: 74, height: 74, borderRadius: 37, overflow: 'hidden', background: C.headerDark }}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff' }}>{initials}</div>}
                </div>
              </div>
              <label style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border: '2px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={12} color="#fff" />
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSelectPhoto} />
              </label>
              {dniVerificado && (
                <div style={{ position: 'absolute', bottom: 2, left: 2, width: 26, height: 26, borderRadius: 13, background: C.success, border: '2px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={13} color="#fff" />
                </div>
              )}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, paddingRight: 44 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 900, letterSpacing: -0.2 }}>{fullName}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 3, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {bio || <span style={{ fontStyle: 'italic' }}>Sin descripción — agrégala en Información</span>}
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                {isAdmin && <span style={{ background: 'rgba(139,92,246,0.25)', color: '#C4B5FD', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(139,92,246,0.4)' }}>🛡️ Admin</span>}
                {dniVerificado && <span style={{ background: 'rgba(16,185,129,0.2)', color: '#6EE7B7', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.3)' }}>✓ DNI</span>}
                {rating > 0 && <span style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.3)' }}>⭐ {rating.toFixed(1)}</span>}
              </div>
              {/* Disponibilidad */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
                <button onClick={handleToggleDisponible} style={{ display: 'flex', alignItems: 'center', gap: 5, background: disponible ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.15)', border: `1px solid ${disponible ? 'rgba(16,185,129,0.35)' : 'rgba(148,163,184,0.25)'}`, borderRadius: 20, padding: '4px 8px 4px 6px', cursor: 'pointer' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: disponible ? '#10B981' : '#94A3B8', boxShadow: disponible ? '0 0 5px #10B981' : 'none', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: disponible ? '#6EE7B7' : 'rgba(255,255,255,0.4)' }}>{disponible ? 'Disponible' : 'No disponible'}</span>
                  <div style={{ marginLeft: 2, width: 24, height: 13, borderRadius: 7, background: disponible ? '#10B981' : 'rgba(148,163,184,0.4)', position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 2, left: disponible ? 'auto' : 2, right: disponible ? 2 : 'auto', width: 9, height: 9, borderRadius: '50%', background: '#fff', transition: 'all 0.2s' }} />
                  </div>
                </button>
                {profile?.tiempo_respuesta && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>⚡ {profile.tiempo_respuesta}</span>}
              </div>
            </div>
          </div>
        </div>
        {/* Gear button */}
        <button onClick={() => onNavigate('config')} style={{ position: 'absolute', top: 16, right: 20, width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
          <Settings size={17} color="#fff" />
        </button>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', background: C.card, borderBottom: `2px solid ${C.border}` }}>
        {[['info', 'Información'], ['trabajos', `Trabajos (${completados})`], ['resenas', `Reseñas (${resenas.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, padding: '12px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: activeTab === id ? C.primary : C.textMuted, background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === id ? C.primary : 'transparent'}`, cursor: 'pointer', marginBottom: -2 }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO TABS ── */}
      <div style={{ padding: '16px 16px 80px', background: C.cardElevated }}>

        {/* TAB: INFORMACIÓN */}
        {activeTab === 'info' && (<>
          {/* Bio */}
          <div style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sobre mí</span>
              {!editingBio && <button onClick={() => setEditingBio(true)} style={{ fontSize: 11, color: C.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Editar</button>}
            </div>
            {editingBio ? (<>
              <textarea value={bioText} onChange={e => setBioText(e.target.value.slice(0, 200))} placeholder="Cuéntale a los empleadores sobre ti…" style={{ width: '100%', border: `1.5px solid ${C.primary}`, borderRadius: 10, padding: '10px 12px', fontSize: 13, color: C.text, resize: 'none', height: 80, background: C.cardElevated, outline: 'none', fontFamily: 'inherit' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: C.textMuted }}>{bioText.length}/200</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setEditingBio(false); setBioText(profile?.bio || ''); }} style={{ fontSize: 12, color: C.textSec, background: 'none', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={handleSaveBio} style={{ fontSize: 12, color: '#fff', background: C.primary, border: 'none', borderRadius: 8, padding: '5px 14px', fontWeight: 700, cursor: 'pointer' }}>Guardar</button>
                </div>
              </div>
            </>) : (
              bio ? <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{bio}</div>
                 : <div style={{ fontSize: 13, color: C.textMuted, fontStyle: 'italic' }}>Agrega una descripción para que los empleadores te conozcan mejor.</div>
            )}
          </div>

          {/* Especialidades */}
          <div style={{ background: C.card, borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Especialidades</span>
              <button onClick={() => { setTempEspecialidades([...(profile?.especialidades || [])]); setEditingEspecialidades(true); }} style={{ fontSize: 11, color: C.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Editar</button>
            </div>
            {especialidades.length > 0
              ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{especialidades.map((e, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 20, background: C.primary + '18', color: C.primary, border: `1px solid ${C.primary}30` }}>{e}</span>)}</div>
              : <div style={{ fontSize: 13, color: C.textMuted, fontStyle: 'italic' }}>Agrega tus especialidades para destacar en búsquedas.</div>}
          </div>

          {/* Zonas */}
          <div style={{ background: C.card, borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Zonas de trabajo</span>
              <button onClick={() => { setTempZonas([...(profile?.zonas || [])]); setEditingZonas(true); }} style={{ fontSize: 11, color: C.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Editar</button>
            </div>
            {zonas.length > 0
              ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{zonas.map((z, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 20, background: '#EDE9FE', color: '#5B21B6', border: '1px solid #DDD6FE' }}>📍 {z}</span>)}</div>
              : <div style={{ fontSize: 13, color: C.textMuted, fontStyle: 'italic' }}>Indica los distritos donde puedes trabajar.</div>}
          </div>

          {/* Resumen de reseñas */}
          {resenas.length > 0 && <StarChart />}
          {resenas.slice(0, 2).map((r, i) => <ReviewCard key={r.id || i} r={r} i={i} />)}
        </>)}

        {/* TAB: TRABAJOS */}
        {activeTab === 'trabajos' && (<>
          <div style={{ background: C.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: C.success + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✅</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{completados} trabajo{completados !== 1 ? 's' : ''} completado{completados !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: 11, color: C.textSec, marginTop: 2 }}>Historial como trabajador{rating > 0 ? ` · ⭐ ${rating.toFixed(1)} promedio` : ''}</div>
            </div>
          </div>
          {trabajos.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted, fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>Aún no tienes trabajos completados</div>
            : trabajos.map((t, i) => {
                const c = t.cachuelos;
                if (!c) return null;
                return (
                  <div key={t.id || i} style={{ background: C.card, borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <CategoryIcon label={c.categorias?.label || ''} size={42} iconSize={18} radius={11} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.titulo}</div>
                        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: C.textSec, marginBottom: 6 }}>
                          <span>📍 {c.distrito || 'Lima'}</span>
                          <span>🗓 {timeAgo(t.created_at)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11, color: C.warning }}>✅ Completado</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: C.success }}>S/{c.precio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </>)}

        {/* TAB: RESEÑAS */}
        {activeTab === 'resenas' && (<>
          {resenas.length > 0 && <StarChart />}
          {resenas.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted, fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>Aún no tienes reseñas</div>
            : resenas.map((r, i) => <ReviewCard key={r.id || i} r={r} i={i} />)}
        </>)}
      </div>

      {/* ── MODAL ESPECIALIDADES ── */}
      {editingEspecialidades && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ width: '100%', background: C.card, borderRadius: '24px 24px 0 0', padding: '24px 20px 36px', maxHeight: '75vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 4 }}>Especialidades</div>
            <div style={{ fontSize: 13, color: C.textSec, marginBottom: 16 }}>Selecciona las categorías en las que trabajas</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {CATEGORIES.map(cat => {
                const sel = tempEspecialidades.includes(cat.label);
                return (
                  <button key={cat.id}
                    onClick={() => setTempEspecialidades(prev => sel ? prev.filter(e => e !== cat.label) : [...prev, cat.label])}
                    style={{ padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${sel ? C.primary : C.border}`, background: sel ? C.primary + '18' : C.cardElevated, color: sel ? C.primary : C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `linear-gradient(135deg, ${cat.iconBgA}, ${cat.iconBgB})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <cat.Icon size={12} color="#fff" strokeWidth={2.5} />
                    </div>
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <Btn onClick={handleSaveEspecialidades} disabled={savingEsp} style={{ width: '100%', marginBottom: 10 }}>
              {savingEsp ? 'Guardando...' : 'Guardar'}
            </Btn>
            <button onClick={() => setEditingEspecialidades(false)} style={{ width: '100%', padding: '12px 0', borderRadius: 14, background: 'none', border: `1.5px solid ${C.border}`, color: C.textSec, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL ZONAS ── */}
      {editingZonas && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ width: '100%', background: C.card, borderRadius: '24px 24px 0 0', padding: '24px 20px 36px', maxHeight: '80vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 4 }}>Zonas de trabajo</div>
            <div style={{ fontSize: 13, color: C.textSec, marginBottom: 16 }}>Selecciona los distritos donde puedes trabajar</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {DISTRITOS.map(d => {
                const sel = tempZonas.includes(d);
                return (
                  <button key={d}
                    onClick={() => setTempZonas(prev => sel ? prev.filter(z => z !== d) : [...prev, d])}
                    style={{ padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${sel ? '#8B5CF6' : C.border}`, background: sel ? '#EDE9FE' : C.cardElevated, color: sel ? '#5B21B6' : C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    📍 {d}
                  </button>
                );
              })}
            </div>
            <Btn onClick={handleSaveZonas} disabled={savingZonas} style={{ width: '100%', marginBottom: 10 }}>
              {savingZonas ? 'Guardando...' : 'Guardar'}
            </Btn>
            <button onClick={() => setEditingZonas(false)} style={{ width: '100%', padding: '12px 0', borderRadius: 14, background: 'none', border: `1.5px solid ${C.border}`, color: C.textSec, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL PREVIEW FOTO ── */}
      {previewUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ width: '100%', background: C.card, borderRadius: '24px 24px 0 0', padding: '28px 20px 36px' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 4 }}>Vista previa</div>
              <div style={{ fontSize: 13, color: C.textSec }}>¿Te gusta cómo se ve?</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 110, height: 110, borderRadius: 55, overflow: 'hidden', border: `3px solid ${C.primary}`, boxShadow: `0 8px 24px ${C.primary}40` }}>
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <Btn onClick={handleConfirmPhoto} disabled={uploadingPhoto} style={{ width: '100%', marginBottom: 12 }}>
              {uploadingPhoto ? 'Subiendo...' : 'Usar esta foto'}
            </Btn>
            <button onClick={() => { setPreviewFile(null); setPreviewUrl(null); }} style={{ width: '100%', padding: '12px 0', borderRadius: 14, background: 'none', border: `1.5px solid ${C.border}`, color: C.textSec, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </Screen>
  );
};

// 10. DASHBOARD ADMIN ──────────────────────────────────────────────────────────
const AdminDashboard = ({ onBack }) => {
  const [adminTab, setAdminTab] = useState('kpis');
  const registeredUsers = JSON.parse(localStorage.getItem('cachuelo_users') || '[]');
  const [reportes, setReportes] = useState([]);
  const [reporteCount, setReporteCount] = useState(0);

  useEffect(() => {
    supabase.from('reportes').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        const d = data || [];
        setReportes(d);
        setReporteCount(d.filter(r => r.estado === 'pendiente').length);
      });
  }, []);

  const markRevisado = async (id) => {
    await supabase.from('reportes').update({ estado: 'revisado' }).eq('id', id);
    setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: 'revisado' } : r));
    setReporteCount(prev => Math.max(0, prev - 1));
  };

  const kpis = [
    { label: 'Publicados',     value: '156',  icon: Package,    color: C.primary,  unit: '',   change: '+12%' },
    { label: 'Resueltos',      value: '89',   icon: CheckCircle,color: C.success,  unit: '',   change: '+8%'  },
    { label: 'Usuarios',       value: '342',  icon: Users,      color: C.purple,   unit: '',   change: '+23%' },
    { label: 'Rating prom.',   value: '4.6',  icon: Star,       color: C.warning,  unit: '★',  change: '+0.1' },
    { label: 'Descargas',      value: '1,250',icon: Download,   color: '#0EA5E9',  unit: '',   change: '+45%' },
    { label: 'Retención',      value: '67',   icon: TrendingUp, color: C.success,  unit: '%',  change: '+5%'  },
    { label: 'Verificados',    value: '198',  icon: Shield,     color: C.primary,  unit: '',   change: '+18%' },
  ];

  const funnel = [
    { label: 'Visitan la app',    value: 1250, pct: 100 },
    { label: 'Se registran',      value: 342,  pct: 27  },
    { label: 'Publican cachuelo', value: 156,  pct: 45  },
    { label: 'Reciben postulación',value: 112, pct: 72  },
    { label: 'Cierran trato',     value: 89,   pct: 79  },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1A1A2E, #0f3460)`, padding: '44px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>Dashboard Admin</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Cachuelo · Marzo 2026</div>
          </div>
        </div>
        {/* Admin tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 3 }}>
          {[
          { id: 'kpis', label: 'KPIs' },
          { id: 'users', label: `Usuarios (${registeredUsers.length})` },
          { id: 'reportes', label: reporteCount > 0 ? `Reportes (${reporteCount})` : 'Reportes' },
        ].map(t => (
            <button key={t.id} onClick={() => setAdminTab(t.id)} style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              background: adminTab === t.id ? '#fff' : 'transparent',
              color: adminTab === t.id ? '#1A1A2E' : 'rgba(255,255,255,0.7)',
              transition: 'all .2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* ── USUARIOS ── */}
        {adminTab === 'users' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Usuarios Registrados</div>
              <Badge color={C.purple}>{registeredUsers.length} total</Badge>
            </div>
            {registeredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👤</div>
                <div style={{ fontWeight: 600 }}>Sin usuarios aún</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Los registros aparecerán aquí</div>
              </div>
            ) : (
              registeredUsers.map((u, i) => (
                <div key={u.id} style={{
                  background: C.card, borderRadius: 14, padding: '14px 16px', marginBottom: 10,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <Avatar initials={`${u.nombre?.[0] || '?'}${u.apellido?.[0] || ''}`} size={40} fontSize={15} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{u.nombre} {u.apellido}</div>
                      <div style={{ fontSize: 12, color: C.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    </div>
                    <Badge color={C.success}>#{i + 1}</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      { label: 'Teléfono', value: u.telefono || '—' },
                      { label: 'Ciudad', value: u.ciudad || '—' },
                      { label: 'País', value: u.pais || '—' },
                      { label: 'Nacimiento', value: u.fechaNac || '—' },
                    ].map(f => (
                      <div key={f.label} style={{ background: C.bg, borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 10, color: C.textMuted, textAlign: 'right' }}>
                    Registrado: {new Date(u.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── KPIs ── */}
        {adminTab === 'kpis' && <>
        {/* KPI grid */}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>KPIs Principales</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
          {kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} style={{ background: C.card, borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: k.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={k.color} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.success, background: '#ECFDF5', padding: '2px 6px', borderRadius: 6 }}>
                    {k.change}
                  </span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{k.value}<span style={{ fontSize: 14, color: k.color }}>{k.unit}</span></div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{k.label}</div>
              </div>
            );
          })}
          {/* 7th KPI takes full width if odd */}
        </div>

        {/* Conversion funnel */}
        <div style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Embudo de Conversión</div>
          {funnel.map((f, i) => (
            <div key={i} style={{ marginBottom: i < funnel.length - 1 ? 14 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{f.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{f.value.toLocaleString()}</span>
              </div>
              <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${C.primary}, ${C.primaryLight})`,
                  width: `${f.pct}%`, transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textAlign: 'right' }}>
                {f.pct}% {i > 0 ? 'de registrados' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Exportar CSV', icon: Download, color: C.primary },
            { label: 'Usuarios', icon: Users, color: C.purple },
            { label: 'Analytics', icon: BarChart2, color: C.success },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={i} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
              }}>
                <Icon size={20} color={a.color} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{a.label}</div>
              </button>
            );
          })}
        </div>
        </>}

        {/* ── REPORTES ── */}
        {adminTab === 'reportes' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Reportes recibidos</div>
              {reporteCount > 0 && <Badge color={C.danger}>{reporteCount} pendiente{reporteCount !== 1 ? 's' : ''}</Badge>}
            </div>
            {reportes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🏳️</div>
                <div style={{ fontWeight: 600 }}>Sin reportes</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Los reportes de usuarios aparecerán aquí</div>
              </div>
            ) : reportes.map(r => (
              <div key={r.id} style={{
                background: C.card, borderRadius: 14, padding: '14px 16px', marginBottom: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                border: `1px solid ${r.estado === 'pendiente' ? C.danger + '40' : C.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Badge color={r.tipo === 'cachuelo' ? C.primary : C.purple}>
                    {r.tipo === 'cachuelo' ? '📋 Cachuelo' : '👤 Usuario'}
                  </Badge>
                  <Badge color={r.estado === 'pendiente' ? C.danger : C.textMuted}>
                    {r.estado}
                  </Badge>
                  <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 'auto' }}>
                    {new Date(r.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{r.motivo}</div>
                {r.descripcion && (
                  <div style={{ fontSize: 12, color: C.textSec, marginBottom: 8, lineHeight: 1.5 }}>{r.descripcion}</div>
                )}
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: r.estado === 'pendiente' ? 10 : 0 }}>
                  ID denunciado: {(r.reported_cachuelo_id || r.reported_user_id || '—').slice(0, 8)}...
                </div>
                {r.estado === 'pendiente' && (
                  <button onClick={() => markRevisado(r.id)} style={{
                    width: '100%', padding: '8px 0', borderRadius: 8, border: 'none',
                    background: C.success + '18', color: C.success, fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  }}>
                    ✓ Marcar como revisado
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ── HERRAMIENTAS ADMIN ────────────────────────────────────────────────────────
const AdminToolsScreen = ({ onBack, onRefresh }) => {
  const [cachuelos, setCachuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('cachuelos')
      .select(`*, categorias(label, emoji)`)
      .order('created_at', { ascending: false });
    setCachuelos(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    const { error } = await supabase.from('cachuelos').delete().eq('id', id);
    if (error) {
      alert(`Error al eliminar: ${error.message}`);
    } else {
      setCachuelos(prev => prev.filter(c => c.id !== id));
      onRefresh?.();
    }
    setDeleting(null);
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditForm({ titulo: c.titulo, precio: c.precio, estado: c.estado, distrito: c.distrito });
  };

  const handleSaveEdit = async () => {
    await supabase.from('cachuelos').update({
      titulo: editForm.titulo,
      precio: Number(editForm.precio),
      estado: editForm.estado,
      distrito: editForm.distrito,
    }).eq('id', editingId);
    setCachuelos(prev => prev.map(c => c.id === editingId ? { ...c, ...editForm, precio: Number(editForm.precio) } : c));
    setEditingId(null);
    onRefresh?.();
  };

  const publisherName = (c) =>
    `${c.profiles?.nombre || ''} ${c.profiles?.apellido || ''}`.trim() || c.profiles?.email?.split('@')[0] || 'Usuario';

  const estadoColor = { Activo: C.success, Pausado: C.warning, Cerrado: C.danger, Completado: C.purple };

  return (
    <Screen>
      <div style={{ background: `linear-gradient(135deg, #7C3AED, #5B21B6)`, padding: '44px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>🛡️ Panel de administración</div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>Herramientas Admin</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 100px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>Cargando cachuelos...</div>
        ) : cachuelos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div>No hay cachuelos publicados</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>{cachuelos.length} cachuelo{cachuelos.length !== 1 ? 's' : ''} en total</div>
            {cachuelos.map(c => (
              <div key={c.id} style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
                {editingId === c.id ? (
                  /* ── MODO EDICIÓN ── */
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', marginBottom: 10 }}>Editando cachuelo</div>
                    <Input label="Título" value={editForm.titulo} onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))} />
                    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                      <div style={{ flex: 1 }}>
                        <Input label="Precio (S/)" type="number" value={editForm.precio} onChange={e => setEditForm(f => ({ ...f, precio: e.target.value }))} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Estado</label>
                        <select value={editForm.estado} onChange={e => setEditForm(f => ({ ...f, estado: e.target.value }))}
                          style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, background: C.card, outline: 'none', fontFamily: 'inherit' }}>
                          {['Activo','Pausado','Cerrado','Completado'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <Input label="Distrito" value={editForm.distrito} onChange={e => setEditForm(f => ({ ...f, distrito: e.target.value }))} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <Btn variant="ghost" onClick={() => setEditingId(null)} style={{ flex: 1 }}>Cancelar</Btn>
                      <Btn onClick={handleSaveEdit} style={{ flex: 2 }}><Check size={15} /> Guardar</Btn>
                    </div>
                  </div>
                ) : (
                  /* ── MODO VISTA ── */
                  <>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                      <CategoryIcon label={c.categorias?.label || ''} size={40} iconSize={18} radius={10} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.titulo}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>por {publisherName(c)}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>S/{c.precio}</div>
                        <div style={{ fontSize: 10, color: estadoColor[c.estado] || C.textMuted, fontWeight: 600 }}>{c.estado}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, fontSize: 11, color: C.textMuted, marginBottom: 12 }}>
                      <span>📍 {c.distrito}</span>
                      <span>·</span>
                      <span>{c.categorias?.label}</span>
                      <span>·</span>
                      <span>{c.duracion}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(c)} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '9px 0', borderRadius: 10, border: `1.5px solid #7C3AED`,
                        background: 'rgba(124,58,237,0.06)', color: '#7C3AED', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      }}>
                        <Pencil size={14} /> Editar
                      </button>
                      <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '9px 0', borderRadius: 10, border: `1.5px solid ${C.danger}`,
                        background: 'rgba(239,68,68,0.06)', color: C.danger, fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      }}>
                        <Trash2 size={14} /> {deleting === c.id ? 'Borrando...' : 'Eliminar'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </Screen>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// ── NOTIFICACIONES ────────────────────────────────────────────────────────────
const NotificationsScreen = ({ user, onBack, onNavigate, onViewPostulantes, onViewCachuelo, onOpenChat }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cachuelo_read_notifs') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      setLoading(true);
      const result = [];

      // 1. Postulaciones a mis cachuelos
      const { data: misCachuelos } = await supabase
        .from('cachuelos').select('id, titulo').eq('user_id', user.id);
      if (misCachuelos?.length > 0) {
        const ids = misCachuelos.map(c => c.id);
        const { data: posts } = await supabase
          .from('postulaciones')
          .select('id, created_at, postulante_id, cachuelo_id')
          .in('cachuelo_id', ids)
          .order('created_at', { ascending: false });
        if (posts?.length > 0) {
          const pIds = [...new Set(posts.map(p => p.postulante_id).filter(Boolean))];
          const { data: perfiles } = await supabase.from('profiles').select('*').in('id', pIds);
          const pMap = {};
          (perfiles || []).forEach(p => { pMap[p.id] = p; });
          posts.forEach(p => {
            const cachuelo = misCachuelos.find(c => c.id === p.cachuelo_id);
            const prof = pMap[p.postulante_id];
            const nombre = prof ? `${prof.nombre || ''} ${prof.apellido || ''}`.trim() || prof.email?.split('@')[0] : 'Alguien';
            result.push({
              id: `pub-${p.id}`, tipo: 'postulacion_recibida',
              icono: '👤', titulo: 'Nueva postulación',
              desc: `${nombre || 'Un usuario'} se postuló a "${cachuelo?.titulo}"`,
              fecha: p.created_at, color: C.primary,
              cachuelo_ref: cachuelo,
            });
          });
        }
      }

      // 2. Mis postulaciones con cambio de estado
      const { data: misPostulaciones } = await supabase
        .from('postulaciones')
        .select('id, estado, updated_at, cachuelo_id, cachuelos(titulo)')
        .eq('postulante_id', user.id)
        .order('updated_at', { ascending: false });
      (misPostulaciones || []).forEach(p => {
        const titulo = p.cachuelos?.titulo || 'un cachuelo';
        if (p.estado === 'Visto') result.push({ id: `post-${p.id}`, tipo: 'vista', icono: '👀', titulo: 'Postulación vista', desc: `El empleador vio tu postulación a "${titulo}"`, fecha: p.updated_at, color: C.purple, cachuelo_id: p.cachuelo_id });
        if (p.estado === 'Aceptado') result.push({ id: `post-${p.id}`, tipo: 'aceptada', icono: '🎉', titulo: '¡Postulación aceptada!', desc: `Fuiste aceptado para "${titulo}". El empleador te contactará pronto.`, fecha: p.updated_at, color: C.success, cachuelo_id: p.cachuelo_id });
        if (p.estado === 'Rechazado') result.push({ id: `post-${p.id}`, tipo: 'rechazada', icono: '❌', titulo: 'Postulación no seleccionada', desc: `No fuiste seleccionado para "${titulo}". ¡Sigue intentando!`, fecha: p.updated_at, color: C.danger, cachuelo_id: p.cachuelo_id });
      });

      // 3. Mensajes no leídos dirigidos a mí
      const { data: mensajesNoLeidos } = await supabase
        .from('mensajes').select('id, created_at, postulacion_id, sender_id')
        .eq('recipient_id', user.id).eq('leido', false)
        .order('created_at', { ascending: false });
      if (mensajesNoLeidos?.length > 0) {
        const byPost = {};
        mensajesNoLeidos.forEach(m => {
          if (!byPost[m.postulacion_id]) byPost[m.postulacion_id] = { count: 0, latest: m.created_at, sender_id: m.sender_id };
          byPost[m.postulacion_id].count++;
        });
        const senderIds = [...new Set(mensajesNoLeidos.map(m => m.sender_id).filter(Boolean))];
        const postIds = Object.keys(byPost);
        const [{ data: senderProfiles }, { data: postulaciones }] = await Promise.all([
          supabase.from('profiles').select('*').in('id', senderIds),
          supabase.from('postulaciones').select('id, cachuelo_id, cachuelos(titulo)').in('id', postIds),
        ]);
        const senderMap = {};
        (senderProfiles || []).forEach(p => { senderMap[p.id] = p; });
        const postMap = {};
        (postulaciones || []).forEach(p => { postMap[p.id] = p; });
        Object.entries(byPost).forEach(([postulacion_id, { count, latest, sender_id }]) => {
          const sender = senderMap[sender_id];
          const post = postMap[postulacion_id];
          const nombre = sender ? `${sender.nombre || ''} ${sender.apellido || ''}`.trim() || sender.email?.split('@')[0] : 'Alguien';
          const titulo = post?.cachuelos?.titulo || 'un cachuelo';
          result.push({
            id: `msg-${postulacion_id}`, tipo: 'mensaje_nuevo', icono: '💬',
            titulo: `${count} mensaje${count > 1 ? 's' : ''} nuevo${count > 1 ? 's' : ''}`,
            desc: `${nombre} te escribió sobre "${titulo}"`,
            fecha: latest, color: C.headerBg, postulacion_id,
          });
        });
      }

      // Ordenar por fecha desc
      result.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setNotifs(result);
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  const markRead = (id) => {
    setReadIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('cachuelo_read_notifs', JSON.stringify(next));
      return next;
    });
  };

  const handleClick = async (n) => {
    markRead(n.id);
    if (n.tipo === 'postulacion_recibida' && n.cachuelo_ref) {
      onViewPostulantes?.(n.cachuelo_ref);
    } else if (['vista', 'aceptada', 'rechazada'].includes(n.tipo) && n.cachuelo_id) {
      const { data } = await supabase
        .from('cachuelos').select('*, categorias(label, emoji, color)').eq('id', n.cachuelo_id).single();
      if (data) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user_id).single();
        const profileMap = prof ? { [prof.id]: prof } : {};
        const [normalized] = normalizeCachuelos([data], profileMap);
        onViewCachuelo?.(normalized);
      }
    } else if (n.tipo === 'mensaje_nuevo' && n.postulacion_id) {
      // Navegar inmediatamente — ChatScreen carga sus propios datos desde postulacion_id
      onOpenChat?.({ postulacion_id: n.postulacion_id, cachuelo: null, postulante: null });
    }
  };

  const formatFecha = (f) => {
    const d = new Date(f);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 60) return `Hace ${diff || 1} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  };

  return (
    <Screen withTabs activeTab="home" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Notificaciones</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted }}>Cargando...</div>
        ) : notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔔</div>
            <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Sin notificaciones</div>
            <div style={{ fontSize: 13, color: C.textSec }}>Aquí aparecerán tus actividades y novedades</div>
          </div>
        ) : notifs.map(n => {
          const isRead = readIds.includes(n.id);
          return (
            <div key={n.id} onClick={() => handleClick(n)} style={{ background: isRead ? '#F9FAFB' : '#EFF6FF', borderRadius: 14, padding: '14px 16px', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${isRead ? C.border : '#BFDBFE'}`, borderLeft: `4px solid ${isRead ? C.border : C.headerBg}`, display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer' }}>
              <div style={{ width: 42, height: 42, borderRadius: 21, background: (isRead ? '#9CA3AF' : n.color) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {n.icono}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: isRead ? 500 : 700, fontSize: 13, color: isRead ? C.textSec : C.text, marginBottom: 3 }}>{n.titulo}</div>
                <div style={{ fontSize: 12, color: isRead ? C.textMuted : C.textSec, lineHeight: 1.5, marginBottom: 4 }}>{n.desc}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{formatFecha(n.fecha)}</div>
              </div>
              {!isRead && <div style={{ width: 8, height: 8, borderRadius: 4, background: C.headerBg, flexShrink: 0, marginTop: 4 }} />}
            </div>
          );
        })}
      </div>
    </Screen>
  );
};

// ── POSTULANTES ───────────────────────────────────────────────────────────────
const PostulantesScreen = ({ cachuelo, onBack, onViewProfile, onIniciarChat, onNavigate }) => {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cachuelo?.id) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: posts } = await supabase
        .from('postulaciones')
        .select('id, mensaje, estado, created_at, postulante_id')
        .eq('cachuelo_id', cachuelo.id)
        .order('created_at', { ascending: false });

      if (!posts || posts.length === 0) { setPostulantes([]); setLoading(false); return; }

      const ids = posts.map(p => p.postulante_id);
      const { data: profiles } = await supabase
        .from('profiles').select('*').in('id', ids);

      const profileMap = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p; });

      setPostulantes(posts.map(p => {
        const prof = profileMap[p.postulante_id] || {};
        const nombre = prof.nombre || '';
        const apellido = prof.apellido || '';
        return {
          id: p.id, postulante_id: p.postulante_id,
          nombre: [nombre, apellido].filter(Boolean).join(' ') || prof.email?.split('@')[0] || 'Usuario',
          initials: (`${nombre[0] || ''}${apellido[0] || ''}`).toUpperCase() || 'U',
          rating: prof.rating || 0,
          completados: prof.cachuelos_completados || 0,
          distrito: prof.distrito || prof.ciudad || 'Lima',
          verificado: prof.dni_verificado || false,
          mensaje: p.mensaje || '',
          estado: p.estado,
          fecha: new Date(p.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }),
        };
      }));
      setLoading(false);
    };
    fetchData();
  }, [cachuelo?.id]);

  const estadoColor = { Pendiente: C.warning, Visto: C.purple, Aceptado: C.success, Rechazado: C.danger };

  return (
    <Screen withTabs activeTab="mycachuelos" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Postulantes</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{cachuelo?.title}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted }}>Cargando...</div>
        ) : postulantes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👀</div>
            <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Aún no hay postulantes</div>
            <div style={{ fontSize: 13, color: C.textSec }}>Cuando alguien se postule aparecerá aquí</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: C.textSec, marginBottom: 14 }}>
              {postulantes.length} postulante{postulantes.length !== 1 ? 's' : ''}
            </div>
            {postulantes.map(p => (
              <div key={p.id} style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
                {/* Header postulante */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <button onClick={() => onViewProfile?.(p.postulante_id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <Avatar initials={p.initials} size={48} bg={C.primaryLight} fontSize={16} />
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.nombre}</span>
                      {p.verificado && <Shield size={12} color={C.success} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: C.textSec, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={10} /> {p.distrito}
                      </span>
                      <span style={{ fontSize: 11, color: C.textSec, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <CheckCircle size={10} color={C.success} /> {p.completados} completados
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Badge color={estadoColor[p.estado] || C.textMuted}>{p.estado}</Badge>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{p.fecha}</div>
                  </div>
                </div>

                {/* Rating */}
                <div style={{ marginBottom: 10 }}>
                  {p.rating > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stars rating={p.rating} size={13} />
                      <span style={{ fontSize: 11, color: C.textSec }}>{p.rating.toFixed(1)} como trabajador</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>El usuario todavía no tiene reseñas</span>
                  )}
                </div>

                {/* Mensaje */}
                {p.mensaje ? (
                  <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: C.textSec, lineHeight: 1.5, borderLeft: `3px solid ${C.primary}`, marginBottom: 12 }}>
                    "{p.mensaje}"
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: C.textMuted, fontStyle: 'italic', marginBottom: 12 }}>Sin mensaje adjunto</div>
                )}

                {/* Botón Iniciar Chat */}
                <button onClick={() => onIniciarChat?.({ postulacion_id: p.id, cachuelo, postulante: p })}
                  style={{ width: '100%', padding: '10px 0', borderRadius: 10, background: C.headerBg, color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <MessageCircle size={16} /> Iniciar Chat
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </Screen>
  );
};

// ── CHAT ──────────────────────────────────────────────────────────────────────
const ChatScreen = ({ chatData, currentUser, onBack, onNavigate, onAceptado }) => {
  const { C } = useTheme();
  const { postulacion_id } = chatData || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [estado, setEstado] = useState(chatData?.postulante?.estado || 'Pendiente');
  const [updatingEstado, setUpdatingEstado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cachuelo, setCachuelo] = useState(chatData?.cachuelo || null);
  const [postulante, setPostulante] = useState(chatData?.postulante || null);
  const [recipientId, setRecipientId] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const messagesEndRef = { current: null };

  useEffect(() => {
    if (!postulacion_id) return;

    const fetchData = async () => {
      try {
        // 1. Postulacion: estado, ids, y mensaje inicial de postulación
        const { data: post } = await supabase.from('postulaciones')
          .select('estado, cachuelo_id, postulante_id, mensaje, created_at')
          .eq('id', postulacion_id).single();

        if (post) {
          setEstado(post.estado);

          // 2. Cachuelo (minimal, sin join) + perfil del postulante
          const { data: cachMin } = await supabase
            .from('cachuelos').select('id, user_id, titulo').eq('id', post.cachuelo_id).single();
          const { data: postlanteProfile } = await supabase
            .from('profiles').select('id, nombre, apellido, email').eq('id', post.postulante_id).single();

          if (cachMin) {
            const publisherId = cachMin.user_id;
            // Calcular recipient: si soy el postulante → escribo al publicador, y viceversa
            setRecipientId(currentUser?.id === post.postulante_id ? publisherId : post.postulante_id);
            setCachuelo({ id: cachMin.id, title: cachMin.titulo, userId: publisherId });
          }

          if (postlanteProfile) {
            const p = postlanteProfile;
            setPostulante({ id: p.id, postulante_id: p.id, nombre: `${p.nombre || ''} ${p.apellido || ''}`.trim() || p.email?.split('@')[0] || 'Postulante' });
          }

          // 3. Mensajes del chat + prepend del mensaje inicial de postulación
          const { data: msgs } = await supabase
            .from('mensajes').select('*')
            .eq('postulacion_id', postulacion_id)
            .order('created_at', { ascending: true });

          const textoInicial = post.mensaje?.trim();
          const msgInicial = textoInicial ? [{
            id: `inicial-${postulacion_id}`,
            sender_id: post.postulante_id,
            texto: textoInicial,
            created_at: post.created_at,
            leido: true,
          }] : [];

          setMessages([...msgInicial, ...(msgs || [])]);

          // 4. Marcar mensajes dirigidos a mí como leídos
          if (currentUser?.id) {
            supabase.from('mensajes')
              .update({ leido: true })
              .eq('postulacion_id', postulacion_id)
              .eq('recipient_id', currentUser.id)
              .eq('leido', false);
          }

          // 5. Historial de estados
          const { data: hist } = await supabase
            .from('postulacion_historial')
            .select('estado, created_at')
            .eq('postulacion_id', postulacion_id)
            .order('created_at', { ascending: true });
          if (hist) setHistorial(hist);
        }
      } catch (err) {
        // Error silencioso — setLoading(false) siempre corre en finally
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Suscripción realtime para mensajes nuevos
    const channel = supabase
      .channel(`chat-${postulacion_id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes', filter: `postulacion_id=eq.${postulacion_id}` },
        (payload) => {
          // Solo agregar si es del otro usuario y no está ya en la lista
          if (payload.new.sender_id !== currentUser?.id) {
            setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new]);
          }
          if (payload.new.recipient_id === currentUser?.id) {
            supabase.from('mensajes').update({ leido: true }).eq('id', payload.new.id);
          }
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postulacion_id, currentUser?.id]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || !recipientId) return;
    setText('');
    const { data: inserted } = await supabase.from('mensajes').insert({
      postulacion_id,
      sender_id: currentUser?.id,
      recipient_id: recipientId,
      texto: trimmed,
      leido: false,
    }).select().single();
    // Mostrar el mensaje inmediatamente sin esperar realtime
    if (inserted) setMessages(prev => prev.some(m => m.id === inserted.id) ? prev : [...prev, inserted]);
  };

  const updateEstado = async (nuevoEstado) => {
    if (updatingEstado) return;
    setUpdatingEstado(true);
    const { error } = await supabase.from('postulaciones').update({ estado: nuevoEstado, updated_at: new Date().toISOString() }).eq('id', postulacion_id);
    if (!error) {
      setEstado(nuevoEstado);
      await supabase.from('postulacion_historial').insert({ postulacion_id, estado: nuevoEstado });
      if (nuevoEstado === 'Aceptado' && cachuelo?.id) {
        await supabase.from('cachuelos').update({ estado: 'Cerrado' }).eq('id', cachuelo.id);
        onAceptado?.();
      }
      if (nuevoEstado === 'Completado' && cachuelo?.id) {
        await supabase.from('cachuelos').update({ estado: 'Completado' }).eq('id', cachuelo.id);
      }
    }
    setUpdatingEstado(false);
  };

  const handleCompletar = async () => {
    if (submittingRating) return;
    setSubmittingRating(true);
    // 1. Marcar postulacion y cachuelo como completados
    await supabase.from('postulaciones').update({ estado: 'Completado', updated_at: new Date().toISOString() }).eq('id', postulacion_id);
    await supabase.from('postulacion_historial').insert({ postulacion_id, estado: 'Completado' });
    if (cachuelo?.id) await supabase.from('cachuelos').update({ estado: 'Completado' }).eq('id', cachuelo.id);
    // 2. Actualizar rating del trabajador (promedio acumulado) + guardar reseña
    const trabajadorId = postulante?.postulante_id || postulante?.id;
    if (trabajadorId) {
      const { data: prof } = await supabase.from('profiles').select('rating, cachuelos_completados').eq('id', trabajadorId).single();
      if (prof) {
        const completados = prof.cachuelos_completados || 0;
        const oldRating   = prof.rating || 0;
        const newRating   = completados > 0 ? (oldRating * completados + ratingStars) / (completados + 1) : ratingStars;
        await supabase.from('profiles').update({
          rating: Math.round(newRating * 10) / 10,
          cachuelos_completados: completados + 1,
        }).eq('id', trabajadorId);
      }
      const { error: resenaError } = await supabase.from('resenas').insert({
        trabajador_id: trabajadorId,
        publicador_id: currentUser?.id,
        postulacion_id,
        cachuelo_id: cachuelo?.id,
        cachuelo_titulo: cachuelo?.title,
        estrellas: ratingStars,
        comentario: ratingComment.trim() || null,
      });
      if (resenaError) console.error('Error insertando reseña:', resenaError);
    }
    setEstado('Completado');
    setShowRatingModal(false);
    setSubmittingRating(false);
  };

  const formatTs = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  const estadoConfig = {
    Pendiente:   { color: C.warning, label: 'Pendiente' },
    Visto:       { color: C.purple,  label: 'Visto' },
    Aceptado:    { color: C.success, label: 'Aceptado' },
    Rechazado:   { color: C.danger,  label: 'Rechazado' },
    Completado:  { color: C.purple,  label: 'Completado' },
  };
  const ec = estadoConfig[estado] || estadoConfig.Pendiente;
  const isDecided = estado === 'Aceptado' || estado === 'Rechazado' || estado === 'Completado';
  const isPublisher = cachuelo?.userId === currentUser?.id;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* TabBar absoluto al fondo — fuera del flujo flex */}
      <TabBar active="mycachuelos" onNavigate={onNavigate} />

      {/* Contenedor principal: ocupa todo menos los 72px del TabBar */}
      <div style={{ position: 'absolute', inset: 0, bottom: 72, display: 'flex', flexDirection: 'column' }}>
      {/* Header – fijo arriba */}
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 16px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{postulante?.nombre || 'Postulante'}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cachuelo?.title}</div>
          </div>
          <span style={{ background: ec.color + '33', color: ec.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: `1px solid ${ec.color}55`, flexShrink: 0 }}>{ec.label}</span>
        </div>

        {/* Botones Aceptar / Rechazar — solo para el publicador */}
        {!loading && !isDecided && cachuelo?.userId === currentUser?.id && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => updateEstado('Rechazado')} disabled={updatingEstado}
              style={{ flex: 1, padding: '9px 0', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1.5px solid rgba(239,68,68,0.6)', color: '#FCA5A5', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <X size={15} /> Rechazar
            </button>
            <button onClick={() => updateEstado('Aceptado')} disabled={updatingEstado}
              style={{ flex: 1, padding: '9px 0', borderRadius: 10, background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.6)', color: '#6EE7B7', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Check size={15} /> Aceptar
            </button>
          </div>
        )}
        {estado === 'Aceptado' && isPublisher && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={() => setShowRatingModal(true)}
              style={{ width: '100%', padding: '9px 0', borderRadius: 10, background: 'rgba(139,92,246,0.2)', border: '1.5px solid rgba(139,92,246,0.6)', color: '#C4B5FD', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <CheckCircle size={15} /> Marcar como completado
            </button>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
              🔒 Este cachuelo ya no es visible en el feed
            </div>
          </div>
        )}
        {estado === 'Aceptado' && !isPublisher && (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.7)', paddingBottom: 2 }}>
            ✅ Postulación aceptada · Esperando confirmación del empleador
          </div>
        )}
        {estado === 'Completado' && (
          <div style={{ textAlign: 'center', fontSize: 12, color: '#C4B5FD', paddingBottom: 2, fontWeight: 700 }}>
            🎉 Trabajo completado
          </div>
        )}
        {estado === 'Rechazado' && (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.7)', paddingBottom: 2 }}>
            ❌ Postulación rechazada
          </div>
        )}
      </div>

      {/* Historial de estados */}
      {historial.length > 0 && (
        <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={() => setShowHistorial(h => !h)}
            style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.textSec }}>📋 Historial de postulación</span>
            <span style={{ fontSize: 11, color: C.textMuted }}>{showHistorial ? '▲ Ocultar' : `▼ Ver (${historial.length} eventos)`}</span>
          </button>
          {showHistorial && (
            <div style={{ padding: '4px 16px 12px' }}>
              {historial.map((h, i) => {
                const cfg = { Pendiente: { icon: '📩', color: C.warning }, Visto: { icon: '👀', color: C.purple }, Aceptado: { icon: '✅', color: C.success }, Rechazado: { icon: '❌', color: C.danger }, Completado: { icon: '🎉', color: C.purple } };
                const { icon, color } = cfg[h.estado] || { icon: '•', color: C.textMuted };
                const fecha = new Date(h.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < historial.length - 1 ? 8 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      {i < historial.length - 1 && <div style={{ width: 2, height: 16, background: C.border, margin: '2px 0' }} />}
                    </div>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color }}>{h.estado}</span>
                      <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 6 }}>{fecha}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mensajes – zona scrolleable */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10, background: C.bg }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: C.textMuted, fontSize: 13 }}>Cargando...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: C.textMuted, fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
            Inicia la conversación
          </div>
        ) : null}
        {messages.map(m => {
          const isMe = m.sender_id === currentUser?.id;
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', background: isMe ? C.headerBg : '#fff', color: isMe ? '#fff' : C.text, borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div>{m.texto}</div>
                <div style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,0.65)' : C.textMuted, marginTop: 4, textAlign: 'right' }}>{formatTs(m.created_at)}</div>
              </div>
            </div>
          );
        })}
        <div ref={el => { messagesEndRef.current = el; }} />
      </div>

      {/* Input – fijo arriba del TabBar */}
      <div style={{ padding: '10px 16px 16px', background: C.card, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Escribe un mensaje..." rows={1}
          style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: '10px 16px', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: 100, overflow: 'auto' }} />
        <button onClick={sendMessage}
          style={{ width: 42, height: 42, borderRadius: 21, background: C.headerBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Send size={18} color="#fff" />
        </button>
      </div>
      </div>{/* fin contenedor principal */}

      {/* Modal rating */}
      {showRatingModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
          <div style={{ width: '100%', background: C.card, borderRadius: '20px 20px 0 0', padding: '24px 20px 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>⭐</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>¿Cómo fue el trabajo?</div>
              <div style={{ fontSize: 13, color: C.textSec }}>Califica a <strong>{postulante?.nombre || 'el trabajador'}</strong></div>
            </div>

            {/* Estrellas */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRatingStars(n)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 36, lineHeight: 1, color: n <= ratingStars ? '#F59E0B' : '#D1D5DB', transition: 'color .15s' }}>
                  ★
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: C.textSec, marginBottom: 16 }}>
              {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][ratingStars]}
            </div>

            {/* Comentario */}
            <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)}
              placeholder="Comentario opcional..." rows={3}
              style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '10px 14px', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16 }} />

            <Btn onClick={handleCompletar} disabled={submittingRating} style={{ width: '100%', marginBottom: 10 }}>
              {submittingRating ? 'Guardando...' : 'Confirmar y completar'}
            </Btn>
            <button onClick={() => setShowRatingModal(false)}
              style={{ width: '100%', padding: '10px 0', borderRadius: 12, background: 'none', border: `1.5px solid ${C.border}`, color: C.textSec, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── PERFIL PÚBLICO ────────────────────────────────────────────────────────────
const PublicProfileScreen = ({ userId, onBack, onViewCachuelo, onNavigate, user }) => {
  const { C } = useTheme();
  const [profile, setProfile] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [showReporte, setShowReporte] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('resenas').select('*').eq('trabajador_id', userId).order('created_at', { ascending: false }),
      supabase.from('postulaciones')
        .select('*, cachuelos(titulo, distrito, precio, duracion, categorias(label, emoji))')
        .eq('postulante_id', userId).eq('estado', 'Aceptado')
        .order('created_at', { ascending: false }).limit(20),
    ]).then(([profRes, resenasRes, trabajosRes]) => {
      if (profRes.data) setProfile(profRes.data);
      setResenas(resenasRes.data || []);
      setTrabajos(trabajosRes.data || []);
      setLoading(false);
    });
  }, [userId]);

  const nombre      = profile?.nombre || '';
  const apellido    = profile?.apellido || '';
  const fullName    = [nombre, apellido].filter(Boolean).join(' ') || profile?.email?.split('@')[0] || 'Usuario';
  const initials    = (`${nombre[0] || ''}${apellido[0] || ''}`).toUpperCase() || 'U';
  const rating      = profile?.rating ?? 0;
  const dniVerificado = profile?.dni_verificado ?? false;
  const disponible  = profile?.disponible ?? false;
  const bio         = profile?.bio || '';
  const especialidades = profile?.especialidades || [];
  const zonas       = profile?.zonas || [];
  const starDist    = [5,4,3,2,1].map(s => ({ s, n: resenas.filter(r => Math.round(r.estrellas || 0) === s).length }));
  const maxStar     = Math.max(...starDist.map(x => x.n), 1);

  const shareText = `👷 ${fullName} en Cachuelo${rating > 0 ? ` · ⭐ ${rating.toFixed(1)}` : ''}`;
  const shareUrl  = 'https://cachuelo.pe';

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: fullName, text: shareText, url: shareUrl }); }
      catch (_) {}
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ReviewCard = ({ r, i }) => {
    const pal = getAvatarPalette(i);
    const ini = (r.cachuelo_titulo || '?').slice(0, 2).toUpperCase();
    return (
      <div style={{ background: C.card, borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: pal.color, flexShrink: 0 }}>{ini}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{r.cachuelo_titulo || 'Cachuelo'}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>
              {timeAgo(r.created_at)} · <span style={{ color: C.warning }}>{'★'.repeat(Math.round(r.estrellas || 0))}{'☆'.repeat(5 - Math.round(r.estrellas || 0))}</span>
            </div>
          </div>
        </div>
        {r.comentario && <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5, fontStyle: 'italic' }}>"{r.comentario}"</div>}
      </div>
    );
  };

  const StarChart = () => (
    <div style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: C.text, lineHeight: 1 }}>{rating.toFixed(1)}</div>
          <div style={{ color: C.warning, fontSize: 13, margin: '4px 0' }}>{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{resenas.length} reseña{resenas.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ flex: 1 }}>
          {starDist.map(({ s, n }) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.textSec, width: 10 }}>{s}</span>
              <div style={{ flex: 1, height: 7, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(n / maxStar) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.warning}, #FCD34D)`, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 10, color: C.textMuted, width: 14 }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Screen withTabs activeTab="home" onNavigate={onNavigate}>

      {/* ── HEADER COMPACTO ── */}
      <div style={{ position: 'relative' }}>
        <div style={{ background: `linear-gradient(160deg, ${C.headerBg} 0%, ${C.headerDark} 70%, #1A3A8F 100%)`, padding: '48px 20px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          {loading ? (
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Cargando...</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Avatar (solo lectura) */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 80, height: 80, borderRadius: 40, padding: 3, background: `linear-gradient(135deg, ${C.primary}, ${C.warning})` }}>
                  <div style={{ width: 74, height: 74, borderRadius: 37, overflow: 'hidden', background: C.headerDark }}>
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff' }}>{initials}</div>}
                  </div>
                </div>
                {dniVerificado && (
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: 11, background: C.success, border: '2px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={11} color="#fff" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                <div style={{ color: '#fff', fontSize: 18, fontWeight: 900, letterSpacing: -0.2 }}>{fullName}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 3, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {bio || <span style={{ fontStyle: 'italic' }}>Sin descripción</span>}
                </div>
                <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                  {dniVerificado && <span style={{ background: 'rgba(16,185,129,0.2)', color: '#6EE7B7', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.3)' }}>✓ DNI</span>}
                  {rating > 0 && <span style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.3)' }}>⭐ {rating.toFixed(1)}</span>}
                </div>
                {/* Disponibilidad (solo lectura) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: disponible ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.15)', border: `1px solid ${disponible ? 'rgba(16,185,129,0.35)' : 'rgba(148,163,184,0.25)'}`, borderRadius: 20, padding: '4px 8px 4px 6px' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: disponible ? '#10B981' : '#94A3B8', boxShadow: disponible ? '0 0 5px #10B981' : 'none', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: disponible ? '#6EE7B7' : 'rgba(255,255,255,0.4)' }}>{disponible ? 'Disponible' : 'No disponible'}</span>
                  </div>
                  {profile?.tiempo_respuesta && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>⚡ {profile.tiempo_respuesta}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Back button */}
        <button onClick={onBack} style={{ position: 'absolute', top: 8, left: 12, width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
          <ArrowLeft size={18} color="#fff" />
        </button>
        {/* Title */}
        <div style={{ position: 'absolute', top: 14, left: 0, right: 0, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none', zIndex: 9 }}>
          Perfil del publicador
        </div>
        {/* Share button */}
        <button onClick={handleShare} style={{ position: 'absolute', top: 8, right: 12, width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
          <Share2 size={17} color="#fff" />
        </button>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', background: C.card, borderBottom: `2px solid ${C.border}` }}>
        {[['info', 'Información'], ['trabajos', `Trabajos (${trabajos.length})`], ['resenas', `Reseñas (${resenas.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, padding: '12px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: activeTab === id ? C.primary : C.textMuted, background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === id ? C.primary : 'transparent'}`, cursor: 'pointer', marginBottom: -2 }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO TABS ── */}
      <div style={{ padding: '16px 16px 80px', background: C.cardElevated }}>

        {/* TAB: INFORMACIÓN */}
        {activeTab === 'info' && (<>
          {/* Bio */}
          <div style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Sobre mí</div>
            {bio
              ? <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{bio}</div>
              : <div style={{ fontSize: 13, color: C.textMuted, fontStyle: 'italic' }}>Este usuario aún no ha agregado una descripción.</div>}
          </div>

          {/* Especialidades */}
          {especialidades.length > 0 && (
            <div style={{ background: C.card, borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Especialidades</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {especialidades.map((e, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 20, background: C.primary + '18', color: C.primary, border: `1px solid ${C.primary}30` }}>{e}</span>)}
              </div>
            </div>
          )}

          {/* Zonas */}
          {zonas.length > 0 && (
            <div style={{ background: C.card, borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Zonas de trabajo</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {zonas.map((z, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 20, background: '#EDE9FE', color: '#5B21B6', border: '1px solid #DDD6FE' }}>📍 {z}</span>)}
              </div>
            </div>
          )}

          {resenas.length > 0 && <StarChart />}
          {resenas.slice(0, 2).map((r, i) => <ReviewCard key={r.id || i} r={r} i={i} />)}
        </>)}

        {/* TAB: TRABAJOS */}
        {activeTab === 'trabajos' && (<>
          <div style={{ background: C.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: C.success + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✅</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{trabajos.length} trabajo{trabajos.length !== 1 ? 's' : ''} completado{trabajos.length !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: 11, color: C.textSec, marginTop: 2 }}>Historial como trabajador{rating > 0 ? ` · ⭐ ${rating.toFixed(1)} promedio` : ''}</div>
            </div>
          </div>
          {trabajos.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted, fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>Sin trabajos registrados todavía</div>
            : trabajos.map((t, i) => {
                const c = t.cachuelos;
                if (!c) return null;
                return (
                  <div key={t.id || i} style={{ background: C.card, borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <CategoryIcon label={c.categorias?.label || ''} size={42} iconSize={18} radius={11} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.titulo}</div>
                        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: C.textSec, marginBottom: 6 }}>
                          <span>📍 {c.distrito || 'Lima'}</span>
                          <span>🗓 {timeAgo(t.created_at)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11, color: C.warning }}>✅ Completado</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: C.success }}>S/{c.precio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </>)}

        {/* TAB: RESEÑAS */}
        {activeTab === 'resenas' && (<>
          {resenas.length > 0 && <StarChart />}
          {resenas.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted, fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>Sin reseñas todavía</div>
            : resenas.map((r, i) => <ReviewCard key={r.id || i} r={r} i={i} />)}
        </>)}

        {/* Reportar */}
        {user && user.id !== userId && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <button onClick={() => setShowReporte(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 12, padding: '12px 0' }}>
              <Flag size={12} /> Reportar este usuario
            </button>
          </div>
        )}
      </div>

      {showReporte && (
        <ReporteModal
          tipo="usuario"
          targetId={userId}
          targetTitle={fullName}
          reporterId={user?.id}
          onClose={() => setShowReporte(false)}
        />
      )}

      {/* Share bottom sheet */}
      {showShareModal && (
        <div onClick={() => setShowShareModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: C.card, borderRadius: '20px 20px 0 0', padding: '20px 20px 36px' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>Compartir perfil</div>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 20 }}>{fullName}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '💬', label: 'WhatsApp',    color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}` },
                { emoji: '✈️', label: 'Telegram',    color: '#0088CC', href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
                { emoji: '🐦', label: 'X (Twitter)', color: '#000',    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}` },
                { emoji: '💼', label: 'LinkedIn',    color: '#0077B5', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
              ].map(({ emoji, label, color, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setShowShareModal(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: '#F9FAFB', textDecoration: 'none', border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color }}>{label}</span>
                </a>
              ))}
              <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: copied ? '#F0FDF4' : '#F9FAFB', border: `1px solid ${copied ? C.success : C.border}`, cursor: 'pointer', width: '100%' }}>
                <span style={{ fontSize: 22 }}>{copied ? '✅' : '🔗'}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: copied ? C.success : C.text }}>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
};

// ── RESETEAR CONTRASEÑA ───────────────────────────────────────────────────────
const ResetPasswordScreen = ({ onDone }) => {
  const [pass, setPass] = useState('');
  const [passConf, setPassConf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passValid = pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
  const mismatch = passConf && pass !== passConf;
  const canSubmit = passValid && !mismatch && pass === passConf;

  const handleReset = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pass });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess(true);
    setTimeout(onDone, 2000);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflowY: 'auto' }}>
      <div style={{ padding: '60px 28px 40px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>🔐</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, textAlign: 'center', marginBottom: 8 }}>
          Nueva contraseña
        </div>
        <div style={{ fontSize: 13, color: C.textSec, textAlign: 'center', marginBottom: 28 }}>
          Elige una contraseña segura para tu cuenta
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 700, color: C.success, fontSize: 16 }}>¡Contraseña actualizada!</div>
            <div style={{ fontSize: 13, color: C.textSec, marginTop: 8 }}>Redirigiendo al inicio...</div>
          </div>
        ) : (
          <>
            <Input label="Nueva contraseña" placeholder="Mín. 8 caracteres" type="password"
              value={pass} onChange={e => setPass(e.target.value)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: -6, marginBottom: 14 }}>
              {[['8+ caracteres', pass.length >= 8], ['Mayúscula', /[A-Z]/.test(pass)], ['Número', /[0-9]/.test(pass)]].map(([label, ok]) => (
                <span key={label} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20,
                  background: ok ? '#ECFDF5' : '#F3F4F6', color: ok ? C.success : C.textMuted, fontWeight: 600 }}>
                  {ok ? '✓' : '·'} {label}
                </span>
              ))}
            </div>
            <Input label="Confirmar contraseña" placeholder="Repite tu contraseña" type="password"
              value={passConf} onChange={e => setPassConf(e.target.value)} />
            {mismatch && (
              <div style={{ fontSize: 12, color: C.danger, marginTop: -10, marginBottom: 10 }}>
                Las contraseñas no coinciden
              </div>
            )}
            {error && (
              <div style={{ background: '#FEF2F2', border: `1px solid ${C.danger}30`, borderRadius: 10,
                padding: '10px 14px', marginBottom: 12, fontSize: 13, color: C.danger }}>
                {error}
              </div>
            )}
            <Btn onClick={handleReset} disabled={!canSubmit || loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </Btn>
          </>
        )}
      </div>
    </div>
  );
};

//  APP ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('cachuelo_dark') === '1');
  const toggleDark = () => setIsDark(v => { const n = !v; localStorage.setItem('cachuelo_dark', n ? '1' : '0'); C = n ? DARK : LIGHT; return n; });
  C = isDark ? DARK : LIGHT;

  const [screen, setScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCachuelo, setSelectedCachuelo] = useState(null);
  const [viewedUserId, setViewedUserId] = useState(null);
  const [prevScreen, setPrevScreen] = useState('home');
  const [cachueloParaPostulantes, setCachueloParaPostulantes] = useState(null);
  const [cachueloParaEditar, setCachueloParaEditar] = useState(null);
  const [postulantesParent, setPostulantesParent] = useState('mycachuelos');
  const [chatData, setChatData] = useState(null); // { postulacion_id, cachuelo, postulante, isOwner }
  const [user, setUser] = useState(null);
  const [cachuelos, setCachuelos] = useState(CACHUELOS); // fallback al mock mientras carga

  const normalizeCachuelos = (data, profileMap = {}) => data.map(c => {
    const p = profileMap[c.user_id];
    const pubName = p ? `${p.nombre || ''} ${p.apellido || ''}`.trim() || p.email?.split('@')[0] || 'Usuario' : 'Usuario';
    const pubAvatar = p ? (`${p.nombre?.[0] || ''}${p.apellido?.[0] || ''}`).toUpperCase() || 'U' : 'U';
    return {
      id: c.id,
      title: c.titulo,
      category: c.categorias?.label || '',
      emoji: c.categorias?.emoji || '💼',
      location: c.distrito || 'Lima',
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

  const refreshCachuelos = async () => {
    const { data, error } = await supabase
      .from('cachuelos')
      .select(`*, categorias(label, emoji, color)`)
      .eq('estado', 'Activo')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return;
    const userIds = [...new Set(data.map(c => c.user_id).filter(Boolean))];
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
    const profileMap = {};
    (profiles || []).forEach(p => { profileMap[p.id] = p; });
    setCachuelos(normalizeCachuelos(data, profileMap));
  };

  // Cargar cachuelos al iniciar
  useEffect(() => { refreshCachuelos(); }, []);

  // Escuchar cambios de sesión (login/logout/recovery en cualquier pantalla)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') { setUser(null); }
      if (event === 'PASSWORD_RECOVERY') { setScreen('resetpassword'); }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Auto-advance splash: si hay sesión activa → home, si no → onboarding
  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            nombre: session.user.user_metadata?.nombre || session.user.email.split('@')[0],
            apellido: session.user.user_metadata?.apellido || '',
          });
          setScreen('home');
          setActiveTab('home');
        } else {
          setScreen('onboarding');
        }
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const navigate = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') setScreen('home');
    else if (tab === 'search') setScreen('search');
    else if (tab === 'publish') setScreen('publish');
    else if (tab === 'mycachuelos') setScreen('mycachuelos');
    else if (tab === 'profile') setScreen('profile');
    else setScreen(tab);
  };

  const viewCachuelo = (c) => {
    setPrevScreen(screen);
    setSelectedCachuelo(c);
    setScreen('detail');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'resetpassword': return <ResetPasswordScreen onDone={() => setScreen('login')} />;
      case 'splash':      return <SplashScreen />;
      case 'onboarding':  return <OnboardingScreen onDone={() => setScreen('welcome')} />;
      case 'welcome':     return <WelcomeScreen
                            onEmailLogin={() => setScreen('login')}
                            onGoogleLogin={() => { setUser({ email: 'google@user.com', nombre: 'Usuario', apellido: 'Google' }); setScreen('home'); setActiveTab('home'); }}
                            onPhoneLogin={() => setScreen('login')}
                          />;
      case 'login':       return <LoginScreen onLogin={(u) => { setUser(u); setScreen('home'); setActiveTab('home'); }} onAdmin={() => setScreen('admin')} />;
      case 'home':        return <HomeScreen onNavigate={navigate} onViewCachuelo={viewCachuelo} cachuelos={cachuelos} user={user} onNotifications={() => { setPrevScreen('home'); setScreen('notifications'); }} />;
      case 'notifications': return <NotificationsScreen user={user} onBack={() => setScreen(prevScreen)} onNavigate={navigate} onViewPostulantes={(c) => { setCachueloParaPostulantes(c); setPostulantesParent('notifications'); setScreen('postulantes'); }} onViewCachuelo={(c) => { setSelectedCachuelo(c); setPrevScreen('notifications'); setScreen('detail'); }} onOpenChat={(data) => { setChatData(data); setPrevScreen('notifications'); setScreen('chat'); }} />;
      case 'detail':      return <DetailScreen cachuelo={selectedCachuelo} onBack={() => setScreen(prevScreen)} onNavigate={navigate} user={user} onRequireAuth={() => setScreen('login')} onViewPublisher={(uid) => { setViewedUserId(uid); setPrevScreen('detail'); setScreen('publicprofile'); }} onVerPostulantes={(c) => { setCachueloParaPostulantes(c); setPostulantesParent('detail'); setScreen('postulantes'); }} />;
      case 'publicprofile': return <PublicProfileScreen userId={viewedUserId} onBack={() => setScreen(prevScreen)} onViewCachuelo={(c) => { setPrevScreen('publicprofile'); setSelectedCachuelo(c); setScreen('detail'); }} onNavigate={navigate} user={user} />;
      case 'postulantes':   return <PostulantesScreen cachuelo={cachueloParaPostulantes} onBack={() => setScreen(postulantesParent)} onViewProfile={(uid) => { setViewedUserId(uid); setPrevScreen('postulantes'); setScreen('publicprofile'); }} onIniciarChat={(data) => { setChatData(data); setPrevScreen('postulantes'); setScreen('chat'); }} onNavigate={navigate} />;
      case 'chat':          return <ChatScreen chatData={chatData} currentUser={user} onBack={() => setScreen(prevScreen)} onNavigate={navigate} onAceptado={refreshCachuelos} />;
      case 'publish':     return <PublishScreen onNavigate={navigate} user={user} onPublished={refreshCachuelos} />;
      case 'search':      return <SearchScreen onNavigate={navigate} onViewCachuelo={viewCachuelo} cachuelos={cachuelos} />;
      case 'mycachuelos': return <MyCachuelos onNavigate={navigate} onViewCachuelo={viewCachuelo} user={user} onVerPostulantes={(c) => { setCachueloParaPostulantes(c); setPostulantesParent('mycachuelos'); setScreen('postulantes'); }} onIniciarChat={(data) => { setChatData(data); setPrevScreen('mycachuelos'); setScreen('chat'); }} onEditar={(c) => { setCachueloParaEditar(c); setScreen('editcachuelo'); }} />;
      case 'editcachuelo': return <EditCachueloScreen cachuelo={cachueloParaEditar} onBack={() => setScreen('mycachuelos')} onSaved={refreshCachuelos} onNavigate={navigate} />;
      case 'profile':     return <ProfileScreen onNavigate={navigate} onAdmin={() => setScreen('admin')} onAdminTools={() => setScreen('admintools')} user={user} onLogout={async () => { await supabase.auth.signOut(); setUser(null); setScreen('welcome'); }} />;
      case 'config':      return <ConfigScreen onBack={() => setScreen('profile')} onNavigate={navigate} user={user} onLogout={async () => { await supabase.auth.signOut(); setUser(null); setScreen('welcome'); }} onAdmin={() => setScreen('admin')} onAdminTools={() => setScreen('admintools')} />;
      case 'admin':       return <AdminDashboard onBack={() => setScreen('profile')} />;
      case 'admintools':  return <AdminToolsScreen onBack={() => setScreen('profile')} onRefresh={refreshCachuelos} />;
      default:            return <SplashScreen />;
    }
  };

  const theme = isDark ? DARK : LIGHT;

  return (
    <ThemeCtx.Provider value={{ C: theme, isDark, toggleDark }}>
      <PhoneFrame isDark={isDark} onToggleDark={toggleDark}>
        {renderScreen()}
      </PhoneFrame>
    </ThemeCtx.Provider>
  );
}
