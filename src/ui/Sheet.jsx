// ─── HOJA INFERIOR (bottom sheet) reutilizable ──────────────────────────────
import { X } from 'lucide-react';
import { useTheme } from './theme.js';

export default function Sheet({ open, onClose, title, subtitle, children, maxHeight = '88%', z = 650, footer, label }) {
  const { C } = useTheme();
  if (!open) return null;
  return (
    <div className="lg-scrim" onClick={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: z, background: 'var(--lg-scrim)', display: 'flex', alignItems: 'flex-end' }}>
      <div className="lg-sheet" role="dialog" aria-label={label || title} onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxHeight, display: 'flex', flexDirection: 'column', background: 'var(--lg-fill-strong)', boxSizing: 'border-box' }}>
        <div style={{ padding: '10px 18px 0' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--c-bord)', margin: '0 auto 12px' }} />
          {(title || onClose) && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {title && <div style={{ fontSize: 18, fontWeight: 900, color: C.text, letterSpacing: -0.3 }}>{title}</div>}
                {subtitle && <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>{subtitle}</div>}
              </div>
              <button onClick={onClose} aria-label="Cerrar" style={{ width: 34, height: 34, borderRadius: 17, border: 'none', background: 'var(--c-card-el)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <X size={17} color={C.textSec} />
              </button>
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 18px', overscrollBehavior: 'contain' }}>{children}</div>
        {footer && <div style={{ padding: '10px 18px 22px', borderTop: `1px solid ${C.border}` }}>{footer}</div>}
      </div>
    </div>
  );
}
