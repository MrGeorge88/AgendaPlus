# Guía para arreglar el problema de la tabla de servicios

## El problema

El error que estás viendo en la consola (`"Return services.user_id does not exist"`) indica que la tabla `services` en tu base de datos Supabase no tiene la columna `user_id` que el código está intentando utilizar.

## Solución 1: Ejecutar SQL en Supabase directamente

La forma más directa de solucionar este problema es ejecutar un script SQL en el SQL Editor de Supabase:

1. Inicia sesión en tu [panel de control de Supabase](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a la sección "SQL Editor" en el menú lateral
4. Crea un nuevo script SQL
5. Copia y pega el siguiente código:

```sql
-- Verificar si la tabla services existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
        -- Crear la tabla services si no existe
        CREATE TABLE public.services (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            duration INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            category TEXT,
            description TEXT,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Tabla services creada correctamente.';
    ELSE
        -- Verificar si la columna user_id existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'services' 
            AND column_name = 'user_id'
        ) THEN
            -- Añadir la columna user_id si no existe
            ALTER TABLE public.services ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Columna user_id añadida a la tabla services.';
        ELSE
            RAISE NOTICE 'La columna user_id ya existe en la tabla services.';
        END IF;
    END IF;
END
$$;

-- Asegurarse de que RLS está habilitado
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Recrear las políticas de seguridad
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios servicios" ON public.services;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios servicios" ON public.services;

-- Crear políticas de seguridad para los servicios (RLS)
CREATE POLICY "Usuarios pueden ver sus propios servicios" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios servicios" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios servicios" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios servicios" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- Crear función para actualizar el timestamp de actualización si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar el timestamp de actualización
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Asegurarse de que la tabla sea accesible para los usuarios autenticados
GRANT ALL ON public.services TO authenticated;
```

6. Ejecuta el script haciendo clic en el botón "Run" o presionando Ctrl+Enter
7. Verifica que no haya errores en la ejecución

## Solución 2: Usar el script JavaScript

También he creado un script JavaScript que puede ejecutar este SQL automáticamente:

1. Asegúrate de tener Node.js instalado
2. Instala las dependencias necesarias:
   ```
   npm install @supabase/supabase-js dotenv
   ```
3. Ejecuta el script:
   ```
   node fix-services-table.js
   ```
4. Sigue las instrucciones en pantalla

## Solución 3: Usar la herramienta HTML

También he creado una página HTML que puedes abrir en tu navegador para ejecutar la corrección:

1. Abre el archivo `fix-services-table.html` en tu navegador
2. Ingresa tus credenciales de Supabase (URL y clave de servicio)
3. Haz clic en el botón "Corregir Tabla de Servicios"
4. Espera a que se complete la operación

## Después de aplicar la solución

Una vez que hayas aplicado cualquiera de estas soluciones:

1. Vuelve a tu aplicación AgendaPlus
2. Recarga la página
3. Intenta crear un nuevo servicio para verificar que todo funciona correctamente

Si sigues teniendo problemas, asegúrate de que:

1. Las credenciales de Supabase en tu archivo `.env` son correctas
2. Tu usuario está autenticado correctamente en la aplicación
3. Las políticas de seguridad (RLS) están configuradas correctamente

## Nota importante

Si ya tenías servicios en la tabla, pero sin la columna `user_id`, estos servicios no estarán asociados a ningún usuario. Puedes actualizar manualmente estos registros en el SQL Editor de Supabase con una consulta como:

```sql
-- Actualizar servicios existentes para asociarlos a un usuario específico
UPDATE public.services
SET user_id = 'tu-user-id-aquí'
WHERE user_id IS NULL;
```

Reemplaza `'tu-user-id-aquí'` con tu ID de usuario real de Supabase.
