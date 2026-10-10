// ─── useGeolocation ──────────────────────────────────────────────────────────
// Pide la ubicación SOLO cuando el usuario toca un botón (nunca al abrir la app).
// Requiere contexto seguro: https:// o http://localhost. Si pruebas desde el
// celular con la IP de tu PC (http://192.168.x.x) el navegador la bloquea.
import { useCallback, useState } from 'react';

let cached = null; // compartido entre pantallas durante la sesión

export function useGeolocation() {
  const [coords, setCoords] = useState(cached);
  const [status, setStatus] = useState(cached ? 'granted' : 'idle'); // idle | locating | granted | denied | unavailable
  const [error, setError] = useState('');

  const request = useCallback(() => new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable'); setError('Tu navegador no permite obtener la ubicación.');
      resolve(null); return;
    }
    setStatus('locating'); setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        cached = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setCoords(cached); setStatus('granted'); resolve(cached);
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED;
        setStatus(denied ? 'denied' : 'unavailable');
        setError(denied
          ? 'Permiso de ubicación denegado. Actívalo en la configuración del navegador.'
          : 'No pudimos obtener tu ubicación. Intenta de nuevo.');
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }), []);

  return { coords, status, error, request };
}
