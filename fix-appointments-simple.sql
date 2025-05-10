-- Script simplificado para corregir la tabla appointments
-- Ejecutar directamente en el SQL Editor de Supabase

-- Añadir columna client_name si no existe
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS client_name TEXT;

-- Añadir columna service_name si no existe
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS service_name TEXT;

-- Añadir columna color si no existe
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#4f46e5';

-- Añadir columna payment_status si no existe
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Añadir columna total_paid si no existe
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS total_paid DECIMAL(10, 2) DEFAULT 0;

-- Añadir columna price si no existe
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0;

-- Asegurarse de que la tabla sea accesible para los usuarios autenticados
GRANT ALL ON public.appointments TO authenticated;
