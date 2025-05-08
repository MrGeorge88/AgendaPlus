import React, { useEffect } from 'react';

export function LoginConsole() {
  useEffect(() => {
    console.log('LoginConsole component mounted');
    
    // Log any errors that might be happening
    const originalError = console.error;
    console.error = (...args) => {
      console.log('Error captured:', ...args);
      originalError(...args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-indigo-600">Página de Prueba de Consola</h1>
        <p className="text-gray-600">Esta página está diseñada para capturar errores en la consola.</p>
        <p className="mt-4 text-gray-600">Por favor, abre la consola del navegador (F12) para ver los errores.</p>
      </div>
    </div>
  );
}
