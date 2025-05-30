# 🛠️ GUÍA DE IMPLEMENTACIÓN - AGENDAPLUS

## ✅ **PROGRESO COMPLETADO**

### **✅ SPRINT 1 COMPLETADO (Días 1-7)**

#### **✅ 1. Limpieza de Datos Mock - COMPLETADO**
- ✅ Eliminados archivos con datos mock:
  - `src/pages/services.tsx` (datos mock)
  - `src/pages/income.tsx` (datos mock)
- ✅ Actualizado `src/services/api.ts` (marcado como deprecated)
- ✅ Implementado `backend/src/modules/services/services.service.ts` con Supabase real

#### **✅ 2. Componentes y Hooks Creados - COMPLETADO**
- ✅ `frontend/src/components/ui/skeleton.tsx` - Sistema completo de skeletons
- ✅ `frontend/src/hooks/useAsyncState.ts` - Hooks para estado asíncrono
- ✅ `frontend/src/hooks/useNotifications.ts` - Sistema de notificaciones
- ✅ `frontend/src/components/ui/error-boundary.tsx` - Manejo de errores
- ✅ Página de servicios completamente refactorizada

#### **✅ 3. Dependencias Instaladas - COMPLETADO**
- ✅ `sonner` instalado correctamente

## 🎯 **TAREAS INMEDIATAS EN PROGRESO**

### **✅ Día 8: Implementación de Sonner - COMPLETADO**
- ✅ Instalado `sonner` correctamente
- ✅ Actualizado `frontend/src/hooks/useNotifications.ts` para usar Sonner
- ✅ Configurado `Toaster` en `frontend/src/App.tsx`
- ✅ Integrado `ErrorBoundary` global en la aplicación

### **✅ Día 9: Estados Vacíos y Componentes - COMPLETADO**
- ✅ Creado `frontend/src/components/ui/empty-state.tsx` con estados vacíos específicos
- ✅ Componentes: EmptyClients, EmptyServices, EmptyStaff, EmptyAppointments, etc.
- ✅ Hook `useEmptyState` para determinar qué estado mostrar

### **✅ Día 10: Actualización de Páginas - COMPLETADO**
- ✅ Actualizada página de Clientes con nuevos hooks y componentes
- ✅ Actualizada página de Staff con nuevos hooks y componentes
- ✅ Actualizada página de Income con nuevos hooks y componentes
- ✅ Creado `frontend/src/hooks/useFormValidation.ts` para validación avanzada

### **✅ TAREAS INMEDIATAS COMPLETADAS**
- ✅ **Sonner implementado**: Sistema de notificaciones moderno funcionando
- ✅ **Estados vacíos creados**: Componentes específicos para cada sección
- ✅ **Páginas actualizadas**: Clients, Staff, Income usando nuevos hooks
- ✅ **Validación de formularios**: Sistema robusto de validación creado

## 🎯 **SPRINT 2: UX BÁSICA (Días 11-14)**

### **Día 11: Validación de Formularios Mejorada**

#### **2. Implementar Estados de Carga Consistentes**
```typescript
// Crear hook personalizado para estados de carga
export const useAsyncState = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};
```

#### **3. Mejorar Manejo de Errores**
```typescript
// Error boundary global
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    // Enviar a servicio de monitoreo (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

### **Día 4-7: Mejoras de UX Inmediatas**

#### **1. Componente de Notificaciones Mejorado**
```typescript
// Sistema de notificaciones con Sonner
import { toast } from 'sonner';

export const useNotifications = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: 6000,
      position: 'top-right',
      action: {
        label: 'Reintentar',
        onClick: () => window.location.reload()
      },
      ...options
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: 'top-right'
    });
  };

  return { showSuccess, showError, showLoading };
};
```

#### **2. Skeleton Components**
```typescript
// Componente Skeleton reutilizable
export const Skeleton = ({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-700',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded',
        variant === 'text' && 'rounded h-4',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

// Skeleton para lista de citas
export const AppointmentListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
        <Skeleton width={80} height={32} />
      </div>
    ))}
  </div>
);
```

### **Día 8-14: Optimización de Datos**

#### **1. Implementar React Query**
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```typescript
// Configuración de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

