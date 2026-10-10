// ─── TOASTS + VIBRACIÓN ──────────────────────────────────────────────────────
// toast('Mensaje', 'success'|'error'|'info') desde cualquier pantalla.
import { useEffect, useState } from 'react';

export const toast = (message, type = 'info') =>
  window.dispatchEvent(new CustomEvent('cachuelo:toast', { detail: { message, type, id: Date.now() + Math.random() } }));

/** Vibración corta en Android (iOS Safari la ignora). */
export const haptic = (ms = 12) => { try { navigator.vibrate?.(ms); } catch { /* sin soporte */ } };

const ICON = { success: '✓', error: '!', info: 'i' };
const TINT = { success: '#10B981', error: '#EF4444', info: '#2563EB' };

export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const on = (e) => {
      const t = e.detail;
      setItems(prev => [...prev.slice(-2), t]);
      setTimeout(() => setItems(prev => prev.filter(x => x.id !== t.id)), 3200);
    };
    window.addEventListener('cachuelo:toast', on);
    return () => window.removeEventListener('cachuelo:toast', on);
  }, []);
  return (
    <div aria-live="polite" style={{ position: 'absolute', top: 52, left: 12, right: 12, zIndex: 950, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {items.map(t => (
        <div key={t.id} className="lg-glass lg-glass--strong lg-pop-in" style={{ borderRadius: 18, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--lg-ink-on-glass)', fontSize: 13.5, fontWeight: 600 }}>
          <span style={{ width: 22, height: 22, borderRadius: 11, background: TINT[t.type], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{ICON[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
