import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { StaffFilter } from "./staff-filter";
import { Button } from "../ui/button";
import { Plus, Users, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { AppointmentForm } from "./appointment-form";
import { AppointmentPaymentForm } from "./appointment-payment-form";
import { CollapsibleFilters, FilterState } from "./collapsible-filters";
import { BusinessHoursSettings } from "./business-hours-settings";
import { Modal } from "../ui/modal";
import { useAuth } from "../../contexts/auth-context";
import { useLanguage } from "../../contexts/language-context";
import { useBusinessSettings } from "../../hooks/use-business-settings";
import { staffService, StaffMember } from "../../services/staff";
import { appointmentsService, Appointment } from "../../services/appointments";
import { toast } from "../../lib/toast";

export function Calendar() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { getSlotMinTime, getSlotMaxTime, getHiddenDays, loadBusinessSettings } = useBusinessSettings();
  const navigate = useNavigate();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'timeGridDay' | 'timeGridWeek' | 'timeGridWorkWeek' | 'dayGridMonth'>('timeGridWorkWeek');
  const [showAppointmentActions, setShowAppointmentActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    paymentStatus: [],
    dateRange: { start: null, end: null },
    staff: [],
    priceRange: { min: null, max: null },
  });
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

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Funciones de navegación del calendario
  const handlePrevious = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  const handleStaffManagement = () => {
    navigate('/staff');
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

    // Mostrar el modal de acciones
    setSelectedAppointment(appointment);
    setShowAppointmentActions(true);
  };

  // Funciones para manejar las acciones de las citas
  const handleAppointmentAction = async (action: string) => {
    if (!selectedAppointment || !user) return;

    try {
      switch (action) {
        case "payment": // Registrar pago
          setShowAppointmentActions(false);
          setShowPaymentForm(true);
          break;

        case "complete": // Marcar como completada
          const completedSuccess = await appointmentsService.updateAppointmentStatus(selectedAppointment.id, "completed");
          if (completedSuccess) {
            toast.success(t('notifications.success.appointmentCompleted'));
            setAppointments(prev => prev.map(a =>
              a.id === selectedAppointment.id
                ? {...a, extendedProps: {...a.extendedProps, status: "completed"}}
                : a
            ));
          }
          setShowAppointmentActions(false);
          break;

        case "cancel": // Cancelar cita
          const cancelSuccess = await appointmentsService.updateAppointmentStatus(selectedAppointment.id, "cancelled");
          if (cancelSuccess) {
            toast.success(t('notifications.success.appointmentCancelled'));
            setAppointments(prev => prev.map(a =>
              a.id === selectedAppointment.id
                ? {...a, extendedProps: {...a.extendedProps, status: "cancelled"}}
                : a
            ));
          }
          setShowAppointmentActions(false);
          break;

        case "no-show": // Marcar como no-show
          const noShowSuccess = await appointmentsService.updateAppointmentStatus(selectedAppointment.id, "no-show");
          if (noShowSuccess) {
            toast.success(t('notifications.success.appointmentNoShow'));
            setAppointments(prev => prev.map(a =>
              a.id === selectedAppointment.id
                ? {...a, extendedProps: {...a.extendedProps, status: "no-show"}}
                : a
            ));
          }
          setShowAppointmentActions(false);
          break;

        case "delete": // Mostrar confirmación de eliminación
          setShowAppointmentActions(false);
          setShowDeleteConfirm(true);
          break;

        default:
          setShowAppointmentActions(false);
          break;
      }
    } catch (error) {
      console.error("Error al procesar la acción:", error);
      toast.error(t('notifications.error.processAction'));
      setShowAppointmentActions(false);
    }
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      const deleteSuccess = await appointmentsService.deleteAppointment(selectedAppointment.id);
      if (deleteSuccess) {
        toast.success(t('notifications.success.appointmentDeleted'));
        setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
      }
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      toast.error(t('notifications.error.appointmentDelete'));
    } finally {
      setShowDeleteConfirm(false);
      setSelectedAppointment(null);
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
          toast.success(t('notifications.success.appointmentCreated'));
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      toast.error(t('notifications.error.appointmentCreate'));
    }
  };

  // Manejar cuando se mueve una cita (drag and drop)
  const handleEventDrop = async (dropInfo: any) => {
    try {
      if (!user) return;

      const appointment = appointments.find(a => a.id === dropInfo.event.id);
      if (!appointment) return;

      // Calcular la nueva duración basada en el evento original
      const originalStart = new Date(appointment.start);
      const originalEnd = new Date(appointment.end);
      const duration = originalEnd.getTime() - originalStart.getTime();

      // Nuevas fechas
      const newStart = dropInfo.event.start;
      const newEnd = new Date(newStart.getTime() + duration);

      // Actualizar en Supabase
      const updatedAppointment = {
        ...appointment,
        start: newStart.toISOString(),
        end: newEnd.toISOString()
      };

      const result = await appointmentsService.updateAppointment(updatedAppointment);

      if (result) {
        // Actualizar el estado local
        setAppointments(prev => prev.map(a =>
          a.id === appointment.id
            ? { ...a, start: newStart.toISOString(), end: newEnd.toISOString() }
            : a
        ));
        toast.success(t('notifications.success.appointmentMoved'));
      } else {
        // Revertir el cambio si falló
        dropInfo.revert();
        toast.error(t('notifications.error.appointmentMove'));
      }
    } catch (error) {
      console.error("Error al mover la cita:", error);
      dropInfo.revert();
      toast.error(t('notifications.error.appointmentMove'));
    }
  };

  // Manejar cuando se redimensiona una cita
  const handleEventResize = async (resizeInfo: any) => {
    try {
      if (!user) return;

      const appointment = appointments.find(a => a.id === resizeInfo.event.id);
      if (!appointment) return;

      // Nuevas fechas del evento redimensionado
      const newStart = resizeInfo.event.start;
      const newEnd = resizeInfo.event.end;

      // Actualizar en Supabase
      const updatedAppointment = {
        ...appointment,
        start: newStart.toISOString(),
        end: newEnd.toISOString()
      };

      const result = await appointmentsService.updateAppointment(updatedAppointment);

      if (result) {
        // Actualizar el estado local
        setAppointments(prev => prev.map(a =>
          a.id === appointment.id
            ? { ...a, start: newStart.toISOString(), end: newEnd.toISOString() }
            : a
        ));
        toast.success(t('notifications.success.appointmentDurationUpdated'));
      } else {
        // Revertir el cambio si falló
        resizeInfo.revert();
        toast.error(t('notifications.error.appointmentDuration'));
      }
    } catch (error) {
      console.error("Error al redimensionar la cita:", error);
      resizeInfo.revert();
      toast.error(t('notifications.error.appointmentDuration'));
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

  const filteredEvents = appointments.filter(event => {
    // Filtro por personal seleccionado
    if (!selectedStaff.includes(event.resourceId)) {
      return false;
    }

    // Filtro por estado
    if (filters.status.length > 0 && !filters.status.includes(event.extendedProps.status)) {
      return false;
    }

    // Filtro por estado de pago
    if (filters.paymentStatus.length > 0 && !filters.paymentStatus.includes(event.extendedProps.paymentStatus)) {
      return false;
    }

    // Filtro por personal (filtros avanzados)
    if (filters.staff.length > 0 && !filters.staff.includes(event.resourceId)) {
      return false;
    }

    // Filtro por rango de fechas
    if (filters.dateRange.start || filters.dateRange.end) {
      const eventDate = new Date(event.start);
      if (filters.dateRange.start && eventDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && eventDate > filters.dateRange.end) {
        return false;
      }
    }

    // Filtro por rango de precios
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
      const eventPrice = parseFloat(event.extendedProps.price) || 0;
      if (filters.priceRange.min !== null && eventPrice < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== null && eventPrice > filters.priceRange.max) {
        return false;
      }
    }

    return true;
  });

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
                onClick={() => setShowSettings(true)}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" /> {t('calendar.settings')}
              </Button>
              <Button
                onClick={handleStaffManagement}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Users className="h-4 w-4" /> {t('calendar.manageStaff')}
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1"
                disabled={staffMembers.length === 0}
              >
                <Plus className="h-4 w-4" /> {t('calendar.newAppointment')}
              </Button>
            </div>
          </div>

          {/* Filtros avanzados */}
          <CollapsibleFilters
            onFiltersChange={handleFiltersChange}
            staffMembers={staffMembers.map(staff => ({
              id: staff.id,
              name: staff.name,
              color: staff.color
            }))}
          />
        </>
      )}

      {!loading && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* Controles de navegación personalizados */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleNext}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleToday}
                  variant="outline"
                  size="sm"
                >
                  {t('calendar.today')}
                </Button>
              </div>

              {/* Título dinámico con fecha */}
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-slate-900">
                  {currentDate.toLocaleDateString(language, {
                    year: 'numeric',
                    month: 'long',
                    ...(currentView === 'timeGridDay' && { day: 'numeric' }),
                    ...(currentView === 'timeGridWeek' && { day: 'numeric' })
                  })}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  const calendarApi = calendarRef.current?.getApi();
                  if (calendarApi) {
                    calendarApi.changeView('timeGridDay');
                    setCurrentView('timeGridDay');
                  }
                }}
                variant={currentView === 'timeGridDay' ? 'default' : 'outline'}
                size="sm"
              >
                {t('calendar.day')}
              </Button>
              <Button
                onClick={() => {
                  const calendarApi = calendarRef.current?.getApi();
                  if (calendarApi) {
                    calendarApi.changeView('timeGridWorkWeek');
                    setCurrentView('timeGridWorkWeek');
                  }
                }}
                variant={currentView === 'timeGridWorkWeek' ? 'default' : 'outline'}
                size="sm"
              >
                {t('calendar.workWeek')}
              </Button>
              <Button
                onClick={() => {
                  const calendarApi = calendarRef.current?.getApi();
                  if (calendarApi) {
                    calendarApi.changeView('timeGridWeek');
                    setCurrentView('timeGridWeek');
                  }
                }}
                variant={currentView === 'timeGridWeek' ? 'default' : 'outline'}
                size="sm"
              >
                {t('calendar.fullWeek')}
              </Button>
              <Button
                onClick={() => {
                  const calendarApi = calendarRef.current?.getApi();
                  if (calendarApi) {
                    calendarApi.changeView('dayGridMonth');
                    setCurrentView('dayGridMonth');
                  }
                }}
                variant={currentView === 'dayGridMonth' ? 'default' : 'outline'}
                size="sm"
              >
                {t('calendar.month')}
              </Button>
            </div>
          </div>

          <div className="h-[600px] p-4">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={false}
              slotMinTime={getSlotMinTime()}
              slotMaxTime={getSlotMaxTime()}
              height="100%"
              allDaySlot={currentView === 'dayGridMonth'}
              events={filteredEvents}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={currentView === 'dayGridMonth' ? 3 : true}
              weekends={currentView === 'dayGridMonth'}
              hiddenDays={currentView === 'timeGridWorkWeek' ? [0, 6] : getHiddenDays()}
              nowIndicator={true}
              locale={language}
              firstDay={1}
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
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              datesSet={(dateInfo) => {
                setCurrentDate(dateInfo.start);
              }}
              eventContent={(eventInfo) => {
                // Determinar el color de fondo según el estado
                let statusColor = "";
                let statusIcon = null;
                let textColor = "text-gray-800";

                switch (eventInfo.event.extendedProps.status) {
                  case "completed":
                    statusColor = "bg-green-100 border-l-4 border-green-500";
                    statusIcon = <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />;
                    textColor = "text-green-800";
                    break;
                  case "cancelled":
                    statusColor = "bg-red-100 border-l-4 border-red-500";
                    statusIcon = <XCircle className="h-3 w-3 text-red-600 flex-shrink-0" />;
                    textColor = "text-red-800";
                    break;
                  case "no-show":
                    statusColor = "bg-orange-100 border-l-4 border-orange-500";
                    statusIcon = <AlertCircle className="h-3 w-3 text-orange-600 flex-shrink-0" />;
                    textColor = "text-orange-800";
                    break;
                  default:
                    statusColor = "bg-blue-100 border-l-4 border-blue-500";
                    statusIcon = <Clock className="h-3 w-3 text-blue-600 flex-shrink-0" />;
                    textColor = "text-blue-800";
                }

                // Determinar el badge de estado de pago
                let paymentStatusBadge = null;
                switch (eventInfo.event.extendedProps.paymentStatus) {
                  case "paid":
                    paymentStatusBadge = <span className="text-green-600 font-bold text-xs">✓</span>;
                    break;
                  case "partial":
                    paymentStatusBadge = <span className="text-yellow-600 font-bold text-xs">◐</span>;
                    break;
                  default:
                    paymentStatusBadge = <span className="text-red-600 font-bold text-xs">○</span>;
                }

                // Determinar si es vista mensual para mostrar menos información
                const isMonthView = currentView === 'dayGridMonth';

                return (
                  <div className={`${statusColor} ${textColor} rounded-sm overflow-hidden h-full`}>
                    <div className="p-1.5 h-full flex flex-col justify-between min-h-0">
                      {/* Header con título y estado */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="font-medium text-xs leading-tight truncate flex-1 min-w-0">
                          {eventInfo.event.title}
                        </div>
                        {statusIcon}
                      </div>

                      {/* Información adicional solo si no es vista mensual */}
                      {!isMonthView && (
                        <>
                          <div className="text-xs leading-tight truncate">
                            {eventInfo.event.extendedProps.client}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center text-xs">
                              <DollarSign className="mr-0.5 h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{eventInfo.event.extendedProps.price}</span>
                            </div>
                            {paymentStatusBadge}
                          </div>
                        </>
                      )}

                      {/* Vista mensual: solo mostrar precio y estado de pago */}
                      {isMonthView && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">${eventInfo.event.extendedProps.price}</span>
                          {paymentStatusBadge}
                        </div>
                      )}
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
        title={t('calendar.newAppointment')}
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

      {/* Modal de acciones de cita */}
      <Modal
        isOpen={showAppointmentActions}
        onClose={() => setShowAppointmentActions(false)}
        title={t('appointments.actions')}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            {/* Información de la cita */}
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">{selectedAppointment.title}</h3>
              <p className="text-sm text-slate-600">Cliente: {selectedAppointment.extendedProps.client}</p>
              <p className="text-sm text-slate-600">
                Precio: ${selectedAppointment.extendedProps.price}
              </p>
              <p className="text-sm text-slate-600">
                Estado: <span className="capitalize">{selectedAppointment.extendedProps.status}</span>
              </p>
            </div>

            {/* Botones de acciones */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                onClick={() => handleAppointmentAction("payment")}
                className="flex items-center justify-center gap-2"
                variant="outline"
              >
                <DollarSign className="h-4 w-4" />
                Registrar Pago
              </Button>

              <Button
                onClick={() => handleAppointmentAction("complete")}
                className="flex items-center justify-center gap-2"
                variant="outline"
              >
                <CheckCircle className="h-4 w-4" />
                Marcar Completada
              </Button>

              <Button
                onClick={() => handleAppointmentAction("cancel")}
                className="flex items-center justify-center gap-2"
                variant="outline"
              >
                <XCircle className="h-4 w-4" />
                Cancelar Cita
              </Button>

              <Button
                onClick={() => handleAppointmentAction("no-show")}
                className="flex items-center justify-center gap-2"
                variant="outline"
              >
                <AlertCircle className="h-4 w-4" />
                Marcar No-Show
              </Button>
            </div>

            {/* Botón de eliminar separado */}
            <div className="border-t pt-4">
              <Button
                onClick={() => handleAppointmentAction("delete")}
                className="w-full flex items-center justify-center gap-2"
                variant="destructive"
              >
                <XCircle className="h-4 w-4" />
                Eliminar Cita
              </Button>
            </div>

            {/* Botón de cancelar */}
            <div className="flex justify-end">
              <Button
                onClick={() => setShowAppointmentActions(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('calendar.confirmDelete')}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-medium text-slate-900">
                  ¿Eliminar cita?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-slate-500">
                    ¿Estás seguro de que deseas eliminar la cita <strong>"{selectedAppointment.title}"</strong> con <strong>{selectedAppointment.extendedProps.client}</strong>?
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de configuración de horarios */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={t('calendar.settings')}
        size="lg"
      >
        <BusinessHoursSettings
          onClose={() => setShowSettings(false)}
          onSave={() => {
            // Recargar configuración de horarios
            loadBusinessSettings();
            // Recargar citas si es necesario
            if (user) {
              const loadData = async () => {
                try {
                  const appts = await appointmentsService.getAppointments(user.id);
                  setAppointments(appts);
                } catch (error) {
                  console.error("Error al recargar las citas:", error);
                }
              };
              loadData();
            }
          }}
        />
      </Modal>
    </div>
  );
}
