// ─── SIMULADOR (solo modo demo) ─────────────────────────────────────────────
// Permite "entrar como" distintas personas y recorrer escenarios guiados:
// contratar y pagar, hacer un cachuelo y cobrar, doble rol, portafolio, etc.
import { useState } from 'react';
import { ArrowLeft, Sparkles, LogIn, UserRound, RotateCcw, ShieldCheck, ChevronRight, Hammer, Megaphone, Repeat2 } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Avatar, Btn, Screen } from '../../ui/primitives.jsx';
import { toast } from '../../ui/toast.jsx';
import { useVerification } from '../verification/VerificationScreen.jsx';
import { ensureDemoVerified, verifUserId } from '../verification/verificationStore.js';
import { useSim, PERSONAS, personaToUser, baseProfile, statsFor, resetSimulation, SELF_ID, getPersona } from './demoWorld.js';

const ROLE_TAG = {
  contratante: { label: 'Contratante', Icon: Megaphone, color: '#8B5CF6' },
  trabajador: { label: 'Trabajador', Icon: Hammer, color: '#2563EB' },
  ambos: { label: 'Hace ambas', Icon: Repeat2, color: '#10B981' },
};

export default function SimulatorScreen({ user, selfUser, onSwitchUser, onNavigate, onViewProfile, onBack }) {
  const { C } = useTheme();
  useSim();
  const [confirmReset, setConfirmReset] = useState(false);
  const uid = user?.id || SELF_ID;
  const asPersona = !!getPersona(uid);
  const me = baseProfile(uid, user);
  const { isVerified: selfVerified } = useVerification(selfUser);

  const enter = (p, then) => {
    ensureDemoVerified(p.id, `${p.nombre} ${p.apellido}`.trim());
    onSwitchUser(personaToUser(p));
    toast(`Ahora estás como ${p.nombre}`, 'success');
    if (then) setTimeout(() => onNavigate(then), 50);
  };
  const backToSelf = () => { onSwitchUser(selfUser); toast('Volviste a tu cuenta', 'info'); };

  const scenarios = [
    { emoji: '🧑‍💼', title: 'Contratar a alguien y pagar', who: 'Entrarás como Ana (contratante)',
      steps: ['Mira las ofertas de su limpieza', 'Revisa el perfil de quien ofertó', 'Acéptala y paga con Pago Protegido', 'Simula que terminó → confirma y libera', 'Califícala y sube fotos'],
      go: () => enter(getPersona('p-ana'), 'mycachuelos') },
    { emoji: '🛠️', title: 'Hacer un cachuelo y cobrar', who: 'Entrarás como Luis (gasfitero)',
      steps: ['Ve tus ofertas enviadas en “Postulé”', 'Simula que te aceptan (el pago queda retenido)', 'Marca el trabajo como terminado', 'Simula la confirmación → cobras el 100 %', 'Califica al contratante y revisa tus cobros'],
      go: () => enter(getPersona('p-luis'), 'mycachuelos') },
    { emoji: '🔁', title: 'Perfil de doble rol', who: 'Rosa hace tortas y también contrata',
      steps: ['Cambia entre “Como trabajador” y “Como contratante”', 'Mira su portafolio de cada faceta', 'Lee reseñas que recibió en cada rol'],
      go: () => onViewProfile('p-rosa') },
    { emoji: '📢', title: 'Publicar y recibir ofertas', who: `Con la cuenta actual (${me.fullName})`,
      steps: ['Escribe el servicio a tu manera: se cataloga solo', 'Publica gratis', 'En “Mis cachuelos” simula ofertas y elige'],
      go: () => onNavigate('publish') },
    { emoji: '📸', title: 'Subir fotos a tu portafolio', who: 'En tu perfil o al terminar un cachuelo',
      steps: ['Elige un cachuelo completado (verificado) o una experiencia externa', 'Sube hasta 6 fotos y describe el servicio'],
      go: () => onNavigate('profile') },
    { emoji: '💳', title: 'Pagos y cobros', who: 'Billetera de la cuenta actual',
      steps: ['Mira pagos retenidos, liberados y en revisión', 'Configura dónde recibes tu dinero (Yape/Plin/cuenta)'],
      go: () => onNavigate('wallet') },
  ];

  const groups = [
    ['Contratantes', PERSONAS.filter(p => p.role === 'contratante')],
    ['Trabajadores', PERSONAS.filter(p => p.role === 'trabajador')],
    ['Hacen ambas cosas', PERSONAS.filter(p => p.role === 'ambos')],
  ];

  return (
    <Screen withTabs activeTab="profile" onNavigate={onNavigate}>
      <div className="lg-header" style={{ padding: '44px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onBack && <button onClick={onBack} aria-label="Volver" style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={18} color="#fff" /></button>}
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 19, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={18} /> Simulador</div>
            <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: 12 }}>Prueba Cachuelo como distintas personas. Nada es real.</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 24px' }}>
        {/* Quién eres ahora */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.card, border: '1px solid var(--lg-stroke)', borderRadius: 20, padding: 14, marginBottom: 14 }}>
          <Avatar initials={me.initials} size={46} bg={me.color} fontSize={15} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 700 }}>ESTÁS COMO</div>
            <div style={{ fontSize: 15.5, fontWeight: 900, color: C.text }}>{me.fullName}</div>
            <div style={{ fontSize: 11.5, color: C.textSec }}>{asPersona ? 'Persona de prueba (verificada)' : 'Tu cuenta demo'}</div>
          </div>
          {asPersona
            ? <Btn variant="ghost" onClick={backToSelf} style={{ minHeight: 40, padding: '8px 12px', fontSize: 13 }}><UserRound size={15} /> Mi cuenta</Btn>
            : <Btn variant="ghost" onClick={() => onViewProfile(uid)} style={{ minHeight: 40, padding: '8px 12px', fontSize: 13 }}>Mi perfil</Btn>}
        </div>

        {!asPersona && !selfVerified && (
          <div style={{ background: C.infoSoft, borderRadius: 16, padding: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5, marginBottom: 8 }}>Para publicar o postular con tu cuenta demo necesitas la verificación aprobada. En la demo puedes aprobarla al instante (en producción la revisa el equipo).</div>
            <Btn onClick={() => { ensureDemoVerified(verifUserId(selfUser), `${selfUser?.nombre || ''} ${selfUser?.apellido || ''}`.trim()); toast('Verificación aprobada (simulación)', 'success'); }} style={{ width: '100%', minHeight: 42, padding: 10, fontSize: 14 }}><ShieldCheck size={16} /> Aprobar mi verificación (demo)</Btn>
          </div>
        )}

        {/* Escenarios */}
        <div style={{ fontSize: 13, fontWeight: 900, color: C.text, margin: '4px 2px 10px' }}>Escenarios guiados</div>
        {scenarios.map(s => (
          <button key={s.title} onClick={s.go} style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 12, padding: 14, marginBottom: 10, borderRadius: 20, border: '1px solid var(--lg-stroke)', background: C.card, cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'inset 0 1px 0 var(--lg-highlight), 0 8px 20px -16px rgba(13,27,62,0.4)' }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{s.emoji}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 14.5, fontWeight: 900, color: C.text }}>{s.title}</span>
              <span style={{ display: 'block', fontSize: 11.5, color: C.primary, fontWeight: 800, margin: '2px 0 6px' }}>{s.who}</span>
              <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>{s.steps.map(t => <li key={t}>{t}</li>)}</ol>
            </span>
            <ChevronRight size={18} color={C.textMuted} style={{ alignSelf: 'center' }} />
          </button>
        ))}

        {/* Personas */}
        <div style={{ fontSize: 13, fontWeight: 900, color: C.text, margin: '16px 2px 4px' }}>Personas de prueba</div>
        <div style={{ fontSize: 12, color: C.textMuted, margin: '0 2px 10px' }}>Todas tienen identidad verificada. Toca “Entrar” para usar la app como esa persona.</div>
        {groups.map(([title, list]) => (
          <div key={title} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11.5, fontWeight: 900, color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 2px 6px' }}>{title}</div>
            {list.map(p => {
              const b = baseProfile(p.id); const st = statsFor(p.id); const tag = ROLE_TAG[p.role];
              const line = p.role === 'contratante'
                ? `★ ${st.client.rating || '—'} como contratante · ${st.client.published} publicados`
                : p.role === 'trabajador'
                  ? `★ ${st.worker.rating || '—'} · ${st.worker.done} trabajos${st.worker.completionRate != null ? ` · ${st.worker.completionRate}%` : ''}`
                  : `🛠️ ${st.worker.done} hechos · 📢 ${st.client.hired} contratados`;
              const current = uid === p.id;
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 6, borderRadius: 16, background: C.card, border: `1.5px solid ${current ? C.primary : 'var(--lg-stroke)'}` }}>
                  <button onClick={() => onViewProfile(p.id)} aria-label={`Ver perfil de ${b.fullName}`} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}><Avatar initials={b.initials} size={40} bg={b.color} fontSize={13} /></button>
                  <button onClick={() => onViewProfile(p.id)} style={{ flex: 1, minWidth: 0, border: 'none', background: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 900, color: C.text }}>{b.fullName}
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: '#fff', background: tag.color, padding: '2px 6px', borderRadius: 8 }}>{tag.label}</span></span>
                    <span style={{ display: 'block', fontSize: 11.5, color: C.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line} · {b.district}</span>
                  </button>
                  {current
                    ? <span style={{ fontSize: 11.5, fontWeight: 800, color: C.primary }}>Activa</span>
                    : <button onClick={() => enter(p)} aria-label={`Entrar como ${b.fullName}`} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: C.primary, color: '#fff', fontWeight: 800, fontSize: 12, padding: '8px 10px', borderRadius: 12, cursor: 'pointer', minHeight: 36 }}><LogIn size={13} /> Entrar</button>}
                </div>
              );
            })}
          </div>
        ))}

        {/* Reinicio */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, border: `1px solid ${C.border}`, background: 'var(--c-card-el)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: C.text, marginBottom: 4 }}>Reiniciar simulación</div>
          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5, marginBottom: 10 }}>Borra en este navegador los cachuelos publicados en la demo, ofertas, pagos de prueba, reseñas y fotos que agregaste. Tu verificación demo se mantiene.</div>
          {confirmReset ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="ghost" onClick={() => setConfirmReset(false)} style={{ flex: 1, minHeight: 42, padding: 8 }}>Cancelar</Btn>
              <Btn variant="danger" onClick={() => { resetSimulation(); setConfirmReset(false); toast('Simulación reiniciada', 'success'); }} style={{ flex: 1, minHeight: 42, padding: 8 }}>Sí, reiniciar</Btn>
            </div>
          ) : <Btn variant="ghost" onClick={() => setConfirmReset(true)} style={{ width: '100%', minHeight: 42, padding: 8 }}><RotateCcw size={15} /> Reiniciar</Btn>}
        </div>
      </div>
    </Screen>
  );
}
