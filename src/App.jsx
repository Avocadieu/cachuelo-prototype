import { useState, useEffect } from 'react';
import {
  Home, Search, PlusCircle, Briefcase, User, Star, MapPin, Clock,
  ChevronRight, ChevronLeft, X, Check, ArrowLeft, Bell, Settings,
  Shield, FileText, BarChart2, Users, Download, TrendingUp, Award,
  Phone, Mail, CreditCard, Zap, Camera, Truck, Wrench, BookOpen,
  Leaf, Monitor, Calendar, MessageCircle, Filter, Heart, Share2,
  LogOut, Eye, CheckCircle, AlertCircle, Package, Send, Hash,
  DollarSign
} from 'lucide-react';

// ─── PALETA ────────────────────────────────────────────────────────────────
const C = {
  primary: '#FF6B35',
  primaryLight: '#FF8C5A',
  primaryDark: '#E55A25',
  bg: '#FAFAFA',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSec: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
};

// ─── DATOS MOCK ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, label: 'Limpieza',     emoji: '🧹', color: '#E0F2FE' },
  { id: 2, label: 'Mudanza',      emoji: '📦', color: '#FEF3C7' },
  { id: 3, label: 'Redacción',    emoji: '✍️',  color: '#F0FDF4' },
  { id: 4, label: 'Diseño',       emoji: '🎨', color: '#FDF4FF' },
  { id: 5, label: 'Reparaciones', emoji: '🔧', color: '#FFF7ED' },
  { id: 6, label: 'Cocina',       emoji: '👨‍🍳', color: '#FEF9C3' },
  { id: 7, label: 'Delivery',     emoji: '🚗', color: '#ECFDF5' },
  { id: 8, label: 'Tutorías',     emoji: '📚', color: '#EFF6FF' },
  { id: 9, label: 'Jardinería',   emoji: '🌱', color: '#F0FDF4' },
  { id: 10, label: 'Tecnología',  emoji: '💻', color: '#F5F3FF' },
  { id: 11, label: 'Fotografía',  emoji: '📷', color: '#FDF2F8' },
  { id: 12, label: 'Eventos',     emoji: '🎉', color: '#FFF1F2' },
];

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

const Avatar = ({ initials, size = 36, bg = C.primary, color = '#fff', fontSize = 13 }) => (
  <div style={{
    width: size, height: size, borderRadius: size, background: bg,
    color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize, flexShrink: 0,
  }}>{initials}</div>
);

const Badge = ({ children, color = C.primary, bg }) => (
  <span style={{
    background: bg || color + '18', color,
    fontSize: 10, fontWeight: 600, padding: '2px 7px',
    borderRadius: 20, whiteSpace: 'nowrap',
  }}>{children}</span>
);

const Btn = ({ children, onClick, style = {}, variant = 'primary', disabled }) => {
  const base = {
    border: 'none', borderRadius: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 14, transition: 'all .15s', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 6, padding: '12px 20px',
    opacity: disabled ? 0.6 : 1,
  };
  const variants = {
    primary: { background: C.primary, color: '#fff' },
    outline: { background: 'transparent', color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost: { background: '#F3F4F6', color: C.text },
    danger: { background: C.danger, color: '#fff' },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, type = 'text', value, onChange, icon }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>{label}</label>}
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted }}>{icon}</span>}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          width: '100%', padding: icon ? '11px 12px 11px 38px' : '11px 14px',
          border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14,
          color: C.text, background: '#fff', outline: 'none', fontFamily: 'inherit',
        }}
      />
    </div>
  </div>
);

