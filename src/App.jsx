import { supabase } from './lib/supabase.js';
import { useState, useEffect } from 'react';
import {
  Home, Search, PlusCircle, Briefcase, User, Star, MapPin, Clock,
  ChevronRight, ChevronLeft, X, Check, ArrowLeft, Bell, Settings,
  Shield, FileText, BarChart2, Users, Download, TrendingUp, Award,
  Phone, Mail, CreditCard, Zap, Camera, Truck, Wrench, BookOpen,
  Leaf, Monitor, Calendar, MessageCircle, Filter, Heart, Share2,
  LogOut, Eye, CheckCircle, AlertCircle, Package, Send, Hash,
  DollarSign, Trash2, Pencil
} from 'lucide-react';

// ─── PALETA ────────────────────────────────────────────────────────────────
const C = {
  primary: '#FF6B35',
  primaryLight: '#FF8C5A',
  primaryDark: '#E55A25',
  headerBg: '#2563EB',
  headerDark: '#1D4ED8',
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
                background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`,
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
      background: `linear-gradient(160deg, ${C.headerBg} 0%, ${C.headerDark} 100%)`,
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
const TeacherSVG = () => (
  <svg viewBox="0 0 280 240" width="100%" style={{ maxWidth: 280 }}>
    <ellipse cx="140" cy="145" rx="118" ry="98" fill="#DBEAFE" />
    {/* Blackboard */}
    <rect x="168" y="82" width="78" height="58" rx="6" fill="#064E3B" />
    <rect x="172" y="86" width="70" height="50" rx="4" fill="#065F46" />
    <line x1="180" y1="102" x2="234" y2="102" stroke="white" strokeWidth="2" opacity="0.8" />
    <line x1="180" y1="114" x2="222" y2="114" stroke="white" strokeWidth="2" opacity="0.7" />
    <line x1="180" y1="126" x2="230" y2="126" stroke="white" strokeWidth="2" opacity="0.5" />
    {/* Body */}
    <rect x="108" y="148" width="46" height="58" rx="10" fill="#2563EB" />
    {/* Head */}
    <circle cx="131" cy="126" r="22" fill="#FBBF8A" />
    {/* Hair */}
    <path d="M109 120 Q111 98 131 96 Q151 98 153 120 Q144 112 131 113 Q118 112 109 120 Z" fill="#3B2A1A" />
    {/* Eyes */}
    <circle cx="124" cy="124" r="2.5" fill="#3B2A1A" />
    <circle cx="138" cy="124" r="2.5" fill="#3B2A1A" />
    {/* Smile */}
    <path d="M125 133 Q131 139 137 133" stroke="#3B2A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Right arm pointing at board */}
    <path d="M152 156 Q162 144 170 133" stroke="#FBBF8A" strokeWidth="9" strokeLinecap="round" fill="none" />
    {/* Left arm with book */}
    <path d="M110 156 Q98 164 90 172" stroke="#FBBF8A" strokeWidth="9" strokeLinecap="round" fill="none" />
    <rect x="80" y="169" width="20" height="15" rx="3" fill="#EF4444" />
    {/* Legs */}
    <rect x="114" y="204" width="14" height="32" rx="7" fill="#1E3A8A" />
    <rect x="134" y="204" width="14" height="32" rx="7" fill="#1E3A8A" />
    <ellipse cx="121" cy="236" rx="12" ry="5" fill="#374151" />
    <ellipse cx="141" cy="236" rx="12" ry="5" fill="#374151" />
    {/* Floor books */}
    <rect x="48" y="208" width="46" height="8" rx="3" fill="#F59E0B" />
    <rect x="52" y="200" width="38" height="9" rx="3" fill="#6366F1" />
    <rect x="55" y="192" width="32" height="9" rx="3" fill="#EC4899" />
  </svg>
);

const WorkerSVG = () => (
  <svg viewBox="0 0 280 240" width="100%" style={{ maxWidth: 280 }}>
    <ellipse cx="140" cy="145" rx="118" ry="98" fill="#FEF3C7" />
    {/* Hard hat */}
    <ellipse cx="133" cy="98" rx="30" ry="8" fill="#F59E0B" />
    <path d="M103 98 Q103 78 133 76 Q163 78 163 98 Z" fill="#F59E0B" />
    {/* Head */}
    <circle cx="133" cy="116" r="22" fill="#FBBF8A" />
    {/* Eyes & smile */}
    <circle cx="126" cy="114" r="2.5" fill="#3B2A1A" />
    <circle cx="140" cy="114" r="2.5" fill="#3B2A1A" />
    <path d="M127 123 Q133 129 139 123" stroke="#3B2A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Orange vest */}
    <rect x="108" y="136" width="50" height="58" rx="10" fill="#EA580C" />
    {/* Vest stripes */}
    <rect x="110" y="148" width="46" height="5" rx="2" fill="#FCD34D" opacity="0.75" />
    <rect x="110" y="162" width="46" height="5" rx="2" fill="#FCD34D" opacity="0.75" />
    {/* Right arm + wrench */}
    <path d="M156 145 Q173 150 182 162" stroke="#FBBF8A" strokeWidth="9" strokeLinecap="round" fill="none" />
    <rect x="179" y="158" width="9" height="24" rx="4" fill="#9CA3AF" transform="rotate(25 183 170)" />
    <ellipse cx="181" cy="159" rx="7" ry="6" fill="#6B7280" transform="rotate(25 183 170)" />
    {/* Left arm */}
    <path d="M110 145 Q95 153 86 162" stroke="#FBBF8A" strokeWidth="9" strokeLinecap="round" fill="none" />
    {/* Legs */}
    <rect x="113" y="192" width="15" height="36" rx="7" fill="#374151" />
    <rect x="133" y="192" width="15" height="36" rx="7" fill="#374151" />
    <ellipse cx="120" cy="228" rx="13" ry="6" fill="#1F2937" />
    <ellipse cx="140" cy="228" rx="13" ry="6" fill="#1F2937" />
    {/* Bricks */}
    <rect x="188" y="160" width="52" height="14" rx="3" fill="#D97706" opacity="0.45" />
    <rect x="192" y="177" width="48" height="14" rx="3" fill="#D97706" opacity="0.45" />
    <rect x="188" y="194" width="52" height="14" rx="3" fill="#D97706" opacity="0.45" />
  </svg>
);

const DogWalkerSVG = () => (
  <svg viewBox="0 0 280 240" width="100%" style={{ maxWidth: 280 }}>
    <ellipse cx="140" cy="145" rx="118" ry="98" fill="#DCFCE7" />
    {/* Sun */}
    <circle cx="226" cy="88" r="18" fill="#FCD34D" opacity="0.65" />
    {/* Tree */}
    <rect x="218" y="162" width="10" height="48" rx="3" fill="#92400E" />
    <ellipse cx="223" cy="148" rx="26" ry="28" fill="#16A34A" />
    {/* Ground */}
    <ellipse cx="140" cy="234" rx="112" ry="12" fill="#86EFAC" opacity="0.45" />
    {/* Person - head */}
    <circle cx="105" cy="114" r="22" fill="#FBBF8A" />
    {/* Hair */}
    <path d="M83 110 Q85 90 105 88 Q125 90 127 110 Q118 103 105 104 Q92 103 83 110 Z" fill="#1F2937" />
    {/* Eyes & smile */}
    <circle cx="98" cy="113" r="2.5" fill="#3B2A1A" />
    <circle cx="112" cy="113" r="2.5" fill="#3B2A1A" />
    <path d="M99 121 Q105 127 111 121" stroke="#3B2A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Body */}
    <rect x="83" y="134" width="44" height="58" rx="10" fill="#EC4899" />
    {/* Leash arm */}
    <path d="M125 142 Q142 140 155 143" stroke="#FBBF8A" strokeWidth="8" strokeLinecap="round" fill="none" />
    {/* Leash rope */}
    <path d="M155 141 Q168 148 178 158" stroke="#6B7280" strokeWidth="2" fill="none" strokeDasharray="5 3" />
    {/* Other arm */}
    <path d="M85 142 Q73 152 67 160" stroke="#FBBF8A" strokeWidth="8" strokeLinecap="round" fill="none" />
    {/* Legs */}
    <rect x="88" y="190" width="14" height="36" rx="7" fill="#1D4ED8" />
    <rect x="107" y="190" width="14" height="36" rx="7" fill="#1D4ED8" />
    <ellipse cx="95" cy="226" rx="12" ry="5" fill="#374151" />
    <ellipse cx="114" cy="226" rx="12" ry="5" fill="#374151" />
    {/* Dog body */}
    <ellipse cx="192" cy="200" rx="24" ry="15" fill="#A16207" />
    {/* Dog head */}
    <circle cx="213" cy="188" r="15" fill="#B45309" />
    {/* Dog ears */}
    <ellipse cx="221" cy="180" rx="7" ry="10" fill="#A16207" />
    <ellipse cx="206" cy="180" rx="6" ry="9" fill="#A16207" />
    {/* Dog face */}
    <ellipse cx="219" cy="192" rx="4" ry="3" fill="#1F2937" />
    <circle cx="214" cy="185" r="2.5" fill="#1F2937" />
    <circle cx="215" cy="184" r="1" fill="#fff" />
    {/* Dog legs */}
    <rect x="172" y="211" width="9" height="18" rx="4" fill="#A16207" />
    <rect x="184" y="212" width="9" height="17" rx="4" fill="#A16207" />
    <rect x="197" y="212" width="9" height="17" rx="4" fill="#A16207" />
    <rect x="208" y="211" width="9" height="18" rx="4" fill="#A16207" />
    {/* Dog tail */}
    <path d="M169 196 Q156 184 161 172" stroke="#A16207" strokeWidth="7" strokeLinecap="round" fill="none" />
  </svg>
);

const WelcomeScreen = ({ onEmailLogin, onGoogleLogin, onPhoneLogin }) => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % 3), 3500);
    return () => clearInterval(t);
  }, []);

  const slides = [
    { title: 'Enseña y comparte tu conocimiento', sub: 'Conecta con quien necesita aprender cerca de ti', illustration: <TeacherSVG /> },
    { title: 'Trabaja en lo que mejor sabes hacer', sub: 'Cachuelos de construcción, reparaciones y más', illustration: <WorkerSVG /> },
    { title: 'Cuida mascotas cerca de tu hogar', sub: 'Encuentra trabajo flexible en tu barrio hoy mismo', illustration: <DogWalkerSVG /> },
  ];

  const { title, sub, illustration } = slides[slide];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '18px 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>💼</span>
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
          border: `1.5px solid ${C.border}`, background: '#fff', cursor: 'pointer',
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.text,
        }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#4285F4', fontFamily: 'Arial' }}>G</span> Continuar con Google
        </button>
        <button onClick={onPhoneLogin} style={{
          width: '100%', borderRadius: 50, fontSize: 14, padding: '14px 0',
          border: `1.5px solid ${C.border}`, background: '#fff', cursor: 'pointer',
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.text,
        }}>
          <Phone size={16} color={C.textSec} /> Continuar con Teléfono
        </button>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, onAdmin, onBack }) => {
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
    borderRadius: 10, fontSize: 14, color: C.text, background: '#fff',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', overflowY: 'auto' }}>
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
                        style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.textSec, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
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
              <div style={{ display: 'flex', border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px',
                  background: '#F3F4F6', borderRight: `1.5px solid ${C.border}`,
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
                  background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
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
  const [filter, setFilter] = useState('Todos');
  const [selectedCat, setSelectedCat] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    const fetchCount = async () => {
      // Postulaciones a mis cachuelos (como publicador)
      const { data: misCachuelos } = await supabase
        .from('cachuelos').select('id').eq('user_id', user.id);
      const ids = (misCachuelos || []).map(c => c.id);
      let count = 0;
      if (ids.length > 0) {
        const { count: c1 } = await supabase.from('postulaciones')
          .select('id', { count: 'exact', head: true }).in('cachuelo_id', ids);
        count += c1 || 0;
      }
      // Mis postulaciones con cambio de estado (como postulante)
      const { count: c2 } = await supabase.from('postulaciones')
        .select('id', { count: 'exact', head: true })
        .eq('postulante_id', user.id).neq('estado', 'Pendiente');
      count += c2 || 0;
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
const DetailScreen = ({ cachuelo, onBack, onNavigate, user, onRequireAuth, onViewPublisher, onVerPostulantes }) => {
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicantCount, setApplicantCount] = useState(null);

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

  const pubName    = cachuelo.publisher?.name    || 'Usuario';
  const pubRating  = cachuelo.publisher?.rating  ?? 0;
  const pubVerified = cachuelo.publisher?.verified ?? false;
  const pubAvatar  = cachuelo.publisher?.avatar  || 'U';
  const fechaDisplay = cachuelo?.fecha_inicio
    ? new Date(cachuelo.fecha_inicio + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : cachuelo?.schedule || '';

  const handleApply = async () => {
    if (!user) { onRequireAuth(); return; }
    if (applied || applying) return;
    setApplying(true);
    const { error } = await supabase.from('postulaciones').insert({
      cachuelo_id: cachuelo.id,
      postulante_id: user.id,
      mensaje: message,
      estado: 'Pendiente',
    });
    setApplying(false);
    if (!error) setApplied(true);
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
          {fechaDisplay ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fecha de inicio</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#F0FDF4', borderRadius: 10 }}>
                <Calendar size={14} color={C.success} />
                <span style={{ fontSize: 12, color: '#166534', fontWeight: 500 }}>{fechaDisplay}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Publisher */}
        <div onClick={() => cachuelo.userId && onViewPublisher?.(cachuelo.userId)}
          style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: cachuelo.userId ? 'pointer' : 'default' }}>
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
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Tu publicación</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F0F9FF', borderRadius: 12, padding: 16 }}>
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
      </div>
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
      fecha_inicio: form.startDate,
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
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 6, display: 'block' }}>Modalidad</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Presencial', 'Remoto'].map(t => (
                  <button key={t} onClick={() => upd('tipo', t)} style={{
                    flex: 1, padding: '9px 0', borderRadius: 10,
                    border: `1.5px solid ${form.tipo === t ? C.primary : C.border}`,
                    background: form.tipo === t ? C.primary + '12' : '#fff',
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
                    background: '#fff', outline: 'none', fontFamily: 'inherit',
                    appearance: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">Selecciona un distrito...</option>
                  {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginBottom: 4, display: 'block' }}>Fecha de inicio *</label>
              <input
                type="date"
                value={form.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => upd('startDate', e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                  border: `1.5px solid ${form.startDate ? C.primary : C.border}`,
                  borderRadius: 10, fontSize: 14, color: form.startDate ? C.text : C.textMuted,
                  background: '#fff', outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                }}
              />
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
                    background: '#fff', outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  <option value="día(s)">día(s)</option>
                  <option value="semana(s)">semana(s)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}><ChevronLeft size={16} /> Atrás</Btn>
              <Btn onClick={() => setStep(3)} style={{ flex: 2 }} disabled={!form.price || !form.district || !form.duration || !form.startDate}>
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

// 7. BUSCAR ────────────────────────────────────────────────────────────────────
const SearchScreen = ({ onNavigate, onViewCachuelo, cachuelos }) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const results = cachuelos.filter(c =>
    (!query || c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())) &&
    (!selectedCat || c.category === selectedCat)
  );

  return (
    <Screen withTabs activeTab="search" onNavigate={onNavigate}>
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 20px' }}>
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
const MyCachuelos = ({ onNavigate, onViewCachuelo, user, onVerPostulantes }) => {
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
          .select('id, estado, cachuelos(id, titulo, precio, distrito, duracion, categorias(label, emoji))')
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
          description: c.descripcion || '', fecha_inicio: c.fecha_inicio || '',
          userId: c.user_id, publisher: { name: user.nombre || 'Yo', rating: 0, verified: false, avatar: (user.nombre?.[0] || 'Y').toUpperCase() },
        })));
      }
      if (!postRes.error && postRes.data) {
        setPostulados(postRes.data.map(p => ({
          id: p.cachuelos?.id, postulacionId: p.id,
          title: p.cachuelos?.titulo, emoji: p.cachuelos?.categorias?.emoji || '💼',
          price: Number(p.cachuelos?.precio), location: p.cachuelos?.distrito || 'Lima',
          duration: p.cachuelos?.duracion || '', status: p.estado,
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  const statusColor = s => ({ Activo: C.success, Pendiente: C.warning, Visto: C.purple, Aceptado: C.success }[s] || C.textMuted);

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
        ) : tab === 'publicados' ? (
          <>
            {publicados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>📋</div>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Aún no publicaste cachuelos</div>
                <div style={{ fontSize: 13, color: C.textSec, marginBottom: 20 }}>Publica tu primer cachuelo y empieza a recibir postulantes</div>
              </div>
            ) : publicados.map(c => (
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
                  <button onClick={e => { e.stopPropagation(); onVerPostulantes?.(c); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.primary, fontSize: 12, fontWeight: 600 }}>
                    Ver postulantes
                  </button>
                </div>
              </div>
            ))}
            <Btn style={{ width: '100%' }} onClick={() => onNavigate('publish')}>
              <PlusCircle size={16} /> Publicar nuevo cachuelo
            </Btn>
          </>
        ) : (
          postulados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
              <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Aún no te postulaste a ningún cachuelo</div>
              <div style={{ fontSize: 13, color: C.textSec, marginBottom: 20 }}>Explora los cachuelos disponibles y postúlate</div>
              <Btn onClick={() => onNavigate('home')}>Explorar cachuelos</Btn>
            </div>
          ) : postulados.map(c => (
            <div key={c.postulacionId}
              style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 28 }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.textSec }}>{c.duration}</div>
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
const ProfileScreen = ({ onNavigate, onAdmin, onAdminTools, onLogout, user }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user?.id]);

  const nombre   = profile?.nombre   || user?.nombre   || '';
  const apellido = profile?.apellido || user?.apellido || '';
  const email    = profile?.email    || user?.email    || '';
  const fullName = [nombre, apellido].filter(Boolean).join(' ') || email.split('@')[0];
  const initials = `${nombre[0] || ''}${apellido[0] || ''}`.toUpperCase() || '??';
  const rating   = profile?.rating ?? 0;
  const completados = profile?.cachuelos_completados ?? 0;
  const publicados  = profile?.cachuelos_publicados  ?? 0;
  const dniVerificado = profile?.dni_verificado ?? false;
  const isAdmin = profile?.rol === 'admin';

  const menuItems = [
    { icon: Shield,     label: 'Verificar DNI',           desc: 'Aumenta tu confiabilidad',   color: C.primary,  action: null },
    { icon: Award,      label: 'Verificar CUL',           desc: 'Certificado único laboral',   color: C.purple,   action: null },
    { icon: Star,       label: 'Mis calificaciones',      desc: '4.8 · 24 reseñas',           color: C.warning,  action: null },
    ...(isAdmin ? [
      { icon: Wrench,   label: 'Herramientas Admin',      desc: 'Gestionar cachuelos',         color: '#7C3AED',  action: onAdminTools },
      { icon: BarChart2,label: 'Dashboard Admin',         desc: 'KPIs y métricas',             color: C.success,  action: onAdmin },
    ] : []),
    { icon: FileText,   label: 'Términos y condiciones',  desc: 'Aviso legal completo',        color: C.textSec,  action: null },
    { icon: Settings,   label: 'Configuración',           desc: 'Notificaciones y privacidad', color: C.textSec,  action: null },
    { icon: LogOut,     label: 'Cerrar sesión',           desc: '',                            color: C.danger,   action: onLogout },
  ];

  return (
    <Screen withTabs activeTab="profile" onNavigate={onNavigate}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`,
        padding: '44px 20px 32px', textAlign: 'center',
      }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          <Avatar initials={initials} size={80} bg="rgba(255,255,255,0.25)" fontSize={28} />
          {dniVerificado && (
            <div style={{
              position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13,
              background: C.success, border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={14} color="#fff" />
            </div>
          )}
        </div>
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{fullName}</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 }}>{email}</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
          {isAdmin && <Badge color="#7C3AED" bg="rgba(124,58,237,0.15)">🛡️ Admin</Badge>}
          {dniVerificado && <Badge color="#fff" bg="rgba(255,255,255,0.2)">DNI Verificado</Badge>}
          {rating > 0 && <Badge color="#fff" bg="rgba(255,255,255,0.2)">⭐ {rating.toFixed(1)}</Badge>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', background: '#fff', padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
        {[
          { label: 'Rating', value: rating > 0 ? rating.toFixed(1) : '—', icon: '⭐' },
          { label: 'Completados', value: completados, icon: '✅' },
          { label: 'Publicados', value: publicados, icon: '📢' },
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
              <div key={c.id} style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
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
                          style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, background: '#fff', outline: 'none', fontFamily: 'inherit' }}>
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
                      <div style={{ fontSize: 28, lineHeight: 1 }}>{c.categorias?.emoji || '💼'}</div>
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
const NotificationsScreen = ({ user, onBack, onNavigate, onViewPostulantes, onViewCachuelo }) => {
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
              <div key={p.id} style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
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
const ChatScreen = ({ chatData, currentUser, onBack, onNavigate }) => {
  const { postulacion_id, cachuelo, postulante } = chatData || {};
  const storageKey = `cachuelo_chat_${postulacion_id}`;
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [text, setText] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [updatingEstado, setUpdatingEstado] = useState(false);
  const messagesEndRef = { current: null };

  useEffect(() => {
    // Fetch estado actual de la postulacion
    if (!postulacion_id) return;
    supabase.from('postulaciones').select('estado').eq('id', postulacion_id).single()
      .then(({ data }) => { if (data) setEstado(data.estado); });
  }, [postulacion_id]);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg = { id: Date.now(), sender_id: currentUser?.id, text: trimmed, ts: new Date().toISOString() };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setText('');
  };

  const updateEstado = async (nuevoEstado) => {
    if (updatingEstado) return;
    setUpdatingEstado(true);
    const { error } = await supabase.from('postulaciones').update({ estado: nuevoEstado, updated_at: new Date().toISOString() }).eq('id', postulacion_id);
    if (!error) setEstado(nuevoEstado);
    setUpdatingEstado(false);
  };

  const formatTs = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  const estadoConfig = {
    Pendiente: { color: C.warning, label: 'Pendiente' },
    Visto:     { color: C.purple,  label: 'Visto' },
    Aceptado:  { color: C.success, label: 'Aceptado' },
    Rechazado: { color: C.danger,  label: 'Rechazado' },
  };
  const ec = estadoConfig[estado] || estadoConfig.Pendiente;
  const isDecided = estado === 'Aceptado' || estado === 'Rechazado';

  return (
    <Screen withTabs activeTab="mycachuelos" onNavigate={onNavigate}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 16px 16px' }}>
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

        {/* Botones Aceptar / Rechazar */}
        {!isDecided && (
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
        {isDecided && (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.7)', paddingBottom: 2 }}>
            {estado === 'Aceptado' ? '✅ Postulación aceptada' : '❌ Postulación rechazada'}
          </div>
        )}
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10, background: '#F3F4F6' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: C.textMuted, fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
            Inicia la conversación
          </div>
        )}
        {messages.map(m => {
          const isMe = m.sender_id === currentUser?.id;
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', background: isMe ? C.headerBg : '#fff', color: isMe ? '#fff' : C.text, borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div>{m.text}</div>
                <div style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,0.65)' : C.textMuted, marginTop: 4, textAlign: 'right' }}>{formatTs(m.ts)}</div>
              </div>
            </div>
          );
        })}
        <div ref={el => { messagesEndRef.current = el; }} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 16px 16px', background: '#fff', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Escribe un mensaje..." rows={1}
          style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: '10px 16px', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: 100, overflow: 'auto' }} />
        <button onClick={sendMessage}
          style={{ width: 42, height: 42, borderRadius: 21, background: C.headerBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Send size={18} color="#fff" />
        </button>
      </div>
    </Screen>
  );
};

