-- ============================================================================
-- Cachuelo v0.15 · Mapa interactivo (Perú)
-- Ejecutar UNA vez en: Supabase → SQL Editor → New query → Run
-- Es idempotente: si lo corres dos veces no rompe nada.
-- ============================================================================

-- 1) Columnas de ubicación ----------------------------------------------------
ALTER TABLE public.cachuelos
  ADD COLUMN IF NOT EXISTS departamento TEXT,
  ADD COLUMN IF NOT EXISTS ciudad       TEXT,
  ADD COLUMN IF NOT EXISTS lat          DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng          DOUBLE PRECISION;

COMMENT ON COLUMN public.cachuelos.lat IS 'Latitud APROXIMADA (redondeada a 3 decimales ≈ 110 m). Nunca la dirección exacta.';
COMMENT ON COLUMN public.cachuelos.lng IS 'Longitud APROXIMADA (redondeada a 3 decimales ≈ 110 m). Nunca la dirección exacta.';

-- 2) Solo coordenadas dentro del Perú (o ambas vacías) ------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cachuelos_coords_peru') THEN
    ALTER TABLE public.cachuelos
      ADD CONSTRAINT cachuelos_coords_peru CHECK (
        (lat IS NULL AND lng IS NULL)
        OR (lat BETWEEN -18.65 AND 0.35 AND lng BETWEEN -81.8 AND -68.2)
      );
  END IF;
END $$;

-- 3) Privacidad: el servidor redondea SIEMPRE, aunque alguien salte el frontend
CREATE OR REPLACE FUNCTION public.round_cachuelo_coords()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL THEN NEW.lat := round(NEW.lat::numeric, 3)::double precision; END IF;
  IF NEW.lng IS NOT NULL THEN NEW.lng := round(NEW.lng::numeric, 3)::double precision; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_round_cachuelo_coords ON public.cachuelos;
CREATE TRIGGER trg_round_cachuelo_coords
  BEFORE INSERT OR UPDATE OF lat, lng ON public.cachuelos
  FOR EACH ROW EXECUTE FUNCTION public.round_cachuelo_coords();

-- 4) Índice para consultas por zona del mapa (solo cachuelos activos) ---------
CREATE INDEX IF NOT EXISTS idx_cachuelos_activos_geo
  ON public.cachuelos (lat, lng)
  WHERE estado = 'Activo';

-- 5) Datos existentes: los presenciales antiguos eran de Lima ----------------
UPDATE public.cachuelos
   SET departamento = 'Lima'
 WHERE departamento IS NULL
   AND tipo = 'Presencial';
-- (lat/lng quedan NULL: la app los ubica en el centro aproximado de su distrito)

-- 6) Refrescar el caché de PostgREST para que la API vea las columnas nuevas --
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- Verificación rápida (opcional):
--   SELECT column_name, data_type FROM information_schema.columns
--    WHERE table_name = 'cachuelos' AND column_name IN ('departamento','ciudad','lat','lng');
-- ============================================================================
