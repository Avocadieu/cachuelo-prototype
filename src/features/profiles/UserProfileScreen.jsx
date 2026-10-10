// ─── PERFIL DE DOBLE ROL (v0.18) ────────────────────────────────────────────
// Una misma cuenta puede ser TRABAJADOR (postula y hace cachuelos) y
// CONTRATANTE (publica y paga). El perfil muestra ambas facetas por separado:
// estadísticas, portafolio, historial y reseñas de cada rol.
// Fuente de datos: simulación (demoWorld). En producción: tablas profiles,
// resenas (con columna rol) y portafolio (migración v0.18).
import { useRef, useState } from 'react';
import { ArrowLeft, Settings, MapPin, Clock, BadgeCheck, Hammer, Megaphone, Plus, Repeat, CheckCircle2, Star, Camera, Pencil, ChevronRight, Briefcase } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Avatar, Stars, Screen, Btn, CategoryIcon } from '../../ui/primitives.jsx';
import { toast } from '../../ui/toast.jsx';
import { CatChip, CategorySheet } from '../catalog/CategoryPicker.jsx';
import { PortfolioGrid, PortfolioViewer, PortfolioEditor, ROL_LABEL } from './Portfolio.jsx';
import { useVerification, VerificationStatusCard } from '../verification/VerificationScreen.jsx';
import { submitAvatarChange } from '../verification/verificationStore.js';
import {
  useSim, baseProfile, statsFor, portfolioOf, jobsAs, reviewsFor, allCachuelos, removePortfolioItem,
  updateMyProfile, ago, sinceLabel,
} from '../demo/demoWorld.js';

const Card = ({ children, style }) => {
  const { C } = useTheme();
  return <div style={{ background: C.card, borderRadius: 20, padding: 16, marginBottom: 12, border: '1px solid var(--lg-stroke)', boxShadow: 'inset 0 1px 0 var(--lg-highlight), 0 8px 22px -16px rgba(13,27,62,0.4)', ...style }}>{children}</div>;
};
const H = ({ children, right }) => {
  const { C } = useTheme();
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}><span style={{ fontSize: 12, fontWeight: 900, color: C.textSec, letterSpacing: 0.5, textTransform: 'uppercase' }}>{children}</span>{right}</div>;
};

function ReviewItem({ r, onViewProfile, selfUser }) {
  const { C } = useTheme();
  const from = baseProfile(r.fromId, selfUser);
  return (
    <div style={{ padding: '12px 0', borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => onViewProfile?.(r.fromId)} aria-label={`Ver perfil de ${from.fullName}`} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
          <Avatar initials={from.initials} size={34} bg={from.color} fontSize={12} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{from.fullName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Stars rating={r.estrellas} size={12} /><span style={{ fontSize: 11, color: C.textMuted }}>{ago(r.createdAt)}</span></div>
        </div>
      </div>
      {r.comentario && <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, marginTop: 6 }}>{r.comentario}</div>}
      {r.tags?.length > 0 && <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>{r.tags.map(t => <span key={t} style={{ fontSize: 10.5, fontWeight: 700, color: C.textSec, background: 'var(--c-card-el)', padding: '3px 8px', borderRadius: 10 }}>{t}</span>)}</div>}
    </div>
  );
}

