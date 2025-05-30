import { supabase } from '../lib/supabase';

export interface IncomeStats {
  totalToday: number;
  totalWeek: number;
  totalMonth: number;
  appointmentsToday: number;
  clientsToday: number;
  monthlyData: { month: string; income: number }[];
  topServices: { name: string; count: number; income: number }[];
  topStaff: { name: string; count: number; income: number }[];
}

export const incomeService = {
  // Obtener estadísticas de ingresos
  getIncomeStats: async (userId: string): Promise<IncomeStats> => {
    try {
      // Fechas para filtrar
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startOfMonth = new Date(today);
      startOfMonth.setDate(1);

      // Obtener pagos del día
      const { data: todayPayments, error: todayError } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('payment_date', today.toISOString());

      if (todayError) throw todayError;

      // Obtener pagos de la semana
      const { data: weekPayments, error: weekError } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('payment_date', startOfWeek.toISOString());

      if (weekError) throw weekError;

      // Obtener pagos del mes
      const { data: monthPayments, error: monthError } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('payment_date', startOfMonth.toISOString());

      if (monthError) throw monthError;

      // Obtener citas del día
      const { data: todayAppointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, client_name')
        .eq('user_id', userId)
        .gte('start_time', today.toISOString())
        .lt('start_time', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      if (appointmentsError) throw appointmentsError;

      // Obtener datos mensuales para el gráfico
      const monthlyData = await getMonthlyData(userId);

      // Obtener top servicios
      const topServices = await getTopServices(userId);

      // Obtener top staff
      const topStaff = await getTopStaff(userId);

      // Calcular totales
      const totalToday = todayPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalWeek = weekPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalMonth = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);

      // Contar clientes únicos del día
      const uniqueClients = new Set(todayAppointments.map(app => app.client_name));

      return {
        totalToday,
        totalWeek,
        totalMonth,
        appointmentsToday: todayAppointments.length,
        clientsToday: uniqueClients.size,
        monthlyData,
        topServices,
        topStaff
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de ingresos:', error);
      // Devolver datos vacíos en caso de error
      return {
        totalToday: 0,
        totalWeek: 0,
        totalMonth: 0,
        appointmentsToday: 0,
        clientsToday: 0,
        monthlyData: getEmptyMonthlyData(),
        topServices: [],
        topStaff: []
      };
    }
  },

  // Obtener datos de ingresos para gráficos por período
  getRevenueByPeriod: async (userId: string, period: 'week' | 'month' | 'year' = 'month') => {
    try {
      const now = new Date();
      let startDate = new Date();
      let dateFormat = '';

      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
        dateFormat = 'YYYY-MM-DD';
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
        dateFormat = 'YYYY-MM-DD';
      } else {
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = 'YYYY-MM';
      }

      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('payment_date', startDate.toISOString())
        .order('payment_date');

      if (error) throw error;

      // Agrupar por fecha
      const groupedData: Record<string, { revenue: number; appointments: number }> = {};

      payments.forEach(payment => {
        const date = new Date(payment.payment_date);
        const key = period === 'year'
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          : date.toISOString().split('T')[0];

        if (!groupedData[key]) {
          groupedData[key] = { revenue: 0, appointments: 0 };
        }
        groupedData[key].revenue += payment.amount;
        groupedData[key].appointments += 1;
      });

      return Object.entries(groupedData).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        appointments: data.appointments
      }));
    } catch (error) {
      console.error('Error al obtener datos de ingresos por período:', error);
      return [];
    }
  },

  // Obtener datos de citas por estado para gráficos
  getAppointmentsByStatus: async (userId: string) => {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('status')
        .eq('user_id', userId);

      if (error) throw error;

      // Contar por estado
      const statusCounts: Record<string, number> = {};
      appointments.forEach(appointment => {
        const status = appointment.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        label: status
      }));
    } catch (error) {
      console.error('Error al obtener citas por estado:', error);
      return [];
    }
  },

  // Obtener rendimiento del personal
  getStaffPerformance: async (userId: string) => {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          staff_id,
          price,
          status,
          staff:staff_id (
            name
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (error) throw error;

      // Agrupar por personal
      const staffData: Record<string, { name: string; appointments: number; revenue: number }> = {};

      appointments.forEach(appointment => {
        const staffId = appointment.staff_id;
        const staffName = appointment.staff?.name || 'Personal sin nombre';

        if (!staffData[staffId]) {
          staffData[staffId] = {
            name: staffName,
            appointments: 0,
            revenue: 0
          };
        }

        staffData[staffId].appointments += 1;
        staffData[staffId].revenue += appointment.price || 0;
      });

      return Object.values(staffData);
    } catch (error) {
      console.error('Error al obtener rendimiento del personal:', error);
      return [];
    }
  }
};

