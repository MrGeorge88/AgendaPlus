-- Script para corregir las tablas staff y appointments
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
-- Primero eliminamos la restricción de clave foránea si existe
ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS appointments_staff_id_fkey;

-- Luego modificamos el tipo de la columna
ALTER TABLE public.appointments 
ALTER COLUMN staff_id TYPE INTEGER USING staff_id::text::integer;

-- Finalmente, recreamos la restricción de clave foránea
ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_staff_id_fkey 
FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE;

-- Verificar que la columna se haya modificado correctamente
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'appointments'
AND column_name = 'staff_id';

-- Mostrar las citas actualizadas
SELECT id, title, staff_id
FROM public.appointments
WHERE staff_id IS NOT NULL;
