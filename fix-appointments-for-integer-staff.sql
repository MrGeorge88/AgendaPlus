-- Script para corregir las citas que usan IDs de staff numéricos
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

-- Solución: Modificar la columna staff_id en appointments para que sea INTEGER
ALTER TABLE public.appointments 
ALTER COLUMN staff_id TYPE INTEGER USING staff_id::text::integer;

-- Verificar que la columna se haya modificado correctamente
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'appointments'
AND column_name = 'staff_id';

-- Actualizar las referencias en las citas
UPDATE public.appointments
SET staff_id = NULL
WHERE staff_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.staff WHERE id = staff_id::text::integer
);

-- Mostrar las citas actualizadas
SELECT id, title, staff_id
FROM public.appointments
WHERE staff_id IS NOT NULL;
