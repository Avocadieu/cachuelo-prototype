// ─── VERIFICACIÓN DE IDENTIDAD (onboarding) ──────────────────────────────────
// Pasos: Intro → Datos → DNI → Selfie → CUL → Consentimiento → Enviado
// Mientras la cuenta no esté verificada, el usuario puede mirar cachuelos pero
// NO puede postular, publicar ni chatear (ver useVerification + VerifyGate).
import { useEffect, useState } from 'react';
import { ArrowLeft, Contact as IdCard, Camera, FileCheck2, ShieldCheck, Check, Upload, ExternalLink, AlertTriangle, Clock3 } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn, Screen } from '../../ui/primitives.jsx';
import { toast, haptic } from '../../ui/toast.jsx';
import {
  getVerification, submitVerification, onVerificationChange, verifUserId, STATUS,
  ageFrom, culIsValid, dniIsValid, CUL_VALID_DAYS, MIN_AGE, isDemoVerification,
} from './verificationStore.js';

export const CUL_INFO_URL = 'https://www.gob.pe/institucion/mtpe/pages/47089-obtener-tu-certificado-unico-laboral-cul';

/** Estado de verificación reactivo para cualquier pantalla. */
export function useVerification(user) {
  const uid = verifUserId(user);
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!uid) { setV(null); setLoading(false); return; }
    const load = () => getVerification(uid).then(r => { setV(r); setLoading(false); });
    load();
    return onVerificationChange(load);
  }, [uid]);
  const estado = v?.estado || 'none';
  return { verification: v, estado, isVerified: estado === 'aprobado', loading };
}

// ── Piezas de UI ──────────────────────────────────────────────────────────────
const StepDots = ({ step, total, C }) => (
  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '4px 0 18px' }} aria-label={`Paso ${step} de ${total}`}>
    {Array.from({ length: total }).map((_, i) => (
      <span key={i} style={{ height: 6, width: i + 1 === step ? 22 : 6, borderRadius: 3, background: i + 1 <= step ? C.primary : 'var(--c-bord)', transition: 'all .3s' }} />
    ))}
  </div>
);

const FilePick = ({ label, hint, file, onFile, capture, accept = 'image/*', C, tall }) => {
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file || !file.type?.startsWith('image/')) { setPreview(null); return; }
    const u = URL.createObjectURL(file); setPreview(u); return () => URL.revokeObjectURL(u);
  }, [file]);
  return (
    <label style={{ display: 'block', marginBottom: 12, cursor: 'pointer' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.textSec, display: 'block', marginBottom: 6 }}>{label}</span>
      <div style={{ height: tall ? 220 : 150, borderRadius: 18, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6,
        background: file ? '#000' : C.card, border: `2px dashed ${file ? C.success : 'var(--c-bord)'}`, color: C.textMuted, fontSize: 13 }}>
        {preview ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : file ? <><FileCheck2 size={28} color={C.success} /><span style={{ color: C.text, fontWeight: 700 }}>{file.name}</span></>
          : <><Upload size={24} /><span style={{ fontWeight: 700 }}>Tomar foto o elegir archivo</span>{hint && <span style={{ fontSize: 11.5, padding: '0 16px', textAlign: 'center' }}>{hint}</span>}</>}
        {file && <span style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 13, background: C.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={15} color="#fff" strokeWidth={3} /></span>}
      </div>
      <input type="file" accept={accept} capture={capture} style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) { if (f.size > 10 * 1024 * 1024) { toast('El archivo pesa más de 10 MB', 'error'); return; } onFile(f); haptic(); } e.target.value = ''; }} />
    </label>
  );
};

const Check2 = ({ checked, onChange, children, C }) => (
  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 14, background: C.card, border: `1.5px solid ${checked ? C.primary : 'var(--c-bord)'}`, marginBottom: 10, cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 20, height: 20, accentColor: C.primary, marginTop: 1, flexShrink: 0 }} />
    <span style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{children}</span>
  </label>
);

