#!/usr/bin/env node

/**
 * Script de auditoría de traducciones para AgendaPlus
 * 
 * Este script busca:
 * 1. Textos hardcodeados en español en archivos .tsx/.ts
 * 2. Claves de traducción faltantes
 * 3. Claves no utilizadas
 * 4. Inconsistencias entre idiomas
 */

const fs = require('fs');
const path = require('path');

// Configuración
const FRONTEND_DIR = path.join(__dirname, '../frontend/src');
const LOCALES_DIR = path.join(FRONTEND_DIR, 'locales');
const EXTENSIONS = ['.tsx', '.ts'];

// Patrones de texto hardcodeado en español
const SPANISH_PATTERNS = [
  // Palabras comunes en español
  /["'`](?:.*(?:ñ|á|é|í|ó|ú|Ñ|Á|É|Í|Ó|Ú).*?)["'`]/g,
  // Palabras específicas del dominio
  /["'`](?:.*(?:Guardar|Cancelar|Eliminar|Editar|Agregar|Crear|Actualizar|Confirmar|Aceptar|Rechazar).*?)["'`]/g,
  /["'`](?:.*(?:Cliente|Servicio|Cita|Personal|Profesional|Precio|Duración|Fecha|Hora).*?)["'`]/g,
  /["'`](?:.*(?:Selecciona|Seleccionar|Buscar|Filtrar|Ordenar).*?)["'`]/g,
  /["'`](?:.*(?:Error|Éxito|Cargando|Guardando|Procesando).*?)["'`]/g,
  /["'`](?:.*(?:Próximamente|Disponible|Ocupado|Confirmada|Pendiente|Cancelada).*?)["'`]/g,
];

// Excepciones - textos que no necesitan traducción
const EXCEPTIONS = [
  'console.log',
  'console.error',
  'console.warn',
  'className',
  'data-',
  'aria-',
  'id=',
  'name=',
  'value=',
  'placeholder=""',
  'alt=""',
  'title=""',
  // URLs y rutas
  '/api/',
  'http',
  'https',
  // Nombres de archivos y extensiones
  '.tsx',
  '.ts',
  '.js',
  '.css',
  '.json',
  // Valores técnicos
  'px',
  'rem',
  'em',
  '%',
  'rgb',
  'rgba',
  'hex',
  // Claves de objetos
  'key=',
  'ref=',
];

class TranslationAuditor {
  constructor() {
    this.results = {
      hardcodedTexts: [],
      missingKeys: [],
      unusedKeys: [],
      inconsistencies: [],
      summary: {}
    };
    
    this.translations = {};
    this.usedKeys = new Set();
  }

  // Cargar traducciones
  loadTranslations() {
    try {
      const esPath = path.join(LOCALES_DIR, 'es.json');
      const enPath = path.join(LOCALES_DIR, 'en.json');
      
      this.translations.es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
      this.translations.en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      
      console.log('✅ Traducciones cargadas correctamente');
    } catch (error) {
      console.error('❌ Error cargando traducciones:', error.message);
      process.exit(1);
    }
  }

  // Obtener todas las claves de traducción de forma plana
  getFlatKeys(obj, prefix = '') {
    const keys = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        keys.push(...this.getFlatKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  // Buscar archivos recursivamente
  findFiles(dir, extensions) {
    const files = [];
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...this.findFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Verificar si un texto es una excepción
  isException(text) {
    return EXCEPTIONS.some(exception => text.includes(exception));
  }

  // Buscar textos hardcodeados
  findHardcodedTexts() {
    console.log('🔍 Buscando textos hardcodeados...');
    
    const files = this.findFiles(FRONTEND_DIR, EXTENSIONS);
    
    for (const file of files) {
      // Saltar archivos de traducciones
      if (file.includes('/locales/')) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(FRONTEND_DIR, file);
      
      // Buscar claves de traducción utilizadas
      const tMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);
      if (tMatches) {
        tMatches.forEach(match => {
          const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
          this.usedKeys.add(key);
        });
      }
      
      // Buscar textos hardcodeados
      for (const pattern of SPANISH_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const cleanMatch = match.replace(/["'`]/g, '');
            
            // Filtrar excepciones
            if (!this.isException(match) && cleanMatch.length > 2) {
              const lines = content.substring(0, content.indexOf(match)).split('\n');
              const lineNumber = lines.length;
              
              this.results.hardcodedTexts.push({
                file: relativePath,
                line: lineNumber,
                text: cleanMatch,
                context: lines[lines.length - 1].trim()
              });
            }
          });
        }
      }
    }
  }

  // Verificar claves faltantes y no utilizadas
  checkKeys() {
    console.log('🔍 Verificando claves de traducción...');
    
    const esKeys = new Set(this.getFlatKeys(this.translations.es));
    const enKeys = new Set(this.getFlatKeys(this.translations.en));
    
    // Claves faltantes en inglés
    for (const key of esKeys) {
      if (!enKeys.has(key)) {
        this.results.missingKeys.push({
          key,
          language: 'en',
          message: `Clave "${key}" existe en ES pero no en EN`
        });
      }
    }
    
    // Claves faltantes en español
    for (const key of enKeys) {
      if (!esKeys.has(key)) {
        this.results.missingKeys.push({
          key,
          language: 'es',
          message: `Clave "${key}" existe en EN pero no en ES`
        });
      }
    }
    
    // Claves no utilizadas
    const allKeys = new Set([...esKeys, ...enKeys]);
    for (const key of allKeys) {
      if (!this.usedKeys.has(key)) {
        this.results.unusedKeys.push({
          key,
          message: `Clave "${key}" definida pero no utilizada`
        });
      }
    }
  }

  // Generar resumen
  generateSummary() {
    this.results.summary = {
      totalFiles: this.findFiles(FRONTEND_DIR, EXTENSIONS).length,
      hardcodedTexts: this.results.hardcodedTexts.length,
      missingKeys: this.results.missingKeys.length,
      unusedKeys: this.results.unusedKeys.length,
      usedKeys: this.usedKeys.size,
      totalKeys: this.getFlatKeys(this.translations.es).length
    };
  }

  // Ejecutar auditoría completa
  async audit() {
    console.log('🚀 Iniciando auditoría de traducciones...\n');
    
    this.loadTranslations();
    this.findHardcodedTexts();
    this.checkKeys();
    this.generateSummary();
    
    this.printResults();
  }

  // Imprimir resultados
  printResults() {
    console.log('\n📊 RESUMEN DE AUDITORÍA');
    console.log('========================');
    console.log(`📁 Archivos analizados: ${this.results.summary.totalFiles}`);
    console.log(`🔑 Claves de traducción: ${this.results.summary.totalKeys}`);
    console.log(`✅ Claves utilizadas: ${this.results.summary.usedKeys}`);
    console.log(`❌ Textos hardcodeados: ${this.results.summary.hardcodedTexts}`);
    console.log(`⚠️  Claves faltantes: ${this.results.summary.missingKeys}`);
    console.log(`🗑️  Claves no utilizadas: ${this.results.summary.unusedKeys}`);
    
    // Textos hardcodeados
    if (this.results.hardcodedTexts.length > 0) {
      console.log('\n❌ TEXTOS HARDCODEADOS ENCONTRADOS:');
      console.log('=====================================');
      this.results.hardcodedTexts.forEach(item => {
        console.log(`📄 ${item.file}:${item.line}`);
        console.log(`   Texto: "${item.text}"`);
        console.log(`   Contexto: ${item.context}`);
        console.log('');
      });
    }
    
    // Claves faltantes
    if (this.results.missingKeys.length > 0) {
      console.log('\n⚠️  CLAVES FALTANTES:');
      console.log('====================');
      this.results.missingKeys.forEach(item => {
        console.log(`🔑 ${item.key} (${item.language}): ${item.message}`);
      });
    }
    
    // Claves no utilizadas
    if (this.results.unusedKeys.length > 0) {
      console.log('\n🗑️  CLAVES NO UTILIZADAS:');
      console.log('========================');
      this.results.unusedKeys.forEach(item => {
        console.log(`🔑 ${item.key}: ${item.message}`);
      });
    }
    
    // Conclusión
    console.log('\n🎯 CONCLUSIÓN:');
    console.log('===============');
    if (this.results.hardcodedTexts.length === 0 && this.results.missingKeys.length === 0) {
      console.log('✅ ¡Excelente! No se encontraron problemas de traducción.');
    } else {
      console.log('⚠️  Se encontraron problemas que requieren atención.');
      console.log(`   - ${this.results.hardcodedTexts.length} textos hardcodeados`);
      console.log(`   - ${this.results.missingKeys.length} claves faltantes`);
    }
  }
}

// Ejecutar auditoría
if (require.main === module) {
  const auditor = new TranslationAuditor();
  auditor.audit().catch(console.error);
}

module.exports = TranslationAuditor;
