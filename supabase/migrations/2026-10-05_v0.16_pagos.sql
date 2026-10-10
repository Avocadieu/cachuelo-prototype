-- ============================================================================
-- Cachuelo v0.16 · Pago Protegido (tarjeta, Yape, Plin)
-- Ejecutar en Supabase → SQL Editor. Idempotente.
-- REGLA DE ORO: el cliente (frontend) SOLO puede LEER sus pagos. Crear,
-- liberar o reembolsar lo hace únicamente la Edge Function `payments` con
-- service_role (que ignora RLS). Así nadie puede marcarse "pagado" a sí mismo.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pagos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postulacion_id   UUID NOT NULL,
  cachuelo_id      UUID,
  cachuelo_titulo  TEXT,
  pagador_id       UUID NOT NULL REFERENCES auth.users(id),
  receptor_id      UUID NOT NULL REFERENCES auth.users(id),
  receptor_nombre  TEXT,
  modo             TEXT NOT NULL CHECK (modo IN ('protegido','directo')),
  metodo           TEXT NOT NULL CHECK (metodo IN ('tarjeta','yape','plin')),
  monto_servicio   NUMERIC(10,2) NOT NULL CHECK (monto_servicio >= 0),
  comision         NUMERIC(10,2) NOT NULL CHECK (comision >= 0),
  total            NUMERIC(10,2) NOT NULL CHECK (total > 0),
  estado           TEXT NOT NULL CHECK (estado IN ('retenido','liberado','en_disputa','reembolsado','conexion_pagada')),
  proveedor        TEXT NOT NULL DEFAULT 'culqi',
  proveedor_ref    TEXT,                 -- id del cargo en la pasarela (chr_…)
  disputa_motivo   TEXT,
  auto_release_at  TIMESTAMPTZ,
  released_at      TIMESTAMPTZ,
  transferido_at   TIMESTAMPTZ,          -- cuándo se le transfirió al trabajador
  transferencia_ref TEXT,                -- n° de operación de la transferencia
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un solo pago activo por postulación
CREATE UNIQUE INDEX IF NOT EXISTS uq_pagos_postulacion_activo
  ON public.pagos (postulacion_id) WHERE estado <> 'reembolsado';
CREATE INDEX IF NOT EXISTS idx_pagos_pagador  ON public.pagos (pagador_id);
CREATE INDEX IF NOT EXISTS idx_pagos_receptor ON public.pagos (receptor_id);
CREATE INDEX IF NOT EXISTS idx_pagos_por_liberar ON public.pagos (auto_release_at) WHERE estado = 'retenido';

ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pagos_select_partes" ON public.pagos;
CREATE POLICY "pagos_select_partes" ON public.pagos
  FOR SELECT USING (auth.uid() = pagador_id OR auth.uid() = receptor_id);
-- (Sin políticas de INSERT/UPDATE/DELETE: solo service_role puede escribir.)

-- Dónde cobra cada trabajador -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metodos_cobro (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo       TEXT NOT NULL CHECK (tipo IN ('yape','plin','cci')),
  valor      TEXT NOT NULL,
  titular    TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT metodos_cobro_formato CHECK (
    (tipo IN ('yape','plin') AND valor ~ '^9[0-9]{8}$') OR (tipo = 'cci' AND valor ~ '^[0-9]{20}$')
  )
);
ALTER TABLE public.metodos_cobro ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cobro_propio_select" ON public.metodos_cobro;
DROP POLICY IF EXISTS "cobro_propio_insert" ON public.metodos_cobro;
DROP POLICY IF EXISTS "cobro_propio_update" ON public.metodos_cobro;
CREATE POLICY "cobro_propio_select" ON public.metodos_cobro FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cobro_propio_insert" ON public.metodos_cobro FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cobro_propio_update" ON public.metodos_cobro FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Precio mínimo en la base (el frontend ya lo valida; esto evita saltárselo) --
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cachuelos_precio_minimo') THEN
    ALTER TABLE public.cachuelos ADD CONSTRAINT cachuelos_precio_minimo CHECK (precio >= 10) NOT VALID;
    -- NOT VALID: no revisa filas antiguas, sí todas las nuevas o editadas.
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- OPCIONAL · Liberación automática a las 72 h (requiere extensión pg_cron:
-- Database → Extensions → pg_cron). Descomenta para activarla.
-- ----------------------------------------------------------------------------
-- SELECT cron.schedule('cachuelo_auto_release', '*/30 * * * *', $$
--   UPDATE public.pagos SET estado = 'liberado', released_at = now()
--    WHERE estado = 'retenido' AND auto_release_at < now();
-- $$);
-- ============================================================================