function JobRow({ j, rol, onViewProfile, selfUser, uid }) {
  const { C } = useTheme();
  const otherId = rol === 'trabajador' ? j.ownerId : j.workerId;
  const other = baseProfile(otherId, selfUser);
  const rv = reviewsFor(uid, rol).find(r => r.jobId === j.id);
  const cancelled = j.estado === 'cancelado';
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${C.border}`, opacity: cancelled ? 0.6 : 1 }}>
      <CategoryIcon label={j.category} size={38} iconSize={18} radius={11} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</div>
        <div style={{ fontSize: 11.5, color: C.textMuted }}>
          {rol === 'trabajador' ? 'Para ' : 'Lo hizo '}
          <button onClick={() => onViewProfile?.(otherId)} style={{ border: 'none', background: 'none', padding: 0, color: C.primary, fontWeight: 700, fontSize: 11.5, cursor: 'pointer' }}>{other.fullName}</button>
          {' · '}{ago(j.completedAt)}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {cancelled ? <span style={{ fontSize: 11, fontWeight: 800, color: C.danger }}>Cancelado</span>
          : rv ? <span style={{ fontSize: 12, fontWeight: 800, color: C.warning }}>★ {rv.estrellas}</span> : <span style={{ fontSize: 11, color: C.textMuted }}>Sin reseña</span>}
      </div>
    </div>
  );
}

export default function UserProfileScreen({ userId, selfUser, own = false, onBack, onNavigate, onViewCachuelo, onViewProfile, onConfig, onVerify, activeTab = 'profile' }) {
  const { C } = useTheme();
  useSim();
  const prof = baseProfile(userId, selfUser);
  const st = statsFor(userId);
  const hasWorker = st.worker.done + st.worker.cancelled > 0 || (prof.skills || []).length > 0;
  const hasClient = st.client.published > 0;
  const [rol, setRol] = useState(() => (st.client.hired + st.client.open > st.worker.done ? 'contratante' : 'trabajador'));
  const [viewing, setViewing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(prof.bio || '');
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const fileRef = useRef(null);
  const { verification: myVerif } = useVerification(own ? selfUser : null);
  const avatarSrc = own ? myVerif?.avatar_aprobado || null : null;

  const portfolio = portfolioOf(userId).filter(p => p.rol === rol);
  const jobs = jobsAs(userId, rol);
  const reviews = reviewsFor(userId, rol);
  const openNow = allCachuelos().filter(c => c.userId === userId && c.status.estado === 'abierto');

  const saveBio = () => { updateMyProfile(userId, { bio: bio.trim().slice(0, 240) }); setEditingBio(false); toast('Descripción guardada', 'success'); };
  const toggleSkill = (label) => {
    const cur = prof.skills || [];
    const next = cur.includes(label) ? cur.filter(s => s !== label) : [...cur, label].slice(0, 8);
    updateMyProfile(userId, { skills: next });
  };
  const onAvatar = async (e) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    try { await submitAvatarChange(selfUser, f); toast('Foto enviada a revisión: debe coincidir con tu DNI.', 'info'); } catch (err) { toast(err.message, 'error'); }
  };

  const statBox = (role, label, Icon, rating, reviewsN, lines) => {
    const active = rol === role;
    return (
      <button onClick={() => setRol(role)} aria-pressed={active}
        style={{ flex: 1, textAlign: 'left', padding: 12, borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit',
          border: `1.5px solid ${active ? ROL_LABEL[role].color : C.border}`, background: active ? ROL_LABEL[role].color + '12' : C.card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 900, color: ROL_LABEL[role].color, marginBottom: 6 }}><Icon size={14} /> {label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="lg-num" style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{rating ? rating.toFixed(1) : '—'}</span>
          <Star size={13} color={C.warning} fill={C.warning} />
          <span style={{ fontSize: 11, color: C.textMuted }}>({reviewsN})</span>
        </div>
        {lines.map(l => <div key={l} style={{ fontSize: 11.5, color: C.textSec, marginTop: 2 }}>{l}</div>)}
      </button>
    );
  };

  return (
    <Screen withTabs activeTab={activeTab} onNavigate={onNavigate}>
      {/* Cabecera */}
      <div className="lg-header" style={{ padding: '44px 18px 18px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          {onBack && <button onClick={onBack} aria-label="Volver" style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={18} color="#fff" /></button>}
          <div style={{ flex: 1, color: '#fff', fontSize: 16, fontWeight: 800 }}>{own ? 'Mi perfil' : 'Perfil'}</div>
          {own && onConfig && <button onClick={onConfig} aria-label="Configuración" style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Settings size={17} color="#fff" /></button>}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Avatar initials={prof.initials} src={avatarSrc} size={74} bg={prof.color} fontSize={24} />
            {prof.verified && <span title="Identidad verificada" style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, background: C.success, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BadgeCheck size={13} color="#fff" /></span>}
            {own && <button onClick={() => fileRef.current?.click()} aria-label="Cambiar foto de perfil" style={{ position: 'absolute', top: -2, right: -4, width: 26, height: 26, borderRadius: 13, background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}><Camera size={13} color={C.headerBg} /></button>}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatar} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>{prof.fullName}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><MapPin size={12} /> {prof.district}{prof.departamento && prof.departamento !== 'Lima' && prof.departamento !== prof.district ? `, ${prof.departamento}` : ''}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><Clock size={12} /> {prof.response}{!prof.self && ` · Desde ${sinceLabel(prof.joinedAt)}`}</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
              {prof.verified && <span style={{ background: 'rgba(16,185,129,0.25)', color: '#D1FAE5', fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 12 }}>✓ DNI + CUL</span>}
              {hasWorker && <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 12 }}>🛠️ Trabajador</span>}
              {hasClient && <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 12 }}>📢 Contratante</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 24px' }}>
        {own && <div style={{ marginBottom: 12 }}><VerificationStatusCard user={selfUser} onStart={onVerify} compact /></div>}

        {/* Estadísticas por rol (tocar = cambiar de faceta) */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {statBox('trabajador', 'Como trabajador', Hammer, st.worker.rating, st.worker.reviews,
            [`${st.worker.done} cachuelo${st.worker.done !== 1 ? 's' : ''} hecho${st.worker.done !== 1 ? 's' : ''}`, st.worker.completionRate != null ? `${st.worker.completionRate}% completados` : 'Sin historial aún'])}
          {statBox('contratante', 'Como contratante', Megaphone, st.client.rating, st.client.reviews,
            [`${st.client.published} publicado${st.client.published !== 1 ? 's' : ''}`, `${st.client.hired} contratado${st.client.hired !== 1 ? 's' : ''}`])}
        </div>
        {rol === 'trabajador' && st.worker.rebooked > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: C.success, background: C.successSoft, borderRadius: 14, padding: '9px 12px', marginBottom: 12 }}>
            <Repeat size={15} /> Recontratado {st.worker.rebooked} {st.worker.rebooked === 1 ? 'vez' : 'veces'} por los mismos clientes
          </div>
        )}
        {rol === 'contratante' && st.client.hired > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: C.headerBg, background: C.infoSoft, borderRadius: 14, padding: '9px 12px', marginBottom: 12 }}>
            <CheckCircle2 size={15} /> Paga con Pago Protegido · {st.client.hired} trabajo{st.client.hired !== 1 ? 's' : ''} pagado{st.client.hired !== 1 ? 's' : ''} sin reclamos
          </div>
        )}

        {/* Sobre mí */}
        <Card>
          <H right={own && !editingBio && <button onClick={() => { setBio(prof.bio || ''); setEditingBio(true); }} style={{ border: 'none', background: 'none', color: C.primary, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Pencil size={12} /> Editar</button>}>Sobre {own ? 'mí' : prof.nombre}</H>
          {editingBio ? (
            <>
              <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 240))} rows={3} aria-label="Sobre mí" placeholder="Cuéntales qué haces y qué sueles contratar…"
                style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${C.primary}`, borderRadius: 12, padding: '10px 12px', fontSize: 16, color: C.text, background: C.card, resize: 'none', fontFamily: 'inherit', outline: 'none' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Btn variant="ghost" onClick={() => setEditingBio(false)} style={{ flex: 1, minHeight: 40, padding: 8 }}>Cancelar</Btn>
                <Btn onClick={saveBio} style={{ flex: 1, minHeight: 40, padding: 8 }}>Guardar</Btn>
              </div>
            </>
          ) : <div style={{ fontSize: 13.5, color: prof.bio ? C.text : C.textMuted, lineHeight: 1.55 }}>{prof.bio || (own ? 'Agrega una descripción: qué cachuelos haces y cuáles sueles contratar.' : 'Sin descripción.')}</div>}
          {rol === 'trabajador' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: C.textMuted, marginBottom: 6 }}>HABILIDADES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(prof.skills || []).map(s => <CatChip key={s} small label={s} onPress={own ? () => toggleSkill(s) : undefined} />)}
                {own && <button onClick={() => setSkillsOpen(true)} style={{ border: `1.5px dashed ${C.border}`, background: 'none', color: C.primary, fontWeight: 800, fontSize: 12, padding: '6px 10px', borderRadius: 20, cursor: 'pointer', minHeight: 32, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={13} /> Agregar</button>}
                {!own && !(prof.skills || []).length && <span style={{ fontSize: 12.5, color: C.textMuted }}>—</span>}
              </div>
              {own && (prof.skills || []).length > 0 && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Toca una habilidad para quitarla. Máximo 8.</div>}
              <CategorySheet open={skillsOpen} onClose={() => setSkillsOpen(false)} selected={null} onSelect={toggleSkill} />
            </div>
          )}
        </Card>

        {/* Contratante: lo que publica ahora */}
        {rol === 'contratante' && openNow.length > 0 && (
          <Card>
            <H>Cachuelos abiertos ahora ({openNow.length})</H>
            {openNow.map(c => (
              <button key={c.id} onClick={() => onViewCachuelo?.(c)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', border: 'none', borderTop: `1px solid ${C.border}`, background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <CategoryIcon label={c.category} size={36} iconSize={17} radius={10} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: C.textMuted }}>{c.location} · {c.offersCount} oferta{c.offersCount !== 1 ? 's' : ''}</div>
                </div>
                <span className="lg-num" style={{ fontWeight: 900, color: C.primary, fontSize: 14 }}>S/{c.price}</span>
                <ChevronRight size={16} color={C.textMuted} />
              </button>
            ))}
          </Card>
        )}

        {/* Portafolio */}
        <Card>
          <H right={own && <button onClick={() => setEditorOpen(true)} style={{ border: 'none', background: C.primary, color: '#fff', fontWeight: 800, fontSize: 12, padding: '7px 11px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={13} /> Agregar</button>}>
            {rol === 'trabajador' ? 'Portafolio · trabajos realizados' : 'Portafolio · lo que contrató'}
          </H>
          <PortfolioGrid items={portfolio} onOpen={setViewing}
            emptyText={own ? `Aún no tienes fotos ${rol === 'trabajador' ? 'de trabajos que hiciste' : 'de cachuelos que contrataste'}. Agrega fotos con una descripción del servicio: genera confianza.` : 'Sin fotos todavía.'} />
        </Card>

        {/* Historial */}
        <Card>
          <H>{rol === 'trabajador' ? `Cachuelos realizados (${jobs.length})` : `Cachuelos contratados (${jobs.length})`}</H>
          {jobs.length === 0 ? <div style={{ fontSize: 13, color: C.textMuted }}>{rol === 'trabajador' ? 'Todavía no ha completado cachuelos.' : 'Todavía no ha contratado cachuelos.'}</div>
            : jobs.slice(0, 8).map(j => <JobRow key={j.id} j={j} rol={rol} uid={userId} onViewProfile={onViewProfile} selfUser={selfUser} />)}
          {st[rol === 'trabajador' ? 'worker' : 'client'].categories.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {st[rol === 'trabajador' ? 'worker' : 'client'].categories.map(cat => <CatChip key={cat} small label={cat} />)}
            </div>
          )}
        </Card>

        {/* Reseñas */}
        <Card>
          <H>Reseñas como {rol} ({reviews.length})</H>
          {reviews.length === 0 ? <div style={{ fontSize: 13, color: C.textMuted }}>Sin reseñas todavía.</div> : (
            <>
              {[5, 4, 3, 2, 1].map(s => {
                const n = reviews.filter(r => r.estrellas === s).length;
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: C.textSec, marginBottom: 3 }}>
                    <span style={{ width: 22 }}>{s}★</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--c-card-el)', overflow: 'hidden' }}><div style={{ width: `${(n / reviews.length) * 100}%`, height: '100%', background: C.warning }} /></div>
                    <span style={{ width: 18, textAlign: 'right' }}>{n}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 8 }}>
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map(r => <ReviewItem key={r.id} r={r} onViewProfile={onViewProfile} selfUser={selfUser} />)}
              </div>
              {reviews.length > 3 && <button onClick={() => setShowAllReviews(v => !v)} style={{ border: 'none', background: 'none', color: C.primary, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', padding: '8px 0 0' }}>{showAllReviews ? 'Ver menos' : `Ver las ${reviews.length} reseñas`}</button>}
            </>
          )}
        </Card>

        {!own && (
          <div style={{ fontSize: 11.5, color: C.textMuted, textAlign: 'center', lineHeight: 1.5, padding: '0 10px' }}>
            <Briefcase size={12} style={{ verticalAlign: -2 }} /> Las reseñas y fotos “verificadas” vienen de cachuelos completados en la app.
          </div>
        )}
      </div>

      {viewing && <PortfolioViewer item={viewing} selfUser={selfUser} onClose={() => setViewing(null)} onDelete={own ? (it) => { removePortfolioItem(it.id); toast('Experiencia quitada', 'info'); } : null} />}
      {own && <PortfolioEditor open={editorOpen} onClose={() => setEditorOpen(false)} userId={userId} preset={null} />}
    </Screen>
  );
}
