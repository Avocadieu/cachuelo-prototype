// ─── MUNDO DE SIMULACIÓN (solo modo demo) ───────────────────────────────────
// Personas ficticias, cachuelos abiertos, historial de trabajos completados,
// reseñas en ambos sentidos, ofertas y portafolios, para probar la app de punta
// a punta sin Supabase. Todo vive en este navegador (localStorage) y se puede
// reiniciar desde el Simulador.
//
// Reglas que esta simulación respeta (las mismas que tendrá producción):
//  • Una misma cuenta puede PUBLICAR (contratante) y POSTULAR (trabajador).
//  • Las reseñas solo existen tras un cachuelo completado y van en ambos
//    sentidos: el contratante califica al trabajador y viceversa.
//  • El portafolio muestra fotos de cachuelos completados ("verificado") o de
//    experiencia externa (marcada como "no verificada").
import { useEffect, useState } from 'react';
import { demoStore } from '../../lib/demoBackend.js';
import { readDemoCachuelos, DEMO_EVENT } from '../../data/cachuelosApi.js';
import { getCategory, groupOfLabel } from '../../data/categories.js';
import { artPhoto } from './art.js';

const KEY = 'cachuelo_sim_v1';
const OFFERS_KEY = 'cachuelo_demo_ofertas_v1';        // ofertas enviadas desde el formulario (offersApi)
const CACH_KEY = 'cachuelo_demo_cachuelos_v1';        // cachuelos publicados en demo (cachuelosApi)
const PAY_KEY = 'cachuelo_pagos_demo_v1';             // pagos demo (paymentStore)
export const SIM_EVENT = 'cachuelo:sim';
export const SELF_ID = 'demo-user';

const DAY = 864e5, HOUR = 36e5;

// ── PERSONAS ─────────────────────────────────────────────────────────────────
// role: 'trabajador' | 'contratante' | 'ambos' (solo para la etiqueta del Simulador;
// en el perfil los roles se deducen de la actividad real).
export const PERSONAS = [
  { id: 'p-ana', nombre: 'Ana', apellido: 'García', district: 'Miraflores', departamento: 'Lima', role: 'contratante', palette: 3, joined: 210, response: 'Responde en ~1 h',
    bio: 'Trabajo en oficina y alquilo un depa por Airbnb. Contrato limpieza, gasfitería y fotos. Pago siempre con Pago Protegido.', skills: [] },
  { id: 'p-luis', nombre: 'Luis', apellido: 'Quispe', district: 'San Juan de Lurigancho', departamento: 'Lima', role: 'trabajador', palette: 0, joined: 320, response: 'Responde en ~20 min',
    bio: 'Gasfitero y electricista con 12 años de experiencia. Instalo termas, destoro desagües y hago cableado. Llevo mis herramientas y EPP.', skills: ['Gasfitería', 'Electricidad', 'Reparaciones', 'Armado de muebles'] },
  { id: 'p-rosa', nombre: 'Rosa', apellido: 'Huamán', district: 'Breña', departamento: 'Lima', role: 'ambos', palette: 4, joined: 260, response: 'Responde en ~30 min',
    bio: 'Repostera con taller propio ("Dulce Rosa"). Hago tortas y bocaditos por encargo, y contrato ayuda para mi taller cuando tengo pedidos grandes.', skills: ['Repostería', 'Cocina', 'Eventos'] },
  { id: 'p-diego', nombre: 'Diego', apellido: 'Torres', district: 'Pueblo Libre', departamento: 'Lima', role: 'ambos', palette: 1, joined: 180, response: 'Responde en ~2 h',
    bio: 'Diseñador gráfico y fotógrafo freelance. Logos, fotos de producto y de platos. A veces contrato ayuda para armar mi estudio.', skills: ['Diseño', 'Fotografía', 'Video y edición', 'Redes sociales'] },
  { id: 'p-mila', nombre: 'Milagros', apellido: 'Pérez', district: 'Surquillo', departamento: 'Lima', role: 'trabajador', palette: 2, joined: 400, response: 'Responde en ~15 min',
    bio: 'Limpieza profunda de casas y oficinas, y paseo de mascotas. Puntual y ordenada. Llevo mis productos si lo necesitas.', skills: ['Limpieza', 'Mascotas', 'Ayuda doméstica', 'Lavado y planchado'] },
  { id: 'p-jorge', nombre: 'Jorge', apellido: 'Mendoza', district: 'Los Olivos', departamento: 'Lima', role: 'trabajador', palette: 0, joined: 150, response: 'Responde en ~1 h',
    bio: 'Tengo camión de 3.5 T. Mudanzas, fletes y traslados en Lima Metropolitana con ayudante.', skills: ['Mudanza', 'Fletes y carga', 'Embalaje', 'Delivery'] },
  { id: 'p-kelly', nombre: 'Kelly', apellido: 'Rojas', district: 'La Victoria', departamento: 'Lima', role: 'trabajador', palette: 3, joined: 40, response: 'Responde en ~40 min',
    bio: 'Estudiante de enfermería. Hago limpieza, cuido mascotas y niños los fines de semana.', skills: ['Limpieza', 'Mascotas', 'Cuidado de niños'] },
  { id: 'p-brayan', nombre: 'Brayan', apellido: 'Chávez', district: 'Comas', departamento: 'Lima', role: 'trabajador', palette: 1, joined: 30, response: 'Responde en ~1 h',
    bio: 'Ayudante de mudanzas, armado de muebles y reparto en moto. Tengo brevete y SOAT vigente.', skills: ['Armado de muebles', 'Mudanza', 'Delivery', 'Mandados y colas'] },
  { id: 'p-sofia', nombre: 'Sofía', apellido: 'Vargas', district: 'Jesús María', departamento: 'Lima', role: 'trabajador', palette: 4, joined: 90, response: 'Responde en ~3 h',
    bio: 'Profesora de matemática e inglés (B2). Redacto y corrijo textos.', skills: ['Tutorías', 'Clases de idiomas', 'Redacción', 'Redes sociales'] },
  { id: 'p-carlos', nombre: 'Carlos', apellido: 'Ríos', district: 'San Isidro', departamento: 'Lima', role: 'contratante', palette: 0, joined: 120, response: 'Responde en ~4 h',
    bio: 'Administro una oficina pequeña en San Isidro. Contrato mudanzas, electricistas y limpieza.', skills: [] },
  { id: 'p-patricia', nombre: 'Patricia', apellido: 'Mendoza', district: 'Santiago de Surco', departamento: 'Lima', role: 'contratante', palette: 2, joined: 300, response: 'Responde en ~1 h',
    bio: 'Mamá de dos. Busco profes, gasfiteros y ayuda con trámites.', skills: [] },
  { id: 'p-startup', nombre: 'StartupPE', apellido: '', district: 'Miraflores', departamento: 'Lima', role: 'contratante', palette: 1, joined: 240, response: 'Responde en ~5 h', business: true,
    bio: 'Startup fintech peruana. Contratamos redacción, community managers y catering para eventos.', skills: [] },
  { id: 'p-sabores', nombre: 'Sabores del Perú', apellido: '', district: 'Lince', departamento: 'Lima', role: 'contratante', palette: 3, joined: 200, response: 'Responde en ~6 h', business: true,
    bio: 'Restaurante de comida criolla en Lince.', skills: [] },
  { id: 'p-tienda', nombre: 'TiendaLima', apellido: '', district: 'Lince', departamento: 'Lima', role: 'contratante', palette: 2, joined: 160, response: 'Responde en ~2 h', business: true,
    bio: 'Tienda online de ropa. Contratamos fotos, delivery e impulsadoras para ferias.', skills: [] },
  { id: 'p-lucia', nombre: 'Lucía', apellido: 'Paredes', district: 'Arequipa', departamento: 'Arequipa', role: 'contratante', palette: 4, joined: 100, response: 'Responde en ~2 h',
    bio: 'Arequipeña, tengo una tienda de artesanías en Cayma.', skills: [] },
  { id: 'p-moche', nombre: 'Eventos Moche', apellido: '', district: 'Trujillo', departamento: 'La Libertad', role: 'contratante', palette: 0, joined: 280, response: 'Responde en ~3 h', business: true,
    bio: 'Organizamos matrimonios y quinceañeros en Trujillo.', skills: [] },
];
export const getPersona = (id) => PERSONAS.find(p => p.id === id) || null;
export const isPersonaId = (id) => !!getPersona(id);
export const AVATAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
export const fullName = (p) => [p?.nombre, p?.apellido].filter(Boolean).join(' ') || 'Usuario';
export const initialsOf = (p) => (p?.business ? (p.nombre || 'U').slice(0, 2) : `${p?.nombre?.[0] || ''}${p?.apellido?.[0] || ''}`).toUpperCase() || 'U';
export const personaToUser = (p) => ({ id: p.id, nombre: p.nombre, apellido: p.apellido, email: `${p.id.slice(2)}@demo.cachuelo.pe`, persona: true });

