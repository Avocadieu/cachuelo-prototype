// ─── CAMPOS DE UBICACIÓN (Publicar / Editar) ─────────────────────────────────
// Departamento → Distrito/Ciudad → pin en el mapa.
// El pin es FIJO en el centro y el usuario mueve el mapa debajo (patrón Uber /
// Rappi): es mucho más fácil en pantallas táctiles que arrastrar un marcador.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Map, useMap, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { MapPin, LocateFixed, ShieldCheck, Info } from 'lucide-react';
import { useTheme } from '../../ui/theme.js';
import { DISTRITOS, DEPARTAMENTOS_PERU, CIUDADES_PERU } from '../../data/places.js';
import { lookupPlace, roundForPrivacy, isInPeru, ZONE_RADIUS_M, metersPerPixel } from '../../data/geo.js';
import { hasMapsKey, MAP_ID, MAP_RESTRICTION, MAP_MIN_ZOOM } from './mapConfig.js';
import { useGeolocation } from './useGeolocation.js';

const selectStyle = (C, filled) => ({
  width: '100%', padding: '13px 14px 13px 38px', border: `1.5px solid ${filled ? C.primary : C.border}`,
  borderRadius: 14, fontSize: 16, color: filled ? C.text : C.textMuted, background: C.card,
  outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer',
});

const LIMA_PROVINCIAS = (CIUDADES_PERU['Lima'] || []).filter(c => c !== 'Lima');

/** Pin SVG reutilizable */
export const PinGlyph = ({ size = 40, color = '#FF6B35' }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 40 50" aria-hidden="true">
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FF9A6B" /><stop offset="1" stopColor={color} />
      </linearGradient>
    </defs>
    <path d="M20 49s16-15.3 16-28A16 16 0 1 0 4 21c0 12.7 16 28 16 28z" fill="url(#pg)" stroke="#fff" strokeWidth="2.5" />
    <circle cx="20" cy="20" r="6.5" fill="#fff" />
    <path d="M9 12c2-4 6-6.5 11-6.5" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

function PickerMap({ anchorKey, anchor, value, onPick, isDark, placeLabel }) {
  const map = useMap('picker');
  const status = useApiLoadingStatus();
  const userMoved = useRef(false);
  const [moving, setMoving] = useState(false);
  const [view, setView] = useState({ zoom: 14, lat: -12 });
  const geo = useGeolocation();

  const initialCenter = useMemo(() => (
    value && isInPeru(value.lat, value.lng) ? { lat: value.lat, lng: value.lng }
      : anchor ? { lat: anchor[0], lng: anchor[1] } : { lat: -12.0464, lng: -77.0428 }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  // Cuando cambia el distrito/ciudad, centramos ahí
  const firstRun = useRef(true);
  useEffect(() => {
    if (!map || !anchor) return;
    if (firstRun.current) { firstRun.current = false; if (value && isInPeru(value.lat, value.lng)) return; }
    userMoved.current = false;
    map.panTo({ lat: anchor[0], lng: anchor[1] });
    map.setZoom(14);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, anchorKey]);

  const useMyLocation = async () => {
    const c = await geo.request();
    if (c && map) { userMoved.current = true; map.panTo({ lat: c.lat, lng: c.lng }); map.setZoom(15); }
  };

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return <MapUnavailable reason="auth" placeLabel={placeLabel} />;
  }

  return (
    <div style={{ position: 'relative', height: 210, borderRadius: 18, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--c-bord)' }}>
      <Map
        id="picker"
        mapId={MAP_ID}
        defaultCenter={initialCenter}
        defaultZoom={14}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        restriction={MAP_RESTRICTION}
        minZoom={MAP_MIN_ZOOM}
        colorScheme={isDark ? 'DARK' : 'LIGHT'}
        reuseMaps
        onDragstart={() => { userMoved.current = true; setMoving(true); }}
        onIdle={(e) => {
          setMoving(false);
          const c = e.map.getCenter();
          if (c) { onPick({ lat: c.lat(), lng: c.lng() }, userMoved.current); setView({ zoom: e.map.getZoom() || 14, lat: c.lat() }); }
        }}
        style={{ width: '100%', height: '100%' }}
      />
      {/* Zona que verá el público (radio real en metros, escalado al zoom) */}
      {(() => {
        const r = Math.max(14, Math.min(400, ZONE_RADIUS_M / metersPerPixel(view.lat, view.zoom)));
        return <div className="lg-privacy-ring" style={{ width: r * 2, height: r * 2, margin: `${-r}px 0 0 ${-r}px` }} />;
      })()}
      <div className="lg-center-shadow" />
      <div className="lg-center-pin" data-moving={moving ? 'true' : 'false'}><PinGlyph size={36} /></div>
      <button type="button" onClick={useMyLocation} className="lg-glass lg-glass--strong lg-glass--pill"
        style={{ position: 'absolute', right: 10, bottom: 10, height: 38, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: 'var(--lg-ink-on-glass)' }}>
        <LocateFixed size={15} /> {geo.status === 'locating' ? 'Ubicando…' : 'Mi ubicación'}
      </button>
      {geo.error && (
        <div className="lg-glass lg-glass--strong" style={{ position: 'absolute', left: 10, right: 10, top: 10, borderRadius: 12, padding: '8px 10px', fontSize: 11.5, color: 'var(--lg-ink-on-glass)' }}>{geo.error}</div>
      )}
    </div>
  );
}

const MapUnavailable = ({ reason, placeLabel }) => {
  const { C } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 14, background: C.infoSoft, color: C.textSec, fontSize: 12.5, lineHeight: 1.5 }}>
      <Info size={16} color={C.headerBg} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>
        {reason === 'auth'
          ? 'El mapa no pudo cargar (revisa la API key y sus restricciones). '
          : 'Mapa no configurado en este entorno. '}
        Usaremos el centro aproximado de <b>{placeLabel || 'la zona elegida'}</b> para ubicar tu cachuelo.
      </span>
    </div>
  );
};

