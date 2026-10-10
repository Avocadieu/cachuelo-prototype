-- ============================================================================
-- Cachuelo v0.17 · Verificación de identidad, ofertas, requisitos y zonas
-- Ejecutar en Supabase → SQL Editor, DESPUÉS de las migraciones v0.15 y v0.16.
-- Idempotente: se puede correr más de una vez sin romper nada.
-- ============================================================================

-- 0) ¿Es administrador quien llama? -------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin');
$$;

-- 1) SEGURIDAD: un usuario no puede darse rol admin, verificarse ni cambiar su
--    foto aprobada desde el navegador (antes la política lo permitía).
-- auth.role() = 'authenticated' / 'anon' cuando la llamada viene de la app.
-- En el SQL Editor o con service_role no aplica (para gestión manual).
CREATE OR REPLACE FUNCTION public.proteger_campos_perfil()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF coalesce(auth.role(), '') IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
    NEW.rol            := OLD.rol;
    NEW.dni_verificado := OLD.dni_verificado;
    NEW.avatar_url     := OLD.avatar_url;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_proteger_campos_perfil ON public.profiles;
CREATE TRIGGER trg_proteger_campos_perfil BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.proteger_campos_perfil();

-- 2) Requisitos / documentos del cachuelo ------------------------------------
ALTER TABLE public.cachuelos ADD COLUMN IF NOT EXISTS requisitos TEXT[] NOT NULL DEFAULT '{}';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cachuelos_requisitos_max') THEN
    ALTER TABLE public.cachuelos ADD CONSTRAINT cachuelos_requisitos_max CHECK (cardinality(requisitos) <= 6);
  END IF;
END $$;

-- 3) Ofertas: precio propuesto por el trabajador ------------------------------
ALTER TABLE public.postulaciones
  ADD COLUMN IF NOT EXISTS monto_ofertado     NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS cumple_requisitos  BOOLEAN;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'postulaciones_monto_minimo') THEN
    ALTER TABLE public.postulaciones ADD CONSTRAINT postulaciones_monto_minimo
      CHECK (monto_ofertado IS NULL OR monto_ofertado >= 10) NOT VALID;
  END IF;
END $$;
-- Solo verificados pueden postular (refuerza en servidor lo que hace la app)
DROP POLICY IF EXISTS "Usuario puede postularse" ON public.postulaciones;
CREATE POLICY "Usuario puede postularse" ON public.postulaciones FOR INSERT
  WITH CHECK (auth.uid() = postulante_id
              AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND dni_verificado));
-- Solo verificados pueden publicar
DROP POLICY IF EXISTS "Usuario crea cachuelos" ON public.cachuelos;
CREATE POLICY "Usuario crea cachuelos" ON public.cachuelos FOR INSERT
  WITH CHECK (auth.uid() = user_id
              AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND dni_verificado));

-- 4) ZONAS: el servidor desplaza el centro al azar ----------------------------
--    El mapa dibuja un círculo de 300 m. El centro guardado se mueve entre 0 y
--    180 m en una dirección aleatoria, así el punto real queda DENTRO del
--    círculo pero el centro no lo revela. Solo se recalcula si el pin cambia.
ALTER TABLE public.cachuelos ADD COLUMN IF NOT EXISTS zona_ofuscada BOOLEAN NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.ofuscar_zona_cachuelo()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE r double precision; th double precision;
BEGIN
  IF NEW.lat IS NULL OR NEW.lng IS NULL THEN NEW.zona_ofuscada := false; RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND NEW.lat IS NOT DISTINCT FROM OLD.lat AND NEW.lng IS NOT DISTINCT FROM OLD.lng THEN
    RETURN NEW;   -- el pin no se movió: se queda la zona ya calculada
  END IF;
  r  := 180 * sqrt(random());           -- distancia uniforme dentro de un círculo de 180 m
  th := 2 * pi() * random();
  NEW.lat := round((NEW.lat + (r * cos(th)) / 111320.0)::numeric, 4)::double precision;
  NEW.lng := round((NEW.lng + (r * sin(th)) / (111320.0 * cos(radians(NEW.lat))))::numeric, 4)::double precision;
  NEW.zona_ofuscada := true;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_round_cachuelo_coords ON public.cachuelos;   -- reemplaza al de v0.15
DROP TRIGGER IF EXISTS trg_ofuscar_zona_cachuelo ON public.cachuelos;
CREATE TRIGGER trg_ofuscar_zona_cachuelo BEFORE INSERT OR UPDATE OF lat, lng ON public.cachuelos
  FOR EACH ROW EXECUTE FUNCTION public.ofuscar_zona_cachuelo();

-- Ofuscar UNA vez los cachuelos que ya tenían pin (no se repite al re-correr)
UPDATE public.cachuelos c SET
  lat = round((c.lat + (z.r * cos(z.th)) / 111320.0)::numeric, 4)::double precision,
  lng = round((c.lng + (z.r * sin(z.th)) / (111320.0 * cos(radians(c.lat))))::numeric, 4)::double precision,
  zona_ofuscada = true
FROM (SELECT id, 180 * sqrt(random()) AS r, 2 * pi() * random() AS th FROM public.cachuelos) z
WHERE c.id = z.id AND c.lat IS NOT NULL AND c.lng IS NOT NULL AND NOT c.zona_ofuscada;

