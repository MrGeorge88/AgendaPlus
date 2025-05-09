/**
 * Script para verificar el estado del despliegue de AgendaPlus
 * 
 * Este script verifica que todos los componentes necesarios estén configurados
 * correctamente para el despliegue.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}=== AgendaPlus - Verificación de Despliegue ===${colors.reset}\n`);

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Función para verificar si un comando está instalado
function commandExists(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Función para verificar la conexión con Supabase
async function checkSupabaseConnection() {
  // Cargar variables de entorno
  const envPath = path.join(__dirname, 'frontend', '.env');
  if (fileExists(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }

  // Obtener credenciales de Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      success: false,
      message: 'No se encontraron las credenciales de Supabase. Ejecuta node deploy.js primero.'
    };
  }

  try {
    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Probar autenticación anónima
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      return {
        success: false,
        message: `Error de autenticación: ${authError.message}`
      };
    }
    
    // Probar acceso a la tabla de clientes
    const { error: clientsError } = await supabase
      .from('clients')
      .select('count')
      .limit(1);
    
    if (clientsError) {
      if (clientsError.code === '42P01') {
        return {
          success: false,
          message: 'La tabla "clients" no existe. Debes crear el esquema de la base de datos.'
        };
      }
      
      return {
        success: false,
        message: `Error al acceder a la tabla de clientes: ${clientsError.message}`
      };
    }
    
    return {
      success: true,
      message: 'Conexión con Supabase exitosa.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error inesperado: ${error.message}`
    };
  }
}

// Función principal
async function main() {
  console.log(`${colors.bright}Verificando requisitos de despliegue...${colors.reset}\n`);
  
  // Verificar Node.js
  console.log(`${colors.yellow}Verificando Node.js...${colors.reset}`);
  if (commandExists('node')) {
    const nodeVersion = execSync('node --version').toString().trim();
    console.log(`${colors.green}✓ Node.js ${nodeVersion} instalado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Node.js no está instalado.${colors.reset}`);
  }
  
  // Verificar npm
  console.log(`\n${colors.yellow}Verificando npm...${colors.reset}`);
  if (commandExists('npm')) {
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`${colors.green}✓ npm ${npmVersion} instalado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ npm no está instalado.${colors.reset}`);
  }
  
  // Verificar Vercel CLI
  console.log(`\n${colors.yellow}Verificando Vercel CLI...${colors.reset}`);
  if (commandExists('vercel')) {
    const vercelVersion = execSync('vercel --version').toString().trim();
    console.log(`${colors.green}✓ Vercel CLI ${vercelVersion} instalado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Vercel CLI no está instalado. Instálalo con: npm install -g vercel${colors.reset}`);
  }
  
  // Verificar archivos de configuración
  console.log(`\n${colors.yellow}Verificando archivos de configuración...${colors.reset}`);
  
  // Verificar .env
  const envPath = path.join(__dirname, 'frontend', '.env');
  if (fileExists(envPath)) {
    console.log(`${colors.green}✓ Archivo frontend/.env encontrado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Archivo frontend/.env no encontrado. Ejecuta node deploy.js primero.${colors.reset}`);
  }
  
  // Verificar vercel.json
  const vercelJsonPath = path.join(__dirname, 'frontend', 'vercel.json');
  if (fileExists(vercelJsonPath)) {
    console.log(`${colors.green}✓ Archivo frontend/vercel.json encontrado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Archivo frontend/vercel.json no encontrado.${colors.reset}`);
  }
  
  // Verificar scripts SQL
  const schemaPath = path.join(__dirname, 'supabase-schema.sql');
  if (fileExists(schemaPath)) {
    console.log(`${colors.green}✓ Archivo supabase-schema.sql encontrado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Archivo supabase-schema.sql no encontrado.${colors.reset}`);
  }
  
  const seedPath = path.join(__dirname, 'supabase-seed.sql');
  if (fileExists(seedPath)) {
    console.log(`${colors.green}✓ Archivo supabase-seed.sql encontrado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Archivo supabase-seed.sql no encontrado.${colors.reset}`);
  }
  
  const securityPath = path.join(__dirname, 'supabase-security.sql');
  if (fileExists(securityPath)) {
    console.log(`${colors.green}✓ Archivo supabase-security.sql encontrado.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Archivo supabase-security.sql no encontrado.${colors.reset}`);
  }
  
  // Verificar conexión con Supabase
  console.log(`\n${colors.yellow}Verificando conexión con Supabase...${colors.reset}`);
  const supabaseResult = await checkSupabaseConnection();
  
  if (supabaseResult.success) {
    console.log(`${colors.green}✓ ${supabaseResult.message}${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ ${supabaseResult.message}${colors.reset}`);
  }
  
  console.log(`\n${colors.bright}Resumen de la verificación:${colors.reset}`);
  console.log(`1. Asegúrate de que todos los requisitos estén instalados y configurados.`);
  console.log(`2. Ejecuta node deploy.js para configurar las credenciales de Supabase.`);
  console.log(`3. Ejecuta los scripts SQL en el panel de Supabase para crear el esquema y las políticas de seguridad.`);
  console.log(`4. Configura las plantillas de email en Supabase.`);
  console.log(`5. Ejecuta node deploy-vercel.js para desplegar la aplicación en Vercel.`);
}

main();
