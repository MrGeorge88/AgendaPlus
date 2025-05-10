# Instrucciones para arreglar la tabla de servicios

## El problema

El error que estás viendo en la consola indica que la tabla `services` no existe en tu base de datos Supabase o no está correctamente configurada. Esto impide que puedas crear, ver o gestionar servicios en tu aplicación AgendaPlus.

## Solución: Crear la tabla services en Supabase

La forma más directa de solucionar este problema es ejecutar un script SQL en el SQL Editor de Supabase para crear la tabla `services` con la estructura correcta.

### Opción 1: Ejecutar el SQL manualmente en Supabase

1. Accede a tu [panel de control de Supabase](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a la sección "SQL Editor" en el menú lateral
4. Crea un nuevo script SQL (botón "New query")
5. Copia y pega el siguiente código:

```sql
-- Eliminar la tabla si existe (para recrearla completamente)
DROP TABLE IF EXISTS public.services;

-- Crear la tabla services
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

-- Habilitar Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Usuarios pueden ver sus propios servicios" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios servicios" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios servicios" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios servicios" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- Crear función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar el timestamp
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Otorgar permisos a usuarios autenticados
GRANT ALL ON public.services TO authenticated;
```

6. Haz clic en el botón "Run" (o presiona Ctrl+Enter) para ejecutar el script
7. Verifica que no haya errores en la ejecución

### Opción 2: Usar la herramienta HTML

También he creado una página HTML que puedes abrir en tu navegador para ejecutar el SQL:

1. Abre el archivo `fix-services-direct.html` en tu navegador
2. Ingresa tu URL de Supabase (ya está prellenada)
3. Ingresa tu clave de servicio de Supabase (la puedes encontrar en la sección "Settings > API" de tu proyecto Supabase)
4. Haz clic en el botón "Crear Tabla de Servicios"
5. Espera a que se complete la operación

## Después de aplicar la solución

Una vez que hayas ejecutado el script SQL:

1. Vuelve a tu aplicación AgendaPlus
2. Recarga la página
3. Intenta crear un nuevo servicio para verificar que todo funciona correctamente

## Verificación adicional

Si quieres verificar que la tabla se ha creado correctamente, puedes:

1. Ir a la sección "Table Editor" en el panel de Supabase
2. Buscar la tabla "services" en la lista
3. Verificar que tiene las columnas correctas: id, name, duration, price, category, description, user_id, created_at, updated_at

## Posibles problemas

Si sigues teniendo problemas después de crear la tabla:

1. **Problema con las políticas de seguridad**: Asegúrate de que estás autenticado en la aplicación antes de intentar crear un servicio.
2. **Problema con la columna user_id**: Verifica que la columna user_id existe y está configurada correctamente.
3. **Problema con los permisos**: Asegúrate de que has otorgado los permisos correctos a los usuarios autenticados.

## Nota importante

Este script elimina la tabla `services` si ya existe y la crea de nuevo. Si ya tenías servicios en la tabla, se perderán. Si necesitas conservar los datos existentes, deberías hacer una copia de seguridad antes de ejecutar el script.
