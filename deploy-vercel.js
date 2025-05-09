/**
 * Script para desplegar AgendaPlus en Vercel
 *
 * Este script ayuda a desplegar la aplicación en Vercel configurando
 * las variables de entorno necesarias.
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

console.log(`${colors.bright}${colors.cyan}=== AgendaPlus - Asistente de Despliegue en Vercel ===${colors.reset}\n`);

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

    // Preguntar si desplegar frontend o backend
    const deployType = await pregunta('¿Qué deseas desplegar? (frontend/backend/ambos): ');

    if (deployType.toLowerCase() === 'frontend' || deployType.toLowerCase() === 'ambos') {
      console.log(`\n${colors.bright}Desplegando frontend en Vercel...${colors.reset}`);

      // Crear archivo .vercel.env con las variables de entorno
      const vercelEnvPath = path.join(__dirname, 'frontend', '.vercel.env');
      fs.writeFileSync(vercelEnvPath,
        `VITE_SUPABASE_URL=${supabaseUrl}\n` +
        `VITE_SUPABASE_ANON_KEY=${supabaseKey}\n`
      );

      console.log(`${colors.green}Archivo .vercel.env creado con las variables de entorno.${colors.reset}`);

      // Desplegar frontend
      try {
        console.log(`${colors.yellow}Ejecutando 'vercel' en el directorio frontend...${colors.reset}`);
        process.chdir(path.join(__dirname, 'frontend'));

        // Crear un archivo .env.local que Vercel reconocerá automáticamente
        fs.renameSync(path.join(__dirname, 'frontend', '.vercel.env'),
                     path.join(__dirname, 'frontend', '.env.local'));

        // Usar --name para especificar el nombre del proyecto y evitar duplicados
        execSync('vercel --name agenda-plus-frontend', { stdio: 'inherit' });
        console.log(`${colors.green}Frontend desplegado correctamente.${colors.reset}`);
      } catch (error) {
        console.log(`${colors.red}Error al desplegar el frontend: ${error.message}${colors.reset}`);
      }
    }

    if (deployType.toLowerCase() === 'backend' || deployType.toLowerCase() === 'ambos') {
      console.log(`\n${colors.bright}Desplegando backend en Vercel...${colors.reset}`);

      // Crear archivo .vercel.env con las variables de entorno para el backend
      const vercelEnvPath = path.join(__dirname, 'backend', '.vercel.env');
      fs.writeFileSync(vercelEnvPath,
        `SUPABASE_URL=${supabaseUrl}\n` +
        `SUPABASE_KEY=${supabaseKey}\n` +
        `NODE_ENV=production\n`
      );

      console.log(`${colors.green}Archivo .vercel.env creado con las variables de entorno para el backend.${colors.reset}`);

      // Desplegar backend
      try {
        console.log(`${colors.yellow}Ejecutando 'vercel' en el directorio backend...${colors.reset}`);
        process.chdir(path.join(__dirname, 'backend'));

        // Crear un archivo .env.local que Vercel reconocerá automáticamente
        fs.renameSync(path.join(__dirname, 'backend', '.vercel.env'),
                     path.join(__dirname, 'backend', '.env.local'));

        // Usar --name para especificar el nombre del proyecto y evitar duplicados
        execSync('vercel --name agenda-plus-backend', { stdio: 'inherit' });
        console.log(`${colors.green}Backend desplegado correctamente.${colors.reset}`);
      } catch (error) {
        console.log(`${colors.red}Error al desplegar el backend: ${error.message}${colors.reset}`);
      }
    }

    console.log(`\n${colors.bright}${colors.green}¡Despliegue completado!${colors.reset}`);
    console.log(`\nRecuerda configurar las redirecciones en Vercel para que el frontend pueda comunicarse con el backend.`);
    console.log(`También asegúrate de configurar la autenticación por email en Supabase:`);
    console.log(`1. Ve a "Authentication > Email Templates" en el panel de Supabase`);
    console.log(`2. Configura las plantillas de email usando el archivo supabase-email-templates.html`);

  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  } finally {
    rl.close();
  }
}

main();
