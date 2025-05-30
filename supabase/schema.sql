-- Crear tabla para el personal
CREATE TABLE IF NOT EXISTS public.staff (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialty TEXT,
  color TEXT NOT NULL DEFAULT '#4f46e5',
  avatar_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para las citas
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  staff_id INTEGER NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  color TEXT NOT NULL DEFAULT '#4f46e5',
  client_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear políticas de seguridad para el personal (RLS)
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver su propio personal" ON public.staff
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar su propio personal" ON public.staff
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio personal" ON public.staff
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar su propio personal" ON public.staff
  FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas de seguridad para las citas (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propias citas" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propias citas" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias citas" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias citas" ON public.appointments
  FOR DELETE USING (auth.uid() = user_id);

-- Crear función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar el timestamp de actualización
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Asegurarse de que las tablas sean accesibles para los usuarios autenticados
GRANT ALL ON public.staff TO authenticated;
GRANT ALL ON public.appointments TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.staff_id_seq TO authenticated;