// Hook para citas
export const useAppointments = (userId: string) => {
  return useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => appointmentsService.getAppointments(userId),
    enabled: !!userId,
  });
};

// Hook para crear cita
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita creada exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al crear cita: ${error.message}`);
    },
  });
};
```

#### **2. Optimización de Supabase**
```typescript
// Configuración optimizada de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Subscripción en tiempo real para citas
export const useRealtimeAppointments = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel('appointments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, queryClient]);
};
```

## 🎨 MEJORAS DE UI/UX ESPECÍFICAS

### **1. Calendario Mejorado**
```typescript
// Configuración avanzada de FullCalendar
const calendarConfig = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin],
  initialView: 'resourceTimelineWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'resourceTimelineDay,resourceTimelineWeek,dayGridMonth'
  },
  resources: staff.map(member => ({
    id: member.id,
    title: member.name,
    eventColor: member.color
  })),
  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',
  slotDuration: '00:15:00',
  snapDuration: '00:15:00',
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    startTime: '09:00',
    endTime: '18:00'
  },
  selectConstraint: 'businessHours',
  eventConstraint: 'businessHours',
  locale: 'es',
  timeZone: 'local',
  nowIndicator: true,
  scrollTime: '09:00:00',
  height: 'auto',
  contentHeight: 600,
  aspectRatio: 1.8
};
```

### **2. Formularios Avanzados**
```typescript
// Hook de formulario con validación
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: ValidationSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback((fieldName?: keyof T) => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    const fieldsToValidate = fieldName ? [fieldName] : Object.keys(validationSchema);

    fieldsToValidate.forEach(field => {
      const fieldKey = field as keyof T;
      const rules = validationSchema[fieldKey];
      const value = values[fieldKey];

      for (const rule of rules) {
        if (!rule.validate(value, values)) {
          newErrors[fieldKey] = rule.message;
          break;
        }
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTimeout(() => validate(field), 100);
    }
  }, [touched, validate]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate(field);
  }, [validate]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate: () => validate(),
    isValid: Object.keys(errors).length === 0,
    reset: () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    }
  };
};
```

### **3. Componente DataTable Avanzado**
```typescript
// DataTable con filtros, ordenamiento y paginación
export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination = true,
  sorting = true,
  filtering = true,
  onRowClick,
  emptyState
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtrado
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key]?.toString().toLowerCase() || '';
        return itemValue.includes(value.toLowerCase());
      });
    });
  }, [data, filters]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  if (loading) {
    return <DataTableSkeleton columns={columns} rows={pageSize} />;
  }

  if (data.length === 0) {
    return emptyState || <DefaultEmptyState />;
  }

  return (
    <div className="space-y-4">
      {filtering && (
        <DataTableFilters
          columns={columns}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={column.key}
                  className={cn(
                    sorting && column.sortable && 'cursor-pointer hover:bg-slate-50',
                    column.className
                  )}
                  onClick={() => {
                    if (sorting && column.sortable) {
                      setSortConfig(prev => ({
                        key: column.key,
                        direction: prev?.key === column.key && prev.direction === 'asc' ? 'desc' : 'asc'
                      }));
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {sorting && column.sortable && (
                      <SortIcon
                        direction={sortConfig?.key === column.key ? sortConfig.direction : null}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id || index}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-slate-50',
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map(column => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <DataTablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
};
```

## 📱 OPTIMIZACIÓN MÓVIL

### **1. Responsive Sidebar**
```typescript
// Sidebar adaptativo
export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {!isMobile && (
        <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white">
          <SidebarContent />
        </aside>
      )}
    </>
  );
};
```

### **2. Touch Gestures para Calendario**
```typescript
// Gestos táctiles para el calendario
const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
```

## 🔧 HERRAMIENTAS DE DESARROLLO

### **1. Configuración de Storybook**
```bash
npx storybook@latest init
```

### **2. Configuración de Testing**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @playwright/test
```

### **3. Configuración de Monitoreo**
```bash
npm install @sentry/react @sentry/tracing
```

---

**Esta guía proporciona pasos concretos y código específico para implementar las mejoras más críticas en las próximas 2 semanas.**
