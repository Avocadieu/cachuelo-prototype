// ─── GEO · PERÚ ──────────────────────────────────────────────────────────────
// Coordenadas APROXIMADAS (centro del distrito / ciudad). Sirven para:
//   1) Centrar el selector de ubicación al publicar.
//   2) Ubicar en el mapa cachuelos antiguos que aún no tienen lat/lng.
// Nunca se usan como dirección exacta.

// Caja que contiene al Perú (con un pequeño margen)
export const PERU_BOUNDS = { north: 0.35, south: -18.65, west: -81.8, east: -68.2 };
export const PERU_CENTER = { lat: -9.19, lng: -75.02 };
export const LIMA_CENTER = { lat: -12.0464, lng: -77.0428 };

export const isInPeru = (lat, lng) =>
  Number.isFinite(lat) && Number.isFinite(lng) &&
  lat <= PERU_BOUNDS.north && lat >= PERU_BOUNDS.south &&
  lng >= PERU_BOUNDS.west && lng <= PERU_BOUNDS.east;

// 43 distritos de Lima Metropolitana (mismos nombres que DISTRITOS en App.jsx)
export const LIMA_DISTRICT_COORDS = {
  'Ancón': [-11.7736, -77.1760], 'Ate': [-12.0260, -76.9210], 'Barranco': [-12.1490, -77.0210],
  'Breña': [-12.0580, -77.0500], 'Carabayllo': [-11.8650, -77.0310], 'Cercado de Lima': [-12.0464, -77.0428],
  'Chaclacayo': [-11.9760, -76.7700], 'Chorrillos': [-12.1690, -77.0240], 'Cieneguilla': [-12.1050, -76.8150],
  'Comas': [-11.9320, -77.0590], 'El Agustino': [-12.0460, -76.9990], 'Independencia': [-11.9930, -77.0540],
  'Jesús María': [-12.0760, -77.0470], 'La Molina': [-12.0800, -76.9400], 'La Victoria': [-12.0680, -77.0170],
  'Lince': [-12.0840, -77.0350], 'Los Olivos': [-11.9690, -77.0720], 'Lurigancho': [-11.9400, -76.7000],
  'Lurín': [-12.2760, -76.8690], 'Magdalena del Mar': [-12.0920, -77.0710], 'Miraflores': [-12.1210, -77.0300],
  'Pachacámac': [-12.2300, -76.8600], 'Pucusana': [-12.4810, -76.7970], 'Pueblo Libre': [-12.0750, -77.0640],
  'Puente Piedra': [-11.8660, -77.0750], 'Punta Hermosa': [-12.3350, -76.8230], 'Punta Negra': [-12.3660, -76.7950],
  'Rímac': [-12.0300, -77.0300], 'San Bartolo': [-12.3890, -76.7800], 'San Borja': [-12.1010, -76.9990],
  'San Isidro': [-12.0970, -77.0370], 'San Juan de Lurigancho': [-11.9900, -76.9950],
  'San Juan de Miraflores': [-12.1600, -76.9700], 'San Luis': [-12.0750, -76.9960],
  'San Martín de Porres': [-12.0100, -77.0850], 'San Miguel': [-12.0770, -77.0900], 'Santa Anita': [-12.0430, -76.9710],
  'Santa María del Mar': [-12.4050, -76.7750], 'Santa Rosa': [-11.8060, -77.1620],
  'Santiago de Surco': [-12.1350, -76.9930], 'Surquillo': [-12.1130, -77.0200],
  'Villa El Salvador': [-12.2130, -76.9370], 'Villa María del Triunfo': [-12.1650, -76.9420],
};

// Alias frecuentes que escribe la gente
const DISTRICT_ALIASES = {
  'surco': 'Santiago de Surco', 'lima': 'Cercado de Lima', 'cercado': 'Cercado de Lima',
  'sjl': 'San Juan de Lurigancho', 'sjm': 'San Juan de Miraflores', 'smp': 'San Martín de Porres',
  'ves': 'Villa El Salvador', 'vmt': 'Villa María del Triunfo', 'chosica': 'Lurigancho',
};

