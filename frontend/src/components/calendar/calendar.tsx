import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { StaffFilter } from "./staff-filter";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { AppointmentForm } from "./appointment-form";
import { Modal } from "../ui/modal";
import { useAuth } from "../../contexts/auth-context";
import { staffService, StaffMember } from "../../services/staff";
import { appointmentsService, Appointment } from "../../services/appointments";

export function Calendar() {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<any>(null);

  // Cargar datos del personal y citas
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        try {
          // Cargar personal
          const staff = await staffService.getStaffMembers(user.id);
          setStaffMembers(staff);
          setSelectedStaff(staff.map(s => s.id));

          // Cargar citas
          const appts = await appointmentsService.getAppointments(user.id);
          setAppointments(appts);
        } catch (error) {
          console.error("Error al cargar datos:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user]);

  const handleStaffFilterChange = (staffId: string) => {
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

  const handleEventClick = async (clickInfo: any) => {
    if (confirm(`¿Deseas eliminar la cita '${clickInfo.event.title}'?`)) {
      try {
        // Eliminar la cita de Supabase
        if (user) {
          const success = await appointmentsService.deleteAppointment(clickInfo.event.id);
          if (success) {
            clickInfo.event.remove();
            setAppointments(prev => prev.filter(appointment => appointment.id !== clickInfo.event.id));
          }
        }
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
      }
    }
  };

  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      if (user) {
        // Preparar los datos de la cita
        const newAppointmentData = {
          ...appointmentData,
          extendedProps: {
            ...appointmentData.extendedProps,
            userId: user.id
          }
        };

        // Guardar la cita en Supabase
        const newAppointment = await appointmentsService.createAppointment(newAppointmentData, user.id);

        if (newAppointment) {
          setAppointments(prev => [...prev, newAppointment]);
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  };

  const filteredEvents = appointments.filter(event =>
    selectedStaff.includes(event.resourceId)
  );

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {staffMembers.map((staffMember) => {
                const isSelected = selectedStaff.includes(staffMember.id);
                return (
                  <button
                    key={staffMember.id}
                    className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-colors ${
                      isSelected
                        ? 'text-white'
                        : 'text-slate-600 border'
                    }`}
                    style={{
                      backgroundColor: isSelected ? staffMember.color : 'transparent',
                      borderColor: isSelected ? 'transparent' : staffMember.color
                    }}
                    onClick={() => handleStaffFilterChange(staffMember.id)}
                  >
                    <img
                      src={staffMember.avatar}
                      alt={staffMember.name}
                      className="mr-2 h-5 w-5 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staffMember.name)}&background=random`;
                      }}
                    />
                    <span>{staffMember.name}</span>
                  </button>
                );
              })}
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Nueva cita
            </Button>
          </div>
        </>
      )}

      {!loading && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="h-[600px] p-4">
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
                <div className="p-1.5 text-xs">
                  <div className="font-medium">{eventInfo.event.title}</div>
                  <div>{eventInfo.event.extendedProps.client}</div>
                  <div>{eventInfo.event.extendedProps.price}€</div>
                </div>
              )}
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nueva Cita"
      >
        <AppointmentForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveAppointment}
          staffMembers={staffMembers}
          date={selectedDate}
        />
      </Modal>
    </div>
  );
}
