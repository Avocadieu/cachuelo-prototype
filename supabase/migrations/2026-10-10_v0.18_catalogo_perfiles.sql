-- ============================================================================
-- Cachuelo v0.18 · Catálogo ampliado · Servicio libre · Perfiles de doble rol
--                  Reseñas en ambos sentidos · Portafolio con fotos
-- Correr DESPUÉS de v0.15, v0.16 y v0.17 (Supabase → SQL Editor → Run).
-- Es idempotente: se puede correr dos veces sin romper nada.
-- ============================================================================

-- 0) Bandera interna para cambios hechos por el sistema (triggers) ------------
--    Las funciones de reputación la activan solo dentro de su transacción.
CREATE OR REPLACE FUNCTION public.es_cambio_del_sistema()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT coalesce(current_setting('cachuelo.sistema', true), '') = 'on';
$$;

-- 1) CATÁLOGO: 62 categorías en 12 grupos (ids fijos = src/data/categories.js) -
ALTER TABLE public.categorias ADD COLUMN IF NOT EXISTS grupo TEXT;
INSERT INTO public.categorias (id, label, emoji, color, grupo) VALUES
  ( 1, 'Limpieza', '🧹', '#E0F2FE', 'hogar'),
  ( 2, 'Mudanza', '📦', '#FEF3C7', 'transporte'),
  ( 3, 'Redacción', '✍️', '#F0FDF4', 'creativo'),
  ( 4, 'Diseño', '🎨', '#FDF4FF', 'creativo'),
  ( 5, 'Reparaciones', '🔧', '#FFF7ED', 'oficios'),
  ( 6, 'Cocina', '🍳', '#FEF9C3', 'eventos'),
  ( 7, 'Delivery', '🛵', '#ECFDF5', 'transporte'),
  ( 8, 'Tutorías', '📚', '#EFF6FF', 'educacion'),
  ( 9, 'Jardinería', '🌿', '#F0FDF4', 'exteriores'),
  (10, 'Tecnología', '💻', '#F5F3FF', 'tecnologia'),
  (11, 'Fotografía', '📷', '#FDF2F8', 'creativo'),
  (12, 'Eventos', '🎉', '#FFF1F2', 'eventos'),
  (13, 'Lavado y planchado', '👕', '#E0F2FE', 'hogar'),
  (14, 'Ayuda doméstica', '🏠', '#E0F2FE', 'hogar'),
  (15, 'Fumigación y plagas', '🪳', '#E0F2FE', 'hogar'),
  (16, 'Limpieza de tanques y cisternas', '💧', '#E0F2FE', 'hogar'),
  (17, 'Gasfitería', '🚰', '#FFF7ED', 'oficios'),
  (18, 'Electricidad', '⚡', '#FFF7ED', 'oficios'),
  (19, 'Pintura', '🖌️', '#FFF7ED', 'oficios'),
  (20, 'Carpintería y melamina', '🪚', '#FFF7ED', 'oficios'),
  (21, 'Armado de muebles', '🪑', '#FFF7ED', 'oficios'),
  (22, 'Cerrajería', '🔑', '#FFF7ED', 'oficios'),
  (23, 'Albañilería y construcción', '🧱', '#FFF7ED', 'oficios'),
  (24, 'Soldadura', '🔥', '#FFF7ED', 'oficios'),
  (25, 'Reparación de electrodomésticos', '🔌', '#FFF7ED', 'oficios'),
  (26, 'Vidriería', '🪟', '#FFF7ED', 'oficios'),
  (27, 'Fletes y carga', '🚚', '#FEF3C7', 'transporte'),
  (28, 'Embalaje', '📦', '#FEF3C7', 'transporte'),
  (29, 'Chofer', '🚗', '#FEF3C7', 'transporte'),
  (30, 'Mandados y colas', '⏳', '#FEF3C7', 'transporte'),
  (31, 'Mecánica', '🛠️', '#F1F5F9', 'vehiculos'),
  (32, 'Lavado de autos', '🚿', '#F1F5F9', 'vehiculos'),
  (33, 'Reparación de bicicletas', '🚲', '#F1F5F9', 'vehiculos'),
  (34, 'Poda de árboles', '🌳', '#F0FDF4', 'exteriores'),
  (35, 'Recojo de desmonte', '🗑️', '#F0FDF4', 'exteriores'),
  (36, 'Desarrollo web y apps', '🧑‍💻', '#F5F3FF', 'tecnologia'),
  (37, 'Reparación de celulares', '📱', '#F5F3FF', 'tecnologia'),
  (38, 'Redes sociales', '📣', '#F5F3FF', 'tecnologia'),
  (39, 'Digitación y data entry', '⌨️', '#F5F3FF', 'tecnologia'),
  (40, 'Video y edición', '🎬', '#FDF4FF', 'creativo'),
  (41, 'Traducción', '🌐', '#FDF4FF', 'creativo'),
  (42, 'Estampado y sublimación', '👕', '#FDF4FF', 'creativo'),
  (43, 'Manualidades y arte', '🖍️', '#FDF4FF', 'creativo'),
  (44, 'Clases de idiomas', '🗣️', '#EFF6FF', 'educacion'),
  (45, 'Clases de música', '🎸', '#EFF6FF', 'educacion'),
  (46, 'Entrenador personal y deporte', '🏋️', '#EFF6FF', 'educacion'),
  (47, 'Mozos y personal para eventos', '🤵', '#FFF1F2', 'eventos'),
  (48, 'DJ y animación', '🎧', '#FFF1F2', 'eventos'),
  (49, 'Decoración de eventos', '🎈', '#FFF1F2', 'eventos'),
  (50, 'Repostería', '🎂', '#FFF1F2', 'eventos'),
  (51, 'Bartender', '🍸', '#FFF1F2', 'eventos'),
  (52, 'Cuidado de niños', '🧸', '#FDF2F8', 'cuidado'),
  (53, 'Cuidado de adultos mayores', '🤝', '#FDF2F8', 'cuidado'),
  (54, 'Mascotas', '🐶', '#FDF2F8', 'cuidado'),
  (55, 'Belleza y peluquería', '💇', '#FDF2F8', 'cuidado'),
  (56, 'Costura y arreglos de ropa', '🧵', '#FDF2F8', 'cuidado'),
  (57, 'Asistencia administrativa', '🗂️', '#ECFDF5', 'negocios'),
  (58, 'Ventas e impulsación', '🛍️', '#ECFDF5', 'negocios'),
  (59, 'Volanteo y publicidad', '📄', '#ECFDF5', 'negocios'),
  (60, 'Encuestas y cliente incógnito', '🕵️', '#ECFDF5', 'negocios'),
  (61, 'Contabilidad y trámites tributarios', '🧾', '#ECFDF5', 'negocios'),
  (62, 'Otros', '✨', '#F3F4F6', 'otros')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, emoji = EXCLUDED.emoji, color = EXCLUDED.color, grupo = EXCLUDED.grupo;
