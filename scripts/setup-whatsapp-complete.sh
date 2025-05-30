#!/bin/bash

# Script completo para configurar WhatsApp Business API en AgendaPlus
# Este script automatiza todo el proceso de setup

set -e  # Exit on any error

echo "🚀 Configuración completa de WhatsApp Business API para AgendaPlus"
echo "=================================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
echo "🔍 Verificando prerequisitos..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI no está instalado"
    echo "Instalando Supabase CLI..."
    npm install -g supabase
    print_status "Supabase CLI instalado"
else
    print_status "Supabase CLI encontrado"
fi

# Check if user is logged in to Supabase
if ! supabase projects list &> /dev/null; then
    print_error "No estás autenticado con Supabase"
    echo "Por favor ejecuta: supabase login"
    exit 1
else
    print_status "Autenticación con Supabase verificada"
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    print_error "Este script debe ejecutarse desde la raíz del proyecto AgendaPlus"
    exit 1
fi

print_status "Directorio del proyecto verificado"

echo ""
echo "📋 Configuración de variables de entorno"
echo "========================================"

# Check if .env exists
if [ ! -f "frontend/.env" ]; then
    print_warning ".env no encontrado, creando desde .env.example"
    cp frontend/.env.example frontend/.env
fi

# Prompt for WhatsApp configuration
echo ""
print_info "Necesitamos configurar las variables de WhatsApp Business API"
echo "Si no tienes estos valores aún, puedes configurarlos después en:"
echo "- Meta for Developers: https://developers.facebook.com"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo ""

read -p "¿Tienes ya configurada tu app en Meta for Developers? (y/n): " has_meta_app

if [ "$has_meta_app" = "y" ] || [ "$has_meta_app" = "Y" ]; then
    echo ""
    echo "Ingresa tus credenciales de WhatsApp Business API:"
    
    read -p "Phone Number ID: " phone_number_id
    read -p "Access Token: " access_token
    read -p "Webhook Verify Token: " webhook_verify_token
    
    # Update .env file
    if grep -q "VITE_WHATSAPP_PHONE_NUMBER_ID" frontend/.env; then
        sed -i "s/VITE_WHATSAPP_PHONE_NUMBER_ID=.*/VITE_WHATSAPP_PHONE_NUMBER_ID=$phone_number_id/" frontend/.env
    else
        echo "VITE_WHATSAPP_PHONE_NUMBER_ID=$phone_number_id" >> frontend/.env
    fi
    
    print_status "Variables de entorno configuradas"
else
    print_warning "Configurarás las variables después del setup de Meta"
fi

echo ""
echo "🗄️  Configuración de base de datos"
echo "=================================="

# Run database migrations
print_info "Ejecutando migraciones de base de datos..."
if supabase db push; then
    print_status "Migraciones ejecutadas correctamente"
else
    print_error "Error al ejecutar migraciones"
    exit 1
fi

echo ""
echo "⚡ Deployment de Supabase Functions"
echo "=================================="

# Deploy functions
print_info "Deployando función whatsapp-webhook..."
if supabase functions deploy whatsapp-webhook; then
    print_status "whatsapp-webhook deployada"
else
    print_error "Error al deployar whatsapp-webhook"
    exit 1
fi

print_info "Deployando función whatsapp-send..."
if supabase functions deploy whatsapp-send; then
    print_status "whatsapp-send deployada"
else
    print_error "Error al deployar whatsapp-send"
    exit 1
fi

echo ""
echo "🔧 Configuración de variables en Supabase"
echo "========================================="

if [ "$has_meta_app" = "y" ] || [ "$has_meta_app" = "Y" ]; then
    print_info "Configurando variables de entorno en Supabase..."
    
    # Set environment variables in Supabase (requires manual setup)
    print_warning "ACCIÓN REQUERIDA: Configura estas variables en Supabase Dashboard:"
    echo "1. Ve a: https://supabase.com/dashboard/project/[tu-proyecto]/settings/functions"
    echo "2. En 'Environment Variables', agrega:"
    echo "   - WHATSAPP_ACCESS_TOKEN=$access_token"
    echo "   - WHATSAPP_WEBHOOK_VERIFY_TOKEN=$webhook_verify_token"
    echo ""
    read -p "Presiona Enter cuando hayas configurado las variables en Supabase..."
    print_status "Variables configuradas en Supabase"
else
    print_warning "Recuerda configurar las variables en Supabase después del setup de Meta"
fi

echo ""
echo "🧪 Verificación de instalación"
echo "=============================="

# Test webhook endpoint
print_info "Probando endpoint de webhook..."
project_ref=$(supabase status | grep "API URL" | awk '{print $3}' | sed 's|https://||' | sed 's|\.supabase\.co||')
webhook_url="https://${project_ref}.supabase.co/functions/v1/whatsapp-webhook"

echo "URL del webhook: $webhook_url"

# Basic connectivity test
if curl -s -o /dev/null -w "%{http_code}" "$webhook_url" | grep -q "405\|200"; then
    print_status "Webhook endpoint responde correctamente"
else
    print_warning "Webhook endpoint no responde (normal si no está configurado aún)"
fi

echo ""
echo "📱 Configuración de Meta for Developers"
echo "======================================="

if [ "$has_meta_app" != "y" ] && [ "$has_meta_app" != "Y" ]; then
    print_info "Sigue estos pasos para configurar Meta for Developers:"
    echo ""
    echo "1. Ve a: https://developers.facebook.com"
    echo "2. Crea una nueva app de tipo 'Business'"
    echo "3. Agrega el producto 'WhatsApp Business API'"
    echo "4. En WhatsApp > Configuration, configura el webhook:"
    echo "   - Callback URL: $webhook_url"
    echo "   - Verify Token: [genera un token seguro]"
    echo "   - Webhook Fields: messages"
    echo ""
    echo "5. Copia las credenciales y actualiza tu .env:"
    echo "   - Phone Number ID"
    echo "   - Access Token"
    echo "   - Webhook Verify Token"
    echo ""
    print_warning "Consulta docs/META_SETUP_GUIDE.md para instrucciones detalladas"
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo "=========================="
echo ""
print_status "WhatsApp Business API está configurado en AgendaPlus"
echo ""
echo "📋 Próximos pasos:"
echo "1. Completa la configuración en Meta for Developers (si no lo has hecho)"
echo "2. Actualiza las variables de entorno en .env y Supabase"
echo "3. Ve a /whatsapp en tu aplicación para probar la integración"
echo "4. Usa el tab 'Testing' para verificar la conectividad"
echo ""
echo "📖 Documentación:"
echo "- Guía de Meta: docs/META_SETUP_GUIDE.md"
echo "- Documentación completa: WHATSAPP_INTEGRATION.md"
echo ""
echo "🆘 Soporte:"
echo "- Revisa los logs: supabase functions logs whatsapp-webhook"
echo "- Verifica configuración en el tab Testing de la app"
echo ""
print_status "¡Listo para usar WhatsApp Business API! 🚀"
