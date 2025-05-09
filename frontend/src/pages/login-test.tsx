import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function LoginTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  useEffect(() => {
    // Mostrar las variables de entorno (sin mostrar la clave completa por seguridad)
    const url = import.meta.env.VITE_SUPABASE_URL || '';
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    setSupabaseUrl(url);
    setSupabaseKey(key ? `${key.substring(0, 5)}...${key.substring(key.length - 5)}` : 'No configurada');
    
    setMessage('Página cargada correctamente');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Intentando iniciar sesión...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(`Inicio de sesión exitoso. Usuario: ${data.user.email}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Login Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Información de Supabase:</h3>
        <p><strong>URL:</strong> {supabaseUrl || 'No configurada'}</p>
        <p><strong>Clave anónima:</strong> {supabaseKey}</p>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Estado:</h3>
        <p>{message}</p>
      </div>
      
      <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Iniciar Sesión
        </button>
      </form>
      
      <div>
        <a href="#/" style={{ color: '#2196F3', textDecoration: 'none' }}>Volver a la página principal</a>
      </div>
    </div>
  );
}
