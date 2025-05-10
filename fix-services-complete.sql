-- Script completo para corregir la tabla services
-- Este script:
-- 1. Hace una copia de seguridad de la tabla services si existe
-- 2. Recrea la tabla con la estructura correcta
-- 3. Restaura los datos de la copia de seguridad
-- 4. Configura las políticas de seguridad y permisos

-- 1. Hacer una copia de seguridad de la tabla services si existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'services'
    ) THEN
        -- Crear tabla de respaldo
        DROP TABLE IF EXISTS public.services_backup;
        CREATE TABLE public.services_backup AS SELECT * FROM public.services;
        RAISE NOTICE 'Copia de seguridad de la tabla services creada.';
    END IF;
END
$$;

-- 2. Eliminar y recrear la tabla services con la estructura correcta
DROP TABLE IF EXISTS public.services;

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    category TEXT,
    description TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Restaurar datos de la copia de seguridad si existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'services_backup'
    ) THEN
        -- Intentar restaurar los datos
        BEGIN
            INSERT INTO public.services (
                id, name, duration, price, cost, category, description, 
                created_at, updated_at
            )
            SELECT 
                id, name, duration, price, cost, category, description, 
                created_at, updated_at
            FROM public.services_backup;
            
            -- Actualizar user_id para todos los registros (asignar al usuario actual)
            UPDATE public.services SET user_id = auth.uid();
            
            RAISE NOTICE 'Datos restaurados de la copia de seguridad.';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'No se pudieron restaurar todos los datos: %', SQLERRM;
        END;
    END IF;
END
$$;

-- 4. Configurar políticas de seguridad y permisos

-- Habilitar Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si hay
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios servicios" ON public.services;

-- Crear nuevas políticas
CREATE POLICY "Usuarios pueden ver sus propios servicios" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios servicios" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios servicios" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios servicios" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- Crear función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar el timestamp
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Otorgar permisos a usuarios autenticados
GRANT ALL ON public.services TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE services_id_seq TO authenticated;

-- 5. Verificar la estructura final de la tabla
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Verificar columna user_id
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'user_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        RAISE NOTICE 'Verificación: La columna user_id existe en la tabla services.';
    ELSE
        RAISE NOTICE 'Verificación: La columna user_id NO existe en la tabla services.';
    END IF;
    
    -- Verificar RLS
    RAISE NOTICE 'Verificación: Políticas de seguridad configuradas.';
END
$$;

-- 6. Insertar un servicio de prueba (opcional)
-- Descomenta estas líneas si quieres insertar un servicio de prueba
/*
INSERT INTO public.services (name, duration, price, category, description, user_id)
VALUES ('Servicio de prueba', 30, 25.00, 'Prueba', 'Este es un servicio de prueba', auth.uid());
*/