// Capital de cada departamento (mismos nombres que DEPARTAMENTOS_PERU)
export const DEPARTMENT_COORDS = {
  'Amazonas': [-6.2310, -77.8690], 'Áncash': [-9.5270, -77.5280], 'Apurímac': [-13.6340, -72.8810],
  'Arequipa': [-16.4090, -71.5370], 'Ayacucho': [-13.1590, -74.2240], 'Cajamarca': [-7.1640, -78.5000],
  'Callao': [-12.0566, -77.1181], 'Cusco': [-13.5320, -71.9670], 'Huancavelica': [-12.7870, -74.9760],
  'Huánuco': [-9.9300, -76.2420], 'Ica': [-14.0680, -75.7260], 'Junín': [-12.0650, -75.2050],
  'La Libertad': [-8.1120, -79.0290], 'Lambayeque': [-6.7710, -79.8410], 'Lima': [-12.0464, -77.0428],
  'Loreto': [-3.7490, -73.2530], 'Madre de Dios': [-12.5930, -69.1890], 'Moquegua': [-17.1940, -70.9350],
  'Pasco': [-10.6830, -76.2560], 'Piura': [-5.1940, -80.6320], 'Puno': [-15.8400, -70.0220],
  'San Martín': [-6.0340, -76.9720], 'Tacna': [-18.0130, -70.2500], 'Tumbes': [-3.5670, -80.4510],
  'Ucayali': [-8.3790, -74.5540],
};

// Ciudades principales (las demás caen al centro del departamento)
export const CITY_COORDS = {
  'Arequipa': [-16.4090, -71.5370], 'Trujillo': [-8.1120, -79.0290], 'Chiclayo': [-6.7710, -79.8410],
  'Piura': [-5.1940, -80.6320], 'Sullana': [-4.9040, -80.6850], 'Paita': [-5.0890, -81.1140], 'Talara': [-4.5770, -81.2720],
  'Cusco': [-13.5320, -71.9670], 'Sicuani': [-14.2700, -71.2260], 'Iquitos': [-3.7490, -73.2530],
  'Huancayo': [-12.0650, -75.2050], 'Tarma': [-11.4190, -75.6900], 'Tacna': [-18.0130, -70.2500],
  'Puno': [-15.8400, -70.0220], 'Juliaca': [-15.5000, -70.1330], 'Chimbote': [-9.0750, -78.5930],
  'Nuevo Chimbote': [-9.1250, -78.5350], 'Huaraz': [-9.5270, -77.5280], 'Ica': [-14.0680, -75.7260],
  'Chincha Alta': [-13.4100, -76.1320], 'Pisco': [-13.7100, -76.2030], 'Nazca': [-14.8350, -74.9380],
  'Pucallpa': [-8.3790, -74.5540], 'Tarapoto': [-6.4880, -76.3600], 'Moyobamba': [-6.0340, -76.9720],
  'Cajamarca': [-7.1640, -78.5000], 'Jaén': [-5.7080, -78.8080], 'Ayacucho': [-13.1590, -74.2240],
  'Huánuco': [-9.9300, -76.2420], 'Tingo María': [-9.2950, -75.9970], 'Tumbes': [-3.5670, -80.4510],
  'Moquegua': [-17.1940, -70.9350], 'Ilo': [-17.6390, -71.3370], 'Abancay': [-13.6340, -72.8810],
  'Andahuaylas': [-13.6560, -73.3870], 'Chachapoyas': [-6.2310, -77.8690], 'Puerto Maldonado': [-12.5930, -69.1890],
  'Cerro de Pasco': [-10.6830, -76.2560], 'Huancavelica': [-12.7870, -74.9760],
  'Callao': [-12.0566, -77.1181], 'Bellavista': [-12.0620, -77.1270], 'La Perla': [-12.0700, -77.1200],
  'La Punta': [-12.0720, -77.1630], 'Ventanilla': [-11.8750, -77.1260], 'Mi Perú': [-11.8550, -77.1240],
  'Barranca': [-10.7500, -77.7600], 'Huacho': [-11.1070, -77.6050], 'Huaral': [-11.4950, -77.2070],
  'Cañete': [-13.0770, -76.3870], 'Mala': [-12.6580, -76.6320],
};

