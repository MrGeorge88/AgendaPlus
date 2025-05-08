import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Modal } from '../../components/ui/modal';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';

// Datos de ejemplo para clientes
const mockClients = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890", lastVisit: "2023-04-15", totalSpent: 150 },
  { id: 2, name: "María López", email: "maria@example.com", phone: "123-456-7891", lastVisit: "2023-04-20", totalSpent: 200 },
  { id: 3, name: "Carlos Rodríguez", email: "carlos@example.com", phone: "123-456-7892", lastVisit: "2023-04-22", totalSpent: 175 },
  { id: 4, name: "Ana Martínez", email: "ana@example.com", phone: "123-456-7893", lastVisit: "2023-04-25", totalSpent: 120 },
  { id: 5, name: "Pedro Sánchez", email: "pedro@example.com", phone: "123-456-7894", lastVisit: "2023-04-28", totalSpent: 90 },
];

export function ClientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(mockClients);
  const [showForm, setShowForm] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleAddClient = () => {
    setCurrentClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client: any) => {
    setCurrentClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddClient} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Nuevo cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map(client => (
          <Card key={client.id} className="flex flex-col">
            <div className="flex items-start justify-between p-4">
              <div>
                <h3 className="text-lg font-bold">{client.name}</h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-slate-500">
                    <Mail className="mr-2 h-4 w-4" /> {client.email}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Phone className="mr-2 h-4 w-4" /> {client.phone}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClient(client)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="rounded-full p-1 text-slate-400 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-auto border-t p-4">
              <div className="flex justify-between">
                <div className="text-sm text-slate-500">
                  Última visita: {formatDate(client.lastVisit)}
                </div>
                <div className="font-medium">
                  Total: {client.totalSpent}€
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="mt-8 text-center">
          <p style={{color: '#64748b'}}>No se encontraron clientes que coincidan con la búsqueda.</p>
        </div>
      )}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={currentClient ? 'Editar cliente' : 'Nuevo cliente'}
      >
        <form style={{display: 'flex', flexDirection: 'column', gap: '16px'}} onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          const clientData = {
            id: currentClient?.id || clients.length + 1,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            lastVisit: currentClient?.lastVisit || new Date().toISOString().split('T')[0],
            totalSpent: currentClient?.totalSpent || 0
          };

          if (currentClient) {
            // Update existing client
            setClients(prev =>
              prev.map(client => client.id === currentClient.id ? clientData : client)
            );
          } else {
            // Add new client
            setClients(prev => [...prev, clientData]);
          }

          setShowForm(false);
        }}>
          <div>
            <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Nombre completo</label>
            <input
              type="text"
              name="name"
              style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px'}}
              defaultValue={currentClient?.name || ''}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Email</label>
            <input
              type="email"
              name="email"
              style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px'}}
              defaultValue={currentClient?.email || ''}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>Teléfono</label>
            <input
              type="tel"
              name="phone"
              style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px'}}
              defaultValue={currentClient?.phone || ''}
              required
            />
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px'}}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
              style={{padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white'}}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{padding: '8px 16px', borderRadius: '8px', background: '#4f46e5', color: 'white'}}>
              {currentClient ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
