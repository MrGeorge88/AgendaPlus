-- Script para verificar los IDs de la tabla staff
-- Ejecutar directamente en el SQL Editor de Supabase

-- Mostrar todos los registros de la tabla staff
SELECT id, name, user_id FROM public.staff;

-- Verificar el tipo de datos de la columna id
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'staff'
AND column_name = 'id';
