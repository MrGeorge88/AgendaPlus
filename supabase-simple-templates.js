/**
 * Script para generar plantillas simples de email para Supabase Auth
 * 
 * Este script genera plantillas HTML simples para los emails de autenticación de Supabase.
 * Estas plantillas son más simples para evitar problemas de spam.
 */

// Plantilla para el email de confirmación
const confirmationEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirma tu cuenta en AgendaPlus</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
    <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">AgendaPlus</div>
  </div>
  <div style="padding: 30px 0;">
    <h1>Confirma tu cuenta</h1>
    <p>Gracias por registrarte en AgendaPlus. Para completar tu registro, por favor confirma tu dirección de email haciendo clic en el botón de abajo:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">Confirmar mi cuenta</a>
    </div>
    <p>Si no has solicitado esta cuenta, puedes ignorar este email.</p>
    <p>El enlace expirará en {{ .ExpirationTime }}.</p>
  </div>
  <div style="text-align: center; padding: 20px 0; font-size: 14px; color: #666; border-top: 1px solid #eee;">
    <p>&copy; 2025 AgendaPlus. Todos los derechos reservados.</p>
    <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador: {{ .ConfirmationURL }}</p>
  </div>
</body>
</html>`;

// Plantilla para el email de restablecimiento de contraseña
const resetPasswordEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Restablece tu contraseña en AgendaPlus</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
    <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">AgendaPlus</div>
  </div>
  <div style="padding: 30px 0;">
    <h1>Restablece tu contraseña</h1>
    <p>Has solicitado restablecer tu contraseña en AgendaPlus. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">Restablecer contraseña</a>
    </div>
    <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este email.</p>
    <p>El enlace expirará en {{ .ExpirationTime }}.</p>
  </div>
  <div style="text-align: center; padding: 20px 0; font-size: 14px; color: #666; border-top: 1px solid #eee;">
    <p>&copy; 2025 AgendaPlus. Todos los derechos reservados.</p>
    <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador: {{ .ConfirmationURL }}</p>
  </div>
</body>
</html>`;

// Plantilla para el email de cambio de email
const emailChangeTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirma tu nuevo email en AgendaPlus</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
    <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">AgendaPlus</div>
  </div>
  <div style="padding: 30px 0;">
    <h1>Confirma tu nuevo email</h1>
    <p>Has solicitado cambiar tu dirección de email en AgendaPlus. Para confirmar tu nueva dirección de email, haz clic en el botón de abajo:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">Confirmar nuevo email</a>
    </div>
    <p>Si no has solicitado este cambio, por favor contacta con soporte inmediatamente.</p>
    <p>El enlace expirará en {{ .ExpirationTime }}.</p>
  </div>
  <div style="text-align: center; padding: 20px 0; font-size: 14px; color: #666; border-top: 1px solid #eee;">
    <p>&copy; 2025 AgendaPlus. Todos los derechos reservados.</p>
    <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador: {{ .ConfirmationURL }}</p>
  </div>
</body>
</html>`;

// Imprimir las plantillas
console.log('\n=== PLANTILLA DE EMAIL DE CONFIRMACIÓN ===\n');
console.log(confirmationEmailTemplate);

console.log('\n\n=== PLANTILLA DE EMAIL DE RESTABLECIMIENTO DE CONTRASEÑA ===\n');
console.log(resetPasswordEmailTemplate);

console.log('\n\n=== PLANTILLA DE EMAIL DE CAMBIO DE EMAIL ===\n');
console.log(emailChangeTemplate);

console.log('\n\nInstrucciones:');
console.log('1. Accede al panel de Supabase: https://app.supabase.io');
console.log('2. Selecciona tu proyecto');
console.log('3. Ve a "Authentication > Email Templates"');
console.log('4. Copia y pega cada plantilla en su sección correspondiente');
console.log('5. Guarda los cambios');
