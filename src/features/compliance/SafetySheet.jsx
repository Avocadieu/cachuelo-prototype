// ─── CENTRO DE SEGURIDAD (dentro del chat de un cachuelo aceptado) ──────────
// Emergencias (llamada directa), compartir los datos del cachuelo con un
// contacto de confianza y recordatorios de seguridad.
import { Siren, PhoneCall, Share2, X, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { haptic } from '../../ui/toast.jsx';

const NUMBERS = [
  ['105', 'Policía Nacional', '#2563EB'],
  ['106', 'SAMU (emergencias médicas)', '#EF4444'],
  ['116', 'Bomberos', '#F97316'],
];

export default function SafetySheet({ open, onClose, cachuelo, otherName }) {
  const { C } = useTheme();
  if (!open) return null;
  const when = new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
  const shareText = `Estoy en un cachuelo por la app Cachuelo:\n• ${cachuelo?.title || 'Trabajo'}\n• Zona: ${cachuelo?.location || '—'}\n• Con: ${otherName || '—'}\n• Desde: ${when}\nSi no te escribo en unas horas, llámame.`;
  const share = async () => {
    haptic();
    if (navigator.share) { try { await navigator.share({ title: 'Mi cachuelo', text: shareText }); return; } catch { /* cancelado */ } }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
  };
  return (
    <div className="lg-scrim" onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 700, background: 'var(--lg-scrim)', display: 'flex', alignItems: 'flex-end' }}>
      <div className="lg-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Centro de seguridad"
        style={{ width: '100%', background: 'var(--lg-fill-strong)', padding: '10px 18px 26px', boxSizing: 'border-box' }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--c-bord)', margin: '0 auto 12px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 38, height: 38, borderRadius: 12, background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Siren size={20} color="#fff" /></span>
          <div style={{ flex: 1, fontSize: 18, fontWeight: 900, color: C.text }}>Centro de seguridad</div>
          <button onClick={onClose} aria-label="Cerrar" style={{ width: 34, height: 34, borderRadius: 17, border: 'none', background: 'var(--c-card-el)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={17} color={C.textSec} /></button>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: C.textMuted, marginBottom: 8 }}>EMERGENCIAS · LLAMADA DIRECTA</div>
        {NUMBERS.map(([n, l, col]) => (
          <a key={n} href={`tel:${n}`} onClick={() => haptic(30)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, background: C.card, border: '1px solid var(--lg-stroke)', marginBottom: 8, textDecoration: 'none' }}>
            <span style={{ width: 36, height: 36, borderRadius: 12, background: col, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PhoneCall size={18} color="#fff" /></span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 800, color: C.text }}>{l}</span>
            <span className="lg-num" style={{ fontSize: 20, fontWeight: 900, color: col }}>{n}</span>
          </a>
        ))}
        <button onClick={share} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, background: C.infoSoft, border: 'none', margin: '6px 0 14px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
          <span style={{ width: 36, height: 36, borderRadius: 12, background: C.headerBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Share2 size={18} color="#fff" /></span>
          <span style={{ flex: 1 }}><span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: C.text }}>Avisar a un contacto de confianza</span><span style={{ fontSize: 12, color: C.textSec }}>Comparte qué cachuelo haces, dónde y con quién</span></span>
        </button>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: C.textMuted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={14} /> RECOMENDACIONES</div>
        {['Coordina y paga solo dentro de Cachuelo (Pago Protegido).', 'Revisa que la persona sea la del perfil verificado al llegar.', 'Si algo te incomoda, retírate: tu seguridad va primero.', 'Usa equipo de protección en trabajos de altura, electricidad o carga.']
          .map(t => <div key={t} style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.5, display: 'flex', gap: 6 }}><span style={{ color: C.success }}>•</span>{t}</div>)}
      </div>
    </div>
  );
}
