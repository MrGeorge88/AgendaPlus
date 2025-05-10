-- Script para corregir la tabla de servicios en Supabase

-- Verificar si la tabla services existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
        -- Crear la tabla services si no existe
        CREATE TABLE public.services (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            duration INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            category TEXT,
            description TEXT,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Mensaje de log
        RAISE NOTICE 'Tabla services creada correctamente.';
    ELSE
        -- Verificar si la columna user_id existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'services' 
            AND column_name = 'user_id'
        ) THEN
            -- Añadir la columna user_id si no existe
            ALTER TABLE public.services ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            
            -- Mensaje de log
            RAISE NOTICE 'Columna user_id añadida a la tabla services.';
        ELSE
            -- Mensaje de log
            RAISE NOTICE 'La columna user_id ya existe en la tabla services.';
        END IF;
    END IF;
END
$$;

-- Asegurarse de que RLS está habilitado
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Recrear las políticas de seguridad
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios servicios" ON public.services;

-- Crear políticas de seguridad para los servicios (RLS)
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
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Asegurarse de que la tabla sea accesible para los usuarios autenticados
GRANT ALL ON public.services TO authenticated;

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE 'Corrección de la tabla services completada.';
END
$$;
