# Configuración de Despliegue Automático en Vercel

Este documento explica cómo configurar correctamente el despliegue automático de AgendaPlus en Vercel.

## Requisitos Previos

1. Una cuenta en [Vercel](https://vercel.com)
2. Una cuenta en [GitHub](https://github.com)
3. Node.js instalado en tu máquina local
4. Vercel CLI instalado (`npm install -g vercel`)

## Pasos para Configurar el Despliegue Automático

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Iniciar Sesión en Vercel

```bash
vercel login
```

### 3. Obtener los IDs y Tokens Necesarios

Ejecuta el script de verificación de configuración:

```bash
node check-vercel-config.js
```

Este script te guiará para obtener:
- Token de Vercel
- ID de la Organización
- ID del Proyecto Frontend
- ID del Proyecto Backend

### 4. Configurar Secretos en GitHub

Ve a tu repositorio en GitHub:
1. Navega a `Settings > Secrets and variables > Actions`
2. Haz clic en "New repository secret"
3. Añade los siguientes secretos:

| Nombre | Valor |
|--------|-------|
| `VERCEL_TOKEN` | El token de Vercel que obtuviste |
| `VERCEL_ORG_ID` | El ID de la organización que obtuviste |
| `VERCEL_PROJECT_ID_FRONTEND` | El ID del proyecto frontend que obtuviste |
| `VERCEL_PROJECT_ID_BACKEND` | El ID del proyecto backend que obtuviste |
| `VITE_SUPABASE_URL` | La URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | La clave anónima de tu proyecto Supabase |
| `VITE_API_URL` | La URL de tu API backend (ej: https://agenda-plus-backend.vercel.app) |

### 5. Configurar Proyectos en Vercel

#### Frontend

1. Navega al directorio frontend:
   ```bash
   cd frontend
   ```

2. Despliega el proyecto con integración de GitHub:
   ```bash
   vercel --prod --github
   ```

3. Sigue las instrucciones en pantalla para vincular tu repositorio de GitHub.

4. Configura las variables de entorno en el panel de Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`

#### Backend

1. Navega al directorio backend:
   ```bash
   cd backend
   ```

2. Despliega el proyecto con integración de GitHub:
   ```bash
   vercel --prod --github
   ```

3. Sigue las instrucciones en pantalla para vincular tu repositorio de GitHub.

4. Configura las variables de entorno en el panel de Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `NODE_ENV=production`

### 6. Verificar la Configuración

1. Haz un pequeño cambio en tu código
2. Haz commit y push a la rama main
3. Verifica que el workflow de GitHub Actions se ejecute correctamente
4. Comprueba que los cambios se reflejen en tus aplicaciones desplegadas

## Solución de Problemas

### El Frontend no se Actualiza Automáticamente

1. Verifica que los secretos de GitHub estén configurados correctamente
2. Asegúrate de que la integración de GitHub esté habilitada en el proyecto de Vercel
3. Comprueba los logs del workflow de GitHub Actions para ver si hay errores
4. Intenta un despliegue manual usando el script `deploy-frontend.js`

### El Backend no se Actualiza Automáticamente

1. Verifica que los secretos de GitHub estén configurados correctamente
2. Asegúrate de que la integración de GitHub esté habilitada en el proyecto de Vercel
3. Comprueba los logs del workflow de GitHub Actions para ver si hay errores

### Errores de Compilación

1. Verifica que las dependencias se instalen correctamente
2. Asegúrate de que las variables de entorno estén configuradas
3. Revisa los logs de compilación en Vercel y GitHub Actions

## Despliegue Manual

Si el despliegue automático no funciona, puedes usar los scripts de despliegue manual:

```bash
# Para desplegar el frontend
node deploy-frontend.js

# Para desplegar ambos (frontend y backend)
node deploy-vercel.js
```

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de GitHub Actions](https://docs.github.com/es/actions)
- [Documentación de Supabase](https://supabase.io/docs)
