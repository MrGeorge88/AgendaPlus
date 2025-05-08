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
    <div>
      <div className="modal-header">
        <h2 className="modal-title">Nueva Cita</h2>
        <button onClick={onClose} className="modal-close">
          ✕
        </button>
      </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Servicio
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Cliente
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Profesional
              </label>
              <select
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
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
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Hora inicio
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Hora fin
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              required
            >
              <option value="confirmed">Confirmada</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelada</option>
              <option value="no-show">No-show</option>
            </select>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Guardar
            </button>
          </div>
        </form>
    </div>
  );
}
