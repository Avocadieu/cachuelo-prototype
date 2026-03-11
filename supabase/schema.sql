-- ============================================================
-- Cachuelo – Schema de Base de Datos
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLA: categorias
-- ------------------------------------------------------------
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. TABLA: profiles  (extiende auth.users de Supabase)
-- ------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nombre TEXT,
  apellido TEXT,
  telefono TEXT,
  ciudad TEXT,
  pais TEXT DEFAULT 'Perú',
  rating FLOAT DEFAULT 0,
  cachuelos_completados INT DEFAULT 0,
  cachuelos_publicados INT DEFAULT 0,
  dni_verificado BOOLEAN DEFAULT FALSE,
  rol TEXT DEFAULT 'usuario', -- 'usuario' | 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. TABLA: cachuelos
-- ------------------------------------------------------------
CREATE TABLE cachuelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  categoria_id INT REFERENCES categorias(id),
  precio DECIMAL(8,2),
  tipo_pago TEXT DEFAULT 'Fijo', -- Fijo | Por hora | Por entrega | A convenir
  distrito TEXT,
  duracion TEXT,                 -- "1 día" | "1 semana" | "1 mes" | etc.
  tipo TEXT DEFAULT 'Presencial', -- Presencial | Remoto
  fecha_inicio DATE,
  destacado BOOLEAN DEFAULT FALSE,
  estado TEXT DEFAULT 'Activo', -- Activo | Pausado | Cerrado | Completado
  horario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. TABLA: postulaciones
-- ------------------------------------------------------------
CREATE TABLE postulaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cachuelo_id UUID REFERENCES cachuelos(id) ON DELETE CASCADE,
  postulante_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mensaje TEXT,
  estado TEXT DEFAULT 'Pendiente', -- Pendiente | Visto | Aceptado | Rechazado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cachuelo_id, postulante_id) -- un usuario no puede postularse dos veces al mismo cachuelo
);

-- ------------------------------------------------------------
-- 5. SEED: 12 categorías iniciales
-- ------------------------------------------------------------
INSERT INTO categorias (label, emoji, color) VALUES
  ('Limpieza',     '🧹', '#E0F2FE'),
  ('Mudanza',      '📦', '#FEF3C7'),
  ('Redacción',    '✍️', '#F0FDF4'),
  ('Diseño',       '🎨', '#FDF4FF'),
  ('Reparaciones', '🔧', '#FFF7ED'),
  ('Cocina',       '👨‍🍳', '#FEF9C3'),
  ('Delivery',     '🚗', '#ECFDF5'),
  ('Tutorías',     '📚', '#EFF6FF'),
  ('Jardinería',   '🌱', '#F0FDF4'),
  ('Tecnología',   '💻', '#F5F3FF'),
  ('Fotografía',   '📷', '#FDF2F8'),
  ('Eventos',      '🎉', '#FFF1F2');

-- ------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------

-- Habilitar RLS en todas las tablas protegidas
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cachuelos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE postulaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Perfil público visible"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuario edita su perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para cachuelos
CREATE POLICY "Cachuelos visibles para todos"
  ON cachuelos FOR SELECT
  USING (true);

CREATE POLICY "Usuario crea cachuelos"
  ON cachuelos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario edita sus cachuelos"
  ON cachuelos FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para postulaciones
CREATE POLICY "Postulante ve sus postulaciones"
  ON postulaciones FOR SELECT
  USING (auth.uid() = postulante_id);

CREATE POLICY "Publicador ve postulaciones a sus cachuelos"
  ON postulaciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cachuelos
      WHERE id = cachuelo_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Usuario puede postularse"
  ON postulaciones FOR INSERT
  WITH CHECK (auth.uid() = postulante_id);

-- ------------------------------------------------------------
-- 7. TRIGGER: crear perfil automáticamente al registrarse
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, apellido, pais)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre',   ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido',  ''),
    COALESCE(NEW.raw_user_meta_data->>'pais',     'Perú')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Diagrama de relaciones:
--
--   auth.users (Supabase)
--       │
--       └── profiles (1:1)
--               │
--               ├── cachuelos (1:N) ──── categorias (N:1)
--               │       │
--               │       └── postulaciones (1:N)
--               │
--               └── postulaciones (como postulante, 1:N)
-- ============================================================
