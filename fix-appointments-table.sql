-- Script para corregir la tabla appointments
-- Este script:
-- 1. Verifica si existen las columnas client_name y service_name
-- 2. Las añade si no existen
-- 3. Configura los permisos adecuados

-- Verificar y añadir columna client_name si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments' 
        AND column_name = 'client_name'
    ) THEN
        ALTER TABLE public.appointments ADD COLUMN client_name TEXT;
        RAISE NOTICE 'Columna client_name añadida a la tabla appointments.';
    ELSE
        RAISE NOTICE 'La columna client_name ya existe en la tabla appointments.';
    END IF;
END
$$;

-- Verificar y añadir columna service_name si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments' 
        AND column_name = 'service_name'
    ) THEN
        ALTER TABLE public.appointments ADD COLUMN service_name TEXT;
        RAISE NOTICE 'Columna service_name añadida a la tabla appointments.';
    ELSE
        RAISE NOTICE 'La columna service_name ya existe en la tabla appointments.';
    END IF;
END
$$;

-- Verificar y añadir columna color si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments' 
        AND column_name = 'color'
    ) THEN
        ALTER TABLE public.appointments ADD COLUMN color TEXT DEFAULT '#4f46e5';
        RAISE NOTICE 'Columna color añadida a la tabla appointments.';
    ELSE
        RAISE NOTICE 'La columna color ya existe en la tabla appointments.';
    END IF;
END
$$;

-- Verificar y añadir columna payment_status si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments' 
        AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE public.appointments ADD COLUMN payment_status TEXT DEFAULT 'pending';
        RAISE NOTICE 'Columna payment_status añadida a la tabla appointments.';
    ELSE
        RAISE NOTICE 'La columna payment_status ya existe en la tabla appointments.';
    END IF;
END
$$;

-- Verificar y añadir columna total_paid si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments' 
        AND column_name = 'total_paid'
    ) THEN
        ALTER TABLE public.appointments ADD COLUMN total_paid DECIMAL(10, 2) DEFAULT 0;
        RAISE NOTICE 'Columna total_paid añadida a la tabla appointments.';
    ELSE
        RAISE NOTICE 'La columna total_paid ya existe en la tabla appointments.';
    END IF;
END
$$;

-- Verificar y añadir columna price si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments' 
        AND column_name = 'price'
    ) THEN
        ALTER TABLE public.appointments ADD COLUMN price DECIMAL(10, 2) DEFAULT 0;
        RAISE NOTICE 'Columna price añadida a la tabla appointments.';
    ELSE
        RAISE NOTICE 'La columna price ya existe en la tabla appointments.';
    END IF;
END
$$;

-- Asegurarse de que la tabla sea accesible para los usuarios autenticados
GRANT ALL ON public.appointments TO authenticated;

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE 'Corrección de la tabla appointments completada.';
END
$$;