/**
 * value = { departamento, district, lat, lng, pinTouched }
 * district = distrito (Lima Metropolitana) o ciudad (provincias)
 */
export default function LocationFields({ value, onChange }) {
  const { C, isDark } = useTheme();
  const v = { departamento: 'Lima', district: '', lat: null, lng: null, pinTouched: false, ...value };
  const options = v.departamento === 'Lima' ? null : (CIUDADES_PERU[v.departamento] || []);
  const anchor = v.district ? lookupPlace({ district: v.district, city: v.district, departamento: v.departamento }) : null;
  const anchorKey = `${v.departamento}|${v.district}`;

  const setPlace = (patch) => {
    const next = { ...v, ...patch, pinTouched: false };
    const base = lookupPlace({ district: next.district, city: next.district, departamento: next.departamento });
    next.lat = base ? roundForPrivacy(base[0]) : null;
    next.lng = base ? roundForPrivacy(base[1]) : null;
    onChange(next);
  };

  const label = (t) => <label style={{ fontSize: 13, fontWeight: 700, color: C.textSec, marginBottom: 6, display: 'block' }}>{t}</label>;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {label('Departamento *')}
          <div style={{ position: 'relative' }}>
            <MapPin size={15} color={C.textMuted} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select value={v.departamento} onChange={e => setPlace({ departamento: e.target.value, district: '' })} style={selectStyle(C, !!v.departamento)}>
              {DEPARTAMENTOS_PERU.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={{ flex: 1.2, minWidth: 0 }}>
          {label(v.departamento === 'Lima' ? 'Distrito *' : 'Ciudad *')}
          <div style={{ position: 'relative' }}>
            <MapPin size={15} color={C.textMuted} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select value={v.district} onChange={e => setPlace({ district: e.target.value })} style={selectStyle(C, !!v.district)}>
              <option value="">Elegir…</option>
              {options ? options.map(c => <option key={c} value={c}>{c}</option>) : (
                <>
                  <optgroup label="Lima Metropolitana">
                    {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </optgroup>
                  <optgroup label="Provincias de Lima">
                    {LIMA_PROVINCIAS.map(d => <option key={d} value={d}>{d}</option>)}
                  </optgroup>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {v.district && (
        <div className="lg-pop-in">
          {label('Ubica la zona en el mapa')}
          {hasMapsKey ? (
            <PickerMap
              anchorKey={anchorKey}
              anchor={anchor}
              value={{ lat: v.lat, lng: v.lng }}
              isDark={isDark}
              placeLabel={v.district}
              onPick={(c, byUser) => {
                const lat = roundForPrivacy(c.lat), lng = roundForPrivacy(c.lng);
                if (lat === v.lat && lng === v.lng) return;
                onChange({ ...v, lat, lng, pinTouched: v.pinTouched || byUser });
              }}
            />
          ) : <MapUnavailable placeLabel={v.district} />}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8, fontSize: 12, color: C.textMuted, lineHeight: 1.45 }}>
            <ShieldCheck size={14} color={C.success} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>En el mapa público se verá solo la <b>zona sombreada (radio ~{ZONE_RADIUS_M} m)</b>, con el centro desplazado al azar. Nunca tu dirección exacta: esa la compartes por chat con la persona que aceptes.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export const locationFromCachuelo = (c) => ({
  departamento: c?.departamento || 'Lima',
  district: c?.district || (c?.location && c.location !== 'Remoto' ? c.location.split(',')[0] : ''),
  lat: Number.isFinite(Number(c?.lat)) && c?.lat != null ? Number(c.lat) : null,
  lng: Number.isFinite(Number(c?.lng)) && c?.lng != null ? Number(c.lng) : null,
  pinTouched: c?.lat != null,
});
