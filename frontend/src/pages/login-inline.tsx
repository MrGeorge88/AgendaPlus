import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginInline() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simulamos un inicio de sesión exitoso
      console.log('Iniciando sesión con:', email, password);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div style={{ 
            marginBottom: '1rem', 
            backgroundColor: '#fee2e2', 
            color: '#ef4444', 
            padding: '0.75rem', 
            borderRadius: '0.5rem', 
            fontSize: '0.875rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.25rem', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <label style={{ 
              display: 'block', 
              marginBottom: '0.25rem', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
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
