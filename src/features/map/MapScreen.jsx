// ─── MAPA DE CACHUELOS (PERÚ) ────────────────────────────────────────────────
// · Pines tipo "alerta" con precio + ícono de categoría (destacados laten).
// · Agrupación (clusters) para que Perú completo no sea una nube de puntos.
// · Tarjeta de vidrio con el detalle al tocar un pin → "Ver detalle y postular".
// · Filtros por categoría / destacados / texto y "Cerca de mí".
// · Sin API key → modo "Explorar por zona" (lista agrupada), la app no se rompe.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Map, AdvancedMarker, Circle, useMap, useMapsLibrary, useApiLoadingStatus, APILoadingStatus,
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  Search, X, LocateFixed, Maximize2, List, MapPin, Clock, Calendar, ChevronRight,
  Share2, CheckCircle, Info, ChevronDown, Wallet, ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { TabBar, Avatar, Stars, Btn, CategoryIcon } from '../../ui/primitives.jsx';
import { CATEGORIES, getCategory } from '../../data/categories.js';
import {
  resolveCoords, distanceKm, formatDistance, zoneRadius, PERU_BOUNDS, LIMA_CENTER,
} from '../../data/geo.js';
import { hasMapsKey, MAP_ID, MAP_RESTRICTION, MAP_MIN_ZOOM } from './mapConfig.js';
import { useGeolocation } from './useGeolocation.js';

// Recordamos la vista entre navegaciones (volver del detalle no "resetea" el mapa)
const lastView = { center: null, zoom: null, selectedId: null, cat: null, featured: false };

const STATUS_TOP = 48; // espacio para la barra de estado

// ── Helpers ───────────────────────────────────────────────────────────────────
const matchesQuery = (c, q) => {
  if (!q) return true;
  const n = q.trim().toLowerCase();
  return [c.title, c.category, c.location, c.departamento].some(v => (v || '').toLowerCase().includes(n));
};