const Textarea = ({ label, placeholder, value, onChange, rows = 4 }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>{label}</label>}
    <textarea
      placeholder={placeholder} value={value} onChange={onChange} rows={rows}
      style={{
        width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`,
        borderRadius: 10, fontSize: 14, color: C.text, background: '#fff',
        outline: 'none', fontFamily: 'inherit', resize: 'none',
      }}
    />
  </div>
);

// ─── PHONE FRAME ─────────────────────────────────────────────────────────────
const PhoneFrame = ({ children }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px',
    minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  }}>
    {/* Brand label */}
    <div style={{ marginBottom: 20, textAlign: 'center' }}>
      <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
        💼 Cachuelo
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>
        Prototipo Interactivo v0.1 • Lima, Perú
      </div>
    </div>

    {/* Phone shell */}
    <div style={{
      width: 375, background: '#000', borderRadius: 52,
      boxShadow: '0 0 0 2px #333, 0 0 0 4px #111, 0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 1px #444',
      padding: '14px 8px 8px',
      position: 'relative',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 30, background: '#000', borderRadius: 20,
        zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
        <div style={{ width: 60, height: 6, borderRadius: 3, background: '#111' }} />
      </div>

      {/* Screen */}
      <div style={{
        width: '100%', height: 780, borderRadius: 44, overflow: 'hidden',
        background: C.bg, position: 'relative',
      }}>
        {/* Status bar */}
        <div style={{
          background: 'transparent', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '12px 20px 0', position: 'absolute',
          top: 0, left: 0, right: 0, zIndex: 20, pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              {[3,5,7,9].map(h => <div key={h} style={{ width: 3, height: h, background: C.text, borderRadius: 1 }} />)}
            </div>
            <div style={{ width: 14, height: 8, border: `1.5px solid ${C.text}`, borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 2, height: 4, background: C.text, borderRadius: 1 }} />
              <div style={{ width: '70%', height: '100%', background: C.text, borderRadius: 1 }} />
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

    {/* Tech stack */}
    <div style={{ marginTop: 24, textAlign: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
        Stack Tecnológico
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['React Native', 'Expo', 'Supabase', 'PostgreSQL', 'Yape API'].map(t => (
          <span key={t} style={{
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
            fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)',
          }}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

// ─── TAB BAR ─────────────────────────────────────────────────────────────────
const TabBar = ({ active, onNavigate }) => {
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
      background: '#fff', borderTop: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'flex-end', paddingBottom: 8,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isPublish = tab.id === 'publish';
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, border: 'none', background: 'transparent', cursor: 'pointer',
              padding: isPublish ? '0 0 4px' : '8px 0 4px',
              position: 'relative',
            }}
          >
            {isPublish ? (
              <div style={{
                width: 52, height: 52, borderRadius: 26,
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px ${C.primary}55`,
                marginTop: -22, border: '3px solid #fff',
              }}>
                <Icon size={24} color="#fff" />
              </div>
            ) : (
              <Icon size={20} color={isActive ? C.primary : C.textMuted} strokeWidth={isActive ? 2.5 : 1.8} />
            )}
            <span style={{
              fontSize: 9, fontWeight: isActive || isPublish ? 700 : 500,
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

// ════════════════════════════════════════════════════════════════════════════
//  PANTALLAS
// ════════════════════════════════════════════════════════════════════════════

// 1. SPLASH ─────────────────────────────────────────────────────────────────
const SplashScreen = () => {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(160deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 100, height: 100, background: 'rgba(255,255,255,0.15)',
        borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 52, marginBottom: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>💼</div>
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

const LoginScreen = ({ onLogin, onAdmin }) => {
  const [mode, setMode] = useState('login'); // login | register | phone
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const [reg, setReg] = useState({
    nombre: '', apellido: '', pais: 'Perú', fechaNac: '',
    email: '', emailConf: '', telefono: '', ciudad: '', pass: '', passConf: '',
  });
  const updReg = (k, v) => setReg(r => ({ ...r, [k]: v }));

  const emailMismatch = reg.emailConf && reg.email !== reg.emailConf;
  const passMismatch  = reg.passConf  && reg.pass  !== reg.passConf;

  const handleLogin = () => {
    if (email === 'cachuelo@mvp.com' && pass === 'cachuelomvp') {
      onAdmin();
    } else {
      onLogin();
    }
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('cachuelo_users') || '[]');
    users.push({ ...reg, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('cachuelo_users', JSON.stringify(users));
    onLogin();
  };

  const regFilled = reg.nombre && reg.apellido && reg.email && reg.emailConf && reg.fechaNac
    && reg.telefono && reg.ciudad && reg.pass && reg.passConf
    && !emailMismatch && !passMismatch;

  const selectStyle = {
    width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`,
    borderRadius: 10, fontSize: 14, color: C.text, background: '#fff',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${C.primary}, ${C.primaryDark})`,
        padding: '60px 24px 40px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>💼</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Cachuelo</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Trabajos puntuales en Perú</div>
      </div>

      <div style={{ padding: '28px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 3, marginBottom: 24 }}>
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
              <button style={{ background: 'none', border: 'none', color: C.primary, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <Btn onClick={handleLogin} style={{ width: '100%', marginBottom: 16 }}>Ingresar</Btn>
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

            <Input label="Número de teléfono *" placeholder="+51 987 654 321" type="tel"
              value={reg.telefono} onChange={e => updReg('telefono', e.target.value)} icon={<Phone size={15} />} />

            <Input label="Ciudad *" placeholder="Ej: Lima"
              value={reg.ciudad} onChange={e => updReg('ciudad', e.target.value)} icon={<MapPin size={15} />} />

            <Input label="Contraseña *" placeholder="Mín. 8 caracteres" type="password"
              value={reg.pass} onChange={e => updReg('pass', e.target.value)} />

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

            <Btn onClick={handleRegister} style={{ width: '100%', marginBottom: 16 }} disabled={!regFilled}>
              Crear cuenta
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
          <Btn variant="ghost" onClick={onLogin} style={{ flex: 1, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 16 }}>🇬</span> Google
          </Btn>
          <Btn variant="ghost" onClick={() => setMode('phone')} style={{ flex: 1, border: `1px solid ${C.border}` }}>
            <Phone size={15} /> Teléfono
          </Btn>
        </div>

        {mode === 'phone' && (
          <div style={{ marginTop: 16 }}>
            <Input label="Número de celular" placeholder="+51 987 654 321" type="tel" icon={<Phone size={15} />} />
            <Btn style={{ width: '100%' }} onClick={onLogin}>Enviar código SMS</Btn>
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
const HomeScreen = ({ onNavigate, onViewCachuelo }) => {
  const [filter, setFilter] = useState('Todos');
  const [selectedCat, setSelectedCat] = useState(null);
  const filters = ['Todos', 'Destacados', 'Remoto', 'Cerca'];

  const filteredCachuelos = CACHUELOS.filter(c => {
    if (filter === 'Destacados') return c.featured;
    if (filter === 'Remoto') return c.remote;
    if (selectedCat) return c.category === selectedCat;
    return true;
  });

  return (
    <Screen withTabs activeTab="home" onNavigate={onNavigate}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
        padding: '44px 20px 20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Buenos días 👋</div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginTop: 2 }}>Hola, Cotillo</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => {}} style={{
              width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <Bell size={18} color="#fff" />
              <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#FCD34D', borderRadius: '50%' }} />
            </button>
            <Avatar initials="SC" size={38} bg="rgba(255,255,255,0.25)" fontSize={13} />
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}>
          <Search size={16} color={C.textMuted} />
          <input placeholder="Buscar cachuelos..." style={{
            flex: 1, border: 'none', outline: 'none', fontSize: 14,
            color: C.text, padding: '12px 0', fontFamily: 'inherit', background: 'transparent',
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
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(selectedCat === cat.label ? null : cat.label)}
              style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 5, background: selectedCat === cat.label ? C.primary : cat.color,
                border: `1.5px solid ${selectedCat === cat.label ? C.primary : 'transparent'}`,
                borderRadius: 12, padding: '10px 14px', cursor: 'pointer', minWidth: 72,
                transition: 'all .2s',
              }}>
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: selectedCat === cat.label ? '#fff' : C.text, whiteSpace: 'nowrap' }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {filters.map(f => (
            <button key={f} onClick={() => { setFilter(f); setSelectedCat(null); }}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none',
                fontWeight: 600, fontSize: 12, cursor: 'pointer',
                background: filter === f ? C.primary : '#F3F4F6',
                color: filter === f ? '#fff' : C.textSec,
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
const CachuCard = ({ c, onPress }) => (
  <div onClick={onPress} style={{
    background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer',
    border: `1px solid ${C.border}`, transition: 'transform .1s',
  }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: CATEGORIES.find(cat => cat.label === c.category)?.color || '#f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
        }}>{c.emoji}</div>
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

// 5. DETALLE DE CACHUELO ──────────────────────────────────────────────────────
const DetailScreen = ({ cachuelo, onBack, onNavigate }) => {
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);

  if (!cachuelo) return null;

  const handleApply = () => {
    if (!applied) { setApplied(true); }
  };

  return (
    <Screen withTabs activeTab="home" onNavigate={onNavigate}>
      {/* Sticky header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
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
          <button style={{
            width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 size={16} color="#fff" />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {/* Title card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16,
              background: CATEGORIES.find(c => c.label === cachuelo.category)?.color || '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
            }}>{cachuelo.emoji}</div>
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
          <div style={{ display: 'flex', gap: 0, background: '#F9FAFB', borderRadius: 12, overflow: 'hidden' }}>
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
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>Descripción</div>
          <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.7 }}>{cachuelo.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 12px', background: '#F0FDF4', borderRadius: 10 }}>
            <Calendar size={14} color={C.success} />
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 500 }}>{cachuelo.schedule}</span>
          </div>
        </div>

        {/* Publisher */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Publicado por</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials={cachuelo.publisher.avatar} size={48} bg={C.primaryLight} fontSize={16} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{cachuelo.publisher.name}</span>
                {cachuelo.publisher.verified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#ECFDF5', padding: '2px 7px', borderRadius: 10 }}>
                    <Shield size={10} color={C.success} />
                    <span style={{ fontSize: 10, color: C.success, fontWeight: 600 }}>Verificado</span>
                  </div>
                )}
              </div>
              <Stars rating={cachuelo.publisher.rating} size={14} />
              <span style={{ fontSize: 11, color: C.textSec, marginLeft: 4 }}>{cachuelo.publisher.rating} / 5</span>
            </div>
          </div>
        </div>

        {/* Message + Apply */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
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
            disabled={applied}
          >
            {applied ? <><CheckCircle size={18} /> Postulado con éxito</> : <><Send size={18} /> Postularme</>}
          </Btn>
          {applied && (
            <p style={{ fontSize: 11, color: C.success, textAlign: 'center', marginTop: 8 }}>
              ¡Tu postulación fue enviada! El publicador te contactará pronto.
            </p>
          )}
        </div>
      </div>
    </Screen>
  );
};

// 6. PUBLICAR ─────────────────────────────────────────────────────────────────
const PublishScreen = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', category: '', description: '',
    price: '', payType: 'Fijo', district: '', duration: '',
    featured: false, payMethod: '',
  });
  const [published, setPublished] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const stepLabels = ['Info básica', 'Detalles', 'Pago'];

  const handlePublish = () => setPublished(true);

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
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding: '44px 20px 20px' }}>
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
                      padding: '7px 12px', borderRadius: 20, border: `1.5px solid ${form.category === cat.label ? C.primary : C.border}`,
                      background: form.category === cat.label ? C.primary + '18' : '#fff',
                      color: form.category === cat.label ? C.primary : C.text,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>
                    {cat.emoji} {cat.label}
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
                  borderRadius: 10, fontSize: 14, color: C.text, background: '#fff', outline: 'none', fontFamily: 'inherit',
                }}>
                  {['Fijo', 'Por hora', 'Por entrega', 'A convenir'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <Input label="Distrito *" placeholder="Ej: Miraflores" value={form.district} onChange={e => upd('district', e.target.value)} icon={<MapPin size={15} />} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Duración máxima (máx. 30 días)</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['1 día','2 días','1 semana','2 semanas','3 semanas','1 mes'].map(d => (
                  <button key={d} onClick={() => upd('duration', d)} style={{
                    padding: '7px 12px', borderRadius: 20, border: `1.5px solid ${form.duration === d ? C.primary : C.border}`,
                    background: form.duration === d ? C.primary : '#fff',
                    color: form.duration === d ? '#fff' : C.text,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}><ChevronLeft size={16} /> Atrás</Btn>
              <Btn onClick={() => setStep(3)} style={{ flex: 2 }} disabled={!form.price || !form.district || !form.duration}>
                Siguiente <ChevronRight size={16} />
              </Btn>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${C.border}` }}>
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

            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => setStep(2)} style={{ flex: 1 }}><ChevronLeft size={16} /> Atrás</Btn>
              <Btn onClick={handlePublish} style={{ flex: 2 }} disabled={!form.payMethod}>
                <Zap size={16} /> Publicar S/{form.featured ? 8 : 5}
              </Btn>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
};

// 7. BUSCAR ────────────────────────────────────────────────────────────────────
const SearchScreen = ({ onNavigate, onViewCachuelo }) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const results = CACHUELOS.filter(c =>
    (!query || c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())) &&
    (!selectedCat || c.category === selectedCat)
  );

  return (
    <Screen withTabs activeTab="search" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding: '44px 20px 20px' }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Buscar</div>
        <div style={{ background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
          <Search size={16} color={C.textMuted} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar cachuelos, categorías..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: C.text, padding: '12px 0', fontFamily: 'inherit', background: 'transparent' }}
            autoFocus
          />
          {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color={C.textMuted} /></button>}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {!query && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Explorar categorías</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCat(selectedCat === cat.label ? null : cat.label)}
                  style={{
                    padding: '14px 8px', borderRadius: 14, border: `1.5px solid ${selectedCat === cat.label ? C.primary : 'transparent'}`,
                    background: selectedCat === cat.label ? C.primary + '15' : cat.color,
                    cursor: 'pointer', textAlign: 'center', transition: 'all .2s',
                  }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: selectedCat === cat.label ? C.primary : C.text }}>{cat.label}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {(query || selectedCat) && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
              {selectedCat && ` en ${selectedCat}`}
            </div>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>😔</div>
                <div style={{ fontWeight: 600 }}>Sin resultados</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Intenta con otra búsqueda</div>
              </div>
            ) : (
              results.map(c => <CachuCard key={c.id} c={c} onPress={() => onViewCachuelo(c)} />)
            )}
          </>
        )}
      </div>
    </Screen>
  );
};

// 8. MIS CACHUELOS ────────────────────────────────────────────────────────────
const MyCachuelos = ({ onNavigate, onViewCachuelo }) => {
  const [tab, setTab] = useState('publicados');

  const publicados = CACHUELOS.slice(0, 2).map(c => ({ ...c, status: 'Activo', applicants: Math.floor(Math.random() * 8) + 1 }));
  const postulados = CACHUELOS.slice(2, 5).map(c => ({ ...c, status: ['Pendiente', 'Visto', 'Aceptado'][Math.floor(Math.random() * 3)] }));

  const statusColor = s => ({ Activo: C.success, Pendiente: C.warning, Visto: C.purple, Aceptado: C.success }[s] || C.textMuted);

  return (
    <Screen withTabs activeTab="mycachuelos" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, padding: '44px 20px 20px' }}>
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
        {tab === 'publicados' && (
          <>
            {publicados.map(c => (
              <div key={c.id} onClick={() => onViewCachuelo(c)}
                style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 28 }}>{c.emoji}</div>
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
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.primary, fontSize: 12, fontWeight: 600 }}>
                    Ver postulantes
                  </button>
                </div>
              </div>
            ))}
            <Btn style={{ width: '100%' }} onClick={() => onNavigate('publish')}>
              <PlusCircle size={16} /> Publicar nuevo cachuelo
            </Btn>
          </>
        )}

        {tab === 'postulados' && (
          postulados.map(c => (
            <div key={c.id} onClick={() => onViewCachuelo(c)}
              style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 28 }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.textSec }}>{c.publisher.name}</div>
                </div>
                <Badge color={statusColor(c.status)}>{c.status}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textSec }}><MapPin size={11} />{c.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.textSec }}><DollarSign size={11} />S/{c.price}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Screen>
  );
};

// 9. PERFIL ────────────────────────────────────────────────────────────────────
const ProfileScreen = ({ onNavigate, onAdmin, onLogout }) => {
  const menuItems = [
    { icon: Shield,     label: 'Verificar DNI',           desc: 'Aumenta tu confiabilidad',  color: C.primary,  action: null },
    { icon: Award,      label: 'Verificar CUL',           desc: 'Certificado único laboral',  color: C.purple,   action: null },
    { icon: Star,       label: 'Mis calificaciones',      desc: '4.8 · 24 reseñas',          color: C.warning,  action: null },
    { icon: BarChart2,  label: 'Dashboard Admin',         desc: 'KPIs y métricas',            color: C.success,  action: onAdmin },
    { icon: FileText,   label: 'Términos y condiciones',  desc: 'Aviso legal completo',       color: C.textSec,  action: null },
    { icon: Settings,   label: 'Configuración',           desc: 'Notificaciones y privacidad',color: C.textSec,  action: null },
    { icon: LogOut,     label: 'Cerrar sesión',           desc: '',                           color: C.danger,   action: onLogout },
  ];

  return (
    <Screen withTabs activeTab="profile" onNavigate={onNavigate}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
        padding: '44px 20px 32px', textAlign: 'center',
      }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          <Avatar initials="SC" size={80} bg="rgba(255,255,255,0.25)" fontSize={28} />
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13,
            background: C.success, border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={14} color="#fff" />
          </div>
        </div>
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Sergio Cotillo</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 }}>sergio.cotillo@gmail.com</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
          <Badge color="#fff" bg="rgba(255,255,255,0.2)">DNI Verificado</Badge>
          <Badge color="#fff" bg="rgba(255,255,255,0.2)">⭐ 4.8</Badge>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', background: '#fff', padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
        {[
          { label: 'Rating', value: '4.8', icon: '⭐' },
          { label: 'Completados', value: '12', icon: '✅' },
          { label: 'Publicados', value: '5', icon: '📢' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div style={{ padding: '12px 20px' }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} onClick={item.action || (() => {})} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 14px', background: '#fff', border: `1px solid ${C.border}`,
              borderRadius: 12, marginBottom: 8, cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: item.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: item.color === C.danger ? C.danger : C.text }}>{item.label}</div>
                {item.desc && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{item.desc}</div>}
              </div>
              {item.color !== C.danger && <ChevronRight size={16} color={C.textMuted} />}
            </button>
          );
        })}
      </div>
    </Screen>
  );
};

// 10. DASHBOARD ADMIN ──────────────────────────────────────────────────────────
const AdminDashboard = ({ onBack }) => {
  const [adminTab, setAdminTab] = useState('kpis'); // kpis | users
  const registeredUsers = JSON.parse(localStorage.getItem('cachuelo_users') || '[]');

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
          {[{ id: 'kpis', label: 'KPIs' }, { id: 'users', label: `Usuarios (${registeredUsers.length})` }].map(t => (
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
                  background: '#fff', borderRadius: 14, padding: '14px 16px', marginBottom: 10,
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
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
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
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
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
            { label: 'Reportes', icon: BarChart2, color: C.success },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={i} style={{
                background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
                padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
              }}>
                <Icon size={20} color={a.color} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{a.label}</div>
              </button>
            );
          })}
        </div>
        </>}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  APP ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCachuelo, setSelectedCachuelo] = useState(null);

  // Auto-advance splash
  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('onboarding'), 2400);
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
  };

  const viewCachuelo = (c) => {
    setSelectedCachuelo(c);
    setScreen('detail');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':      return <SplashScreen />;
      case 'onboarding':  return <OnboardingScreen onDone={() => setScreen('login')} />;
      case 'login':       return <LoginScreen onLogin={() => { setScreen('home'); setActiveTab('home'); }} onAdmin={() => setScreen('admin')} />;
      case 'home':        return <HomeScreen onNavigate={navigate} onViewCachuelo={viewCachuelo} />;
      case 'detail':      return <DetailScreen cachuelo={selectedCachuelo} onBack={() => setScreen('home')} onNavigate={navigate} />;
      case 'publish':     return <PublishScreen onNavigate={navigate} />;
      case 'search':      return <SearchScreen onNavigate={navigate} onViewCachuelo={viewCachuelo} />;
      case 'mycachuelos': return <MyCachuelos onNavigate={navigate} onViewCachuelo={viewCachuelo} />;
      case 'profile':     return <ProfileScreen onNavigate={navigate} onAdmin={() => setScreen('admin')} onLogout={() => setScreen('login')} />;
      case 'admin':       return <AdminDashboard onBack={() => setScreen('profile')} />;
      default:            return <SplashScreen />;
    }
  };

  return (
    <PhoneFrame>
      {renderScreen()}
    </PhoneFrame>
  );
}