// Función para obtener datos mensuales
async function getMonthlyData(userId: string): Promise<{ month: string; income: number }[]> {
  try {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();

    // Inicializar array con todos los meses en 0
    const monthlyData = months.map(month => ({ month, income: 0 }));

    // Obtener pagos del año actual
    const { data, error } = await supabase
      .from('payments')
      .select('amount, payment_date')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('payment_date', `${currentYear}-01-01`)
      .lt('payment_date', `${currentYear + 1}-01-01`);

    if (error) throw error;

    // Agrupar pagos por mes
    data.forEach(payment => {
      const date = new Date(payment.payment_date);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].income += payment.amount;
    });

    return monthlyData;
  } catch (error) {
    console.error('Error al obtener datos mensuales:', error);
    return getEmptyMonthlyData();
  }
}

// Función para obtener top servicios
async function getTopServices(userId: string): Promise<{ name: string; count: number; income: number }[]> {
  try {
    // Obtener citas con servicios
    const { data, error } = await supabase
      .from('appointments')
      .select('service_name, price, service_id')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('service_name');

    if (error) throw error;

    // Agrupar por servicio
    const serviceMap = new Map<string, { name: string; count: number; income: number }>();

    data.forEach(appointment => {
      const serviceName = appointment.service_name;
      if (!serviceName) return;

      if (!serviceMap.has(serviceName)) {
        serviceMap.set(serviceName, { name: serviceName, count: 0, income: 0 });
      }

      const service = serviceMap.get(serviceName)!;
      service.count += 1;
      service.income += appointment.price || 0;
    });

    // Convertir a array y ordenar por ingresos
    return Array.from(serviceMap.values())
      .sort((a, b) => b.income - a.income)
      .slice(0, 5);
  } catch (error) {
    console.error('Error al obtener top servicios:', error);
    return [];
  }
}

// Función para obtener top staff
async function getTopStaff(userId: string): Promise<{ name: string; count: number; income: number }[]> {
  try {
    // Obtener citas con staff
    const { data, error } = await supabase
      .from('appointments')
      .select('staff_id, price, staff(name)')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('staff_id');

    if (error) throw error;

    // Agrupar por staff
    const staffMap = new Map<string, { name: string; count: number; income: number }>();

    data.forEach(appointment => {
      if (!appointment.staff || !appointment.staff.name) return;

      const staffName = appointment.staff.name;
      const staffId = appointment.staff_id;

      if (!staffId || !staffName) return;

      if (!staffMap.has(staffId)) {
        staffMap.set(staffId, { name: staffName, count: 0, income: 0 });
      }

      const staff = staffMap.get(staffId)!;
      staff.count += 1;
      staff.income += appointment.price || 0;
    });

    // Convertir a array y ordenar por ingresos
    return Array.from(staffMap.values())
      .sort((a, b) => b.income - a.income)
      .slice(0, 5);
  } catch (error) {
    console.error('Error al obtener top staff:', error);
    return [];
  }
}

// Función para obtener datos mensuales vacíos
function getEmptyMonthlyData(): { month: string; income: number }[] {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months.map(month => ({ month, income: 0 }));
}