const fechaLabel = (c) => {
  if (c.fecha_inicio === 'flexible') return 'A coordinar';
  if (c.fecha_inicio) {
    return new Date(c.fecha_inicio + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  return c.schedule || '';
};

const placeLabel = (c) => {
  const d = c.district || (c.location || '').split(',')[0];
  return c.departamento && c.departamento !== 'Lima' ? `${d}, ${c.departamento}` : d;
};

// Calcula un centro desplazado para que el pin quede visible sobre la tarjeta
const offsetCenter = (map, pos, offsetY) => {
  try {
    const proj = map.getProjection();
    const zoom = map.getZoom();
    if (!proj || zoom == null) return pos;
    const scale = 2 ** zoom;
    const p = proj.fromLatLngToPoint(new window.google.maps.LatLng(pos));
    const target = new window.google.maps.Point(p.x, p.y + offsetY / scale);
    const ll = proj.fromPointToLatLng(target);
    return { lat: ll.lat(), lng: ll.lng() };
  } catch { return pos; }
};

// ── Pin (contenido HTML del AdvancedMarker) ──────────────────────────────────
const CachueloPin = ({ c, selected }) => {
  const cat = getCategory(c.category);
  return (
    <div className={`lg-pin lg-pin--zone ${c.featured ? 'lg-pin--alert' : ''}`} data-selected={selected ? 'true' : 'false'}>
      <div className="lg-pin__body">
        <span className="lg-pin__icon" style={{ background: `linear-gradient(145deg, ${cat.iconBgB}, ${cat.iconBgA})` }}>
          <cat.Icon size={14} color="#fff" strokeWidth={2.4} />
        </span>
        <span className="lg-num">S/{c.price}</span>
      </div>
      {c.featured && <span className="lg-pin__flag" aria-label="Destacado">★</span>}
    </div>
  );
};

// Componente propio para que el ref sea estable (useCallback). Un ref inline
// re-registraría el marcador en cada render y entraría en bucle con el clusterer.
const PinMarker = ({ point, selected, setMarkerRef, onSelect }) => {
  const { c, pos } = point;
  const ref = useCallback((m) => setMarkerRef(m, c.id), [setMarkerRef, c.id]);
  return (
    <AdvancedMarker
      ref={ref}
      position={pos}
      title={`${c.title} · S/${c.price}`}
      zIndex={selected ? 5000 : c.featured ? 500 : 1}
      anchorLeft="-50%"
      anchorTop="-50%"
      onClick={() => onSelect(point)}
    >
      <CachueloPin c={c} selected={selected} />
    </AdvancedMarker>
  );
};

// Círculo de zona aproximada (se ve desde zoom 12; antes solo el chip/cluster)
const ZoneCircle = ({ point, selected, onSelect }) => (
  <Circle
    center={point.pos}
    radius={zoneRadius(point.approx)}
    strokeColor={selected ? '#0D1B3E' : '#FF6B35'}
    strokeOpacity={selected ? 0.9 : 0.55}
    strokeWeight={selected ? 2.5 : 1.5}
    fillColor="#FF6B35"
    fillOpacity={selected ? 0.22 : 0.12}
    clickable
    onClick={() => onSelect(point)}
  />
);

// ── Fila compacta (lista y modo sin mapa) ────────────────────────────────────
const MiniRow = ({ c, distance, onPress }) => {
  const { C } = useTheme();
  return (
    <button onClick={onPress} style={{
      width: '100%', display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
      padding: '12px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
      background: C.card, boxShadow: 'inset 0 0 0 1px var(--c-bord)', marginBottom: 8,
    }}>
      <CategoryIcon label={c.category} size={40} iconSize={19} radius={12} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.featured && <span style={{ color: C.warning }}>★ </span>}{c.title}
        </div>
        <div style={{ fontSize: 12, color: C.textSec, marginTop: 2, display: 'flex', gap: 8 }}>
          <span>{placeLabel(c)}</span>
          {distance != null && <span>· {formatDistance(distance)}</span>}
        </div>
      </div>
      <div className="lg-num" style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>S/{c.price}</div>
    </button>
  );
};

// ── Tarjeta de detalle (pin seleccionado) ────────────────────────────────────
const PinCard = ({ c, pos, approx, userPos, onClose, onView }) => {
  const { C } = useTheme();
  const dist = userPos ? distanceKm(userPos, pos) : null;
  const fecha = fechaLabel(c);

  const share = async () => {
    const text = `🛠 ${c.title}\n📍 ${placeLabel(c)} | 💰 S/${c.price}\n\nPostúlate en Cachuelo 👇`;
    if (navigator.share) { try { await navigator.share({ title: c.title, text, url: 'https://cachuelo.pe' }); } catch { /* cancelado */ } }
    else window.open(`https://wa.me/?text=${encodeURIComponent(text + '\nhttps://cachuelo.pe')}`, '_blank', 'noopener');
  };

  return (
    <div className="lg-glass lg-glass--strong lg-pop-in" role="dialog" aria-label={`Cachuelo: ${c.title}`}
      style={{ borderRadius: 26, padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <CategoryIcon label={c.category} size={48} iconSize={23} radius={15} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            {c.featured && <span style={{ fontSize: 11, fontWeight: 800, color: '#B45309', background: 'rgba(245,158,11,0.18)', padding: '2px 8px', borderRadius: 10 }}>★ Destacado</span>}
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textSec, background: 'var(--c-card-el)', padding: '2px 8px', borderRadius: 10 }}>{c.category || 'General'}</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--lg-ink-on-glass)', lineHeight: 1.25 }}>{c.title}</div>
        </div>
        <button onClick={onClose} aria-label="Cerrar" style={{ width: 32, height: 32, borderRadius: 16, border: 'none', background: 'var(--c-card-el)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <X size={16} color={C.textSec} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '12px 0 10px' }}>
        <span className="lg-num" style={{ fontSize: 26, fontWeight: 900, color: C.primary, letterSpacing: -0.5 }}>S/{c.price}</span>
        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>{c.payType || 'Total'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { Icon: MapPin, text: placeLabel(c) + (dist != null ? ` · ~${formatDistance(dist)}` : '') },
          { Icon: Clock, text: c.duration || '—' },
          { Icon: Calendar, text: fecha || 'Fecha por definir' },
          { Icon: Wallet, text: c.payType ? `Pago ${c.payType.toLowerCase()}` : 'Pago directo' },
        ].map(({ Icon, text }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: C.textSec, minWidth: 0 }}>
            <Icon size={14} color={C.headerBg} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
          </div>
        ))}
      </div>

      {c.description && (
        <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {c.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid var(--c-bord)', marginBottom: 12 }}>
        <Avatar initials={c.publisher?.avatar || 'U'} size={32} bg={C.primaryLight} fontSize={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: 4 }}>
            {c.publisher?.name || 'Usuario'}
            {c.publisher?.verified && <CheckCircle size={13} color={C.success} aria-label="Verificado" />}
          </div>
          {c.publisher?.rating > 0 ? <Stars rating={c.publisher.rating} size={12} /> : <span style={{ fontSize: 11, color: C.textMuted }}>Sin reseñas todavía</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Btn onClick={onView} style={{ flex: 1, padding: '13px 12px' }}>Ver detalle y postular <ChevronRight size={17} /></Btn>
        <button onClick={share} aria-label="Compartir" className="lg-glass lg-glass--strong"
          style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.headerBg, cursor: 'pointer', flexShrink: 0 }}>
          <Share2 size={19} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginTop: 10, fontSize: 11.5, color: C.textMuted, lineHeight: 1.4 }}>
        <ShieldCheck size={13} color={C.success} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Zona aproximada ({approx ? 'distrito' : `radio ~${zoneRadius(false)} m`}). La dirección exacta solo se comparte por chat con la persona aceptada.</span>
      </div>
    </div>
  );
};

