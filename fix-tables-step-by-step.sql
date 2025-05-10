-- Script paso a paso para corregir las tablas
-- Ejecutar directamente en el SQL Editor de Supabase

-- Paso 1: Crear función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Paso 2: Verificar y corregir la tabla staff
-- Crear la tabla staff si no existe
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    color TEXT DEFAULT '#4f46e5',
    avatar_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Añadir columnas a la tabla staff si no existen
ALTER TABLE public.staff 
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#4f46e5',
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar los registros existentes para que name no sea NULL
UPDATE public.staff SET name = 'Sin nombre' WHERE name IS NULL;

-- Hacer que la columna name sea NOT NULL
ALTER TABLE public.staff ALTER COLUMN name SET NOT NULL;

-- Habilitar RLS en la tabla staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para staff
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios profesionales" ON public.staff;
CREATE POLICY "Usuarios pueden ver sus propios profesionales" ON public.staff
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios profesionales" ON public.staff;
CREATE POLICY "Usuarios pueden insertar sus propios profesionales" ON public.staff
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios profesionales" ON public.staff;
CREATE POLICY "Usuarios pueden actualizar sus propios profesionales" ON public.staff
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios profesionales" ON public.staff;
CREATE POLICY "Usuarios pueden eliminar sus propios profesionales" ON public.staff
    FOR DELETE USING (auth.uid() = user_id);

-- Crear trigger para actualizar el timestamp
DROP TRIGGER IF EXISTS update_staff_updated_at ON public.staff;
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Paso 3: Verificar y corregir la tabla appointments
-- Crear la tabla appointments si no existe
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    client_name TEXT,
    service_name TEXT,
    color TEXT DEFAULT '#4f46e5',
    price DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'pending',
    total_paid DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Añadir columnas a la tabla appointments si no existen
ALTER TABLE public.appointments 
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
    ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS client_name TEXT,
    ADD COLUMN IF NOT EXISTS service_name TEXT,
    ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#4f46e5',
    ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed',
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS total_paid DECIMAL(10, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar los registros existentes para que los campos requeridos no sean NULL
UPDATE public.appointments SET title = 'Cita sin título' WHERE title IS NULL;
UPDATE public.appointments SET start_time = NOW() WHERE start_time IS NULL;
UPDATE public.appointments SET end_time = (NOW() + INTERVAL '1 hour') WHERE end_time IS NULL;

-- Hacer que las columnas requeridas sean NOT NULL
ALTER TABLE public.appointments 
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN start_time SET NOT NULL,
    ALTER COLUMN end_time SET NOT NULL;

-- Habilitar RLS en la tabla appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para appointments
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias citas" ON public.appointments;
CREATE POLICY "Usuarios pueden ver sus propias citas" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden insertar sus propias citas" ON public.appointments;
CREATE POLICY "Usuarios pueden insertar sus propias citas" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias citas" ON public.appointments;
CREATE POLICY "Usuarios pueden actualizar sus propias citas" ON public.appointments
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias citas" ON public.appointments;
CREATE POLICY "Usuarios pueden eliminar sus propias citas" ON public.appointments
    FOR DELETE USING (auth.uid() = user_id);

-- Crear trigger para actualizar el timestamp
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Paso 4: Asegurarse de que las tablas sean accesibles para los usuarios autenticados
GRANT ALL ON public.staff TO authenticated;
GRANT ALL ON public.appointments TO authenticated;
