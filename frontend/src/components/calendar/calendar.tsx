import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { StaffFilter } from "./staff-filter";
import { Button } from "../ui/button";
import { Plus, Users, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { AppointmentForm } from "./appointment-form";
import { AppointmentPaymentForm } from "./appointment-payment-form";
import { Modal } from "../ui/modal";
import { useAuth } from "../../contexts/auth-context";
import { staffService, StaffMember } from "../../services/staff";
import { appointmentsService, Appointment } from "../../services/appointments";
import { toast } from "../../lib/toast";

export function Calendar() {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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
    // Guardar la fecha y hora seleccionada
    const selectedDateTime = new Date(selectInfo.start);
    setSelectedDate(selectedDateTime);
    setShowForm(true);
  };

  const handleEventClick = async (clickInfo: any) => {
    // Encontrar la cita completa en el estado
    const appointment = appointments.find(a => a.id === clickInfo.event.id);
    if (!appointment) return;

    // Mostrar opciones para la cita
    const action = prompt(
      `Cita: ${clickInfo.event.title}\nCliente: ${clickInfo.event.extendedProps.client}\n\nSelecciona una acción:\n1. Registrar pago\n2. Marcar como completada\n3. Cancelar cita\n4. Eliminar cita`
    );

    if (!action) return;

    try {
      if (user) {
        switch (action) {
          case "1": // Registrar pago
            setSelectedAppointment(appointment);
            setShowPaymentForm(true);
            break;

          case "2": // Marcar como completada
            const completedSuccess = await appointmentsService.updateAppointmentStatus(appointment.id, "completed");
            if (completedSuccess) {
              toast.success("Cita marcada como completada");
              // Actualizar la cita en el estado
              setAppointments(prev => prev.map(a =>
                a.id === appointment.id
                  ? {...a, extendedProps: {...a.extendedProps, status: "completed"}}
                  : a
              ));
            }
            break;

          case "3": // Cancelar cita
            const cancelSuccess = await appointmentsService.updateAppointmentStatus(appointment.id, "cancelled");
            if (cancelSuccess) {
              toast.success("Cita cancelada");
              // Actualizar la cita en el estado
              setAppointments(prev => prev.map(a =>
                a.id === appointment.id
                  ? {...a, extendedProps: {...a.extendedProps, status: "cancelled"}}
                  : a
              ));
            }
            break;

          case "4": // Eliminar cita
            if (confirm(`¿Estás seguro de que deseas eliminar la cita '${clickInfo.event.title}'?`)) {
              const deleteSuccess = await appointmentsService.deleteAppointment(clickInfo.event.id);
              if (deleteSuccess) {
                toast.success("Cita eliminada");
                clickInfo.event.remove();
                setAppointments(prev => prev.filter(a => a.id !== clickInfo.event.id));
              }
            }
            break;

          default:
            break;
        }
      }
    } catch (error) {
      console.error("Error al procesar la acción:", error);
      toast.error("Error al procesar la acción");
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
          toast.success("Cita creada correctamente");
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      toast.error("Error al guardar la cita");
    }
  };

  const handlePaymentRegistered = async () => {
    setShowPaymentForm(false);

    // Recargar las citas para obtener el estado actualizado
    if (user) {
      try {
        const appts = await appointmentsService.getAppointments(user.id);
        setAppointments(appts);
        toast.success("Pago registrado correctamente");
      } catch (error) {
        console.error("Error al recargar las citas:", error);
      }
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
              {staffMembers.length > 0 ? (
                staffMembers.map((staffMember) => {
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
                })
              ) : (
                <div className="text-sm text-slate-500">
                  No hay personal disponible. Por favor, añade personal primero.
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.href = '/staff'}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Users className="h-4 w-4" /> Gestionar personal
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1"
                disabled={staffMembers.length === 0}
              >
                <Plus className="h-4 w-4" /> Nueva cita
              </Button>
            </div>
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
              eventContent={(eventInfo) => {
                // Determinar el color de fondo según el estado
                let statusColor = "";
                let statusIcon = null;

                switch (eventInfo.event.extendedProps.status) {
                  case "completed":
                    statusColor = "bg-green-100";
                    statusIcon = <CheckCircle className="h-3 w-3 text-green-600" />;
                    break;
                  case "cancelled":
                    statusColor = "bg-red-100";
                    statusIcon = <XCircle className="h-3 w-3 text-red-600" />;
                    break;
                  case "no-show":
                    statusColor = "bg-orange-100";
                    statusIcon = <AlertCircle className="h-3 w-3 text-orange-600" />;
                    break;
                  default:
                    statusColor = "bg-blue-100";
                    statusIcon = <Clock className="h-3 w-3 text-blue-600" />;
                }

                // Determinar el color del estado de pago
                let paymentStatusBadge = null;

                switch (eventInfo.event.extendedProps.paymentStatus) {
                  case "paid":
                    paymentStatusBadge = <span className="ml-1 rounded-full bg-green-100 px-1 text-[10px] text-green-600">Pagado</span>;
                    break;
                  case "partial":
                    paymentStatusBadge = <span className="ml-1 rounded-full bg-yellow-100 px-1 text-[10px] text-yellow-600">Parcial</span>;
                    break;
                  default:
                    paymentStatusBadge = <span className="ml-1 rounded-full bg-gray-100 px-1 text-[10px] text-gray-600">Pendiente</span>;
                }

                return (
                  <div className={`p-1.5 text-xs ${statusColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{eventInfo.event.title}</div>
                      {statusIcon}
                    </div>
                    <div>{eventInfo.event.extendedProps.client}</div>
                    <div className="flex items-center">
                      <DollarSign className="mr-0.5 h-3 w-3" />
                      {eventInfo.event.extendedProps.price}
                      {paymentStatusBadge}
                    </div>
                  </div>
                );
              }}
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

      {showPaymentForm && selectedAppointment && (
        <AppointmentPaymentForm
          appointment={selectedAppointment}
          onClose={() => setShowPaymentForm(false)}
          onPaymentRegistered={handlePaymentRegistered}
        />
      )}
    </div>
  );
}
