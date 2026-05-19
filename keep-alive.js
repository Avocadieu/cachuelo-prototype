// keep-alive.js – Mantiene Supabase activo con un query liviano
import { readFileSync } from 'fs';
import https from 'https';

// Leer .env manualmente
const env = readFileSync('.env', 'utf-8');
const get = (key) => env.match(new RegExp(`^${key}=(.+)`, 'm'))?.[1]?.trim().replace(/\r$/, '');

const SUPABASE_URL = get('VITE_SUPABASE_URL');
const SUPABASE_KEY = get('VITE_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: No se encontraron las credenciales en .env');
  process.exit(1);
}

const url = new URL('/rest/v1/categorias?select=id&limit=1', SUPABASE_URL);

console.log('Pingueando Supabase...');
const start = Date.now();

const req = https.get(url, {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  },
}, (res) => {
  const ms = Date.now() - start;
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log(`Supabase activo! (${ms}ms) – proyecto seguro por otra semana.`);
    } else {
      console.error(`Error HTTP ${res.statusCode}: ${body}`);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('Error de red:', err.message);
  process.exit(1);
});
