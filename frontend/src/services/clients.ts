import { Client } from '../contexts/app-context';
import { supabase } from '../lib/supabase';
import { formatDate } from '../utils/date';

// Tipo para los clientes en Supabase
interface SupabaseClient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  last_visit: string | null;
  total_spent: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Función para convertir un cliente de Supabase al formato de la aplicación
const mapSupabaseClient = (client: SupabaseClient): Client => ({
  id: client.id,
  name: client.name,
  email: client.email || '',
  phone: client.phone || '',
  lastVisit: client.last_visit ? formatDate(new Date(client.last_visit)) : 'Nunca',
  totalSpent: client.total_spent || 0,
  notes: client.notes || '',
  userId: client.user_id,
});

// Servicio de clientes
export const clientsService = {
  // Obtener todos los clientes
  getClients: async (userId: string): Promise<Client[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) throw error;

      return data.map(mapSupabaseClient);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      return []; // Devolver un array vacío en lugar de lanzar un error
    }
  },

  // Obtener un cliente por ID
  getClientById: async (id: string): Promise<Client> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Cliente con ID ${id} no encontrado`);

      return mapSupabaseClient(data);
    } catch (error) {
      console.error(`Error al obtener el cliente con ID ${id}:`, error);
      throw new Error('No se pudo cargar el cliente. Por favor, inténtalo de nuevo.');
    }
  },

  // Crear un nuevo cliente
  createClient: async (client: Omit<Client, 'id'>, userId: string): Promise<Client | null> => {
    try {
      // Convertir al formato de Supabase
      const supabaseClient = {
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        notes: client.notes || null,
        total_spent: client.totalSpent || 0,
        last_visit: client.lastVisit && client.lastVisit !== 'Nunca'
          ? new Date(client.lastVisit).toISOString()
          : null,
        user_id: userId
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(supabaseClient)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapSupabaseClient(data);
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      return null;
    }
  },

  // Actualizar un cliente existente
  updateClient: async (client: Client): Promise<Client | null> => {
    try {
      // Convertir al formato de Supabase
      const supabaseClient: any = {
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        notes: client.notes || null
      };

      if (client.totalSpent !== undefined) {
        supabaseClient.total_spent = client.totalSpent;
      }

      if (client.lastVisit !== undefined) {
        supabaseClient.last_visit = client.lastVisit && client.lastVisit !== 'Nunca'
          ? new Date(client.lastVisit).toISOString()
          : null;
      }

      const { data, error } = await supabase
        .from('clients')
        .update(supabaseClient)
        .eq('id', client.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapSupabaseClient(data);
    } catch (error) {
      console.error(`Error al actualizar el cliente con ID ${client.id}:`, error);
      return null;
    }
  },

  // Eliminar un cliente
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error al eliminar el cliente con ID ${id}:`, error);
      return false;
    }
  },

  // Buscar clientes
  searchClients: async (query: string, userId: string): Promise<Client[]> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) throw error;

      return data.map(mapSupabaseClient);
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      return [];
    }
  },
};
