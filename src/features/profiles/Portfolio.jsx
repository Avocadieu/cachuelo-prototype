// ─── PORTAFOLIO: fotos de cachuelos realizados o contratados ────────────────
// • "Verificado": la experiencia está ligada a un cachuelo COMPLETADO en la app.
// • "Experiencia externa": trabajos hechos fuera de Cachuelo (no verificados).
// En demo las fotos se guardan reducidas en este navegador. En producción irán
// al bucket `portafolio` de Supabase (ver migración v0.18).
import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X, BadgeCheck, Trash2, Hammer, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { Btn, Stars } from '../../ui/primitives.jsx';
import Sheet from '../../ui/Sheet.jsx';
import { toast } from '../../ui/toast.jsx';
import { shrinkImage } from '../verification/verificationStore.js';
import { CatChip, CategorySheet } from '../catalog/CategoryPicker.jsx';
import { addPortfolioItem, jobsAs, portfolioOf, baseProfile, getJob, allReviews } from '../demo/demoWorld.js';

const MAX_PHOTOS = 6;
const toDataUrl = (blob) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
export const ROL_LABEL = { trabajador: { verb: 'Realizó', mine: 'Lo hice yo', Icon: Hammer, color: '#2563EB' }, contratante: { verb: 'Contrató', mine: 'Lo contraté', Icon: Megaphone, color: '#8B5CF6' } };

