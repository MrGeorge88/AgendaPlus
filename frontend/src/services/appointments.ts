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
    status: 'confirmed' | 'pending' | 'cancelled' | 'no-show' | 'scheduled' | 'completed';
    paymentStatus?: 'pending' | 'partial' | 'paid';
    totalPaid?: number;
    userId: string;
    notes?: string;
    clientId?: string;
    serviceId?: string;
  };
}

// Función para actualizar el estado de pago de una cita
const updateAppointmentPaymentStatus = async (appointmentId: string, totalPaid: number, price: number): Promise<void> => {
  try {
    let paymentStatus = 'pending';

    if (totalPaid >= price) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }

    await supabase
      .from('appointments')
      .update({
        payment_status: paymentStatus,
        total_paid: totalPaid
      })
      .eq('id', appointmentId);
  } catch (error) {
    console.error('Error al actualizar el estado de pago de la cita:', error);
  }
};

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
            paymentStatus: appointment.payment_status || 'pending',
            totalPaid: appointment.total_paid || 0,
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
        payment_status: appointment.extendedProps.paymentStatus || 'pending',
        total_paid: appointment.extendedProps.totalPaid || 0,
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
          paymentStatus: data.payment_status || 'pending',
          totalPaid: data.total_paid || 0,
          userId: data.user_id,
          notes: data.notes,
          clientId: data.client_id,
          serviceId: data.service_id
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
        payment_status: appointment.extendedProps.paymentStatus || 'pending',
        total_paid: appointment.extendedProps.totalPaid || 0,
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
          paymentStatus: data.payment_status || 'pending',
          totalPaid: data.total_paid || 0,
          userId: data.user_id,
          notes: data.notes,
          clientId: data.client_id,
          serviceId: data.service_id
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
  },

  // Actualizar el estado de una cita
  updateAppointmentStatus: async (id: string, status: 'confirmed' | 'pending' | 'cancelled' | 'no-show' | 'scheduled' | 'completed'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error al actualizar el estado de la cita:', error);
      return false;
    }
  },

  // Registrar un pago para una cita
  registerPayment: async (appointmentId: string, amount: number, userId: string, paymentMethod: string = 'efectivo', notes?: string): Promise<boolean> => {
    try {
      // Obtener la cita para conocer el precio total
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('price, total_paid')
        .eq('id', appointmentId)
        .single();

      if (appointmentError) throw appointmentError;

      // Registrar el pago
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          appointment_id: appointmentId,
          amount,
          payment_method: paymentMethod,
          payment_date: new Date().toISOString(),
          status: 'completed',
          notes,
          user_id: userId
        });

      if (paymentError) throw paymentError;

      // Actualizar el estado de pago de la cita
      const totalPaid = (appointmentData.total_paid || 0) + amount;
      await updateAppointmentPaymentStatus(appointmentId, totalPaid, appointmentData.price);

      return true;
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      return false;
    }
  },

  // Obtener los pagos de una cita
  getAppointmentPayments: async (appointmentId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error al obtener los pagos de la cita:', error);
      return [];
    }
  }
};