-- 5) VERIFICACIONES ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verificaciones (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombres               TEXT NOT NULL,
  dni                   TEXT NOT NULL CHECK (dni ~ '^[0-9]{8}$'),
  fecha_nac             DATE NOT NULL CHECK (fecha_nac <= (current_date - INTERVAL '18 years')),
  cul_numero            TEXT NOT NULL,
  cul_emitido           DATE NOT NULL,
  dni_frente_path       TEXT,
  dni_reverso_path      TEXT,
  selfie_path           TEXT,
  cul_path              TEXT,
  estado                TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','observado','aprobado','rechazado')),
  motivo                TEXT,
  enviado_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  revisado_at           TIMESTAMPTZ,
  revisado_por          UUID REFERENCES auth.users(id),
  consentimiento_at     TIMESTAMPTZ NOT NULL,
  politica_version      TEXT NOT NULL,
  avatar_pendiente_path TEXT,
  avatar_enviado_at     TIMESTAMPTZ,
  avatar_motivo         TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_verificaciones_dni ON public.verificaciones (dni)
  WHERE estado IN ('pendiente','aprobado');    -- un DNI = una cuenta
CREATE INDEX IF NOT EXISTS idx_verificaciones_estado ON public.verificaciones (estado, enviado_at);

-- El usuario no puede aprobarse solo: si cambia documentos vuelve a 'pendiente'
CREATE OR REPLACE FUNCTION public.proteger_verificacion()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF coalesce(auth.role(), '') NOT IN ('authenticated', 'anon') OR public.is_admin() THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.estado := 'pendiente'; NEW.motivo := NULL; NEW.revisado_at := NULL; NEW.revisado_por := NULL;
  ELSE
    NEW.revisado_at := OLD.revisado_at; NEW.revisado_por := OLD.revisado_por;
    IF (NEW.dni_frente_path, NEW.dni_reverso_path, NEW.selfie_path, NEW.cul_path, NEW.dni, NEW.cul_numero)
       IS DISTINCT FROM (OLD.dni_frente_path, OLD.dni_reverso_path, OLD.selfie_path, OLD.cul_path, OLD.dni, OLD.cul_numero) THEN
      IF OLD.estado = 'rechazado' THEN RAISE EXCEPTION 'Verificación rechazada: contacta a soporte'; END IF;
      NEW.estado := 'pendiente'; NEW.motivo := NULL;
    ELSE
      NEW.estado := OLD.estado; NEW.motivo := OLD.motivo;
    END IF;
    NEW.avatar_motivo := OLD.avatar_motivo;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_proteger_verificacion ON public.verificaciones;
CREATE TRIGGER trg_proteger_verificacion BEFORE INSERT OR UPDATE ON public.verificaciones
  FOR EACH ROW EXECUTE FUNCTION public.proteger_verificacion();

ALTER TABLE public.verificaciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "verif_select" ON public.verificaciones;
DROP POLICY IF EXISTS "verif_insert" ON public.verificaciones;
DROP POLICY IF EXISTS "verif_update" ON public.verificaciones;
CREATE POLICY "verif_select" ON public.verificaciones FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "verif_insert" ON public.verificaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "verif_update" ON public.verificaciones FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Decisión del revisor (solo admin)
CREATE OR REPLACE FUNCTION public.revisar_verificacion(p_user_id uuid, p_estado text, p_motivo text, p_avatar_url text DEFAULT NULL)
RETURNS public.verificaciones LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v public.verificaciones;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Solo administradores'; END IF;
  IF p_estado NOT IN ('aprobado','observado','rechazado') THEN RAISE EXCEPTION 'Estado inválido'; END IF;
  UPDATE public.verificaciones SET estado = p_estado, motivo = p_motivo, revisado_at = now(), revisado_por = auth.uid()
   WHERE user_id = p_user_id RETURNING * INTO v;
  UPDATE public.profiles SET dni_verificado = (p_estado = 'aprobado'),
         avatar_url = CASE WHEN p_estado = 'aprobado' AND p_avatar_url IS NOT NULL THEN p_avatar_url ELSE avatar_url END
   WHERE id = p_user_id;
  RETURN v;
END $$;

CREATE OR REPLACE FUNCTION public.revisar_avatar(p_user_id uuid, p_aprobar boolean, p_motivo text, p_avatar_url text DEFAULT NULL)
RETURNS public.verificaciones LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v public.verificaciones;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Solo administradores'; END IF;
  UPDATE public.verificaciones SET avatar_pendiente_path = NULL,
         avatar_motivo = CASE WHEN p_aprobar THEN NULL ELSE p_motivo END
   WHERE user_id = p_user_id RETURNING * INTO v;
  IF p_aprobar AND p_avatar_url IS NOT NULL THEN
    UPDATE public.profiles SET avatar_url = p_avatar_url WHERE id = p_user_id;
  END IF;
  RETURN v;
END $$;

-- 6) STORAGE: bucket PRIVADO para documentos -----------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('verificaciones', 'verificaciones', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "verif_files_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "verif_files_select_own_or_admin" ON storage.objects;
CREATE POLICY "verif_files_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'verificaciones' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "verif_files_select_own_or_admin" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'verificaciones' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));

-- Avatares públicos: los escribe SOLO un admin al aprobar
DROP POLICY IF EXISTS "avatars_admin_write" ON storage.objects;
DROP POLICY IF EXISTS "avatars_admin_update" ON storage.objects;
CREATE POLICY "avatars_admin_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND public.is_admin());
CREATE POLICY "avatars_admin_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND public.is_admin());
-- ⚠ IMPORTANTE: en Storage → Policies, ELIMINA cualquier política antigua del
--   bucket `avatars` que deje a usuarios comunes subir/actualizar archivos
--   (venía de v0.14). Si no, alguien podría saltarse la aprobación de la foto.

NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- Primer administrador (reemplaza el correo y corre esta línea una vez):
--   UPDATE public.profiles SET rol = 'admin' WHERE email = 'correo-de-miki@ejemplo.com';
-- Usuarios que ya existían y quieren seguir publicando: deben verificarse.
-- (Para pruebas puntuales: UPDATE public.profiles SET dni_verificado = true WHERE email = '...';)
-- ============================================================================
