import { Service } from '../contexts/app-context';
import { supabase } from '../lib/supabase';

// Tipo para los servicios en Supabase
interface SupabaseService {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Función para convertir un servicio de Supabase al formato de la aplicación
const mapSupabaseService = (service: SupabaseService): Service => ({
  id: service.id,
  name: service.name,
  description: service.description || '',
  duration: service.duration,
  price: service.price,
  category: service.category || 'Sin categoría',
});

// Servicio de servicios
export const servicesService = {
  // Obtener todos los servicios
  getServices: async (userId?: string): Promise<Service[]> => {
    try {
      let query = supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(mapSupabaseService);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      throw new Error('No se pudieron cargar los servicios. Por favor, inténtalo de nuevo.');
    }
  },

  // Obtener un servicio por ID
  getServiceById: async (id: string): Promise<Service> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Servicio con ID ${id} no encontrado`);

      return mapSupabaseService(data);
    } catch (error) {
      console.error(`Error al obtener el servicio con ID ${id}:`, error);
      throw new Error('No se pudo cargar el servicio. Por favor, inténtalo de nuevo.');
    }
  },

  // Crear un nuevo servicio
  createService: async (service: Omit<Service, 'id'>, userId: string): Promise<Service> => {
    try {
      // Convertir al formato de Supabase
      const supabaseService = {
        name: service.name,
        description: service.description || null,
        duration: service.duration,
        price: service.price,
        category: service.category || null,
        user_id: userId
      };

      console.log('Creando servicio con datos:', supabaseService);

      // Verificar si la tabla existe
      const { error: tableCheckError } = await supabase
        .from('services')
        .select('count(*)', { count: 'exact', head: true });

      if (tableCheckError) {
        console.error('Error al verificar la tabla services:', tableCheckError);
        throw new Error(`La tabla services no existe o no es accesible: ${tableCheckError.message}`);
      }

      // Intentar insertar el servicio
      const { data, error } = await supabase
        .from('services')
        .insert(supabaseService)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        throw error;
      }

      if (!data) throw new Error('No se pudo crear el servicio');

      console.log('Servicio creado exitosamente:', data);
      return mapSupabaseService(data);
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      if (error instanceof Error) {
        throw new Error(`No se pudo crear el servicio: ${error.message}`);
      } else {
        throw new Error('No se pudo crear el servicio. Por favor, inténtalo de nuevo.');
      }
    }
  },

  // Actualizar un servicio existente
  updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
    try {
      // Convertir al formato de Supabase
      const supabaseService: any = {};

      if (service.name !== undefined) supabaseService.name = service.name;
      if (service.description !== undefined) supabaseService.description = service.description || null;
      if (service.duration !== undefined) supabaseService.duration = service.duration;
      if (service.price !== undefined) supabaseService.price = service.price;
      if (service.category !== undefined) supabaseService.category = service.category || null;

      console.log('Actualizando servicio con datos:', supabaseService);

      const { data, error } = await supabase
        .from('services')
        .update(supabaseService)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      if (!data) throw new Error(`Servicio con ID ${id} no encontrado`);

      return mapSupabaseService(data);
    } catch (error) {
      console.error(`Error al actualizar el servicio con ID ${id}:`, error);
      throw new Error('No se pudo actualizar el servicio. Por favor, inténtalo de nuevo.');
    }
  },

  // Eliminar un servicio
  deleteService: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error al eliminar el servicio con ID ${id}:`, error);
      throw new Error('No se pudo eliminar el servicio. Por favor, inténtalo de nuevo.');
    }
  },

  // Buscar servicios
  searchServices: async (query: string): Promise<Service[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) throw error;

      return data.map(mapSupabaseService);
    } catch (error) {
      console.error('Error al buscar servicios:', error);
      throw new Error('No se pudieron buscar los servicios. Por favor, inténtalo de nuevo.');
    }
  },
};
