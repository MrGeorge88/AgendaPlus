/**
 * Script para probar la conexión con Supabase
 * 
 * Ejecutar con: node test-supabase.js
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
  console.error('Asegúrate de que el archivo frontend/.env existe y contiene VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función principal
async function main() {
  console.log('Probando conexión con Supabase...');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}`);
  
  try {
    // Probar autenticación anónima
    console.log('\nProbando autenticación anónima...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Error de autenticación:', authError.message);
    } else {
      console.log('Autenticación anónima exitosa.');
    }
    
    // Probar acceso a la tabla de clientes
    console.log('\nProbando acceso a la tabla de clientes...');
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('count')
      .limit(1);
    
    if (clientsError) {
      console.error('Error al acceder a la tabla de clientes:', clientsError.message);
      
      if (clientsError.code === '42P01') {
        console.log('\nLa tabla "clients" no existe. Debes crear el esquema de la base de datos.');
        console.log('Ejecuta el script SQL en el panel de SQL de Supabase:');
        console.log('1. Ve a https://app.supabase.io');
        console.log('2. Selecciona tu proyecto');
        console.log('3. Ve a "SQL Editor"');
        console.log('4. Copia y pega el contenido de supabase-schema.sql');
        console.log('5. Ejecuta el script');
      }
    } else {
      console.log('Acceso a la tabla de clientes exitoso.');
      
      // Probar inserción en la tabla de clientes
      console.log('\nProbando inserción en la tabla de clientes...');
      const testClient = {
        name: 'Cliente de Prueba',
        email: 'test@example.com',
        phone: '123-456-7890',
        notes: 'Cliente creado para probar la conexión con Supabase'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('clients')
        .insert(testClient)
        .select();
      
      if (insertError) {
        console.error('Error al insertar en la tabla de clientes:', insertError.message);
      } else {
        console.log('Inserción en la tabla de clientes exitosa.');
        console.log('Cliente insertado:', insertData[0]);
        
        // Eliminar el cliente de prueba
        const { error: deleteError } = await supabase
          .from('clients')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.error('Error al eliminar el cliente de prueba:', deleteError.message);
        } else {
          console.log('Cliente de prueba eliminado correctamente.');
        }
      }
    }
    
    console.log('\n¡Prueba completada!');
  } catch (error) {
    console.error('Error inesperado:', error.message);
  }
}

main();
