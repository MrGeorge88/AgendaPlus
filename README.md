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
git clone https://github.com/tu-usuario/AgendaPlus.git
cd AgendaPlus
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp backend/.env.example backend/.env
# Edita el archivo .env con tus credenciales
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

### GitHub
El código fuente se aloja en GitHub. Para contribuir al proyecto:
1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

### Vercel
El frontend se despliega automáticamente en Vercel con cada push a la rama principal.
URL de producción: [https://agenda-plus.vercel.app](https://agenda-plus.vercel.app)

### Supabase
La base de datos y autenticación se gestionan a través de Supabase.
Para acceder al panel de administración: [https://app.supabase.io](https://app.supabase.io)

## Licencia

Este proyecto es privado y confidencial.
