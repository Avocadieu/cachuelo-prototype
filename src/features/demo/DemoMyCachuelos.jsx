// ─── MIS CACHUELOS (simulación) ─────────────────────────────────────────────
// Con la MISMA cuenta: "Publiqué" (como contratante) y "Postulé" (como
// trabajador). Cada cachuelo muestra su avance y la acción que toca:
//   Publicado → Asignado (pago retenido) → Trabajo hecho → Pagado → Calificado
// Las acciones de la otra parte se simulan con botones "Simular: …".
import { useEffect, useState } from 'react';
import { Wallet, Users, ChevronDown, ChevronUp, BadgeCheck, Repeat, Sparkles, ShieldCheck, Flag, Camera, Star, Hammer, Megaphone } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Avatar, Btn, Screen, CategoryIcon, Stars } from '../../ui/primitives.jsx';
import { toast, haptic } from '../../ui/toast.jsx';
import Sheet from '../../ui/Sheet.jsx';
import PaymentSheet from '../payments/PaymentSheet.jsx';
import { createPayment, releasePayment, disputePayment, getPaymentForPostulacion } from '../payments/paymentStore.js';
import { breakdown, formatPEN } from '../payments/pricing.js';
import RatingSheet from '../profiles/RatingSheet.jsx';
import { PortfolioEditor } from '../profiles/Portfolio.jsx';
import {
  useSim, SELF_ID, allCachuelos, offersFor, myOffers, workerSummary, baseProfile, simulateOffers, acceptOffer,
  markWorkDone, completeCachuelo, addReview, simulateCounterReview, hasReviewed, jobsAs, getJob, portfolioOf, reviewsFor, ago,
} from './demoWorld.js';

const STEPS = ['Publicado', 'Asignado', 'Trabajo hecho', 'Pagado', 'Calificado'];
const stepOf = (estado, rated) => (estado === 'abierto' ? 0 : estado === 'asignado' ? 1 : estado === 'por_confirmar' ? 2 : rated ? 4 : 3);

function Stepper({ idx }) {
  const { C } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', margin: '10px 0 12px' }} aria-label={`Paso ${idx + 1} de 5: ${STEPS[idx]}`}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {i > 0 && <div style={{ position: 'absolute', top: 8, right: '50%', width: '100%', height: 3, background: i <= idx ? C.success : 'var(--c-bord)' }} />}
          <div style={{ position: 'relative', width: 18, height: 18, borderRadius: 9, background: i < idx ? C.success : i === idx ? C.primary : 'var(--c-bord)', border: '2px solid var(--c-card)', boxShadow: i === idx ? `0 0 0 3px ${C.primary}33` : 'none' }} />
          <div style={{ fontSize: 9.5, fontWeight: i === idx ? 900 : 600, color: i === idx ? C.text : C.textMuted, marginTop: 4, textAlign: 'center', lineHeight: 1.15 }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

const Panel = ({ children }) => {
  const { C } = useTheme();
  return <div className="lg-pop-in" style={{ background: C.card, borderRadius: 20, padding: 14, marginBottom: 12, border: '1px solid var(--lg-stroke)', boxShadow: 'inset 0 1px 0 var(--lg-highlight), 0 10px 24px -16px rgba(13,27,62,0.45)' }}>{children}</div>;
};
const Note = ({ children, tone = 'info' }) => {
  const { C } = useTheme();
  const bg = tone === 'ok' ? C.successSoft : tone === 'warn' ? 'rgba(245,158,11,0.14)' : C.infoSoft;
  return <div style={{ fontSize: 12.5, color: C.textSec, background: bg, borderRadius: 12, padding: '9px 11px', marginBottom: 10, lineHeight: 1.5 }}>{children}</div>;
};
const SimBtn = ({ children, onClick, disabled }) => {
  const { C } = useTheme();
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, borderRadius: 14, border: `1.5px dashed ${C.purple}`, background: 'rgba(139,92,246,0.08)', color: C.purple, fontWeight: 800, fontSize: 13, cursor: disabled ? 'wait' : 'pointer', marginBottom: 8, fontFamily: 'inherit', opacity: disabled ? 0.6 : 1 }}>
      <Sparkles size={14} /> {children}
    </button>
  );
};

