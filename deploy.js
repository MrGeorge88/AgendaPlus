/**
 * Script para ayudar con el despliegue a Vercel y la configuración de Supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}=== AgendaPlus - Asistente de Despliegue ===${colors.reset}\n`);

// Función para preguntar
function pregunta(texto) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${texto}${colors.reset} `, (respuesta) => {
      resolve(respuesta);
    });
  });
}

// Función principal
async function main() {
  try {
    console.log(`${colors.bright}Configuración de Supabase${colors.reset}`);
    
    const supabaseUrl = await pregunta('URL de Supabase (ej: https://abcdefghijklm.supabase.co): ');
    const supabaseAnonKey = await pregunta('Clave anónima de Supabase: ');
    const supabaseServiceKey = await pregunta('Clave de servicio de Supabase: ');
    
    // Actualizar archivos .env
    console.log(`\n${colors.green}Actualizando archivos de configuración...${colors.reset}`);
    
    // Frontend .env
    fs.writeFileSync('./frontend/.env', 
      `VITE_SUPABASE_URL=${supabaseUrl}\n` +
      `VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}\n` +
      `VITE_API_URL=http://localhost:3001\n`
    );
    
    // Backend .env
    fs.writeFileSync('./backend/.env', 
      `PORT=3001\n` +
      `SUPABASE_URL=${supabaseUrl}\n` +
      `SUPABASE_KEY=${supabaseServiceKey}\n` +
      `NODE_ENV=development\n`
    );
    
    console.log(`${colors.green}Archivos .env actualizados correctamente.${colors.reset}\n`);
    
    // Preguntar si quiere inicializar Git
    const initGit = await pregunta('¿Deseas inicializar el repositorio Git? (s/n): ');
    
    if (initGit.toLowerCase() === 's') {
      console.log(`\n${colors.green}Inicializando repositorio Git...${colors.reset}`);
      try {
        execSync('git init', { stdio: 'inherit' });
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Configuración inicial"', { stdio: 'inherit' });
        
        const repoUrl = await pregunta('URL del repositorio GitHub (dejar en blanco para omitir): ');
        
        if (repoUrl) {
          execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
          console.log(`${colors.green}Repositorio configurado. Usa 'git push -u origin main' para subir los cambios.${colors.reset}`);
        }
      } catch (error) {
        console.log(`${colors.red}Error al inicializar Git: ${error.message}${colors.reset}`);
      }
    }
    
    console.log(`\n${colors.bright}${colors.green}¡Configuración completada!${colors.reset}`);
    console.log(`\nPara iniciar el desarrollo:`);
    console.log(`${colors.cyan}npm run dev${colors.reset}`);
    
    console.log(`\nPara desplegar en Vercel:`);
    console.log(`1. Crea proyectos en Vercel para frontend y backend`);
    console.log(`2. Configura las variables de entorno en Vercel`);
    console.log(`3. Conecta tu repositorio GitHub a Vercel`);
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  } finally {
    rl.close();
  }
}

main();
