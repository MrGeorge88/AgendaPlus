import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types for our state
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit?: string;
  totalSpent?: number;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialty: string;
  color: string;
  avatar?: string;
}

export interface Appointment {
  id: number;
  title: string;
  start: string;
  end: string;
  resourceId: number;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    client: string;
    service: string;
    price: number;
    status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  };
}

// Define the state shape
interface AppState {
  clients: Client[];
  services: Service[];
  staff: StaffMember[];
  appointments: Appointment[];
  isLoading: {
    clients: boolean;
    services: boolean;
    staff: boolean;
    appointments: boolean;
  };
  error: string | null;
}

// Define action types
type AppAction =
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: number }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: number }
  | { type: 'SET_STAFF'; payload: StaffMember[] }
  | { type: 'ADD_STAFF'; payload: StaffMember }
  | { type: 'UPDATE_STAFF'; payload: StaffMember }
  | { type: 'DELETE_STAFF'; payload: number }
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: number }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['isLoading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null };

// Define the initial state
const initialState: AppState = {
  clients: [],
  services: [],
  staff: [],
  appointments: [],
  isLoading: {
    clients: false,
    services: false,
    staff: false,
    appointments: false,
  },
  error: null,
};

// Create the reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter((client) => client.id !== action.payload),
      };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        ),
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
      };
    case 'SET_STAFF':
      return { ...state, staff: action.payload };
    case 'ADD_STAFF':
      return { ...state, staff: [...state.staff, action.payload] };
    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map((member) =>
          member.id === action.payload.id ? action.payload : member
        ),
      };
    case 'DELETE_STAFF':
      return {
        ...state,
        staff: state.staff.filter((member) => member.id !== action.payload),
      };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map((appointment) =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter((appointment) => appointment.id !== action.payload),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Create the context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Create a custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
