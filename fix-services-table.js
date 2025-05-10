/**
 * Script para corregir la tabla de servicios en Supabase
 * 
 * Este script verifica si la tabla services existe y si tiene la columna user_id.
 * Si no existe, la crea. Si existe pero no tiene la columna user_id, la añade.
 * 
 * Uso: node fix-services-table.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const readline = require('readline');

// Configurar readline para entrada interactiva
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para preguntar al usuario
function pregunta(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => {
      resolve(respuesta);
    });
  });
}

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Cargar variables de entorno
const envPath = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

// SQL para corregir la tabla services
const fixServicesSQL = `
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
`;

// Función principal
async function main() {
  try {
    console.log(`${colors.bright}Corrección de la tabla services en Supabase${colors.reset}\n`);
    
    // Obtener credenciales de Supabase
    let supabaseUrl = process.env.VITE_SUPABASE_URL;
    let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    // Si no hay credenciales en el .env, pedirlas al usuario
    if (!supabaseUrl) {
      supabaseUrl = await pregunta('URL de Supabase (ej: https://abcdefghijklm.supabase.co): ');
    } else {
      console.log(`URL de Supabase: ${supabaseUrl}`);
    }
    
    if (!supabaseKey) {
      supabaseKey = await pregunta('Clave de servicio de Supabase: ');
    } else {
      console.log(`Clave de Supabase: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}`);
    }
    
    if (!supabaseUrl || !supabaseKey) {
      console.error(`${colors.red}Error: Debes proporcionar la URL y la clave de Supabase.${colors.reset}`);
      process.exit(1);
    }
    
    // Crear cliente de Supabase
    console.log(`\n${colors.cyan}Conectando con Supabase...${colors.reset}`);
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar la conexión
    const { error: connectionError } = await supabase.from('services').select('count(*)', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error(`${colors.red}Error al conectar con Supabase: ${connectionError.message}${colors.reset}`);
      
      if (connectionError.code === '42P01') {
        console.log(`${colors.yellow}La tabla services no existe. Se creará a continuación.${colors.reset}`);
      } else {
        console.error(`${colors.red}Código de error: ${connectionError.code}${colors.reset}`);
        process.exit(1);
      }
    } else {
      console.log(`${colors.green}Conexión a Supabase exitosa.${colors.reset}`);
    }
    
    // Ejecutar SQL para corregir la tabla
    console.log(`\n${colors.cyan}Ejecutando SQL para corregir la tabla services...${colors.reset}`);
    
    // Ejecutar el SQL usando rpc
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: fixServicesSQL });
    
    if (sqlError) {
      console.error(`${colors.red}Error al ejecutar SQL: ${sqlError.message}${colors.reset}`);
      console.error(`${colors.red}Código de error: ${sqlError.code}${colors.reset}`);
      
      // Si el error es que la función rpc no existe, sugerir ejecutar el SQL manualmente
      if (sqlError.code === 'PGRST116') {
        console.log(`\n${colors.yellow}La función exec_sql no existe en tu proyecto de Supabase.${colors.reset}`);
        console.log(`${colors.yellow}Por favor, ejecuta el siguiente SQL manualmente en el SQL Editor de Supabase:${colors.reset}\n`);
        console.log(fixServicesSQL);
      }
      
      process.exit(1);
    } else {
      console.log(`${colors.green}SQL ejecutado correctamente.${colors.reset}`);
    }
    
    // Verificar que la tabla y la columna existen ahora
    console.log(`\n${colors.cyan}Verificando la corrección...${colors.reset}`);
    
    const { error: verifyError } = await supabase.from('services').select('user_id').limit(1);
    
    if (verifyError) {
      console.error(`${colors.red}Error al verificar la corrección: ${verifyError.message}${colors.reset}`);
      process.exit(1);
    } else {
      console.log(`${colors.green}¡Corrección completada con éxito!${colors.reset}`);
      console.log(`${colors.green}La tabla services ahora tiene la columna user_id.${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`${colors.red}Error inesperado: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Ejecutar la función principal
main();