// ── Tarjeta de estado (Inicio / Perfil) ───────────────────────────────────────
export function VerificationStatusCard({ user, onStart, compact }) {
  const { C } = useTheme();
  const { estado, verification } = useVerification(user);
  if (estado === 'aprobado' && compact) return null;
  const st = STATUS[estado];
  const copy = {
    none: ['Verifica tu identidad', 'Necesario para postular y publicar. Toma ~3 minutos: DNI, selfie y CUL.', 'Empezar'],
    pendiente: ['Verificación en revisión', 'Estamos revisando tus documentos. Te avisaremos al terminar.', null],
    observado: ['Tu verificación necesita cambios', verification?.motivo || 'Revisa el motivo y vuelve a enviar.', 'Corregir'],
    rechazado: ['Verificación no aprobada', verification?.motivo || 'Escríbenos si crees que es un error.', null],
    aprobado: ['Identidad verificada', 'Tu perfil muestra el sello de verificación.', null],
  }[estado];
  return (
    <div className="lg-pop-in" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14, borderRadius: 20, background: C.card, border: `1px solid ${st.color}55`, boxShadow: 'inset 0 1px 0 var(--lg-highlight)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${st.color}22` }}>
        {estado === 'pendiente' ? <Clock3 size={22} color={st.color} /> : estado === 'aprobado' ? <ShieldCheck size={22} color={st.color} /> : <IdCard size={22} color={st.color} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{copy[0]}</div>
        <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.4, marginTop: 2 }}>{copy[1]}</div>
      </div>
      {copy[2] && <Btn onClick={onStart} style={{ padding: '10px 14px', minHeight: 40, fontSize: 13.5 }}>{copy[2]}</Btn>}
    </div>
  );
}

