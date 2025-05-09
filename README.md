# AgendaPlus

Una plataforma de gestión de citas, cobros y métricas destinada a profesionales de belleza, salud y wellness.

## Visión del producto

"Hacer que profesionales de belleza, salud y wellness gestionen citas + cobros + métricas con la mínima fricción posible."

### Verticales foco
- Peluquerías/barberías
- Odontólogos y médicos particulares
- Masajistas/spa

### Dolores que resuelve
- Agenda confusa entre varios profesionales / sucursales.
- Pérdida de ingresos por no-shows o servicios mal cobrados.
- Falta de visibilidad sobre qué servicio deja mejor margen.

## Estructura del proyecto

Este proyecto es un monorepo que contiene:

- `frontend/`: Aplicación React con Vite, Tailwind CSS, shadcn/ui y FullCalendar
- `backend/`: API REST con NestJS y Supabase

## Requisitos previos

- Node.js (v18 o superior)
- npm (v9 o superior)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/MrGeorge88/AgendaPlus.git
cd AgendaPlus
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura Supabase y las variables de entorno:
```bash
node deploy.js
# Sigue las instrucciones para configurar Supabase
```

## Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
# Ejecutar frontend y backend simultáneamente
npm run dev

# Ejecutar solo el frontend
npm run dev:frontend

# Ejecutar solo el backend
npm run dev:backend
```

## Características principales

### Agenda
- Crear/editar citas drag-&-drop (día/semana) por profesional
- Filtro por sucursal y estado (Confirmada, No-show…)

### Profesionales
- Alta/baja de staff, color/avatar por persona

### Servicios
- Nombre, precio base, coste estimado → margen

### Clientes
- Ficha básica + historial de citas/pagos

### Pagos
- Enlace a Stripe/MercadoPago: depósito o pago total al reservar
- Split automático de comisión (opcional)

### Dashboards
- Ingresos hoy / semana / mes + ranking de servicios por margen

## Despliegue

### Configuración de Supabase

1. Crea una cuenta en [Supabase](https://supabase.com) si aún no tienes una.
2. Crea un nuevo proyecto en Supabase.
3. Obtén las credenciales de tu proyecto (URL y claves API) desde la sección "Settings > API".
4. Crea un archivo `.env` en la carpeta `frontend` con las siguientes variables:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```
5. Configura el esquema de la base de datos:
   - Ve a la sección "SQL Editor" en el panel de Supabase.
   - Copia y pega el contenido del archivo `supabase/schema.sql`.
   - Ejecuta el script para crear las tablas necesarias.
6. Configura la autenticación por email:
   - Ve a "Authentication > Providers" y asegúrate de que "Email" esté habilitado.
   - Configura las plantillas de email en "Authentication > Email Templates".
   - Configura el dominio de redirección para confirmación de email (tu dominio de producción o localhost para desarrollo).
7. Habilita Row Level Security (RLS) para las tablas:
   - Ve a "Authentication > Policies" y asegúrate de que las políticas se han creado correctamente.
   - Verifica que cada tabla tenga políticas para SELECT, INSERT, UPDATE y DELETE.

### Prueba de Conexión con Supabase

Para verificar que la conexión con Supabase funciona correctamente, puedes iniciar sesión en la aplicación y comprobar que puedes ver y crear citas.

### Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una.
2. Conecta tu repositorio de GitHub a Vercel:
   - Ve a [Vercel](https://vercel.com) y haz clic en "Add New..." > "Project".
   - Selecciona tu repositorio de GitHub.
   - Configura el proyecto:
     - Framework Preset: Vite
     - Root Directory: frontend
     - Build Command: npm run build
     - Output Directory: dist
3. Configura las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`: URL de tu proyecto de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase
4. Haz clic en "Deploy" para desplegar la aplicación.
5. Una vez desplegada, configura el dominio personalizado si lo deseas.

### GitHub
El código fuente se aloja en GitHub en [https://github.com/MrGeorge88/AgendaPlus](https://github.com/MrGeorge88/AgendaPlus).

Para contribuir al proyecto:
1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto es privado y confidencial.
