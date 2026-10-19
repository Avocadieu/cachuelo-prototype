// ─── INTERRUPTOR DEMO ⇄ REAL (PROVISIONAL) ───────────────────────────────────
// Alterna entre el mundo simulado (datos ficticios) y Supabase. Se muestra en el
// Simulador y en Configuración. Quitar cuando las pantallas v0.18 lean Supabase
// (ver PENDIENTES.txt #30).
import { useState } from 'react';
import { Database, FlaskConical } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn } from '../../ui/primitives.jsx';
import { isDemoBackend, hasRealBackend, setBackendMode } from '../../lib/demoBackend.js';

export default function BackendModeSwitch({ style }) {
  const { C } = useTheme();
  const [confirm, setConfirm] = useState(false);
  if (!hasRealBackend) return null;          // sin Supabase real no hay a dónde cambiar
  const next = isDemoBackend ? 'real' : 'demo';
  const Icon = isDemoBackend ? FlaskConical : Database;

  return (
    <div style={{ padding: 14, borderRadius: 18, border: `1px solid ${C.border}`, background: 'var(--c-card-el)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 900, color: C.text, marginBottom: 4 }}>
        <Icon size={16} color={isDemoBackend ? C.purple : C.success} />
        Modo: {isDemoBackend ? 'Demo (datos ficticios)' : 'Real (conectado a Supabase)'}
      </div>
      <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5, marginBottom: 10 }}>
        {isDemoBackend
          ? 'Perfil v0.18, portafolio y Mis cachuelos con personas simuladas. Nada se guarda en el servidor.'
          : 'Datos reales de Supabase. Ojo: el perfil v0.18 y el portafolio aún no están conectados; aquí se ven las pantallas anteriores.'}
        {' '}Solo afecta a este navegador.
      </div>
      {confirm ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" onClick={() => setConfirm(false)} style={{ flex: 1, minHeight: 44, padding: 8 }}>Cancelar</Btn>
          <Btn onClick={() => setBackendMode(next)} style={{ flex: 1, minHeight: 44, padding: 8 }}>Sí, cambiar</Btn>
        </div>
      ) : (
        <Btn variant="ghost" onClick={() => setConfirm(true)} style={{ width: '100%', minHeight: 44, padding: 8 }}>
          Cambiar a {next === 'real' ? 'Real (Supabase)' : 'Demo (ficticio)'}
        </Btn>
      )}
    </div>
  );
}
