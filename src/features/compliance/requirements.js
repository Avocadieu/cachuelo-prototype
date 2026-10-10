// ─── REQUISITOS / DOCUMENTOS QUE PUEDE PEDIR UN CACHUELO ─────────────────────
// Sugerencias por categoría. Deben ser requisitos OBJETIVOS ligados al trabajo
// (Ley 26772: no se puede pedir sexo, edad, apariencia, estado civil, etc.).
export const REQ_SUGGESTIONS = {
  Limpieza:     ['Experiencia en limpieza profunda', 'Productos y materiales propios'],
  Mudanza:      ['Brevete vigente (si debe manejar)', 'Vehículo propio'],
  Redacción:    ['Portafolio de textos', 'Manejo de SEO'],
  Diseño:       ['Portafolio', 'Equipo y software propio'],
  Reparaciones: ['Constancia o certificado técnico (electricidad, gasfitería)', 'Experiencia en trabajos en altura', 'Herramientas propias', 'Equipo de protección personal (EPP)'],
  Cocina:       ['Carné de sanidad vigente', 'Experiencia en cocina'],
  Delivery:     ['Brevete vigente', 'SOAT vigente', 'Vehículo propio'],
  Tutorías:     ['Constancia de estudios o título', 'Experiencia enseñando'],
  Jardinería:   ['Herramientas propias', 'Experiencia en poda'],
  Tecnología:   ['Portafolio o certificaciones', 'Equipo propio'],
  Fotografía:   ['Portafolio', 'Cámara y equipo propio'],
  Eventos:      ['Carné de sanidad (si manipula alimentos)', 'Uniforme propio'],
  // v0.18 · categorías nuevas
  'Fumigación y plagas':  ['Empresa con autorización sanitaria (DIGESA / municipalidad)', 'Equipo de protección personal (EPP)'],
  'Limpieza de tanques y cisternas': ['Certificado de saneamiento ambiental', 'Experiencia en espacios confinados'],
  'Gasfitería':           ['Herramientas propias', 'Experiencia comprobable en gasfitería'],
  'Electricidad':         ['Constancia o certificado técnico en electricidad', 'Herramientas y EPP propios'],
  'Pintura':              ['Herramientas propias', 'Experiencia en trabajos en altura'],
  'Carpintería y melamina': ['Herramientas propias', 'Portafolio de trabajos'],
  'Armado de muebles':    ['Herramientas propias (taladro, desarmadores)'],
  'Cerrajería':           ['Experiencia comprobable', 'Herramientas propias'],
  'Albañilería y construcción': ['Experiencia en construcción civil', 'EPP (casco, botas, guantes)'],
  'Soldadura':            ['Máquina de soldar propia', 'EPP para soldadura'],
  'Reparación de electrodomésticos': ['Constancia técnica', 'Herramientas propias'],
  'Fletes y carga':       ['Brevete vigente', 'SOAT vigente', 'Vehículo de carga propio'],
  'Chofer':               ['Brevete vigente (categoría según el vehículo)', 'Récord de conductor sin infracciones graves'],
  'Mecánica':             ['Herramientas propias', 'Experiencia comprobable'],
  'Poda de árboles':      ['Experiencia en trabajos en altura', 'EPP y arnés'],
  'Recojo de desmonte':   ['Vehículo propio', 'Disposición en botadero autorizado'],
  'Clases de idiomas':    ['Certificado de idioma (ej. B2 o superior)'],
  'Entrenador personal y deporte': ['Certificación de entrenador'],
  'Mozos y personal para eventos': ['Uniforme propio', 'Experiencia en eventos'],
  'Repostería':           ['Carné de sanidad vigente'],
  'Bartender':            ['Experiencia en barra', 'Carné de sanidad vigente'],
  'Cuidado de niños':     ['Referencias de trabajos anteriores', 'Curso de primeros auxilios'],
  'Cuidado de adultos mayores': ['Título o constancia de técnico(a) en enfermería', 'Curso de primeros auxilios'],
  'Mascotas':             ['Experiencia con mascotas'],
  'Belleza y peluquería': ['Certificado de cosmetología', 'Implementos propios'],
  'Contabilidad y trámites tributarios': ['Contador colegiado (si firma)', 'Experiencia con SUNAT'],
};
export const GENERIC_REQS = ['Licencia o permiso específico', 'Certificado de capacitación'];

// Categorías con riesgo físico: aviso de seguridad al publicar y casilla al postular
export const RISKY_CATEGORIES = [
  'Reparaciones', 'Mudanza', 'Jardinería', 'Delivery',
  // v0.18
  'Electricidad', 'Gasfitería', 'Albañilería y construcción', 'Soldadura', 'Pintura', 'Poda de árboles',
  'Fletes y carga', 'Chofer', 'Mecánica', 'Fumigación y plagas', 'Limpieza de tanques y cisternas',
  'Cuidado de niños', 'Cuidado de adultos mayores', 'Recojo de desmonte',
];
export const isRisky = (cat) => RISKY_CATEGORIES.includes(cat);
