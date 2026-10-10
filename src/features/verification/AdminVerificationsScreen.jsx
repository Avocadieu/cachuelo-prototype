// ─── PANEL DE REVISIÓN (Operaciones) ─────────────────────────────────────────
// Revisión MANUAL para el MVP: el revisor compara la selfie con la foto del
// DNI, valida el CUL en la plataforma oficial del MTPE y marca el checklist.
// No se puede aprobar sin completar todos los puntos.
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, X, AlertTriangle, ScanFace, ListChecks } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn, Screen } from '../../ui/primitives.jsx';
import { toast, haptic } from '../../ui/toast.jsx';
import {
  listVerifications, listPendingAvatars, reviewVerification, reviewAvatar, fileUrl, onVerificationChange,
  ageFrom, daysSince, culIsValid, CUL_VALID_DAYS, isDemoVerification,
} from './verificationStore.js';

const CHECKLIST = [
  ['rostro', 'La selfie coincide con la foto del DNI (misma persona)'],
  ['dni', 'El DNI se lee completo, no está alterado y el número coincide'],
  ['nombre', 'Nombres del DNI = nombres declarados'],
  ['edad', 'Es mayor de 18 años según el DNI'],
  ['cul', 'CUL verificado en la plataforma oficial del MTPE (número + DNI) y vigente'],
  ['antecedentes', 'Antecedentes revisados según la política de seguridad de Cachuelo'],
];

const Img = ({ v, field, label, C }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => { let on = true; fileUrl(v, field).then(u => on && setUrl(u)); return () => { on = false; }; }, [v, field]);
  const isPdf = !isDemoVerification && (v?.[`${field}_path`] || '').endsWith('.pdf');
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <a href={url || undefined} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: 120, borderRadius: 12, overflow: 'hidden', background: '#0D1B3E', border: '1px solid var(--c-bord)' }}>
        {url && !isPdf ? <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, padding: 8, textAlign: 'center' }}>{isPdf ? 'Abrir PDF' : (v?.[`${field}_nombre`] || 'Sin vista previa')}</div>}
      </a>
    </div>
  );
};