/** Cuadrícula de experiencias. */
export function PortfolioGrid({ items, onOpen, emptyText }) {
  const { C } = useTheme();
  if (!items.length) return <div style={{ fontSize: 13, color: C.textMuted, padding: '6px 2px 2px' }}>{emptyText}</div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {items.map(p => (
        <button key={p.id} onClick={() => onOpen(p)} aria-label={`Ver experiencia: ${p.titulo}`}
          style={{ border: '1px solid var(--lg-stroke)', borderRadius: 16, padding: 0, overflow: 'hidden', background: C.card, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
          <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--c-card-el)' }}>
            {p.photos[0] && <img src={p.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            {p.photos.length > 1 && <span style={{ position: 'absolute', right: 6, top: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>{p.photos.length} fotos</span>}
            <span style={{ position: 'absolute', left: 6, top: 6, background: ROL_LABEL[p.rol].color, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>{ROL_LABEL[p.rol].verb}</span>
          </div>
          <div style={{ padding: '8px 10px 10px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.text, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.titulo}</div>
            <div style={{ fontSize: 10.5, color: p.verified ? C.success : C.textMuted, fontWeight: 700, marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
              {p.verified ? <><BadgeCheck size={11} /> Cachuelo verificado</> : 'Experiencia externa'}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

/** Detalle de una experiencia (galería + descripción + reseña ligada). */
export function PortfolioViewer({ item, onClose, onDelete, selfUser }) {
  const { C } = useTheme();
  const [i, setI] = useState(0);
  const scroller = useRef(null);
  useEffect(() => setI(0), [item?.id]);
  if (!item) return null;
  const job = item.jobId ? getJob(item.jobId) : null;
  const otherId = job ? (item.rol === 'trabajador' ? job.ownerId : job.workerId) : null;
  const other = otherId ? baseProfile(otherId, selfUser) : null;
  // reseña que la otra parte le dejó a esta persona por ese cachuelo
  const review = job ? allReviews().find(r => r.jobId === job.id && r.toId === item.userId) : null;
  const go = (d) => { const n = Math.max(0, Math.min(item.photos.length - 1, i + d)); setI(n); scroller.current?.scrollTo({ left: n * scroller.current.clientWidth, behavior: 'smooth' }); };
  const R = ROL_LABEL[item.rol];
  return (
    <Sheet open onClose={onClose} title={item.titulo} subtitle={`${R.verb} · ${item.category}`} z={740} maxHeight="92%">
      <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 12 }}>
        <div ref={scroller} onScroll={e => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
          {item.photos.map((src, k) => (
            <img key={k} src={src} alt={`Foto ${k + 1} de ${item.photos.length}`} style={{ flex: '0 0 100%', width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', scrollSnapAlign: 'center' }} />
          ))}
        </div>
        {item.photos.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Foto anterior" disabled={i === 0} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: 17, border: 'none', background: 'rgba(0,0,0,0.45)', opacity: i === 0 ? 0.3 : 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18} color="#fff" /></button>
            <button onClick={() => go(1)} aria-label="Foto siguiente" disabled={i === item.photos.length - 1} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: 17, border: 'none', background: 'rgba(0,0,0,0.45)', opacity: i === item.photos.length - 1 ? 0.3 : 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={18} color="#fff" /></button>
            <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
              {item.photos.map((_, k) => <span key={k} style={{ width: k === i ? 16 : 6, height: 6, borderRadius: 3, background: '#fff', opacity: k === i ? 1 : 0.6, transition: 'all .2s' }} />)}
            </div>
          </>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontSize: 11.5, fontWeight: 800, color: '#fff', background: R.color, padding: '4px 9px', borderRadius: 12 }}>{R.verb}</span>
        {item.verified
          ? <span style={{ fontSize: 11.5, fontWeight: 800, color: C.success, background: C.successSoft, padding: '4px 9px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}><BadgeCheck size={12} /> Cachuelo verificado</span>
          : <span style={{ fontSize: 11.5, fontWeight: 800, color: C.textMuted, background: 'var(--c-card-el)', padding: '4px 9px', borderRadius: 12 }}>Experiencia externa · no verificada</span>}
      </div>
      <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, margin: '0 0 12px' }}>{item.descripcion}</p>
      {job && (
        <div style={{ background: 'var(--c-card-el)', borderRadius: 14, padding: '10px 12px', fontSize: 12.5, color: C.textSec, marginBottom: 12, lineHeight: 1.55 }}>
          <div><b style={{ color: C.text }}>Cachuelo:</b> {job.title}</div>
          <div><b style={{ color: C.text }}>{item.rol === 'trabajador' ? 'Contratado por' : 'Realizado por'}:</b> {other?.fullName}</div>
          <div><b style={{ color: C.text }}>Fecha:</b> {new Date(job.completedAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}{job.district ? ` · ${job.district}` : ''}</div>
        </div>
      )}
      {review && (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: '10px 12px', marginBottom: 12 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: C.textMuted, marginBottom: 4 }}>RESEÑA DE {other?.fullName?.toUpperCase()}</div>
          <Stars rating={review.estrellas} size={13} />
          <div style={{ fontSize: 13, color: C.text, marginTop: 4, lineHeight: 1.5 }}>“{review.comentario}”</div>
        </div>
      )}
      {onDelete && <Btn variant="ghost" onClick={() => { onDelete(item); onClose(); }} style={{ width: '100%', color: C.danger }}><Trash2 size={16} /> Quitar de mi perfil</Btn>}
    </Sheet>
  );
}

/** Formulario para agregar una experiencia con fotos. preset: { jobId, rol } */
export function PortfolioEditor({ open, onClose, userId, preset, onSaved }) {
  const { C } = useTheme();
  const asWorker = jobsAs(userId, 'trabajador').filter(j => j.estado === 'completado');
  const asClient = jobsAs(userId, 'contratante').filter(j => j.estado === 'completado');
  const used = new Set(portfolioOf(userId).map(p => `${p.jobId}-${p.rol}`));
  const options = [...asWorker.map(j => ({ j, rol: 'trabajador' })), ...asClient.map(j => ({ j, rol: 'contratante' }))].filter(o => !used.has(`${o.j.id}-${o.rol}`));
  const [sel, setSel] = useState(null);           // { j, rol } | 'externa'
  const [titulo, setTitulo] = useState('');
  const [category, setCategory] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [photos, setPhotos] = useState([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const pre = preset?.jobId ? options.find(o => o.j.id === preset.jobId && o.rol === preset.rol) : null;
    setSel(pre || null); setTitulo(''); setCategory(''); setDesc(''); setPhotos([]);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const addFiles = async (files) => {
    const list = [...files].slice(0, MAX_PHOTOS - photos.length);
    if (!list.length) return;
    setBusy(true);
    try {
      const out = [];
      for (const f of list) { const b = await shrinkImage(f, 900, 0.74); if (b) out.push(await toDataUrl(b)); }
      setPhotos(p => [...p, ...out]);
    } catch (e) { toast(e.message, 'error'); }
    setBusy(false);
  };

  const isExt = sel === 'externa';
  const ok = sel && photos.length > 0 && desc.trim().length >= 20 && (!isExt || (titulo.trim().length >= 4 && category));
  const save = () => {
    try {
      addPortfolioItem({
        userId, rol: isExt ? 'trabajador' : sel.rol, jobId: isExt ? null : sel.j.id,
        titulo: isExt ? titulo : sel.j.title, category: isExt ? category : sel.j.category, descripcion: desc, photos,
      });
      toast('Experiencia agregada a tu perfil', 'success'); onSaved?.(); onClose();
    } catch (e) { toast(e.message, 'error'); }
  };

  const optBtn = (active) => ({ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, marginBottom: 7, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? C.primary : C.border}`, background: active ? C.primary + '12' : C.card });

  return (
    <Sheet open={open} onClose={onClose} title="Agregar experiencia" subtitle="Fotos de un cachuelo que hiciste o contrataste" z={730} maxHeight="94%"
      footer={<Btn onClick={save} disabled={!ok || busy} style={{ width: '100%' }}>Publicar en mi perfil</Btn>}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.textSec, marginBottom: 8 }}>1. ¿De qué cachuelo es?</div>
      {options.length === 0 && <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 8 }}>Aún no tienes cachuelos completados sin fotos. Completa uno en el Simulador o agrega una experiencia externa.</div>}
      {options.map(o => {
        const active = sel !== 'externa' && sel?.j.id === o.j.id && sel?.rol === o.rol;
        const R = ROL_LABEL[o.rol];
        return (
          <button key={`${o.j.id}-${o.rol}`} onClick={() => setSel(o)} aria-pressed={active} style={optBtn(active)}>
            <span style={{ width: 30, height: 30, borderRadius: 10, background: R.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><R.Icon size={15} color="#fff" /></span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.j.title}</span>
              <span style={{ display: 'block', fontSize: 11.5, color: C.textMuted }}>{R.mine} · {new Date(o.j.completedAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} · verificado</span>
            </span>
          </button>
        );
      })}
      <button onClick={() => setSel('externa')} aria-pressed={isExt} style={optBtn(isExt)}>
        <span style={{ width: 30, height: 30, borderRadius: 10, background: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ImagePlus size={15} color="#fff" /></span>
        <span><span style={{ display: 'block', fontSize: 13, fontWeight: 800, color: C.text }}>Experiencia externa</span><span style={{ display: 'block', fontSize: 11.5, color: C.textMuted }}>Trabajo hecho fuera de Cachuelo (se mostrará como no verificado)</span></span>
      </button>
      {isExt && (
        <div style={{ marginTop: 6 }}>
          <input value={titulo} onChange={e => setTitulo(e.target.value.slice(0, 80))} placeholder="Título. Ej: Instalé una cocina de melamina" aria-label="Título de la experiencia"
            style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '12px 14px', fontSize: 16, color: C.text, background: C.card, fontFamily: 'inherit', outline: 'none', marginBottom: 8 }} />
          {category ? <CatChip label={category} active onPress={() => setCatOpen(true)} /> : <button onClick={() => setCatOpen(true)} style={{ border: `1.5px dashed ${C.border}`, background: 'none', color: C.primary, fontWeight: 800, fontSize: 12.5, padding: '9px 12px', borderRadius: 14, cursor: 'pointer' }}>Elegir categoría</button>}
          <CategorySheet open={catOpen} onClose={() => setCatOpen(false)} selected={category} onSelect={setCategory} />
        </div>
      )}

      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.textSec, margin: '16px 0 8px' }}>2. Fotos ({photos.length}/{MAX_PHOTOS})</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {photos.map((src, k) => (
          <div key={k} style={{ position: 'relative', aspectRatio: '1', borderRadius: 12, overflow: 'hidden' }}>
            <img src={src} alt={`Foto ${k + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => setPhotos(p => p.filter((_, x) => x !== k))} aria-label={`Quitar foto ${k + 1}`} style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, border: 'none', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={13} color="#fff" /></button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button onClick={() => fileRef.current?.click()} disabled={busy} aria-label="Agregar fotos"
            style={{ aspectRatio: '1', borderRadius: 12, border: `1.5px dashed ${C.border}`, background: 'var(--c-card-el)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: C.primary, fontWeight: 800, fontSize: 11.5 }}>
            <ImagePlus size={22} /> {busy ? 'Procesando…' : 'Agregar'}
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => { addFiles(e.target.files || []); e.target.value = ''; }} data-testid="portfolio-file" />

      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.textSec, margin: '16px 0 8px' }}>3. Describe el servicio</div>
      <textarea value={desc} onChange={e => setDesc(e.target.value.slice(0, 400))} rows={3} aria-label="Descripción del servicio"
        placeholder={sel && sel !== 'externa' && sel.rol === 'contratante' ? 'Ej: Contraté a Luis para instalar la terma. Llegó puntual y dejó todo funcionando.' : 'Ej: Instalé una terma de 80 L con llave independiente. Tomó 3 horas.'}
        style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '12px 14px', fontSize: 16, color: C.text, background: C.card, resize: 'none', fontFamily: 'inherit', outline: 'none' }} />
      <div style={{ fontSize: 11.5, color: desc.trim().length && desc.trim().length < 20 ? C.danger : C.textMuted, marginTop: 4 }}>{desc.trim().length}/400 · mínimo 20 caracteres</div>
      <div style={{ fontSize: 11.5, color: C.textMuted, background: C.infoSoft, borderRadius: 12, padding: '9px 11px', marginTop: 10, lineHeight: 1.5 }}>
        🔒 No subas fotos donde se vean rostros de otras personas sin su permiso, direcciones, placas de autos ni documentos (Ley 29733 de Protección de Datos Personales).
      </div>
    </Sheet>
  );
}
