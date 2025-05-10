import { supabase } from '../lib/supabase';

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMethod: string;
  recurring: boolean;
  frequency?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para los gastos en Supabase
interface SupabaseExpense {
  id: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  payment_method: string;
  recurring: boolean;
  frequency: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Función para convertir un gasto de Supabase al formato de la aplicación
const mapSupabaseExpense = (expense: SupabaseExpense): Expense => ({
  id: expense.id,
  category: expense.category,
  description: expense.description,
  amount: expense.amount,
  expenseDate: expense.expense_date,
  paymentMethod: expense.payment_method,
  recurring: expense.recurring,
  frequency: expense.frequency || undefined,
  userId: expense.user_id,
  createdAt: expense.created_at,
  updatedAt: expense.updated_at,
});

// Categorías de gastos predefinidas
export const expenseCategories = [
  'Alquiler',
  'Sueldos',
  'Servicios',
  'Productos',
  'Marketing',
  'Impuestos',
  'Mantenimiento',
  'Otros'
];

// Servicio de gastos
export const expensesService = {
  // Obtener todos los gastos
  getExpenses: async (userId: string): Promise<Expense[]> => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('expense_date', { ascending: false });

      if (error) throw error;

      return data.map(mapSupabaseExpense);
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
      throw new Error('No se pudieron cargar los gastos. Por favor, inténtalo de nuevo.');
    }
  },

  // Obtener gastos por categoría
  getExpensesByCategory: async (userId: string, category: string): Promise<Expense[]> => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('expense_date', { ascending: false });

      if (error) throw error;

      return data.map(mapSupabaseExpense);
    } catch (error) {
      console.error(`Error al obtener los gastos para la categoría ${category}:`, error);
      throw new Error('No se pudieron cargar los gastos. Por favor, inténtalo de nuevo.');
    }
  },

  // Crear un nuevo gasto
  createExpense: async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    try {
      // Convertir al formato de Supabase
      const supabaseExpense = {
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        expense_date: expense.expenseDate,
        payment_method: expense.paymentMethod,
        recurring: expense.recurring,
        frequency: expense.frequency || null,
        user_id: expense.userId
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert(supabaseExpense)
        .select()
        .single();

      if (error) throw error;

      return mapSupabaseExpense(data);
    } catch (error) {
      console.error('Error al crear el gasto:', error);
      throw new Error('No se pudo registrar el gasto. Por favor, inténtalo de nuevo.');
    }
  },

  // Actualizar un gasto existente
  updateExpense: async (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Expense> => {
    try {
      // Convertir al formato de Supabase
      const supabaseExpense: any = {};
      if (expense.category) supabaseExpense.category = expense.category;
      if (expense.description) supabaseExpense.description = expense.description;
      if (expense.amount !== undefined) supabaseExpense.amount = expense.amount;
      if (expense.expenseDate) supabaseExpense.expense_date = expense.expenseDate;
      if (expense.paymentMethod) supabaseExpense.payment_method = expense.paymentMethod;
      if (expense.recurring !== undefined) supabaseExpense.recurring = expense.recurring;
      if (expense.frequency !== undefined) supabaseExpense.frequency = expense.frequency || null;

      const { data, error } = await supabase
        .from('expenses')
        .update(supabaseExpense)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return mapSupabaseExpense(data);
    } catch (error) {
      console.error(`Error al actualizar el gasto con ID ${id}:`, error);
      throw new Error('No se pudo actualizar el gasto. Por favor, inténtalo de nuevo.');
    }
  },

  // Eliminar un gasto
  deleteExpense: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error al eliminar el gasto con ID ${id}:`, error);
      throw new Error('No se pudo eliminar el gasto. Por favor, inténtalo de nuevo.');
    }
  },

  // Obtener estadísticas de gastos
  getExpenseStats: async (userId: string, period: 'day' | 'week' | 'month' = 'day'): Promise<any> => {
    try {
      let query = supabase
        .from('expenses')
        .select('amount, expense_date, category')
        .eq('user_id', userId);

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

      query = query.gte('expense_date', startDate.toISOString());

      const { data, error } = await query;

      if (error) throw error;

      // Calcular total
      const total = data.reduce((sum, expense) => sum + expense.amount, 0);

      // Agrupar por categoría
      const byCategory = data.reduce((acc: Record<string, number>, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += expense.amount;
        return acc;
      }, {});

      return {
        total,
        count: data.length,
        byCategory,
        period
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de gastos:', error);
      throw new Error('No se pudieron cargar las estadísticas. Por favor, inténtalo de nuevo.');
    }
  }
};
