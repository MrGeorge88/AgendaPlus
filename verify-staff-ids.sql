-- Script para verificar y corregir los IDs de staff
-- Ejecutar directamente en el SQL Editor de Supabase

-- Mostrar todos los registros de la tabla staff
SELECT id, name, user_id FROM public.staff;

-- Verificar el tipo de datos de la columna id
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'staff'
AND column_name = 'id';

-- Verificar si hay alguna cita que use un staff_id que no sea UUID
SELECT id, title, staff_id
FROM public.appointments
WHERE staff_id IS NOT NULL
AND NOT (staff_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- Verificar si hay alguna cita que use un staff_id que no exista en la tabla staff
SELECT a.id, a.title, a.staff_id
FROM public.appointments a
LEFT JOIN public.staff s ON a.staff_id = s.id
WHERE a.staff_id IS NOT NULL
AND s.id IS NULL;