// ── HISTORIAL (cachuelos ya completados) ─────────────────────────────────────
// rw = reseña del contratante AL trabajador · rc = reseña del trabajador AL contratante
const H = (id, title, category, ownerId, workerId, price, daysAgo, district, rw, rc, extra = {}) =>
  ({ id, title, category, ownerId, workerId, price, daysAgo, district, rw, rc, estado: 'completado', ...extra });
const HISTORY = [
  H('h1', 'Limpieza profunda de depa (3 hab.)', 'Limpieza', 'p-ana', 'p-mila', 90, 60, 'Miraflores', [5, 'Impecable. Llegó puntual y dejó todo brillando, hasta las ventanas.', ['Puntual', 'Buen trabajo']], [5, 'Muy amable, instrucciones claras y pagó al toque.', ['Pago rápido', 'Instrucciones claras']]),
  H('h2', 'Limpieza después de fiesta', 'Limpieza', 'p-ana', 'p-mila', 120, 35, 'Miraflores', [5, 'Otra vez excelente, la recontrataré.', ['Recomendado']], [5, 'Siempre un gusto trabajar con Ana.', ['Buen trato']]),
  H('h3', 'Limpieza mensual del Airbnb', 'Limpieza', 'p-ana', 'p-mila', 90, 12, 'Miraflores', [5, 'Ya es de confianza. Todo perfecto.', ['Puntual', 'Recomendado']], [5, 'Excelente clienta.', ['Pago rápido']]),
  H('h4', 'Cambio de grifería de cocina', 'Gasfitería', 'p-ana', 'p-luis', 70, 40, 'Miraflores', [5, 'Resolvió la fuga en 30 minutos y dejó limpio.', ['Buen trabajo', 'Puntual']], [5, 'Clienta muy clara con lo que necesitaba.', ['Instrucciones claras']]),
  H('h5', 'Fotos para mi Airbnb', 'Fotografía', 'p-ana', 'p-diego', 250, 25, 'Miraflores', [4, 'Buenas fotos, la entrega demoró un día más de lo acordado.', ['Buen trabajo']], [5, 'Depa listo y ordenado para la sesión.', ['Lugar accesible']]),
  H('h6', 'Mudanza de oficina pequeña', 'Mudanza', 'p-carlos', 'p-jorge', 180, 50, 'San Isidro', [5, 'Cuidadosos con los equipos, nada se dañó.', ['Cuidadoso', 'Puntual']], [4, 'Buen trato. El edificio no tenía montacargas como se indicó.', ['Buen trato']]),
  H('h7', 'Instalar 6 luminarias LED', 'Electricidad', 'p-carlos', 'p-luis', 150, 20, 'San Isidro', [5, 'Muy profesional, trajo su escalera y EPP.', ['Buen trabajo', 'Recomendado']], [5, 'Pagó con Pago Protegido y liberó el mismo día.', ['Pago rápido']]),
  H('h8', 'Llevar horno industrial a mi taller', 'Fletes y carga', 'p-rosa', 'p-jorge', 140, 30, 'Breña', [5, 'Llegó con ayudante y rampa. ¡Gracias!', ['Cuidadoso']], [5, 'Señora Rosa muy amable, hasta nos invitó un keke.', ['Buen trato']]),
  H('h9', 'Logo para mi repostería "Dulce Rosa"', 'Diseño', 'p-rosa', 'p-diego', 220, 70, 'Breña', [5, 'Me encantó el logo, captó la idea a la primera.', ['Creativo', 'Comunicación clara']], [5, 'Feedback rápido y concreto.', ['Instrucciones claras']]),
  H('h10', 'Instalar terma eléctrica en taller', 'Gasfitería', 'p-rosa', 'p-luis', 160, 8, 'Breña', [5, 'Instalación limpia y me explicó cómo usarla.', ['Buen trabajo']], [5, 'Todo listo cuando llegué.', ['Lugar accesible']]),
  H('h11', 'Torta de 3 pisos para quinceañero', 'Repostería', 'p-patricia', 'p-rosa', 380, 45, 'Santiago de Surco', [5, 'Deliciosa y tal cual la foto de referencia.', ['Buen trabajo', 'Recomendado']], [5, 'Patricia coordinó todo con tiempo.', ['Instrucciones claras']]),
  H('h12', 'Bocaditos para baby shower (100 und.)', 'Repostería', 'p-ana', 'p-rosa', 200, 18, 'Miraflores', [5, 'Todos preguntaron quién los hizo.', ['Buen trabajo']], [5, 'Pagó con Pago Protegido, cero problemas.', ['Pago rápido']]),
  H('h13', 'Coffee break para 30 personas', 'Cocina', 'p-startup', 'p-rosa', 300, 15, 'Miraflores', [4, 'Rico todo; llegó 15 min tarde por el tráfico.', ['Buen trabajo']], [5, 'Equipo muy organizado.', ['Buen trato']]),
  H('h14', 'Flyers para mi tienda', 'Diseño', 'p-lucia', 'p-diego', 120, 22, 'Arequipa', [5, 'Rápido y con buen gusto.', ['Creativo']], [5, 'Clienta clarísima.', ['Instrucciones claras']], { remote: true }),
  H('h15', 'Pasear a Toby (2 semanas)', 'Mascotas', 'p-patricia', 'p-mila', 150, 28, 'Santiago de Surco', [5, 'Toby la adora. Mandaba fotos de cada paseo.', ['Puntual', 'Comunicación clara']], [5, 'Toby es un amor.', ['Buen trato']]),
  H('h16', 'Fotos de platos para la carta', 'Fotografía', 'p-sabores', 'p-diego', 300, 33, 'Lince', [5, 'Las fotos subieron nuestros pedidos en delivery.', ['Buen trabajo']], [4, 'Cambiaron el horario a último momento.', []]),
  H('h17', 'Delivery de 20 pedidos en Lima', 'Delivery', 'p-tienda', 'p-jorge', 160, 10, 'Lince', [4, 'Un pedido llegó tarde, pero avisó a tiempo.', ['Comunicación clara']], [5, 'Pedidos bien embalados y direcciones claras.', ['Instrucciones claras']]),
  H('h18', 'Traslado de archivadores', 'Fletes y carga', 'p-carlos', 'p-jorge', 80, 44, 'San Isidro', null, null, { estado: 'cancelado' }),
  H('h19', 'Llevar sofá a casa de mi mamá', 'Fletes y carga', 'p-ana', 'p-jorge', 90, 5, 'Miraflores', [5, 'Rápido y amable.', ['Puntual']], [5, 'Todo coordinado.', ['Buen trato']]),
  H('h20', 'Limpieza de taller de repostería', 'Limpieza', 'p-rosa', 'p-mila', 100, 3, 'Breña', [5, 'Dejó el taller listo para producción.', ['Buen trabajo']], [5, 'Rosa es muy ordenada, así da gusto.', ['Buen trato']]),
  H('h21', 'Destorar desagüe del baño', 'Gasfitería', 'p-patricia', 'p-luis', 60, 55, 'Santiago de Surco', [5, 'Llegó el mismo día. Salvador.', ['Puntual']], [5, 'Muy amable.', ['Buen trato']]),
  H('h22', 'Revisión de tablero eléctrico', 'Electricidad', 'p-startup', 'p-luis', 200, 65, 'Miraflores', [4, 'Buen diagnóstico, faltó dejar un informe escrito.', ['Buen trabajo']], [5, 'Oficina ordenada y pago puntual.', ['Pago rápido']]),
  H('h23', 'Armar escritorio y estante para estudio', 'Armado de muebles', 'p-diego', 'p-brayan', 60, 14, 'Pueblo Libre', [5, 'Rápido y no dejó ni un tornillo suelto.', ['Buen trabajo']], [5, 'Me explicó bien qué muebles eran.', ['Instrucciones claras']]),
  H('h24', 'Reparto de 12 pedidos en moto', 'Delivery', 'p-tienda', 'p-brayan', 120, 6, 'Lince', [5, 'Todo entregado antes de las 6 pm.', ['Puntual']], [5, 'Buena coordinación.', ['Pago rápido']]),
  H('h25', 'Clases de matemática (8 sesiones)', 'Tutorías', 'p-patricia', 'p-sofia', 200, 40, 'Santiago de Surco', [5, 'Mi hijo subió de 11 a 16.', ['Recomendado']], [5, 'Familia muy comprometida.', ['Buen trato']]),
  H('h26', 'Limpieza de oficina', 'Limpieza', 'p-carlos', 'p-kelly', 110, 9, 'San Isidro', [4, 'Bien, aunque faltó la cocina.', []], [5, 'Me dio las llaves y todo claro.', ['Instrucciones claras']]),
];

