import React from 'react';
import { Link } from 'react-router-dom';

export function LoginBasic() {
  // Función simple para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado');
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc', 
      padding: '1rem' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '28rem', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        padding: '1.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' 
      }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4f46e5' }}>AgendaPlus</h1>
          <p style={{ marginTop: '0.5rem', color: '#64748b' }}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '0.375rem', 
                border: '1px solid #cbd5e1' 
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Contraseña
            </label>
            <input
              type="password"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '0.375rem', 
                border: '1px solid #cbd5e1' 
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{ 
              width: '100%', 
              backgroundColor: '#4f46e5', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.375rem', 
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Iniciar sesión
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <p style={{ color: '#64748b' }}>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none' }}>
              Regístrate
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none' }}>
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
