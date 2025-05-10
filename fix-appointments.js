const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
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

// Función para preguntar al usuario
function pregunta(pregunta) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(pregunta, respuesta => {
      rl.close();
      resolve(respuesta);
    });
  });
}

// Función principal
async function main() {
  try {
    console.log(`${colors.bright}Corrección de la tabla appointments en Supabase${colors.reset}\n`);
    
    // Obtener credenciales de Supabase
    let supabaseUrl = process.env.VITE_SUPABASE_URL;
    let supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
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
    
    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'fix-appointments-table.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error(`${colors.red}Error: No se encontró el archivo SQL en ${sqlPath}${colors.reset}`);
      return;
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log(`${colors.green}Archivo SQL cargado correctamente.${colors.reset}`);
    
    // Ejecutar el SQL
    console.log(`${colors.yellow}Ejecutando SQL en Supabase...${colors.reset}`);
    
    const { error } = await supabase.rpc('pgmoon.query', { query_text: sqlContent });
    
    if (error) {
      console.error(`${colors.red}Error al ejecutar el SQL:${colors.reset}`, error);
      
      // Intentar con otro método si el primero falla
      console.log(`${colors.yellow}Intentando método alternativo...${colors.reset}`);
      
      try {
        // Dividir el script en sentencias individuales
        const statements = sqlContent.split(';').filter(stmt => stmt.trim());
        
        for (const stmt of statements) {
          if (stmt.trim()) {
            const { error } = await supabase.rpc('pgmoon.query', { query_text: stmt + ';' });
            if (error) {
              console.error(`${colors.red}Error en sentencia:${colors.reset}`, error);
              console.error(`Sentencia: ${stmt}`);
            }
          }
        }
      } catch (alternativeError) {
        console.error(`${colors.red}Error con método alternativo:${colors.reset}`, alternativeError);
      }
    } else {
      console.log(`${colors.green}SQL ejecutado correctamente.${colors.reset}`);
    }
    
    console.log(`\n${colors.bright}Proceso completado.${colors.reset}`);
    console.log(`${colors.cyan}Ahora deberías poder crear citas correctamente.${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Error inesperado:${colors.reset}`, error);
  }
}

// Ejecutar la función principal
main();
