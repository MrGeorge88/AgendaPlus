/**
 * Script para verificar la configuración de Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
const envPath = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(envPath)) {
  console.log(`Cargando variables de entorno desde ${envPath}`);
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Contenido del archivo .env:');
  console.log(envContent);
  
  const envConfig = dotenv.parse(envContent);
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

// Obtener credenciales de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Verificando configuración de Supabase:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey ? `${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}` : 'No disponible'}`);

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: No se encontraron las credenciales de Supabase.');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log('\nVerificando conexión a Supabase...');
    
    // Probar autenticación anónima
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Error de autenticación:', authError);
    } else {
      console.log('Autenticación anónima exitosa.');
    }
    
    // Probar acceso a la tabla clients (que sabemos que existe)
    console.log('\nVerificando acceso a la tabla clients...');
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('count(*)', { count: 'exact', head: true });
    
    if (clientsError) {
      console.error('Error al acceder a la tabla clients:', clientsError);
    } else {
      console.log('Acceso a la tabla clients exitoso.');
    }
    
    // Verificar si la tabla services existe
    console.log('\nVerificando si la tabla services existe...');
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('count(*)', { count: 'exact', head: true });
    
    if (servicesError) {
      console.error('Error al acceder a la tabla services:', servicesError);
      console.log('La tabla services parece no existir o no es accesible.');
      
      if (servicesError.code === '42P01') {
        console.log('\nRecomendación: Ejecuta el script create-services-table.sql en el SQL Editor de Supabase.');
      }
    } else {
      console.log('La tabla services existe y es accesible.');
      console.log(`Número de servicios: ${servicesData.count}`);
    }
    
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

main();
