// ─── ESCUDO DE CONTACTO EN EL CHAT ───────────────────────────────────────────
// Antes de que se acepte la postulación (y se pague), ocultamos teléfonos,
// correos y "yapéame al…". Es la medida anti "sacados de vuelta" (Acta N°2 #8)
// más efectiva y menos molesta: no bloquea el mensaje, solo tapa el dato.
const PHONE = /(?:\+?\s?51[\s.-]?)?9(?:[\s.-]?\d){8}\b/g;
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const SOCIAL = /\b(?:wh?ats?app|wsp|wasap|telegram|instagram|ig|facebook|fb)\b\s*[:@]?\s*[\w.@-]{3,}/gi;
const HINT = /\b(yap[eé]ame|plin[eé]ame|mi\s+n[uú]mero|ll[aá]mame|escr[ií]beme\s+al|te\s+paso\s+mi)\b/i;

export function shieldContact(text = '') {
  let flagged = HINT.test(text);
  const masked = text
    .replace(PHONE, () => { flagged = true; return '9•• ••• •••'; })
    .replace(EMAIL, () => { flagged = true; return '•••@•••'; })
    .replace(SOCIAL, (m) => { flagged = true; return m.split(/[\s:@]/)[0] + ' •••'; });
  return { text: masked, flagged };
}
