-- Script para verificar y corregir las columnas de la tabla services
-- Este script:
-- 1. Verifica si la tabla services existe
-- 2. Verifica y añade las columnas necesarias si no existen
-- 3. Configura las políticas de seguridad

-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Verificar si la tabla services existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'services'
    ) THEN
        RAISE NOTICE 'La tabla services existe.';
    ELSE
        RAISE EXCEPTION 'La tabla services no existe. Debes crearla primero.';
    END IF;
END
$$;

-- 2. Mostrar la estructura actual de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'services'
ORDER BY ordinal_position;

-- 3. Verificar y añadir las columnas necesarias
DO $$
BEGIN
    -- Verificar columna name
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE public.services ADD COLUMN name TEXT NOT NULL;
        RAISE NOTICE 'Columna name añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna name ya existe en la tabla services.';
    END IF;

    -- Verificar columna duration
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'duration'
    ) THEN
        ALTER TABLE public.services ADD COLUMN duration INTEGER NOT NULL DEFAULT 30;
        RAISE NOTICE 'Columna duration añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna duration ya existe en la tabla services.';
    END IF;

    -- Verificar columna price
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'price'
    ) THEN
        ALTER TABLE public.services ADD COLUMN price DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE 'Columna price añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna price ya existe en la tabla services.';
    END IF;

    -- Verificar columna category
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.services ADD COLUMN category TEXT;
        RAISE NOTICE 'Columna category añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna category ya existe en la tabla services.';
    END IF;

    -- Verificar columna description
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE public.services ADD COLUMN description TEXT;
        RAISE NOTICE 'Columna description añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna description ya existe en la tabla services.';
    END IF;

    -- Verificar columna user_id
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.services ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Columna user_id añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna user_id ya existe en la tabla services.';
    END IF;

    -- Verificar columna created_at
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.services ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna created_at añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna created_at ya existe en la tabla services.';
    END IF;

    -- Verificar columna updated_at
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.services ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna updated_at añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna updated_at ya existe en la tabla services.';
    END IF;
END
$$;

-- 4. Asignar el ID del usuario actual a los registros existentes que tengan user_id NULL
UPDATE public.services 
SET user_id = auth.uid()
WHERE user_id IS NULL;

-- 5. Habilitar Row Level Security si no está habilitado
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 6. Eliminar políticas existentes para recrearlas
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios servicios" ON public.services;

-- 7. Crear nuevas políticas
CREATE POLICY "Usuarios pueden ver sus propios servicios" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios servicios" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios servicios" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios servicios" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Otorgar permisos a usuarios autenticados
GRANT ALL ON public.services TO authenticated;

-- 9. Mostrar la estructura final de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'services'
ORDER BY ordinal_position;