SELECT setval(pg_get_serial_sequence('public.categorias', 'id'), (SELECT max(id) FROM public.categorias));
-- Lectura pública; solo administradores editan el catálogo
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categorias_lectura" ON public.categorias;
CREATE POLICY "categorias_lectura" ON public.categorias FOR SELECT USING (true);
DROP POLICY IF EXISTS "categorias_admin" ON public.categorias;
CREATE POLICY "categorias_admin" ON public.categorias FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2) CACHUELOS: servicio escrito "a su manera" + búsqueda en español ---------
ALTER TABLE public.cachuelos ADD COLUMN IF NOT EXISTS servicio TEXT;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cachuelos_servicio_largo') THEN
    ALTER TABLE public.cachuelos ADD CONSTRAINT cachuelos_servicio_largo CHECK (servicio IS NULL OR char_length(servicio) <= 80);
  END IF;
END $$;
ALTER TABLE public.cachuelos ADD COLUMN IF NOT EXISTS busqueda tsvector
  GENERATED ALWAYS AS (to_tsvector('spanish'::regconfig,
    coalesce(titulo, '') || ' ' || coalesce(servicio, '') || ' ' || coalesce(descripcion, ''))) STORED;
CREATE INDEX IF NOT EXISTS cachuelos_busqueda_idx  ON public.cachuelos USING gin (busqueda);
CREATE INDEX IF NOT EXISTS cachuelos_categoria_idx ON public.cachuelos (categoria_id);