// ── CACHUELOS ABIERTOS (feed) ────────────────────────────────────────────────
// id 1–8 = los del prototipo original (ahora con dueño real para ver su perfil)
const O = (id, ownerId, title, category, price, district, extra = {}) => ({
  id, ownerId, title, category, price, district, departamento: 'Lima', payType: 'Fijo', duration: '1 día',
  type: 'Presencial', remote: false, featured: false, requisitos: [], hoursAgo: 5, ...extra,
});
const OPEN = [
  O(1, 'p-ana', 'Limpieza de departamento en Miraflores', 'Limpieza', 80, 'Miraflores', { featured: true, servicio: 'Limpieza profunda (3 habitaciones)', hoursAgo: 3, schedule: 'Sábado, 8 am – 5 pm', description: 'Necesito limpieza profunda de departamento de 3 habitaciones. Incluye baños, cocina y áreas comunes. Se proveen materiales.' }),
  O(2, 'p-startup', 'Redacción de artículos SEO (10 artículos)', 'Redacción', 350, null, { type: 'Remoto', remote: true, featured: true, duration: '2 semanas', hoursAgo: 20, schedule: 'Flexible – entrega en 14 días', requisitos: ['Portafolio de textos', 'Manejo de SEO'], description: 'Redacción de 10 artículos de 1200 palabras sobre tecnología y finanzas. Se requiere manejo de SEO básico.' }),
  O(3, 'p-carlos', 'Mudanza de oficina – San Isidro', 'Mudanza', 150, 'San Isidro', { hoursAgo: 9, schedule: 'Domingo, 7 am – 2 pm', description: 'Mudanza de una oficina pequeña. Se necesitan 2 personas. Hay ascensor en el edificio.' }),
  O(4, 'p-sabores', 'Diseño de logo para restaurante', 'Diseño', 200, null, { type: 'Remoto', remote: true, duration: '5 días', hoursAgo: 30, schedule: 'Flexible – entrega en 5 días', description: 'Diseño de logo profesional + manual de marca básico para restaurante de comida criolla. Incluye 3 revisiones.' }),
  O(5, 'p-patricia', 'Clases de matemáticas para secundaria', 'Tutorías', 400, 'Santiago de Surco', { duration: '1 mes', hoursAgo: 26, schedule: '2 veces por semana', description: '8 clases de 2 h para alumno de 4to de secundaria. Álgebra y geometría. Horario a coordinar entre semana.' }),
  O(6, 'p-tienda', 'Fotografía de producto para e-commerce', 'Fotografía', 180, 'Lince', { featured: true, hoursAgo: 14, schedule: 'A coordinar esta semana', requisitos: ['Portafolio', 'Cámara y equipo propio'], description: 'Sesión de fotos de 40 productos de ropa. Fondo blanco y lifestyle. Se provee estudio casero.' }),
  O(7, 'p-lucia', 'Ayudante para mudanza en Cayma', 'Mudanza', 120, 'Arequipa', { departamento: 'Arequipa', hoursAgo: 7, schedule: 'Sábado, 8 am – 1 pm', description: 'Necesito 1 persona para cargar muebles de un 2do piso a camión. Mañana completa.' }),
  O(8, 'p-moche', 'Mesero para evento (matrimonio)', 'Mozos y personal para eventos', 90, 'Trujillo', { departamento: 'La Libertad', featured: true, hoursAgo: 40, servicio: 'Meseros con experiencia (3 personas)', requisitos: ['Uniforme propio', 'Experiencia en eventos'], schedule: 'Viernes, 6 pm – 2 am', description: 'Buscamos 3 meseros con experiencia para un matrimonio de 150 personas. Uniforme negro.' }),
  O(9, 'p-rosa', 'Ayudante de repostería para pedido grande', 'Repostería', 70, 'Breña', { hoursAgo: 2, servicio: 'Ayuda en taller: decorar y empacar', requisitos: ['Carné de sanidad vigente'], schedule: 'Jueves, 9 am – 4 pm', description: 'Tengo un pedido de 300 bocaditos. Necesito una persona para decorar y empacar en mi taller.' }),
  O(10, 'p-ana', 'Pasear a mi perro Max (lunes a viernes)', 'Mascotas', 150, 'Miraflores', { duration: '1 semana', hoursAgo: 6, servicio: 'Paseo de perro 45 min diarios', schedule: 'L–V, 7 am', description: 'Max es un labrador de 3 años, tranquilo. Paseo de 45 minutos cada mañana por el malecón.' }),
  O(11, 'p-carlos', 'Instalar 4 tomacorrientes y revisar tablero', 'Electricidad', 120, 'San Isidro', { hoursAgo: 11, requisitos: ['Constancia o certificado técnico en electricidad', 'Herramientas y EPP propios'], schedule: 'Sábado en la mañana', description: 'Oficina de 60 m². Instalar 4 tomacorrientes dobles y revisar que el tablero tenga llaves diferenciales.' }),
  O(12, 'p-patricia', 'Destorar lavadero de cocina', 'Gasfitería', 60, 'Santiago de Surco', { hoursAgo: 1, servicio: 'Lavadero atorado', schedule: 'Hoy o mañana', description: 'El lavadero de la cocina no baja. Ya probé con desatorador. Necesito alguien con herramientas.' }),
  O(13, 'p-rosa', 'Armar 2 roperos de melamina', 'Armado de muebles', 90, 'Breña', { hoursAgo: 4, servicio: 'Armado de roperos (ya tengo las piezas)', schedule: 'Fin de semana', description: 'Compré 2 roperos de 3 puertas. Tengo las piezas, tornillos y el manual.' }),
  O(14, 'p-startup', 'Community manager por 3 semanas', 'Redes sociales', 600, null, { type: 'Remoto', remote: true, duration: '3 semanas', hoursAgo: 28, requisitos: ['Portafolio o certificaciones'], schedule: 'Lunes a viernes', description: 'Manejo de Instagram y LinkedIn: 12 publicaciones y respuestas a mensajes durante el lanzamiento.' }),
  O(15, 'p-patricia', 'Hacer cola en SUNARP y recoger documento', 'Mandados y colas', 40, 'Cercado de Lima', { hoursAgo: 8, servicio: 'Trámite: recoger copia literal', schedule: 'Martes, 8 am', description: 'Recoger una copia literal ya pagada. Te doy la carta poder simple y el número de solicitud.' }),
  O(16, 'p-tienda', 'Impulsadora para feria del fin de semana', 'Ventas e impulsación', 160, 'Jesús María', { duration: '2 días', hoursAgo: 16, schedule: 'Sábado y domingo, 11 am – 7 pm', description: 'Atender nuestro stand de ropa en la feria del Campo de Marte. Experiencia en ventas.' }),
  O(17, 'p-lucia', 'Clases de inglés conversacional (8 sesiones)', 'Clases de idiomas', 240, null, { type: 'Remoto', remote: true, duration: '1 mes', hoursAgo: 50, requisitos: ['Certificado de idioma (ej. B2 o superior)'], schedule: 'Martes y jueves, 7 pm', description: 'Quiero practicar inglés para atender turistas en mi tienda. Clases por videollamada.' }),
  O(18, 'p-ana', 'Recoger desmonte de remodelación', 'Recojo de desmonte', 130, 'Miraflores', { hoursAgo: 22, servicio: '15 sacos de desmonte', requisitos: ['Vehículo propio', 'Disposición en botadero autorizado'], schedule: 'Esta semana', description: '15 sacos de desmonte de un baño remodelado. Están en la cochera del primer piso.' }),
];

