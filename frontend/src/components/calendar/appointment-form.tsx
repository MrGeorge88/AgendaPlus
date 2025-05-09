import { useState } from "react";
import { Button } from "../ui/button";
import { StaffMember } from "../../services/staff";
import { Appointment } from "../../services/appointments";

interface AppointmentFormProps {
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  staffMembers: StaffMember[];
  date?: Date;
}

export function AppointmentForm({ onClose, onSave, staffMembers, date = new Date() }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    staffId: staffMembers[0]?.id || "",
    date: date.toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    price: "",
    status: "confirmed",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    const staffMember = staffMembers.find(staff => staff.id === formData.staffId);

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
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
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
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
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