function Head({ c, label, color }) {
  const { C } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <CategoryIcon label={c.category} size={42} iconSize={20} radius={12} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: C.text, lineHeight: 1.3 }}>{c.title}</div>
        <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 2 }}>{c.category} · {c.location}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="lg-num" style={{ fontSize: 16, fontWeight: 900, color: C.primary }}>S/{c.status?.monto ?? c.price}</div>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#fff', background: color, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap' }}>{label}</span>
      </div>
    </div>
  );
}

function OfferCard({ o, price, onAccept, onViewProfile, selfUser }) {
  const { C } = useTheme();
  const w = workerSummary(o.workerId, selfUser);
  const counter = Number(o.monto) !== Number(price);
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 0 4px' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={() => onViewProfile(o.workerId)} aria-label={`Ver perfil de ${w.name}`} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
          <Avatar initials={w.initials} size={42} bg={w.color} fontSize={14} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <button onClick={() => onViewProfile(o.workerId)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontSize: 13.5, fontWeight: 900, color: C.text, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
            {w.name} {w.verified && <BadgeCheck size={14} color={C.success} aria-label="Verificado" />}
          </button>
          <div style={{ fontSize: 11.5, color: C.textSec, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {w.reviews ? <span>★ {w.rating.toFixed(1)} ({w.reviews})</span> : <span>Nuevo</span>}
            {w.completionRate != null && <span>{w.completionRate}% completados</span>}
            {w.rebooked > 0 && <span style={{ color: C.success, display: 'inline-flex', alignItems: 'center', gap: 2 }}><Repeat size={11} /> {w.rebooked}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="lg-num" style={{ fontSize: 16, fontWeight: 900, color: C.text }}>S/{o.monto}</div>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: counter ? C.warning : C.success }}>{counter ? 'Contraoferta' : 'Acepta tu precio'}</div>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.5, margin: '8px 0', background: 'var(--c-card-el)', borderRadius: 12, padding: '8px 10px' }}>“{o.mensaje}”<div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 3 }}>{ago(o.createdAt)}</div></div>
      {o.estado === 'pendiente' && <Btn onClick={() => onAccept(o, w)} style={{ width: '100%', minHeight: 42, padding: 10, fontSize: 14 }}>Aceptar a {w.name.split(' ')[0]} · S/{o.monto}</Btn>}
      {o.estado === 'rechazada' && <div style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 700 }}>No elegida</div>}
    </div>
  );
}