// ── OFERTAS YA ENVIADAS (pendientes) ─────────────────────────────────────────
const SEED_OFFERS = [
  { id: 'so1', cachueloId: 1, workerId: 'p-mila', monto: 80, hoursAgo: 2.5, mensaje: 'Hola Ana, puedo el sábado desde las 8. Ya conozco tu edificio y llevo mis productos de limpieza.' },
  { id: 'so2', cachueloId: 1, workerId: 'p-kelly', monto: 95, hoursAgo: 1.5, mensaje: 'Para 3 habitaciones con baños y cocina propongo S/ 95, incluye limpieza de ventanas por dentro.' },
  { id: 'so3', cachueloId: 3, workerId: 'p-jorge', monto: 170, hoursAgo: 7, mensaje: 'Tengo camión de 3.5 T y voy con ayudante. Embalaje de equipos incluido.' },
  { id: 'so4', cachueloId: 3, workerId: 'p-brayan', monto: 150, hoursAgo: 5, mensaje: 'Puedo ayudar con la carga y descarga. Tengo experiencia en mudanzas de oficina.' },
  { id: 'so5', cachueloId: 10, workerId: 'p-mila', monto: 150, hoursAgo: 4, mensaje: 'Paseo perros hace 3 años. Te mando foto y ubicación de cada paseo.' },
  { id: 'so6', cachueloId: 10, workerId: 'p-kelly', monto: 140, hoursAgo: 3, mensaje: 'Vivo cerca y me encantan los labradores. Puedo empezar el lunes.' },
  { id: 'so7', cachueloId: 11, workerId: 'p-luis', monto: 140, hoursAgo: 9, mensaje: 'Soy electricista con constancia técnica. Los tomacorrientes van con línea a tierra; por eso propongo S/ 140.' },
  { id: 'so8', cachueloId: 12, workerId: 'p-luis', monto: 60, hoursAgo: 0.6, mensaje: 'Puedo ir hoy en la tarde. Llevo sonda y desatorador profesional.' },
  { id: 'so9', cachueloId: 13, workerId: 'p-brayan', monto: 90, hoursAgo: 3, mensaje: 'Armo roperos de melamina seguido. Llevo taladro y nivel.' },
  { id: 'so10', cachueloId: 13, workerId: 'p-luis', monto: 110, hoursAgo: 2, mensaje: 'Incluyo fijar los roperos a la pared para que no se volteen.' },
  { id: 'so11', cachueloId: 5, workerId: 'p-sofia', monto: 400, hoursAgo: 20, mensaje: 'Soy profesora de matemática. Trabajo con fichas y simulacros de examen.' },
  { id: 'so12', cachueloId: 14, workerId: 'p-diego', monto: 650, hoursAgo: 24, mensaje: 'Incluyo diseño de las 12 piezas y un reel de lanzamiento.' },
  { id: 'so13', cachueloId: 14, workerId: 'p-sofia', monto: 600, hoursAgo: 18, mensaje: 'Redacto los textos y respondo mensajes en el día.' },
  { id: 'so14', cachueloId: 17, workerId: 'p-sofia', monto: 240, hoursAgo: 40, mensaje: 'Tengo B2 certificado y enseño inglés para atención al cliente.' },
  { id: 'so15', cachueloId: 9, workerId: 'p-kelly', monto: 70, hoursAgo: 1, mensaje: 'Tengo carné de sanidad vigente y experiencia empacando en una panadería.' },
];

