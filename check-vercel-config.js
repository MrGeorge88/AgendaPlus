/**
 * Script para verificar la configuración de Vercel
 * 
 * Este script ayuda a verificar la configuración de Vercel y obtener los IDs necesarios
 * para configurar los secretos de GitHub Actions.
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

console.log(`${colors.bright}${colors.cyan}=== AgendaPlus - Verificador de Configuración de Vercel ===${colors.reset}\n`);

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

    // Obtener información de la cuenta de Vercel
    console.log(`${colors.bright}Obteniendo información de tu cuenta de Vercel...${colors.reset}`);
    
    // Obtener el token de Vercel
    console.log(`\n${colors.bright}Para obtener un token de Vercel:${colors.reset}`);
    console.log(`1. Ve a https://vercel.com/account/tokens`);
    console.log(`2. Crea un nuevo token con el nombre "AgendaPlus GitHub Actions"`);
    console.log(`3. Copia el token generado`);
    
    const vercelToken = await pregunta('Ingresa tu token de Vercel: ');
    
    if (!vercelToken) {
      console.log(`${colors.red}Error: No se proporcionó un token de Vercel.${colors.reset}`);
      return;
    }
    
    // Obtener el ID de la organización
    console.log(`\n${colors.bright}Obteniendo ID de la organización...${colors.reset}`);
    
    try {
      const orgOutput = execSync('vercel teams ls --json', { encoding: 'utf8' });
      const orgs = JSON.parse(orgOutput);
      
      if (orgs.length === 0) {
        // Si no hay equipos, usar la cuenta personal
        const userOutput = execSync('vercel whoami --json', { encoding: 'utf8' });
        const user = JSON.parse(userOutput);
        
        console.log(`${colors.green}ID de la organización (cuenta personal): ${user.id}${colors.reset}`);
        console.log(`\n${colors.bright}Configura este valor como VERCEL_ORG_ID en los secretos de GitHub Actions.${colors.reset}`);
      } else {
        // Mostrar los equipos disponibles
        console.log(`${colors.bright}Equipos disponibles:${colors.reset}`);
        orgs.forEach((org, index) => {
          console.log(`${index + 1}. ${org.name} (${org.id})`);
        });
        
        const orgIndex = await pregunta('Selecciona el número del equipo que deseas usar: ');
        const selectedOrg = orgs[parseInt(orgIndex) - 1];
        
        if (!selectedOrg) {
          console.log(`${colors.red}Error: Selección inválida.${colors.reset}`);
          return;
        }
        
        console.log(`${colors.green}ID de la organización: ${selectedOrg.id}${colors.reset}`);
        console.log(`\n${colors.bright}Configura este valor como VERCEL_ORG_ID en los secretos de GitHub Actions.${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}Error al obtener información de la organización: ${error.message}${colors.reset}`);
      return;
    }
    
    // Obtener IDs de los proyectos
    console.log(`\n${colors.bright}Obteniendo IDs de los proyectos...${colors.reset}`);
    
    try {
      const projectsOutput = execSync('vercel project ls --json', { encoding: 'utf8' });
      const projects = JSON.parse(projectsOutput);
      
      if (projects.length === 0) {
        console.log(`${colors.red}No se encontraron proyectos en tu cuenta de Vercel.${colors.reset}`);
        return;
      }
      
      // Mostrar los proyectos disponibles
      console.log(`${colors.bright}Proyectos disponibles:${colors.reset}`);
      projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.name} (${project.id})`);
      });
      
      // Seleccionar proyecto frontend
      const frontendIndex = await pregunta('Selecciona el número del proyecto FRONTEND: ');
      const selectedFrontend = projects[parseInt(frontendIndex) - 1];
      
      if (!selectedFrontend) {
        console.log(`${colors.red}Error: Selección inválida.${colors.reset}`);
        return;
      }
      
      console.log(`${colors.green}ID del proyecto frontend: ${selectedFrontend.id}${colors.reset}`);
      console.log(`\n${colors.bright}Configura este valor como VERCEL_PROJECT_ID_FRONTEND en los secretos de GitHub Actions.${colors.reset}`);
      
      // Seleccionar proyecto backend
      const backendIndex = await pregunta('Selecciona el número del proyecto BACKEND: ');
      const selectedBackend = projects[parseInt(backendIndex) - 1];
      
      if (!selectedBackend) {
        console.log(`${colors.red}Error: Selección inválida.${colors.reset}`);
        return;
      }
      
      console.log(`${colors.green}ID del proyecto backend: ${selectedBackend.id}${colors.reset}`);
      console.log(`\n${colors.bright}Configura este valor como VERCEL_PROJECT_ID_BACKEND en los secretos de GitHub Actions.${colors.reset}`);
      
      // Resumen de la configuración
      console.log(`\n${colors.bright}${colors.cyan}=== Resumen de la configuración ===${colors.reset}`);
      console.log(`\n${colors.bright}Configura los siguientes secretos en GitHub Actions:${colors.reset}`);
      console.log(`VERCEL_TOKEN: ${vercelToken}`);
      console.log(`VERCEL_ORG_ID: (el valor mostrado anteriormente)`);
      console.log(`VERCEL_PROJECT_ID_FRONTEND: ${selectedFrontend.id}`);
      console.log(`VERCEL_PROJECT_ID_BACKEND: ${selectedBackend.id}`);
      
      console.log(`\n${colors.bright}Para configurar estos secretos:${colors.reset}`);
      console.log(`1. Ve a https://github.com/MrGeorge88/AgendaPlus/settings/secrets/actions`);
      console.log(`2. Haz clic en "New repository secret"`);
      console.log(`3. Añade cada uno de los secretos con sus respectivos valores`);
      
    } catch (error) {
      console.log(`${colors.red}Error al obtener información de los proyectos: ${error.message}${colors.reset}`);
      return;
    }
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  } finally {
    rl.close();
  }
}

main();
