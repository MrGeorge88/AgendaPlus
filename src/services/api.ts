import { supabase } from '../lib/supabase';

/**
 * @deprecated Este archivo contiene datos mock y será eliminado.
 * Usar los servicios específicos en su lugar:
 * - frontend/src/services/services.ts para servicios
 * - frontend/src/services/clients.ts para clientes
 * - frontend/src/services/staff.ts para personal
 * - frontend/src/services/appointments.ts para citas
 */

// Tipos
export interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: number;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    client: string;
    service: string;
    price: number;
    status: string;
  };
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalSpent: number;
  appointmentsCount: number;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  cost: number;
  margin: number;
  marginPercentage: number;
  category: string;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  color: string;
  avatar: string;
  appointmentsCount: number;
  revenue: number;
}

// Servicios de API

// Citas
export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('appointments').select('*');
    // if (error) throw error;
    // return data;

    // Por ahora, devolvemos datos de ejemplo
    return [
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
  },

  create: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('appointments').insert(appointment).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la creación
    return {
      ...appointment,
      id: Math.random().toString(36).substring(2, 9),
    };
  },

  update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('appointments').update(appointment).eq('id', id).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la actualización
    return {
      ...appointment,
      id,
    } as Appointment;
  },

  delete: async (id: string): Promise<void> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { error } = await supabase.from('appointments').delete().eq('id', id);
    // if (error) throw error;

    // Por ahora, no hacemos nada
  },
};

// Clientes
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('clients').select('*');
    // if (error) throw error;
    // return data;

    // Por ahora, devolvemos datos de ejemplo
    return [
      {
        id: 1,
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        phone: "+34 612 345 678",
        lastVisit: "2023-04-15",
        totalSpent: 125,
        appointmentsCount: 5,
      },
      {
        id: 2,
        name: "María López",
        email: "maria.lopez@example.com",
        phone: "+34 623 456 789",
        lastVisit: "2023-04-28",
        totalSpent: 80,
        appointmentsCount: 3,
      },
      {
        id: 3,
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@example.com",
        phone: "+34 634 567 890",
        lastVisit: "2023-05-01",
        totalSpent: 210,
        appointmentsCount: 8,
      },
      {
        id: 4,
        name: "Ana Martínez",
        email: "ana.martinez@example.com",
        phone: "+34 645 678 901",
        lastVisit: "2023-04-10",
        totalSpent: 65,
        appointmentsCount: 2,
      },
      {
        id: 5,
        name: "David García",
        email: "david.garcia@example.com",
        phone: "+34 656 789 012",
        lastVisit: "2023-04-22",
        totalSpent: 150,
        appointmentsCount: 6,
      },
    ];
  },

  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('clients').insert(client).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la creación
    return {
      ...client,
      id: Math.floor(Math.random() * 1000),
    };
  },

  update: async (id: number, client: Partial<Client>): Promise<Client> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('clients').update(client).eq('id', id).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la actualización
    return {
      ...client,
      id,
    } as Client;
  },

  delete: async (id: number): Promise<void> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { error } = await supabase.from('clients').delete().eq('id', id);
    // if (error) throw error;

    // Por ahora, no hacemos nada
  },
};

// Servicios
export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('services').select('*');
    // if (error) throw error;
    // return data;

    // Por ahora, devolvemos datos de ejemplo
    return [
      {
        id: 1,
        name: "Corte de cabello",
        duration: 60,
        price: 25,
        cost: 10,
        margin: 15,
        marginPercentage: 60,
        category: "Peluquería",
      },
      {
        id: 2,
        name: "Manicura",
        duration: 45,
        price: 20,
        cost: 8,
        margin: 12,
        marginPercentage: 60,
        category: "Uñas",
      },
      {
        id: 3,
        name: "Pedicura",
        duration: 60,
        price: 30,
        cost: 12,
        margin: 18,
        marginPercentage: 60,
        category: "Uñas",
      },
      {
        id: 4,
        name: "Tinte",
        duration: 120,
        price: 50,
        cost: 25,
        margin: 25,
        marginPercentage: 50,
        category: "Peluquería",
      },
      {
        id: 5,
        name: "Masaje relajante",
        duration: 90,
        price: 60,
        cost: 20,
        margin: 40,
        marginPercentage: 66.7,
        category: "Masajes",
      },
    ];
  },

  create: async (service: Omit<Service, 'id'>): Promise<Service> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('services').insert(service).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la creación
    return {
      ...service,
      id: Math.floor(Math.random() * 1000),
    };
  },

  update: async (id: number, service: Partial<Service>): Promise<Service> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('services').update(service).eq('id', id).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la actualización
    return {
      ...service,
      id,
    } as Service;
  },

  delete: async (id: number): Promise<void> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { error } = await supabase.from('services').delete().eq('id', id);
    // if (error) throw error;

    // Por ahora, no hacemos nada
  },
};

// Profesionales
export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('staff').select('*');
    // if (error) throw error;
    // return data;

    // Por ahora, devolvemos datos de ejemplo
    return [
      {
        id: 1,
        name: "Ana García",
        email: "ana.garcia@example.com",
        phone: "+34 612 345 678",
        role: "Estilista",
        color: "#4f46e5",
        avatar: "https://i.pravatar.cc/150?img=1",
        appointmentsCount: 120,
        revenue: 3000,
      },
      {
        id: 2,
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@example.com",
        phone: "+34 623 456 789",
        role: "Manicurista",
        color: "#ec4899",
        avatar: "https://i.pravatar.cc/150?img=2",
        appointmentsCount: 85,
        revenue: 1700,
      },
      {
        id: 3,
        name: "Elena Martínez",
        email: "elena.martinez@example.com",
        phone: "+34 634 567 890",
        role: "Masajista",
        color: "#10b981",
        avatar: "https://i.pravatar.cc/150?img=3",
        appointmentsCount: 95,
        revenue: 5700,
      },
    ];
  },

  create: async (staff: Omit<Staff, 'id'>): Promise<Staff> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('staff').insert(staff).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la creación
    return {
      ...staff,
      id: Math.floor(Math.random() * 1000),
    };
  },

  update: async (id: number, staff: Partial<Staff>): Promise<Staff> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { data, error } = await supabase.from('staff').update(staff).eq('id', id).select();
    // if (error) throw error;
    // return data[0];

    // Por ahora, simulamos la actualización
    return {
      ...staff,
      id,
    } as Staff;
  },

  delete: async (id: number): Promise<void> => {
    // En una implementación real, esto sería una llamada a Supabase
    // const { error } = await supabase.from('staff').delete().eq('id', id);
    // if (error) throw error;

    // Por ahora, no hacemos nada
  },
};
