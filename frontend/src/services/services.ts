import { Service } from '../contexts/app-context';

// Datos de ejemplo para servicios (simulación de base de datos)
const mockServices: Service[] = [
  { 
    id: 1, 
    name: "Corte de cabello", 
    price: 25, 
    duration: 30, 
    category: "Peluquería", 
    description: "Corte de cabello para hombres y mujeres" 
  },
  { 
    id: 2, 
    name: "Manicura", 
    price: 20, 
    duration: 45, 
    category: "Uñas", 
    description: "Manicura básica con esmalte" 
  },
  { 
    id: 3, 
    name: "Pedicura", 
    price: 25, 
    duration: 45, 
    category: "Uñas", 
    description: "Pedicura básica con esmalte" 
  },
  { 
    id: 4, 
    name: "Tinte", 
    price: 50, 
    duration: 90, 
    category: "Peluquería", 
    description: "Tinte de cabello completo" 
  },
  { 
    id: 5, 
    name: "Masaje relajante", 
    price: 40, 
    duration: 60, 
    category: "Masajes", 
    description: "Masaje corporal relajante" 
  },
];

// Simulación de retraso de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Servicio de servicios
export const servicesService = {
  // Obtener todos los servicios
  getServices: async (): Promise<Service[]> => {
    try {
      // Simulamos una llamada a la API
      await delay(500);
      return [...mockServices];
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      throw new Error('No se pudieron cargar los servicios. Por favor, inténtalo de nuevo.');
    }
  },

  // Obtener un servicio por ID
  getServiceById: async (id: number): Promise<Service> => {
    try {
      // Simulamos una llamada a la API
      await delay(300);
      const service = mockServices.find(s => s.id === id);
      
      if (!service) {
        throw new Error(`Servicio con ID ${id} no encontrado`);
      }
      
      return { ...service };
    } catch (error) {
      console.error(`Error al obtener el servicio con ID ${id}:`, error);
      throw new Error('No se pudo cargar el servicio. Por favor, inténtalo de nuevo.');
    }
  },

  // Crear un nuevo servicio
  createService: async (service: Omit<Service, 'id'>): Promise<Service> => {
    try {
      // Simulamos una llamada a la API
      await delay(700);
      
      // Generamos un nuevo ID (en una API real, esto lo haría el servidor)
      const newId = Math.max(0, ...mockServices.map(s => s.id)) + 1;
      
      const newService: Service = {
        id: newId,
        ...service,
      };
      
      // En una implementación real, esto sería una llamada POST a la API
      mockServices.push(newService);
      
      return { ...newService };
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      throw new Error('No se pudo crear el servicio. Por favor, inténtalo de nuevo.');
    }
  },

  // Actualizar un servicio existente
  updateService: async (id: number, service: Partial<Service>): Promise<Service> => {
    try {
      // Simulamos una llamada a la API
      await delay(600);
      
      const index = mockServices.findIndex(s => s.id === id);
      
      if (index === -1) {
        throw new Error(`Servicio con ID ${id} no encontrado`);
      }
      
      // Actualizamos el servicio en nuestra "base de datos" simulada
      const updatedService = {
        ...mockServices[index],
        ...service,
      };
      
      mockServices[index] = updatedService;
      
      return { ...updatedService };
    } catch (error) {
      console.error(`Error al actualizar el servicio con ID ${id}:`, error);
      throw new Error('No se pudo actualizar el servicio. Por favor, inténtalo de nuevo.');
    }
  },

  // Eliminar un servicio
  deleteService: async (id: number): Promise<void> => {
    try {
      // Simulamos una llamada a la API
      await delay(400);
      
      const index = mockServices.findIndex(s => s.id === id);
      
      if (index === -1) {
        throw new Error(`Servicio con ID ${id} no encontrado`);
      }
      
      // Eliminamos el servicio de nuestra "base de datos" simulada
      mockServices.splice(index, 1);
    } catch (error) {
      console.error(`Error al eliminar el servicio con ID ${id}:`, error);
      throw new Error('No se pudo eliminar el servicio. Por favor, inténtalo de nuevo.');
    }
  },

  // Buscar servicios
  searchServices: async (query: string): Promise<Service[]> => {
    try {
      // Simulamos una llamada a la API
      await delay(300);
      
      // Filtramos los servicios según el término de búsqueda
      return mockServices.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.category.toLowerCase().includes(query.toLowerCase()) ||
        service.description?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error al buscar servicios:', error);
      throw new Error('No se pudieron buscar los servicios. Por favor, inténtalo de nuevo.');
    }
  },
};
