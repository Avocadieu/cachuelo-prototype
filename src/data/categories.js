// ─── CATÁLOGO DE CATEGORÍAS (v0.18) ─────────────────────────────────────────
// • Los id deben coincidir con la tabla `categorias` de Supabase
//   (ver supabase/migrations/2026-10-10_v0.18_catalogo_perfiles.sql).
// • Los id 1–12 son los originales: NO cambiar su id ni su `label`
//   (hay cachuelos ya guardados con esos valores).
// • Cada categoría pertenece a un GRUPO (para navegar y filtrar) y trae
//   `keywords` para catalogar automáticamente lo que el usuario escribe
//   en "¿Qué servicio necesitas?" (ver suggestCategories).
// Inspirado en las ~100 categorías de Airtasker, adaptado a cómo se piden
// los cachuelos en el Perú (gasfitero, desmonte, hacer colas, impulsadora…).
import {
  Sparkles, Package, FileText, Palette, Wrench, ChefHat, Truck,
  GraduationCap, Leaf, Monitor, Camera, PartyPopper, Briefcase,
  Shirt, HeartHandshake, Bug, Droplets, Zap, PaintBucket, Hammer, KeyRound,
  BrickWall, Flame, Armchair, WashingMachine, Boxes, Car, Clock, Bike,
  Trees, Trash2, Code, Smartphone, Megaphone, Keyboard, Video, Languages,
  Brush, Music, Dumbbell, Utensils, Disc3, Flower2, Cake, Wine, Baby,
  HandHeart, PawPrint, Scissors, ClipboardList, Store, Layers, Search,
  Calculator, LayoutGrid, Home, Construction,
} from 'lucide-react';

// Grupos (orden = orden en pantalla)
export const CATEGORY_GROUPS = [
  { id: 'hogar',      label: 'Hogar y limpieza',        short: 'Hogar',       Icon: Home,           a: '#0EA5E9', b: '#38BDF8' },
  { id: 'oficios',    label: 'Reparaciones y oficios',  short: 'Oficios',     Icon: Construction,   a: '#F59E0B', b: '#FDE68A' },
  { id: 'transporte', label: 'Mudanza y transporte',    short: 'Transporte',  Icon: Truck,          a: '#F97316', b: '#FDBA74' },
  { id: 'vehiculos',  label: 'Vehículos',               short: 'Vehículos',   Icon: Car,            a: '#64748B', b: '#CBD5E1' },
  { id: 'exteriores', label: 'Jardín y exteriores',     short: 'Jardín',      Icon: Leaf,           a: '#22C55E', b: '#86EFAC' },
  { id: 'tecnologia', label: 'Tecnología',              short: 'Tecnología',  Icon: Monitor,        a: '#6366F1', b: '#A5B4FC' },
  { id: 'creativo',   label: 'Diseño, foto y textos',   short: 'Creativo',    Icon: Palette,        a: '#8B5CF6', b: '#C4B5FD' },
  { id: 'educacion',  label: 'Clases y tutorías',       short: 'Clases',      Icon: GraduationCap,  a: '#3B82F6', b: '#93C5FD' },
  { id: 'eventos',    label: 'Eventos y gastronomía',   short: 'Eventos',     Icon: PartyPopper,    a: '#EF4444', b: '#FCA5A5' },
  { id: 'cuidado',    label: 'Cuidado y bienestar',     short: 'Cuidado',     Icon: HeartHandshake, a: '#EC4899', b: '#F9A8D4' },
  { id: 'negocios',   label: 'Negocios y oficina',      short: 'Negocios',    Icon: Briefcase,      a: '#0F766E', b: '#5EEAD4' },
  { id: 'otros',      label: 'Otros',                   short: 'Otros',       Icon: LayoutGrid,     a: '#6B7280', b: '#9CA3AF' },
];

// Colores por grupo para las categorías nuevas (las originales conservan los suyos)
const G = Object.fromEntries(CATEGORY_GROUPS.map(g => [g.id, g]));
const tint = { hogar: '#E0F2FE', oficios: '#FFF7ED', transporte: '#FEF3C7', vehiculos: '#F1F5F9', exteriores: '#F0FDF4', tecnologia: '#F5F3FF', creativo: '#FDF4FF', educacion: '#EFF6FF', eventos: '#FFF1F2', cuidado: '#FDF2F8', negocios: '#ECFDF5', otros: '#F3F4F6' };
const mk = (id, label, group, Icon, emoji, keywords, colors) => ({
  id, label, group, Icon, emoji, keywords,
  iconBgA: colors?.[0] || G[group].a, iconBgB: colors?.[1] || G[group].b, color: colors?.[2] || tint[group],
});

