/**
 * Script para verificar el estado de la tabla services en Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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
  console.error('Error: No se encontraron las credenciales de Supabase.');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Verificando la tabla services en Supabase...');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}`);

  try {
    // 1. Verificar si la tabla services existe
    console.log('\nVerificando si la tabla services existe...');
    
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('schemaname', 'public')
      .eq('tablename', 'services');
    
    if (tablesError) {
      console.error('Error al verificar tablas:', tablesError);
      
      // Intentar otra forma de verificar
      const { error: testError } = await supabase
        .from('services')
        .select('count(*)', { count: 'exact', head: true });
      
      if (testError) {
        console.error('Error al acceder a la tabla services:', testError);
        console.log('La tabla services parece no existir o no es accesible.');
      } else {
        console.log('La tabla services existe y es accesible.');
      }
    } else {
      if (tablesData && tablesData.length > 0) {
        console.log('La tabla services existe en el esquema public.');
      } else {
        console.log('La tabla services NO existe en el esquema public.');
      }
    }
    
    // 2. Verificar la estructura de la tabla services
    console.log('\nVerificando la estructura de la tabla services...');
    
    const { data: columnsData, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', 'services');
    
    if (columnsError) {
      console.error('Error al verificar columnas:', columnsError);
    } else {
      if (columnsData && columnsData.length > 0) {
        console.log('Columnas de la tabla services:');
        columnsData.forEach(column => {
          console.log(`- ${column.column_name} (${column.data_type})`);
        });
        
        // Verificar específicamente la columna user_id
        const userIdColumn = columnsData.find(col => col.column_name === 'user_id');
        if (userIdColumn) {
          console.log('\nLa columna user_id existe en la tabla services.');
        } else {
          console.log('\nLa columna user_id NO existe en la tabla services.');
        }
      } else {
        console.log('No se encontraron columnas para la tabla services.');
      }
    }
    
    // 3. Intentar insertar un registro de prueba
    console.log('\nIntentando insertar un registro de prueba...');
    
    const testService = {
      name: 'Servicio de prueba',
      duration: 30,
      price: 25.00,
      category: 'Prueba',
      description: 'Este es un servicio de prueba',
      user_id: '00000000-0000-0000-0000-000000000000' // ID ficticio
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('services')
      .insert(testService)
      .select();
    
    if (insertError) {
      console.error('Error al insertar servicio de prueba:', insertError);
      console.log('Detalles del error:');
      console.log(`- Código: ${insertError.code}`);
      console.log(`- Mensaje: ${insertError.message}`);
      console.log(`- Detalles: ${insertError.details}`);
      
      if (insertError.message.includes('user_id')) {
        console.log('\nEl error parece estar relacionado con la columna user_id.');
      }
    } else {
      console.log('Servicio de prueba insertado correctamente:');
      console.log(insertData);
      
      // Eliminar el servicio de prueba
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('services')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.error('Error al eliminar servicio de prueba:', deleteError);
        } else {
          console.log('Servicio de prueba eliminado correctamente.');
        }
      }
    }
    
    // 4. Verificar las políticas de seguridad (RLS)
    console.log('\nVerificando las políticas de seguridad...');
    
    // No podemos consultar directamente las políticas desde el cliente JS,
    // pero podemos intentar hacer operaciones que deberían estar protegidas
    
    console.log('Nota: No se pueden verificar directamente las políticas desde este script.');
    console.log('Recomendación: Verifica las políticas en el panel de Supabase.');
    
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

main();
