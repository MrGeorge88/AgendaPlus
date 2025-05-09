import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function LoginBasic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [supabaseInfo, setSupabaseInfo] = useState({
    url: '',
    hasKey: false,
    connected: false
  });
  const navigate = useNavigate();

  // Verificar la conexión con Supabase al cargar
  useEffect(() => {
    async function checkSupabase() {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL || '';
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

        setSupabaseInfo({
          url,
          hasKey: !!key,
          connected: false
        });

        if (url && key) {
          try {
            const { error } = await supabase.from('clients').select('count').limit(1);

            if (!error) {
              setSupabaseInfo(prev => ({
                ...prev,
                connected: true
              }));
              setMessage('Conectado a Supabase correctamente');
            } else {
              console.error('Error al conectar con Supabase:', error);
              setMessage(`Error al conectar con Supabase: ${error.message}`);
            }
          } catch (err) {
            console.error('Error al consultar Supabase:', err);
          }
        }
      } catch (err) {
        console.error('Error al verificar Supabase:', err);
        setMessage(`Error al verificar Supabase: ${err}`);
      }
    }

    checkSupabase();
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Inicio de sesión exitoso');
        console.log('Usuario:', data.user);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
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
