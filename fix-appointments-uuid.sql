-- Script para corregir las citas que usan IDs de staff incorrectos
-- Ejecutar directamente en el SQL Editor de Supabase

-- Verificar el tipo de datos de la columna id en la tabla staff
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'staff'
AND column_name = 'id';

-- Verificar el tipo de datos de la columna staff_id en la tabla appointments
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'appointments'
AND column_name = 'staff_id';

-- Mostrar los registros de staff
SELECT id, name, user_id FROM public.staff;

-- Mostrar las citas con problemas
SELECT id, title, staff_id
FROM public.appointments
WHERE staff_id IS NOT NULL;

-- Solución: Eliminar las citas con staff_id inválido
DELETE FROM public.appointments
WHERE staff_id IS NOT NULL 
AND NOT EXISTS (
    SELECT 1 FROM public.staff WHERE id = staff_id
);

-- Mostrar las citas restantes
SELECT id, title, staff_id
FROM public.appointments
WHERE staff_id IS NOT NULL;
