# Guía de Despliegue de AgendaPlus

Esta guía te ayudará a desplegar AgendaPlus en producción utilizando Supabase para la base de datos y autenticación, y Vercel para el hosting.

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)
- Vercel CLI instalado (`npm install -g vercel`)

## 1. Configuración Inicial

### 1.1. Clonar el Repositorio

```bash
git clone https://github.com/MrGeorge88/AgendaPlus.git
cd AgendaPlus
```

### 1.2. Instalar Dependencias

```bash
npm install
```

### 1.3. Verificar Requisitos

Ejecuta el script de verificación para asegurarte de que tienes todo lo necesario:

```bash
npm run check
```

## 2. Configuración de Supabase

### 2.1. Crear un Proyecto en Supabase

1. Accede a [Supabase](https://app.supabase.io) y crea una cuenta si aún no tienes una.
2. Crea un nuevo proyecto.
3. Anota la URL y las claves API (anónima y de servicio) desde la sección "Settings > API".

### 2.2. Configurar las Credenciales

Ejecuta el script de configuración:

```bash
npm run setup
```

Sigue las instrucciones para ingresar la URL y las claves de Supabase.

### 2.3. Crear el Esquema de la Base de Datos

1. Accede al panel de Supabase.
2. Ve a la sección "SQL Editor".
3. Copia y pega el contenido del archivo `supabase-schema.sql`.
4. Ejecuta el script para crear las tablas necesarias.

### 2.4. Configurar las Políticas de Seguridad

1. En el panel de Supabase, ve a la sección "SQL Editor".
2. Copia y pega el contenido del archivo `supabase-security.sql`.
3. Ejecuta el script para configurar las políticas de seguridad.

### 2.5. (Opcional) Insertar Datos de Ejemplo

1. En el panel de Supabase, ve a la sección "SQL Editor".
2. Copia y pega el contenido del archivo `supabase-seed.sql`.
3. Ejecuta el script para insertar datos de ejemplo.

### 2.6. Configurar la Autenticación por Email

1. En el panel de Supabase, ve a "Authentication > Providers".
2. Asegúrate de que "Email" esté habilitado.
3. Ve a "Authentication > Email Templates".
4. Genera las plantillas de email:
   ```bash
   npm run email-templates
   ```
5. Abre el archivo `supabase-email-templates.html` generado.
6. Copia y pega cada plantilla en su sección correspondiente en Supabase.

### 2.7. Probar la Conexión con Supabase

```bash
npm run test:supabase
```

## 3. Despliegue en Vercel

### 3.1. Iniciar Sesión en Vercel

```bash
vercel login
```

### 3.2. Desplegar la Aplicación

```bash
npm run deploy
```

Sigue las instrucciones para desplegar el frontend y/o el backend.

### 3.3. Configurar las Variables de Entorno en Vercel

Si no se configuraron automáticamente durante el despliegue, configura manualmente las siguientes variables de entorno en el panel de Vercel:

**Frontend:**
- `VITE_SUPABASE_URL`: URL de tu proyecto de Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase

**Backend:**
- `SUPABASE_URL`: URL de tu proyecto de Supabase
- `SUPABASE_KEY`: Clave de servicio de Supabase
- `NODE_ENV`: `production`

### 3.4. Configurar Redirecciones

Si el frontend y el backend están en proyectos separados en Vercel, asegúrate de que el archivo `frontend/vercel.json` tenga la URL correcta del backend en la sección `rewrites`:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://tu-backend.vercel.app/api/:path*" }
  ]
}
```

## 4. Verificación Post-Despliegue

### 4.1. Verificar la Autenticación

1. Accede a tu aplicación desplegada.
2. Intenta registrarte con un nuevo usuario.
3. Verifica que recibas el email de confirmación.
4. Confirma tu cuenta y inicia sesión.

### 4.2. Verificar la Funcionalidad

1. Crea algunos clientes, servicios y profesionales.
2. Crea algunas citas.
3. Verifica que los datos se guarden correctamente en Supabase.

## 5. Solución de Problemas

### 5.1. Problemas con la Autenticación

- Verifica que las plantillas de email estén configuradas correctamente en Supabase.
- Asegúrate de que las variables de entorno estén configuradas correctamente en Vercel.
- Revisa los logs de la aplicación en Vercel para identificar errores.

### 5.2. Problemas con la Base de Datos

- Verifica que las tablas se hayan creado correctamente en Supabase.
- Asegúrate de que las políticas de seguridad estén configuradas correctamente.
- Revisa los logs de Supabase para identificar errores.

### 5.3. Problemas con el Despliegue

- Verifica que las variables de entorno estén configuradas correctamente en Vercel.
- Asegúrate de que el archivo `vercel.json` esté configurado correctamente.
- Revisa los logs de despliegue en Vercel para identificar errores.

## 6. Mantenimiento

### 6.1. Actualizar la Aplicación

Para actualizar la aplicación después de hacer cambios:

```bash
# Actualizar el código
git pull

# Instalar dependencias
npm install

# Desplegar nuevamente
npm run deploy
```

### 6.2. Hacer Copias de Seguridad

Regularmente, haz copias de seguridad de tu base de datos en Supabase:

1. Ve a "Database > Backups" en el panel de Supabase.
2. Haz clic en "Create Backup".

## 7. Recursos Adicionales

- [Documentación de Supabase](https://supabase.io/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Repositorio de AgendaPlus](https://github.com/MrGeorge88/AgendaPlus)
