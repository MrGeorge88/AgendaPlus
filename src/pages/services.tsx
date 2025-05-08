import { useState } from "react";
import { Layout } from "../components/layout/layout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Search, Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react";

// Mock data for services
const mockServices = [
  {
    id: 1,
    name: "Corte de cabello",
    duration: 60,
    price: 25,
    cost: 10,
    margin: 15,
    marginPercentage: 60,
    category: "Peluquería",
    description: "Corte de cabello para hombres y mujeres",
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
    description: "Manicura básica con esmalte",
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
    description: "Pedicura básica con esmalte",
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
    description: "Tinte de cabello completo",
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
    description: "Masaje corporal relajante",
  },
];

export function Services() {
  const [services, setServices] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    setCurrentService(null);
    setShowForm(true);
  };

  const handleEditService = (service: any) => {
    setCurrentService(service);
    setShowForm(true);
  };

  const handleDeleteService = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      setServices((prev) => prev.filter((service) => service.id !== id));
    }
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const serviceData = {
      id: currentService?.id || services.length + 1,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      description: formData.get('description') as string,
      cost: currentService?.cost || 0,
      margin: currentService?.margin || 0,
      marginPercentage: currentService?.marginPercentage || 0,
    };

    if (currentService) {
      // Update existing service
      setServices(prev =>
        prev.map(service => service.id === currentService.id ? serviceData : service)
      );
    } else {
      // Add new service
      setServices(prev => [...prev, serviceData]);
    }

    setShowForm(false);
  };

  return (
    <Layout title="Servicios">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button onClick={handleAddService} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Nuevo servicio
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Categoría</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Duración</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Precio</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Coste</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Margen</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">% Margen</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{service.name}</td>
                    <td className="px-4 py-3 text-slate-600">{service.category}</td>
                    <td className="px-4 py-3 text-slate-600">{service.duration} min</td>
                    <td className="px-4 py-3 text-slate-600">{service.price}€</td>
                    <td className="px-4 py-3 text-slate-600">{service.cost}€</td>
                    <td className="px-4 py-3 text-slate-600">{service.margin}€</td>
                    <td className="px-4 py-3 text-slate-600">{service.marginPercentage}%</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-slate-400 hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {currentService ? 'Editar servicio' : 'Nuevo servicio'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre del servicio</label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentService?.name || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Categoría</label>
                <input
                  type="text"
                  name="category"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentService?.category || ''}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Precio (€)</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full rounded-lg border border-slate-300 p-2"
                    defaultValue={currentService?.price || ''}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Duración (min)</label>
                  <input
                    type="number"
                    name="duration"
                    className="w-full rounded-lg border border-slate-300 p-2"
                    defaultValue={currentService?.duration || ''}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Descripción</label>
                <textarea
                  name="description"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  rows={3}
                  defaultValue={currentService?.description || ''}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {currentService ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </Layout>
  );
}
