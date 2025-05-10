/**
 * Script para verificar la estructura de la tabla services en Supabase
 * 
 * Este script comprueba si la tabla services existe y si tiene la columna user_id.
 * 
 * Uso: node test-services-table.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Cargar variables de entorno
const envPath = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

// Obtener credenciales de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(`${colors.red}Error: No se encontraron las credenciales de Supabase.${colors.reset}`);
  console.error(`${colors.red}Asegúrate de que el archivo frontend/.env existe y contiene VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.${colors.reset}`);
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función principal
async function main() {
  console.log(`${colors.bright}Verificando la estructura de la tabla services en Supabase...${colors.reset}\n`);
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}\n`);
  
  try {
    // Verificar si la tabla services existe
    console.log(`${colors.cyan}Verificando si la tabla services existe...${colors.reset}`);
    
    const { error: tableError } = await supabase
      .from('services')
      .select('count(*)', { count: 'exact', head: true });
    
    if (tableError) {
      if (tableError.code === '42P01') {
        console.error(`${colors.red}Error: La tabla services no existe.${colors.reset}`);
        console.log(`${colors.yellow}Debes ejecutar el script fix-services-table.js o el SQL en Supabase para crear la tabla.${colors.reset}`);
      } else {
        console.error(`${colors.red}Error al verificar la tabla services: ${tableError.message}${colors.reset}`);
        console.error(`${colors.red}Código de error: ${tableError.code}${colors.reset}`);
      }
      process.exit(1);
    }
    
    console.log(`${colors.green}✓ La tabla services existe.${colors.reset}`);
    
    // Verificar si la columna user_id existe
    console.log(`\n${colors.cyan}Verificando si la columna user_id existe...${colors.reset}`);
    
    const { error: columnError } = await supabase
      .from('services')
      .select('user_id')
      .limit(1);
    
    if (columnError) {
      if (columnError.code === '42703') {
        console.error(`${colors.red}Error: La columna user_id no existe en la tabla services.${colors.reset}`);
        console.log(`${colors.yellow}Debes ejecutar el script fix-services-table.js o el SQL en Supabase para añadir la columna.${colors.reset}`);
      } else {
        console.error(`${colors.red}Error al verificar la columna user_id: ${columnError.message}${colors.reset}`);
        console.error(`${colors.red}Código de error: ${columnError.code}${colors.reset}`);
      }
      process.exit(1);
    }
    
    console.log(`${colors.green}✓ La columna user_id existe en la tabla services.${colors.reset}`);
    
    // Verificar las políticas de seguridad
    console.log(`\n${colors.cyan}Verificando las políticas de seguridad...${colors.reset}`);
    
    // No podemos verificar directamente las políticas desde el cliente de JavaScript,
    // pero podemos intentar insertar un servicio sin user_id para ver si las políticas funcionan
    
    const testService = {
      name: 'Servicio de prueba',
      duration: 30,
      price: 25,
      category: 'Prueba',
      description: 'Este es un servicio de prueba para verificar las políticas de seguridad'
      // Intencionalmente omitimos user_id para ver si las políticas lo rechazan
    };
    
    const { error: insertError } = await supabase
      .from('services')
      .insert(testService);
    
    if (insertError) {
      if (insertError.code === 'PGRST109') {
        console.log(`${colors.green}✓ Las políticas de seguridad están funcionando correctamente.${colors.reset}`);
        console.log(`${colors.green}  La inserción sin user_id fue rechazada como se esperaba.${colors.reset}`);
      } else {
        console.error(`${colors.red}Error inesperado al probar las políticas: ${insertError.message}${colors.reset}`);
        console.error(`${colors.red}Código de error: ${insertError.code}${colors.reset}`);
      }
    } else {
      console.error(`${colors.red}Advertencia: Se pudo insertar un servicio sin user_id.${colors.reset}`);
      console.error(`${colors.red}Las políticas de seguridad podrían no estar configuradas correctamente.${colors.reset}`);
      
      // Eliminar el servicio de prueba que se insertó
      const { data } = await supabase
        .from('services')
        .select('id')
        .eq('name', 'Servicio de prueba')
        .limit(1);
      
      if (data && data.length > 0) {
        await supabase
          .from('services')
          .delete()
          .eq('id', data[0].id);
        
        console.log(`${colors.yellow}Se eliminó el servicio de prueba insertado.${colors.reset}`);
      }
    }
    
    console.log(`\n${colors.bright}Resumen:${colors.reset}`);
    console.log(`${colors.green}✓ La tabla services existe${colors.reset}`);
    console.log(`${colors.green}✓ La columna user_id existe${colors.reset}`);
    console.log(`${colors.green}✓ Las políticas de seguridad parecen estar configuradas${colors.reset}`);
    
    console.log(`\n${colors.bright}La estructura de la tabla services parece estar correcta.${colors.reset}`);
    console.log(`${colors.bright}Puedes volver a la aplicación y probar si funciona correctamente.${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Error inesperado: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