// ── PORTAFOLIO DE EJEMPLO ────────────────────────────────────────────────────
const SEED_PORTFOLIO = [
  { id: 'sp1', userId: 'p-mila', rol: 'trabajador', jobId: 'h2', photos: 3, descripcion: 'Limpieza después de una fiesta de 40 personas: cocina, sala, 2 baños y terraza. 5 horas de trabajo.' },
  { id: 'sp2', userId: 'p-mila', rol: 'trabajador', jobId: 'h15', photos: 2, descripcion: 'Paseos diarios de 45 minutos con Toby. Enviaba foto y ubicación en cada paseo.' },
  { id: 'sp3', userId: 'p-luis', rol: 'trabajador', jobId: 'h10', photos: 3, descripcion: 'Instalación de terma eléctrica de 80 L con llave termomagnética independiente y prueba de fugas.' },
  { id: 'sp4', userId: 'p-luis', rol: 'trabajador', jobId: 'h7', photos: 2, descripcion: 'Cambio de 6 fluorescentes por paneles LED y nuevo interruptor por ambiente.' },
  { id: 'sp5', userId: 'p-diego', rol: 'trabajador', jobId: 'h9', photos: 2, descripcion: 'Logo, paleta de colores y versión para stickers de la repostería Dulce Rosa.' },
  { id: 'sp6', userId: 'p-diego', rol: 'trabajador', jobId: 'h16', photos: 3, descripcion: '24 fotos de platos con luz natural para la carta y el delivery.' },
  { id: 'sp7', userId: 'p-jorge', rol: 'trabajador', jobId: 'h8', photos: 2, descripcion: 'Traslado de horno industrial de 180 kg con rampa y faja. Sin daños.' },
  { id: 'sp8', userId: 'p-rosa', rol: 'trabajador', jobId: 'h11', photos: 3, descripcion: 'Torta de 3 pisos de vainilla y manjar con flores de azúcar para 120 personas.' },
  { id: 'sp9', userId: 'p-rosa', rol: 'contratante', jobId: 'h9', photos: 1, descripcion: 'Contraté a Diego para el logo de mi repostería. Así quedó en mi letrero.' },
  { id: 'sp10', userId: 'p-ana', rol: 'contratante', jobId: 'h5', photos: 2, descripcion: 'Las fotos que tomó Diego para mi Airbnb. Las reservas subieron ese mes.' },
  { id: 'sp11', userId: 'p-rosa', rol: 'contratante', jobId: 'h10', photos: 1, descripcion: 'Terma nueva en mi taller, instalada por Luis.' },
];

