import { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Modal } from '../components/ui/modal';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';

// Datos de ejemplo para clientes
const mockClients = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890", lastVisit: "2023-04-15", totalSpent: 150 },
  { id: 2, name: "María López", email: "maria@example.com", phone: "123-456-7891", lastVisit: "2023-04-20", totalSpent: 200 },
  { id: 3, name: "Carlos Gómez", email: "carlos@example.com", phone: "123-456-7892", lastVisit: "2023-04-25", totalSpent: 100 },
  { id: 4, name: "Ana Martínez", email: "ana@example.com", phone: "123-456-7893", lastVisit: "2023-04-30", totalSpent: 300 },
  { id: 5, name: "Pedro Sánchez", email: "pedro@example.com", phone: "123-456-7894", lastVisit: "2023-05-01", totalSpent: 250 },
];

export function Clients() {
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

  return (
    <Layout title="Clientes">
      <div style={{marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{position: 'relative', width: '250px'}}>
          <Search style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8'}} />
          <input
            type="text"
            placeholder="Buscar clientes..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddClient}
          className="btn btn-primary"
          style={{display: 'flex', alignItems: 'center', gap: '4px'}}
        >
          <Plus style={{width: '16px', height: '16px'}} /> Nuevo cliente
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px'}}>
        {filteredClients.map(client => (
          <div key={client.id} className="card" style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '16px'}}>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: 'bold'}}>{client.name}</h3>
                <div style={{marginTop: '8px'}}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                    <Phone style={{marginRight: '8px', width: '16px', height: '16px'}} /> {client.phone}
                  </div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <Mail style={{marginRight: '8px', width: '16px', height: '16px'}} /> {client.email}
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={() => handleEditClient(client)}
                  style={{
                    borderRadius: '50%',
                    padding: '4px',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <Edit style={{width: '16px', height: '16px'}} />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  style={{
                    borderRadius: '50%',
                    padding: '4px',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 style={{width: '16px', height: '16px'}} />
                </button>
              </div>
            </div>
            <div style={{marginTop: 'auto', borderTop: '1px solid #e2e8f0', padding: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px'}}>
                <span style={{color: '#64748b'}}>Última visita:</span>
                <span>{client.lastVisit}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                <span style={{color: '#64748b'}}>Total gastado:</span>
                <span style={{fontWeight: '500'}}>{client.totalSpent}€</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div style={{marginTop: '32px', textAlign: 'center'}}>
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
                notes: formData.get('notes') as string,
                lastVisit: currentClient?.lastVisit || 'Nunca',
                totalSpent: currentClient?.totalSpent || 0,
                avatar: currentClient?.avatar || `https://i.pravatar.cc/150?img=${clients.length + 1}`
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
                <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500'}}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  defaultValue={currentClient?.name || ''}
                  required
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500'}}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  defaultValue={currentClient?.email || ''}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500'}}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  defaultValue={currentClient?.phone || ''}
                  required
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500'}}>
                  Notas
                </label>
                <textarea
                  name="notes"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    minHeight: '80px'
                  }}
                  defaultValue={currentClient?.notes || ''}
                ></textarea>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px'}}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentClient ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
      </Modal>
    </Layout>
  );
}
