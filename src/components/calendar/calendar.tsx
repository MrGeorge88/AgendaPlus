import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { StaffFilter } from "./staff-filter";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { AppointmentForm } from "./appointment-form";

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
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <StaffFilter staff={mockStaff} selectedStaff={selectedStaff} onChange={handleStaffFilterChange} />
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Nueva cita
        </Button>
      </div>
      
      <div className="card">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar={{
            left: "",
            center: "",
            right: "timeGridDay,timeGridWeek",
          }}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          height="auto"
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
            <div className="p-1 text-xs">
              <div className="font-bold">{eventInfo.event.title}</div>
              <div>{eventInfo.event.extendedProps.client}</div>
              <div>{eventInfo.event.extendedProps.price}€</div>
            </div>
          )}
        />
      </div>

      {showForm && (
        <AppointmentForm 
          onClose={() => setShowForm(false)} 
          onSave={handleSaveAppointment} 
          staffMembers={mockStaff}
          date={selectedDate}
        />
      )}
    </div>
  );
}
