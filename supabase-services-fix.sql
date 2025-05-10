-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Eliminar la tabla services si existe (para recrearla)
DROP TABLE IF EXISTS public.services;

-- Crear tabla para los servicios
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear políticas de seguridad para los servicios (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propios servicios" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios servicios" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios servicios" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios servicios" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- Crear función para actualizar el timestamp de actualización si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar el timestamp de actualización
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Asegurarse de que la tabla sea accesible para los usuarios autenticados
GRANT ALL ON public.services TO authenticated;

-- Insertar algunos servicios de ejemplo (opcional)
INSERT INTO public.services (name, duration, price, category, description, user_id)
VALUES 
  ('Corte de cabello', 30, 25.00, 'Peluquería', 'Corte de cabello para hombres y mujeres', auth.uid()),
  ('Manicura', 45, 20.00, 'Uñas', 'Manicura básica con esmalte', auth.uid()),
  ('Pedicura', 45, 25.00, 'Uñas', 'Pedicura básica con esmalte', auth.uid());