// ── PERFIL PÚBLICO ────────────────────────────────────────────────────────────
const PublicProfileScreen = ({ userId, onBack, onViewCachuelo, onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [cachuelos, setCachuelos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      const [profRes, cachRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('cachuelos')
          .select('*, categorias(label, emoji)')
          .eq('user_id', userId)
          .eq('estado', 'Activo')
          .order('created_at', { ascending: false }),
      ]);
      if (profRes.data) setProfile(profRes.data);
      if (!cachRes.error && cachRes.data) setCachuelos(cachRes.data);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const nombre = profile?.nombre || '';
  const apellido = profile?.apellido || '';
  const fullName = [nombre, apellido].filter(Boolean).join(' ') || profile?.email?.split('@')[0] || 'Usuario';
  const initials = (`${nombre[0] || ''}${apellido[0] || ''}`).toUpperCase() || 'U';
  const rating = profile?.rating ?? 0;

  return (
    <Screen withTabs activeTab="home" onNavigate={onNavigate}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.headerBg}, ${C.headerDark})`, padding: '44px 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Perfil del publicador</div>
        </div>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Cargando...</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar initials={initials} size={64} bg="rgba(255,255,255,0.2)" fontSize={22} color="#fff" />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{fullName}</div>
              {rating > 0
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Stars rating={rating} size={14} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{rating} / 5</span>
                  </div>
                : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Sin reseñas todavía</span>
              }
              {profile?.dni_verificado && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: 10, marginTop: 6 }}>
                  <Shield size={11} color="#fff" />
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>Verificado</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 20px 40px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>
          Cachuelos activos ({cachuelos.length})
        </div>
        {cachuelos.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: C.textMuted, fontSize: 13 }}>
            No tiene cachuelos activos en este momento
          </div>
        ) : cachuelos.map(c => (
          <div key={c.id} onClick={() => onViewCachuelo?.({
            id: c.id, userId: c.user_id, title: c.titulo, emoji: c.categorias?.emoji || '💼',
            category: c.categorias?.label || '', location: c.distrito || 'Lima',
            duration: c.duracion || '', price: Number(c.precio), type: c.tipo,
            featured: c.destacado, remote: c.tipo === 'Remoto',
            description: c.descripcion || '', fecha_inicio: c.fecha_inicio || '',
            publisher: { name: fullName, rating, verified: profile?.dni_verificado || false, avatar: initials },
          })}
            style={{ background: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 26 }}>{c.categorias?.emoji || '💼'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.titulo}</div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: C.textSec }}>
                  <span>📍 {c.distrito || 'Lima'}</span>
                  <span>⏱ {c.duracion}</span>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, flexShrink: 0 }}>S/{c.precio}</div>
            </div>
          </div>
        ))}
      </div>
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
    <PhoneFrame>
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
    </PhoneFrame>
  );
};

//  APP ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCachuelo, setSelectedCachuelo] = useState(null);
  const [viewedUserId, setViewedUserId] = useState(null);
  const [prevScreen, setPrevScreen] = useState('home');
  const [cachueloParaPostulantes, setCachueloParaPostulantes] = useState(null);
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
      fecha_inicio: c.fecha_inicio || '',
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
      case 'notifications': return <NotificationsScreen user={user} onBack={() => setScreen(prevScreen)} onNavigate={navigate} onViewPostulantes={(c) => { setCachueloParaPostulantes(c); setPrevScreen('notifications'); setScreen('postulantes'); }} onViewCachuelo={(c) => { setSelectedCachuelo(c); setPrevScreen('notifications'); setScreen('detail'); }} />;
      case 'detail':      return <DetailScreen cachuelo={selectedCachuelo} onBack={() => setScreen(prevScreen)} onNavigate={navigate} user={user} onRequireAuth={() => setScreen('login')} onViewPublisher={(uid) => { setViewedUserId(uid); setPrevScreen('detail'); setScreen('publicprofile'); }} onVerPostulantes={(c) => { setCachueloParaPostulantes(c); setPrevScreen('detail'); setScreen('postulantes'); }} />;
      case 'publicprofile': return <PublicProfileScreen userId={viewedUserId} onBack={() => setScreen(prevScreen)} onViewCachuelo={(c) => { setPrevScreen('publicprofile'); setSelectedCachuelo(c); setScreen('detail'); }} onNavigate={navigate} />;
      case 'postulantes':   return <PostulantesScreen cachuelo={cachueloParaPostulantes} onBack={() => setScreen(prevScreen)} onViewProfile={(uid) => { setViewedUserId(uid); setPrevScreen('postulantes'); setScreen('publicprofile'); }} onIniciarChat={(data) => { setChatData(data); setPrevScreen('postulantes'); setScreen('chat'); }} onNavigate={navigate} />;
      case 'chat':          return <ChatScreen chatData={chatData} currentUser={user} onBack={() => setScreen(prevScreen)} onNavigate={navigate} />;
      case 'publish':     return <PublishScreen onNavigate={navigate} user={user} onPublished={refreshCachuelos} />;
      case 'search':      return <SearchScreen onNavigate={navigate} onViewCachuelo={viewCachuelo} cachuelos={cachuelos} />;
      case 'mycachuelos': return <MyCachuelos onNavigate={navigate} onViewCachuelo={viewCachuelo} user={user} onVerPostulantes={(c) => { setCachueloParaPostulantes(c); setPrevScreen('mycachuelos'); setScreen('postulantes'); }} />;
      case 'profile':     return <ProfileScreen onNavigate={navigate} onAdmin={() => setScreen('admin')} onAdminTools={() => setScreen('admintools')} user={user} onLogout={async () => { await supabase.auth.signOut(); setUser(null); setScreen('welcome'); }} />;
      case 'admin':       return <AdminDashboard onBack={() => setScreen('profile')} />;
      case 'admintools':  return <AdminToolsScreen onBack={() => setScreen('profile')} onRefresh={refreshCachuelos} />;
      default:            return <SplashScreen />;
    }
  };

  return (
    <PhoneFrame>
      {renderScreen()}
    </PhoneFrame>
  );
}