// ── ESTADO EN EL NAVEGADOR ───────────────────────────────────────────────────
const emptyState = () => ({ v: 1, seededAt: Date.now(), status: {}, offers: [], offerStatus: {}, reviews: [], portfolio: [], hiddenPortfolio: [], profiles: {}, completed: [] });
const load = () => {
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) return s; } catch { /* corrupto: se recrea */ }
  const s = emptyState(); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* sin espacio */ }
  return s;
};
let state = null;
const S = () => (state ||= load());
const emit = () => window.dispatchEvent(new CustomEvent(SIM_EVENT));
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(S())); }
  catch { throw new Error('No hay espacio en este navegador para guardar más fotos de prueba. Borra alguna experiencia o reinicia la simulación.'); }
  emit();
};
const at = (msAgo) => new Date(S().seededAt - msAgo).toISOString();

/** Hook: vuelve a renderizar cuando cambia algo de la simulación (ofertas, pagos, publicaciones). */
export function useSim() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const on = () => setN(x => x + 1);
    ['cachuelo:sim', DEMO_EVENT, 'cachuelo:payments', 'storage'].forEach(e => window.addEventListener(e, on));
    return () => ['cachuelo:sim', DEMO_EVENT, 'cachuelo:payments', 'storage'].forEach(e => window.removeEventListener(e, on));
  }, []);
  return n;
}

// ── PERFILES ─────────────────────────────────────────────────────────────────
/** Datos básicos de cualquier usuario de la simulación (persona o tu cuenta demo). */
export function baseProfile(uid, selfUser) {
  const p = getPersona(uid);
  const extra = S().profiles[uid] || {};
  if (p) return { ...p, ...extra, fullName: fullName(p), initials: initialsOf(p), color: AVATAR_COLORS[p.palette % 5], verified: true, joinedAt: at(p.joined * DAY) };
  const nombre = selfUser?.nombre || 'Tú', apellido = selfUser?.apellido || '';
  return {
    id: uid, nombre, apellido, fullName: [nombre, apellido].filter(Boolean).join(' '), initials: `${nombre[0] || 'T'}${apellido[0] || ''}`.toUpperCase(),
    color: '#FF6B35', district: extra.district || 'Lima', departamento: 'Lima', bio: extra.bio || '', skills: extra.skills || [],
    response: 'Nuevo en Cachuelo', joinedAt: new Date().toISOString(), self: true,
  };
}
export function updateMyProfile(uid, patch) { S().profiles[uid] = { ...(S().profiles[uid] || {}), ...patch }; save(); }

// ── HISTORIAL Y RESEÑAS ──────────────────────────────────────────────────────
const seededJobs = () => HISTORY.map(h => ({ ...h, completedAt: at(h.daysAgo * DAY), seed: true }));
export const allJobs = () => [...S().completed, ...seededJobs()];
export const getJob = (id) => allJobs().find(j => j.id === id) || null;

function seededReviews() {
  const out = [];
  for (const h of HISTORY) {
    if (h.rw) out.push({ id: `${h.id}-w`, jobId: h.id, fromId: h.ownerId, toId: h.workerId, rol: 'trabajador', estrellas: h.rw[0], comentario: h.rw[1], tags: h.rw[2], createdAt: at((h.daysAgo - 0.5) * DAY) });
    if (h.rc) out.push({ id: `${h.id}-c`, jobId: h.id, fromId: h.workerId, toId: h.ownerId, rol: 'contratante', estrellas: h.rc[0], comentario: h.rc[1], tags: h.rc[2], createdAt: at((h.daysAgo - 0.6) * DAY) });
  }
  return out;
}
export const allReviews = () => [...S().reviews, ...seededReviews()];
/** Reseñas recibidas por `uid` en un rol ('trabajador' = lo calificaron como trabajador). */
export const reviewsFor = (uid, rol) => allReviews().filter(r => r.toId === uid && (!rol || r.rol === rol)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const hasReviewed = (jobId, fromId) => allReviews().some(r => r.jobId === jobId && r.fromId === fromId);
const avg = (list) => (list.length ? Math.round((list.reduce((s, r) => s + r.estrellas, 0) / list.length) * 10) / 10 : 0);

export function statsFor(uid) {
  const jobs = allJobs();
  const asWorker = jobs.filter(j => j.workerId === uid);
  const doneW = asWorker.filter(j => j.estado === 'completado');
  const cancelW = asWorker.filter(j => j.estado === 'cancelado');
  const byClient = {};
  doneW.forEach(j => { byClient[j.ownerId] = (byClient[j.ownerId] || 0) + 1; });
  const rebooked = Object.values(byClient).reduce((s, n) => s + Math.max(0, n - 1), 0);
  const rw = reviewsFor(uid, 'trabajador');

  const asClient = jobs.filter(j => j.ownerId === uid && j.estado === 'completado');
  const openNow = feedRaw().filter(c => c.userId === uid);
  const rc = reviewsFor(uid, 'contratante');
  return {
    worker: {
      done: doneW.length, cancelled: cancelW.length, rating: avg(rw), reviews: rw.length, rebooked,
      completionRate: doneW.length + cancelW.length ? Math.round((doneW.length / (doneW.length + cancelW.length)) * 100) : null,
      earned: doneW.reduce((s, j) => s + Number(j.price || 0), 0),
      categories: [...new Set(doneW.map(j => j.category))],
    },
    client: {
      hired: asClient.length, open: openNow.length, published: asClient.length + openNow.length,
      rating: avg(rc), reviews: rc.length, spent: asClient.reduce((s, j) => s + Number(j.price || 0), 0),
      categories: [...new Set(asClient.map(j => j.category))],
    },
  };
}
/** Resumen corto para tarjetas de ofertas. */
export function workerSummary(uid, selfUser) {
  const b = baseProfile(uid, selfUser); const st = statsFor(uid).worker;
  return { id: uid, name: b.fullName, initials: b.initials, color: b.color, verified: b.verified !== false, ...st };
}

export const jobsAs = (uid, rol) => allJobs().filter(j => (rol === 'trabajador' ? j.workerId : j.ownerId) === uid).sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));

