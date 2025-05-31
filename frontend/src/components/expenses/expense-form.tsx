import { useState } from "react";
import { Button } from "../ui/button";
import { Expense, expenseCategories, expensesService } from "../../services/expenses";
import { useAuth } from "../../contexts/auth-context";
import { useLanguage } from "../../contexts/language-context";
import { toast } from "../../lib/toast";

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
      toast.error(t('expenses.loginRequired'));
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
        toast.success(expense ? t('expenses.expenseUpdated') : t('expenses.expenseRegistered'));
        onSave();
      } else {
        toast.error(expense ? t('expenses.updateError') : t('expenses.registerError'));
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error(t('expenses.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{expense ? t('expenses.editExpense') : t('expenses.registerExpense')}</h2>
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
                {t('expenses.category')}
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
                {t('expenses.description')}
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
                {t('expenses.amount')}
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
                {t('common.date')}
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
                {t('expenses.paymentMethod')}
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="efectivo">{t('expenses.paymentMethods.cash')}</option>
                <option value="tarjeta">{t('expenses.paymentMethods.card')}</option>
                <option value="transferencia">{t('expenses.paymentMethods.transfer')}</option>
                <option value="otro">{t('expenses.paymentMethods.other')}</option>
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
                {t('expenses.recurringExpense')}
              </label>
            </div>

            {formData.recurring && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {t('expenses.frequency')}
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="diario">{t('expenses.frequencies.daily')}</option>
                  <option value="semanal">{t('expenses.frequencies.weekly')}</option>
                  <option value="mensual">{t('expenses.frequencies.monthly')}</option>
                  <option value="anual">{t('expenses.frequencies.yearly')}</option>
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
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">{t('common.saving')}</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </>
                ) : (
                  expense ? t('common.update') : t('common.save')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
