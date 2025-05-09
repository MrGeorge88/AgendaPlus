-- Configuración de seguridad para AgendaPlus en Supabase

-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Asegurarse de que RLS está habilitado en todas las tablas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios clientes" ON clients;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios clientes" ON clients;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios clientes" ON clients;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios clientes" ON clients;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propios servicios" ON services;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios servicios" ON services;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios servicios" ON services;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios servicios" ON services;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propios profesionales" ON staff;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios profesionales" ON staff;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios profesionales" ON staff;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios profesionales" ON staff;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propias citas" ON appointments;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propias citas" ON appointments;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias citas" ON appointments;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias citas" ON appointments;

-- Crear políticas para clientes
CREATE POLICY "Usuarios pueden ver sus propios clientes" 
  ON clients FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios clientes" 
  ON clients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios clientes" 
  ON clients FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios clientes" 
  ON clients FOR DELETE 
  USING (auth.uid() = user_id);

-- Crear políticas para servicios
CREATE POLICY "Usuarios pueden ver sus propios servicios" 
  ON services FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios servicios" 
  ON services FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios servicios" 
  ON services FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios servicios" 
  ON services FOR DELETE 
  USING (auth.uid() = user_id);

-- Crear políticas para profesionales
CREATE POLICY "Usuarios pueden ver sus propios profesionales" 
  ON staff FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios profesionales" 
  ON staff FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios profesionales" 
  ON staff FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios profesionales" 
  ON staff FOR DELETE 
  USING (auth.uid() = user_id);

-- Crear políticas para citas
CREATE POLICY "Usuarios pueden ver sus propias citas" 
  ON appointments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propias citas" 
  ON appointments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias citas" 
  ON appointments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias citas" 
  ON appointments FOR DELETE 
  USING (auth.uid() = user_id);

-- Crear función para establecer el user_id automáticamente
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear triggers para establecer el user_id automáticamente
DROP TRIGGER IF EXISTS set_clients_user_id ON clients;
CREATE TRIGGER set_clients_user_id
  BEFORE INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_services_user_id ON services;
CREATE TRIGGER set_services_user_id
  BEFORE INSERT ON services
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_staff_user_id ON staff;
CREATE TRIGGER set_staff_user_id
  BEFORE INSERT ON staff
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_appointments_user_id ON appointments;
CREATE TRIGGER set_appointments_user_id
  BEFORE INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();
