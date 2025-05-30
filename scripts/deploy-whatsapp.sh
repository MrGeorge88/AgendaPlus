#!/bin/bash

# Script para deployar la integración de WhatsApp a Supabase
# Asegúrate de tener Supabase CLI instalado: npm install -g supabase

echo "🚀 Iniciando deployment de integración WhatsApp..."

# Verificar que Supabase CLI esté instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no está instalado. Instálalo con: npm install -g supabase"
    exit 1
fi

# Verificar que estemos logueados
echo "📋 Verificando autenticación con Supabase..."
if ! supabase projects list &> /dev/null; then
    echo "❌ No estás autenticado con Supabase. Ejecuta: supabase login"
    exit 1
fi

echo "✅ Autenticación verificada"

# Ejecutar migraciones
echo "📊 Ejecutando migraciones de base de datos..."
if supabase db push; then
    echo "✅ Migraciones ejecutadas correctamente"
else
    echo "❌ Error al ejecutar migraciones"
    exit 1
fi

# Deploy de funciones
echo "⚡ Deployando función whatsapp-webhook..."
if supabase functions deploy whatsapp-webhook; then
    echo "✅ whatsapp-webhook deployada correctamente"
else
    echo "❌ Error al deployar whatsapp-webhook"
    exit 1
fi

echo "⚡ Deployando función whatsapp-send..."
if supabase functions deploy whatsapp-send; then
    echo "✅ whatsapp-send deployada correctamente"
else
    echo "❌ Error al deployar whatsapp-send"
    exit 1
fi

# Configurar variables de entorno para las funciones
echo "🔧 Configurando variables de entorno..."
echo "⚠️  Recuerda configurar las siguientes variables en tu proyecto Supabase:"
echo "   - WHATSAPP_ACCESS_TOKEN"
echo "   - WHATSAPP_WEBHOOK_VERIFY_TOKEN"
echo ""
echo "Puedes configurarlas en: https://supabase.com/dashboard/project/[tu-proyecto]/settings/functions"

echo ""
echo "🎉 ¡Deployment completado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en Supabase Dashboard"
echo "2. Configura tu app en Meta for Developers"
echo "3. Agrega la URL del webhook: https://[tu-proyecto].supabase.co/functions/v1/whatsapp-webhook"
echo "4. Prueba enviando un mensaje a tu número de WhatsApp Business"
echo ""
echo "📖 Consulta WHATSAPP_INTEGRATION.md para más detalles"
