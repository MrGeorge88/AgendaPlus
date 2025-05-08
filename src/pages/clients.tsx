import { useState } from "react";
import { Layout } from "../components/layout/layout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

// Mock data for clients
const mockClients = [
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

export function Clients() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const handleDeleteClient = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      setClients((prev) => prev.filter((client) => client.id !== id));
    }
  };

  return (
    <Layout title="Clientes">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Nuevo cliente
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Teléfono</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Última visita</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Total gastado</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Citas</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{client.name}</td>
                    <td className="px-4 py-3 text-slate-600">{client.email}</td>
                    <td className="px-4 py-3 text-slate-600">{client.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{client.lastVisit}</td>
                    <td className="px-4 py-3 text-slate-600">{client.totalSpent}€</td>
                    <td className="px-4 py-3 text-slate-600">{client.appointmentsCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="text-slate-400 hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => handleDeleteClient(client.id)}
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
    </Layout>
  );
}
