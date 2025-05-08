import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface AppointmentFormProps {
  onClose: () => void;
  onSave: (appointment: any) => void;
  staffMembers: any[];
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
    
    const appointment = {
      title: formData.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      resourceId: parseInt(formData.staffId.toString()),
      backgroundColor: staffMembers.find(staff => staff.id === parseInt(formData.staffId.toString()))?.color || "#4f46e5",
      borderColor: staffMembers.find(staff => staff.id === parseInt(formData.staffId.toString()))?.color || "#4f46e5",
      extendedProps: {
        client: formData.clientName,
        service: formData.title,
        price: parseFloat(formData.price),
        status: formData.status,
      },
    };
    
    onSave(appointment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Nueva Cita</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Servicio</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Cliente</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Profesional</label>
            <select
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2"
              required
            >
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2"
              required
            />
          </div>
          
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Hora inicio</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 p-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Hora fin</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 p-2"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2"
              required
            >
              <option value="confirmed">Confirmada</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelada</option>
              <option value="no-show">No-show</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
