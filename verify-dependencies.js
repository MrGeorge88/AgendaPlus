const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Verificando dependencias...');

// Leer el package.json
const packageJsonPath = path.join(__dirname, 'frontend', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Verificar si sonner está instalado
const dependencies = packageJson.dependencies || {};
const hasSonner = dependencies.sonner !== undefined;

console.log(`Sonner en package.json: ${hasSonner ? 'Sí' : 'No'}`);

// Verificar si el módulo está instalado físicamente
const nodeModulesPath = path.join(__dirname, 'frontend', 'node_modules', 'sonner');
const sonnerInstalled = fs.existsSync(nodeModulesPath);

console.log(`Sonner instalado en node_modules: ${sonnerInstalled ? 'Sí' : 'No'}`);

// Si no está instalado, instalarlo
if (!sonnerInstalled) {
  console.log('Instalando sonner...');
  try {
    execSync('cd frontend && npm install sonner', { stdio: 'inherit' });
    console.log('Sonner instalado correctamente.');
  } catch (error) {
    console.error('Error al instalar sonner:', error);
  }
}

// Verificar otras dependencias importantes
const criticalDependencies = [
  'react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'
];

criticalDependencies.forEach(dep => {
  const depPath = path.join(__dirname, 'frontend', 'node_modules', dep);
  const depInstalled = fs.existsSync(depPath);
  console.log(`${dep} instalado: ${depInstalled ? 'Sí' : 'No'}`);
  
  if (!depInstalled) {
    console.log(`Instalando ${dep}...`);
    try {
      execSync(`cd frontend && npm install ${dep}`, { stdio: 'inherit' });
      console.log(`${dep} instalado correctamente.`);
    } catch (error) {
      console.error(`Error al instalar ${dep}:`, error);
    }
  }
});

console.log('Verificación de dependencias completada.');
