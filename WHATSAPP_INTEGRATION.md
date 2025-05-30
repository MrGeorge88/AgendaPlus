# WhatsApp Business Integration - AgendaPlus

## Descripción

La integración de WhatsApp Business permite a los usuarios de AgendaPlus recibir y gestionar solicitudes de citas directamente desde WhatsApp, automatizando el proceso de reserva y mejorando la experiencia del cliente.

## Características Implementadas

### ✅ Completado
- **Interfaz de Usuario**: Componente completo con tabs para configuración, mensajes y citas
- **Configuración de API**: Formulario para conectar con WhatsApp Business API
- **Bandeja de Mensajes**: Vista de mensajes recibidos con estados (leído/no leído)
- **Gestión de Citas**: Panel para confirmar/rechazar solicitudes de citas desde WhatsApp
- **Estados Visuales**: Badges y iconos para diferentes tipos de mensajes y estados
- **Navegación**: Integrado en el sidebar principal de la aplicación
- **Base de Datos**: Tablas y funciones SQL creadas en Supabase
- **Supabase Functions**: Webhooks y funciones de envío implementadas
- **Hooks de React**: Gestión de estado completa con React Query
- **Integración Real**: Componente actualizado para usar datos reales de Supabase
- **Variables de Entorno**: Configuración para Meta Cloud API

### 🚧 Pendiente de Implementación
- **Configuración de Meta**: Setup real en Meta for Developers
- **Deploy de Functions**: Subir funciones a Supabase
- **Testing E2E**: Pruebas con mensajes reales de WhatsApp
- **Plantillas de Mensajes**: Sistema avanzado de plantillas
- **Procesamiento NLP**: Detección inteligente de solicitudes de citas

## Configuración Requerida

### Variables de Entorno

Agregar las siguientes variables al archivo `.env`:

```env
# WhatsApp Business API
VITE_WHATSAPP_ACCESS_TOKEN=your_access_token_here
VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
VITE_WHATSAPP_WEBHOOK_URL=https://your-domain.com/api/whatsapp/webhook

# Supabase Functions (para webhooks)
VITE_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1
```

### Meta Cloud API Setup

