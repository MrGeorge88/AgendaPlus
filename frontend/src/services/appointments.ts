import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/auth-context';

export interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: number;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    client: string;
    service: string;
    price: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    userId: string;
  };
}

export const appointmentsService = {
  // Obtener todas las citas
  getAppointments: async (userId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Transformar los datos de Supabase al formato que espera FullCalendar
      return data.map(appointment => ({
        id: appointment.id,
        title: appointment.title,
        start: appointment.start_time,
        end: appointment.end_time,
        resourceId: appointment.staff_id,
        backgroundColor: appointment.color,
        borderColor: appointment.color,
        extendedProps: {
          client: appointment.client_name,
          service: appointment.service_name,
          price: appointment.price,
          status: appointment.status,
          userId: appointment.user_id
        }
      }));
    } catch (error) {
      console.error('Error al obtener las citas:', error);
      return [];
    }
  },

  // Crear una nueva cita
  createAppointment: async (appointment: Omit<Appointment, 'id'>, userId: string): Promise<Appointment | null> => {
    try {
      // Transformar el formato de la cita para Supabase
      const supabaseAppointment = {
        title: appointment.title,
        start_time: appointment.start,
        end_time: appointment.end,
        staff_id: appointment.resourceId,
        color: appointment.backgroundColor || '#4f46e5',
        client_name: appointment.extendedProps.client,
        service_name: appointment.extendedProps.service,
        price: appointment.extendedProps.price,
        status: appointment.extendedProps.status,
        user_id: userId
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(supabaseAppointment)
        .select()
        .single();

      if (error) throw error;

      // Transformar la respuesta al formato de FullCalendar
      return {
        id: data.id,
        title: data.title,
        start: data.start_time,
        end: data.end_time,
        resourceId: data.staff_id,
        backgroundColor: data.color,
        borderColor: data.color,
        extendedProps: {
          client: data.client_name,
          service: data.service_name,
          price: data.price,
          status: data.status,
          userId: data.user_id
        }
      };
    } catch (error) {
      console.error('Error al crear la cita:', error);
      return null;
    }
  },

  // Actualizar una cita existente
  updateAppointment: async (appointment: Appointment): Promise<Appointment | null> => {
    try {
      // Transformar el formato de la cita para Supabase
      const supabaseAppointment = {
        title: appointment.title,
        start_time: appointment.start,
        end_time: appointment.end,
        staff_id: appointment.resourceId,
        color: appointment.backgroundColor || '#4f46e5',
        client_name: appointment.extendedProps.client,
        service_name: appointment.extendedProps.service,
        price: appointment.extendedProps.price,
        status: appointment.extendedProps.status
      };

      const { data, error } = await supabase
        .from('appointments')
        .update(supabaseAppointment)
        .eq('id', appointment.id)
        .select()
        .single();

      if (error) throw error;

      // Transformar la respuesta al formato de FullCalendar
      return {
        id: data.id,
        title: data.title,
        start: data.start_time,
        end: data.end_time,
        resourceId: data.staff_id,
        backgroundColor: data.color,
        borderColor: data.color,
        extendedProps: {
          client: data.client_name,
          service: data.service_name,
          price: data.price,
          status: data.status,
          userId: data.user_id
        }
      };
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      return null;
    }
  },

  // Eliminar una cita
  deleteAppointment: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      return false;
    }
  }
};
