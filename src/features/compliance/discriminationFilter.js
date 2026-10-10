// ─── FILTRO DE AVISOS DISCRIMINATORIOS (Ley 26772 y su reglamento) ──────────
// Detecta requisitos que no se pueden pedir. No bloquea palabras sueltas
// ("señora" en "limpiar la casa de mi señora madre" pasa); busca patrones de
// REQUISITO ("solo mujeres", "menor de 30", "buena presencia"...).
const RULES = [
  { re: /\b(s[oó]lo|solamente|únicamente|unicamente|exclusivamente)\s+(para\s+)?(mujer(es)?|var[oó]n(es)?|hombres?|chicas?|chicos?|se[ñn]oritas?|damas?|caballeros?)\b/i, why: 'sexo' },
  { re: /\b(se\s+busca|buscamos|requiero|necesito)\s+(una?\s+)?(mujer|var[oó]n|hombre|se[ñn]orita|chica|chico|dama|caballero)\b/i, why: 'sexo' },
  { re: /\b(sexo|g[eé]nero)\s*:?\s*(femenino|masculino|mujer|var[oó]n|hombre)\b/i, why: 'sexo' },
  { re: /\b(menor(es)?|mayor(es)?)\s+de\s+\d{2}\s*a[ñn]os\b/i, why: 'edad' },
  { re: /\b(entre|de)\s+\d{2}\s*(y|a|-)\s*\d{2}\s*a[ñn]os\b/i, why: 'edad' },
  { re: /\bedad\s*:?\s*(m[aá]xim[ao]|l[ií]mite|hasta)\b/i, why: 'edad' },
  { re: /\b(j[oó]venes|joven)\s+(de\s+)?(preferencia|solamente|s[oó]lo)\b/i, why: 'edad' },
  { re: /\b(buena\s+presencia|bien\s+parecid[ao]|presencia\s+agradable|delgad[ao]s?|tez\s+(clara|blanca)|blanc[ao]s?\s+de\s+piel|estatura\s+m[ií]nima)\b/i, why: 'apariencia' },
  { re: /\b(solter[ao]s?|casad[ao]s?|sin\s+hijos|sin\s+compromiso)\s+(de\s+preferencia|solamente|excluyente|indispensable)\b/i, why: 'estado civil' },
  { re: /\b(cat[oó]lic[ao]|evang[eé]lic[ao]|cristian[ao]|adventista)s?\s+(de\s+preferencia|solamente|excluyente)\b/i, why: 'religión' },
  { re: /\b(s[oó]lo|solamente)\s+(peruan[ao]s?|extranjer[ao]s?|venezolan[ao]s?)\b|\bno\s+(venezolan[ao]s?|extranjer[ao]s?)\b/i, why: 'nacionalidad' },
  { re: /\b(sin\s+deudas|no\s+(estar\s+)?en\s+infocorp|historial\s+crediticio\s+limpio|sin\s+infocorp)\b/i, why: 'historial crediticio (Ley 31944)' },
];

/** Devuelve [] si está bien, o la lista de motivos detectados. */
export function findDiscrimination(...texts) {
  const t = texts.filter(Boolean).join(' \n ');
  const hits = new Set();
  RULES.forEach(r => { if (r.re.test(t)) hits.add(r.why); });
  return [...hits];
}