export const CATEGORIES = [
  // ── Originales (id 1–12) ──
  mk(1,  'Limpieza',     'hogar',      Sparkles,      '🧹', ['limpieza', 'limpiar', 'aseo', 'limpieza profunda', 'desinfeccion', 'vidrios', 'alfombra', 'muebles tapizados', 'post obra'], ['#0EA5E9', '#38BDF8', '#E0F2FE']),
  mk(2,  'Mudanza',      'transporte', Package,       '📦', ['mudanza', 'mudar', 'mudarme', 'cargar muebles', 'cargador', 'estibador', 'trasladar muebles'], ['#F97316', '#FDBA74', '#FEF3C7']),
  mk(3,  'Redacción',    'creativo',   FileText,      '✍️', ['redaccion', 'redactar', 'articulos', 'textos', 'seo', 'corregir texto', 'copywriting', 'tesis', 'monografia', 'cv', 'curriculum'], ['#10B981', '#6EE7B7', '#F0FDF4']),
  mk(4,  'Diseño',       'creativo',   Palette,       '🎨', ['diseno', 'logo', 'grafico', 'flyer', 'banner', 'branding', 'afiche', 'tarjetas', 'menu', 'carta'], ['#8B5CF6', '#C4B5FD', '#FDF4FF']),
  mk(5,  'Reparaciones', 'oficios',    Wrench,        '🔧', ['reparacion', 'reparar', 'arreglar', 'maestro', 'mantenimiento', 'handyman', 'todero', 'chamba general', 'colgar', 'instalar repisa', 'cortinas', 'persianas'], ['#F59E0B', '#FDE68A', '#FFF7ED']),
  mk(6,  'Cocina',       'eventos',    ChefHat,       '🍳', ['cocinar', 'cocinero', 'chef', 'menu', 'almuerzos', 'comida', 'catering', 'parrilla', 'anticuchos', 'pachamanca'], ['#F43F5E', '#FDA4AF', '#FEF9C3']),
  mk(7,  'Delivery',     'transporte', Truck,         '🛵', ['delivery', 'reparto', 'repartir', 'llevar paquete', 'motorizado', 'courier', 'envio', 'recoger paquete', 'entrega'], ['#14B8A6', '#5EEAD4', '#ECFDF5']),
  mk(8,  'Tutorías',     'educacion',  GraduationCap, '📚', ['tutoria', 'clases', 'profesor', 'profe', 'matematica', 'refuerzo', 'tareas', 'examen', 'preuniversitario', 'fisica', 'quimica', 'nivelacion'], ['#3B82F6', '#93C5FD', '#EFF6FF']),
  mk(9,  'Jardinería',   'exteriores', Leaf,          '🌿', ['jardin', 'jardineria', 'jardinero', 'cortar pasto', 'grass', 'cesped', 'plantas', 'riego', 'macetas'], ['#22C55E', '#86EFAC', '#F0FDF4']),
  mk(10, 'Tecnología',   'tecnologia', Monitor,       '💻', ['tecnologia', 'computadora', 'laptop', 'pc', 'formatear', 'virus', 'windows', 'soporte tecnico', 'impresora', 'wifi', 'router', 'internet'], ['#6366F1', '#A5B4FC', '#F5F3FF']),
  mk(11, 'Fotografía',   'creativo',   Camera,        '📷', ['foto', 'fotografia', 'fotografo', 'sesion de fotos', 'fotos de producto', 'retrato', 'drone'], ['#EC4899', '#F9A8D4', '#FDF2F8']),
  mk(12, 'Eventos',      'eventos',    PartyPopper,   '🎉', ['evento', 'eventos', 'organizar fiesta', 'cumpleanos', 'matrimonio', 'boda', 'quinceanero', 'baby shower', 'wedding planner', 'anfitriona'], ['#EF4444', '#FCA5A5', '#FFF1F2']),

  // ── Hogar y limpieza ──
  mk(13, 'Lavado y planchado',           'hogar', WashingMachine, '👕', ['lavar ropa', 'lavanderia', 'planchar', 'planchado', 'lavado de ropa']),
  mk(14, 'Ayuda doméstica',              'hogar', Home,           '🏠', ['ayuda domestica', 'trabajadora del hogar', 'quehaceres', 'orden', 'organizar closet', 'ordenar casa', 'por horas']),
  mk(15, 'Fumigación y plagas',          'hogar', Bug,            '🪳', ['fumigacion', 'fumigar', 'plagas', 'cucarachas', 'ratas', 'roedores', 'termitas', 'chinches', 'desratizacion']),
  mk(16, 'Limpieza de tanques y cisternas', 'hogar', Droplets,    '💧', ['tanque', 'cisterna', 'tanque elevado', 'limpieza de tanque', 'pozo']),

  // ── Reparaciones y oficios ──
  mk(17, 'Gasfitería',          'oficios', Droplets,     '🚰', ['gasfiteria', 'gasfitero', 'plomero', 'fuga', 'cano', 'caño', 'desague', 'atoro', 'atorado', 'inodoro', 'terma', 'lavadero', 'grifo']),
  mk(18, 'Electricidad',        'oficios', Zap,          '⚡', ['electricidad', 'electricista', 'tomacorriente', 'enchufe', 'cableado', 'luces', 'lampara', 'llave termica', 'cortocircuito', 'pozo a tierra']),
  mk(19, 'Pintura',             'oficios', PaintBucket,  '🖌️', ['pintura', 'pintar', 'pintor', 'pared', 'fachada', 'empastar', 'empaste']),
  mk(20, 'Carpintería y melamina', 'oficios', Hammer,    '🪚', ['carpinteria', 'carpintero', 'melamina', 'madera', 'puerta', 'closet', 'repostero', 'mueble a medida']),
  mk(21, 'Armado de muebles',   'oficios', Armchair,     '🪑', ['armar mueble', 'armado', 'ensamblar', 'ropero', 'escritorio', 'cama', 'ikea', 'sodimac', 'promart']),
  mk(22, 'Cerrajería',          'oficios', KeyRound,     '🔑', ['cerrajero', 'cerrajeria', 'chapa', 'llave', 'cerradura', 'me quede afuera']),
  mk(23, 'Albañilería y construcción', 'oficios', BrickWall, '🧱', ['albanil', 'albañil', 'albanileria', 'construccion', 'tarrajeo', 'mayolica', 'piso', 'ceramico', 'drywall', 'remodelacion', 'cemento']),
  mk(24, 'Soldadura',           'oficios', Flame,        '🔥', ['soldadura', 'soldador', 'soldar', 'reja', 'estructura metalica', 'baranda', 'portón']),
  mk(25, 'Reparación de electrodomésticos', 'oficios', WashingMachine, '🔌', ['lavadora', 'refrigeradora', 'refri', 'microondas', 'cocina a gas', 'electrodomestico', 'televisor', 'tv', 'licuadora']),
  mk(26, 'Vidriería',           'oficios', Layers,       '🪟', ['vidrio', 'vidrieria', 'ventana', 'espejo', 'mampara']),

  // ── Mudanza y transporte ──
  mk(27, 'Fletes y carga',      'transporte', Truck,     '🚚', ['flete', 'camion', 'camioneta', 'carga', 'transporte de carga', 'trasladar']),
  mk(28, 'Embalaje',            'transporte', Boxes,     '📦', ['embalar', 'embalaje', 'empacar', 'desempacar', 'cajas']),
  mk(29, 'Chofer',              'transporte', Car,       '🚗', ['chofer', 'conductor', 'manejar', 'llevar al aeropuerto', 'movilidad']),
  mk(30, 'Mandados y colas',    'transporte', Clock,     '⏳', ['mandado', 'encargo', 'hacer cola', 'colas', 'tramite', 'trámite', 'recoger documento', 'banco', 'notaria', 'reniec', 'sunarp']),

  // ── Vehículos ──
  mk(31, 'Mecánica',            'vehiculos', Wrench,     '🛠️', ['mecanico', 'mecanica', 'auto', 'carro', 'motor', 'frenos', 'bateria', 'llanta', 'moto']),
  mk(32, 'Lavado de autos',     'vehiculos', Car,        '🚿', ['lavado de auto', 'lavar carro', 'encerado', 'detailing', 'tapiceria de auto']),
  mk(33, 'Reparación de bicicletas', 'vehiculos', Bike,  '🚲', ['bicicleta', 'bici', 'scooter', 'patineta electrica']),

  // ── Jardín y exteriores ──
  mk(34, 'Poda de árboles',     'exteriores', Trees,     '🌳', ['poda', 'podar', 'arbol', 'árbol', 'tala', 'ramas']),
  mk(35, 'Recojo de desmonte',  'exteriores', Trash2,    '🗑️', ['desmonte', 'basura', 'cachivaches', 'residuos', 'escombros', 'recojo']),

  // ── Tecnología ──
  mk(36, 'Desarrollo web y apps', 'tecnologia', Code,       '🧑‍💻', ['pagina web', 'web', 'app', 'aplicacion', 'programador', 'programacion', 'wordpress', 'tienda virtual', 'shopify', 'software']),
  mk(37, 'Reparación de celulares', 'tecnologia', Smartphone, '📱', ['celular', 'pantalla rota', 'iphone', 'samsung', 'tablet', 'bateria del celular']),
  mk(38, 'Redes sociales',      'tecnologia', Megaphone,  '📣', ['redes sociales', 'community manager', 'instagram', 'tiktok', 'facebook', 'publicaciones', 'contenido', 'ads']),
  mk(39, 'Digitación y data entry', 'tecnologia', Keyboard, '⌨️', ['digitar', 'digitacion', 'excel', 'data entry', 'transcribir', 'base de datos', 'tipear']),

  // ── Diseño, foto y textos ──
  mk(40, 'Video y edición',     'creativo', Video,       '🎬', ['video', 'editar video', 'edicion', 'reels', 'filmacion', 'youtube']),
  mk(41, 'Traducción',          'creativo', Languages,   '🌐', ['traduccion', 'traducir', 'traductor', 'ingles', 'quechua', 'portugues']),
  mk(42, 'Estampado y sublimación', 'creativo', Shirt,   '👕', ['estampado', 'sublimacion', 'polos', 'serigrafia', 'tazas', 'bordado']),
  mk(43, 'Manualidades y arte', 'creativo', Brush,       '🖍️', ['manualidades', 'mural', 'arte', 'pintar cuadro', 'decorar', 'globos']),

  // ── Clases y tutorías ──
  mk(44, 'Clases de idiomas',   'educacion', Languages,  '🗣️', ['clases de ingles', 'ingles', 'idioma', 'frances', 'portugues', 'quechua', 'conversacion']),
  mk(45, 'Clases de música',    'educacion', Music,      '🎸', ['guitarra', 'piano', 'canto', 'cajon', 'musica', 'violin', 'bateria musical']),
  mk(46, 'Entrenador personal y deporte', 'educacion', Dumbbell, '🏋️', ['entrenador', 'personal trainer', 'gimnasio', 'deporte', 'futbol', 'natacion', 'yoga', 'baile', 'zumba']),

  // ── Eventos y gastronomía ──
  mk(47, 'Mozos y personal para eventos', 'eventos', Utensils, '🤵', ['mozo', 'mesero', 'azafata', 'anfitrion', 'personal para evento', 'barra', 'staff']),
  mk(48, 'DJ y animación',      'eventos', Disc3,        '🎧', ['dj', 'animador', 'hora loca', 'payaso', 'show infantil', 'sonido', 'musica en vivo']),
  mk(49, 'Decoración de eventos', 'eventos', Flower2,    '🎈', ['decoracion', 'decorar', 'arreglos', 'globos', 'flores', 'mesa de dulces']),
  mk(50, 'Repostería',          'eventos', Cake,         '🎂', ['torta', 'pastel', 'reposteria', 'postres', 'bocaditos', 'cupcakes', 'keke']),
  mk(51, 'Bartender',           'eventos', Wine,         '🍸', ['bartender', 'barman', 'cocteles', 'pisco sour', 'tragos']),

  // ── Cuidado y bienestar ──
  mk(52, 'Cuidado de niños',    'cuidado', Baby,         '🧸', ['ninera', 'niñera', 'cuidar ninos', 'cuidado de ninos', 'babysitter', 'nana', 'recoger del colegio']),
  mk(53, 'Cuidado de adultos mayores', 'cuidado', HandHeart, '🤝', ['adulto mayor', 'abuelito', 'abuelita', 'acompanante', 'cuidador', 'enfermera', 'tecnica de enfermeria']),
  mk(54, 'Mascotas',            'cuidado', PawPrint,     '🐶', ['mascota', 'perro', 'gato', 'pasear perro', 'paseador', 'bano de perro', 'grooming', 'cuidar mascota']),
  mk(55, 'Belleza y peluquería', 'cuidado', Scissors,    '💇', ['peluqueria', 'corte de cabello', 'maquillaje', 'manicure', 'pedicure', 'unas', 'cejas', 'pestanas', 'barberia', 'peinado']),
  mk(56, 'Costura y arreglos de ropa', 'cuidado', Shirt, '🧵', ['costura', 'costurera', 'arreglo de ropa', 'basta', 'cierre', 'confeccion', 'disfraz']),

  // ── Negocios y oficina ──
  mk(57, 'Asistencia administrativa', 'negocios', ClipboardList, '🗂️', ['asistente', 'administrativo', 'archivo', 'agenda', 'secretaria', 'recepcion']),
  mk(58, 'Ventas e impulsación', 'negocios', Store,      '🛍️', ['impulsadora', 'impulsador', 'promotor', 'ventas', 'vendedor', 'feria', 'degustacion', 'telemarketing']),
  mk(59, 'Volanteo y publicidad', 'negocios', Megaphone, '📄', ['volantes', 'volanteo', 'repartir volantes', 'flyers', 'publicidad']),
  mk(60, 'Encuestas y cliente incógnito', 'negocios', Search, '🕵️', ['encuesta', 'encuestador', 'cliente incognito', 'mystery shopper', 'estudio de mercado']),
  mk(61, 'Contabilidad y trámites tributarios', 'negocios', Calculator, '🧾', ['contador', 'contabilidad', 'sunat', 'declaracion', 'renta', 'ruc', 'boletas', 'facturas']),

  // ── Otros ──
  mk(62, 'Otros',               'otros', LayoutGrid,     '✨', []),
];

