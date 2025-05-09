/**
 * Script para desplegar el frontend de AgendaPlus en Vercel
 * 
 * Este script ayuda a desplegar el frontend en Vercel y configurar
 * la integración con GitHub para despliegues automáticos.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

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

console.log(`${colors.bright}${colors.cyan}=== AgendaPlus - Despliegue del Frontend en Vercel ===${colors.reset}\n`);

// Función para preguntar
function pregunta(texto) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${texto}${colors.reset} `, (respuesta) => {
      resolve(respuesta);
    });
  });
}

// Función para verificar si Vercel CLI está instalado
function verificarVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Función principal
async function main() {
  try {
    // Verificar si Vercel CLI está instalado
    if (!verificarVercelCLI()) {
      console.log(`${colors.red}Error: Vercel CLI no está instalado.${colors.reset}`);
      console.log(`Instala Vercel CLI con: ${colors.cyan}npm install -g vercel${colors.reset}`);
      return;
    }

    // Verificar si el usuario está logueado en Vercel
    try {
      execSync('vercel whoami', { stdio: 'ignore' });
    } catch (error) {
      console.log(`${colors.yellow}No has iniciado sesión en Vercel. Iniciando sesión...${colors.reset}`);
      try {
        execSync('vercel login', { stdio: 'inherit' });
      } catch (error) {
        console.log(`${colors.red}Error al iniciar sesión en Vercel: ${error.message}${colors.reset}`);
        return;
      }
    }

    // Leer las variables de entorno de Supabase
    console.log(`${colors.bright}Leyendo variables de entorno de Supabase...${colors.reset}`);

    const envPath = path.join(__dirname, 'frontend', '.env');
    if (!fs.existsSync(envPath)) {
      console.log(`${colors.red}Error: No se encontró el archivo .env en frontend/.${colors.reset}`);
      console.log(`Ejecuta primero: ${colors.cyan}node deploy.js${colors.reset}`);
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');

    let supabaseUrl = '';
    let supabaseKey = '';

    for (const line of envLines) {
      if (line.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = line.replace('VITE_SUPABASE_URL=', '');
      } else if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.replace('VITE_SUPABASE_ANON_KEY=', '');
      }
    }

    if (!supabaseUrl || !supabaseKey) {
      console.log(`${colors.red}Error: No se encontraron las variables de entorno de Supabase en frontend/.env.${colors.reset}`);
      console.log(`Ejecuta primero: ${colors.cyan}node deploy.js${colors.reset}`);
      return;
    }

    console.log(`${colors.green}Variables de entorno de Supabase encontradas.${colors.reset}`);

    // Desplegar frontend
    console.log(`\n${colors.bright}Desplegando frontend en Vercel...${colors.reset}`);

    // Crear archivo .env.local con las variables de entorno
    const localEnvPath = path.join(__dirname, 'frontend', '.env.local');
    fs.writeFileSync(localEnvPath,
      `VITE_SUPABASE_URL=${supabaseUrl}\n` +
      `VITE_SUPABASE_ANON_KEY=${supabaseKey}\n` +
      `VITE_API_URL=https://agenda-plus-backend.vercel.app\n`
    );

    console.log(`${colors.green}Archivo .env.local creado con las variables de entorno.${colors.reset}`);

    // Preguntar si desplegar con integración de GitHub
    const useGithub = await pregunta('¿Deseas configurar la integración con GitHub para despliegues automáticos? (s/n): ');

    try {
      console.log(`${colors.yellow}Cambiando al directorio frontend...${colors.reset}`);
      process.chdir(path.join(__dirname, 'frontend'));

      if (useGithub.toLowerCase() === 's') {
        // Desplegar con integración de GitHub
        console.log(`${colors.yellow}Desplegando con integración de GitHub...${colors.reset}`);
        execSync('vercel --prod --github', { stdio: 'inherit' });
      } else {
        // Desplegar sin integración de GitHub
        console.log(`${colors.yellow}Desplegando sin integración de GitHub...${colors.reset}`);
        execSync('vercel --prod', { stdio: 'inherit' });
      }

      console.log(`${colors.green}Frontend desplegado correctamente.${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}Error al desplegar el frontend: ${error.message}${colors.reset}`);
    }

    console.log(`\n${colors.bright}${colors.green}¡Despliegue completado!${colors.reset}`);
    console.log(`\nSi configuraste la integración con GitHub, los futuros cambios se desplegarán automáticamente.`);
    console.log(`Si no, puedes ejecutar este script nuevamente para desplegar manualmente.`);

  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  } finally {
    rl.close();
  }
}

main();
