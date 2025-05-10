-- Script para recrear o corregir la tabla staff
-- Ejecutar directamente en el SQL Editor de Supabase

-- Verificar si la tabla staff existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'staff'
    ) THEN
        -- Crear la tabla staff si no existe
        CREATE TABLE public.staff (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            color TEXT DEFAULT '#4f46e5',
            avatar_url TEXT,
            email TEXT,
            phone TEXT,
            specialty TEXT,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Crear políticas de seguridad para el personal (RLS)
        ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Usuarios pueden ver sus propios profesionales" ON public.staff
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Usuarios pueden insertar sus propios profesionales" ON public.staff
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Usuarios pueden actualizar sus propios profesionales" ON public.staff
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Usuarios pueden eliminar sus propios profesionales" ON public.staff
            FOR DELETE USING (auth.uid() = user_id);
            
        -- Crear trigger para actualizar el timestamp de actualización
        CREATE TRIGGER update_staff_updated_at
        BEFORE UPDATE ON public.staff
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Tabla staff creada correctamente.';
    ELSE
        -- Si la tabla ya existe, verificar y añadir columnas faltantes
        
        -- Verificar si la columna id es UUID o INTEGER
        DECLARE
            id_type TEXT;
        BEGIN
            SELECT data_type INTO id_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'staff'
            AND column_name = 'id';
            
            IF id_type = 'integer' THEN
                RAISE NOTICE 'La columna id de la tabla staff es de tipo INTEGER. Se recomienda recrear la tabla con UUID.';
            ELSIF id_type != 'uuid' THEN
                RAISE NOTICE 'La columna id de la tabla staff es de tipo %', id_type;
            END IF;
        END;
        
        -- Añadir columna name si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'name'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN name TEXT;
            -- Actualizar los registros existentes para que name no sea NULL
            UPDATE public.staff SET name = 'Sin nombre' WHERE name IS NULL;
            -- Hacer la columna NOT NULL después de actualizar los datos
            ALTER TABLE public.staff ALTER COLUMN name SET NOT NULL;
            RAISE NOTICE 'Columna name añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna color si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'color'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN color TEXT DEFAULT '#4f46e5';
            RAISE NOTICE 'Columna color añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna avatar_url si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'avatar_url'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN avatar_url TEXT;
            RAISE NOTICE 'Columna avatar_url añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna email si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'email'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN email TEXT;
            RAISE NOTICE 'Columna email añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna phone si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'phone'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN phone TEXT;
            RAISE NOTICE 'Columna phone añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna specialty si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'specialty'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN specialty TEXT;
            RAISE NOTICE 'Columna specialty añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna user_id si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'user_id'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            -- Actualizar los registros existentes para que user_id no sea NULL
            -- Esto requiere que sepamos qué user_id asignar, así que lo dejamos como NULL por ahora
            RAISE NOTICE 'Columna user_id añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna created_at si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'created_at'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Columna created_at añadida a la tabla staff.';
        END IF;
        
        -- Añadir columna updated_at si no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'staff' 
            AND column_name = 'updated_at'
        ) THEN
            ALTER TABLE public.staff ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Columna updated_at añadida a la tabla staff.';
        END IF;
        
        RAISE NOTICE 'Tabla staff actualizada correctamente.';
    END IF;
END
$$;

-- Asegurarse de que la tabla sea accesible para los usuarios autenticados
GRANT ALL ON public.staff TO authenticated;

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
        WHERE tgname = 'update_staff_updated_at'
    ) THEN
        -- Crear trigger para actualizar el timestamp
        CREATE TRIGGER update_staff_updated_at
        BEFORE UPDATE ON public.staff
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Trigger update_staff_updated_at creado.';
    END IF;
END
$$;

-- Verificar si existen las políticas de seguridad
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'staff' 
        AND policyname = 'Usuarios pueden ver sus propios profesionales'
    ) THEN
        -- Crear políticas de seguridad
        CREATE POLICY "Usuarios pueden ver sus propios profesionales" ON public.staff
            FOR SELECT USING (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden ver sus propios profesionales" creada.';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'staff' 
        AND policyname = 'Usuarios pueden insertar sus propios profesionales'
    ) THEN
        CREATE POLICY "Usuarios pueden insertar sus propios profesionales" ON public.staff
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden insertar sus propios profesionales" creada.';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'staff' 
        AND policyname = 'Usuarios pueden actualizar sus propios profesionales'
    ) THEN
        CREATE POLICY "Usuarios pueden actualizar sus propios profesionales" ON public.staff
            FOR UPDATE USING (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden actualizar sus propios profesionales" creada.';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'staff' 
        AND policyname = 'Usuarios pueden eliminar sus propios profesionales'
    ) THEN
        CREATE POLICY "Usuarios pueden eliminar sus propios profesionales" ON public.staff
            FOR DELETE USING (auth.uid() = user_id);
            
        RAISE NOTICE 'Política "Usuarios pueden eliminar sus propios profesionales" creada.';
    END IF;
END
$$;
