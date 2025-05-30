import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Modal } from '../components/ui/modal';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { useLanguage } from '../contexts/language-context';
import { clientsService, Client } from '../services/clients';
import { useAsyncList } from '../hooks/useAsyncState';
import { useCrudNotifications } from '../hooks/useNotifications';
import { ClientListSkeleton } from '../components/ui/skeleton';
import { ComponentErrorBoundary, DataErrorFallback } from '../components/ui/error-boundary';
import { EmptyClients, EmptySearchResults, useEmptyState } from '../components/ui/empty-state';

export function Clients() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  // Usar nuestros hooks personalizados
  const {
    items: clients,
    loading,
    error,
    execute: loadClients,
    addItem: addClient,
    updateItem: updateClient,
    removeItem: removeClient
  } = useAsyncList<Client>([]);

  const { executeWithNotification } = useCrudNotifications('Cliente');

  // Cargar datos de clientes
  useEffect(() => {
    if (user) {
      loadClients(() => clientsService.getClients(user.id));
    }
  }, [user, loadClients]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleAddClient = () => {
    setCurrentClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (id: string) => {
    const client = clients.find(c => c.id === id);
    if (confirm(t('clients.deleteConfirm'))) {
      try {
        await executeWithNotification(
          () => clientsService.deleteClient(id),
          'eliminar',
          client?.name
        );
        removeClient(id);
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
    }
  };

  // Determinar qué estado vacío mostrar
  const emptyState = useEmptyState(filteredClients, loading, error, searchTerm);

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (user) {
        const clientData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          notes: formData.get('notes') as string,
          userId: user.id
        };

        let result;
        if (currentClient) {
          // Actualizar cliente existente
          result = await executeWithNotification(
            () => clientsService.updateClient({
              ...clientData,
              id: currentClient.id,
              lastVisit: currentClient.lastVisit,
              totalSpent: currentClient.totalSpent
            }),
            'actualizar',
            clientData.name
          );
          updateClient(currentClient.id, result);
        } else {
          // Añadir nuevo cliente
          result = await executeWithNotification(
            () => clientsService.createClient(clientData, user.id),
            'crear',
            clientData.name
          );
          addClient(result);
        }

        setShowForm(false);
      }
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      // El error ya se maneja en executeWithNotification
    }
  };

  return (
    <Layout title="Clientes">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('clients.searchPlaceholder')}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddClient} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> {t('clients.newClient')}
        </Button>
      </div>

      <ComponentErrorBoundary componentName="Lista de Clientes">
        {loading ? (
          <ClientListSkeleton count={6} />
        ) : error ? (
          <DataErrorFallback
            error={new Error(error)}
            onRetry={() => user && loadClients(() => clientsService.getClients(user.id))}
            title="Error al cargar clientes"
          />
        ) : emptyState === 'empty' ? (
          <EmptyClients onAddClient={handleAddClient} />
        ) : emptyState === 'search' ? (
          <EmptySearchResults
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
            onCreateNew={handleAddClient}
            entityName="cliente"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map(client => (
              <Card key={client.id} className="flex flex-col">
                <div className="flex items-start justify-between p-4">
                  <div>
                    <h3 className="text-lg font-bold">{client.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-slate-500">
                        <Phone className="mr-2 h-4 w-4" /> {client.phone}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Mail className="mr-2 h-4 w-4" /> {client.email}
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
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('clients.lastVisit')}:</span>
                      <span>{client.lastVisit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('clients.totalSpent')}:</span>
                      <span className="font-medium">{client.totalSpent}€</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ComponentErrorBoundary>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={currentClient ? t('clients.editClient') : t('clients.newClient')}
      >
            <form className="space-y-4" onSubmit={handleSubmitForm}>
              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.name')}</label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentClient?.name || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.email')}</label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentClient?.email || ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentClient?.phone || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.notes')}</label>
                <textarea
                  name="notes"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  rows={4}
                  defaultValue={currentClient?.notes || ''}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {currentClient ? t('common.update') : t('common.save')}
                </Button>
              </div>
            </form>
      </Modal>
    </Layout>
  );
}