// ── CACHUELOS (formato que usan las pantallas) ───────────────────────────────
const toScreen = (o) => {
  const p = getPersona(o.ownerId);
  const rc = reviewsFor(o.ownerId, 'contratante');
  return {
    id: o.id, title: o.title, servicio: o.servicio || '', category: o.category, emoji: getCategory(o.category).emoji,
    location: o.remote ? 'Remoto' : o.district, district: o.district || '', departamento: o.departamento || null, ciudad: null,
    lat: null, lng: null, payType: o.payType, requisitos: o.requisitos, duration: o.duration, price: o.price,
    type: o.type, featured: o.featured, remote: o.remote,
    publisher: { name: fullName(p), rating: avg(rc), verified: true, avatar: initialsOf(p) },
    description: o.description || '', schedule: o.schedule || '', fecha_inicio: '', userId: o.ownerId,
    createdAt: at(o.hoursAgo * HOUR), seed: true, demo: true,
  };
};
const userPublished = () => readDemoCachuelos().map(c => {
  const p = getPersona(c.userId);
  return { ...c, createdAt: c.createdAt || new Date(Number(String(c.id).replace('demo-', '')) || Date.now()).toISOString(),
    publisher: p ? { name: fullName(p), rating: avg(reviewsFor(p.id, 'contratante')), verified: true, avatar: initialsOf(p) } : { ...c.publisher, name: (c.publisher?.name || 'Tú').replace(' (demo)', ''), rating: avg(reviewsFor(c.userId, 'contratante')) } };
});
const feedRaw = () => [...userPublished(), ...OPEN.map(toScreen)];
export const cachueloStatus = (id) => S().status[id] || { estado: 'abierto' };
/** Todos los cachuelos (cualquier estado). */
export const allCachuelos = () => feedRaw().map(c => ({ ...c, status: cachueloStatus(c.id), offersCount: offersFor(c.id).length }));
export const getCachuelo = (id) => allCachuelos().find(c => String(c.id) === String(id)) || null;
/** Feed público: solo los que siguen abiertos. */
export const feed = () => allCachuelos().filter(c => c.status.estado === 'abierto');

