// ─── "FOTOS" DE EJEMPLO PARA LA SIMULACIÓN ──────────────────────────────────
// No usamos fotos reales de personas: generamos ilustraciones SVG livianas
// (degradado del color de la categoría + emoji + texto). Las fotos que suba
// el usuario en su portafolio sí son reales (se guardan reducidas).
import { getCategory } from '../../data/categories.js';

const esc = (s = '') => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

const hash = (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); };

/** Devuelve un data-URL SVG 4:3 que sirve como "foto" de ejemplo. */
export function artPhoto(categoryLabel, seed = 0, caption = '') {
  const cat = getCategory(categoryLabel);
  const h = hash(`${categoryLabel}-${seed}`);
  const angle = h % 360;
  const cx = 20 + (h % 60), cy = 20 + ((h >> 3) % 60);
  const emojiSize = 120 + (h % 40);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
<defs><linearGradient id="g" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${cat.iconBgB}"/><stop offset="1" stop-color="${cat.iconBgA}"/></linearGradient>
<radialGradient id="r" cx="${cx}%" cy="${cy}%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="300" fill="url(#g)"/><rect width="400" height="300" fill="url(#r)"/>
<circle cx="${60 + (h % 280)}" cy="${40 + ((h >> 2) % 200)}" r="${30 + (h % 50)}" fill="#fff" opacity=".12"/>
<text x="200" y="${150 + emojiSize / 3}" font-size="${emojiSize}" text-anchor="middle">${cat.emoji || '💼'}</text>
${caption ? `<rect x="0" y="252" width="400" height="48" fill="#000" opacity=".28"/><text x="16" y="283" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="18" font-weight="700" fill="#fff">${esc(caption).slice(0, 38)}</text>` : ''}
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