-- 3) PERFILES DE DOBLE ROL ---------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url            TEXT,
  ADD COLUMN IF NOT EXISTS bio                   TEXT,
  ADD COLUMN IF NOT EXISTS especialidades        TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS zonas                 TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS disponible            BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS resenas_trabajador    INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_contratante    NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS resenas_contratante   INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cachuelos_contratados INT DEFAULT 0;

-- SEGURIDAD: la reputación ya no la puede cambiar el usuario desde la app
-- (antes cualquiera podía ponerse rating 5). Solo la calculan los triggers.
CREATE OR REPLACE FUNCTION public.proteger_campos_perfil()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF coalesce(auth.role(), '') IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
    NEW.rol            := OLD.rol;
    NEW.dni_verificado := OLD.dni_verificado;
    NEW.avatar_url     := OLD.avatar_url;
    IF NOT public.es_cambio_del_sistema() THEN
      NEW.rating                := OLD.rating;
      NEW.resenas_trabajador    := OLD.resenas_trabajador;
      NEW.rating_contratante    := OLD.rating_contratante;
      NEW.resenas_contratante   := OLD.resenas_contratante;
      NEW.cachuelos_completados := OLD.cachuelos_completados;
      NEW.cachuelos_contratados := OLD.cachuelos_contratados;
      NEW.cachuelos_publicados  := OLD.cachuelos_publicados;
    END IF;
  END IF;
  RETURN NEW;
END $$;

-- 4) RESEÑAS EN AMBOS SENTIDOS -----------------------------------------------
--    contratante → trabajador (rol_destinatario = 'trabajador')
--    trabajador  → contratante (rol_destinatario = 'contratante')
CREATE TABLE IF NOT EXISTS public.resenas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trabajador_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  publicador_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  postulacion_id  UUID REFERENCES public.postulaciones(id) ON DELETE CASCADE,
  cachuelo_id     UUID REFERENCES public.cachuelos(id) ON DELETE SET NULL,
  cachuelo_titulo TEXT,
  estrellas       INT,
  comentario      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.resenas
  ADD COLUMN IF NOT EXISTS autor_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS destinatario_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS rol_destinatario TEXT,
  ADD COLUMN IF NOT EXISTS tags             TEXT[] NOT NULL DEFAULT '{}';
-- En reseñas al contratante, trabajador_id queda NULL (así las pantallas
-- antiguas que filtran por trabajador_id no las confunden con las suyas).
ALTER TABLE public.resenas ALTER COLUMN trabajador_id DROP NOT NULL;
-- Las reseñas existentes eran todas del contratante al trabajador
UPDATE public.resenas SET rol_destinatario = 'trabajador',
  autor_id = coalesce(autor_id, publicador_id), destinatario_id = coalesce(destinatario_id, trabajador_id)