// ── Hoja que aparece al intentar una acción sin verificar ────────────────────
export function VerifyGateSheet({ open, onClose, onStart, estado, action = 'continuar' }) {
  const { C } = useTheme();
  if (!open) return null;
  const pending = estado === 'pendiente';
  return (
    <div className="lg-scrim" onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 650, background: 'var(--lg-scrim)', display: 'flex', alignItems: 'flex-end' }}>
      <div className="lg-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Verificación requerida"
        style={{ width: '100%', background: 'var(--lg-fill-strong)', padding: '10px 20px 28px', boxSizing: 'border-box', textAlign: 'center' }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--c-bord)', margin: '0 auto 16px' }} />
        <div style={{ width: 64, height: 64, borderRadius: 22, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: pending ? 'rgba(245,158,11,0.18)' : C.infoSoft }}>
          {pending ? <Clock3 size={30} color={C.warning} /> : <ShieldCheck size={30} color={C.headerBg} />}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: C.text, marginBottom: 6 }}>{pending ? 'Tu verificación está en revisión' : `Verifica tu identidad para ${action}`}</div>
        <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.55, marginBottom: 18 }}>
          {pending
            ? 'Podrás hacerlo apenas el equipo apruebe tus documentos.'
            : 'En Cachuelo todos los usuarios verifican su DNI y su Certificado Único Laboral. Así contratantes y trabajadores saben con quién tratan.'}
        </div>
        {pending ? <Btn variant="ghost" onClick={onClose} style={{ width: '100%' }}>Entendido</Btn>
          : <><Btn onClick={onStart} style={{ width: '100%', marginBottom: 8 }}>Verificar ahora</Btn>
              <button onClick={onClose} style={{ border: 'none', background: 'none', color: C.textMuted, fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 8 }}>Ahora no</button></>}
      </div>
    </div>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function VerificationScreen({ user, onDone, onSkip, onNavigate }) {
  const { C } = useTheme();
  const { estado, verification } = useVerification(user);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nombres: [user?.nombre, user?.apellido].filter(Boolean).join(' '),
    dni: '', fecha_nac: user?.fecha_nac || '', cul_numero: '', cul_emitido: '',
  });
  const [files, setFiles] = useState({ dni_frente: null, dni_reverso: null, selfie: null, cul: null });
  const [consent, setConsent] = useState({ datos: false, veraz: false });
  const [sending, setSending] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setFile = (k) => (f) => setFiles(x => ({ ...x, [k]: f }));

  const age = ageFrom(form.fecha_nac);
  const culDays = form.cul_emitido ? Math.floor((Date.now() - new Date(form.cul_emitido + 'T00:00:00')) / 86400e3) : null;
  const TOTAL = 5;
  const canNext = [
    true,
    form.nombres.trim().split(/\s+/).length >= 2 && dniIsValid(form.dni) && age != null && age >= MIN_AGE,
    !!files.dni_frente && !!files.dni_reverso,
    !!files.selfie,
    form.cul_numero.trim().length >= 6 && culIsValid(form.cul_emitido) && !!files.cul,
    consent.datos && consent.veraz,
  ][step];

  const send = async () => {
    setSending(true);
    try {
      await submitVerification(user, { ...form, consentimiento: true }, files);
      haptic(30); setStep(6); toast('Documentos enviados para revisión', 'success');
    } catch (e) { toast(e.message, 'error'); }
    setSending(false);
  };

  const field = { width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, fontSize: 16, outline: 'none', fontFamily: 'inherit', marginBottom: 12 };
  const lbl = { fontSize: 13, fontWeight: 700, color: C.textSec, display: 'block', marginBottom: 6 };
  const H = ({ icon: Icon, title, sub }) => (
    <div style={{ textAlign: 'center', marginBottom: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(145deg, ${C.primaryLight}, ${C.primaryDark})`, boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.45)' }}><Icon size={26} color="#fff" /></div>
      <div style={{ fontSize: 19, fontWeight: 900, color: C.text, letterSpacing: -0.3 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5, marginTop: 4 }}>{sub}</div>}
    </div>
  );

  // Ya enviada o aprobada → solo mostrar estado
  if (step === 0 && (estado === 'pendiente' || estado === 'aprobado' || estado === 'rechazado')) {
    return (
      <Screen withTabs activeTab="profile" onNavigate={onNavigate}>
        <div className="lg-header" style={{ padding: '48px 18px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onSkip} aria-label="Volver" style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={19} color="#fff" /></button>
          <div style={{ color: '#fff', fontSize: 19, fontWeight: 900 }}>Verificación de identidad</div>
        </div>
        <div style={{ padding: 16 }}>
          <VerificationStatusCard user={user} />
          {verification?.enviado_at && <div style={{ fontSize: 12, color: C.textMuted, textAlign: 'center', marginTop: 12 }}>Enviado el {new Date(verification.enviado_at).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}</div>}
        </div>
      </Screen>
    );
  }

  return (
    <Screen withTabs={false} onNavigate={onNavigate}>
      <div className="lg-header" style={{ padding: '48px 18px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => (step > 0 && step < 6 ? setStep(step - 1) : onSkip?.())} aria-label="Atrás" style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={19} color="#fff" /></button>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 900 }}>Verificación de identidad</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{step >= 1 && step <= TOTAL ? `Paso ${step} de ${TOTAL}` : 'Seguridad para todos'}</div>
        </div>
      </div>

      <div style={{ padding: '18px 18px 32px' }}>
        {isDemoVerification && step < 6 && <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B45309', background: 'rgba(245,158,11,0.15)', borderRadius: 10, padding: '7px 10px', marginBottom: 14 }}>MODO DEMO · los archivos se guardan solo en este dispositivo</div>}
        {step >= 1 && step <= TOTAL && <StepDots step={step} total={TOTAL} C={C} />}
        {estado === 'observado' && step === 0 && (
          <div style={{ display: 'flex', gap: 8, fontSize: 13, color: C.danger, background: C.dangerSoft, borderRadius: 14, padding: '10px 12px', marginBottom: 14 }}><AlertTriangle size={16} style={{ flexShrink: 0 }} /> {verification?.motivo || 'El equipo pidió cambios en tus documentos.'}</div>
        )}

        {step === 0 && (
          <div className="lg-pop-in">
            <H icon={ShieldCheck} title="Antes de empezar" sub="Verificamos a todos los usuarios para que contratantes y trabajadores sepan con quién tratan." />
            {[
              [IdCard, 'Tu DNI', 'Foto del anverso y reverso'],
              [Camera, 'Una selfie', 'La comparamos con la foto de tu DNI'],
              [FileCheck2, 'Tu Certificado Único Laboral (CUL)', `Gratis en el MTPE. Incluye antecedentes policiales, penales y judiciales. Vigencia: ${CUL_VALID_DAYS} días`],
            ].map(([Icon, t, s]) => (
              <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 16, background: C.card, border: '1px solid var(--lg-stroke)', marginBottom: 8 }}>
                <span style={{ width: 40, height: 40, borderRadius: 13, background: C.infoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={20} color={C.headerBg} /></span>
                <div><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{t}</div><div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.4 }}>{s}</div></div>
              </div>
            ))}
            <a href={CUL_INFO_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: C.headerBg, margin: '10px 0 16px', textDecoration: 'none' }}>
              ¿No tienes tu CUL? Sácalo gratis aquí <ExternalLink size={14} />
            </a>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, marginBottom: 16, textAlign: 'center' }}>Tus documentos solo los ve el equipo de verificación de Cachuelo. Otros usuarios solo ven el sello “Identidad verificada”.</div>
            <Btn onClick={() => setStep(1)} style={{ width: '100%' }}>Empezar verificación</Btn>
            {onSkip && <button onClick={onSkip} style={{ display: 'block', margin: '10px auto 0', border: 'none', background: 'none', color: C.textMuted, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Hacerlo después (solo podrás mirar cachuelos)</button>}
          </div>
        )}

        {step === 1 && (
          <div className="lg-pop-in">
            <H icon={IdCard} title="Tus datos" sub="Escríbelos tal como aparecen en tu DNI." />
            <label style={lbl}>Nombres y apellidos</label>
            <input value={form.nombres} onChange={e => upd('nombres', e.target.value)} placeholder="Juan Carlos Pérez Rojas" style={field} autoComplete="name" />
            <label style={lbl}>Número de DNI</label>
            <input inputMode="numeric" value={form.dni} onChange={e => upd('dni', e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="8 dígitos" style={{ ...field, letterSpacing: 2 }} />
            <label style={lbl}>Fecha de nacimiento</label>
            <input type="date" value={form.fecha_nac} onChange={e => upd('fecha_nac', e.target.value)} max={new Date().toISOString().split('T')[0]} style={field} />
            {age != null && age < MIN_AGE && <div style={{ fontSize: 12.5, color: C.danger, background: C.dangerSoft, borderRadius: 12, padding: '9px 12px', marginBottom: 12 }}>Cachuelo es solo para mayores de {MIN_AGE} años.</div>}
          </div>
        )}

        {step === 2 && (
          <div className="lg-pop-in">
            <H icon={IdCard} title="Fotos de tu DNI" sub="Sobre una mesa, con buena luz, sin reflejos y que se lean todos los datos." />
            <FilePick C={C} label="Anverso (lado de la foto)" file={files.dni_frente} onFile={setFile('dni_frente')} capture="environment" />
            <FilePick C={C} label="Reverso" file={files.dni_reverso} onFile={setFile('dni_reverso')} capture="environment" />
          </div>
        )}

        {step === 3 && (
          <div className="lg-pop-in">
            <H icon={Camera} title="Tómate una selfie" sub="La compararemos con la foto de tu DNI. Será tu foto de perfil cuando se apruebe." />
            <FilePick C={C} tall label="Selfie" hint="Rostro de frente, buena luz, sin lentes oscuros, gorra ni mascarilla" file={files.selfie} onFile={setFile('selfie')} capture="user" />
          </div>
        )}

        {step === 4 && (
          <div className="lg-pop-in">
            <H icon={FileCheck2} title="Certificado Único Laboral" sub={`Lo verificamos en la plataforma oficial del MTPE. Debe tener menos de ${CUL_VALID_DAYS} días.`} />
            <label style={lbl}>Número del certificado</label>
            <input value={form.cul_numero} onChange={e => upd('cul_numero', e.target.value.toUpperCase().slice(0, 30))} placeholder="Aparece en el CUL" style={field} />
            <label style={lbl}>Fecha de emisión</label>
            <input type="date" value={form.cul_emitido} onChange={e => upd('cul_emitido', e.target.value)} max={new Date().toISOString().split('T')[0]} style={field} />
            {culDays != null && !culIsValid(form.cul_emitido) && <div style={{ fontSize: 12.5, color: C.danger, background: C.dangerSoft, borderRadius: 12, padding: '9px 12px', marginBottom: 12 }}>Tu CUL tiene {culDays} días. Saca uno nuevo (es gratis) para continuar.</div>}
            <FilePick C={C} label="Archivo del CUL (PDF o foto)" accept="image/*,application/pdf" file={files.cul} onFile={setFile('cul')} />
            <a href={CUL_INFO_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: C.headerBg, textDecoration: 'none' }}>Cómo sacar el CUL gratis <ExternalLink size={13} /></a>
          </div>
        )}

        {step === 5 && (
          <div className="lg-pop-in">
            <H icon={ShieldCheck} title="Último paso" sub="Necesitamos tu autorización expresa porque se trata de datos sensibles." />
            <Check2 C={C} checked={consent.datos} onChange={v => setConsent(c => ({ ...c, datos: v }))}>
              Autorizo a Cachuelo a tratar mi DNI, mi imagen y mi Certificado Único Laboral (que incluye antecedentes policiales, penales y judiciales) <b>solo para verificar mi identidad y la seguridad de la comunidad</b>, conforme a la Ley N° 29733 y a la Política de Privacidad.
            </Check2>
            <Check2 C={C} checked={consent.veraz} onChange={v => setConsent(c => ({ ...c, veraz: v }))}>
              Declaro que los documentos son míos, auténticos y vigentes. Sé que usar documentos falsos lleva a la suspensión de mi cuenta.
            </Check2>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, margin: '4px 2px 16px' }}>Puedes pedir acceso, corrección o eliminación de tus datos en cualquier momento desde Configuración.</div>
          </div>
        )}

        {step >= 1 && step <= TOTAL && (
          <Btn onClick={() => (step < TOTAL ? setStep(step + 1) : send())} disabled={!canNext || sending} style={{ width: '100%', marginTop: 8 }}>
            {step < TOTAL ? 'Continuar' : sending ? 'Enviando…' : 'Enviar para revisión'}
          </Btn>
        )}

        {step === 6 && (
          <div className="lg-pop-in" style={{ textAlign: 'center', paddingTop: 30 }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #FCD34D, #F59E0B)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.45)' }}><Clock3 size={38} color="#fff" /></div>
            <div style={{ fontSize: 21, fontWeight: 900, color: C.text }}>¡Listo! Estamos revisando</div>
            <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.55, margin: '8px 10px 22px' }}>El equipo de Cachuelo comparará tu selfie con tu DNI y validará tu CUL. Te avisaremos cuando termine. Mientras tanto puedes explorar cachuelos.</div>
            <Btn onClick={onDone} style={{ width: '100%' }}>Explorar cachuelos</Btn>
          </div>
        )}
      </div>
    </Screen>
  );
}
