-- Script para agregar campos faltantes a la tabla staff existente
-- Ejecutar este script en Supabase SQL Editor

-- Agregar campos email, phone y specialty a la tabla staff
ALTER TABLE public.staff 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS specialty TEXT;

-- Verificar que los campos se agregaron correctamente
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'staff' AND table_schema = 'public'
-- ORDER BY ordinal_position;