function VerificationCard({ v, C, onDone }) {
  const [checks, setChecks] = useState({});
  const [motivo, setMotivo] = useState('');
  const [busy, setBusy] = useState(false);
  const all = CHECKLIST.every(([k]) => checks[k]);
  const age = ageFrom(v.fecha_nac);
  const culDays = daysSince(v.cul_emitido);

  const decide = async (estado) => {
    if (estado !== 'aprobado' && motivo.trim().length < 8) { toast('Escribe el motivo para el usuario', 'error'); return; }
    setBusy(true);
    try { await reviewVerification(v.user_id, estado, estado === 'aprobado' ? null : motivo.trim()); haptic(25); toast(estado === 'aprobado' ? 'Usuario verificado' : 'Decisión enviada', 'success'); onDone?.(); }
    catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  };

  return (
    <div style={{ background: C.card, borderRadius: 20, padding: 14, border: '1px solid var(--lg-stroke)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>{v.nombres}</div>
          <div className="lg-num" style={{ fontSize: 12, color: C.textSec }}>DNI {v.dni} · {age} años · enviado {new Date(v.enviado_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Img C={C} v={v} field="selfie" label="Selfie" />
        <Img C={C} v={v} field="dni_frente" label="DNI anverso" />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Img C={C} v={v} field="dni_reverso" label="DNI reverso" />
        <Img C={C} v={v} field="cul" label="CUL" />
      </div>
      <div style={{ fontSize: 12.5, color: C.textSec, background: 'var(--c-card-el)', borderRadius: 12, padding: '8px 10px', marginBottom: 10, lineHeight: 1.5 }}>
        CUL N° <b className="lg-num">{v.cul_numero}</b> · emitido hace {culDays} días{' '}
        {culIsValid(v.cul_emitido) ? <b style={{ color: C.success }}>(vigente)</b> : <b style={{ color: C.danger }}>(vencido, &gt;{CUL_VALID_DAYS} días)</b>}
        {age < 18 && <div style={{ color: C.danger, fontWeight: 800 }}>⚠ Menor de edad: rechazar</div>}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.text, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}><ListChecks size={15} /> Checklist obligatorio</div>
      {CHECKLIST.map(([k, t]) => (
        <label key={k} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, color: C.textSec, padding: '5px 0', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!checks[k]} onChange={e => setChecks(c => ({ ...c, [k]: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.success, flexShrink: 0 }} /> {t}
        </label>
      ))}
      <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={2} placeholder="Motivo para el usuario (si pides cambios o rechazas). Ej.: la foto del DNI está borrosa"
        style={{ width: '100%', boxSizing: 'border-box', margin: '8px 0', borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, padding: 10, fontSize: 16, fontFamily: 'inherit', resize: 'none' }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn variant="ghost" onClick={() => decide('observado')} disabled={busy} style={{ flex: 1, padding: '10px 6px', fontSize: 13 }}><AlertTriangle size={15} /> Pedir cambios</Btn>
        <Btn variant="danger" onClick={() => decide('rechazado')} disabled={busy} style={{ flex: 1, padding: '10px 6px', fontSize: 13 }}><X size={15} /> Rechazar</Btn>
        <Btn onClick={() => decide('aprobado')} disabled={!all || busy || age < 18} style={{ flex: 1.2, padding: '10px 6px', fontSize: 13 }}><Check size={15} /> Aprobar</Btn>
      </div>
    </div>
  );
}

function AvatarCard({ v, C }) {
  const [busy, setBusy] = useState(false);
  const [dniUrl, setDniUrl] = useState(null);
  const [newUrl, setNewUrl] = useState(null);
  useEffect(() => {
    fileUrl(v, 'dni_frente').then(setDniUrl);
    if (isDemoVerification) setNewUrl(v.avatar_pendiente);
    else fileUrl({ avatar_pendiente_path: v.avatar_pendiente_path }, 'avatar_pendiente').then(setNewUrl);
  }, [v]);
  const go = async (ok) => {
    setBusy(true);
    try { await reviewAvatar(v.user_id, ok, ok ? null : 'La foto no coincide con tu DNI o no muestra tu rostro con claridad.'); toast(ok ? 'Foto aprobada' : 'Foto rechazada', ok ? 'success' : 'info'); }
    catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  };
  return (
    <div style={{ background: C.card, borderRadius: 20, padding: 14, border: '1px solid var(--lg-stroke)', marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: C.text, marginBottom: 8 }}>{v.nombres || 'Usuario'} · nueva foto de perfil</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[['Foto nueva', newUrl], ['DNI', dniUrl]].map(([l, u]) => (
          <div key={l} style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, marginBottom: 4 }}>{l.toUpperCase()}</div>
            <div style={{ height: 130, borderRadius: 12, overflow: 'hidden', background: '#0D1B3E' }}>{u && <img src={u} alt={l} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div>
          </div>
        ))}
      </div>
      {!dniUrl && <div style={{ fontSize: 12, color: C.danger, background: C.dangerSoft, borderRadius: 10, padding: '8px 10px', marginBottom: 8 }}>Este usuario aún no verificó su DNI: no se puede aprobar la foto hasta que lo haga.</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn variant="danger" onClick={() => go(false)} disabled={busy} style={{ flex: 1, padding: 10, fontSize: 13 }}>No coincide</Btn>
        <Btn onClick={() => go(true)} disabled={busy || !dniUrl || v.estado !== 'aprobado'} style={{ flex: 1, padding: 10, fontSize: 13 }}>Coincide, aprobar</Btn>
      </div>
    </div>
  );
}

export default function AdminVerificationsScreen({ onBack, onNavigate }) {
  const { C } = useTheme();
  const [tab, setTab] = useState('docs');
  const [items, setItems] = useState([]);
  const [avatars, setAvatars] = useState([]);
  useEffect(() => {
    const load = () => { listVerifications('pendiente').then(setItems); listPendingAvatars().then(setAvatars); };
    load(); return onVerificationChange(load);
  }, []);

  return (
    <Screen withTabs activeTab="profile" onNavigate={onNavigate}>
      <div className="lg-header" style={{ padding: '48px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} aria-label="Volver" style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={19} color="#fff" /></button>
          <div style={{ color: '#fff', fontSize: 19, fontWeight: 900 }}>Revisar verificaciones</div>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.16)', borderRadius: 14, padding: 3 }}>
          {[['docs', `Documentos (${items.length})`], ['fotos', `Fotos de perfil (${avatars.length})`]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: '9px 0', borderRadius: 11, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13, background: tab === id ? '#fff' : 'transparent', color: tab === id ? C.headerBg : '#fff' }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        {isDemoVerification && <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B45309', background: 'rgba(245,158,11,0.15)', borderRadius: 10, padding: '7px 10px', marginBottom: 12 }}>MODO DEMO · en producción solo usuarios con rol admin ven este panel</div>}
        {tab === 'docs' && (items.length === 0
          ? <div style={{ textAlign: 'center', color: C.textMuted, padding: '40px 0', fontSize: 13 }}><ScanFace size={34} style={{ marginBottom: 8 }} /><br />No hay verificaciones pendientes</div>
          : items.map(v => <VerificationCard key={v.user_id} v={v} C={C} />))}
        {tab === 'fotos' && (avatars.length === 0
          ? <div style={{ textAlign: 'center', color: C.textMuted, padding: '40px 0', fontSize: 13 }}>No hay fotos por aprobar</div>
          : avatars.map(v => <AvatarCard key={v.user_id} v={v} C={C} />))}
      </div>
    </Screen>
  );
}
