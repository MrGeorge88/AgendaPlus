import { useState } from "react";
import { Button } from "../ui/button";
import { Appointment, appointmentsService } from "../../services/appointments";
import { useAuth } from "../../contexts/auth-context";
import { useLanguage } from "../../contexts/language-context";
import { toast } from "../../lib/toast";

interface AppointmentPaymentFormProps {
  appointment: Appointment;
  onClose: () => void;
  onPaymentRegistered: () => void;
}

export function AppointmentPaymentForm({ appointment, onClose, onPaymentRegistered }: AppointmentPaymentFormProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const [formData, setFormData] = useState({
    amount: appointment.extendedProps.price.toString(),
    paymentMethod: "efectivo",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes iniciar sesión para registrar un pago");
      return;
    }

    setLoading(true);

    try {
      const success = await appointmentsService.registerPayment(
        appointment.id,
        parseFloat(formData.amount),
        user.id,
        formData.paymentMethod,
        formData.notes
      );

      if (success) {
        toast.success("Pago registrado correctamente");
        onPaymentRegistered();
      } else {
        toast.error("Error al registrar el pago");
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      toast.error("Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentHistory = async () => {
    if (!showPaymentHistory) {
      setLoading(true);
      try {
        const data = await appointmentsService.getAppointmentPayments(appointment.id);
        setPayments(data);
      } catch (error) {
        console.error("Error al cargar el historial de pagos:", error);
        toast.error("Error al cargar el historial de pagos");
      } finally {
        setLoading(false);
      }
    }
    setShowPaymentHistory(!showPaymentHistory);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case "partial":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Parcial</span>;
      case "paid":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pagado</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Registrar pago</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 bg-gray-50 p-3 rounded-md">
            <h3 className="font-medium">{appointment.title}</h3>
            <p className="text-sm text-gray-600">Cliente: {appointment.extendedProps.client}</p>
            <div className="flex justify-between mt-2">
              <p className="text-sm">Precio: <span className="font-medium">${appointment.extendedProps.price}</span></p>
              <p className="text-sm">
                Estado de pago: {getPaymentStatusBadge(appointment.extendedProps.paymentStatus || "pending")}
              </p>
            </div>
            {appointment.extendedProps.totalPaid !== undefined && (
              <p className="text-sm mt-1">
                Pagado: <span className="font-medium">${appointment.extendedProps.totalPaid}</span> de ${appointment.extendedProps.price}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Monto a pagar
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
                  max="10000"
                  className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mt-2 space-y-2">
                <div className="text-xs text-gray-500">
                  <p>Precio del servicio: <span className="font-medium">${appointment.extendedProps.price}</span></p>
                  <p>Puedes registrar descuentos (menor al precio) o propinas (mayor al precio)</p>
                </div>

                {/* Botones de acceso rápido */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, amount: (appointment.extendedProps.price * 0.9).toFixed(2) }))}
                    className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                  >
                    -10% (${(appointment.extendedProps.price * 0.9).toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, amount: appointment.extendedProps.price.toString() }))}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Precio completo (${appointment.extendedProps.price})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, amount: (appointment.extendedProps.price * 1.1).toFixed(2) }))}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    +10% (${(appointment.extendedProps.price * 1.1).toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, amount: (appointment.extendedProps.price * 1.2).toFixed(2) }))}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    +20% (${(appointment.extendedProps.price * 1.2).toFixed(2)})
                  </button>
                </div>
              </div>
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

            <div>
              <label className="block mb-1 text-sm font-medium">
                Notas (opcional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={loadPaymentHistory}
                disabled={loading}
              >
                {showPaymentHistory ? "Ocultar historial" : "Ver historial de pagos"}
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Registrando...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </>
                ) : (
                  "Registrar pago"
                )}
              </Button>
            </div>
          </form>

          {showPaymentHistory && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Historial de pagos</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                </div>
              ) : payments.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.payment_date)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">${payment.amount}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{payment.payment_method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">No hay pagos registrados para esta cita.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
