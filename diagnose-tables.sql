-- Script para diagnosticar el estado actual de las tablas
-- Ejecutar directamente en el SQL Editor de Supabase

-- Verificar si la tabla staff existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'staff'
) AS staff_table_exists;

-- Verificar si la tabla appointments existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments'
) AS appointments_table_exists;

-- Listar las columnas de la tabla staff
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'staff'
ORDER BY ordinal_position;

-- Listar las columnas de la tabla appointments
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'appointments'
ORDER BY ordinal_position;

-- Verificar las políticas de seguridad para staff
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'staff';

-- Verificar las políticas de seguridad para appointments
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'appointments';

-- Verificar los triggers para staff
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'staff';

-- Verificar los triggers para appointments
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'appointments';
