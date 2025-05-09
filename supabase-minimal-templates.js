/**
 * Script para generar plantillas mínimas de email para Supabase Auth
 * 
 * Este script genera plantillas HTML mínimas para los emails de autenticación de Supabase.
 * Estas plantillas son extremadamente simples para evitar problemas de spam.
 */

// Plantilla para el email de confirmación
const confirmationEmailTemplate = `
<h2>Confirma tu cuenta en AgendaPlus</h2>
<p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar mi cuenta</a></p>
<p>O copia y pega esta URL en tu navegador:</p>
<p>{{ .ConfirmationURL }}</p>
<p>El enlace expirará en {{ .ExpirationTime }}.</p>
<p>Si no has solicitado esta cuenta, puedes ignorar este email.</p>
<p>--<br>AgendaPlus</p>
`;

// Plantilla para el email de restablecimiento de contraseña
const resetPasswordEmailTemplate = `
<h2>Restablece tu contraseña en AgendaPlus</h2>
<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer contraseña</a></p>
<p>O copia y pega esta URL en tu navegador:</p>
<p>{{ .ConfirmationURL }}</p>
<p>El enlace expirará en {{ .ExpirationTime }}.</p>
<p>Si no has solicitado restablecer tu contraseña, puedes ignorar este email.</p>
<p>--<br>AgendaPlus</p>
`;

// Plantilla para el email de cambio de email
const emailChangeTemplate = `
<h2>Confirma tu nuevo email en AgendaPlus</h2>
<p>Haz clic en el siguiente enlace para confirmar tu nuevo email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar nuevo email</a></p>
<p>O copia y pega esta URL en tu navegador:</p>
<p>{{ .ConfirmationURL }}</p>
<p>El enlace expirará en {{ .ExpirationTime }}.</p>
<p>Si no has solicitado este cambio, por favor contacta con soporte inmediatamente.</p>
<p>--<br>AgendaPlus</p>
`;

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