// ── Filtros superiores (buscador + chips) ────────────────────────────────────
const TopFilters = ({ query, setQuery, cat, setCat, featured, setFeatured, onOpenSearch }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: STATUS_TOP, zIndex: 20, pointerEvents: 'none' }}>
    <div style={{ padding: '0 12px', pointerEvents: 'auto' }}>
      <div className="lg-glass lg-glass--strong lg-glass--pill" style={{ height: 50, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 0 16px' }}>
        <Search size={18} color="var(--c-tmut)" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar en el mapa…" aria-label="Buscar en el mapa"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: 'var(--lg-ink-on-glass)', fontFamily: 'inherit', minWidth: 0 }} />
        {query
          ? <button onClick={() => setQuery('')} aria-label="Limpiar" style={{ width: 34, height: 34, borderRadius: 17, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={17} color="var(--c-tmut)" /></button>
          : <button onClick={onOpenSearch} aria-label="Búsqueda avanzada" style={{ height: 34, padding: '0 12px', borderRadius: 17, border: 'none', background: 'rgba(37,99,235,0.12)', color: '#2563EB', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Filtros</button>}
      </div>
    </div>
    <div className="lg-hscroll" style={{ padding: '10px 12px 4px', pointerEvents: 'auto' }}>
      <button className="lg-chip lg-glass lg-glass--strong" aria-pressed={!cat && !featured} onClick={() => { setCat(null); setFeatured(false); }}>Todos</button>
      <button className="lg-chip lg-glass lg-glass--strong" aria-pressed={featured} onClick={() => setFeatured(!featured)}>★ Destacados</button>
      {CATEGORIES.map(k => (
        <button key={k.id} className="lg-chip lg-glass lg-glass--strong" aria-pressed={cat === k.label} onClick={() => setCat(cat === k.label ? null : k.label)}>
          <span style={{ width: 18, height: 18, borderRadius: 6, background: `linear-gradient(145deg, ${k.iconBgB}, ${k.iconBgA})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <k.Icon size={11} color="#fff" strokeWidth={2.6} />
          </span>
          {k.label}
        </button>
      ))}
    </div>
  </div>
);

// ── Clusterer (agrupa pines) ─────────────────────────────────────────────────
function useClusterer(map, markerLib) {
  const [markers, setMarkers] = useState({});
  const clusterer = useMemo(() => {
    if (!map || !markerLib) return null;
    return new MarkerClusterer({
      map,
      renderer: {
        render: ({ count, position }) => {
          const el = document.createElement('div');
          el.className = 'lg-cluster lg-num';
          el.textContent = count > 99 ? '99+' : String(count);
          el.setAttribute('aria-label', `${count} cachuelos en esta zona`);
          return new markerLib.AdvancedMarkerElement({ position, content: el, zIndex: 2000 + count });
        },
      },
    });
  }, [map, markerLib]);

  useEffect(() => {
    if (!clusterer) return;
    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  useEffect(() => () => clusterer?.setMap?.(null), [clusterer]);

  const setMarkerRef = useCallback((marker, key) => {
    setMarkers(prev => {
      if ((marker && prev[key] === marker) || (!marker && !prev[key])) return prev;
      if (marker) return { ...prev, [key]: marker };
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  return setMarkerRef;
}

// ── Mapa con Google ──────────────────────────────────────────────────────────
function ExplorerMap({ points, remoteCount, onViewCachuelo, onNavigate, onOpenSearch, isDark }) {
  const { C } = useTheme();
  const map = useMap('explorer');
  const markerLib = useMapsLibrary('marker');
  const status = useApiLoadingStatus();
  const geo = useGeolocation();
  const setMarkerRef = useClusterer(map, markerLib);

  const [query, setQuery] = useState('');
  const [cat, setCatState] = useState(lastView.cat);
  const [featured, setFeaturedState] = useState(lastView.featured);
  const [selectedId, setSelectedIdState] = useState(lastView.selectedId);
  const [bounds, setBounds] = useState(null);
  const [showList, setShowList] = useState(false);
  const [zoom, setZoom] = useState(lastView.zoom || 11);

  const setCat = (v) => { lastView.cat = v; setCatState(v); };
  const setFeatured = (v) => { lastView.featured = v; setFeaturedState(v); };
  const setSelectedId = (v) => { lastView.selectedId = v; setSelectedIdState(v); };

  const filtered = useMemo(() => points.filter(({ c }) =>
    (!cat || c.category === cat) && (!featured || c.featured) && matchesQuery(c, query)
  ), [points, cat, featured, query]);

  const inView = useMemo(() => {
    const list = bounds ? filtered.filter(({ pos }) =>
      pos.lat <= bounds.north && pos.lat >= bounds.south && pos.lng >= bounds.west && pos.lng <= bounds.east
    ) : filtered;
    const withDist = list.map(p => ({ ...p, dist: geo.coords ? distanceKm(geo.coords, p.pos) : null }));
    return withDist.sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0) || (b.c.featured - a.c.featured));
  }, [filtered, bounds, geo.coords]);

  const selected = filtered.find(p => p.c.id === selectedId) || null;

  // Vista inicial: la última usada, o encuadre de todos los cachuelos
  const initialView = useMemo(() => {
    if (lastView.center) return { defaultCenter: lastView.center, defaultZoom: lastView.zoom };
    if (points.length === 0) return { defaultCenter: LIMA_CENTER, defaultZoom: 11 };
    if (points.length === 1) return { defaultCenter: points[0].pos, defaultZoom: 13 };
    const lats = points.map(p => p.pos.lat), lngs = points.map(p => p.pos.lng);
    return { defaultBounds: { north: Math.max(...lats), south: Math.min(...lats), east: Math.max(...lngs), west: Math.min(...lngs), padding: 70 } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focus = (p) => {
    setSelectedId(p.c.id);
    setShowList(false);
    if (!map) return;
    if ((map.getZoom() ?? 0) < 13) map.setZoom(14);
    map.panTo(offsetCenter(map, p.pos, 120));
  };

  const locateMe = async () => {
    const c = await geo.request();
    if (c && map) { map.panTo({ lat: c.lat, lng: c.lng }); map.setZoom(14); }
  };

  const fitResults = () => {
    if (!map) return;
    const src = filtered.length ? filtered : points;
    if (!src.length) { map.fitBounds(PERU_BOUNDS, 20); return; }
    const b = new window.google.maps.LatLngBounds();
    src.forEach(p => b.extend(p.pos));
    map.fitBounds(b, { top: 150, bottom: 140, left: 40, right: 40 });
  };

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return <ZoneExplorer points={points} remoteCount={remoteCount} onViewCachuelo={onViewCachuelo} onNavigate={onNavigate} reason="auth" />;
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Map
        id="explorer"
        mapId={MAP_ID}
        {...initialView}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        restriction={MAP_RESTRICTION}
        minZoom={MAP_MIN_ZOOM}
        colorScheme={isDark ? 'DARK' : 'LIGHT'}
        reuseMaps
        onClick={() => setSelectedId(null)}
        onIdle={(e) => {
          const b = e.map.getBounds();
          if (b) setBounds(b.toJSON());
          const c = e.map.getCenter();
          lastView.center = c ? { lat: c.lat(), lng: c.lng() } : lastView.center;
          lastView.zoom = e.map.getZoom();
          setZoom(e.map.getZoom() || 11);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {zoom >= 12 && filtered.map(p => (
          <ZoneCircle key={`z-${p.c.id}`} point={p} selected={p.c.id === selectedId} onSelect={focus} />
        ))}
        {filtered.map(p => (
          <PinMarker key={p.c.id} point={p} selected={p.c.id === selectedId}
            setMarkerRef={setMarkerRef} onSelect={focus} />
        ))}
        {geo.coords && (
          <AdvancedMarker position={{ lat: geo.coords.lat, lng: geo.coords.lng }} zIndex={6000} title="Tu ubicación">
            <div className="lg-user-dot" />
          </AdvancedMarker>
        )}
      </Map>

      {/* Velo superior para legibilidad de la barra de estado */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 90, pointerEvents: 'none', zIndex: 10,
        background: isDark ? 'linear-gradient(180deg, rgba(7,11,22,0.55), rgba(7,11,22,0))' : 'linear-gradient(180deg, rgba(238,242,251,0.65), rgba(238,242,251,0))' }} />

      <TopFilters query={query} setQuery={setQuery} cat={cat} setCat={setCat} featured={featured} setFeatured={setFeatured} onOpenSearch={onOpenSearch} />

      {/* Controles laterales */}
      <div style={{ position: 'absolute', right: 12, top: STATUS_TOP + 112, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={locateMe} aria-label="Cerca de mí" className="lg-glass lg-glass--strong"
          style={{ width: 46, height: 46, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: geo.coords ? '#2563EB' : 'var(--lg-ink-on-glass)' }}>
          {geo.status === 'locating' ? <span className="spinner" style={{ width: 18, height: 18, border: '2px solid rgba(37,99,235,0.3)', borderTopColor: '#2563EB', borderRadius: '50%' }} /> : <LocateFixed size={20} />}
        </button>
        <button onClick={fitResults} aria-label="Ver todos los resultados" className="lg-glass lg-glass--strong"
          style={{ width: 46, height: 46, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--lg-ink-on-glass)' }}>
          <Maximize2 size={19} />
        </button>
      </div>

      {geo.error && (
        <div className="lg-glass lg-glass--strong lg-pop-in" style={{ position: 'absolute', left: 12, right: 70, top: STATUS_TOP + 112, zIndex: 20, borderRadius: 16, padding: '10px 12px', fontSize: 12.5, color: 'var(--lg-ink-on-glass)' }}>
          {geo.error}
        </div>
      )}

      {/* Carga */}
      {status !== APILoadingStatus.LOADED && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div className="lg-glass lg-glass--strong lg-glass--pill" style={{ padding: '10px 18px', fontSize: 13, fontWeight: 700, color: 'var(--lg-ink-on-glass)' }}>Cargando mapa…</div>
        </div>
      )}

      {/* Zona inferior: tarjeta seleccionada o resumen */}
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 92, zIndex: 40 }}>
        {selected ? (
          <PinCard key={selected.c.id} c={selected.c} pos={selected.pos} approx={selected.approx} userPos={geo.coords}
            onClose={() => setSelectedId(null)} onView={() => onViewCachuelo(selected.c)} />
        ) : (
          <button onClick={() => setShowList(true)} className="lg-glass lg-glass--strong lg-glass--pill"
            style={{ width: '100%', height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 0 18px', cursor: 'pointer', color: 'var(--lg-ink-on-glass)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: C.primary, boxShadow: `0 0 0 4px ${C.primary}33` }} />
            <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 800 }}>
              {inView.length} cachuelo{inView.length !== 1 ? 's' : ''} en esta zona
              {remoteCount > 0 && <span style={{ fontWeight: 600, color: 'var(--c-tmut)', fontSize: 12 }}> · {remoteCount} remoto{remoteCount !== 1 ? 's' : ''}</span>}
            </span>
            <span style={{ height: 36, padding: '0 14px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(37,99,235,0.12)', color: '#2563EB', fontWeight: 800, fontSize: 12.5 }}>
              <List size={15} /> Lista
            </span>
          </button>
        )}
      </div>

      {/* Lista de resultados en la zona visible */}
      {showList && (
        <div className="lg-scrim" onClick={() => setShowList(false)} style={{ position: 'absolute', inset: 0, zIndex: 500, background: 'var(--lg-scrim)', display: 'flex', alignItems: 'flex-end' }}>
          <div className="lg-sheet" onClick={e => e.stopPropagation()} style={{ width: '100%', maxHeight: '68%', background: 'var(--lg-fill-strong)', padding: '10px 14px 24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--c-bord)', margin: '0 auto 12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: C.text }}>En esta zona</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{geo.coords ? 'Ordenados por cercanía' : 'Activa "Cerca de mí" para ordenar por distancia'}</div>
              </div>
              <button onClick={() => setShowList(false)} aria-label="Cerrar lista" style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: 'var(--c-card-el)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronDown size={18} color={C.textSec} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {inView.length === 0 && (
                <div style={{ textAlign: 'center', padding: '28px 0', color: C.textMuted, fontSize: 13 }}>
                  No hay cachuelos en esta zona con estos filtros.<br />Aleja el mapa o cambia de categoría.
                </div>
              )}
              {inView.map(p => <MiniRow key={p.c.id} c={p.c} distance={p.dist} onPress={() => focus(p)} />)}
            </div>
          </div>
        </div>
      )}

      <TabBar active="map" onNavigate={onNavigate} />
    </div>
  );
}

// ── Modo sin mapa: explorar por zona ─────────────────────────────────────────
function ZoneExplorer({ points, remoteCount, onViewCachuelo, onNavigate, reason }) {
  const { C } = useTheme();
  const [open, setOpen] = useState(null);
  const zones = useMemo(() => {
    const g = {};
    points.forEach(p => {
      const key = p.c.departamento && p.c.departamento !== 'Lima' ? p.c.departamento : (p.c.district || p.c.location || 'Lima').split(',')[0];
      (g[key] = g[key] || []).push(p);
    });
    return Object.entries(g).sort((a, b) => b[1].length - a[1].length);
  }, [points]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 110 }}>
        <div className="lg-header" style={{ padding: '48px 20px 20px' }}>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: -0.4 }}>Explorar por zona</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>{points.length} cachuelos presenciales en Perú</div>
        </div>
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 16, background: C.infoSoft, color: C.textSec, fontSize: 12.5, lineHeight: 1.5, marginBottom: 14 }}>
            <Info size={16} color={C.headerBg} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              {reason === 'auth' ? 'El mapa no pudo cargar. ' : 'El mapa interactivo aún no está activado. '}
              {import.meta.env.DEV
                ? <>Agrega <code>VITE_GOOGLE_MAPS_API_KEY</code> en tu <code>.env</code> y reinicia <code>npm run dev</code> (ver docs/cambios/CAMBIOS_v0.15.md).</>
                : 'Mientras tanto puedes explorar los cachuelos por zona.'}
            </span>
          </div>
          {zones.map(([zone, list]) => (
            <div key={zone} style={{ marginBottom: 10 }}>
              <button onClick={() => setOpen(open === zone ? null : zone)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', borderRadius: 16, border: 'none', background: C.card, boxShadow: 'inset 0 0 0 1px var(--c-bord)', cursor: 'pointer' }}>
                <span style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={18} color={C.headerBg} /></span>
                <span style={{ flex: 1, textAlign: 'left', fontSize: 15, fontWeight: 800, color: C.text }}>{zone}</span>
                <span className="lg-num" style={{ fontSize: 13, fontWeight: 800, color: C.primary }}>{list.length}</span>
                <ChevronDown size={18} color={C.textMuted} style={{ transform: open === zone ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
              </button>
              {open === zone && (
                <div className="lg-pop-in" style={{ padding: '8px 0 0 10px' }}>
                  {list.map(p => <MiniRow key={p.c.id} c={p.c} onPress={() => onViewCachuelo(p.c)} />)}
                </div>
              )}
            </div>
          ))}
          {remoteCount > 0 && <div style={{ textAlign: 'center', fontSize: 12, color: C.textMuted, marginTop: 8 }}>+ {remoteCount} cachuelos remotos (ver en Inicio → Remoto)</div>}
        </div>
      </div>
      <TabBar active="map" onNavigate={onNavigate} />
    </div>
  );
}

// ── Pantalla ─────────────────────────────────────────────────────────────────
export default function MapScreen({ cachuelos = [], onViewCachuelo, onNavigate, onOpenSearch }) {
  const { isDark } = useTheme();
  const points = useMemo(
    () => cachuelos.map(c => {
      const r = resolveCoords(c);
      // Google valida LatLngLiteral estricto: solo { lat, lng }
      return r ? { c, pos: { lat: r.lat, lng: r.lng }, approx: r.approx } : null;
    }).filter(Boolean),
    [cachuelos],
  );
  const remoteCount = useMemo(() => cachuelos.filter(c => c.remote).length, [cachuelos]);

  if (!hasMapsKey) {
    return <ZoneExplorer points={points} remoteCount={remoteCount} onViewCachuelo={onViewCachuelo} onNavigate={onNavigate} />;
  }
  return (
    <ExplorerMap points={points} remoteCount={remoteCount} isDark={isDark}
      onViewCachuelo={onViewCachuelo} onNavigate={onNavigate} onOpenSearch={onOpenSearch} />
  );
}
