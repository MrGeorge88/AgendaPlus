import React, { useState, useEffect } from 'react';

export function Debug() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    const info: string[] = [];
    const env: Record<string, string> = {};

    // Check environment variables
    try {
      env.VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'NOT_SET';
      env.VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET';
      env.VITE_API_URL = import.meta.env.VITE_API_URL || 'NOT_SET';
      env.NODE_ENV = import.meta.env.NODE_ENV || 'NOT_SET';
      env.DEV = import.meta.env.DEV ? 'true' : 'false';
      env.PROD = import.meta.env.PROD ? 'true' : 'false';
      
      info.push('✅ Environment variables loaded');
    } catch (error) {
      info.push(`❌ Error loading environment variables: ${error}`);
    }

    // Check if we can import Supabase
    try {
      import('../lib/supabase').then(() => {
        info.push('✅ Supabase client imported successfully');
        setDebugInfo(prev => [...prev, '✅ Supabase client imported successfully']);
      }).catch((error) => {
        info.push(`❌ Error importing Supabase: ${error.message}`);
        setDebugInfo(prev => [...prev, `❌ Error importing Supabase: ${error.message}`]);
      });
    } catch (error) {
      info.push(`❌ Error importing Supabase: ${error}`);
    }

    // Check if we can import API config
    try {
      import('../config/api').then((apiModule) => {
        info.push(`✅ API config imported successfully. Base URL: ${apiModule.API_BASE_URL}`);
        setDebugInfo(prev => [...prev, `✅ API config imported successfully. Base URL: ${apiModule.API_BASE_URL}`]);
      }).catch((error) => {
        info.push(`❌ Error importing API config: ${error.message}`);
        setDebugInfo(prev => [...prev, `❌ Error importing API config: ${error.message}`]);
      });
    } catch (error) {
      info.push(`❌ Error importing API config: ${error}`);
    }

    // Check localStorage
    try {
      const testKey = 'debug-test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      info.push('✅ localStorage is working');
    } catch (error) {
      info.push(`❌ localStorage error: ${error}`);
    }

    setDebugInfo(info);
    setEnvVars(env);
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh' 
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>🔍 AgendaPlus Debug Page</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#666', marginBottom: '10px' }}>Environment Variables</h2>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}>
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '5px' }}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#666', marginBottom: '10px' }}>Debug Information</h2>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}>
          {debugInfo.map((info, index) => (
            <div key={index} style={{ 
              marginBottom: '5px',
              color: info.startsWith('❌') ? '#d32f2f' : '#2e7d32'
            }}>
              {info}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#666', marginBottom: '10px' }}>Browser Information</h2>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}>
          <div><strong>User Agent:</strong> {navigator.userAgent}</div>
          <div><strong>URL:</strong> {window.location.href}</div>
          <div><strong>Protocol:</strong> {window.location.protocol}</div>
          <div><strong>Host:</strong> {window.location.host}</div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Go to Home
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#388e3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
