-- Script para modificar la tabla services existente sin eliminarla
-- Este script:
-- 1. Verifica y añade la columna user_id si no existe
-- 2. Configura las políticas de seguridad
-- 3. Asigna un valor predeterminado a user_id para los registros existentes

-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Verificar y añadir la columna user_id si no existe
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

-- 2. Asignar el ID del usuario actual a los registros existentes que tengan user_id NULL
-- Esto asignará todos los servicios existentes al usuario que ejecuta este script
UPDATE public.services 
SET user_id = auth.uid()
WHERE user_id IS NULL;

-- 3. Hacer que user_id sea NOT NULL después de asignar valores
ALTER TABLE public.services ALTER COLUMN user_id SET NOT NULL;

-- 4. Habilitar Row Level Security si no está habilitado
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 5. Eliminar políticas existentes si hay
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

-- 7. Crear función para actualizar el timestamp si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear trigger para actualizar el timestamp si no existe
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 9. Crear trigger para establecer user_id automáticamente en nuevas inserciones
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_services_user_id ON public.services;
CREATE TRIGGER set_services_user_id
BEFORE INSERT ON public.services
FOR EACH ROW
EXECUTE FUNCTION set_user_id();

-- 10. Otorgar permisos a usuarios autenticados
GRANT ALL ON public.services TO authenticated;

-- 11. Verificar la estructura final de la tabla
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