WHERE rol_destinatario IS NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resenas_rol_valido') THEN
    ALTER TABLE public.resenas ADD CONSTRAINT resenas_rol_valido CHECK (rol_destinatario IN ('trabajador', 'contratante')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resenas_estrellas_validas') THEN
    ALTER TABLE public.resenas ADD CONSTRAINT resenas_estrellas_validas CHECK (estrellas BETWEEN 1 AND 5) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resenas_textos') THEN
    ALTER TABLE public.resenas ADD CONSTRAINT resenas_textos CHECK (char_length(coalesce(comentario, '')) <= 300 AND cardinality(tags) <= 6) NOT VALID;
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS resenas_una_por_autor ON public.resenas (postulacion_id, autor_id) WHERE postulacion_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS resenas_destinatario_idx ON public.resenas (destinatario_id, rol_destinatario);

-- Antes de guardar: la reseña debe ser de un cachuelo COMPLETADO y entre sus partes.
-- El servidor decide quién es el destinatario y en qué rol (no se confía en la app).
CREATE OR REPLACE FUNCTION public.validar_resena()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_owner uuid; v_worker uuid; v_post text; v_cach text; v_titulo text; v_cid uuid;
BEGIN
  IF coalesce(auth.role(), '') IN ('authenticated', 'anon') THEN NEW.autor_id := auth.uid(); END IF;
  NEW.autor_id := coalesce(NEW.autor_id, NEW.publicador_id);
  SELECT c.user_id, p.postulante_id, p.estado, c.estado, c.titulo, c.id
    INTO v_owner, v_worker, v_post, v_cach, v_titulo, v_cid
    FROM public.postulaciones p JOIN public.cachuelos c ON c.id = p.cachuelo_id
   WHERE p.id = NEW.postulacion_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'La reseña debe estar ligada a un cachuelo existente' USING ERRCODE = 'check_violation';
  END IF;
  IF coalesce(v_post, '') <> 'Completado' AND coalesce(v_cach, '') <> 'Completado' THEN
    RAISE EXCEPTION 'Solo se puede calificar un cachuelo completado' USING ERRCODE = 'check_violation';
  END IF;
  IF NEW.autor_id = v_owner THEN
    NEW.destinatario_id := v_worker; NEW.rol_destinatario := 'trabajador'; NEW.trabajador_id := v_worker;
  ELSIF NEW.autor_id = v_worker THEN
    NEW.destinatario_id := v_owner; NEW.rol_destinatario := 'contratante'; NEW.trabajador_id := NULL;
  ELSE
    RAISE EXCEPTION 'Solo el contratante y el trabajador de este cachuelo pueden calificarse' USING ERRCODE = 'insufficient_privilege';
  END IF;
  NEW.publicador_id := v_owner; NEW.cachuelo_id := v_cid; NEW.cachuelo_titulo := coalesce(NEW.cachuelo_titulo, v_titulo);
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_validar_resena ON public.resenas;
CREATE TRIGGER trg_validar_resena BEFORE INSERT ON public.resenas FOR EACH ROW EXECUTE FUNCTION public.validar_resena();

-- Después de guardar: recalcular la reputación de ambos roles del destinatario.
CREATE OR REPLACE FUNCTION public.recalcular_reputacion(p_user uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM set_config('cachuelo.sistema', 'on', true);
  UPDATE public.profiles pr SET
    rating                = coalesce((SELECT round(avg(estrellas)::numeric, 1) FROM public.resenas WHERE destinatario_id = p_user AND rol_destinatario = 'trabajador'), 0),
    resenas_trabajador    = (SELECT count(*) FROM public.resenas WHERE destinatario_id = p_user AND rol_destinatario = 'trabajador'),
    rating_contratante    = coalesce((SELECT round(avg(estrellas)::numeric, 1) FROM public.resenas WHERE destinatario_id = p_user AND rol_destinatario = 'contratante'), 0),
    resenas_contratante   = (SELECT count(*) FROM public.resenas WHERE destinatario_id = p_user AND rol_destinatario = 'contratante'),
    cachuelos_completados = (SELECT count(*) FROM public.postulaciones WHERE postulante_id = p_user AND estado = 'Completado'),
    cachuelos_contratados = (SELECT count(*) FROM public.cachuelos WHERE user_id = p_user AND estado = 'Completado')
  WHERE pr.id = p_user;
  PERFORM set_config('cachuelo.sistema', '', true);
END $$;
REVOKE EXECUTE ON FUNCTION public.recalcular_reputacion(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.tras_resena()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.recalcular_reputacion(NEW.destinatario_id);
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_tras_resena ON public.resenas;
CREATE TRIGGER trg_tras_resena AFTER INSERT ON public.resenas FOR EACH ROW EXECUTE FUNCTION public.tras_resena();

ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "resenas_publicas" ON public.resenas;
CREATE POLICY "resenas_publicas" ON public.resenas FOR SELECT USING (true);
DROP POLICY IF EXISTS "resenas_crear" ON public.resenas;
CREATE POLICY "resenas_crear" ON public.resenas FOR INSERT TO authenticated WITH CHECK (autor_id = auth.uid());
DROP POLICY IF EXISTS "resenas_admin_borrar" ON public.resenas;
CREATE POLICY "resenas_admin_borrar" ON public.resenas FOR DELETE TO authenticated USING (public.is_admin());
-- (sin política de UPDATE: una reseña publicada no se edita)

-- 5) PORTAFOLIO: fotos de cachuelos realizados o contratados ------------------
CREATE TABLE IF NOT EXISTS public.portafolio (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  rol            TEXT NOT NULL CHECK (rol IN ('trabajador', 'contratante')),
  postulacion_id UUID REFERENCES public.postulaciones(id) ON DELETE SET NULL,  -- NULL = experiencia externa
  cachuelo_id    UUID REFERENCES public.cachuelos(id) ON DELETE SET NULL,
  categoria_id   INT REFERENCES public.categorias(id),
  titulo         TEXT NOT NULL CHECK (char_length(titulo) BETWEEN 4 AND 80),
  descripcion    TEXT NOT NULL CHECK (char_length(descripcion) BETWEEN 20 AND 400),
  fotos          TEXT[] NOT NULL CHECK (cardinality(fotos) BETWEEN 1 AND 6),       -- rutas en el bucket "portafolio"
  verificado     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS portafolio_user_idx ON public.portafolio (user_id, rol);

-- "Verificado" lo decide el servidor: solo si está ligado a un cachuelo
-- completado donde el usuario fue el contratante (rol contratante) o el trabajador.
CREATE OR REPLACE FUNCTION public.validar_portafolio()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_owner uuid; v_worker uuid; v_post text; v_cach text; v_cid uuid; f text;
BEGIN
  IF coalesce(auth.role(), '') IN ('authenticated', 'anon') THEN NEW.user_id := auth.uid(); END IF;
  FOREACH f IN ARRAY NEW.fotos LOOP
    IF split_part(f, '/', 1) <> NEW.user_id::text THEN
      RAISE EXCEPTION 'Las fotos deben estar en tu carpeta del bucket portafolio' USING ERRCODE = 'insufficient_privilege';
    END IF;
  END LOOP;
  NEW.verificado := false;
  IF NEW.postulacion_id IS NOT NULL THEN
    SELECT c.user_id, p.postulante_id, p.estado, c.estado, c.id INTO v_owner, v_worker, v_post, v_cach, v_cid
      FROM public.postulaciones p JOIN public.cachuelos c ON c.id = p.cachuelo_id WHERE p.id = NEW.postulacion_id;
    IF FOUND AND (coalesce(v_post, '') = 'Completado' OR coalesce(v_cach, '') = 'Completado')
       AND ((NEW.rol = 'trabajador' AND v_worker = NEW.user_id) OR (NEW.rol = 'contratante' AND v_owner = NEW.user_id)) THEN
      NEW.verificado := true; NEW.cachuelo_id := v_cid;
    ELSE
      RAISE EXCEPTION 'Ese cachuelo no está completado o no participaste en él con ese rol' USING ERRCODE = 'check_violation';
    END IF;
  ELSE
    NEW.cachuelo_id := NULL;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_validar_portafolio ON public.portafolio;
CREATE TRIGGER trg_validar_portafolio BEFORE INSERT OR UPDATE ON public.portafolio FOR EACH ROW EXECUTE FUNCTION public.validar_portafolio();

ALTER TABLE public.portafolio ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portafolio_publico" ON public.portafolio;
CREATE POLICY "portafolio_publico" ON public.portafolio FOR SELECT USING (true);
DROP POLICY IF EXISTS "portafolio_propio_insert" ON public.portafolio;
CREATE POLICY "portafolio_propio_insert" ON public.portafolio FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "portafolio_propio_update" ON public.portafolio;
CREATE POLICY "portafolio_propio_update" ON public.portafolio FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "portafolio_propio_delete" ON public.portafolio;
CREATE POLICY "portafolio_propio_delete" ON public.portafolio FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- Bucket público de fotos (cualquiera las ve; cada uno sube/borra solo en <su id>/...)
INSERT INTO storage.buckets (id, name, public) VALUES ('portafolio', 'portafolio', true)
ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "portafolio_files_insert_own" ON storage.objects;
CREATE POLICY "portafolio_files_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portafolio' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "portafolio_files_delete_own" ON storage.objects;
CREATE POLICY "portafolio_files_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portafolio' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));

-- 6) Vista de reputación por rol (para listados y tarjetas de oferta) --------
CREATE OR REPLACE VIEW public.perfil_publico AS
SELECT p.id, p.nombre, p.apellido, p.avatar_url, p.bio, p.especialidades, p.dni_verificado, p.created_at,
       p.rating AS rating_trabajador, p.resenas_trabajador, p.cachuelos_completados,
       p.rating_contratante, p.resenas_contratante, p.cachuelos_contratados,
       (SELECT count(*) FROM public.cachuelos c WHERE c.user_id = p.id) AS cachuelos_publicados_total
FROM public.profiles p;
GRANT SELECT ON public.perfil_publico TO anon, authenticated;
