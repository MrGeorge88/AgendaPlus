-- Script para corregir los IDs de staff si son numéricos
-- Ejecutar directamente en el SQL Editor de Supabase

-- Crear una tabla temporal para almacenar los IDs antiguos y nuevos
CREATE TEMP TABLE staff_id_mapping (
    old_id TEXT,
    new_id UUID DEFAULT uuid_generate_v4()
);

-- Insertar los IDs de staff que no son UUIDs válidos
INSERT INTO staff_id_mapping (old_id)
SELECT id::text
FROM public.staff
WHERE NOT (id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- Mostrar el mapeo de IDs
SELECT * FROM staff_id_mapping;

-- Actualizar las citas que usan los IDs antiguos
DO $$
DECLARE
    mapping RECORD;
BEGIN
    FOR mapping IN SELECT * FROM staff_id_mapping LOOP
        UPDATE public.appointments
        SET staff_id = mapping.new_id
        WHERE staff_id::text = mapping.old_id;
        
        RAISE NOTICE 'Actualizado staff_id % a % en la tabla appointments', mapping.old_id, mapping.new_id;
    END LOOP;
END
$$;

-- Actualizar los IDs de staff
DO $$
DECLARE
    mapping RECORD;
BEGIN
    FOR mapping IN SELECT * FROM staff_id_mapping LOOP
        UPDATE public.staff
        SET id = mapping.new_id
        WHERE id::text = mapping.old_id;
        
        RAISE NOTICE 'Actualizado id % a % en la tabla staff', mapping.old_id, mapping.new_id;
    END LOOP;
END
$$;

-- Eliminar la tabla temporal
DROP TABLE staff_id_mapping;

-- Verificar los resultados
SELECT id, name, user_id FROM public.staff;

-- Verificar si hay alguna cita que use un staff_id que no sea UUID
SELECT id, title, staff_id
FROM public.appointments
WHERE staff_id IS NOT NULL
AND NOT (staff_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
