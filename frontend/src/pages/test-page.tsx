import React from 'react';

export function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Página de Prueba</h1>
        <p className="text-gray-600">Esta es una página de prueba simple para verificar si hay problemas con la carga de componentes.</p>
      </div>
    </div>
  );
}
