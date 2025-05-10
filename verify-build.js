const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando proceso de verificación de build...');

// Verificar dependencias
console.log('Verificando dependencias...');
try {
  // Verificar si sonner está instalado
  const packageJsonPath = path.join(__dirname, 'frontend', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.dependencies.sonner) {
    console.log('Añadiendo sonner a package.json...');
    packageJson.dependencies.sonner = '^2.0.3';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  
  // Instalar dependencias
  console.log('Instalando dependencias...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  // Construir la aplicación
  console.log('Construyendo la aplicación...');
  execSync('cd frontend && npm run build', { stdio: 'inherit' });
  
  console.log('Construcción completada con éxito.');
  
  // Verificar si el directorio dist existe
  const distPath = path.join(__dirname, 'frontend', 'dist');
  if (fs.existsSync(distPath)) {
    console.log('Directorio dist creado correctamente.');
    
    // Verificar si el archivo index.html existe
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('Archivo index.html creado correctamente.');
    } else {
      console.error('Error: No se encontró el archivo index.html en el directorio dist.');
    }
  } else {
    console.error('Error: No se creó el directorio dist.');
  }
  
  console.log('Proceso de verificación completado.');
} catch (error) {
  console.error('Error durante el proceso de verificación:', error);
  process.exit(1);
}