const normalize = (s = '') => s.toString().trim().toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const findKey = (dict, name) => {
  if (!name) return null;
  const n = normalize(name);
  return Object.keys(dict).find(k => normalize(k) === n) || null;
};

/** Devuelve [lat,lng] aproximado para un distrito de Lima, ciudad o departamento. */
export const lookupPlace = ({ district, city, departamento } = {}) => {
  const alias = DISTRICT_ALIASES[normalize(district)];
  const dKey = findKey(LIMA_DISTRICT_COORDS, alias || district);
  if (dKey) return LIMA_DISTRICT_COORDS[dKey];
  const cKey = findKey(CITY_COORDS, city) || findKey(CITY_COORDS, district);
  if (cKey) return CITY_COORDS[cKey];
  const depKey = findKey(DEPARTMENT_COORDS, departamento);
  if (depKey) return DEPARTMENT_COORDS[depKey];
  return null;
};

// Hash estable → desplazamiento pequeño para que dos cachuelos del mismo
// distrito no queden exactamente uno encima del otro.
const hashCode = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return h;
};
const jitter = (seed, spread = 0.008) => {
  const h = hashCode(String(seed));
  const a = ((h & 0xffff) / 0xffff - 0.5) * 2 * spread;
  const b = (((h >>> 16) & 0xffff) / 0xffff - 0.5) * 2 * spread;
  return [a, b];
};

/**
 * Coordenadas para pintar un cachuelo en el mapa.
 * - Con lat/lng guardados → se usan tal cual (ya vienen redondeados por privacidad).
 * - Sin lat/lng → centro del distrito/ciudad + desplazamiento estable (approx: true).
 * - Remoto o sin datos → null (no se pinta).
 */
export const resolveCoords = (c) => {
  if (!c || c.remote || c.type === 'Remoto') return null;
  const lat = Number(c.lat), lng = Number(c.lng);
  if (isInPeru(lat, lng)) return { lat, lng, approx: false };
  const district = c.district || (c.location || '').split(',')[0];
  const base = lookupPlace({ district, city: c.ciudad, departamento: c.departamento });
  if (!base) return null;
  const [dLat, dLng] = jitter(c.id ?? c.title ?? district);
  return { lat: base[0] + dLat, lng: base[1] + dLng, approx: true };
};

// ─── ZONAS APROXIMADAS (privacidad) ───────────────────────────────────────────
// El mapa público NUNCA muestra un punto exacto: muestra un círculo de zona.
// En producción el servidor desplaza el centro al azar (trigger SQL v0.17), así
// que el centro del círculo no revela la dirección.
export const ZONE_RADIUS_M = 300;          // cachuelo con pin elegido por el publicador
export const DISTRICT_ZONE_RADIUS_M = 700;  // cachuelo sin pin (centro del distrito)
export const ZONE_FUZZ_MAX_M = 180;        // desplazamiento máx. del centro (60 % del radio): el punto real queda dentro
export const zoneRadius = (approx) => (approx ? DISTRICT_ZONE_RADIUS_M : ZONE_RADIUS_M);

/** Desplaza un punto al azar hasta `maxM` metros (en producción lo hace el trigger SQL). */
export const fuzzPoint = (lat, lng, maxM = 180) => {
  const r = maxM * Math.sqrt(Math.random()); const th = 2 * Math.PI * Math.random();
  const dLat = (r * Math.cos(th)) / 111320; const dLng = (r * Math.sin(th)) / (111320 * Math.cos((lat * Math.PI) / 180));
  return { lat: Math.round((lat + dLat) * 1e4) / 1e4, lng: Math.round((lng + dLng) * 1e4) / 1e4 };
};

/** Metros por píxel en Web Mercator (para dibujar el anillo del selector). */
export const metersPerPixel = (lat, zoom) => (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;

/** Redondeo a 3 decimales (~110 m): el mapa público nunca muestra la puerta exacta. */
export const roundForPrivacy = (n) => Math.round(Number(n) * 1000) / 1000;

/** Distancia en km (fórmula de Haversine). */
export const distanceKm = (a, b) => {
  if (!a || !b) return null;
  const R = 6371;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export const formatDistance = (km) => {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

/** Link de "Cómo llegar" (abre Google Maps; no consume la API ni cuesta). */
export const directionsUrl = ({ lat, lng }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
