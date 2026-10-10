// ─── CONFIGURACIÓN GOOGLE MAPS ───────────────────────────────────────────────
// La API key de Maps JavaScript es una clave de NAVEGADOR: siempre termina
// visible en el bundle. La protección real es restringirla en Google Cloud:
//   · Restricción de aplicación: "Sitios web" (HTTP referrers)
//       http://localhost:5173/*   https://TU-SITIO.netlify.app/*
//   · Restricción de API: solo "Maps JavaScript API"
//   · Cuotas diarias + alerta de presupuesto en Billing
import { PERU_BOUNDS } from '../../data/geo.js';

export const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
// DEMO_MAP_ID sirve para desarrollo (Advanced Markers). Para producción crea
// tu propio Map ID en Google Cloud → Map Management y ponlo en el .env.
export const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
export const hasMapsKey = MAPS_API_KEY.length > 0;

export const MAP_RESTRICTION = { latLngBounds: PERU_BOUNDS, strictBounds: false };
export const MAP_MIN_ZOOM = 5;
