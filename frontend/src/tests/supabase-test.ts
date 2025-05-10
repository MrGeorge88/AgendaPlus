import { supabase } from '../lib/supabase';

// Función para probar la conexión a Supabase
export async function testSupabaseConnection() {
  try {
    console.log('Probando conexión a Supabase...');
    const { data, error } = await supabase.from('services').select('count(*)', { count: 'exact', head: true });

    if (error) {
      console.error('Error al conectar con Supabase:', error);
      return { success: false, error };
    }

    console.log('Conexión a Supabase exitosa:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado al conectar con Supabase:', error);
    return { success: false, error };
  }
}

// Función para probar la creación de un servicio
export async function testCreateService(userId: string) {
  try {
    console.log('Probando creación de servicio...');

    const testService = {
      name: 'Servicio de prueba',
      description: 'Este es un servicio de prueba',
      duration: 30,
      price: 25,
      category: 'Prueba',
      user_id: userId
    };

    console.log('Datos del servicio a crear:', testService);

    const { data, error } = await supabase
      .from('services')
      .insert(testService)
      .select()
      .single();

    if (error) {
      console.error('Error al crear servicio de prueba:', error);
      return { success: false, error };
    }

    console.log('Servicio de prueba creado exitosamente:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado al crear servicio de prueba:', error);
    return { success: false, error };
  }
}

// Función para listar las tablas disponibles en Supabase
export async function listSupabaseTables() {
  try {
    console.log('Listando tablas disponibles en Supabase...');

    // Intentar acceder a varias tablas conocidas para ver si existen
    const tables = ['services', 'clients', 'staff', 'appointments'];
    const results = {};

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count(*)', { count: 'exact', head: true });

        results[table] = { exists: !error, error: error ? error.message : null };
      } catch (err) {
        results[table] = { exists: false, error: err instanceof Error ? err.message : 'Error desconocido' };
      }
    }

    console.log('Estado de las tablas:', results);
    return { success: true, data: results };
  } catch (error) {
    console.error('Error inesperado al verificar tablas:', error);
    return { success: false, error };
  }
}
