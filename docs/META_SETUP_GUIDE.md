# Guía de Configuración Meta for Developers

Esta guía te ayudará a configurar WhatsApp Business API en Meta for Developers para integrar con AgendaPlus.

## Paso 1: Crear una App en Meta for Developers

1. **Accede a Meta for Developers**
   - Ve a [developers.facebook.com](https://developers.facebook.com)
   - Inicia sesión con tu cuenta de Facebook/Meta

2. **Crear Nueva App**
   - Haz clic en "Create App"
   - Selecciona "Business" como tipo de app
   - Completa la información básica:
     - App Name: `AgendaPlus WhatsApp`
     - App Contact Email: tu email
     - Business Account: selecciona o crea una

3. **Agregar WhatsApp Product**
   - En el dashboard de tu app, busca "WhatsApp"
   - Haz clic en "Set up" en WhatsApp Business API

## Paso 2: Configurar WhatsApp Business API

### Obtener Credenciales

1. **Phone Number ID**
   - En la sección WhatsApp > Getting Started
   - Copia el "Phone number ID" (será algo como: `123456789012345`)

2. **Access Token**
   - En la misma página, encontrarás un "Temporary access token"
   - **⚠️ IMPORTANTE**: Este token es temporal (24 horas)
   - Para producción, necesitarás generar un token permanente

3. **App ID y App Secret**
   - Ve a Settings > Basic
   - Copia el "App ID" y "App Secret"

### Configurar Webhook

1. **URL del Webhook**
   ```
   https://[tu-proyecto].supabase.co/functions/v1/whatsapp-webhook
   ```
   
2. **Verify Token**
   - Genera un token aleatorio y seguro (ej: `mi_token_secreto_123`)
   - Guárdalo, lo necesitarás en las variables de entorno

3. **Configurar en Meta**
   - Ve a WhatsApp > Configuration
   - En "Webhook", haz clic en "Edit"
   - Callback URL: tu URL del webhook
   - Verify Token: el token que generaste
   - Webhook Fields: selecciona `messages`

## Paso 3: Configurar Variables de Entorno

### En Supabase Dashboard

1. **Accede a tu proyecto Supabase**
   - Ve a Settings > Edge Functions
   - En "Environment Variables", agrega:

```bash
WHATSAPP_ACCESS_TOKEN=tu_access_token_aqui
WHATSAPP_WEBHOOK_VERIFY_TOKEN=tu_verify_token_aqui
```

### En tu aplicación (.env)

```bash
VITE_WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
VITE_SUPABASE_FUNCTIONS_URL=https://tu-proyecto.supabase.co/functions/v1
```

## Paso 4: Generar Token Permanente (Producción)

Para producción, necesitas un token permanente:

1. **Crear System User**
   - Ve a Meta Business Settings
   - En "Users" > "System Users", crea un nuevo usuario
   - Asigna permisos de WhatsApp Business Management

2. **Generar Token**
   - Selecciona tu app
   - Genera un token con permisos `whatsapp_business_messaging`
   - Este token no expira

## Paso 5: Configurar Número de Teléfono

### Para Testing
- Meta proporciona un número de prueba
- Puedes enviar mensajes solo a números verificados

### Para Producción
1. **Verificar tu número de negocio**
   - Ve a WhatsApp > Phone Numbers
   - Agrega tu número de negocio
   - Completa el proceso de verificación

2. **Configurar Perfil de Negocio**
   - Nombre del negocio
   - Descripción
   - Sitio web
   - Categoría

## Paso 6: Testing

### Verificar Webhook
```bash
curl -X GET "https://tu-proyecto.supabase.co/functions/v1/whatsapp-webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=tu_verify_token"
```

### Enviar Mensaje de Prueba
```bash
curl -X POST \
  "https://graph.facebook.com/v19.0/TU_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "TU_NUMERO_DE_PRUEBA",
    "type": "text",
    "text": {
      "body": "¡Hola! Este es un mensaje de prueba desde AgendaPlus."
    }
  }'
```

## Paso 7: Configuración Avanzada

### Plantillas de Mensajes
1. **Crear Plantillas**
   - Ve a WhatsApp > Message Templates
   - Crea plantillas para confirmaciones de citas
   - Espera aprobación de Meta (24-48 horas)

### Configurar Business Profile
```bash
curl -X POST \
  "https://graph.facebook.com/v19.0/TU_PHONE_NUMBER_ID/whatsapp_business_profile" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "address": "Tu dirección",
    "description": "AgendaPlus - Sistema de gestión de citas",
    "email": "tu@email.com",
    "profile_picture_url": "https://tu-dominio.com/logo.jpg",
    "websites": ["https://tu-dominio.com"]
  }'
```

## Troubleshooting

### Errores Comunes

1. **Webhook no se verifica**
   - Verifica que la URL sea correcta
   - Asegúrate de que el verify token coincida
   - Revisa los logs de Supabase Functions

2. **Token expirado**
   - Los tokens temporales duran 24 horas
   - Genera un token permanente para producción

3. **Mensajes no se reciben**
   - Verifica que el webhook esté configurado
   - Revisa que los campos del webhook incluyan `messages`
   - Verifica los logs de la función

4. **No se pueden enviar mensajes**
   - Verifica el access token
   - Asegúrate de que el número esté verificado
   - Para números no verificados, solo puedes enviar plantillas aprobadas

### Logs y Debugging

1. **Supabase Functions Logs**
   ```bash
   supabase functions logs whatsapp-webhook
   ```

2. **Meta Webhooks Tool**
   - Ve a WhatsApp > Configuration
   - Usa "Test webhook" para verificar conectividad

## Límites y Consideraciones

### Límites de API
- **Mensajes por día**: Varía según el nivel de verificación
- **Rate limiting**: 1000 mensajes por segundo
- **Plantillas**: Máximo 250 plantillas por cuenta

### Costos
- **Conversaciones iniciadas por negocio**: $0.005 - $0.009 USD
- **Conversaciones iniciadas por usuario**: Gratis las primeras 1000/mes
- **Plantillas**: Gratis para confirmaciones de citas

### Compliance
- **Opt-in requerido**: Los usuarios deben iniciar la conversación
- **Ventana de 24 horas**: Puedes responder gratis dentro de 24 horas
- **Contenido permitido**: Solo mensajes relacionados con el negocio

## Recursos Adicionales

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Help Center](https://www.facebook.com/business/help)
- [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)

## Soporte

Si encuentras problemas:
1. Revisa los logs de Supabase Functions
2. Verifica la configuración en Meta for Developers
3. Consulta la documentación oficial de Meta
4. Contacta al equipo de desarrollo de AgendaPlus
