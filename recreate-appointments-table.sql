-- Script completo para recrear o corregir la tabla appointments
-- Ejecutar directamente en el SQL Editor de Supabase

-- Verificar si la tabla appointments existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments'
    ) THEN
        -- Crear la tabla appointments si no existe
        CREATE TABLE public.appointments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            start_time TIMESTAMP WITH TIME ZONE NOT NULL,
            end_time TIMESTAMP WITH TIME ZONE NOT NULL,
            staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
            client_name TEXT,
            service_name TEXT,
            color TEXT DEFAULT '#4f46e5',
            price DECIMAL(10, 2) DEFAULT 0,
            status TEXT DEFAULT 'confirmed',
            payment_status TEXT DEFAULT 'pending',
            total_paid DECIMAL(10, 2) DEFAULT 0,
            notes TEXT,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Crear políticas de seguridad para las citas (RLS)
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Usuarios pueden ver sus propias citas" ON public.appointments
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Usuarios pueden insertar sus propias citas" ON public.appointments
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Usuarios pueden actualizar sus propias citas" ON public.appointments
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Usuarios pueden eliminar sus propias citas" ON public.appointments
            FOR DELETE USING (auth.uid() = user_id);
            
        -- Crear trigger para actualizar el timestamp de actualización
        CREATE TRIGGER update_appointments_updated_at
        BEFORE UPDATE ON public.appointments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Tabla appointments creada correctamente.';
    ELSE
        -- Si la tabla ya existe, verificar y añadir columnas faltantes
        
        -- Añadir columna title si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'title'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN title TEXT;
            -- Actualizar los registros existentes para que title no sea NULL
            UPDATE public.appointments SET title = 'Cita sin título' WHERE title IS NULL;
            -- Hacer la columna NOT NULL después de actualizar los datos
            ALTER TABLE public.appointments ALTER COLUMN title SET NOT NULL;
            RAISE NOTICE 'Columna title añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna start_time si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'start_time'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN start_time TIMESTAMP WITH TIME ZONE;
            -- Actualizar los registros existentes para que start_time no sea NULL
            UPDATE public.appointments SET start_time = NOW() WHERE start_time IS NULL;
            -- Hacer la columna NOT NULL después de actualizar los datos
            ALTER TABLE public.appointments ALTER COLUMN start_time SET NOT NULL;
            RAISE NOTICE 'Columna start_time añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna end_time si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'end_time'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN end_time TIMESTAMP WITH TIME ZONE;
            -- Actualizar los registros existentes para que end_time no sea NULL
            UPDATE public.appointments SET end_time = NOW() + INTERVAL '1 hour' WHERE end_time IS NULL;
            -- Hacer la columna NOT NULL después de actualizar los datos
            ALTER TABLE public.appointments ALTER COLUMN end_time SET NOT NULL;
            RAISE NOTICE 'Columna end_time añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna staff_id si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'staff_id'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE;
            RAISE NOTICE 'Columna staff_id añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna client_name si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'client_name'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN client_name TEXT;
            RAISE NOTICE 'Columna client_name añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna service_name si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'service_name'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN service_name TEXT;
            RAISE NOTICE 'Columna service_name añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna color si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'color'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN color TEXT DEFAULT '#4f46e5';
            RAISE NOTICE 'Columna color añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna price si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'price'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN price DECIMAL(10, 2) DEFAULT 0;
            RAISE NOTICE 'Columna price añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna status si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'status'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN status TEXT DEFAULT 'confirmed';
            RAISE NOTICE 'Columna status añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna payment_status si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'payment_status'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN payment_status TEXT DEFAULT 'pending';
            RAISE NOTICE 'Columna payment_status añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna total_paid si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'total_paid'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN total_paid DECIMAL(10, 2) DEFAULT 0;
            RAISE NOTICE 'Columna total_paid añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna notes si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'notes'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN notes TEXT;
            RAISE NOTICE 'Columna notes añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna user_id si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'user_id'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            -- Actualizar los registros existentes para que user_id no sea NULL
            -- Esto requiere que sepamos qué user_id asignar, así que lo dejamos como NULL por ahora
            RAISE NOTICE 'Columna user_id añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna created_at si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'created_at'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Columna created_at añadida a la tabla appointments.';
        END IF;
        
        -- Añadir columna updated_at si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments' 
            AND column_name = 'updated_at'
        ) THEN
            ALTER TABLE public.appointments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Columna updated_at añadida a la tabla appointments.';
        END IF;
        
        RAISE NOTICE 'Tabla appointments actualizada correctamente.';
    END IF;
END
$$;

-- Asegurarse de que la tabla sea accesible para los usuarios autenticados
GRANT ALL ON public.appointments TO authenticated;

-- Verificar si existe la función update_updated_at_column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'update_updated_at_column'
    ) THEN
        -- Crear función para actualizar el timestamp
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        RAISE NOTICE 'Función update_updated_at_column creada.';
    END IF;
END
$$;

-- Verificar si existe el trigger para updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'update_appointments_updated_at'
    ) THEN
        -- Crear trigger para actualizar el timestamp
        CREATE TRIGGER update_appointments_updated_at
        BEFORE UPDATE ON public.appointments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Trigger update_appointments_updated_at creado.';
    END IF;
END
$$;

-- Verificar si existen las políticas de seguridad
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'appointments' 
        AND policyname = 'Usuarios pueden ver sus propias citas'
    ) THEN
        -- Crear políticas de seguridad
        CREATE POLICY "Usuarios pueden ver sus propias citas" ON public.appointments
            FOR SELECT USING (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden ver sus propias citas" creada.';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'appointments' 
        AND policyname = 'Usuarios pueden insertar sus propias citas'
    ) THEN
        CREATE POLICY "Usuarios pueden insertar sus propias citas" ON public.appointments
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden insertar sus propias citas" creada.';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'appointments' 
        AND policyname = 'Usuarios pueden actualizar sus propias citas'
    ) THEN
        CREATE POLICY "Usuarios pueden actualizar sus propias citas" ON public.appointments
            FOR UPDATE USING (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden actualizar sus propias citas" creada.';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'appointments' 
        AND policyname = 'Usuarios pueden eliminar sus propias citas'
    ) THEN
        CREATE POLICY "Usuarios pueden eliminar sus propias citas" ON public.appointments
            FOR DELETE USING (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden eliminar sus propias citas" creada.';
    END IF;
END
$$;
