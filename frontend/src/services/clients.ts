import { Client } from '../contexts/app-context';

// Datos de ejemplo para clientes (simulación de base de datos)
const mockClients: Client[] = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890", lastVisit: "2023-04-15", totalSpent: 150, notes: "Cliente habitual" },
  { id: 2, name: "María López", email: "maria@example.com", phone: "123-456-7891", lastVisit: "2023-04-20", totalSpent: 200, notes: "Prefiere citas por la tarde" },
  { id: 3, name: "Carlos Gómez", email: "carlos@example.com", phone: "123-456-7892", lastVisit: "2023-04-25", totalSpent: 100, notes: "" },
  { id: 4, name: "Ana Martínez", email: "ana@example.com", phone: "123-456-7893", lastVisit: "2023-04-30", totalSpent: 300, notes: "Alérgica a ciertos productos" },
  { id: 5, name: "Pedro Sánchez", email: "pedro@example.com", phone: "123-456-7894", lastVisit: "2023-05-01", totalSpent: 250, notes: "" },
];

// Simulación de retraso de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Servicio de clientes
export const clientsService = {
  // Obtener todos los clientes
  getClients: async (): Promise<Client[]> => {
    try {
      // Simulamos una llamada a la API
      await delay(500);
      return [...mockClients];
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw new Error('No se pudieron cargar los clientes. Por favor, inténtalo de nuevo.');
    }
  },

  // Obtener un cliente por ID
  getClientById: async (id: number): Promise<Client> => {
    try {
      // Simulamos una llamada a la API
      await delay(300);
      const client = mockClients.find(c => c.id === id);
      
      if (!client) {
        throw new Error(`Cliente con ID ${id} no encontrado`);
      }
      
      return { ...client };
    } catch (error) {
      console.error(`Error al obtener el cliente con ID ${id}:`, error);
      throw new Error('No se pudo cargar el cliente. Por favor, inténtalo de nuevo.');
    }
  },

  // Crear un nuevo cliente
  createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    try {
      // Simulamos una llamada a la API
      await delay(700);
      
      // Generamos un nuevo ID (en una API real, esto lo haría el servidor)
      const newId = Math.max(0, ...mockClients.map(c => c.id)) + 1;
      
      const newClient: Client = {
        id: newId,
        ...client,
        lastVisit: client.lastVisit || 'Nunca',
        totalSpent: client.totalSpent || 0,
      };
      
      // En una implementación real, esto sería una llamada POST a la API
      mockClients.push(newClient);
      
      return { ...newClient };
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      throw new Error('No se pudo crear el cliente. Por favor, inténtalo de nuevo.');
    }
  },

  // Actualizar un cliente existente
  updateClient: async (id: number, client: Partial<Client>): Promise<Client> => {
    try {
      // Simulamos una llamada a la API
      await delay(600);
      
      const index = mockClients.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error(`Cliente con ID ${id} no encontrado`);
      }
      
      // Actualizamos el cliente en nuestra "base de datos" simulada
      const updatedClient = {
        ...mockClients[index],
        ...client,
      };
      
      mockClients[index] = updatedClient;
      
      return { ...updatedClient };
    } catch (error) {
      console.error(`Error al actualizar el cliente con ID ${id}:`, error);
      throw new Error('No se pudo actualizar el cliente. Por favor, inténtalo de nuevo.');
    }
  },

  // Eliminar un cliente
  deleteClient: async (id: number): Promise<void> => {
    try {
      // Simulamos una llamada a la API
      await delay(400);
      
      const index = mockClients.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error(`Cliente con ID ${id} no encontrado`);
      }
      
      // Eliminamos el cliente de nuestra "base de datos" simulada
      mockClients.splice(index, 1);
    } catch (error) {
      console.error(`Error al eliminar el cliente con ID ${id}:`, error);
      throw new Error('No se pudo eliminar el cliente. Por favor, inténtalo de nuevo.');
    }
  },

  // Buscar clientes
  searchClients: async (query: string): Promise<Client[]> => {
    try {
      // Simulamos una llamada a la API
      await delay(300);
      
      // Filtramos los clientes según el término de búsqueda
      return mockClients.filter(client =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.email.toLowerCase().includes(query.toLowerCase()) ||
        client.phone.includes(query)
      );
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      throw new Error('No se pudieron buscar los clientes. Por favor, inténtalo de nuevo.');
    }
  },
};
