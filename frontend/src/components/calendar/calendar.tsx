import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { StaffFilter } from "./staff-filter";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { AppointmentForm } from "./appointment-form";
import { Modal } from "../ui/modal";

// Mock data for staff members
const mockStaff = [
  { id: 1, name: "Ana García", color: "#4f46e5", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Carlos Rodríguez", color: "#ec4899", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Elena Martínez", color: "#10b981", avatar: "https://i.pravatar.cc/150?img=3" },
];

// Mock data for appointments
const mockAppointments = [
  {
    id: "1",
    title: "Corte de cabello",
    start: "2023-05-01T10:00:00",
    end: "2023-05-01T11:00:00",
    resourceId: 1,
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
    extendedProps: {
      client: "Juan Pérez",
      service: "Corte de cabello",
      price: 25,
      status: "confirmed",
    },
  },
  {
    id: "2",
    title: "Manicura",
    start: "2023-05-01T11:30:00",
    end: "2023-05-01T12:30:00",
    resourceId: 2,
    backgroundColor: "#ec4899",
    borderColor: "#ec4899",
    extendedProps: {
      client: "María López",
      service: "Manicura",
      price: 20,
      status: "confirmed",
    },
  },
];

export function Calendar() {
  const [selectedStaff, setSelectedStaff] = useState<number[]>(mockStaff.map(staff => staff.id));
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const calendarRef = useRef<any>(null);

  const handleStaffFilterChange = (staffId: number) => {
    setSelectedStaff(prev => {
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setShowForm(true);
  };

  const handleEventClick = (clickInfo: any) => {
    if (confirm(`¿Deseas eliminar la cita '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      setAppointments(prev => prev.filter(appointment => appointment.id !== clickInfo.event.id));
    }
  };

  const handleSaveAppointment = (appointment: any) => {
    const newAppointment = {
      ...appointment,
      id: String(appointments.length + 1),
    };

    setAppointments(prev => [...prev, newAppointment]);
    setShowForm(false);
  };

  const filteredEvents = appointments.filter(event =>
    selectedStaff.includes(event.resourceId)
  );

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', gap: '8px'}}>
          {mockStaff.map((staffMember) => {
            const isSelected = selectedStaff.includes(staffMember.id);
            return (
              <button
                key={staffMember.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: isSelected ? staffMember.color : 'transparent',
                  color: isSelected ? 'white' : '#64748b',
                  border: isSelected ? 'none' : `1px solid ${staffMember.color}`,
                  cursor: 'pointer'
                }}
                onClick={() => handleStaffFilterChange(staffMember.id)}
              >
                <img
                  src={staffMember.avatar}
                  alt={staffMember.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    marginRight: '8px'
                  }}
                />
                <span>{staffMember.name}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          style={{display: 'flex', alignItems: 'center', gap: '4px'}}
        >
          <Plus style={{width: '16px', height: '16px'}} /> Nueva cita
        </button>
      </div>

      <div className="card" style={{padding: '0'}}>
        <div style={{height: '600px', padding: '16px'}}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={{
              left: "",
              center: "title",
              right: "timeGridDay,timeGridWeek",
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            height="100%"
            allDaySlot={false}
            events={filteredEvents}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            locale="es"
            buttonText={{
              day: "Día",
              week: "Semana",
            }}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
            }}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: false,
            }}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => (
              <div style={{padding: '4px', fontSize: '12px'}}>
                <div style={{fontWeight: 'bold'}}>{eventInfo.event.title}</div>
                <div>{eventInfo.event.extendedProps.client}</div>
                <div>{eventInfo.event.extendedProps.price}€</div>
              </div>
            )}
          />
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nueva Cita"
      >
        <AppointmentForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveAppointment}
          staffMembers={mockStaff}
          date={selectedDate}
        />
      </Modal>
    </div>
  );
}