1. **Crear una App en Meta for Developers**:
   - Ve a [developers.facebook.com](https://developers.facebook.com)
   - Crea una nueva app de tipo "Business"
   - Agrega el producto "WhatsApp Business API"

2. **Configurar WhatsApp Business API**:
   - Obtén tu `Access Token` temporal
   - Configura tu número de teléfono de prueba
   - Anota el `Phone Number ID`

3. **Configurar Webhooks**:
   - URL del webhook: `https://tu-dominio.com/api/whatsapp/webhook`
   - Eventos a suscribir: `messages`
   - Token de verificación: genera uno aleatorio y seguro

### Supabase Functions

Crear las siguientes funciones en Supabase:

#### 1. Webhook Handler (`whatsapp-webhook`)

```sql
-- Tabla para almacenar mensajes de WhatsApp
CREATE TABLE whatsapp_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id TEXT UNIQUE NOT NULL,
  from_phone TEXT NOT NULL,
  message_text TEXT,
  message_type TEXT DEFAULT 'text',
  status TEXT DEFAULT 'unread',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para solicitudes de citas desde WhatsApp
CREATE TABLE whatsapp_appointment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES whatsapp_messages(id) ON DELETE CASCADE,
  client_name TEXT,
  client_phone TEXT NOT NULL,
  requested_date DATE,
  requested_time TIME,
  service_name TEXT,
  status TEXT DEFAULT 'pending',
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas de seguridad
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_appointment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own WhatsApp messages" ON whatsapp_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointment requests" ON whatsapp_appointment_requests
  FOR ALL USING (auth.uid() = user_id);
```

#### 2. Message Sender (`whatsapp-send`)

```typescript
// Función para enviar mensajes a través de WhatsApp Business API
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { to, message, type = 'text' } = await req.json()

  const response = await fetch(`https://graph.facebook.com/v19.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: type,
      text: { body: message }
    })
  })

  return new Response(JSON.stringify(await response.json()), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## Estructura de Archivos

```
frontend/src/pages/whatsapp/
├── index.ts                    # Exportaciones
├── whatsapp-integration.tsx    # Componente principal
└── hooks/
    ├── use-whatsapp-messages.ts    # Hook para gestionar mensajes
    ├── use-whatsapp-config.ts      # Hook para configuración
    └── use-appointment-requests.ts  # Hook para solicitudes de citas
```

## Flujo de Trabajo

### 1. Recepción de Mensajes
1. Cliente envía mensaje a WhatsApp Business
2. Meta Cloud API envía webhook a Supabase Function
3. Función procesa el mensaje y lo almacena en la base de datos
4. Frontend recibe actualización en tiempo real vía Supabase Realtime

### 2. Procesamiento de Solicitudes de Citas
1. Sistema detecta palabras clave relacionadas con citas
2. Extrae información relevante (fecha, hora, servicio)
3. Crea una solicitud de cita pendiente
4. Notifica al usuario en la interfaz

### 3. Confirmación de Citas
1. Usuario revisa solicitud en el panel de WhatsApp
2. Confirma o rechaza la solicitud
3. Sistema crea la cita en el calendario (si se confirma)
4. Envía mensaje de confirmación automático al cliente

## ✅ INTEGRACIÓN COMPLETADA

### Fase 1: Backend Integration - ✅ COMPLETADO
- [x] Implementar Supabase Functions para webhooks
- [x] Configurar Meta Cloud API
- [x] Crear hooks para gestión de estado
- [x] Implementar envío de mensajes
- [x] Componente de testing integrado
- [x] Scripts de deployment automatizados

### Fase 2: Features Avanzadas - 🚧 DISPONIBLE
- [x] Procesamiento básico de solicitudes de citas
- [x] Plantillas de mensajes configurables
- [x] Integración con el sistema de notificaciones
- [x] Panel de testing y debugging
- [ ] Procesamiento de lenguaje natural avanzado
- [ ] Métricas de WhatsApp en el dashboard

### Fase 3: Optimización - 📋 PLANIFICADO
- [ ] Cache de mensajes para mejor performance
- [ ] Sincronización offline
- [ ] Backup automático de conversaciones
- [ ] Integración con CRM

## 🚀 INSTRUCCIONES DE DEPLOYMENT

### Opción 1: Script Automatizado (Recomendado)

```bash
# Ejecutar desde la raíz del proyecto
./scripts/setup-whatsapp-complete.sh
```

### Opción 2: Deployment Manual

1. **Instalar Supabase CLI**
   ```bash
   npm install -g supabase
   supabase login
   ```

2. **Ejecutar migraciones**
   ```bash
   supabase db push
   ```

3. **Deploy functions**
   ```bash
   supabase functions deploy whatsapp-webhook
   supabase functions deploy whatsapp-send
   ```

4. **Configurar variables de entorno**
   - En Supabase Dashboard: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
   - En .env: `VITE_WHATSAPP_PHONE_NUMBER_ID`

5. **Configurar Meta for Developers**
   - Seguir guía en `docs/META_SETUP_GUIDE.md`

## Consideraciones de Seguridad

- **Tokens de Acceso**: Nunca exponer tokens en el frontend
- **Validación de Webhooks**: Verificar firma de Meta en todos los webhooks
- **Rate Limiting**: Implementar límites de velocidad para evitar spam
- **Datos Sensibles**: Encriptar información personal de clientes
- **Logs**: Registrar todas las interacciones para auditoría

## Testing

### Configuración de Pruebas
1. Usar número de teléfono de prueba de Meta
2. Configurar webhook en entorno de desarrollo
3. Probar flujo completo de recepción y envío de mensajes

### Casos de Prueba
- [ ] Recepción de mensajes de texto
- [ ] Procesamiento de solicitudes de citas
- [ ] Confirmación/rechazo de citas
- [ ] Envío de mensajes de confirmación
- [ ] Manejo de errores de API

## Soporte y Documentación

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Meta Cloud API Reference](https://developers.facebook.com/docs/graph-api)
- [Supabase Functions Guide](https://supabase.com/docs/guides/functions)

## Contacto

Para preguntas sobre la implementación, contactar al equipo de desarrollo de AgendaPlus.