export const FALLBACK_CATEGORY = { Icon: Briefcase, iconBgA: '#6B7280', iconBgB: '#9CA3AF', color: '#F3F4F6', emoji: '💼', group: 'otros' };
export const getCategory = (label) => CATEGORIES.find(c => c.label === label) || FALLBACK_CATEGORY;
export const getCategoryById = (id) => CATEGORIES.find(c => c.id === Number(id)) || null;
export const getGroup = (id) => CATEGORY_GROUPS.find(g => g.id === id) || CATEGORY_GROUPS[CATEGORY_GROUPS.length - 1];
export const groupOfLabel = (label) => getCategory(label).group || 'otros';
export const categoriesInGroup = (groupId) => CATEGORIES.filter(c => c.group === groupId);
/** Las más pedidas (para el carrusel del Inicio). */
export const POPULAR_LABELS = ['Limpieza', 'Gasfitería', 'Electricidad', 'Mudanza', 'Armado de muebles', 'Mascotas', 'Tutorías', 'Pintura', 'Delivery', 'Diseño', 'Mozos y personal para eventos', 'Tecnología'];

// ── Catalogación automática del texto libre ──────────────────────────────────
export const normalizeText = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Sugiere categorías para lo que el usuario escribió ("se me atoró el lavadero"
 * → Gasfitería). Devuelve [{ cat, score }] ordenado; vacío si no hay pistas.
 * Puntaje: frase clave completa (+3 por palabra) > coincidencia de raíz (+1).
 */
