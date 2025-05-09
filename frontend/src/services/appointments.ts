import { supabase } from '../lib/supabase';

export interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string; // Cambiado a string para UUID
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    client: string;
    service: string;
    price: number;
    status: 'confirmed' | 'pending' | 'cancelled' | 'no-show' | 'scheduled';
    userId: string;
    notes?: string;
    clientId?: string;
    serviceId?: string;
  };
}

export const appointmentsService = {
  // Obtener todas las citas
  getAppointments: async (userId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, clients(*), services(*), staff(*)')
        .eq('user_id', userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Transformar los datos de Supabase al formato que espera FullCalendar
      return data.map(appointment => {
        // Determinar el título de la cita
        let title = appointment.title || '';
        if (!title && appointment.services) {
          title = appointment.services.name;
        }

        // Determinar el nombre del cliente
        let clientName = appointment.client_name || '';
        if (!clientName && appointment.clients) {
          clientName = appointment.clients.name;
        }

        // Determinar el nombre del servicio
        let serviceName = appointment.service_name || '';
        if (!serviceName && appointment.services) {
          serviceName = appointment.services.name;
        }

        // Determinar el color
        let color = appointment.color || '#4f46e5';
        if (!color && appointment.staff) {
          color = appointment.staff.color || '#4f46e5';
        }

        return {
          id: appointment.id,
          title: title,
          start: appointment.start_time,
          end: appointment.end_time,
          resourceId: appointment.staff_id,
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            client: clientName,
            service: serviceName,
            price: appointment.price || 0,
            status: appointment.status || 'scheduled',
            userId: appointment.user_id,
            notes: appointment.notes,
            clientId: appointment.client_id,
            serviceId: appointment.service_id
          }
        };
      });
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
        client_id: appointment.extendedProps.clientId || null,
        service_id: appointment.extendedProps.serviceId || null,
        price: appointment.extendedProps.price,
        status: appointment.extendedProps.status,
        notes: appointment.extendedProps.notes,
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
          userId: data.user_id,
          notes: data.notes
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
        client_id: appointment.extendedProps.clientId || null,
        service_id: appointment.extendedProps.serviceId || null,
        price: appointment.extendedProps.price,
        status: appointment.extendedProps.status,
        notes: appointment.extendedProps.notes
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
          userId: data.user_id,
          notes: data.notes
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