// ── OFERTAS ──────────────────────────────────────────────────────────────────
function allOffers() {
  const seeded = SEED_OFFERS.map(o => ({ ...o, createdAt: at(o.hoursAgo * HOUR), seed: true }));
  const fromForm = demoStore.read(OFFERS_KEY).map(o => ({
    id: o.id, cachueloId: o.cachuelo_id, workerId: o.postulante_id || SELF_ID, monto: Number(o.monto_ofertado), mensaje: o.mensaje,
    cumpleRequisitos: o.cumple_requisitos, createdAt: o.created_at,
  }));
  return [...S().offers, ...fromForm, ...seeded].map(o => ({ ...o, estado: S().offerStatus[o.id] || 'pendiente' }));
}
export const offersFor = (cachueloId) => allOffers().filter(o => String(o.cachueloId) === String(cachueloId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const hasOffer = (cachueloId, uid) => offersFor(cachueloId).some(o => o.workerId === uid);
export const myOffers = (uid) => allOffers().filter(o => o.workerId === uid).map(o => ({ ...o, cachuelo: getCachuelo(o.cachueloId) })).filter(o => o.cachuelo).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const MSG = {
  hogar: ['Puedo ir esta semana, llevo mis productos.', 'Tengo experiencia en casas y oficinas, soy puntual.'],
  oficios: ['Llevo mis herramientas y EPP. Te doy garantía de 30 días.', 'Puedo pasar a ver el trabajo antes, sin costo.'],
  transporte: ['Tengo vehículo y voy con ayudante.', 'Puedo en el horario que indicas.'],
  cuidado: ['Tengo referencias y experiencia comprobable.', 'Vivo cerca, puedo empezar cuando necesites.'],
  default: ['Me interesa, tengo experiencia en este tipo de trabajo.', 'Puedo empezar mañana y te mantengo al tanto.', 'Revisé los detalles y cumplo los requisitos.'],
};
/** Llegan 2–3 ofertas de personas cuyas habilidades encajan con la categoría. */
export function simulateOffers(cachueloId) {
  const c = getCachuelo(cachueloId); if (!c) return 0;
  const group = groupOfLabel(c.category);
  const taken = new Set(offersFor(cachueloId).map(o => o.workerId));
  const workers = PERSONAS.filter(p => p.skills.length && p.id !== c.userId && !taken.has(p.id));
  const fit = (p) => (p.skills.includes(c.category) ? 3 : p.skills.some(s => groupOfLabel(s) === group) ? 1 : 0);
  const pool = workers.sort((a, b) => fit(b) - fit(a)).slice(0, 3);
  const mult = [1, 1.15, 0.95];
  const msgs = MSG[group] || MSG.default;
  const now = Date.now();
  pool.forEach((p, i) => {
    const monto = Math.max(10, Math.round((c.price * mult[i]) / 5) * 5);
    S().offers.push({
      id: `sim-${now}-${i}`, cachueloId: c.id, workerId: p.id, monto,
      mensaje: `${monto === c.price ? 'Acepto tu precio.' : `Propongo S/ ${monto}.`} ${msgs[i % msgs.length]}`,
      cumpleRequisitos: true, createdAt: new Date(now - (pool.length - i) * 6 * 60e3).toISOString(),
    });
  });
  save();
  return pool.length;
}

// ── FLUJO: aceptar → trabajo hecho → confirmar → calificar ──────────────────
export function acceptOffer(cachueloId, offerId, payment) {
  const o = offersFor(cachueloId).find(x => x.id === offerId); if (!o) throw new Error('Oferta no encontrada');
  offersFor(cachueloId).forEach(x => { S().offerStatus[x.id] = x.id === offerId ? 'aceptada' : 'rechazada'; });
  S().status[cachueloId] = { estado: 'asignado', workerId: o.workerId, offerId, monto: o.monto, paymentId: payment?.id || null, modo: payment?.modo || 'directo', assignedAt: new Date().toISOString() };
  save();
}
export function markWorkDone(cachueloId) {
  const st = cachueloStatus(cachueloId); if (st.estado !== 'asignado') return;
  S().status[cachueloId] = { ...st, estado: 'por_confirmar', doneAt: new Date().toISOString() }; save();
}
export function completeCachuelo(cachueloId) {
  const st = cachueloStatus(cachueloId); const c = getCachuelo(cachueloId);
  if (!c || !['asignado', 'por_confirmar'].includes(st.estado)) return null;
  const job = {
    id: `job-${cachueloId}`, cachueloId, title: c.title, servicio: c.servicio, category: c.category, ownerId: c.userId, workerId: st.workerId,
    price: st.monto ?? c.price, district: c.district || (c.remote ? 'Remoto' : ''), remote: c.remote, estado: 'completado', completedAt: new Date().toISOString(), paymentId: st.paymentId,
  };
  S().status[cachueloId] = { ...st, estado: 'completado', completedAt: job.completedAt, jobId: job.id };
  S().completed = [job, ...S().completed.filter(j => j.id !== job.id)];
  save();
  return job;
}
export function addReview({ jobId, fromId, toId, rol, estrellas, comentario, tags = [] }) {
  if (hasReviewed(jobId, fromId)) throw new Error('Ya calificaste este cachuelo.');
  S().reviews.unshift({ id: `rv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, jobId, fromId, toId, rol, estrellas, comentario: (comentario || '').trim(), tags, createdAt: new Date().toISOString() });
  save();
}
const AUTO_TEXT = {
  trabajador: [[5, 'Excelente trabajo, cumplió con todo lo acordado. ¡Lo recomiendo!', ['Buen trabajo', 'Puntual']], [5, 'Muy profesional y amable.', ['Recomendado']]],
  contratante: [[5, 'Instrucciones claras y pagó con Pago Protegido sin demoras.', ['Pago rápido', 'Instrucciones claras']], [5, 'Muy buen trato, volvería a trabajar con esta persona.', ['Buen trato']]],
};
/** La otra parte (persona simulada) te deja su reseña. */
export function simulateCounterReview(jobId, rolOfTarget) {
  const j = getJob(jobId); if (!j) return null;
  const fromId = rolOfTarget === 'trabajador' ? j.ownerId : j.workerId;
  const toId = rolOfTarget === 'trabajador' ? j.workerId : j.ownerId;
  if (hasReviewed(jobId, fromId)) return null;
  const [estrellas, comentario, tags] = AUTO_TEXT[rolOfTarget][Math.floor(Math.random() * 2)];
  addReview({ jobId, fromId, toId, rol: rolOfTarget, estrellas, comentario, tags });
  return { fromId, estrellas, comentario };
}

// ── PORTAFOLIO ───────────────────────────────────────────────────────────────
export function portfolioOf(uid) {
  const seeded = SEED_PORTFOLIO.filter(p => p.userId === uid && !S().hiddenPortfolio.includes(p.id)).map(p => {
    const j = getJob(p.jobId);
    return { ...p, titulo: j.title, category: j.category, createdAt: at((j.daysAgo - 1) * DAY), verified: true, seed: true,
      photos: Array.from({ length: p.photos }, (_, i) => artPhoto(j.category, `${p.id}-${i}`, i === 0 ? j.title : '')) };
  });
  return [...S().portfolio.filter(p => p.userId === uid), ...seeded];
}
export function addPortfolioItem(item) {
  const j = item.jobId ? getJob(item.jobId) : null;
  S().portfolio.unshift({
    id: `pf-${Date.now()}`, userId: item.userId, rol: item.rol, jobId: item.jobId || null,
    titulo: (item.titulo || j?.title || 'Experiencia').trim().slice(0, 80), descripcion: item.descripcion.trim().slice(0, 400),
    category: item.category || j?.category || 'Otros', photos: item.photos, createdAt: new Date().toISOString(), verified: !!j,
  });
  try { save(); } catch (e) { S().portfolio.shift(); throw e; }
}
export function removePortfolioItem(id) {
  if (String(id).startsWith('sp')) S().hiddenPortfolio.push(id);
  else S().portfolio = S().portfolio.filter(p => p.id !== id);
  save();
}

// ── REINICIO ─────────────────────────────────────────────────────────────────
export function resetSimulation() {
  [KEY, OFFERS_KEY, CACH_KEY, PAY_KEY].forEach(k => { try { localStorage.removeItem(k); } catch { /* nada */ } });
  state = null; S();
  window.dispatchEvent(new CustomEvent(DEMO_EVENT));
  window.dispatchEvent(new CustomEvent('cachuelo:payments'));
  emit();
}

// ── Utilidades de presentación ───────────────────────────────────────────────
export const ago = (iso) => {
  if (!iso) return '';
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60e3));
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60); if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24); if (d < 30) return `hace ${d} día${d > 1 ? 's' : ''}`;
  const mo = Math.round(d / 30); return `hace ${mo} mes${mo > 1 ? 'es' : ''}`;
};
export const sinceLabel = (iso) => new Date(iso).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