export function suggestCategories(text, limit = 3) {
  const t = ` ${normalizeText(text)} `;
  if (t.trim().length < 3) return [];
  const words = t.trim().split(' ').filter(w => w.length >= 5);
  const scored = CATEGORIES.filter(c => c.label !== 'Otros').map(cat => {
    let score = 0;
    const label = normalizeText(cat.label);
    if (t.includes(` ${label} `)) score += 2;
    for (const kw of cat.keywords) {
      const k = normalizeText(kw);
      if (!k || k === label) continue;
      if (t.includes(` ${k} `) || t.includes(` ${k}s `)) score += 3 * k.split(' ').length;
      else if (k.length >= 5 && words.some(w => w.startsWith(k.slice(0, 5)) || k.startsWith(w.slice(0, 5)))) score += 1;
    }
    if (cat.id > 12 && score >= 3) score += 1;   // desempate: la categoría específica gana a la general
    return { cat, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** Búsqueda de categorías por nombre/palabra clave (selector "Ver todas"). */
export function searchCategories(q) {
  const n = normalizeText(q);
  if (!n) return CATEGORIES;
  return CATEGORIES.filter(c => normalizeText(c.label).includes(n) || c.keywords.some(k => normalizeText(k).includes(n)) || normalizeText(getGroup(c.group).label).includes(n));
}

/** ¿El cachuelo coincide con un texto buscado? (título, servicio, categoría, grupo, descripción) */
export function matchesQuery(c, q) {
  const n = normalizeText(q);
  if (!n) return true;
  const hay = normalizeText([c.title, c.servicio, c.category, getGroup(groupOfLabel(c.category)).label, c.description, c.location].filter(Boolean).join(' '));
  return n.split(' ').every(w => hay.includes(w));
}
