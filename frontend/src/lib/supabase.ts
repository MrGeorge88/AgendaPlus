import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar si las variables de entorno están disponibles
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey;

if (!hasSupabaseConfig) {
  console.warn('⚠️ Supabase environment variables not found. Some features may not work.');
  console.warn('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Crear cliente con valores por defecto si no están disponibles las variables
export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Exportar flag para verificar si Supabase está configurado
export const isSupabaseConfigured = hasSupabaseConfig;
