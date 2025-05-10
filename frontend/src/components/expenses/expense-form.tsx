import { useState } from "react";
import { Button } from "../ui/button";
import { Expense, expenseCategories, expensesService } from "../../services/expenses";
import { useAuth } from "../../contexts/auth-context";
import { useLanguage } from "../../contexts/language-context";
import { toast } from "sonner";

interface ExpenseFormProps {
  onClose: () => void;
  onSave: () => void;
  expense?: Expense;
}

export function ExpenseForm({ onClose, onSave, expense }: ExpenseFormProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: expense?.category || expenseCategories[0],
    description: expense?.description || "",
    amount: expense?.amount.toString() || "",
    expenseDate: expense?.expenseDate.split("T")[0] || new Date().toISOString().split("T")[0],
    paymentMethod: expense?.paymentMethod || "efectivo",
    recurring: expense?.recurring || false,
    frequency: expense?.frequency || "mensual",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Debes iniciar sesión para registrar un gasto");
      return;
    }
    
    setLoading(true);
    
    try {
      const expenseData = {
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        expenseDate: new Date(formData.expenseDate).toISOString(),
        paymentMethod: formData.paymentMethod,
        recurring: formData.recurring,
        frequency: formData.recurring ? formData.frequency : undefined,
        userId: user.id,
      };
      
      let success = false;
      
      if (expense) {
        // Actualizar gasto existente
        const updatedExpense = await expensesService.updateExpense(expense.id, expenseData);
        success = !!updatedExpense;
      } else {
        // Crear nuevo gasto
        const newExpense = await expensesService.createExpense(expenseData);
        success = !!newExpense;
      }
      
      if (success) {
        toast.success(expense ? "Gasto actualizado correctamente" : "Gasto registrado correctamente");
        onSave();
      } else {
        toast.error(expense ? "Error al actualizar el gasto" : "Error al registrar el gasto");
      }
    } catch (error) {
      console.error("Error al guardar el gasto:", error);
      toast.error("Error al guardar el gasto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{expense ? "Editar gasto" : "Registrar gasto"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Monto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Fecha
              </label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Método de pago
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
                Gasto recurrente
              </label>
            </div>

            {formData.recurring && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Frecuencia
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Guardando...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </>
                ) : (
                  expense ? "Actualizar" : "Guardar"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
