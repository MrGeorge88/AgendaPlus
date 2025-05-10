import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { StaffMember } from "../../services/staff";
import { Appointment } from "../../services/appointments";
import { Service } from "../../contexts/app-context";
import { servicesService } from "../../services/services";
import { useAuth } from "../../contexts/auth-context";

interface AppointmentFormProps {
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  staffMembers: StaffMember[];
  date?: Date;
}

export function AppointmentForm({ onClose, onSave, staffMembers, date = new Date() }: AppointmentFormProps) {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Formatear la hora para el input time
  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    serviceId: "",
    clientName: "",
    staffId: staffMembers[0]?.id || "",
    date: date.toISOString().split("T")[0],
    startTime: formatTimeForInput(date),
    endTime: formatTimeForInput(new Date(date.getTime() + 60 * 60 * 1000)), // Por defecto 1 hora después
    price: "",
    status: "confirmed",
  });

  // Cargar servicios
  useEffect(() => {
    const loadServices = async () => {
      if (user) {
        setLoading(true);
        try {
          const data = await servicesService.getServices(user.id);
          setServices(data);
        } catch (error) {
          console.error("Error al cargar servicios:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadServices();
  }, [user]);

  // Calcular la hora de fin basada en la duración del servicio
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
    return formatTimeForInput(endDate);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "serviceId" && value) {
      // Cuando se selecciona un servicio, actualizar título, precio y hora de fin
      const selectedService = services.find(service => service.id === value);
      if (selectedService) {
        const newEndTime = calculateEndTime(formData.startTime, selectedService.duration);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          title: selectedService.name,
          price: selectedService.price.toString(),
          endTime: newEndTime
        }));
        return;
      }
    }

    if (name === "startTime") {
      // Cuando cambia la hora de inicio, recalcular la hora de fin
      const selectedService = services.find(service => service.id === formData.serviceId);
      if (selectedService) {
        const newEndTime = calculateEndTime(value, selectedService.duration);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          endTime: newEndTime
        }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    const staffMember = staffMembers.find(staff => staff.id === formData.staffId);
    const selectedService = services.find(service => service.id === formData.serviceId);

    const appointment = {
      title: formData.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      resourceId: formData.staffId,
      backgroundColor: staffMember?.color || "#4f46e5",
      borderColor: staffMember?.color || "#4f46e5",
      extendedProps: {
        client: formData.clientName,
        service: formData.title,
        price: parseFloat(formData.price) || 0,
        status: formData.status as 'confirmed' | 'pending' | 'cancelled' | 'no-show' | 'scheduled',
        userId: '',
        notes: '',
        serviceId: selectedService?.id || '',
      },
    };

    onSave(appointment);
  };

  return (
    <div>
      <div className="modal-header">
        <h2 className="modal-title">Nueva Cita</h2>
        <button onClick={onClose} className="modal-close">
          ✕
        </button>
      </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Servicio
              </label>
              {loading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                  <span className="text-sm">Cargando servicios...</span>
                </div>
              ) : (
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Seleccionar servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price} - {service.duration} min
                    </option>
                  ))}
                </select>
              )}
              {formData.title && (
                <p className="mt-1 text-sm text-slate-500">
                  {formData.title}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Cliente
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Profesional
              </label>
              <select
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Hora inicio
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Hora fin
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                readOnly={!!formData.serviceId}
                required
              />
              {formData.serviceId && (
                <p className="mt-1 text-xs text-slate-500">
                  Calculado automáticamente según la duración del servicio
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Precio
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-7 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  readOnly={!!formData.serviceId}
                  required
                />
              </div>
              {formData.serviceId && (
                <p className="mt-1 text-xs text-slate-500">
                  Precio del servicio seleccionado
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="confirmed">Confirmada</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelada</option>
              <option value="no-show">No-show</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
            >
              Guardar
            </Button>
          </div>
        </form>
    </div>
  );
}
