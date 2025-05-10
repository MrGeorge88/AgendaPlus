-- Script simplificado para corregir la tabla services
-- Este script:
-- 1. Verifica si la tabla services existe
-- 2. Verifica y corrige las políticas de seguridad
-- 3. NO elimina la tabla existente

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

-- 2. Verificar y añadir la columna user_id si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = 'user_id'
    ) THEN
        -- Añadir la columna user_id
        ALTER TABLE public.services ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Columna user_id añadida a la tabla services.';
    ELSE
        RAISE NOTICE 'La columna user_id ya existe en la tabla services.';
    END IF;
END
$$;

-- 3. Verificar si hay registros sin user_id y asignarles el usuario actual
UPDATE public.services 
SET user_id = auth.uid()
WHERE user_id IS NULL;

-- 4. Habilitar Row Level Security si no está habilitado
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 5. Eliminar políticas existentes para recrearlas
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios servicios" ON public.services;

-- 6. Crear nuevas políticas
CREATE POLICY "Usuarios pueden ver sus propios servicios" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios servicios" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios servicios" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios servicios" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Otorgar permisos a usuarios autenticados
GRANT ALL ON public.services TO authenticated;

-- 8. Mostrar la estructura actual de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'services'
ORDER BY ordinal_position;
