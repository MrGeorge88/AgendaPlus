import { useState, useEffect } from "react";
import { Layout } from "../components/layout/layout";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/auth-context";
import { useLanguage } from "../contexts/language-context";
import { Expense, expensesService } from "../services/expenses";
import { ExpenseForm } from "../components/expenses/expense-form";
import { toast } from "sonner";
import { DollarSign, Calendar, CreditCard, Trash2, Edit, Plus, Filter } from "lucide-react";

export function Expenses() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);
  const [filter, setFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [stats, setStats] = useState<any>({
    total: 0,
    count: 0,
    byCategory: {}
  });

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadStats();
    }
  }, [user]);

  const loadExpenses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await expensesService.getExpenses(user.id);
      setExpenses(data);
    } catch (error) {
      console.error("Error al cargar los gastos:", error);
      toast.error("Error al cargar los gastos");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const data = await expensesService.getExpenseStats(user.id, "month");
      setStats(data);
    } catch (error) {
      console.error("Error al cargar las estadísticas:", error);
    }
  };

  const handleAddExpense = () => {
    setSelectedExpense(undefined);
    setShowForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
      return;
    }
    
    try {
      const success = await expensesService.deleteExpense(id);
      if (success) {
        toast.success("Gasto eliminado correctamente");
        loadExpenses();
        loadStats();
      } else {
        toast.error("Error al eliminar el gasto");
      }
    } catch (error) {
      console.error("Error al eliminar el gasto:", error);
      toast.error("Error al eliminar el gasto");
    }
  };

  const handleSaveExpense = () => {
    setShowForm(false);
    loadExpenses();
    loadStats();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredExpenses = expenses.filter(expense => {
    let matchesCategory = true;
    let matchesDate = true;
    
    if (filter) {
      matchesCategory = expense.category === filter;
    }
    
    if (dateFilter) {
      const expenseDate = new Date(expense.expenseDate).toISOString().split("T")[0];
      matchesDate = expenseDate === dateFilter;
    }
    
    return matchesCategory && matchesDate;
  });

  const categories = Object.keys(stats.byCategory || {}).sort();

  return (
    <Layout title="Gastos">
      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Total de gastos este mes</h3>
            </div>
            <h3 className="text-2xl font-bold">${stats.total || 0}</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Número de gastos</h3>
            </div>
            <h3 className="text-2xl font-bold">{stats.count || 0}</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Categoría principal</h3>
            </div>
            <h3 className="text-2xl font-bold">
              {categories.length > 0 ? categories[0] : "N/A"}
            </h3>
          </div>
        </div>

        {/* Filtros y botón de añadir */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter("")}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <Button onClick={handleAddExpense}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo gasto
          </Button>
        </div>

        {/* Lista de gastos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : filteredExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(expense.expenseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {expense.category}
                        {expense.recurring && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                            Recurrente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${expense.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No hay gastos registrados.</p>
              <Button onClick={handleAddExpense} variant="outline" className="mt-4">
                Registrar un gasto
              </Button>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveExpense}
          expense={selectedExpense}
        />
      )}
    </Layout>
  );
}