export default function DemoMyCachuelos({ user, onNavigate, onViewCachuelo, onViewProfile, focusId }) {
  const { C } = useTheme();
  useSim();
  const uid = user?.id || SELF_ID;
  const me = baseProfile(uid, user);
  const mine = allCachuelos().filter(c => c.userId === uid);
  const offersSent = myOffers(uid);
  const [tab, setTab] = useState(() => (focusId || (mine.length && !offersSent.length) ? 'publique' : offersSent.length ? 'postule' : 'publique'));
  const [open, setOpen] = useState(() => (focusId ? { [focusId]: true } : {}));
  const [pay, setPay] = useState(null);          // { c, o, w }
  const [rating, setRating] = useState(null);    // { job, toId, rol, name }
  const [prompt, setPrompt] = useState(null);    // { jobId, rol }
  const [editor, setEditor] = useState(null);    // { jobId, rol }
  const [busy, setBusy] = useState(null);
  const [payments, setPayments] = useState({});

  // estado de pagos (para mostrar retenido/liberado)
  const ids = [...mine.map(c => c.status.offerId), ...offersSent.map(o => o.id)].filter(Boolean).join(',');
  useEffect(() => {
    let alive = true;
    (async () => {
      const out = {};
      for (const id of ids.split(',').filter(Boolean)) out[id] = await getPaymentForPostulacion(id);
      if (alive) setPayments(out);
    })();
    return () => { alive = false; };
  }, [ids, busy]);

  const publique = mine.filter(c => c.status.estado !== 'completado' || !hasReviewed(c.status.jobId, uid));
  const postule = offersSent.filter(o => {
    const st = o.cachuelo.status;
    if (o.estado !== 'aceptada') return st.estado === 'abierto' || o.estado === 'rechazada';
    return st.estado !== 'completado' || !hasReviewed(st.jobId, uid);
  });
  const history = [...jobsAs(uid, 'trabajador').map(j => ({ j, rol: 'trabajador' })), ...jobsAs(uid, 'contratante').map(j => ({ j, rol: 'contratante' }))]
    .filter(x => x.j.estado === 'completado').sort((a, b) => b.j.completedAt.localeCompare(a.j.completedAt));

  const run = async (key, fn) => { setBusy(key); try { await fn(); } catch (e) { toast(e.message || 'Algo falló', 'error'); } setBusy(null); };

  // ── Contratante ──
  const onAccept = (c, o, w) => setPay({ c, o, w });
  const confirmAndRelease = (c) => run(`conf-${c.id}`, async () => {
    const st = c.status;
    if (st.paymentId && st.modo === 'protegido') await releasePayment(st.paymentId);
    const job = completeCachuelo(c.id);
    haptic(30);
    toast(st.modo === 'protegido' ? `Liberamos ${formatPEN(st.monto)} a ${baseProfile(st.workerId, user).nombre}` : 'Cachuelo completado', 'success');
    setRating({ job, toId: st.workerId, rol: 'trabajador', name: baseProfile(st.workerId, user).fullName });
  });
  // ── Trabajador ──
  const simulateHire = (o) => run(`hire-${o.id}`, async () => {
    const c = o.cachuelo; const amounts = breakdown(o.monto, 'protegido');
    const payment = await createPayment({
      modo: 'protegido', metodo: 'plin', source: {}, amounts: { price: amounts.price, fee: amounts.fee, total: amounts.chargedNow },
      postulacion_id: o.id, cachuelo_id: c.id, cachuelo_titulo: c.title, pagador_id: c.userId, receptor_id: uid, receptor_nombre: me.fullName,
    });
    acceptOffer(c.id, o.id, payment);
    haptic(30); toast(`¡${c.publisher.name} aceptó tu oferta! ${formatPEN(o.monto)} quedan protegidos para ti.`, 'success');
  });
  const simulateOwnerConfirms = (o) => run(`oc-${o.id}`, async () => {
    const c = o.cachuelo; const st = c.status;
    if (st.paymentId) await releasePayment(st.paymentId);
    const job = completeCachuelo(c.id);
    toast(`${c.publisher.name} confirmó. ${formatPEN(st.monto)} ya están en tus cobros.`, 'success');
    setRating({ job, toId: c.userId, rol: 'contratante', name: c.publisher.name });
  });

  const submitRating = async ({ estrellas, comentario, tags }) => {
    const { job, toId, rol } = rating;
    addReview({ jobId: job.id, fromId: uid, toId, rol, estrellas, comentario, tags });
    setRating(null);
    const back = simulateCounterReview(job.id, rol === 'trabajador' ? 'contratante' : 'trabajador');
    toast(back ? `${baseProfile(back.fromId, user).nombre} también te calificó: ${'★'.repeat(back.estrellas)}` : 'Reseña publicada', 'success');
    const myRol = rol === 'trabajador' ? 'contratante' : 'trabajador';
    if (!portfolioOf(uid).some(p => p.jobId === job.id && p.rol === myRol)) setPrompt({ jobId: job.id, rol: myRol });
  };

  const segBtn = (id, label, n, Icon) => (
    <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id} style={{ flex: 1, minHeight: 38, borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: tab === id ? '#fff' : 'transparent', color: tab === id ? C.headerBg : 'rgba(255,255,255,0.88)', boxShadow: tab === id ? '0 4px 12px -6px rgba(0,0,0,0.4)' : 'none' }}>
      <Icon size={14} /> {label}{n ? ` · ${n}` : ''}
    </button>
  );

  return (
    <Screen withTabs activeTab="mycachuelos" onNavigate={onNavigate}>
      <div className="lg-header" style={{ padding: '44px 18px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 19, fontWeight: 900 }}>Mis cachuelos</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Publicas y postulas con la misma cuenta</div>
          </div>
          <button onClick={() => onNavigate('wallet')} aria-label="Mis cobros y pagos" style={{ height: 36, padding: '0 12px', borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}><Wallet size={15} /> Cobros</button>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.16)', borderRadius: 14, padding: 4 }}>
          {segBtn('publique', 'Publiqué', publique.length, Megaphone)}
          {segBtn('postule', 'Postulé', postule.length, Hammer)}
          {segBtn('historial', 'Historial', history.length, Star)}
        </div>
      </div>

      <div style={{ padding: '14px 16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, color: C.purple, background: 'rgba(139,92,246,0.10)', borderRadius: 12, padding: '7px 10px', marginBottom: 12 }}>
          <Sparkles size={13} /> SIMULACIÓN · Estás como {me.fullName}. Los botones morados simulan lo que haría la otra persona.
        </div>

        {/* ── PUBLIQUÉ (contratante) ── */}
        {tab === 'publique' && (
          publique.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: C.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📢</div>
              <div style={{ fontWeight: 800, color: C.text }}>No tienes cachuelos publicados activos</div>
              <div style={{ fontSize: 12.5, margin: '4px 0 14px' }}>Publica uno gratis y simula las ofertas que te llegarían.</div>
              <Btn onClick={() => onNavigate('publish')} style={{ margin: '0 auto' }}>Publicar cachuelo</Btn>
            </div>
          ) : publique.map(c => {
            const st = c.status; const offers = offersFor(c.id);
            const rated = st.jobId && hasReviewed(st.jobId, uid);
            const w = st.workerId ? baseProfile(st.workerId, user) : null;
            const p = st.offerId ? payments[st.offerId] : null;
            const label = { abierto: `${offers.length} oferta${offers.length !== 1 ? 's' : ''}`, asignado: 'Asignado', por_confirmar: 'Por confirmar', completado: 'Por calificar' }[st.estado];
            const color = { abierto: C.headerBg, asignado: C.purple, por_confirmar: C.warning, completado: C.success }[st.estado];
            return (
              <Panel key={c.id}>
                <button onClick={() => onViewCachuelo(c)} style={{ border: 'none', background: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}><Head c={c} label={label} color={color} /></button>
                <Stepper idx={stepOf(st.estado, rated)} />
                {st.estado === 'abierto' && (
                  <>
                    {offers.length === 0 ? (
                      <>
                        <Note>Aún no hay ofertas. En la vida real llegan notificaciones; aquí puedes simularlas.</Note>
                        <SimBtn disabled={busy === `so-${c.id}`} onClick={() => run(`so-${c.id}`, async () => { const n = simulateOffers(c.id); setOpen(o => ({ ...o, [c.id]: true })); toast(n ? `Llegaron ${n} ofertas` : 'No hay trabajadores para esta categoría', n ? 'success' : 'info'); })}>Simular ofertas de trabajadores</SimBtn>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setOpen(o => ({ ...o, [c.id]: !o[c.id] }))} aria-expanded={!!open[c.id]} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'var(--c-card-el)', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', fontWeight: 800, fontSize: 13, color: C.text, fontFamily: 'inherit' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={15} color={C.headerBg} /> Ver {offers.length} oferta{offers.length !== 1 ? 's' : ''}</span>
                          {open[c.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {open[c.id] && offers.map(o => <OfferCard key={o.id} o={o} price={c.price} selfUser={user} onViewProfile={onViewProfile} onAccept={(oo, ww) => onAccept(c, oo, ww)} />)}
                      </>
                    )}
                  </>
                )}
                {(st.estado === 'asignado' || st.estado === 'por_confirmar') && w && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <Avatar initials={w.initials} size={36} bg={w.color} fontSize={12} />
                      <div style={{ flex: 1, fontSize: 12.5, color: C.textSec }}>Lo hará <button onClick={() => onViewProfile(st.workerId)} style={{ border: 'none', background: 'none', padding: 0, color: C.primary, fontWeight: 800, cursor: 'pointer', fontSize: 12.5 }}>{w.fullName}</button><br />{st.modo === 'protegido' ? <span><ShieldCheck size={12} color={C.success} style={{ verticalAlign: -2 }} /> {formatPEN(st.monto)} retenidos en Pago Protegido{p?.estado === 'en_disputa' ? ' · en revisión' : ''}</span> : <span>🤝 Pago directo acordado ({formatPEN(st.monto)})</span>}</div>
                    </div>
                    {st.estado === 'por_confirmar'
                      ? <Note tone="warn"><b>{w.nombre} marcó el trabajo como terminado</b> {ago(st.doneAt)}. Revisa y confirma. Si no respondes ni reclamas en 72 h, el pago se libera solo.</Note>
                      : <SimBtn disabled={!!busy} onClick={() => { markWorkDone(c.id); toast(`${w.nombre} marcó el trabajo como terminado`, 'info'); }}>Simular: {w.nombre} terminó el trabajo</SimBtn>}
                    <Btn disabled={busy === `conf-${c.id}`} onClick={() => confirmAndRelease(c)} style={{ width: '100%', marginBottom: 8 }}>{busy === `conf-${c.id}` ? 'Procesando…' : st.modo === 'protegido' ? 'Confirmar y liberar pago' : 'Confirmar que terminó'}</Btn>
                    {st.modo === 'protegido' && p?.estado !== 'en_disputa' && (
                      <button onClick={() => run(`dis-${c.id}`, async () => { await disputePayment(st.paymentId, 'Simulación: el trabajo no se completó como se acordó'); toast('Reporte enviado. Operaciones revisará el caso; el dinero sigue retenido.', 'info'); })} style={{ display: 'flex', alignItems: 'center', gap: 5, margin: '0 auto', border: 'none', background: 'none', color: C.textMuted, fontSize: 12, cursor: 'pointer' }}><Flag size={12} /> Reportar un problema</button>
                    )}
                  </>
                )}
                {st.estado === 'completado' && !rated && (
                  <Btn onClick={() => setRating({ job: getJob(st.jobId), toId: st.workerId, rol: 'trabajador', name: w?.fullName })} style={{ width: '100%' }}><Star size={16} /> Calificar a {w?.nombre}</Btn>
                )}
              </Panel>
            );
          })
        )}

        {/* ── POSTULÉ (trabajador) ── */}
        {tab === 'postule' && (
          postule.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: C.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🛠️</div>
              <div style={{ fontWeight: 800, color: C.text }}>No tienes ofertas activas</div>
              <div style={{ fontSize: 12.5, margin: '4px 0 14px' }}>Entra a un cachuelo del Inicio o del Mapa y envía tu oferta.</div>
              <Btn onClick={() => onNavigate('home')} style={{ margin: '0 auto' }}>Buscar cachuelos</Btn>
            </div>
          ) : postule.map(o => {
            const c = o.cachuelo; const st = c.status; const mineAccepted = o.estado === 'aceptada';
            const rated = st.jobId && hasReviewed(st.jobId, uid);
            const p = payments[o.id];
            const label = o.estado === 'rechazada' ? 'No elegida' : !mineAccepted ? 'Esperando' : { asignado: '¡Te eligieron!', por_confirmar: 'Por confirmar', completado: 'Por calificar' }[st.estado];
            const color = o.estado === 'rechazada' ? '#9CA3AF' : !mineAccepted ? C.headerBg : st.estado === 'completado' ? C.success : C.purple;
            const idx = o.estado === 'rechazada' ? 0 : !mineAccepted ? 0 : stepOf(st.estado, rated);
            return (
              <Panel key={o.id}>
                <button onClick={() => onViewCachuelo(c)} style={{ border: 'none', background: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}><Head c={{ ...c, status: { monto: o.monto } }} label={label} color={color} /></button>
                <div style={{ fontSize: 12, color: C.textSec, marginTop: 8 }}>
                  Contratante: <button onClick={() => onViewProfile(c.userId)} style={{ border: 'none', background: 'none', padding: 0, color: C.primary, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>{c.publisher.name}</button>
                  {c.publisher.rating > 0 && <> · <Stars rating={c.publisher.rating} size={11} /></>} · tu oferta {ago(o.createdAt)}
                </div>
                {o.estado !== 'rechazada' && <Stepper idx={idx} />}
                {o.estado === 'rechazada' && <Note>Esta vez eligieron a otra persona. Sigue postulando: tu calificación y tu portafolio te ayudan a destacar.</Note>}
                {o.estado === 'pendiente' && st.estado === 'abierto' && (
                  <>
                    <Note>Ofreciste <b>{formatPEN(o.monto)}</b>. Te avisaremos cuando {c.publisher.name} responda.</Note>
                    <SimBtn disabled={busy === `hire-${o.id}`} onClick={() => simulateHire(o)}>{busy === `hire-${o.id}` ? 'Procesando pago…' : `Simular: ${c.publisher.name.split(' ')[0]} acepta y paga`}</SimBtn>
                  </>
                )}
                {mineAccepted && st.estado === 'asignado' && (
                  <>
                    <Note tone="ok"><ShieldCheck size={13} style={{ verticalAlign: -2 }} /> <b>{formatPEN(st.monto)} protegidos para ti</b>. El contratante ya pagó; recibes el 100 % cuando confirme que terminaste.</Note>
                    <Btn onClick={() => { markWorkDone(c.id); toast('Le avisamos al contratante que terminaste', 'success'); }} style={{ width: '100%' }}>Marcar trabajo como terminado</Btn>
                  </>
                )}
                {mineAccepted && st.estado === 'por_confirmar' && (
                  <>
                    <Note tone="warn">Esperando que {c.publisher.name} confirme. Si no responde en 72 h, el pago se libera automáticamente.</Note>
                    <SimBtn disabled={busy === `oc-${o.id}`} onClick={() => simulateOwnerConfirms(o)}>Simular: {c.publisher.name.split(' ')[0]} confirma y libera el pago</SimBtn>
                  </>
                )}
                {mineAccepted && st.estado === 'completado' && !rated && (
                  <Btn onClick={() => setRating({ job: getJob(st.jobId), toId: c.userId, rol: 'contratante', name: c.publisher.name })} style={{ width: '100%' }}><Star size={16} /> Calificar a {c.publisher.name.split(' ')[0]}</Btn>
                )}
                {p?.estado === 'liberado' && <div style={{ fontSize: 11.5, color: C.success, fontWeight: 800, marginTop: 8 }}>✅ {formatPEN(p.monto_servicio)} liberados a tu cuenta · <button onClick={() => onNavigate('wallet')} style={{ border: 'none', background: 'none', color: C.primary, fontWeight: 800, cursor: 'pointer', padding: 0, fontSize: 11.5 }}>Ver cobros</button></div>}
              </Panel>
            );
          })
        )}

        {/* ── HISTORIAL (ambos roles) ── */}
        {tab === 'historial' && (
          history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: C.textMuted, fontSize: 13 }}>Aquí verás los cachuelos que completaste como trabajador y como contratante.</div>
          ) : history.map(({ j, rol }) => {
            const otherId = rol === 'trabajador' ? j.ownerId : j.workerId;
            const other = baseProfile(otherId, user);
            const got = reviewsFor(uid, rol).find(r => r.jobId === j.id);
            const hasPhotos = portfolioOf(uid).some(pf => pf.jobId === j.id && pf.rol === rol);
            return (
              <Panel key={`${j.id}-${rol}`}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <CategoryIcon label={j.category} size={38} iconSize={18} radius={11} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 900, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</div>
                    <div style={{ fontSize: 11.5, color: C.textMuted }}>
                      <span style={{ fontWeight: 800, color: rol === 'trabajador' ? '#2563EB' : '#8B5CF6' }}>{rol === 'trabajador' ? 'Lo hice' : 'Lo contraté'}</span>
                      {' · '}<button onClick={() => onViewProfile(otherId)} style={{ border: 'none', background: 'none', padding: 0, color: C.primary, fontWeight: 700, fontSize: 11.5, cursor: 'pointer' }}>{other.fullName}</button> · {ago(j.completedAt)}
                    </div>
                  </div>
                  <span className="lg-num" style={{ fontWeight: 900, color: C.text }}>S/{j.price}</span>
                </div>
                {got && <div style={{ fontSize: 12, color: C.textSec, marginTop: 8 }}>Te calificó: <span style={{ color: C.warning }}>{'★'.repeat(got.estrellas)}</span> “{got.comentario}”</div>}
                {!hasPhotos && <button onClick={() => setEditor({ jobId: j.id, rol })} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, border: `1.5px dashed ${C.border}`, background: 'none', color: C.primary, fontWeight: 800, fontSize: 12.5, padding: '8px 12px', borderRadius: 12, cursor: 'pointer' }}><Camera size={14} /> Agregar fotos a mi perfil</button>}
              </Panel>
            );
          })
        )}
      </div>

      <PaymentSheet open={!!pay} onClose={() => setPay(null)} cachuelo={pay ? { ...pay.c, price: pay.o.monto } : null}
        payee={pay ? { id: pay.o.workerId, nombre: pay.w.name } : null} payer={{ id: uid, email: user?.email }} postulacionId={pay?.o.id} doneLabel="Listo"
        onPaid={(payment) => { acceptOffer(pay.c.id, pay.o.id, payment); setPay(null); setBusy(null); }} />
      <RatingSheet open={!!rating} onClose={() => setRating(null)} onSubmit={submitRating} targetName={rating?.name} rol={rating?.rol} jobTitle={rating?.job?.title} />
      <Sheet open={!!prompt} onClose={() => setPrompt(null)} title="¿Agregas fotos a tu perfil?" subtitle="Las experiencias con fotos generan más confianza" z={725}>
        <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.55, marginBottom: 14 }}>
          {prompt?.rol === 'trabajador' ? 'Sube fotos del trabajo que hiciste y describe el servicio. Aparecerán en tu portafolio como “Cachuelo verificado”.' : 'Muestra el resultado de lo que contrataste. Ayuda a otros a conocer a quién contratar y suma a tu perfil de contratante.'}
        </div>
        <Btn onClick={() => { setEditor(prompt); setPrompt(null); }} style={{ width: '100%', marginBottom: 8 }}><Camera size={16} /> Agregar fotos</Btn>
        <Btn variant="ghost" onClick={() => setPrompt(null)} style={{ width: '100%' }}>Ahora no</Btn>
      </Sheet>
      <PortfolioEditor open={!!editor} onClose={() => setEditor(null)} userId={uid} preset={editor} />
    </Screen>
  );
}
