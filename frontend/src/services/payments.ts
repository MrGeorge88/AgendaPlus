import { supabase } from '../lib/supabase';

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'completed' | 'refunded' | 'partial';
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para los pagos en Supabase
interface SupabasePayment {
  id: string;
  appointment_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
  notes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Función para convertir un pago de Supabase al formato de la aplicación
const mapSupabasePayment = (payment: SupabasePayment): Payment => ({
  id: payment.id,
  appointmentId: payment.appointment_id,
  amount: payment.amount,
  paymentMethod: payment.payment_method,
  paymentDate: payment.payment_date,
  status: payment.status as 'completed' | 'refunded' | 'partial',
  notes: payment.notes || undefined,
  userId: payment.user_id,
  createdAt: payment.created_at,
  updatedAt: payment.updated_at,
});

// Servicio de pagos
export const paymentsService = {
  // Obtener todos los pagos
  getPayments: async (userId: string): Promise<Payment[]> => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      return data.map(mapSupabasePayment);
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
      throw new Error('No se pudieron cargar los pagos. Por favor, inténtalo de nuevo.');
    }
  },

  // Obtener pagos por cita
  getPaymentsByAppointment: async (appointmentId: string): Promise<Payment[]> => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      return data.map(mapSupabasePayment);
    } catch (error) {
      console.error(`Error al obtener los pagos para la cita ${appointmentId}:`, error);
      throw new Error('No se pudieron cargar los pagos. Por favor, inténtalo de nuevo.');
    }
  },

  // Crear un nuevo pago
  createPayment: async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
    try {
      // Convertir al formato de Supabase
      const supabasePayment = {
        appointment_id: payment.appointmentId,
        amount: payment.amount,
        payment_method: payment.paymentMethod,
        payment_date: payment.paymentDate,
        status: payment.status,
        notes: payment.notes || null,
        user_id: payment.userId
      };

      const { data, error } = await supabase
        .from('payments')
        .insert(supabasePayment)
        .select()
        .single();

      if (error) throw error;

      return mapSupabasePayment(data);
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw new Error('No se pudo registrar el pago. Por favor, inténtalo de nuevo.');
    }
  },

  // Actualizar un pago existente
  updatePayment: async (id: string, payment: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Payment> => {
    try {
      // Convertir al formato de Supabase
      const supabasePayment: any = {};
      if (payment.appointmentId) supabasePayment.appointment_id = payment.appointmentId;
      if (payment.amount !== undefined) supabasePayment.amount = payment.amount;
      if (payment.paymentMethod) supabasePayment.payment_method = payment.paymentMethod;
      if (payment.paymentDate) supabasePayment.payment_date = payment.paymentDate;
      if (payment.status) supabasePayment.status = payment.status;
      if (payment.notes !== undefined) supabasePayment.notes = payment.notes || null;

      const { data, error } = await supabase
        .from('payments')
        .update(supabasePayment)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return mapSupabasePayment(data);
    } catch (error) {
      console.error(`Error al actualizar el pago con ID ${id}:`, error);
      throw new Error('No se pudo actualizar el pago. Por favor, inténtalo de nuevo.');
    }
  },

  // Eliminar un pago
  deletePayment: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error al eliminar el pago con ID ${id}:`, error);
      throw new Error('No se pudo eliminar el pago. Por favor, inténtalo de nuevo.');
    }
  },

  // Obtener estadísticas de pagos
  getPaymentStats: async (userId: string, period: 'day' | 'week' | 'month' = 'day'): Promise<any> => {
    try {
      let query = supabase
        .from('payments')
        .select('amount, payment_date, status')
        .eq('user_id', userId)
        .eq('status', 'completed');

      const now = new Date();
      let startDate = new Date();

      if (period === 'day') {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'month') {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      }

      query = query.gte('payment_date', startDate.toISOString());

      const { data, error } = await query;

      if (error) throw error;

      // Calcular total
      const total = data.reduce((sum, payment) => sum + payment.amount, 0);

      return {
        total,
        count: data.length,
        period
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de pagos:', error);
      throw new Error('No se pudieron cargar las estadísticas. Por favor, inténtalo de nuevo.');
    }
  }
};
